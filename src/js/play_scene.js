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

    players[1].addUnit(this.game, "infantry", 0, 1, gameMap);
    players[1].addUnit(this.game, "archer", 0, 2, gameMap);
    players[1].addUnit(this.game, "cavalry", 0, 3, gameMap);
    players[1].addUnit(this.game, "infantry", 0, 4, gameMap);
    players[1].addUnit(this.game, "archer", 0, 5, gameMap);
    players[1].addUnit(this.game, "cavalry", 0, 6, gameMap);
    players[1].addUnit(this.game, "infantry", 0, 7, gameMap);
    players[1].addUnit(this.game, "archer", 0, 8, gameMap);
    players[1].addUnit(this.game, "cavalry", 0, 9, gameMap);
    players[1].addUnit(this.game, "infantry", 0, 10, gameMap);


    players[0].addUnit(this.game, "infantry", 24, 9, gameMap);
    players[0].addUnit(this.game, "archer", 24, 10, gameMap);
    players[0].addUnit(this.game, "cavalry", 24,11, gameMap);
    players[0].addUnit(this.game, "infantry", 24, 12, gameMap);
    players[0].addUnit(this.game, "archer", 24, 13, gameMap);
    players[0].addUnit(this.game, "cavalry", 24, 14, gameMap);
    players[0].addUnit(this.game, "infantry", 24, 15, gameMap);
    players[0].addUnit(this.game, "archer", 24, 16, gameMap);
    players[0].addUnit(this.game, "cavalry", 24, 17, gameMap);
    players[0].addUnit(this.game, "infantry", 24, 18, gameMap);
    


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
