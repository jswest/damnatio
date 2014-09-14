/**
 * Loads data and exposes accessors.
 */

require('../../util.js');
util.require('cau.framework.Store');

util.provide('dab.data.Store');



/**
 * Load the data and prepare it.
 */
dab.data.Store = function() {
  this.espyData_ = require('../../data/espy-full.json');
  this.gssData_ = require('../../data/gss-death-penalty.json');
};
util.inherits(dab.data.Store, cau.framework.Store);


/**
 * Returns Espy data.
 */
dab.data.Store.prototype.getEspyData = function() {
  return this.espyData_;
};


/**
 * Returns Gss data.
 */
dab.data.Store.prototype.getGssData = function() {
  return this.gssData_;
};