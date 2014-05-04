var	gssKeys 	 = require( '../data/gss-keys.json' )
,   gssHeader  = require( '../data/gss-header.json' )
,		gssAnswers = require( '../data/gss-answers.json' );

var getAnswersByYear = function ( rawAnswers ) {
	var dataByYear = {};
	for ( var i = 0; i < rawAnswers.length; i++ ) {
		var personsAnswers = rawAnswers[i];
		var year = personsAnswers[0] + '-01-01';
		if (
			personsAnswers[gssKeys.order.indexOf( 'deathPenalty' )] === 'Favor' ||
			personsAnswers[gssKeys.order.indexOf( 'deathPenalty' )] === 'Oppose' ||
			personsAnswers[gssKeys.order.indexOf( 'deathPenalty' )] === 'Don\'t Know'
		) {
			if ( !dataByYear[year] ) {
				dataByYear[year] = [ personsAnswers ];
			} else {
				dataByYear[year].push( personsAnswers );
			}
		}
	}
	return dataByYear;
}

getYearlyAverages = function ( data, facet, segment ) {
	var returnData = [];

	console.log( segment );

	for ( var i = 0; i < gssKeys.keys["Year of Survey [#Core]"].length; i++ ) {
		var year = gssKeys.keys["Year of Survey [#Core]"][i] + '-01-01';
		var yearlyFavor = 0;
		var facetTotal = 0;
		for ( var j = 0; j < data[year].length; j++ ) {
			if ( facet !== 'all' && facet ) {
				if ( data[year][j][gssKeys.order.indexOf( facet )] === segment ) {
					facetTotal++;
					if ( data[year][j][gssKeys.order.indexOf( 'deathPenalty' )] === 'Favor' ) {
						yearlyFavor++;
					}
				}		
			} else {
				facetTotal++;
				if ( data[year][j][gssKeys.order.indexOf( 'deathPenalty' )] === 'Favor' ) {
					yearlyFavor++;
				}
			}
		}
		var favorAverage = Math.round( ( yearlyFavor / facetTotal ) * 100 );
		returnData.push( {
			"year": year,
			"favor": favorAverage,
		} );
	}
	return returnData;
};

exports.support = function ( req, res ) {
	var segment = req.query.segment;
	var facet = req.query.facet;
	var data = getAnswersByYear( gssAnswers );
	res.send( getYearlyAverages( data, facet, segment ) );
}