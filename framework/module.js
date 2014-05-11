/**
 * Decided against using this class - too much abstraction. But leaving it here
 * for now because it contains some good documentation of what my thinking was.
 */

/**
 * Static object which exposes a factory method for a particular Producer. The
 * factory pattern is used here because a Producer may need various other
 * objects and pieces of data from the request. The Module is meant to hide all
 * of that and expose a single interface through which data can be produced.
 *
 * Modules can also be used as abstract ways to group data. So you could have
 * module that just instantiates and calls a single producer, but you could also
 * have one that aggregates many producers.
 */

require('../util.js');

util.provide('cau.framework.ProducerModule');

/**
 * Constructor should take a request object, and maybe a context object, a data
 * store.
 */
cau.framework.ProducerModule = function(dataStore, request, opt_context) {
  // Configuration goes here.
};
