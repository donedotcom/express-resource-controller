exports.index = function(req, res){
  res.send('forum index');
};

exports.new = function(req, res){
  res.send('new forum');
};

exports.create = function(req, res){
  res.send('create forum');
};

exports.show = function(req, res){
  res.send('show forum ' + req.params.forum);
};

exports.edit = function(req, res){
  res.send('edit forum ' + req.params.forum);
};

exports.update = function(req, res){
  res.send('update forum ' + req.params.forum);
};

exports.destroy = function(req, res){
  res.send('destroy forum ' + req.params.forum);
};

exports.design = function(req, res){
  res.send('design forums');
};

exports.moderate = function(req, res){
  res.send('moderate forum ' + req.params.forum);
};

exports.customActions = {
  'design': { method: 'get', scope: 'collection' },
  'moderate': { method: 'get', scope: 'element' }
}

exports.autoload = function(id, fn){
  process.nextTick(function(){
    fn(null, { title: 'Ferrets' });
  });
};
