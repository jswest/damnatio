var	gssAnswers = require( '../data/gss-death-penalty.json' );

var names = {
	"year": "Year of Survey [#Core]",
	"sex": "Sex [#Demographic #Core]",
	"grade": "Highest Grade Completed [#Demographic]",
	"degree": "Highest Degree Received [#Demographic #Core]",
	"party": "Political Party (Condensed) [#Politics #Core]",
	"politics": "Liberalism-Conservatism (Condensed) [#Politics #Core]",
	"deathPenalty": "Death Penalty for Murderers [#Govt]",
	"race": "Race (Original) [#Demographic #Race]",
	"religion": "Religious Preference (Condensed) [#Relig #Demographic #Core]"
};


var sortDataIntoYears = function ( answers ) {

	// sort the data into an object that looks like this:
	// {
	//   "1974": [ {}, {}, {}, etc. ],
	// 	 etc.
	// }
	dataByYear = {};
	for ( var i = 0; i < answers.length; i++ ) {
		var year = answers[i]["Year of Survey [#Core]"];
		var deathPenaltyAnswer = answers[i]["Death Penalty for Murderers [#Govt]"];
		if ( deathPenaltyAnswer === 'Favor' || deathPenaltyAnswer === 'Oppose' || deathPenaltyAnswer === 'Don\'t Know' ) {
			if ( !dataByYear[year] ) {
				dataByYear[year] = [ answers[i] ];
			} else {
				dataByYear[year].push( answers[i] );
			}
		}
	}
	return dataByYear;

};

var getYearlyAverages = function ( data, facet, segment ) {

	var cleanData = [];
	for ( var i = 1974; i <= 2012; i++ ) {
		var year = i.toString();
		if ( data[year] ) {
			var yearlyFavor = 0;
			var facetTotal = 0;
			for ( var j = 0; j < data[year].length; j++ ) {
				if ( segment !== 'all' && facet ) {
					if ( data[year][j][names[facet]] === segment ) {
						facetTotal++;
						if ( data[year][j]["Death Penalty for Murderers [#Govt]"] === 'Favor' ) {
							yearlyFavor++;
						}
					}
				} else {
					facetTotal++;
					console.log( data[year][j]["Death Penalty for Murderers [#Govt]"] );
					if ( data[year][j]["Death Penalty for Murderers [#Govt]"] === 'Favor' ) {
						yearlyFavor++;
					}
				}
			}
			var favorAverage = Math.round( ( yearlyFavor / facetTotal ) * 100 );
			cleanData.push( { "year": year, "favor": favorAverage } );
		}
	}
	return cleanData;
};

exports.support = function ( req, res ) {
	var segment = req.query.segment;
	var facet = req.query.facet;
	var data = sortDataIntoYears( gssAnswers );
	res.send( getYearlyAverages( data, facet, segment ) );
}