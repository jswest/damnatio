var fs = require( 'fs' )
,		csv = require( 'csv' )
,		fullHeader = require( '../data/raw/gss-full-header.json' );

var rawData = fs.readFileSync( 'data/raw/gss-full.csv' ).toString();

var headers = [
	0, 2, 3, 4, 7, 8, 11, 12, 17, 18, 65
];

var isolateHeader = function ( fullHeader ) {
	var header = [];
	for ( var i = 0; i < fullHeader.length; i++ ) {
		if ( headers.indexOf( i ) > -1 ) {
			header.push( fullHeader[i] );
		} 
	}
	return header;
};

var goodHeaders = isolateHeader( fullHeader );

console.log( goodHeaders );

var goodData = [];
csv()
  .from.string( rawData )
  .to.array( function ( data ) {
    for ( var i = 1; i < data.length; i++ ) {
      var datum = {};
      for ( var j = 0; j < goodHeaders.length; j++ ) {
        datum[goodHeaders[j]] = data[i][fullHeader.indexOf( goodHeaders[j] )];
      }
      goodData.push( datum );
    }
    fs.writeFile( 'data/gss-death-penalty.json', JSON.stringify( goodData, null, "\t" ), function ( error ) {
      if ( error ) {
        console.log( error );
      } else {
        console.log( 'file written.' );
      }
    } );
  });
