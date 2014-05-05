DAB = {};
$(document).ready( function () {

	DAB.sections = [];


	var IntroSection = function () {
		var that = this;
		var wh = $(window).height();
		$('#intro-section').height( wh );
		this.on = function () {};
	};

	DAB.sections[0] = new IntroSection();

	DAB.sections[1] = new DAB.GSSSection({
		"el": $('#gss-sex-section'),
		"elName": 'gss-sex-section',
		"name": "sex",
		"nicename": "Sex",
		"menuNicename": "Sex",
		"facet": "sex",
		"segments": [
			"Female",
			"Male"
		],
		"segmentSlugs": [
			"female",
			"male"
		]
	});

	DAB.sections[2] = new DAB.GSSSection({
		"el": $('#gss-party-section'),
		"elName": 'gss-party-section',
		"name": 'party',
		"nicename": "Political Party",
		"menuNicename": "Political Party",
		"facet": "party",
		"segments": [
			"Democrat",
			"Republican",
			"Independent",
			"Other Party"
		],
		"segmentSlugs": [
			"democrat",
			"republican",
			"independent",
			"other-party"
		]
	});

	DAB.sections[3] = new DAB.GSSSection({
		"el": $('#gss-politics-section'),
		"elName": 'gss-politics-section',
		"name": 'politics',
		"nicename": "Political Affiliation",
		"menuNicename": "Political Affiliation",
		"facet": "politics",
		"segments": [
			"Moderate",
			"Conservative",
			"Liberal"
		],
		"segmentSlugs": [
			"moderate",
			"conservative",
			"liberal"
		]
	});

	DAB.sections[4] = new DAB.GSSSection({
		"el": $('#gss-education-section'),
		"elName": 'gss-education-section',
		"name": 'degree',
		"nicename": "Education Level",
		"menuNicename": "Education Level",
		"facet": "degree",
		"segments": [
			"Bachelor",
			"Less than High School",
			"High School",
			"Graduate",
			"Junior College"
		],
		"segmentSlugs": [
			"bachelor",
			"less-than-high-school",
			"high-school",
			"graduate",
			"junior-college"
		]
	});

	DAB.sections[5] = new DAB.EspySection({
		"el": $('#espy-section'),
		"url": "/espy",
		"menuNicename": "Segments",
		"segments": [
			"method",
			"race"
		],
		"segmentSlugs": [
			"method",
			"race"
		]
	});

	DAB.router = new DAB.Router();
	Backbone.history.start({
		pushState: true,
		root: '/'
	});

  $('.section').on( 'inview', DAB.inviewHandler );
  $('.section').on( 'outview', DAB.outviewHandler );
  DAB.debouncedScrollHandler = _.debounce( DAB.scrollHandler, 10 );
  $('.content').on( 'scroll', DAB.debouncedScrollHandler );


});