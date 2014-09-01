var fs = require('fs');
var csv = require( 'csv' );
var _ = require('underscore');

var csvKeys = [
  'Execution #',
  'Last Name',
  'First Name',
  'TDCJ Number',
  'Age',
  'Date',
  'Race',
  'County'
];

var csvData = fs.readFileSync('data/texas-executions.csv').toString();

csv().from.string(csvData).to.array(function(data) {
  var basicInformation = [];
  for (var i = 1; i < data.length; i++) {
    var execution = {};
    for (var j = 0; j < csvKeys.length; j++) {
      execution[csvKeys[j]] = data[i][j];
    }
    basicInformation.push(execution);
  }

  var files = fs.readdirSync('data/texas-pages');
  var lastWordsFiles = _.filter(files, function(name) {
    return name.indexOf('last.html') !== -1;
  });
  var moreInfoFiles = _.filter(files, function(name) {
    return name.indexOf('last.html') === -1;
  });

  console.log('last words:', lastWordsFiles.length, 'more info:', moreInfoFiles.length);

  var counter = 0;

  _.each(lastWordsFiles, function(fileName) {
    var page = fs.readFileSync('data/texas-pages/' + fileName);
    var tdcjMatches = /<p>.*?\#([\d]+)/.exec(page);
    if (!tdcjMatches) {
      tdcjMatches = /Offender:[\S\s]*?<\/p>[\S\s]*?<p>([\S\s]*?)(,|\#|<\/p>)/.exec(page);

      if (!tdcjMatches) {
        console.log('Couldn\'t pull identity from ' + fileName);
        return;
      }
      var name = tdcjMatches[1];
      name = name.trim().toLowerCase();
      var execution = _.find(basicInformation, function(execution) {
        var concated = (execution['First Name'] + " " + execution['Last Name']).trim().toLowerCase();
        return concated === name;
      });

      // If we still don't have it, try one more thing
      if (!execution) {
        tdcjMatches = /Offender:[\S\s]*?<\/p>[\S\s]*?<p>([\S\s]*?)(\#|<\/p>)/.exec(page);
        var lastFirst = tdcjMatches[1].trim();
        var firstLast = lastFirst.replace(/(.*?),(.*)/, "$2 $1");
        var name = firstLast.trim().toLowerCase();
        var execution = _.find(basicInformation, function(execution) {
          var concated = (execution['First Name'] + " " + execution['Last Name']).trim().toLowerCase();
          return concated === name;
        });
      }
    } else {
      var tdcjId = tdcjMatches[1];
      var execution = _.findWhere(basicInformation, {'TDCJ Number': tdcjId});
    }

    if (!execution) {
      console.log('Didn\'t find a matching execution for ' + fileName);
      return;
    }

    var lastWordsMatch = /Last Statement:[\S\s]*?<\/p>[\S\s]*?<p>([\S\s]*?)<\/p>/m.exec(page);
    if (!lastWordsMatch) {
      console.log('Couldn\'t find last words for ' + fileName);
      return;
    }

    var lastWords = lastWordsMatch[1];
    if (lastWords.indexOf('This offender declined to make a last statement') !== -1) {
      return;
    }

    execution.lastWords = lastWordsMatch[1];
    counter++;
  });

  console.log("Parsed " + counter + " last words");

  fs.writeFile('data/texas-tdcj.json', JSON.stringify(basicInformation, null, "\t" ), function(error) {
      if (error) {
        console.log(error);
      } else {
        console.log('file written.');
      }
    });
});