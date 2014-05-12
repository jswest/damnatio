var express    = require( 'express' )
,   path       = require( 'path' )
,   http       = require( 'http' )
,   app        = express();

var section    = require( './app/routes/section' );
require( './app/data/server' );
var dataServer = new dab.data.Server();

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
// TODO figure out why param capturing isn't working
app.get( '/_/:key', _.bind(dataServer.get, dataServer) );


// Start yer engines.
http
  .createServer( app )
  .listen( app.get( 'port' ), function () {
    console.log( 'Engines started on port ' + app.get( 'port' ) );
  });