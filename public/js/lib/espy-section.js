DAB.EspySection = function ( settings ) {

  // a little of this; a little of that
  var that = this;

  // size variables
  var ww      = $(window).width()
  ,   wh      = $(window).height()
  ,   padding = {
    "top"    : 50,
    "right"  : 10,
    "bottom" : 100,
    "left"   : 100
  };

  // the SVG element and variable
  var svg = d3.select( settings.el[0] ).append( 'svg' )
    .attr( 'width', ww )
    .attr( 'height', wh );

  // scales & misc scale variables
  var xScale        = d3.time.scale()
    .domain( [ new Date( '1608-01-01' ), new Date( '2002-01-01' ) ] )
    .range( [ padding.left, ww - padding.left - padding.right ] )
  ,   yScale        = d3.scale.linear()
    .domain( [ 200, 0 ] )
    .range( [ padding.top, wh - padding.bottom ] )
  ,   colorScale    = d3.scale.category20();
  var oneYearsWidth = xScale( new Date( '1609-01-01' ) ) - xScale( new Date( '1608-01-01' ) );

  // axes
  var xAxis = d3.svg.axis()
    .scale( xScale )
    .orient( 'bottom' )
    .ticks( 10 )
  svg.append( 'g' ).attr( 'class', 'x-axis' );
  svg.select( 'g.x-axis' )
    .call( xAxis )
    .attr( 'transform', 'translate(0,' + ( wh - padding.bottom ) + ')' );
  var yAxis = d3.svg.axis()
    .scale( yScale )
    .orient( 'left' )
    .ticks( 5 )
    .tickSize( -ww + padding.left + padding.right + padding.left );
  svg.append( 'g' ).attr( 'class', 'y-axis' );
  svg.select( 'g.y-axis' )
    .call( yAxis )
    .attr( 'transform', 'translate(' + ( padding.left ) + ',0)' );

  // the stack
  var stack = d3.layout.stack();


  var createGraph = function ( data ) {
    var stackedData = stack( data );

    var groups = svg.selectAll( 'g.layer' )
      .data( stackedData )
      .enter()
      .append( 'g' ).attr( 'class', 'layer' )
      .style( 'fill', function ( d, i ) { return colorScale( i ); } );

    rects = groups.selectAll( 'rect' )
      .data( function ( d ) { return d; } )
      .enter()
      .append( 'rect' )
      .attr( 'x', function ( d, i ) {
        return xScale( new Date( d.x ) );
      })
      .attr( 'y', yScale ( 0 ) ) // let's animate them from 0 to their real position
      .attr( 'width', oneYearsWidth )
      .attr( 'height', 0 ); // ditto

    rects
      .transition()
      .duration( settings.animationDuration )
      .attr( 'y', function ( d ) { return yScale( d.y0 + d.y ); } ) // this is a bit of magic, as i don't really get the stack layout
      .attr( 'height', function ( d ) { return yScale( d.y0 ) - yScale( d.y0 + d.y ); } ); // ditto

    // for now, i'm using jQuery events because
    // (1) i'm lazy and
    // (2) i want to be able to access the e.clientX/e.clientY variables
    // here are the utility functions for all of this:
    // function to check for the best place to put the inspector
    var placeInspector = function ( e ) {
      var left
      ,   top
      ,   inspector = settings.el.find( '.inspector' );
      if ( e.clientX > ww / 2 ) {
        left = e.clientX - inspector.width();
      } else {
        left = e.clientX;
      }
      if ( e.clientY > wh / 2 ) {
        top = e.clientY - inspector.height()
      } else {
        top = e.clientY;
      }
      inspector.css( { 'top': top, 'left': left } );
    };
    // handler for the mouseover event
    var rectMouseoverHandler = function ( e ) {
      var datum = d3.select( this ).datum();

      // append the inspector with the label
      settings.el.append(
        '<div class="inspector">' + 
          datum[settings.segment] +
        '</div>'
      );

      placeInspector( e );
      $(this).on( 'mousemove', rectMousemoveHandler );
      $(this).on( 'mouseleave', rectMouseleaveHandler );
    };
    // handler for the mousemove event
    var rectMousemoveHandler = function ( e ) {
      placeInspector( e );
    }
    // handler for the mouseleave event
    var rectMouseleaveHandler = function ( e ) {
      $('.inspector').remove();
      $(this).off( 'mousemove', 'rectMousemoveHandler' );
      $(this).off( 'mouseleave', 'rectMouseleaveHandler' );
    };

    settings.el.find( '.layer' ).find( 'rect' )
      .on( 'mouseover', rectMouseoverHandler );
  };


  var beginStackingData = function ( data, segment ) {
    var options = _.keys( data[0] ); // get the fields we're turning into layers
    options.pop(); // eliminate the 'year' field because we don't want that to be a layer

    // interate over the options, which will become the "layers" of the stack
    // then, for each of them, iterate over the years worth of data
    // push the year's entry into a new array, which will have the structure:
    // [
    //    [ // array representing a group
    //      { "x": year, "y": value },
    //      etc.
    //    ],
    //    [ // array representing a group
    //      { "x": year, "y": value },
    //      etc.
    //    ],
    //    etc.
    // ]
    var initiallyStackedData = [];
    for ( var i = 0; i < options.length; i++ ) {
      var optionArray = [];
      for ( var j = 0; j < data.length; j++ ) {
        var entry = { "x": data[j].year, "y": data[j][options[i]] };
        entry[segment] = options[i];
        optionArray.push( entry );
      }
      initiallyStackedData.push( optionArray );
    }

    return initiallyStackedData;
  };

  this.on = function () {
    d3.json( settings.url + '?segment=' + settings.segment, function ( data ) {
      createGraph( beginStackingData( data, settings.segment ) );
    });
  };

};
