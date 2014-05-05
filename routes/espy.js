var espyData = require( '../data/espy-full.json' );

var sortDataByMethod = function ( data ) {

  var methods = [];
  for ( var i = 0; i < data.length; i++ ) {
    if ( methods.indexOf( data[i].method ) === -1 ) {
      methods.push( data[i].method )
    }
  }

  var dataByYear = {};
  for ( var i = 1608; i <= 2002; i++ ) {
    var yearsData = {};
    for ( var j = 0; j < methods.length; j++ ) {
      yearsData[methods[j]] = 0;
    }
    dataByYear[i.toString()] = yearsData;
  }

  for ( var i = 0; i < data.length; i++ ) {
    var year = data[i].year;
    dataByYear[year][data[i].method]++;
  }

  var returnData = [];
  for ( var i = 1608; i <= 2002; i++ ) {
    dataByYear[i.toString()].year = i.toString();
    returnData.push( dataByYear[i.toString()] );
  }

  return returnData;

};

var sortDataByRace = function ( data ) {
  
  var races = [];
  for ( var i = 0; i < data.length; i++ ) {
    if ( races.indexOf( data[i].race ) === -1 ) {
      races.push( data[i].race )
    }
  }

  var dataByYear = {};
  for ( var i = 1608; i <= 2002; i++ ) {
    var yearsData = {};
    for ( var j = 0; j < races.length; j++ ) {
      yearsData[races[j]] = 0;
    }
    dataByYear[i.toString()] = yearsData;
  }

  for ( var i = 0; i < data.length; i++ ) {
    var year = data[i].year;
    dataByYear[year][data[i].race]++;
  }

  var returnData = [];
  for ( var i = 1608; i <= 2002; i++ ) {
    dataByYear[i.toString()].year = i.toString();
    returnData.push( dataByYear[i.toString()] );
  }

  return returnData;
}
exports.espy = function ( req, res ) {
  var segment = req.query.segment;
  if ( segment === "method" ) {
    var data = sortDataByMethod( espyData );
  }
  else if ( segment === "race" ) {
    var data = sortDataByRace( espyData );
  }
  res.send( data );
}