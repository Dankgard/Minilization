'use strict';

var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    this.game.load.image('logo', 'images/phaser.png');


    this.game.load.image('background', 'images/Menu/fondo.png');
    this.game.load.image('tutorial', 'images/Menu/comojugar.png');
    this.game.load.image('playbutton', 'images/Menu/Play.png');
    this.game.load.image('rulesbutton', 'images/Menu/Rules.png');
    this.game.load.image('returnbutton', 'images/Menu/atras.png');

    // Music
    this.game.load.audio('gametheme', 'sounds/gametheme.mp3');
    this.game.load.audio('menutheme', 'sounds/menutheme.mp3');
    this.game.load.audio('humanes', 'sounds/humanes.ogg');
    this.game.load.audio('algete', 'sounds/algete.ogg');

    // Sounds
    this.game.load.audio('attack', 'sounds/swing.wav');
    this.game.load.audio('move', 'sounds/cloth-heavy.wav');
    this.game.load.audio('skipturn', 'sounds/coin3.wav');
    this.game.load.audio('build', 'sounds/metal-small2.wav');
    this.game.load.audio('select', 'sounds/interface1.wav');
    this.game.load.audio('cancel', 'sounds/interface6.wav');
    this.game.load.audio('error', 'sounds/interface2.wav');


    //var casillas
  },

  create: function () {
    this.menumusic = this.game.add.audio('menutheme');
    this.menumusic.loop = true;
    this.menumusic.play();

    this.game.state.start('MainMenu');
  }
};

var MenuScene = {
  preload: function () {
    this.game.load.image('tileset', 'images/Mapa.png');


    this.game.load.image('cursor', 'images/Usar/cursor.png');
    this.game.load.image('grass1', 'images/Usar/grass1.png');
    this.game.load.image('grass2', 'images/Usar/grass2.png');
    this.game.load.image('grass3', 'images/Usar/grass3.png');
    this.game.load.image('forest', 'images/Usar/forest.png');
    this.game.load.image('mine', 'images/Usar/mine.png');
    this.game.load.image('ruins', 'images/Usar/ruins.png');
    this.game.load.image('bluetower', 'images/Usar/bluetower.png');
    this.game.load.image('redtower', 'images/Usar/redtower.png');
    this.game.load.image('bluewall', 'images/Usar/bluewall.png');
    this.game.load.image('redwall', 'images/Usar/redwall.png');
    this.game.load.image('bluetown', 'images/Usar/bluetown.png');
    this.game.load.image('redtown', 'images/Usar/redtown.png');
    this.game.load.image('bluevillager', 'images/Usar/bluevillager.png');
    this.game.load.image('redvillager', 'images/Usar/redvillager.png');
    this.game.load.image('bluearcher', 'images/Usar/bluearcher.png');
    this.game.load.image('redarcher', 'images/Usar/redarcher.png');
    this.game.load.image('blueknight', 'images/Usar/blueknight.png');
    this.game.load.image('redknight', 'images/Usar/redknight.png');
    this.game.load.image('bluerider', 'images/Usar/bluerider.png');
    this.game.load.image('redrider', 'images/Usar/redrider.png');
    this.game.load.image('unitselection', 'images/Usar/unitselection.png');
    this.game.load.image('enemymarker', 'images/Usar/enemymarker.png');
    this.game.load.image('allymarker', 'images/Usar/allymarker.png');
    this.game.load.spritesheet('bluecoin', 'images/Usar/bluecoin.png', 32, 32, 8);
    this.game.load.spritesheet('redcoin', 'images/Usar/redcoin.png', 32, 32, 8);
    this.game.load.image('VictoryHumanes', 'images/VictoryHumanes.png');
    this.game.load.image('VictoryAlgete', 'images/VictoryAlgete.png');
    this.game.load.image('Victory', 'images/Victory.gif');
  },
  create: function () {
    //var tileset = this.game.add.sprite(50, 0, 'tileset');
    var back = this.game.add.sprite(0, 0, 'background');
    var Playbutton = this.game.add.button(500, 100, 'playbutton', this.Playstart, this, 2, 1, 0);

    var Rulesbutton = this.game.add.button(500, 300, 'rulesbutton', this.Rulestar, this, 2, 1, 0);
  },
  Playstart: function () {
    this.game.state.start('play');
  },
  Rulestar: function () {
    this.game.state.start('Rules');
  }
};

