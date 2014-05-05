DAB.DPICSection = function ( settings ) {

  var that = this;

  var ww = $(window).width()
  ,   wh = $(window).height()

  var padding = {
    top    : 50,
    right  : 10,
    bottom : 100
    left   : 100
  };

  var svg = d3.select( settings.el[0] ).append( 'svg' )
    .attr( 'width', ww )
    .attr( 'height', wh );

  var xScale     = d3.time.scale()
    .domain( [ new Date( '1977-01-01' ), new Date( '2015-01-01' ) ] )
    .range( [ padding.left, ww - padding.left - padding.right ] )
  ,   yScale     = d3.scale.linear()
    .domain( [ 200, 0 ] )
    .range( [ padding.top, wh - padding.bottom ] )
  ,   colorScale = d3.scale.category20();

  var xAxis = d3.svg.axis()
    .scale( xScale )
    .orient( 'bottom' )
    .ticks( 10 )
  svg.append( 'g' ).attr( 'class', 'x-axis' );
  svg.select( 'g.x-axis' )
    .call( xAxis )
    .attr( 'transform', 'translate(0,' + ( wh - padding.bottom ) + ')' )
  ,   yAxis = d3.svg.axis()
    .scale( yScale )
    .orient( 'left' )
    .ticks( 5 )
    .tickSize( -ww + padding.left + padding.right + padding.left );
  svg.append( 'g' ).attr( 'class', 'y-axis' );
  svg.select( 'g.y-axis' )
    .call( yAxis )
    .attr( 'transform', 'translate(' + ( padding.left ) + ',0)' );


};