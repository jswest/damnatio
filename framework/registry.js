/**
 * Registry of bindings of key to data module.
 */

require('../util.js');

util.provide('cau.framework.Registry');



/**
 * Data keys are register to producers in the configure method. When getData is
 * is called for a producer's key, it is instantiated with its factory method,
 * and its result is returned.
 */
cau.framework.Registry = function(opt_dataStore) {
  this.bindings_ = {};
  this.configure();
  this.dataStore_ = opt_dataStore;
};


/**
 * Whether this key has been registered.
 */
cau.framework.Registry.prototype.hasKey = function(key) {
  return _.has(this.bindings_, key);
};


/**
 * This is where all the binding should be done. Must be overridden.
 */
cau.framework.Registry.prototype.configure = util.abstractMethod('Configure');


/**
 * This is where the work is done.
 */
cau.framework.Registry.prototype.getData = function(key, request) {
  var producer = this.getInstance_(key, request);
  return producer.get();
};


/**
 * Binds a key to a class.
 */
cau.framework.Registry.prototype.bindTo = function(key, classObj) {
  this.bindings_[key] = classObj;
};


/**
 * Convienent syntax for bindTo: this.bind('key').to(some.Class);
 */
cau.framework.Registry.prototype.bind = function(key) {
  return {
    to: _.bind(this.bindTo, this, key) // Takes one more param: classObj
  }
};


/**
 * Retrieves a class and instantiates it.
 */
cau.framework.Registry.prototype.getInstance_ = function(key, request) {
  var classObj = this.bindings_[key];
  return cau.framework.Producer.createProducer(
      classObj, request, this.dataStore_);
}