
/**
 * Module dependencies.
 */
var assert = require('assert'),
    express = require('express'),
    should = require('should'),
    jade = require('jade'),
    Resource = require('express-resource'),
    Controller = require('../');

module.exports = {
  'test app.resource.controller()': function(){
    var app = express.createServer();    
    var controller = app.controller('forums', require('./fixtures/forums_controller'));
    
    assert.response(app,
      { url: '/forums' },
      { body: 'forum index' });

    assert.response(app,
      { url: '/forums/new' },
      { body: 'new forum' });

    assert.response(app,
      { url: '/forums', method: 'POST' },
      { body: 'create forum' });

    assert.response(app,
      { url: '/forums/5' },
      { body: 'show forum 5' });

    assert.response(app,
      { url: '/forums/5/edit' },
      { body: 'edit forum 5' });

    assert.response(app,
      { url: '/forums/5', method: 'PUT' },
      { body: 'update forum 5' });

    assert.response(app,
      { url: '/forums/5', method: 'DELETE' },
      { body: 'destroy forum 5' });
      
    // Custom functions
    assert.response(app,
      { url: '/forums/5/moderate' },
      { body: 'moderate forum 5' });
      
    assert.response(app,
      { url: '/forums/design' },
      { body: 'design forums' });      
  },
  'test local action variables': function(){
    var app = express.createServer();    
    var controller = app.controller('users', require('./fixtures/users_controller'));

    // calls this.users_path()
    assert.response(app,
      { url: '/users/1/login' },
      { body: '/users' });
  },
  'test default view and locals': function(){
    var app = express.createServer();
    var controller = app.controller('users', require('./fixtures/users_controller'));
    
    app.configure(function() {
      app.set('views', process.cwd() + '/test/fixtures/views');
      app.set('view engine', 'jade');
    });
    
    assert.response(app,
      { url: '/users' },
      { body: 'index view soho' });
  },
  'test custom relative view': function(){
    var app = express.createServer();    
    var controller = app.controller('users', require('./fixtures/users_controller'));
    
    app.configure(function() {
      app.set('views', process.cwd() + '/test/fixtures/views');
      app.set('view engine', 'jade');
    });
    
    assert.response(app,
      { url: '/users/logout' },
      { body: 'relative view' });
  },
  'test custom absolute view': function(){
    var app = express.createServer();    
    var controller = app.controller('users', require('./fixtures/users_controller'));
    
    app.configure(function() {
      app.set('views', process.cwd() + '/test/fixtures/views');
      app.set('view engine', 'jade');
    });
    
    assert.response(app,
      { url: '/users/1' },
      { body: 'absolute view' });
  },
};