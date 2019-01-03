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
    this.game.load.audio('gametheme','sounds/gametheme.mp3');
    this.game.load.audio('menutheme','sounds/menutheme.mp3');
    this.game.load.audio('humanes','sounds/humanes.ogg');
    this.game.load.audio('algete','sounds/algete.ogg');

    // Sounds
    this.game.load.audio('attack','sounds/swing.wav');
    this.game.load.audio('move','sounds/cloth-heavy.wav');
    this.game.load.audio('skipturn','sounds/coin3.wav');
    this.game.load.audio('build','sounds/metal-small2.wav');
    this.game.load.audio('select','sounds/interface1.wav'); 
    this.game.load.audio('cancel','sounds/interface6.wav'); 
    this.game.load.audio('error','sounds/interface2.wav');


    //var casillas
  },

  create: function () {

    this.menumusic = this.game.add.audio('menutheme');
    this.menumusic.loop = true;
    this.menumusic.play();

    this.game.state.start('MainMenu');
  }
};

var MenuScene={
  preload:function() {
    this.game.load.image('tileset','images/Mapa.png');
    

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
  },
  create:function(){
    //var tileset = this.game.add.sprite(50, 0, 'tileset');

    var back=this.game.add.sprite(0,0,'background');
    var Playbutton = this.game.add.button(500,100,'playbutton',this.Playstart,this,2,1,0);
    
    var Rulesbutton = this.game.add.button(500,300,'rulesbutton',this.Rulestar,this,2,1,0);    
  },
  Playstart:function(){
    this.game.state.start('play');
  },
  Rulestar:function(){
    this.game.state.start('Rules');
  }  
};

var RulesScene ={
  create:function(){
    var tut = this.game.add.sprite(0,0,'tutorial');    
    var backbotton=this.game.add.button(50,500,'returnbutton',this.atras,this,2,1,0);
    backbotton.scale.setTo(0.20,0.20);
  },
  atras:function(){
    this.game.state.start('MainMenu');
  }
};

var HumanesVictory = {
    create:function(){

      this.game.sound.stopAll();

      this.humanesmusic = this.game.add.audio('humanes');
      this.humanesmusic.play();

      var style = { font: "30px Arial", fill: "#ffffff" };
      this.victorytext = this.game.add.text(350, 200, "HUMANES WINS", style);
      this.backtext = this.game.add.text(350,400, "BACK TO MENU", style);
      this.backtext.inputEnabled = true;
      this.backtext.events.onInputDown.add(this.backToMenu, this);
    },
    backToMenu:function(){
      this.game.state.start('MainMenu');
    }
};

var AlgeteVictory = {
  create:function(){

    this.game.sound.stopAll();

    this.algetemusic = this.game.add.audio('algete');
    this.algetemusic.play();

    var style = { font: "30px Arial", fill: "#ffffff" };
    this.victorytext = this.game.add.text(350, 200, "ALGETE WINS", style);
    this.backtext = this.game.add.text(350,400, "BACK TO MENU", style);
    this.backtext.inputEnabled = true;
    this.backtext.events.onInputDown.add(this.backToMenu, this);

  },
  backToMenu:function(){
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





