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

  start_year: 1974,
  end_year: 2012,
};


/**
 * Return the transformed data.
 */
dab.data.producers.Gss.prototype.get = function() {
  var groupByField = this.groupByField_;

  // Filter data down to those that answered the death penalty question that
  // that have a defined value for the group by field.
  var filteredData = _.filter(this.data_, function(value) {
    var answeredQuestion =
        value[dab.data.producers.Gss.SCHEMA.Fields.DEATH_PENALTY] !== "";
    var hasGroupData = this.hasGroupData_(value);
    return answeredQuestion && hasGroupData;
  }, this);

  // Group by group by field.
  var groups = _.groupBy(filteredData, _.bind(function(value) {
    return value[this.getGroupByKey_()];
  }, this));

  // Group each group by year.
  var result = _.reduce(groups, function(result, data, group) {
    var groupedByYear = _.groupBy(data, function(value) {
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
        y: Math.round((numFavor / total) * 100)
      }
    });

    result[group.toLowerCase()] = yearlyAverages;
    return result;
  }, {});

  return result;
};


dab.data.producers.Gss.prototype.hasGroupData_ = function(datum) {
  return !!datum[this.getGroupByKey_()];
};


dab.data.producers.Gss.prototype.getGroupByKey_ = function() {
  return dab.data.producers.Gss.SCHEMA.Fields[this.groupByField_.toUpperCase()];
};
