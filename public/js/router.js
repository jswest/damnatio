DAB.Router = Backbone.Router.extend({

	// Define the routes.
	routes: {
		'': 'home',
    ':id/:slug': 'section'
	},

	home: function () {

	},

  section: function ( id, slug ) {
    /*for ( var i = 0; i <= id; i++ ) {
      DAB.sections[i].on();
    }*/
    var scrollTo = $('.section').eq( id ).offset().top;
    $('.section').off( 'inview', DAB.inviewHandler );
    $('.section').off( 'outview', DAB.outviewHandler );
    $('.content').animate( { scrollTop: scrollTo }, 10, function () {
      $('.section').on( 'inview', DAB.inviewHandler );
      $('.section').off( 'outview', DAB.outviewHandler );
    });
  }

});
