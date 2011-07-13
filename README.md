Consolidation of behavior and best practices for implementing controllers in express-resource.

You may want a lighter-weight controller.  The goal here is to be as lightweight as possible while
still supporting:
  * DRY URL and view helpers:
    - In your controller actions, you can use this.render() to get the default view ({view dir}/<resource>/<action>)
    - In your controller actions, you can use this.users_path() to get the path to the users object -- more on
      resourceful route generation in my fork of express-resource, hopefully to be included.  These helpers can
      also be made available in the views for total DRY nirvana.
  * Database / database model access
    - Not yet implemented
  * currentUser loading...?
    - Not yet implemented
  * Error handling
    - Call { if(this.handleError(err)) return; } in any callback where you may have an error to present output 
      to console.log in consistent way. 
  * Others as necessary.

Some things are better supported in middleware.  While this is a work in progress, it is my intention
to use custom middleware as often as appropriate to keep this lean.  The test for this will be a moving target,
let's discuss.
