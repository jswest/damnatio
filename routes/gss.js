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

getYearlyAverages = function ( data, field ) {
	var returnData = [];

	for ( var i = 0; i < gssKeys.keys["Year of Survey [#Core]"].length; i++ ) {
		var year = gssKeys.keys["Year of Survey [#Core]"][i] + '-01-01';
		var yearlyFavor = 0;
		var yearlyOppose = 0;
		var yearlyDontKnow = 0;
		for ( var j = 0; j < data[year].length; j++ ) {
			if ( data[year][j][gssKeys.order.indexOf( 'deathPenalty' )] === 'Favor' ) {
				yearlyFavor++;
			}
			else if ( data[year][j][gssKeys.order.indexOf( 'deathPenalty' )] === 'Oppose' ) {
				yearlyOppose++;
			}
			else if ( data[year][j][gssKeys.order.indexOf( 'deathPenalty' )] === 'Don\'t Know' ) {
				yearlyDontKnow++;
			}
		}
		var favorAverage = Math.round( ( yearlyFavor / data[year].length ) * 100 );
		var opposeAverage = Math.round( ( yearlyOppose / data[year].length ) * 100 );
		var dontKnowAverage = Math.round( ( yearlyDontKnow / data[year].length ) * 100 );
		returnData.push( {
			"year": year,
			"favor": favorAverage,
			"oppose": opposeAverage,
			"dontKnow": dontKnowAverage 
		} );
	}
	return returnData;
};

exports.support = function ( req, res ) {
	var data = getAnswersByYear( gssAnswers );
	res.send( getYearlyAverages( data ) );
}