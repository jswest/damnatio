DAB = {};
$(document).ready( function () {
	var section = new DAB.GSSSection({
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
	section.on();

	var section = new DAB.GSSSection({
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
	section.on();

	var section = new DAB.GSSSection({
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
	section.on();

	var section = new DAB.GSSSection({
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
	section.on();
});