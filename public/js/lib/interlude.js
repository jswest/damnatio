DAB.Interlude = function (options) {

  var that = this;

  // get all the data out of the options object
  // and throw all necessary errors.
  if (_.isUndefined(options) || typeof options !== 'object') {
    throw new Error('You must pass in an options object to DAB.Interlude');
  }

  if (_.isUndefined(options.el)) {
    throw new Error('You must provide an el to latch on to.');
  }
  else {
    this.wrapper = options.el;
    this.wrapper.append('<div class="pane interactive"></div>');
    this.el = this.wrapper.find('.interactive');
  }

  if (_.isUndefined(options.url)) {
    throw new Error('You must provide a url');
  }
  else {
    this.url = options.url;
  }

  if (_.isUndefined(options.title)) {
    throw new Error('Interludes need titles.');
  }
  else {
    this.title = options.title;
  }

  this.subtitle = _.isUndefined(options.subtitle) ? "" : options.subtitle;

  if (_.isUndefined(options.build) || typeof options.build !== 'function') {
    this.build = function () {};
  }
  else {
    this.build = options.build;
  }




  this.createSharedElements = function () {
    that.svg = d3.select(that.el[0]).append('svg')
      .attr('width', that.el.width())
      .attr('height', that.el.height());
    that.el.append('<h1 class="interactive-title">' + that.title + '</h1>');
    that.el.append('<h2 class="interactive-subtitle">' + that.subtitle + '</h2>');
  };

  this.requestData = function () {
    d3.json(this.url, function (data) {
      that.build(data);
    });
  };

  this.on = function () {
    that.requestData();
  }

};