Intro
--------
Consolidation of behavior and best practices for implementing controllers in express-resource.

You may want a lighter-weight controller.  The goal here is to be as lightweight as possible while
still supporting:

  * DRY URL and view helpers:
    - In your controller actions, you can use controller.render() to get the default view ({view dir}/<resource>/<action>)
    - In your controller actions, you can use controller.users_path() to get the path to the users object -- more on
      resourceful route generation in my fork of express-resource, hopefully to be included.  These helpers can
      also be made available in the views for total DRY nirvana.
  * Database / database model access
		- You can make local variables available to your views by passing an object that will be added to the controller
		  parameter when the action is called.  See the example below for usage.  
    - Not yet implemented
  * currentUser loading...?
    - Not yet implemented
  * Error handling
    - Call { if(controller.handleError(err)) return; } in any callback where you may have an error to present output 
      to console.log in consistent way. 
  * Others as necessary.

Some things are better supported in middleware.  While this is a work in progress, it is my intention
to use custom middleware as often as appropriate to keep this lean.  The test for this will be a moving target,
let's discuss.

Updates
-------
27 July 2011: Replaced 'this' with a 'controller' parameter the method to reduce hassle with anonymous helper functions that change the context. (No longer need to use function() { ... }.bind(this)).  Now you use controller.users_path(), for example.  A
27 July 2011: Updated database model access in Readme.

Example
--------


### configuration

In your server.js or other express.createServer() file:

```javascript
// this function will load all controllers from <server>/app/controllers, assigning each a name
// from the pattern <name>_controller.js. 

require('express-resource-controller');

// ...

function loadControllers(database) {
  var controllers = {};
  var path = __dirname + '/app/controllers';
	var locals = {db: database};

  fs.readdirSync(path).forEach(function(filename) {
    var name = filename.split('_');
    if (name.length > 1) {
      // Skip controllers.js
      var name = name[0],
          controller = require([path, filename].join('/')); // app.controller calls app.resource();
      controllers[name] = app.controller(name, controller, locals);
    }
  });
  controllers.forums.add(controllers.threads);  // Nested resources  
}
```

### users_controller.js
  
```javascript
var db = require('../../db'); // load your DB models -- TODO: can this be pushed into controller somehow?

exports.index = function(req, res, controller){
  db.User.find({}, function(err, records) {
    /**
     * (Note 1)
     */
    if (controller.handleError(err)) {
      this.flash('warn', 'Please try again later.');
      /**
       * (Note 2)
       */
      res.redirect(controller.users_path());
    }
    /**
     * (Note 3)
     */
    controller.render({users: records});  
  });
};

/**
 * Note 1: controller.handleError() provides a consistent way to test and log callback errors, and will return true
 * if (err) so you can handle further if desired.
 *
 * Note 2: Compare controller.users_path() with '/users'.  Ok, simple example, but compare 
 * controller.edit_forum_thread_path(forum, thread) with '/forums/' + forum._id + '/threads/' + thread.id + '/edit'.
 * DRYer?  At least less prone to error.
 *
 * Note 3: Compare controller.render(locals) with res.render('users/index').  We already know we're the users controller
 * and the index action, right?  Provides reasonable defaults: load from 'views/users/index'.   You can still call 
 * with your normal res.render() arguments: res.render('users/index', {layout: null}); for full control.  
 * Bonus: if you provide with a relative pathname, it assumes the controller part:
 * res.render('edit');
 * will look for 'views/users/edit'.
 */ 

exports.login = function(req, res, controller) {
  req.session.currentUserId = req.user._id;  // Loaded by autoload
  res.redirect(controller.forums_path());
};

exports.logout = function(req, res, controller) {
  req.session.currentUserId = null;
  res.redirect(controller.forums_path()); 
};

/**
 * (Note 4)
 */
exports.create = function(req, res, controller){
  var user = controller.db.User(req.body); 
  user.save(function(err) {
    controller.handleError(err);
    req.session.currentUserId = user._id;
    res.redirect(controller.forums_path());
  });
};

exports.destroy = function(req, res){
  req.user.remove();
  res.redirect(controller.forums_path());
};

exports.autoload = function(id, callback) {
  db.User.findById(id, callback);
};

/**
 * (Note 5)
 */
exports.customActions = {
  'login': { method: 'get', scope: 'element' },     // /users/1/login
  'logout': { method: 'get', scope: 'collection' } // /users/logout
};

/**
 * Note 4: controller.db is available because we passed it in app.controller(..., locals).
 *
 * Note 5: Custom actions are automatically added to the route as long as you declare them here.
 * Custom actions are always added *before* basic actions, so that you always get 
 * /users/logout ==> logout() instead of /users/logout ==> show({id: 'logout'}).
 * Otherwise routes are added in the order you provide, so be aware of this possible problem.
 */

```

### views

If you want to use the route helpers (users_path(), etc) in your views you can include this helper file:

In server.js:

```javascript
// https://gist.github.com/1078292
app.resource.dynamicHelpers = require(process.cwd() + '/app/helpers/resourceful_urls');
```

In your view (example in jade):

```jade
li= a(href=users_path()) Users
```

* Note, this requires a version of express-resource with these paths.  We are working on some kind of official version of this.
