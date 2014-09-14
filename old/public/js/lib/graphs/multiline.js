/**
 * Represents a graph that has multiple lines that can be graphed in parallel
 * controlled by a simple menu.
 */
util.provide('DAB.graphs.Multiline');



/**
 *
 */
DAB.graphs.Multiline = function (options) {
  options = options || {};
  // Super constructor does all the work.
  DAB.graphs.Multiline.base(this, 'constructor', options);

  this.menuNicename_  = options.menuNicename;
  this.colorScale_    = options.colorScale_ || d3.scale.category20();
  this.initialSlug_   = options.initialSlug;
  this.data_          = null;
  this.dummyData_     = null;
  this.line_          = null;
  this.initializeLine_();
};
util.inherits(DAB.graphs.Multiline, DAB.Graph);


/**
 * Render the graph.
 */
DAB.graphs.Multiline.prototype.renderData = function () {
  this.renderMenu_();
  this.bindMenu_();
  this.initializeDummyData_();
  _.each(_.keys(this.data_), function (slug) {
    this.createPath_(slug, this.dummyData_);
  }, this);

  // Update the initial path to use real data, if one is specified.
  if (this.getInitialSlug_()) {
    this.updatePath_(
        this.getInitialSlug_(),
        this.data_[this.getInitialSlug_()]);
  }
};


/**
 * Render the menu. To be called only after the data has been loaded.
 */
DAB.graphs.Multiline.prototype.renderMenu_ = function () {
  this.element_.append('<ul class="menu clicked"><li class="control">' + this.menuNicename_ + '</li></ul>');
  var menu = this.element_.find('.menu');
  var itemNames = _.keys(this.data_);
  _.each(itemNames, _.bind(function (itemName, index) {
    menu.append(this.menuItem_(itemName, index));
  }, this));
};


/**
 * Bind the menu events. To be called only after the menu has been rendered.
 */
DAB.graphs.Multiline.prototype.bindMenu_ = function () {
  var menu = this.element_.find('.menu');
  var that = this;
  menu.find('li').on('click', function () {
    var li = $(this);
    var slug = li.data('slug');
    if (li.hasClass('control')) {
      $('.menu').toggleClass('clicked')
    } else {
      if (li.hasClass('selected')) {
        that.updatePath_(slug, that.dummyData_ );
      } else {
        that.updatePath_(slug, that.data_[slug]);
      }
      li.toggleClass('selected');
    }
  });
};


/**
 * Menu list item template.
 */
DAB.graphs.Multiline.prototype.menuItem_ = function (name, index) {
  return '<li class="menu-item" data-slug=' + name + '>' +
    '<div class="colorblock" style="background-color:' + this.colorScale_( index ) + '"></div>' +
    '<div class="name">' + util.titleize(name) + '</div>'
  '</li>';
};


/**
 * Create the path with the given slug.
 */
DAB.graphs.Multiline.prototype.createPath_ = function (slug, data) {
  var index = _.indexOf(_.keys(this.data_), slug);
  this.svg_.append('path')
      .attr('stroke', this.colorScale_(index))
      .attr('class', 'line ' + slug)
      .attr('d', this.line_(data));
};


/**
 * Update the path with the given slug to match the given data.
 */
DAB.graphs.Multiline.prototype.updatePath_ = function (slug, data) {
  var index = _.indexOf(_.keys(this.data_), slug) || 0;
  this.svg_.select('.' + slug)
    .transition()
    .duration(800)
    .attr('stroke', this.colorScale_(index))
    .attr('d', this.line_(data));
};


/**
 * The basic D3 line object.
 */
DAB.graphs.Multiline.prototype.initializeLine_ = function() {
  this.line_ = d3.svg.line()
    .x(_.bind(function (d) {
      return this.xScale_(new Date(d.year));
    }, this))
    .y(_.bind(function (d) {
      return this.yScale_(d.y);
    }, this))
    .interpolate('linear');
};


/**
 * Given an array of data, produces a similarly shaped, zeroed-out array of
 * dummy data.
 */
DAB.graphs.Multiline.prototype.initializeDummyData_ = function () {
  var rangeLength = this.getXRange_()[1] - this.getXRange_()[0];
  var dataToImitate = _.first(_.values(this.data_));
  // Create a dummy point evenly spaced for each data point.
  this.dummyData_ = _.map(dataToImitate, function(value, index) {
    return {
      year: value.year,
      y: 0
    }
  }, this);
};


/**
 * The first slug to be rendered (when the graph is rendered).
 */
DAB.graphs.Multiline.prototype.getInitialSlug_ = function () {
  return this.initialSlug_;
};