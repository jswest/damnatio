/**
 * Produces espy data.
 */

require('../../../util.js');
util.require('cau.framework.Producer');
util.require('dab.data.producers.Helper');

util.provide('dab.data.producers.Espy');



/**
 * Configure the producer.
 */
dab.data.producers.Espy = function(req, dataStore) {
  dab.data.producers.Espy.base(this, 'constructor', req, dataStore);
  this.data_ = this.dataStore_.getEspyData();

  // The field to group the data by.
  this.segment_ = req.query.segment;
};
util.inherits(dab.data.producers.Espy, cau.framework.Producer);


/**
 * Start year for the data set.
 */
dab.data.producers.Espy.START_YEAR = 1608;


/**
 * Start year for the data set.
 */
dab.data.producers.Espy.END_YEAR = 2002;


/**
 * The basic schema for this data.
 */
dab.data.producers.Espy.SCHEMA = {

  years: function() {
    var START_YEAR = dab.data.producers.Espy.START_YEAR;
    var END_YEAR = dab.data.producers.Espy.END_YEAR;
    var years = [];
    for (var year = START_YEAR; year <= END_YEAR; year++) {
      years.push(year);
    }
    return years;
  },

  method: [
    "Hanging",
    "Shot",
    "Electrocution",
    "Asphyxiation-Gas",
    "Injection",
    "Burned",
    "Other",
    "Break on Wheel",
    "Hung in Chains",
    "Pressing",
    "Bludgeoned",
    "Gibbetted"
  ],

  race: [
    "White",
    "Black",
    "Native American",
    "Hispanic",
    "Asian-Pacific Il",
    "Other"
  ],
}


/**
 * Return the transformed data.
 */
dab.data.producers.Espy.prototype.get = function() {
  var segment = this.segment_;

  var groupedByYear = _.groupBy(this.data_, function(value) {
    return value.year;
  });

  var countedSegments = _.map(groupedByYear, function(value, key) {
    var countedYear = _.countBy(value, function(datum) {
      return datum[segment];
    });

    // Fill out each year to include each possible value of the segment.
    // TODO: This shouldn't need to be. The client should assume that any
    // undefined field is 0.
    _.each(dab.data.producers.Espy.SCHEMA[segment], function(value) {
      countedYear[value] = countedYear[value] || 0;
    });

    // Store the year on the new datum, since it was previously just the key.
    countedYear.year = key;

    return countedYear;
  });

  // TODO: dry this out.
  var emptyYear = {}
  // Fill out each year to include each possible value of the segment.
  _.each(dab.data.producers.Espy.SCHEMA[segment], function(value) {
    emptyYear[value] = emptyYear[value] || 0;
  });

  // Fill in the missing years.
  countedSegments = dab.data.producers.Helper.fillInYears(
      countedSegments, dab.data.producers.Espy.SCHEMA.years(), emptyYear);

  return countedSegments;
};
