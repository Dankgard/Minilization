'use strict';
var cursor= require('./Cursor.js');
var map= require('./Map.js');
var player= require('./Player.js');
var square= require('./Square.js');
var units= require('./Units.js');

var turn = 0;
var playingPlayer = 1; // jugador que juega en cada momento
var playerNumber = 2;
var players = new Array(playerNumber);

var mapWidth = 25;
var mapHeight = 19;
var squareWidth = 800/(mapWidth);
var squareHeight = 600/(mapHeight);

    for(var i=0;i<playerNumber;i++)
    {
      players[i] = new player(i+1,0);
    }

var gameMap;
var gameCursor;

var calltime = 5;
var call = 0;

var PlayScene = {
  create: function () {    

    var tileset = this.game.add.sprite(0,0,'tileset');
    gameMap = new map(this.game,mapWidth,mapHeight, squareWidth, squareHeight);
    gameCursor = new cursor(this.game, 10, 10, squareWidth, squareHeight);
    players[0].addUnit(this.game, "infantry", 1, 4, gameMap);
  },

  
  update: function() {
    call++;
    if(call >= calltime)
    {
      gameCursor.handleEvents(this.game, gameMap);
      call = 0;
    }
  }
};

module.exports = PlayScene;
