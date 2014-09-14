var espy = require('./../../../data/interludes/how-we-kill/raw/espy/espy.json')
,   dpic = require('./../../../data/interludes/how-we-kill/raw/dpic/dpic.json')
,   fs   = require('fs');

var combined = [];

for (var i = 0; i < espy.length; i++) {
  var execution = espy[i];
  if (parseInt(execution.year) < 1976) {
    combined.push(execution);
  }
}

for (var i = 0; i < dpic.length; i++) {
  combined.push(dpic[i]);
}

fs.writeFile(
  'data/interludes/how-we-kill/combined.json',
  JSON.stringify(combined),
  function (error) {
    console.log(error ? error : 'file written.');
  }
);

var fs   = require('fs');

// get an array of executions methods
var methods = [];
for (var i = 0; i < combined.length; i++) {
  var execution = combined[i];
  if (methods.indexOf(execution.method) === -1) {
    methods.push(execution.method);
  }
}
console.log(methods);

var methodIndex = {
  'Injection': 'lethal injection',
  'Electrocution': 'electrocution',
  'Asphyxiation-Gas': 'gas chamber',
  'Shot': 'firing squad',
  'Hanging': 'hanging',
  'Other': 'other',
  undefined: 'other',
  'Burned': 'other',
  'Pressing': 'other',
  'Gibbeted': 'other',
  'Bludgeoned': 'other',
  'Hung in Chains': 'other',
  'Break on Wheel': 'other',
  'lethal injection': 'lethal injection',
  'electrocution': 'electrocution',
  'gas chamber': 'gas chamber',
  'firing squad': 'firing squad',
  'hanging': 'hanging',
  'other': 'other'
};

var niceMethods = [
  'lethal injection',
  'electrocution',
  'gas chamber',
  'firing squad',
  'hanging',
  'other'
]
// get the data by year
// right now, just build the structure of the object.
/*
{
  "1776": {
    "hanging": 0, // every one of these is zero for now.
    "firing squad": 0,
    etc.
  },
  etc.
}
*/
var dataByYear = {};
for (var i = 1776; i <= 2014; i++) {
  var year = i.toString();
  var yearsData = {};
  for (var j = 0; j < niceMethods.length; j++) {
    var method = niceMethods[j];
    yearsData[method] = 0;
  }
  dataByYear[year] = yearsData;
}

// now fill in the data
for (var i = 0; i < combined.length; i++) {
  var execution = combined[i];
  execution.year = execution.year || new Date(execution.date).getFullYear();
  if (execution.year >= 1776) {
    var method = methodIndex[execution.method];
    dataByYear[execution.year][method]++; 
  }
  
}

// now turn the data into an array rather than on object.
var sortedData = [];
for (var i = 1776; i <= 2014; i++) {
  var year = i.toString();
  dataByYear[year].year = year;
  sortedData.push(dataByYear[year]);
}

var stackedData = [];
// interate over the methods, which will become the "layers" of the stack
// then, for each of them, iterate over the years worth of data
// push the year's entry into a new array, which will have the structure:
// [
//    [ // array representing a group
//      { "x": year, "y": value },
//      etc.
//    ],
//    [ // array representing a group
//      { "x": year, "y": value },
//      etc.
//    ],
//    etc.
// ]
for (var i = 0; i < niceMethods.length; i++) {
  var method = niceMethods[i];
  var methodArray = [];
  for (var j = 0; j < sortedData.length; j++) {
    var executionsThisYear = sortedData[j];
    var entry = { "x": executionsThisYear.year, "y": executionsThisYear[method] };
    entry.method = method;
    methodArray.push(entry);    
  
  }
  stackedData.push(methodArray);
}

fs.writeFile(
  'data/interludes/how-we-kill/combined-method.json',
  JSON.stringify(stackedData),
  function (error) { error ? error : "file written." }
);




