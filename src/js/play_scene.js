'use strict';
var cursor = require('./Cursor.js');
var map = require('./Map.js');
var player = require('./Player.js');
var square = require('./Square.js');
var units = require('./Units.js');

var turn = 1;
var playingPlayer = 1; // jugador que juega en cada momento
var playerNumber = 2;
var players = new Array(playerNumber);

var mapWidth = 25;
var mapHeight = 19;
var squareWidth = 800 / (mapWidth);
var squareHeight = 600 / (mapHeight);

for (var i = 0; i < playerNumber; i++) {
  players[i] = new player(i + 1, 0);
}

var gameMap;
var gameCursor;

var calltime = 5;
var call = 0;

var skipTurn = false;

var PlayScene = {
  create: function () {

    var tileset = this.game.add.sprite(0, 0, 'tileset');
    gameMap = new map(this.game, mapWidth, mapHeight, squareWidth, squareHeight);
    gameCursor = new cursor(this.game, 10, 10, squareWidth, squareHeight);
    players[0].addUnit(this.game, "infantry", 1, 4, gameMap);
    players[0].addUnit(this.game, "archer", 2, 8, gameMap);
    players[0].addUnit(this.game, "cavalry", 3, 12, gameMap);
    players[0].addUnit(this.game, "worker", 4, 16, gameMap);

    players[1].addUnit(this.game, "infantry", 22, 7, gameMap);
    players[1].addUnit(this.game, "archer", 21, 3, gameMap);
    players[1].addUnit(this.game, "cavalry", 4, 8, gameMap);
    players[1].addUnit(this.game, "worker", 19, 11, gameMap);

    players[0].addUnit(this.game, "cavalry", 11, 10, gameMap);
    players[1].addUnit(this.game, "cavalry", 9, 10, gameMap);
    players[0].addUnit(this.game, "town", 10, 10, gameMap);

  },


  update: function () {
    call++;
    if (call >= calltime) {
      skipTurn = gameCursor.handleEvents(this.game, gameMap, players, playingPlayer);

      if (skipTurn)
        this.skipTurn();
      call = 0;
    }
  },

  skipTurn: function () {
    turn++;

    if (playingPlayer == 1)
      playingPlayer = 2;
    else
      playingPlayer = 1;

    for (var i = 0; i < playerNumber; i++) {
      players[i].resetUnitUse();
    }

    console.log("turn skip. playing " + playingPlayer);
  }
};

module.exports = PlayScene;
