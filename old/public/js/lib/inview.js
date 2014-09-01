DAB.inviewHandler = function ( e ) {
  DAB.location = $(this).data( 'location' );
  DAB.router.navigate( '/' + DAB.location + '/' + $(this).data( 'slug' ) );
  for ( var i = 0; i <= DAB.location; i++ ) {
    if ( !$('.section').eq( i ).data( 'loaded' ) ) {
      DAB.sections[i].on();
      $('.section').eq( i ).data( 'loaded', 'true' );
    }
  }  if ( typeof ga === "function" ) {
    ga('send', 'pageview', {
      'page': '/' + DAB.location + '/' + $(this).data( 'slug' ),
      'title': $(this).data( 'slug' )
    });
  }
};

DAB.outviewHandler = function ( e ) {
};

DAB.scrollHandler = function ( e ) {

  // Set up events for each of the sections.
  $('.section').each( function() {

    var offset = $(this).offset().top
    ,   inview = $(this).data( 'inview' )
    ,   height = $(this).height()
    ,   wh     = $(window).height();

    // If we're entering view from top _or_ bottom.
    if ( offset <= wh && offset + height > wh && ! inview ) {
      $(this).data( 'inview', 'true' );
      $(this).trigger( 'inview' );
    }

    // If we're exiting view from top _or_ bottom.
    if ( (offset + height < wh && inview) || (offset > wh && inview) ) {
      $(this).data( 'inview', '' );
      $(this).trigger( 'outview' );        
    }
  }); 

};