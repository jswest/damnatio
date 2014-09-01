var fs = require('fs');
var http = require('http');
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

var basicInformation = [];
var csvData = fs.readFileSync('data/texas-executions.csv').toString();

csv().from.string(csvData).to.array(function(data) {
  for (var i = 1; i < data.length; i++) {
    var execution = {};
    for (var j = 0; j < csvKeys.length; j++) {
      execution[csvKeys[j]] = data[i][j];
    }
    basicInformation.push(execution);
  }

  var linkRegex = /<td><a.*?href=\"(.*?)\"/
  var urls = [];

  // Parse out the urls to the 'more info' pages
  fs.readFile(
      'data/texas_offenders_page.txt',
      {encoding: 'utf-8'},
      function (err, data) {
    if (err) throw err;
    var lines = data.split('\n');
    _.each(lines, function(line) {
      var result = linkRegex.exec(line);
      if (result) {
        urls.push(result[1]);
      }
    });

    // Remove the placeholder links
    urls = _.filter(urls, function(url) {
      return url.indexOf('no_last_statement') === -1 &&
          url.indexOf('no_info_available') === -1;
    });

    // Filter out the ones that are just images.
    var images = _.filter(urls, function(url) {
      return /\.jpg$/.test(url);
    });

    urls = _.filter(urls, function(url) {
      return !/\.jpg$/.test(url);
    });

    var options = {
      host: 'www.tdcj.state.tx.us',
      port: 80,
    };

    _.each(urls, function(url) {
      options.path = '/death_row/' + url;
      http.get(options, function(res) {
        var pageName = /.*?\/(.*)/.exec(url)[1];
        var destination = fs.createWriteStream('data/texas-pages/' + pageName);
        console.log(
            "Got response to " + options.path + ":" + res.statusCode,
            "Logging to " + pageName);
        res.pipe(destination);
      }).on('error', function(e) {
        console.log("Got error on " + options.path + ":" + e.message);
      });
    });
  });
});