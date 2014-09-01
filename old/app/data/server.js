/**
 * Serves data.
 */

require('../../util.js');
util.require('cau.framework.Server');
util.require('dab.data.Registry');

util.provide('dab.data.Server');



/**
 * Responds to requests for data.
 */
dab.data.Server = function(opt_registry) {
  var registry = opt_registry || new dab.data.Registry();
  dab.data.Server.base(this, 'constructor', registry);
}
util.inherits(dab.data.Server, cau.framework.Server);
