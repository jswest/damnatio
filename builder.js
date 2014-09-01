var jade = require('jade');
var md = require('markdown').markdown;
var fs = require('fs');
var _ = require('underscore');

var builder = {
  build: function(sourceJson, target) {
    var jadeOptions = {
      pretty: true, // Dev only?
    }
    var templateFn = jade.compileFile('./views/index.jade', jadeOptions);
    var structure = JSON.parse(fs.readFileSync(sourceJson));
    var dpic = JSON.parse(fs.readFileSync('./data/dpic-full.json'));
    var essayDir = './data/essays/';
    var essays = fs.readdirSync(essayDir);

    executions = _.map(dpic, function(execution) {
      var additionalData = {
        year: new Date(execution["Date"]).getFullYear(),
        id: generateId(execution),
        name: execution["Name"], // Convenience. The data should just have lowercase keys.
      };
      if (_.include(essays, additionalData.id + '.md')) {
        additionalData.essay = md.toHTML(fs.readFileSync(essayDir + additionalData.id + '.md').toString());
      }
      return _.extend(execution, additionalData);
    });

    executionsByYear = _.groupBy(executions, 'year');

    var sections = [];
    _.each(executionsByYear, function(list, year) {
      sections.push({
        type: "year",
        year: year,
        names: list
      });
      var interlude = _.findWhere(structure.interludes, {year: year});
      if (interlude) {
        sections.push({
          type: "interlude",
          id: interlude.id
        });
      }
    });
    fs.writeFileSync('views/index.html', templateFn({sections: sections}));
  }
}

var generateId = function(execution) {
  return execution["Name"].replace(/\ /, '') + '-' + new Date(execution["Date"]).getFullYear();
};

module.exports = builder;