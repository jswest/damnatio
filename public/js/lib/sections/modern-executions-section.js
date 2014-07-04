/**
 * Section that displays a graph of gss data broken down by race.
 */
util.provide('DAB.sections.ModernExecutionsSection');



DAB.sections.ModernExecutionsSection = function (options) {
  DAB.sections.ModernExecutionsSection.base(this, 'constructor', options);
};
util.inherits(DAB.sections.ModernExecutionsSection, DAB.sections.GraphSection);


DAB.sections.ModernExecutionsSection.prototype.createGraph = function () {
  return new DAB.graphs.ModernExecutions();
};
