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

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/phaser.png');
  },

  create: function () {
    this.game.state.start('play');
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};

class GameManager {
  constructor(turn, playingPlayer)
  {
    this.turn = turn;
    this.playingPlayer = playingPlayer;
  }
}

class Player {
  constructor(number, money)
  {
    this.number = number;
    this.money = money;
  }
}

class Square  {
  constructor(x, y, type, sprite)
  {
    this.x = x;
    this.y = y;
    this.type = type; // nothing, forest, mine, ruins
    this.sprite = sprite;
  }
}

class Building {
  constructor(x, y, hp, player)
  {
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.sprite = sprite;
    this.player = player;
  }
}

class Town extends Building {
  constructor()
  {

  }

  createUnit()
  {

  }
}

class Wall extends Building {
  constructor()
  {

  }
}

class Watchtower extends Building {
  constructor(range,damage)
  {
    this.range = range;
    this.damage = damage;
  }

  attack()
  {

  }
}

class Unit {
  constructor(x, y, hp, moves, sprite, player)
  {
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.moves = moves;
    this.sprite = sprite;
    this.player = player;
  }
}

class Worker extends Unit {
  constructor()
  {

  }

  work()
  {

  }

  build()
  {

  }
}

class CombatUnit extends Unit {
  constructor(range, damage, element)
  {
    this.range = range;
    this.damage = damage;
    this.element = element;
  }

  attack()
  {

  }
}

class Archer extends CombatUnit {
  constructor()
  {

  }
}

class Infantry extends CombatUnit {
  constructor()
  {

  }
}

class Cavalry extends CombatUnit {
  constructor()
  {

  }
}



