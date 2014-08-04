var jade = require('jade');
var _ = require('underscore');

var builder = {
  build: function(sourceJson, target) {
    var jadeOptions = {
      pretty: true, // Dev only?
      debug: true, // Dev only
    }
    var templateFn = jade.compileFile('./views/index.jade', jadeOptions);
    console.log(templateFn({sections: [{className: 'name'}, {className: 'section2'}]}));
  }
}

module.exports = builder;