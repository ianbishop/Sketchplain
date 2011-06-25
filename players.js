/*
*   INNER CLASS DEFINITION
*/

function Player(token) {
  this.token = token;
  this.createdAt = new Date().getTime();
  this.games = [];
  this.currentRound = {};
  this.roundInProgress = false;
  this.notifications = [];
}

Player.prototype.beginRound = function(round) {
  if(!this.roundInProgress) {
    this.games.push(round.id);
    this.currentRound = round;
    this.roundInProgress = true;
  }
  else
    console.log('Player: ' + player.token + ' - Attempted to begin round while round in progress');
};

Player.prototype.endRound = function() {
  if(this.roundInProgress) {
    this.currentRound = null;
    this.roundInProgress = false;
  }
  else
    console.log('Player: ' + player.token + ' - Attempted to end round with no round in progress');
};

Player.prototype.getNotifications = function() {
  var currentNotifications = this.notifications;
  this.notifications = [];
  return currentNotifications;
};

/*
*   PRIVATE VARIABLES / METHODS
*/
var rbytes = require('rbytes');

var players = {};

function generateToken() {
  var rbuff = rbytes.randomBytes(8);
  return rbuff.toHex();
}

function tokenInUse(token) {
  return (players[token] != null);
}

/*
*   PUBLIC METHODS
*/

exports.createPlayer = function() {
  var token;
  while(tokenInUse(token = generateToken()));
  console.log(players);
  players[token] = new Player(token);
  console.log(players);
  return token;
}

exports.getPlayer = function(token) {
  console.log(players);
  return players[token];
}

