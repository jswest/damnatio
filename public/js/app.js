var Section = function ( settings ) {
	var that = this;

	var padding = {
		"top": 50,
		"right": 10,
		"bottom": 100,
		"left": 100
	};

	var line;
	var ww = $(window).width()
	,		wh = $(window).height();

	var svg = d3.select( '.svg-wrapper' )
		.append( 'svg' )
		.attr( 'width', ww )
		.attr( 'height', wh ); 
	var xScale = d3.time.scale()
		.domain( [ new Date( '1974-01-01' ), new Date( '2012-01-01' ) ] )
		.range( [ padding.left, ww - padding.left - padding.right ] );
	var yScale = d3.scale.linear()
		.domain( [ 100, 0 ] )
		.range( [ padding.top, wh - padding.top - padding.bottom ] );
	var colorScale = d3.scale.category20();

	this.buildSVG = function () {


	};

	this.buildAxes = function () {
		var xAxis = d3.svg.axis()
			.scale( xScale )
			.orient( 'bottom' )
			.ticks( d3.time.years, 2 )
		svg.append( 'g' ).attr( 'class', 'x-axis' );
		svg.select( 'g.x-axis' )
			.call( xAxis )
			.attr( 'transform', 'translate(0,' + ( wh - padding.bottom ) + ')' );

		var yAxis = d3.svg.axis()
			.scale( yScale )
			.orient( 'left' )
			.ticks( 5 )
			.tickSize( -( ww - padding.left - padding.right ) );
		svg.append( 'g' ).attr( 'class', 'y-axis' );
		svg.select( 'g.y-axis' )
			.call( yAxis )
			.attr( 'transform', 'translate(' + ( padding.left ) + ',0)' );
	};

	this.createLine = function () {
		line = d3.svg.line()
			.x( function ( d ) {
				return xScale( new Date( d.year ) );
			})
			.y( function ( d ) {
				return yScale( d.favor );
			})
			.interpolate( 'linear' );
	}

	this.drawLine = function ( data ) {
		path = svg.append( 'path' )
			.attr( 'class', 'line' )
			.transition()
			.duration( 2000 )
			.attr( 'stroke', colorScale( 0 ) )
			.attr( 'd', line( data ) )
	};



	this.on = function () {
		that.buildSVG();
		that.buildAxes();
		that.createLine();
		that.drawLine([
			{ "date": "1974-01-01", "favor": 0 },
			{ "date": "2012-01-01", "favor": 0 }
		]);
		d3.json( settings.url, function ( data ) {
			that.drawLine( data );
		});
	};

};

$(document).ready( function () {
	var section = new Section({
		"url": '/support'
	});
	section.on();
});