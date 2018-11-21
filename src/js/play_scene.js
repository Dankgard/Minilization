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

var width = 25;
var height = 19;

    for(var i=0;i<playerNumber;i++)
    {
      players[i] = new player(i+1,0);
    }

var PlayScene = {
  create: function () {    

    var tileset = this.game.add.sprite(0,0,'tileset');
    var gameMap = new map(this.game,width,height);
    var archer = new units.Archer(this.game, 0, 0, 1, 0);
  }
};

module.exports = PlayScene;
