var fs 			= require( 'fs' )
,		rawData = require( '../data/raw/innocence-full.json' );

var outputData = [];

for ( var i = 0; i < rawData.length; i++ ) {
	datum = rawData[i];
	datum.name = datum.name.toLowerCase();
	datum.reason = datum.reason.toLowerCase();
	if ( datum.race === "W" ) {
		datum.race = "white";
	} else if ( datum.race === "B" ) {
		datum.race = "black";
	} else if ( datum.race === "L" ) {
		datum.race = "latino"
	} else {
		datum.race = "other";
	}
	if ( !datum.dnaEvidence ) {
		datum.dnaEvidence = false;
	} else {
		datum.dnaEvidence = true;
	}
	outputData.push( datum );
}

fs.writeFile(
	'data/innocence-pretty.json',
	JSON.stringify( outputData, null, 2 ),
	function ( error ) {
		if ( error ) {
			console.log( error );
		} else {
			console.log( 'file written.' );
			fs.writeFile(
				'data/innocence.json',
				JSON.stringify( outputData ),
				function ( error ) {
					if ( error ) {
						console.log( error );
					} else {
						console.log( 'file written.' );
					}
				}
			);
		}
	}
);