/**
 * Registry of section-element pairs.
 */
util.provide('DAB.SectionRegistry');



/**
 * Ctor.
 */
DAB.SectionRegistry = function (dataService) {
  this.sections_ = [];
  this.sectionIndex_ = 0;
  this.dataService_ = dataService;
};


/**
 * The radius from the current scroll position in which to load / keep data.
 */
DAB.SectionRegistry.SCROLL_DATA_RADIUS = 3 * $(window).height;


/**
 * Bind a section to an element.
 * Note: Sections should be registered in order.
 */
DAB.SectionRegistry.prototype.registerSection = function (element, section) {
  this.sections_[this.sectionIndex_] = {
    element       : element,
    section       : section,
    hasLoadedData : false,
    index         : this.sectionIndex_,
    dataKey       : section.getDataKey()
  };
  this.sectionIndex_++;

  return this;
};


/**
 * Render the skeleton of each section without data.
 */
DAB.SectionRegistry.prototype.renderSections = function () {
  _.each(this.sections_, function (section) {
    section.section.render();
  });
};


/**
 * Handles scroll events. Checks to see what sections are near the current
 * scroll position and ensures that data is loaded for all of those. Unloads any
 * sections that are far from the current scroll position.
 */
// TODO: This should be sending navigates / analytics.
DAB.SectionRegistry.prototype.handleScroll = _.debounce(function () {
  // Filter sections by whether or not they are within the data window.
  var sectionsToLoad = _.filter(this.sections_, function (value) {
    var position = value.element.offset().top;
    return position >= 0 && position < DAB.SectionRegistry.SCROLL_DATA_RADIUS ||
        position < 0 && position > -DAB.SectionRegistry.SCROLL_DATA_RADIUS;
  });

  // TODO: Handle unloading sections that are no longer needed.
  this.dataService_.loadKeys(
      _.pluck(this.sections_, 'dataKey'),
      _.bind(this.dataLoaded, this));
});


/**
 * Callback for returned data.
 */
DAB.SectionRegistry.prototype.dataLoaded = function (key, data) {
  var section = _.findWhere(this.sections_, {dataKey: key}).section;
  section.onDataLoad(data);
};