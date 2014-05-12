/**
 * This is a place to stick utilities that are used across a number of
 * producers. Any common task that can be abstracted away from a particular data
 * set should be put in here.
 */
require('../../../util.js');
var assert = require('assert');

util.provide('dab.data.producers.Helper');



/**
 * Takes an array of data each with a year property, a list of years, and an
 * empty year object and ensures that the list includes a datum for each year.
 * Returns a new list, sorted by year.
 *
 * Note: the array of data must be sorted by year to begin with, otherwise this
 * will throw.
 */
dab.data.producers.Helper.fillInYears = function(data, years, emptyYear) {
  var newData = [];
  var currentIndex = 0;
  _.each(years, function(year) {
    var currentDatum = data[currentIndex];
    var currentYear = parseInt(currentDatum.year, 10);

    // If the next datum has a later year, fill in a blank year. O.w. add the
    // existing datum.
    if (currentYear > year) {
      newDatum = _.clone(emptyYear);
      newDatum.year = year.toString();
      newData.push(newDatum);
    } else {
      // In this case currentYear should always be the same as year. Otherwise
      // the list was not sorted to begin with.
      assert(
          currentYear === year,
          "Your data must be sorted by year to call fillInYears");
      newData.push(currentDatum);
      currentIndex++;
    }
  });

  return newData;
};


dab.data.producers.Helper.years = function(start_year, end_year) {
  var years = [];
  for (var year = start_year; year <= end_year; year++) {
    years.push(year);
  }
  return years;
};