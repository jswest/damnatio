/**
 * Produces gss data.
 */

require('../../../util.js');
util.require('cau.framework.Producer');

util.provide('dab.data.producers.Gss');



/**
 * Configure the producer.
 */
dab.data.producers.Gss = function(req, dataStore) {
  dab.data.producers.Gss.base(this, 'constructor', req, dataStore);
  this.data_ = this.dataStore_.getGssData();
  this.segment_ = req.query.segment;
  this.facet_ = req.query.facet;
};
util.inherits(dab.data.producers.Gss, cau.framework.Producer);


/**
 * Start year for the data set.
 */
dab.data.producers.Gss.START_YEAR = 1974;


/**
 * Start year for the data set.
 */
dab.data.producers.Gss.END_YEAR = 2012;


/**
 * The basic schema for this data.
 */
dab.data.producers.Gss.SCHEMA = {
  Fields: {
    YEAR: "Year of Survey [#Core]",
    SEX: "Sex [#Demographic #Core]",
    GRADE: "Highest Grade Completed [#Demographic]",
    DEGREE: "Highest Degree Received [#Demographic #Core]",
    PARTY: "Political Party (Condensed) [#Politics #Core]",
    POLITICS: "Liberalism-Conservatism (Condensed) [#Politics #Core]",
    DEATH_PENALTY: "Death Penalty for Murderers [#Govt]",
    RACE: "Race (Original) [#Demographic #Race]",
    RELIGION: "Religious Preference (Condensed) [#Relig #Demographic #Core]"
  },

  Responses: {
    FAVOR: 'Favor',
    OPPOSE: 'Oppose',
    UNSURE: 'Don\'t Know'
  },

  // TODO: this should be shared somewhere.
  years: function() {
    var START_YEAR = dab.data.producers.Gss.START_YEAR;
    var END_YEAR = dab.data.producers.Gss.END_YEAR;
    var years = [];
    for (var year = START_YEAR; year <= END_YEAR; year++) {
      years.push(year);
    }
    return years;
  },
};


/**
 * Return the transformed data.
 */
dab.data.producers.Gss.prototype.get = function() {
  var segment = this.segment_;
  var facet = this.facet_;

  // Filter data down to those that answered the death penalty question who
  // match the given segment of the given facet.
  var filteredData = _.filter(this.data_, function(value) {
    var answeredQuestion =
        value[dab.data.producers.Gss.SCHEMA.Fields.DEATH_PENALTY] !== "";
    var matchesSegment = this.matchesSegment_(value);
    return answeredQuestion && matchesSegment;
  }, this);

  // Group by year.
  var groupedByYear = _.groupBy(filteredData, function(value) {
    return value[dab.data.producers.Gss.SCHEMA.Fields.YEAR];
  });

  // Count by response to death penalty question.
  var countedByYear = _.map(groupedByYear, function(list, year) {
    var counts = _.countBy(list, function(datum) {
      return datum[dab.data.producers.Gss.SCHEMA.Fields.DEATH_PENALTY];
    });

    // Store the year on the list of counts.
    counts.year = year;
    return counts;
  });

  // Calculate yearly averages.
  var yearlyAverages = _.map(countedByYear, function(year) {
    var numFavor = year[dab.data.producers.Gss.SCHEMA.Responses.FAVOR];
    var numOppose = year[dab.data.producers.Gss.SCHEMA.Responses.OPPOSE];
    var numUnsure = year[dab.data.producers.Gss.SCHEMA.Responses.UNSURE];
    var total = numFavor + numOppose + numUnsure;

    return {
      year: year.year,
      favorAverage: Math.round( (numFavor / total) * 100),
      opposeAverage: Math.round( (numOppose / total) * 100),
      unsureAverage: Math.round( (numUnsure / total) * 100),
    }
  });

  return yearlyAverages;
};


dab.data.producers.Gss.prototype.matchesSegment_ = function(datum) {
  if (!this.segment_ || !this.facet_ || this.segment_ === 'all') {
    return true;
  }

  var field = this.facet_.toUpperCase();

  return datum[dab.data.producers.Gss.SCHEMA.Fields[field]] === this.segment_;
};