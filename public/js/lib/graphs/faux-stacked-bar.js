/**
 * Represents a graph that has unique rects for every data point
 * controlled by a simple menu.
 */
util.provide('DAB.graphs.FauxStackedBar');



DAB.graphs.FauxStackedBar = function (options) {
  options = options || {};
  // Super constructor does all the work.
  // TODO: help @jswest understand what the fuck is happening here.
  DAB.graphs.FauxStackedBar.base(this, 'constructor', options);

  this.segments_ = options.segments;
  if (typeof this.segments_ !== 'array') {
    throw new Error('You must pass in segments to the options object.');
    return;
  }
  this.colorScale_     = options.colorScale_ || d3.scale.category20();
  this.initialSegment_ = options.initialSegment || options.segments[0];
  this.currentSegment_ = this.initialSegment_;
  this.data_           = null;
};


DAB.graphs.FauxStackedBar.prototype.sortDataByCurrentSegment_ = function () {
  this.data_ = this.data_.sort(function (a, b) {
    if ( a[this.currentSegment_.name] > b[this.currentSegment_.name] ) {
      return 1;
    }
    else {
      return -1;
    }
  });
};


DAB.graphs.FauxStackedBar.prototype.renderControls_ = function () {
  this.element_.append(
    '<ul class="controls">' +
      '<li>' + this.initialSegment_.nicename + '</li>'
    '</ul>'
  );
  var controls = this.element_.find('.controls');

  // iterate over the segments, and add each one to the controls menu.
  for (var i = 0; i < this.segments_.length; i++) {
    var segment = this.segments_[i];
    // okay, this is a little ugly.
    // check if this is the current segment and add a class
    // to that <li> so that we can style it differently.
    if ( segment.name === this.initialSegment_.name ) {
      controls.append(
        '<li class="control current-segment" data-segment="' + segment.name + '">' +
          segment.nicename +
        '</li>'
      );      
    }
    else {
      controls.append(
        '<li class="control" data-segment="' + segment.name + '">' +
          segment.nicename +
        '</li>'
      );
    }
  }
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

  // iterate over the current segment's values and add them and their color to the keys <dl>.
  for (var i = 0; i < this.currentSegment_.values.length; i++) {
    var value = this.currentSegment_.values[i];
    interactiveKey.append(
      '<dl class="key-color-block" style="' + this.colorScale(i) + '"></dl>' +
      '<dt class="key-value-name">' + value + '</dt>';
    );
  }
};

DAB.graphs.FauxStackedBar.prototype.getYear_ = function () {
  // assuming the date comes in as mm/dd/year, which it is right now,
  // but it could come in as yyyy-mm-dd, which I would prefer.
  // let's talk about this function when we figure out how to format the data.
  return new Date(date.split('/')[2]);
};

DAB.graphs.FauxStackedBar.prototype.initializeRects_ = function () {
  this.sortDataByCurrentSegment_();
  this.rects = this.svg_.selectAll('rect')
    .data(this.data_)
    .enter()
    .append('rect')
    .attr('width', this.xScale_(new Date(2014)) - this.xScale_(new Date(2013)))
    .attr('height', this.hScale(1) - 2)
};

DAB.graphs.FauxStackedBar.prototype.createGraph_ = function () {
  var indices = {};
  this.rects
    .attr('transform', function (d, i) {
      var xpos = this.xScale_(this.getYear(d.date));
      var ypos = this.height_ - this.padding_.bottom; // start by having each column at the bottom.
      return 'translate(' + xpos + ',' + ypos + ')'; 
    })
    .style('fill', function (d, i) { return this.colorScale_(d[this.currentSegment_.name]) })
    .transition()
    .duration(500)
    .attr('transform', function (d, i) {
      var date = this.getYear_(d.date);
      if (indices[date]) {
        indices[date]++;
      }
      else {
        indices[date] = 1;
      }
      var xpos = this.xScale_(date);
      var ypos = this.yScale_(indices[date]);
      return 'translate(' + xpos + ',' + ypos + ')';
    });
};

DAB.graphs.FauxStackedBar.prototype.updateGraph_ = function () {
  this.rects
    .transition()
    .duration(500)
    .attr('transform', function (d, i) {
      var xpos = this.xScale_(this.getYear(d.date));
      var ypos = this.height_ - this.padding_.bottom;
      return 'translate(' + xpos + ',' + ypos + ')';     
    })
  this.sortDataByCurrentSegment_();
  this.rects
    .data(_this.data)
    .transition()
    .delay(500)
    .duration(100)
    .attr('transform', function (d, i) {
      var xpos = this.xScale_(this.getYear(d.date));
      var ypos = this.height_ - this.padding_.bottom;
      return 'translate(' + xpos + ',' + ypos + ')';     
    })
    .style('fill', function (d, i) { return this.colorScale_(d[this.currentSegment_.name]) })
    .transition()
    .delay(600)
    .duration(500)
    .attr('transform', function (d, i) {
      var date = this.getYear_(d.date);
      if (indices[date]) {
        indices[date]++;
      }
      else {
        indices[date] = 1;
      }
      var xpos = this.xScale_(date);
      var ypos = this.yScale_(indices[date]);
      return 'translate(' + xpos + ',' + ypos + ')';      
    });
};

// TODO add a handler for hover that shows the footer data about each execution
// TODO add a handler for click that shows a model about that execution

