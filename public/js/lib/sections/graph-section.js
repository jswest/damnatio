util.provide('DAB.sections.GraphSection');

/**
 * A section that contains a graph.
 */
DAB.sections.GraphSection = function (options) {
  options = options || {};
  DAB.sections.GraphSection.base(this, 'constructor', options);
  this.graph_ = this.createGraph();
};
util.inherits(DAB.sections.GraphSection, DAB.Section);


/**
 * Create an element for the graph and then render it.
 * @override
 */
DAB.sections.GraphSection.prototype.render = function () {
  var containerClass = this.getContainerClass_();
  this.element_.append('<div class="' + containerClass + '"></div>');
  var graphEl = this.element_.find('.' + containerClass);
  this.graph_.setElement(graphEl);
  this.graph_.render();
};


/**
 * Call setData on the graph when data is loaded.
 * @override
 */
DAB.sections.GraphSection.prototype.onDataLoad = function (data) {
  this.graph_.setData(data);
};


/**
 * Delegate the data key to the graph's key.
 * @override
 */
DAB.sections.GraphSection.prototype.getDataKey = function () {
  return this.graph_.getDataKey();
};


/**
 * Instantiate a new graph. Must be overridden.
 */
DAB.sections.GraphSection.prototype.createGraph =
    util.abstractMethod('GraphSection#createGraph');


/**
 * Returns the class that should be applied to the graph container.
 */
DAB.sections.GraphSection.prototype.getContainerClass_ = function () {
  return "graph-container";
};
