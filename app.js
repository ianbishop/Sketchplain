
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();

// My stuff
var players = require('./players');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'keyboard cat'}));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Vars

var active_games = [];
var games = {};

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Sketchplain'
  });
});

app.post('/authenticate', function(req, res){
  var token = req.body.token;
  if(!token || !players.getPlayer(token)) {
    token = players.createPlayer();
  }
  
  // send back player
  var player = players.getPlayer(token);
  res.send(JSON.stringify(player));
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
