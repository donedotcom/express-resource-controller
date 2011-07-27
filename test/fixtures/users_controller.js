exports.index = function(req, res, controller){
  var locals = {
    value: 'soho'
  }
  controller.render(locals);
};

exports.show = function(req, res, controller){
  controller.render(process.cwd() + '/test/fixtures/absolute_view');
};

exports.login = function(req, res, controller){  
  res.send(controller.users_path());
};

exports.logout = function(req, res, controller){
  var locals = {
    value: 'coffee'
  }
  controller.render('relative', locals);
};

exports.customActions = {
  'login': { method: 'get', scope: 'element' },
  'logout': { method: 'get', scope: 'collection' }
};
