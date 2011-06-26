
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();

// My stuff
var players = require('./players');
var games = require('./games');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.errorHandler());
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

// Helpers

function wrapResponse(response, notifications) {
  return JSON.stringify([response, notifications]);
}

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Sketchplain'
  });
});

// authenticate 
app.post('/authenticate', function(req, res){
  var token = req.body.token;
  console.log(token);
  if(!token || !players.getPlayer(token)) {
    token = players.createPlayer();
  }
  console.log(token);
  
  // send back player
  var player = players.getPlayer(token);
  
  res.send(wrapResponse(player, player.getNotifications()));
});

// game handler
app.all('/game/:token', function(req, res, next){
  // console.log(players);
  req.player = players.getPlayer(req.params.token);
  
  if(req.player)
    next();
  else
    next(new Error('cannot find player ' + req.params.token));
});

// get a game
app.get('/game/:id', function(req, res){
  var game = games.getGame();
  var player = req.player;
  var round = game.beginRound(player);
  
  player.beginRound(round);
  
  res.send(wrapResponse(round, player.getNotifications()));
});

// play handler
app.all('/play', function(req, res, next){
  req.player = players.getPlayer(req.body.token);
  if(!req.player)
    next(new Error('cannot find player ' + req.body.token));

  req.game = games.getGameById(req.body.id);
  if(!req.game)
    next(new Error('cannot find game ' + req.body.id));
  
  req.content = req.body.content;
  if(!req.content)
    next(new Error('no content was provided in play'));

  next();
})

// make a play 
app.post('/play', function(req, res){
  var player = req.player, game = req.game, content = req.content;
  
  game.endRound(content);
  player.endRound();
  games.putGame(game);
  
  res.send(wrapResponse({ message: 'SUCCESS' }, player.getNotifications()));
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
