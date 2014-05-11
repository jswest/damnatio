require('../util.js');

util.provide('cau.framework.Server');



/**
 * Takes a Registry and provides a simple interface for responding to requests.
 */
cau.framework.Server = function(registry) {
  this.registry_ = registry;
};


/**
 * Takes a request, extracts the key, checks to see if it is bound in the
 * registry, responds with the data if it is, otherwise returns 404;
 */
 cau.framework.Server.prototype.get = function(req, res) {
  var key = req.query.key;
  if (this.registry_.hasKey(key)) {
    var data = this.registry_.getData(key, req);
    res.send(data, 200);
  } else {
    res.send("No data registered for the key " + key, 404);
  }
 }
