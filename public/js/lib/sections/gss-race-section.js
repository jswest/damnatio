/**
 * Section that displays a graph of gss data broken down by race.
 */
util.provide('DAB.sections.GssRaceSection');



DAB.sections.GssRaceSection = function (options) {
  DAB.sections.GssRaceSection.base(this, 'constructor', options);
};
util.inherits(DAB.sections.GssRaceSection, DAB.sections.GraphSection);


DAB.sections.GssRaceSection.prototype.createGraph = function () {
  return new DAB.graphs.GssRaceGraph();
};
