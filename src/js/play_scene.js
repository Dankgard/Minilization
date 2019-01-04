'use strict';
var cursor = require('./Cursor.js');
var map = require('./Map.js');
var player = require('./Player.js');
var square = require('./Square.js');
var units = require('./Units.js');

var PlayScene = {
  create: function () {
    this.game.sound.stopAll();

    this.turn = 1;
    this.playingPlayer = 1; // jugador que juega en cada momento
    this.playerNumber = 2;
    this.players = new Array(this.playerNumber);

    this.mapWidth = 25;
    this.mapHeight = 19;
    this.squareWidth = 800 / (this.mapWidth);
    this.squareHeight = 600 / (this.mapHeight);

    for (var i = 0; i < this.playerNumber; i++) {
      this.players[i] = new player(this.game, i + 1, 0);
    }

    this.gameMap;
    this.gameCursor;

    this.calltime = 5;
    this.call = 0;

    this.skipTurn = false;

    this.createHUD();

    var tileset = this.game.add.sprite(50, 0, 'tileset');
    this.gameMap = new map(this.game, this.mapWidth, this.mapHeight, this.squareWidth, this.squareHeight);

    this.createArmies();

    this.gamemusic = this.game.add.audio('gametheme');
    this.gamemusic.loop = true;
    this.gamemusic.play();

    this.skipturnSound = this.game.add.audio('skipturn');
  },


  update: function () {
    this.call++;
    if (this.call >= this.calltime) {
      this.skipTurn = this.gameCursor.handleEvents();

      if (this.skipTurn)
        this.skipTurne();
      this.call = 0;
    }
  },

  createHUD: function() {
    this.blueStyle = { font: "20px Arial", fill: "#3366ff" };
    this.blueStyle2 = { font: "8px Arial", fill: "#3366ff" };
    this.blueGold = this.game.add.text(8, 31, this.players[0].money, this.blueStyle);
    this.blueGoldText = this.game.add.text(13, 15, "GOLD", this.blueStyle2);
    this.blueCoin = this.game.add.sprite(25, 30, 'bluecoin');
    this.blueCoin.scale.setTo(0.75,0.75);
    this.blueCoin.animations.add('bluespin',[0,1,2,3,4,5,6,7,8], 7, true);
    this.blueCoin.animations.play('bluespin');
    this.redStyle = { font: "20px Arial", fill: "#ff0000" };
    this.redStyle2 = { font: "8px Arial", fill: "#ff0000" };
    this.redGold = this.game.add.text(900 - 42, 31, this.players[1].money, this.redStyle);
    this.redGoldText = this.game.add.text(900 - 37, 15, "GOLD", this.redStyle2);
    this.redCoin = this.game.add.sprite(900 - 25, 30, 'redcoin');
    this.redCoin.scale.setTo(0.75,0.75);
    this.redCoin.animations.add('redspin',[0,1,2,3,4,5,6,7,8], 7, true);
    this.redCoin.animations.play('redspin');
    this.yellowStyle = { font: "8px Arial", fill: "#ffff00" };
    this.playing = this.game.add.text(10, 580, "PLAYING", this.yellowStyle);
  },

  createArmies: function() {
    var y = Math.round(Math.random() * (this.mapHeight - 1));
    this.players[0].addUnit(this.game, "town", 0, y, this.gameMap, true);
    var y = Math.round(Math.random() * (this.mapHeight - 1))
    this.players[1].addUnit(this.game, "town", this.mapWidth - 1, y, this.gameMap, true);

    this.player1Town = this.players[0].units[0];
    this.player2Town = this.players[1].units[0];
    this.gameCursor = new cursor(this.game, 10, 10, this.squareWidth, this.squareHeight, this.gameMap, this.players, this.playingPlayer, this.player1Town, this.player2Town);

    var y = Math.round(Math.random() * (this.mapHeight - 1))
    this.players[0].addUnit(this.game, "worker", 0, y, this.gameMap, true);
    this.players[0].addUnit(this.game, "infantry", 0, this.mapHeight - y - 1, this.gameMap, true);

    var y = Math.round(Math.random() * (this.mapHeight - 1))
    this.players[1].addUnit(this.game, "worker", 24, y, this.gameMap, true);
    this.players[1].addUnit(this.game, "infantry", 24, this.mapHeight - y - 1, this.gameMap, true);
  },

  skipTurne: function () {

    this.players[this.playingPlayer - 1].resetUnitUse();
    this.players[this.playingPlayer - 1].workerWork(this.gameMap);
    this.players[this.playingPlayer - 1].towerAttack(this.gameMap);

    this.blueGold.setText(this.players[0].money);
    this.redGold.setText(this.players[1].money);

    this.turn++;

    if (this.playingPlayer == 1)
    {
      this.playingPlayer = 2;
      this.playing.position.x = 900 - 40;
    }
    else
    {
      this.playingPlayer = 1;
      this.playing.position.x = 10;
    }

    this.skipTurn = false;
    this.skipturnSound.play();

    console.log("turn skip. playing " + this.playingPlayer);
  },  
};

module.exports = PlayScene;
