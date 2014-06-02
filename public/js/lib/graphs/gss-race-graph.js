/**
 * Graph containing the GSS data broken down by race.
 */
util.provide('DAB.graphs.GssRaceGraph');



DAB.graphs.GssRaceGraph = function (options) {
  options = options || {};
  options.menuNicename = 'Race';
  options.xDomain = [new Date('1974-01-01'), new Date('2012-01-01')];
  options.yDomain = [100, 0];
  options.initialSlug = 'white';
  options.dataKey = 'gss';
  DAB.graphs.GssRaceGraph.base(this, 'constructor', options)
};
util.inherits(DAB.graphs.GssRaceGraph, DAB.graphs.Multiline);
