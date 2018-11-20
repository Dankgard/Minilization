'use strict';
var Cursor= require('./Cursor.js');
var Map= require('./Map.js');
var Player= require('./Player.js');
var Square= require('./Square.js');
var Units= require('./Units.js');

var PlayScene = {
  create: function () {    

    var tile = this.game.add.sprite(0,0,'tileset');    
    var arquero=this.game.add.sprite(0,0,'bluearcher');
    arquero.scale.setTo(2,2);
  }
};

class GameManager {
  constructor(turn, playingPlayer, playerNumber)
  {
    this.turn = turn;
    this.playingPlayer = playingPlayer;
    this.playerNumber = playerNumber;
    this.players = new Array(playerNumber);

    for(var i=0;i<playerNumber;i++)
    {
      players[i] = new Player(i,0);
    }
  }
}

module.exports = PlayScene;
