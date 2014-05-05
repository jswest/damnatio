DAB.EspySection = function ( settings ) {

  var that = this;

  var buildMenu = function () {
    settings.el.append( '<ul class="menu clicked"><li class="control">' + settings.menuNicename + '</li></ul>' );
    var menu = settings.el.find( '.menu' );
    for ( var i = 0; i < settings.segments.length; i++ ) {
      var segmentString = 
        '<li data-index="' + ( i + 1 ) + '" data-segment-slug="' + settings.segmentSlugs[i] + '" data-segment="' + settings.segments[i] + '">' +
          '<div class="colorblock" style="background-color:transparent"></div>' +
          '<div class="name">' + settings.segments[i] + '</div>'
        '</li>'
      menu.append( segmentString );
    }
    menu.find( 'li' ).eq( 1 ).addClass( 'selected' );
  };

  var bindMenu = function () {
    var menu = settings.el.find( '.menu' );
    menu.find( 'li' ).on( 'click', function () {
      var li = $(this);
      if ( li.hasClass( 'control' ) ) {
        $('.menu').toggleClass( 'clicked' )
      } else {
        if ( li.hasClass( 'selected' ) ) {
          removeGraph();
        } else {
          d3.json( settings.url + '?segment=' + li.data( 'segment' ), function ( data ) {
            var stackedData = stackData( data, li.data( 'segment-slug' ) );
            createGraph( stackedData, li.data( 'segment-slug' ) );
          } );
        }
        li.toggleClass( 'selected' );   
      }
    });
  };





  var ww = $(window).width()
  ,   wh = $(window).height();
  var padding = {
    top: 50,
    right: 10,
    bottom: 100,
    left: 100
  };

  var svg = d3.select( '#espy-section' ).append( 'svg' )
    .attr( 'width', $(window).width() )
    .attr( 'height', $(window).height() );

  var xScale = d3.time.scale()
    .domain( [ new Date( '1608-01-01' ), new Date( '2002-01-01' ) ] )
    .range( [ padding.left, ww - padding.left - padding.right ] );
  var yScale = d3.scale.linear()
    .domain( [ 200, 0 ] )
    .range( [ padding.top, wh - padding.bottom ] );
  var colorScale = d3.scale.category20();

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

  var stack = d3.layout.stack();


  var removeGraph = function () {
    svg.selectAll( 'rect' )
      .transition()
      .duration( 200 )
      .attr( "y", yScale( 0 ) )
      .attr( "height", 0 )
      .remove();

    svg.selectAll( 'g.layer' )
      .remove()
  };

  var createGraph = function ( data, segment ) {

    console.log( "createGraph() called" );

    var stackedData = stack( data );

    var groups = svg.selectAll( 'g.layer' )
      .data( stackedData )
      .enter()
      .append( 'g' )
      .attr( 'class', 'layer' )
      .style( 'fill', function ( d, i ) { return colorScale( i ); } );

    var rects = groups.selectAll("rect")
      .data( function ( d ) { return d; } )
      .enter()
      .append( "rect" )
      .attr( "x", function( d, i ) {
        return xScale( new Date( d.x ) );
      })
      .attr( "width", xScale( new Date( '1609-01-01' ) ) - xScale( new Date( '1608-01-01' ) ) )
      .attr( "y", yScale( 0 ) )
      .attr( "height", 0 );

    rects
      .transition()
      .duration( 200 )
      .attr( "y", function( d ) {
        return yScale(d.y0 + d.y);
      })
      .attr( "height", function( d ) {
        return yScale( d.y0 ) - yScale( d.y0 + d.y ) ;
      });
    $('#espy-section').find( 'rect' )
      .on( 'mouseover', function ( e ) {
        var datum = d3.select( this ).datum();
        var inspectorString = 
          '<div class="inspector">' + datum[segment] + '</div>';
        $('#espy-section').append( inspectorString );
        if ( e.clientX > ww / 2 ) {
          var left = e.clientX - 200;
        } else {
          var left = e.clientX;
        }
        $('.inspector').css({
          'position': 'absolute',
          'top': e.clientY,
          'left': left,
        });
      })
      .on( 'mouseout', function () {
        $('.inspector').remove();
      });    
  };

  var stackData = function ( data, segment ) {
    var options = _.keys( data[0] );
    options.pop();

    var stackedData = [];

    for ( var i = 0; i < options.length; i++ ) {
      var optionArray = [];
      for ( var j = 0; j < data.length; j++ ) {
        var yearEntry = { "x": data[j].year, "y": data[j][options[i]] };
        yearEntry[segment] = options[i];
        optionArray.push( yearEntry );
      }
      stackedData.push( optionArray );
    }

    return stackedData;
  };

  this.on = function () {

    /*
    var options = [
      "Hanging",
      "Shot",
      "Electrocution",
      "Asphyxiation-Gas",
      "Injection",
      "Burned",
      "undefined",
      "Other",
      "Break on Wheel",
      "Hung in Chains",
      "Pressing",
      "Bludgeoned",
      "Gibbetted"
    ];
    */

    var segment = "method";

    buildMenu();
    bindMenu();

    d3.json( settings.url + '?segment=' + segment, function ( data ) {
      

      var stackedData = stackData( data, segment );
      createGraph( stackedData, segment );
    });
  };
};
