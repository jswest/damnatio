/**
 * Shared graph object that should contain whatever functionality is common to
 * all graphs. This includes:
 *  - The determination of width, height of the entire graph.
 *  - The definition of scales to fit this width and height (possibly base these
 *      on the metadata that comes down from the backend?)
 *  - The creation of axes.
 *  - The creation of an svg element to hold the drawn graph.
 *  - The disposal of all data and dom elements on unload.
 *
 * The idea with this class is not to cover every possible case, but rather to
 * provide sensible defaults that can be overridden selectively to create
 * whatever precise behavior is desired.
 */
util.provide('DAB.Graph');



/**
 * Constructor should set up sensible defaults for everything and customize
 * based on the options hash.
 */
DAB.Graph = function (options) {
  this.width_   = options.width   || $(window).width();
  this.height_  = options.height  || $(window).height();
  this.padding_ = options.padding || {
    top    : 50,
    right  : 10,
    bottom : 100,
    left   : 100
  };
  this.element_ = options.element;
  this.xDomain_ = options.xDomain;
  this.yDomain_ = options.yDomain;

  // Defined as documentation.
  this.xScale_  = null;
  this.yScale_  = null;
  this.xAxis_   = null;
  this.yAxis_   = null;
  this.svg_     = null;

  // Initialize the axes.
  this.initializeXAxis_();
  this.initializeYAxis_();
};


/**
 * Render will be called automatically by the parent section when it is
 * rendered. Any initial work of setting the elements, axes, and labels should
 * be done here. Data will not be available here.
 */
DAB.Graph.prototype.render = function (opt_element) {
  this.element_ = opt_element || this.element_;

  if (!this.element_) {
    throw new Error('You must specify an element to render a Graph.');
  }

  this.renderSvg_();
  this.renderAxes_();
};


/**
 * Called when the data is loaded. This should trigger whatever actual graph
 * rendering is necessary.
 */
DAB.Graph.prototype.setData = function (data) {
  this.data_ = data;
  this.renderData();
};


/**
 * Should do the actual work of visualizing the data.
 */
DAB.Graph.prototype.renderData = util.abstractMethod('Graph#renderData');


/**
 * Return the data key that corresponds with this graph.
 */
DAB.Graph.prototype.getDataKey = util.abstractMethod('Graph#getDataKey');


/**
 * Sets the element.
 */
DAB.Graph.prototype.setElement = function (element) {
  this.element_ = element;
}

/**
 * Renders the svg element.
 * @protected
 */
DAB.Graph.prototype.renderSvg_ = function () {
  this.svg_ = d3.select(this.element_)
      .append('svg')
      .attr('width', this.width_)
      .attr('height', this.height_);
};


/**
 * Renders the axes.
 */
DAB.Graph.prototype.renderAxes_ = function () {
  this.svg_.append('g').attr('class', 'x-axis');
  this.svg_.select('g.x-axis')
    .call(this.xAxis_)
    .attr('transform', 'translate(0,' + (-this.padding_.bottom) + ')');

  this.svg_.append('g').attr('class', 'y-axis');
  this.svg_.select('g.y-axis')
    .call(this.yAxis_)
    .attr('transform', 'translate(' + (this.padding_.left) + ',0)');

};


/**
 * Initializes the x-axis.
 */
DAB.Graph.prototype.initializeXAxis_ = function () {
  if (!this.xScale_) {
    this.initializeXScale_;
  }

  this.xAxis_ = d3.svg.axis()
      .scale(this.xScale_)
      .orient('bottom')
      .ticks(10);
};


/**
 * Initializes the y-axis.
 */
DAB.Graph.prototype.initializeYAxis_ = function () {
  var padding = this.padding_;

  if (!this.yScale_) {
    this.initializeYScale_;
  }

  this.yAxis_ = d3.svg.axis()
      .scale(this.yScale_)
      .orient('left')
      .ticks(5)
      .tickSize(-this.width_ + padding.left + padding.right + padding.left);
};


/**
 * Initializes the x-scale.
 */
DAB.Graph.prototype.initializeXScale_ = function () {
  this.xScale_ = d3.time.scale()
    .domain(this.getXDomain_())
    .range(this.getXRange_());
};


/**
 * Initializes the y-scale.
 */
DAB.Graph.prototype.initializeYScale_ = function () {
  this.yScale_ = d3.scale.linear()
    .domain(this.getYDomain_())
    .range(this.getYRange_());
};


/**
 * Gets the x scale domain.
 */
// TODO: consider delaying this until the data is loaded and trying to determine
// what to do from the data (probably hard).
DAB.Graph.prototype.getXDomain_ = function () {
  if (!this.xDomain_) {
    throw new Error('You must either override Graph.getXDomain or pass in an xDomain in the settings object.');
  }

  return this.xDomain_;
};


/**
 * Gets the y scale domain.
 */
DAB.Graph.prototype.getYDomain_ = function () {
  if (!this.yDomain_) {
    throw new Error('You must either override Graph.getYDomain or pass in an yDomain in the settings object.');
  }

  return this.yDomain_;
};


/**
 * Gets the X-range, this shouldn't need to be overridden.
 */
DAB.Graph.prototype.getXRange_ = function () {
  return [
    this.padding_.left,
    this.width_ - this.padding_.left - this.padding_.right
  ];
};


/**
 * Gets the Y-range, this shouldn't need to be overridden.
 */
DAB.Graph.prototype.getYRange_ = function () {
  return [
    this.padding_.top,
    this.height_ - this.padding_.bottom
  ];
};