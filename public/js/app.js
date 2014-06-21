$(document).ready( function () {

	var dataService = new DAB.DataService();
	var sectionRegistry = new DAB.SectionRegistry(dataService);

	sectionRegistry.registerSection(
		$('#gss-race-section'),
		new DAB.sections.GssRaceSection({ element: $('#gss-race-section') })
	);
	sectionRegistry.registerSection(
		$('#modern-executions'),
		new DAB.sections.ModernExecutionsSection({ element: $('#modern-executions') })
	);

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