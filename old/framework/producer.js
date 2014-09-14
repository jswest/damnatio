/**
 * Class that produces datasets. Configurable, but (should be treated as)
 * immutable. The only job of this class is to retrieve data from a Store or
 * other Producers and aggregate, sort, page, cull, etc. to get the data into
 * a consumable state.
 */

require('../util.js');

util.provide('cau.framework.Producer');

/**
 * Constructor should take whatever context is necessary (page, sort, etc.) to
 * produce the desired data.
 */
cau.framework.Producer = function(request, dataStore) {
  // This is really sort of a standin for a proper serverContext object
  this.request_ = request;

  this.dataStore_ = dataStore;

  // Where all necessary dependencies will be loaded into.
  this.dependencies_ = {};
  this.loadDependencies();
};


/**
 * The business.
 */
cau.framework.Producer.prototype.get = util.abstractMethod();


/**
 * Returns a hash of producers that are dependencies for this one.
 * The format for this should be:
 * {
 *  varName: class
 * }
 */
cau.framework.Producer.prototype.getDependencies = function() {
  return {
    /* key: class */
  };
}


/**
 * Loads the dependencies specified in getDependencies. Probably should not be
 * overridden.
 */
cau.framework.Producer.prototype.loadDependencies = function() {
  _.each(this.getDependencies(), function(value, key) {
    this.dependencies_[key] =
        cau.framework.Producer.createProducer(value, this.request_).
        get();
  }, this);
}


/**
 * Creates a producer. Checks for a static factory (createInstance), and creates
 * it with no params if none exists.
 */
cau.framework.Producer.createProducer = function(classObj, request, dataStore) {
  if (classObj.createInstance) {
    return classObj.createInstance(request, dataStore);
  } else {
    return new classObj(request, dataStore);
  }
}


/**
 * Factory method to create an instance of the producer with whatever
 * configuration needs to be done. This is really just here as a silly
 * placeholder to show that it should be implemented on each producer.
 * This will never be called, nor overridden.
 * @param request the request object
 * @param Store the data store
 */
cau.framework.Producer.createInstance = util.abstractMethod();
