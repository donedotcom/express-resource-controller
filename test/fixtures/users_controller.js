exports.index = function(req, res){
  var locals = {
    value: 'soho'
  }
  this.render(locals);
};

exports.show = function(req, res){
  this.render(process.cwd() + '/test/fixtures/absolute_view');
};

exports.login = function(req, res){  
  res.send(this.users_path());
};

exports.logout = function(req, res){
  var locals = {
    value: 'coffee'
  }
  this.render('relative', locals);
};

exports.customActions = {
  'login': { method: 'get', scope: 'element' },
  'logout': { method: 'get', scope: 'collection' }
};
