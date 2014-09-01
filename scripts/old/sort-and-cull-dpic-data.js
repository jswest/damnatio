var fs = require( 'fs' )
,   csv = require( 'csv' );

var rawData = fs.readFileSync( 'data/raw/execution_database.csv' ).toString()

var keys = [
  'Date',
  'Name',
  'Age',
  'Sex',
  'Race',
  'Number / Race / Sex of Victims',
  'State',
  'Region',
  'Method',
  'Juvenile',
  'Federal',
  'Volunteer',
  'Foreign National'
];

var goodKeys = [
  'Date',
  'Name',
  'Sex',
  'Race',
  'State',
  'Method',
  'Juvenile'
];

var executions = [];
csv()
  .from.string( rawData )
  .to.array( function ( data ) {
    for ( var i = 1; i < data.length; i++ ) {
      var execution = {};
      for ( var j = 0; j < goodKeys.length; j++ ) {
        execution[goodKeys[j]] = data[i][keys.indexOf( goodKeys[j] )];
      }
      executions.push( execution );
    }
    fs.writeFile( 'data/dpic-full.json', JSON.stringify( executions, null, "\t" ), function ( error ) {
      if ( error ) {
        console.log( error );
      } else {
        console.log( 'file written.' );
      }
    } );
  });