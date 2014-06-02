// DIRTY HACK ALERT
util = {};


/**
 * Creates a namespace in the global scope. Use it at the beginning of a class
 * definition to ensure that the namespace (object) exists. Also serves as con-
 * venient documentation for the class name/namespace if place at the beginning
 * of the file.
 */
util.provide = function(namespace) {
  var intermediateObjectNames = namespace.split('.');
  var currentObject = window;
  _.each(intermediateObjectNames, function(nextObject) {
    if (!_.isObject(currentObject[nextObject])) {
      currentObject[nextObject] = {};
    }
    currentObject = currentObject[nextObject];
  });
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
 * Turns underscores into spaces, capitalizes all words.
 */
util.titleize = function(string) {
  string = string.replace(/_/g, ' ');
  return _.map(string.split(' '), function(word) {
    return word[0].toUpperCase() + word.slice(1);
  }).join(' ');
};