var RulesScene = {
  create: function () {
    var tut = this.game.add.sprite(0, 0, 'tutorial');
    var backbotton = this.game.add.button(50, 500, 'returnbutton', this.atras, this, 2, 1, 0);
    backbotton.scale.setTo(0.20, 0.20);

    this.ruleStyle = { font: "15px Arial", fill: "#000000" };
    var generalInfo = this.game.add.text(60, 50, "Minilization is a turn based strategy game for 2 players on \n the same computer. When a player skips its turn, the \n next player plays.", this.ruleStyle);
    var goldInfo1 = this.game.add.text(60, 150, "Each player starts with a worker and a combat unit. You \n can send your worker to the different resource squares \n around the map to start gaining gold.", this.ruleStyle);
    var goldInfo2 = this.game.add.text(60, 250, "When a player finishes its turn, gold is generated \n depending on how many workers are above resource \n squares and the types of resources. Relics from ruins are \n the most valuable resource, followed by stone from \n mountains, followed by wood from forests.", this.ruleStyle);
    var buildInfo1 = this.game.add.text(60, 400, "You can hover the cursor over a city to see the different \n units you can build, their costs, and the key you have to \n press to build them. You can build one unit per turn.", this.ruleStyle);
    var buildInfo2 = this.game.add.text(450, 100, "You can select a worker to see the 2 buildings it can build, \n with the same info as the city units. Select a worker and \n press the corresponding key to build on the worker´s \n position. Walls block the way for enemy units until they are \n destroyed, and towers shoot the enemy automatically when \n they approach.", this.ruleStyle);
    var combatUnitsInfo = this.game.add.text(450, 250, "Infantry units are slow and have a short range in exchange \n of having high health. Archers are slow and weak but have \n a greater range. Cavalry units are fast in exchange of \n having a short range of attack.", this.ruleStyle);
    var goalInfo = this.game.add.text(450, 350, "The objective of the game is to destroy the opponent´s town.", this.ruleStyle);


  },
  atras: function () {
    this.game.state.start('MainMenu');
  }
};

var HumanesVictory = {
  create: function () {

    this.game.sound.stopAll();

    this.humanesmusic = this.game.add.audio('humanes');
    this.humanesmusic.play();

    var cartel = this.game.add.sprite(0, 0, 'VictoryHumanes');
    var confetti = this.game.add.sprite(0, 0, 'Victory');
    confetti.scale.setTo(2.5, 2);


    var men = this.game.add.button(50, 500, 'returnbutton', this.backToMenu, this, 2, 1, 0);
    men.scale.setTo(0.20, 0.20);
  },
  backToMenu: function () {
    this.menumusic = this.game.add.audio('menutheme');
    this.menumusic.loop = true;
    this.menumusic.play();
    this.game.state.start('MainMenu');
  }
};

var AlgeteVictory = {
  create: function () {

    this.game.sound.stopAll();

    this.algetemusic = this.game.add.audio('algete');
    this.algetemusic.play();

    var cart = this.game.add.sprite(0, 0, 'VictoryAlgete');
    var confet = this.game.add.sprite(0, 0, 'Victory');
    confet.scale.setTo(2.5, 2);

    var m = this.game.add.button(50, 500, 'returnbutton', this.backToMenu, this, 2, 1, 0);
    m.scale.setTo(0.20, 0.20);

  },
  backToMenu: function () {
    this.menumusic = this.game.add.audio('menutheme');
    this.menumusic.loop = true;
    this.menumusic.play();
    this.game.state.start('MainMenu');
  }
}

window.onload = function () {
  var game = new Phaser.Game(900, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('MainMenu', MenuScene);
  game.state.add('Rules', RulesScene);
  game.state.add('play', PlayScene);
  game.state.add('humanes', HumanesVictory);
  game.state.add('algete', AlgeteVictory);

  game.state.start('boot');
};





