DAB.GSSSection = function ( settings ) {

  var that = this;

  var dummyData = [
    {
      "year": "1974-01-01",
      "favorPercentage": 0
    },
    {
      "year": "1976-01-01",
      "favorPercentage": 0
    },
    {
      "year": "1978-01-01",
      "favorPercentage": 0
    },
    {
      "year": "1980-01-01",
      "favorPercentage": 0
    },
    {
      "year": "1982-01-01",
      "favorPercentage": 0
    },
    {
      "year": "1984-01-01",
      "favorPercentage": 0
    },
    {
      "year": "1986-01-01",
      "favorPercentage": 0
    },
    {
      "year": "1988-01-01",
      "favorPercentage": 0
    },
    {
      "year": "1990-01-01",
      "favorPercentage": 0
    },
    {
      "year": "1993-01-01",
      "favorPercentage": 0
    },
    {
      "year": "1994-01-01",
      "favorPercentage": 0
    },
    {
      "year": "1996-01-01",
      "favorPercentage": 0
    },
    {
      "year": "1998-01-01",
      "favorPercentage": 0
    },
    {
      "year": "2000-01-01",
      "favorPercentage": 0
    },
    {
      "year": "2002-01-01",
      "favorPercentage": 0
    },
    {
      "year": "2004-01-01",
      "favorPercentage": 0
    },
    {
      "year": "2006-01-01",
      "favorPercentage": 0
    },
    {
      "year": "2008-01-01",
      "favorPercentage": 0
    },
    {
      "year": "2010-01-01",
      "favorPercentage": 0
    },
    {
      "year": "2012-01-01",
      "favorPercentage": 0
    }
  ];

  var buildMenu = function () {
    settings.el.append( '<ul class="menu clicked"><li class="control">' + settings.menuNicename + '</li></ul>' );
    var menu = settings.el.find( '.menu' );
    var noSegmentString =
      '<li data-index="0" class="selected" data-segment-slug="all" data-segment="all">' +
        '<div class="colorblock" style="background-color:' + colorScale( 0 ) + '"></div>' +
        '<div class="name">All</div>' +
      '</li>'
    menu.append( noSegmentString );
    for ( var i = 0; i < settings.segments.length; i++ ) {
      var segmentString =
        '<li data-index="' + ( i + 1 ) + '" data-segment-slug="' + settings.segmentSlugs[i] + '" data-segment="' + settings.segments[i] + '">' +
          '<div class="colorblock" style="background-color:' + colorScale( i + 1 ) + '"></div>' +
          '<div class="name">' + settings.segments[i] + '</div>'
        '</li>'
      menu.append( segmentString );
    }
  };

  var bindMenu = function () {
    var menu = settings.el.find( '.menu' );
    menu.find( 'li' ).on( 'click', function () {
      var li = $(this);
      if ( li.hasClass( 'control' ) ) {
        $('.menu').toggleClass( 'clicked' )
      } else {
        if ( li.hasClass( 'selected' ) ) {
          that.updateLine( li.data( 'segment-slug'), li.data( 'index' ), dummyData );
        } else {
          d3.json( '/_/random?key=gss&facet=' + settings.name + '&segment=' + li.data( 'segment' ), function ( data ) {
            that.updateLine( li.data( 'segment-slug' ), li.data( 'index' ), data );
          } );
        }
        li.toggleClass( 'selected' );
      }
    });
  };

  var line
  ,   path;
  var padding = {
    "top": 70,
    "right": 10,
    "bottom": 0,
    "left": 100
  };
  var ww = $(window).width()
  ,   wh = $(window).height();
  var svg = d3.select( '#' + settings.elName )
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

  var xAxis = d3.svg.axis()
    .scale( xScale )
    .orient( 'bottom' )
    .ticks( 5 )
  svg.append( 'g' ).attr( 'class', 'x-axis' );
  svg.select( 'g.x-axis' )
    .call( xAxis )
    .attr( 'transform', 'translate(0,' + ( wh - padding.top ) + ')' );

  var yAxis = d3.svg.axis()
    .scale( yScale )
    .orient( 'left' )
    .ticks( 10 )
    .tickSize( -ww + padding.left + padding.right + padding.left );
  svg.append( 'g' ).attr( 'class', 'y-axis' );
  svg.select( 'g.y-axis' )
    .call( yAxis )
    .attr( 'transform', 'translate(' + ( padding.left ) + ',0)' );

  this.createLine = function ( name, id ) {
    line = d3.svg.line()
      .x( function ( d ) {
        return xScale( new Date( d.year ) );
      })
      .y( function ( d ) {
        return yScale( d.favorPercentage );
      })
      .interpolate( 'linear' );
    path = svg.append( 'path' )
      .attr( 'stroke', 'rgb(150,150,150)' )
      .attr( 'class', 'line ' + name )
      .attr( 'd', line( dummyData ) );
  }

  this.updateLine = function ( name, id, data ) {
    svg.select( '.' + name )
      .transition()
      .duration( 800 )
      .attr( 'stroke', colorScale( id ) )
      .attr( 'd', line( data ) );
  };

  this.on = function () {
    buildMenu();
    bindMenu();
    // create the lines.
    that.createLine( 'all', 0 );
    for ( var i = 0; i < settings.segments.length; i++ ) {
      that.createLine( settings.segmentSlugs[i], i + 1 );
    }
    // update the first line.
    d3.json( '/_/thisdoesntmatter?key=gss&facet=all', function ( data ) {
      that.updateLine( 'all', 0, data );
    });
  };

};


