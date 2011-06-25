/*
*   INNER CLASS DEFINITION
*/

function Game(id, startSentence) {
  this.id = id;
  this.createdAt = new Date().getTime();
  this.rounds = [];
  this.roundInProgress = false;
  this.currentType = 'EXPLAIN';
  this.finished = false;
  this.startSentence = startSentence;
}

Game.prototype.beginRound = function(playerToken) {
  if(!this.roundInProgress) {
    var roundId = this.rounds.length + 1;
    this.currentType = (this.currentType == 'EXPLAIN') ? 'DRAW' : 'EXPLAIN';
    
    var lastRound;
    if(this.rounds.length > 1)
      lastRound = this.rounds[this.rounds.length-1].content;
    else
      lastRound = this.startSentence;
    
    var round = {
      token: playerToken,
      roundId: roundId,
      type: this.currentType,
      lastRound: lastRound,
      content: null,
      createdAt: new Date().getTime()
    };
  
    this.rounds.push(round);
    this.roundInProgress = true;
    
    var playerRound =  {
      id: this.id,
      roundId: roundId,
      type: this.currentType,
      lastRound: lastRound,
      createdAt: round.createdAt
    };
    
    return playerRound;
  }
  else
    console.log('GAME: ' + this.id + ', ROUND: ' + this.rounds[this.rounds.length-1].roundId + ' - Attempted round begin for game with round in progress.');
};

Game.prototype.endRound = function(roundContent) {
  if(this.roundInProgress) {
    this.rounds[rounds.length - 1].content = roundContent;
    this.roundInProgress = false;
    
    // ok, now check if the game is done
    if(rounds.length >= 7) {
      game.finished = true;
      console.log('GAME: ' + this.id + ' - Has been finished.');
    }
  }
  else
    console.log('GAME: ' + this.id + ' - Attempted round end for game with no round in progress.');  // uh oh
};

/*
*   PRIVATE VARIABLES / METHODS
*/

var rbytes = require('rbytes');

var pool = [];
var activeGames = {};
var finishedGames = {};

function generateId() {
  var rbuff = rbytes.randomBytes(16);
  return rbuff.toHex();
}

function idInUse(id) {
  return (activeGames[id] != null && finishedGames[id] != null);
}

// TODO: FINISH THIS
function getStartSentence() {
  return "TEST";
}

function createGame() {
  var id;
  while(idInUse(id = generateId()));
  var game = new Game(id, getStartSentence());
  activeGames[id] = game;
  return game;
}

/*
*   PUBLIC METHODS
*/

exports.getGame = function() {
  if(pool.length > 0)
    return pool.shift();
  else
    return createGame();
}

exports.getGameById = function(id) {
  return (activeGames[id] == null) ? finishedGames[id] : activeGames[id];
}

exports.putGame = function(game) {
  if(game.finished == true) {
    var id = game.id;
    delete activeGames[id];
    finishedGames[id] = game;
    
    // TODO: FINISH THIS
    // render final png
    var finalImage = "TEST";
    
    // notify players
    var notification = { id: game.id, image: finalImage };
    var length = game.rounds.length;
    for(var i=0; i < length; i++) {
      var player = players.getPlayer(game.rounds[i].token);
      player.notifications.push(notification);
    }
  }
  else
    pool.push(game);
}