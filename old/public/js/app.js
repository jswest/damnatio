$(document).ready( function () {

	var dataService = new DAB.DataService();
	var sectionRegistry = new DAB.SectionRegistry(dataService);

	sectionRegistry.registerSection(
			$('#gss-sex-section'),
			new DAB.sections.GssRaceSection({ element: $('#gss-sex-section') }));

	// Render the skeletons.
	sectionRegistry.renderSections();

	DAB.router = new DAB.Router();
	Backbone.history.start({
		pushState: true,
		root: '/'
	});

	// Manually trigger first data load.
	sectionRegistry.handleScroll();

});