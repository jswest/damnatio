/**
 * Loads data for the given keys and calls a callback with the data. Caching
 * layer possible.
 */
util.provide('DAB.DataService');



DAB.DataService = function () {
  this.cache_ = {};
};


/**
 * Takes a list of keys and makes a series of requests for each of those keys.
 */
// TODO: Refactor to package up into single request.
DAB.DataService.prototype.loadKeys = function (keys, callback) {
  _.each(keys, function (value) {
    if (this.cache_[value]) {
      return callback(value, this.cache_[value]);
    }

    d3.json( '/_/getridofthis?key=' + value, function (data) {
      this.cache_[value] = data;
      callback(value, data);
    });
  }, this);
};