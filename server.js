var express 	 = require( 'express' )
,		path    	 = require( 'path' )
,   http    	 = require( 'http' )
,		app				 = express();

var section 	= require( './routes/section' )
,	  gss  		  = require( './routes/gss' )
,		espy			= require( './routes/espy' );

// Configure the app.
app.configure( function () {
	app.set( 'port', process.env.PORT || 5000 );
	app.set( 'views', __dirname + '/views' );
	app.set( 'view engine', 'jade' );
	app.use( express.logger() );
	app.use( express.bodyParser() );
	app.use( express.static( path.join( __dirname, 'public' ) ) );
	app.use( express.favicon( __dirname + '/public/images/favicon.ico' ) );
	app.use( app.router );
});

app.get( '/', section.home );
app.get( '/:id/:slug', section.home );
app.get( '/support', gss.support );
app.get( '/method', espy.method );

// Start yer engines.
http
	.createServer( app )
	.listen( app.get( 'port' ), function () {
		console.log( 'Engines started on port ' + app.get( 'port' ) );
	});