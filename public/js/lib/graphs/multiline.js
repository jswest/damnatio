/**
 * Represents a graph that has multiple lines that can be graphed in parallel
 * controlled by a simple menu.
 */
util.provide('DAB.graph.Multiline');



/**
 *
 */
DAB.graph.Multiline = function (options) {
  // Super constructor does all the work.
  this.base(this, 'constructor', options);

  this.menuNicename_  = options.menuNicename;
  this.colorScale_    = options.colorScale_ || d3.scale.category20();
  this.data_          = null;
  this.dummyData_     = null;
  this.line_          = null;
  this.initializeLine_();
};
util.inherits(DAB.graph.Multiline, DAB.Graph);


/**
 * Render the graph.
 */
DAB.graph.Multiline.prototype.renderData = function () {
  this.renderMenu_();
  this.bindMenu_();
  this.initializeDummyData_();
  _.each(_.keys(this.data_), function (slug, index) {
    if (index === 0) { // render the first one with real data.
      this.createPath_(slug, index, this.data_);
    } else {
      this.createPath_(slug, index, this.dummyData_);
    }
  }, this);
};


/**
 * Render the menu. To be called only after the data has been loaded.
 */
DAB.graph.Multiline.prototype.renderMenu_ = function () {
  this.element_.append('<ul class="menu clicked"><li class="control">' + this.menuNicename_ + '</li></ul>');
  var menu = this.element_.find('.menu');
  var itemNames = _.keys(this.data_);
  _.each(itemNames, function (itemName, index) {
    menu.append(this.menuItem_(itemName, index));
  });
};


/**
 * Bind the menu events. To be called only after the menu has been rendered.
 */
DAB.graph.Multiline.prototype.bindMenu_ = function () {
  var menu = this.element_.find('.menu');
  var that = this;
  var menuItemIndex = 0;
  menu.find('li').on('click', function () {
    var li = $(this);
    var slug = li.data('slug');
    if (li.hasClass('control')) {
      $('.menu').toggleClass('clicked')
    } else {
      if (li.hasClass('selected')) {
        that.updatePath_(slug, menuItemIndex, that.dummyData_ );
      } else {
        that.updatePath_(slug, menuItemIndex, that.data_[slug]);
      }
      li.toggleClass('selected');
    }
    menuItemIndex++;
  });
};


/**
 * Menu list item template.
 */
DAB.graph.Multiline.prototype.menuItem_ = function (name, index) {
  return '<li class="menu-item" data-slug=' + name + '>' +
    '<div class="colorblock" style="background-color:' + this.colorScale_( index ) + '"></div>' +
    '<div class="name">' + util.titleize(name) + '</div>'
  '</li>';
};


/**
 * Create the path with the given slug.
 */
DAB.graph.Multiline.prototype.createPath_ = function (slug, id, data) {
  this.svg_.append('path')
      .attr('stroke', this.colorScale_(id))
      .attr('class', 'line ' + slug)
      .attr('d', this.line_(data));
};


/**
 * Update the path with the given slug to match the given data.
 */
DAB.graph.Multiline.prototype.updatePath_ = function (slug, id, data) {
  this.svg_.select('.' + slug)
    .transition()
    .duration(800)
    .attr('stroke', this.colorScale_(id))
    .attr('d', this.line_(data));
};


/**
 * The basic D3 line object.
 */
DAB.graph.Multiline.prototype.initializeLine_ = function() {
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
DAB.graph.Multiline.initializeDummyData_ = function (data) {
  var rangeLength = this.getXRange_()[1] - this.getXRange_()[0];
  // Create a dummy point evenly spaced for each data point.
  this.dummyData_ = _.map(data, function(value, index) {
    return {
      x: this.xScale_.inverse(index / rangeLength),
      y: 0
    }
  }, this);
};