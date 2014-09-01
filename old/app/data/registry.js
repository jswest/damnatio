/**
 * Registers bindings.
 */

require('../../util.js');
util.require('cau.framework.Registry');
util.require('dab.data.producers.Espy');
util.require('dab.data.producers.Gss');
util.require('dab.data.Store');

util.provide('dab.data.Registry');



/**
 * Ctor.
 */
dab.data.Registry = function(opt_dataStore) {
  dab.data.Registry.base(this, 'constructor', opt_dataStore);
  this.dataStore_ = opt_dataStore || new dab.data.Store();
}
util.inherits(dab.data.Registry, cau.framework.Registry);


/**
 * Configure all the data bindings.
 */
dab.data.Registry.prototype.configure = function() {
  this.bind('espy').to(dab.data.producers.Espy);
  this.bind('gss').to(dab.data.producers.Gss);
}