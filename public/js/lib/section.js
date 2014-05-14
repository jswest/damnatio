/**
 * Represents a panel of content. A section has a data key which identifies what
 * data from the server is necessary to load that content. Sections can contain
 * graphs, text, and images.
 */
 util.provide('DAB.Section');



 /**
  *
  */
DAB.Section = function (options) {
  this.dataKey_ = options.dataKey;
  this.element_ = options.element;
};


/**
 * Gets the data key for this section.
 */
DAB.Section.prototype.getDataKey = function () {
  return this.dataKey_;
};


/**
 * Render the section. This must be overridden.
 */
DAB.Section.prototype.render = util.abstractMethod('Section#render');


/**
 * Called when the data for this section is ready.
 */
DAB.Section.prototype.onDataLoad = util.abstractMethod('Section#onDataLoad');