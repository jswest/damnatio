var fs = require('fs')
,   csv = require('csv')
,   _ = require('underscore');

var rawData = fs.readFileSync('data/county-pops.csv').toString();

var header = [
  '1990',
  '1980',
  '1970',
  '1960',
  '1950',
  '1940',
  '1930',
  '1920',
  '1910',
  '1900',
  '1890',
  '1880',
  '1870',
  '1860',
  '1850',
  '1840',
  '1830',
  '1820',
  '1810',
  '1800'
];

var countyData = {
  states: {},
  counties: {}
};

csv()
  .from.string(rawData)
  .to.array( function ( data ) {
    for ( var i = 0; i < data.length; i++ ) {
      if (isState(data[i])) {
        // Is this off-by-one?
        countyData['states'][data[i][0].trim()] = processData(data[i]);
      } else if (isCounty(data[i])) {
        countyData['counties'][data[i][0].trim()] = processData(data[i]);
      }
    }
    fs.writeFile(
      'data/census-data.json',
      JSON.stringify(countyData, null, "\t"),
      function (error) {
        if (error) {
          console.log(error);
        } else {
          console.log('file written.');
        }
      });
  });

function processData (row) {
  return row.map(function (value) {
    // Return an empty string if the word contains any letters.
    if (value !== value.replace(/[A-Za-z]*/g, '')) {
      return '';
    }
    // Otherwise remove all the non-digit characters.
    return value.replace(/[^\d]*/g, '');
  }).slice(1, header.length + 1);
}

function isCounty (row) {
  for (var i = 1; i <= header.length; i++) {
    if (row[i] === '') {
      return false;
    }
  }
  return true;
}

function isState (row) {
  var name = row[0];
  var nameWords = name.split(' ');
  return name !== '' &&
      name.toLowerCase().indexOf('notes') === -1 &&
      nameWords.length < 3 && nameWords.length > 0 &&
      name === name.toUpperCase();
}
