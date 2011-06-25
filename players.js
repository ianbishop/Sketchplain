var rbytes = require('rbytes');

var players = {};

function Player(token) {
  this.token = token;
  this.createdAt = new Date().getTime();
}

function generateToken() {
  var rbuff = rbytes.randomBytes(16);
  return rbuff.toHex();
}

function tokenInUse(token) {
  return (players.token != null);
}

exports.createPlayer = function() {
  var token;
  while(tokenInUse(token = generateToken()));
  players.token = new Player(token);
  return token;
}

exports.getPlayer = function(token) {
  return players.token;
}

