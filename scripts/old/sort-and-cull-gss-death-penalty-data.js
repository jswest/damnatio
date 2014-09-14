var fs = require( 'fs' )
,		csv = require( 'csv' )
,		fullHeader = require( '../data/raw/gss-full-header' );

/*var headers = {
	"sex": 2,
	"race": 3,
	"highestGradeCompleted": 7,
	"highestDegreeReceived": 8,
	"politicalParty": 17,
	"politicalRank": 18
	"deathPenalty": 65
};*/
var headers = [
	0, 2, 3, 7, 8, 17, 18, 65
];

var isolateHeader = function () {
	var header = [];
	for ( var i = 0; i < fullHeader.length; i++ ) {
		if ( headers.indexOf( i ) > -1 ) {
			header.push( fullHeader[i] );
		} 
	}
	return header;
};

var isolateAnswers = function ( file ) {
	var rows = [];
	var next = function ( k ) {
		csv()
			.from( file[k] )
			.to.array( function ( data ) {
				var goodData = [];
				for( var j = 0; j < data[0].length; j++ ) {
					if ( headers.indexOf( j ) > -1 ) {
						goodData.push( data[0][j] );
					}
				}
				rows.push( goodData );
				k++;
				if ( k < file.length ) {
					next( k );
				} else {
					fs.writeFile( './data/gss-death-penalty-answers.json', JSON.stringify( rows, null, 2 ) );
				}
			});
	};
	next( 1 );
};

var file = fs
	.readFileSync( './data/raw/gss-full.csv', 'utf-8' )
	.toString()
	.split( "\r" );
var header 		= isolateHeader( file, fullHeader )
isolateAnswers( file );
fs.writeFile( './data/gss-death-penalty-header.json', JSON.stringify( header, null, 2 ) );
