/**
 * Producer for the DPIC data set.
 */

require('../../../util.js');
util.require('cau.framework.Producer');

util.provide('dab.data.producers.Dpic');



dab.data.producers.Dpic = function (req, dataStore) {
  dab.data.producers.Dpic.base(this, 'constructor', req, dataStore);
  this.data_ = this.dataStore_.getDpicData();
}
util.inherits(dab.data.producers.Dpic, cau.framework.Producer);


dab.data.producers.Dpic.prototype.get = function () {
  return this.data_;
};
