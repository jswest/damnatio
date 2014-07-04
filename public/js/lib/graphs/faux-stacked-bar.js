/**
 * Represents a graph that has unique rects for every data point
 * controlled by a simple menu.
 */
util.provide('DAB.graphs.FauxStackedBar');



DAB.graphs.FauxStackedBar = function (options) {
  options = options || {};
  // Super constructor does all the work.
  DAB.graphs.FauxStackedBar.base(this, 'constructor', options);

  this.schema_ = options.schema;
  if (!_.isObject(this.schema_)) {
    throw new Error('You must pass in a schema to FauxStackedBar.');
  }
  this.segments_ = _.keys(this.schema_);
  this.initialSegment_ = options.initialSegment || this.segments_[0];
  this.currentSegment_ = this.initialSegment_;

  this.colorScale_     = options.colorScale_ || d3.scale.category20();
  this.durations_      = options.durations_ || {
    "flatten": 500,
    "reorder": 100,
    "leaven": 500
  };
};
util.inherits(DAB.graphs.FauxStackedBar, DAB.Graph);


/**
 * Called when the data is fully loaded.
 */
DAB.graphs.FauxStackedBar.prototype.renderData = function () {
  this.createGraph_();
  this.bindControls_();
};


/**
 * Called when the containing section is rendered.
 */
DAB.graphs.FauxStackedBar.prototype.render = function () {
  DAB.graphs.FauxStackedBar.base(this, 'render');

  this.renderControls_();
  this.renderKey_();
};


/**
 * Sort the data by the position of its value for the current segment in the
 * schema's list of values.
 */
DAB.graphs.FauxStackedBar.prototype.sortDataByCurrentSegment_ = function () {
  this.data_ = _.sortBy(this.data_, function(value) {
    return _.indexOf(
        this.schema_[this.currentSegment_].values,
        value[this.currentSegment_]);
  }, this);
};


DAB.graphs.FauxStackedBar.prototype.renderControls_ = function () {
  this.element_.append('<ul class="controls"></ul>');
  var controls = this.element_.find('.controls');
  var sharedClass = 'control';

  // iterate over the segments, and add each one to the controls menu.
  _.each(this.segments_, function (segment) {
    var classes = this.schema_[segment].key === this.initialSegment_ ?
        sharedClass + ' current-segment' :
        sharedClass;
    controls.append(
        '<li class="' + classes + '" data-segment="' + segment + '">' +
          util.titleize(segment) +
        '</li>');
  }, this);
};


DAB.graphs.FauxStackedBar.prototype.bindControls_ = function () {
  var that = this;
  var controls = this.element_.find('ul.controls');
  var control = controls.find('.control');
  controls.on('click', function (e) {
    $(this).toggle('clicked');
  });
  control.on('click', function (e) {
    if (!$(this).hasClass('current-segment')) {
      control.removeClass('current-segment');
      $(this).addClass('current-segment');
      that.currentSegment_ = $(this).data('segment');
      that.updateGraph_();
    }
  });
};


DAB.graphs.FauxStackedBar.prototype.renderKey_ = function () {
  this.element_.append('<dl class="interactive-key"></dl>');
  var interactiveKey = this.element_.find('.interactive-key');

  // Iterate over the current segment's values and add them and their color to
  // the keys <dl>.
  _.each(this.schema_[this.currentSegment_].values, function (value, i) {
    interactiveKey.append(
        '<dl class="key-color-block" ' +
        'style="background-color:' + this.colorScale_(i) + '">' +
        '</dl>' + '<dt class="key-value-name">' + value + '</dt>');
  }, this);
};


// TODO this should be shared somewhere
DAB.graphs.FauxStackedBar.prototype.getYear_ = function (date) {
  // getFullYear returns a number, which Date interprets as milliseconds since
  // beginning of epoch, so we cast it to a string and it is interpreted as a
  // year.
  return new Date("" + (new Date(date)).getFullYear());
};


DAB.graphs.FauxStackedBar.prototype.initializeRects_ = function () {
  this.sortDataByCurrentSegment_();
  this.rects = this.svg_.selectAll('rect')
      .data(this.data_)
      .enter()
      .append('rect')
      .attr(
          'width',
          this.xScale_(new Date('2014')) - this.xScale_(new Date('2013')))
      .attr('height', this.yScale_(0) - this.yScale_(1));
};


DAB.graphs.FauxStackedBar.prototype.flattenGraph_ = function (needsTransition) {
  var transitionDuration = needsTransition ? this.durations_.flatten : 0;
  this.rects
      .transition()
      .duration(transitionDuration)
      .attr('transform', _.bind(function (d, i) {
        var xpos = this.xScale_(this.getYear_(d.date));
        var ypos = this.height_ - this.padding_.bottom;
        return 'translate(' + xpos + ',' + ypos + ')';
      }, this));
};


DAB.graphs.FauxStackedBar.prototype.colorGraph_ = function (needsTransition) {
  var transitionDuration = needsTransition ? this.durations_.reorder : 0;
  var transitionDelay    = needsTransition ? this.durations_.flatten : 0;
  this.rects
      .transition()
      .delay(transitionDelay)
      .duration(transitionDuration)
      .style('fill', _.bind(function (d, i) {
        return this.colorScale_(_.indexOf(
          this.schema_[this.currentSegment_].values,
          d[this.currentSegment_]));
      }, this));
};


DAB.graphs.FauxStackedBar.prototype.buildGraph_ = function (needsDelay) {
  var transitionDelay = needsDelay ?
      this.durations_.flatten + this.durations_.reorder :
      0;
  this.flattenGraph_(needsDelay);
  this.colorGraph_(needsDelay);
  var indices = {};
  this.rects
      .transition()
      .delay(transitionDelay)
      .duration(this.durations_.leaven)
      .attr('transform', _.bind(function (d, i) {
        var date = this.getYear_(d.date);
        indices[date] = indices[date] || 0;
        indices[date]++;
        var xpos = this.xScale_(date);
        var ypos = this.yScale_(indices[date]);
        return 'translate(' + xpos + ',' + ypos + ')';
      }, this));
};


DAB.graphs.FauxStackedBar.prototype.createGraph_ = function () {
  this.initializeRects_();
  this.buildGraph_(false);
};


DAB.graphs.FauxStackedBar.prototype.updateGraph_ = function () {
  this.buildGraph_(true);
}

// TODO add a handler for hover that shows the footer data about each execution
// TODO add a handler for click that shows a model about that execution
