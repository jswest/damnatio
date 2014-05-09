var http			= require( 'http' )
,		fs				= require( 'fs' )
, 	cheerio		= require( 'cheerio' );

var options = {
	host: 'deathpenaltyinfo.org',
	path: '/innocence-list-those-freed-death-row'
};

var pageAsString = '';
var request = http.get( options, function ( response ) {
	response.on( 'data', function ( chunk ) {
		pageAsString += chunk;
	});
	response.on( 'end', function () {
		var $ = cheerio.load( pageAsString );
		var innocents = $('.field-item').eq( 0 )
			.find( 'table' )
			.find( 'table' )
			.find( 'tr' );
		//console.log( innocents );
		///*
		var entries = [];
		console.log( innocents.length );
		for ( var i = 1; i < innocents.length; i++ ) {
			var innocent = innocents.eq( i );
			console.log( innocent.find( 'td' ).eq( 1 ).html() );
			var name = innocent.find( 'td' ).eq( 1 ).find( 'strong' ).html();
			if ( name ) {
				name.trim();
			} else {
				name = innocent.find( 'td' ).eq( 1 ).find( 'span' ).html()
				if ( name ) {
					name.trim();
				} else {
					name = innocent.find( 'td' ).eq( 1 ).find( 'b' ).html() // this one didn't take, so i did it manually.
					if ( name ) {
						name.trim();
					} else {
						name = innocent.find( 'td' ).eq( 1 ).find( 'a' ).html()
					}
				}
			}
			var state = innocent.find( 'td' ).eq( 2 ).html().trim();
			var race = innocent.find( 'td' ).eq( 3 ).html().trim();
			var yearConvicted = innocent.find( 'td' ).eq( 4 ).html().trim();
			var yearExonerated = innocent.find( 'td' ).eq( 5 ).html().trim();
			var reason = innocent.find( 'td' ).eq( 7 ).html().trim();
			var dnaEvidence = innocent.find( 'td' ).eq( 8 ).html().trim();
			var entry = {
				"name": name,
				"state": state,
				"race": race,
				"yearConvicted": yearConvicted,
				"yearExonerated": yearExonerated,
				"reason": reason,
				"dnaEvidence": dnaEvidence
			};
			entries.push( entry );
		}

		fs.writeFile(
			'data/raw/innocence-full.json',
			JSON.stringify( entries, null, 2 ),
			function ( error ) {
				if ( error ) {
					console.log( error );
				} else {
					console.log( 'file written.' );
				}
			}
		);
		//*/
	});
});
