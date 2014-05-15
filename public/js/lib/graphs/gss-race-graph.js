/**
 * Graph containing the GSS data broken down by race.
 */
util.provide('DAB.graphs.GssRaceGraph');



DAB.graphs.GssRaceGraph = function (options) {
  DAB.graphs.GssRaceGraph.base(this, 'constructor', options)
};
util.inherits(DAB.graphs.GssRaceGraph, DAB.graphs.Multiline);


DAB.graphs.GssRaceGraph.prototype.getDataKey = function () {
  return "gss-race";
};