var express    = require('express')
,   path       = require('path')
,   http       = require('http')
,   fs         = require('fs')
,   app        = express();



// Configure the app.
app.configure( function () {
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('html', require('ejs').__express);
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
  app.use(app.router);
});

app.get( '/', function (req, res) {
  res.render('index.html');
});
app.get('/last-words.json', function (req, res) {
  res.send(require('./data/interludes/last-words/last-words.json'));
});

// Start yer engines.
http
  .createServer(app)
  .listen(app.get('port'), function () {
    console.log('Engines started on port ' + app.get('port'));
  });