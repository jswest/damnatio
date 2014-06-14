/**
 * Graph containing the GSS data broken down by race.
 */
util.provide('DAB.graphs.ModernExecutions');



DAB.graphs.ModernExecutions = function (options) {
  options = options || {};
  options.xDomain = [new Date('1974-01-01'), new Date('2015-01-01')];
  options.yDomain = [200, 0];
  options.dataKey = 'dpic';
  DAB.graphs.ModernExecutions.base(this, 'constructor', options)
};
util.inherits(DAB.graphs.ModernExecutions, DAB.graphs.FauxStackedBar);
