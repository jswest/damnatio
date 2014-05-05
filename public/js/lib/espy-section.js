DAB.EspySection = function () {

  var that = this;
  var ww = $(window).width()
  ,   wh = $(window).height();
  var padding = {
    top: 50,
    right: 10,
    bottom: 100,
    left: 100
  };

  var svg = d3.select( '#espy-method' ).append( 'svg' )
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


  this.on = function () {

    d3.json( '/method', function ( data ) {

      var stackedData = [];
      var methods = [
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
      for ( var i = 0; i < methods.length; i++ ) {
        methodArray = [];
        for ( var j = 0; j < data.length; j++ ) {
          var yearEntry = { "x": data[j].year, "y": data[j][methods[i]], "method": methods[i] };
          methodArray.push( yearEntry );
        }
        stackedData.push( methodArray );
      }

      var stack = d3.layout.stack();
      var stackedData = stack( stackedData );

      var groups = svg.selectAll( 'g.layer' )
        .data( stackedData )
        .enter()
        .append( 'g' )
        .style( 'fill', function ( d, i ) { return colorScale( i ); } )
        .attr( 'id', function ( d, i ) {
          return i;
        });
  
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
      $('#espy-method').find( 'rect' )
        .on( 'mouseover', function ( e ) {
          var datum = d3.select( this ).datum();
          var inspectorString = 
            '<div class="inspector">' + datum.method + '</div>';
          $('#espy-method').append( inspectorString );
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

/*
      var area = d3.svg.area()
        .x( function( d ) { return xScale( new Date( d.x ) ); } )
        .y0( function( d ) { return yScale( d.y ); } )
        .y1(function( d ) { return yScale( d.y0 ) + yScale( d.y0 + d.y ); } );

      svg.selectAll( "path" )
        .data( stackedData )
        .enter()
        .append( "path" )
        .attr( "d", area )
        .style( "fill", function( d, i ) { return colorScale( i ); } );

      $('#espy-method').find( 'path' )
        .on( 'mouseover', function ( e ) {
          var datum = d3.select( this ).datum();
          var inspectorString = 
            '<div class="inspector">' + datum.method + '</div>';
          $('#espy-method').append( inspectorString );
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
*/

      /*
      var bars = svg.selectAll( 'rect' )
        .data( data )
        .enter();
      bars.append( 'rect' )
        .attr( "x", function( d ) { return xScale( new Date( d.year ) ); } )
        .attr( "y", function( d ) { return wh - yScale( d["Hanging"] ); } )
        .attr( "width", function ( d ) {
         return xScale( new Date( '1609-01-01' ) ) - xScale( new Date( '1608-01-01' ) );
        } )
        .attr( "height", function( d ) { return yScale( d["Hanging"] ); } )
        .style( "fill", colorScale( 0 ) );
      bars.append( 'rect' )
        .attr( 'x', function ( d ) { return xScale( new Date( d.year ) ); } )
        .attr( 'y', function ( d ) { return wh - yScale( d["Hanging"] ) - yScale( d["Electrocution"] ); } )
        .attr( "width", function ( d ) {
         return xScale( new Date( '1609-01-01' ) ) - xScale( new Date( '1608-01-01' ) );
        } )
        .attr( "height", function ( d ) { return yScale( d["Electrocution"] ) } )
        .style( "fill", colorScale( 1 ) );
      bars.append( 'rect' )
        .attr( 'x', function ( d ) { return xScale( new Date( d.year ) ); } )
        .attr( 'y', function ( d ) { return wh - yScale( d["Hanging"] ) - yScale( d["Electrocution"] ) - yScale( d["Injection"] ); } )
        .attr( "width", function ( d ) {
         return xScale( new Date( '1609-01-01' ) ) - xScale( new Date( '1608-01-01' ) );
        } )
        .attr( "height", function ( d ) { return yScale( d["Injection"] ) } )
        .style( "fill", colorScale( 2 ) );
      bars.append( 'rect' )
        .attr( 'x', function ( d ) { return xScale( new Date( d.year ) ); } )
        .attr( 'y', function ( d ) { return wh - yScale( d["Hanging"] ) - yScale( d["Electrocution"] ) - yScale( d["Injection"] ) - yScale( d["Shot"] ); } )
        .attr( "width", function ( d ) {
         return xScale( new Date( '1609-01-01' ) ) - xScale( new Date( '1608-01-01' ) );
        } )
        .attr( "height", function ( d ) { return yScale( d["Shot"] ) } )
        .style( "fill", colorScale( 3 ) );
      */
    });
  };
};
