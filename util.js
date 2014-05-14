/**
 * Useful functions. This is basically a catchall for one-offs. It will be
 * included everywhere. This is not a design pattern, it's a convenience.
 */


// TODO: This is symlinked to from public. This is a dirrty hack and should be
// killed with fire. That should go when we write a grunt to task to build the
// client code.

// Intentional globals.
_ = require('./lib/underscore.js'); // This doesn't belong here.
util = {};

// Manifest file that describes where every class is located relative to the
// root of the project.
var MANIFEST_LOCATION = './manifest.js';
var FILE_MANIFEST = _.invert(require(MANIFEST_LOCATION));


/**
 * Creates a namespace in the global scope. Use it at the beginning of a class
 * definition to ensure that the namespace (object) exists. Also serves as con-
 * venient documentation for the class name/namespace if place at the beginning
 * of the file.
 */
util.provide = function(namespace) {
  var intermediateObjectNames = namespace.split('.');
  var currentObject = global || window;
  _.each(intermediateObjectNames, function(nextObject) {
    if (!_.isObject(currentObject[nextObject])) {
      currentObject = currentObject[nextObject] = {};
    }
  });
};


/**
 * Takes a class or namespace, finds the file it is located in (according to the
 * file manifest) and requires that file.
 */
util.require = function(className) {
  if (!FILE_MANIFEST[className]) {
    throw new Error(
        'Class ' + className + ' not found. Regenerate the manifest?');
  }

  return require(FILE_MANIFEST[className]);
};


/**
 * Sets up an inheritance chain. Lifted from closure's goog.inherits.
 */
util.inherits = function(subClass, superClass) {
  // Define a dummy ctor.
  function tempCtor() {};
  // Set the proto of that to be the super proto.
  tempCtor.prototype = superClass.prototype;
  // Save the superClass so it is accessible later.
  subClass.superClass_ = superClass.prototype;
  // Set the subClass's proto to be a new object (that has the super proto).
  subClass.prototype = new tempCtor();
  // Now cleanup the constructor property.
  subClass.prototype.constructor = subClass;

  subClass.base = function(me, methodName, var_args) {
    var args = Array.prototype.slice.call(arguments, 2);
    return superClass.prototype[methodName].apply(me, args);
  };
};


/**
 * Takes a method name and creates a function that throws an error explainging
 * that that method hasn't been implemented yet.
 */
util.abstractMethod = function(opt_methodName) {
  var methodName = opt_methodName || "Abstract method";
  return function() {
    throw new Error(methodName + " not yet implemented.");
  }
};


/**
 * Instantiate an arbitrary class with no parameters. Kind of a totally generic
 * factory. Helps avoid the common problems with 'new'.
 */
util.createInstance = function(constructor) {
  return new constructor();
};


/**
 * Turns underscores into spaces, capitalizes all words.
 */
util.titleize = function(string) {
  string = string.replace(/_/g, ' ');
  return _.map(string.split(' '), function(word) {
    return word[0].toUpperCase() + word.slice(1);
  }).join(' ');
};


/**
 * Asserts that the parameter is truthy.
 */
util.assert = function(obj, opt_message) {
  var message = opt_message || obj + " is not truthy";
  return obj || throw new Error(message);
};

module.exports = util;