/*!
 * Express - Resource - Controller
 * Copyright(c) 2011 Paul Covell <paul@done.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var express = require('express'),
    utils = require('connect').utils;
 

/**
 * Initialize a new `Controller` with the given `name`.
 *
 * @param {String} name
 * @param {Server} app
 * @api private
 */
var Controller = module.exports = function Controller(server, name, input, opts) {
  this.customActions = {};
  this.customActionParams = {};
  this.actions = {};
  this.app = server;
  this.name = name;
  
  // Handle custom configurations first
  for(var name in input) {
    var fn = input[name];
    this.createAction(name, fn);
  }
  
  if(input.autoload) {
    this.actions.load = input.autoload;
    delete input.autoload;
  }
  
  // Ensure that custom actions come first -- without this, there is a risk that
  // get /forums/:id comes before get /forums/design, for example, and you can't
  // call your custom actions.
  this.resource = this.app.resource(this.name, null);
  
  for(var name in input.customActions) {
    var action = input.customActions[name];
    this.createCustomAction(name, action.method, action.scope, input[name]);
    
    action = this.customActions[name];
    this.resource.map(action.method, action.path, action.fn);    
  }  
  
  for(var name in this.actions) {
    var action = this.actions[name];
    this.resource.mapDefaultAction(name, action); // private API
  }  

  this.resource.controller = this;  
  return this.resource;  
}

/**
 * Define the autoload function for this controller
 *
 * @param {Function} fn
 * @api public
 */
Controller.prototype.autoload = function(fn) {
  this.actions['load'] = fn;
}

/**
 * Define an action (one of the standard actions defined by Express Resource)
 *
 * @param {String} name
 * @param {Server} fn
 * @api private
 */
Controller.prototype.createAction = function(name, fn) {
  VALID_ACTIONS = ['index', 'show', 'edit', 'update', 'new', 'create', 'destroy'];
  if(VALID_ACTIONS.indexOf(name.toLowerCase()) === (-1)) {
    return;
  }
  
  this.actions[name] = this.createActionRuntime(name, fn);
}

/**
 * Define a custom action
 *
 * @param {String} name
 * @param {String} method - one of get, put, post, or delete
 * @param {String} scope - collection (operates on the whole resource as a group) or element (operates on a single resource)
 * @param {Server} fn
 * @api private
 */
Controller.prototype.createCustomAction = function(name, method, scope, fn) {
  VALID_SCOPE = ['element', 'collection'];
  VALID_METHOD = ['get', 'put', 'post', 'delete'];
  
  if(VALID_SCOPE.indexOf(scope.toLowerCase()) === (-1)) {
    console.error('Bad scope (' + scope + '), must be one of: ' + VALID_SCOPE.join(', '));
    return;
  }
  if(VALID_METHOD.indexOf(method.toLowerCase()) === (-1)) {
    console.error('Bad method (' + method + '), must be one of: ' + VALID_METHOD.join(', '));
    return;
  }
  
  this.customActions[name] = {
    path: scope === 'collection' ? '/' + name : name, // This is how Express Resource manages the scope
    method: method,
    fn: this.createActionRuntime(name, fn)
  };
}

/**
 * Create the runtime function for the action.  
 *
 * @param {String} actionName
 * @api private
 */
Controller.prototype.createActionRuntime = function(actionName, fn) {
  var errorHandler = this.createErrorHandler(actionName);
  return function(req, res) {
    // TODO: use this somehow.  createRenderFunction(res.render, actionName);
    var locals = {
      app: this.app,
      render: this.createRenderFunction(req, res, actionName),
      checkError: errorHandler,
    };
    locals = utils.merge(locals, this.app.resource.path);    
    fn.call(locals, req, res);
  }.bind(this);
}

/**
 * Create a custom render function for this action so it defaults to the right directory.
 *
 * @param {Function} originalRender
 * @param {String} actionName the action name
 * @api private
 */
Controller.prototype.createRenderFunction = function(req, res, actionName) {
  return function(view) {
    var viewName = null;
    if ('string' === typeof view) {
      viewName = (view[0] === '/') ? view : [this.name.toLowerCase(), view].join('/');
      Array.prototype.shift.call(arguments); // remove the view
    } else {
      viewName = [this.name.toLowerCase(), actionName].join('/');        
    }
    Array.prototype.unshift.call(arguments, viewName);
    res.render.apply(res, arguments);
  }.bind(this);  
}

/**
 * Create the error handler for the action.  Provides consistency for general error reporting.  
 *
 * @param {String} actionName
 * @api private
 */
Controller.prototype.createErrorHandler = function(actionName) {
  return function(err) {
    if(err) {
      console.log("ERROR: " + err);
      return true;
    }
    return false;
  }
}

/*
function runAction(self, req, res, fn) {
  if (req.session.currentUserId) {
    self.db.User.findById(req.session.currentUserId.toString(), function(err, user) {
      req.currentUser = user;
      fn.call(self, req, res);
    });
  } else {
    fn.call(self, req, res);
  }
}
*/

express.HTTPServer.prototype.controller =
express.HTTPSServer.prototype.controller = function(name, input, opts){
  return new Controller(this, name, input, opts);
}
