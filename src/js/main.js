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
    this.units = [];
  }
}

class Square  {
  constructor(x, y, type, sprite, goldPerTurn)
  {
    this.x = x;
    this.y = y;
    this.type = type;
    this.sprite = sprite;
    this.goldPerTurn = goldPerTurn;
  }
}

class EmptySquare extends Square {
  constructor(x, y)
  {
    super(x, y, "empty", "empty.png", 0);
  }
}

class ForestSquare extends Square {
  constructor(x, y)
  {
    super(x, y, "forest", "forest.png", 1);
  }
}

class MineSquare extends Square {
  constructor(x, y)
  {
    super(x, y, "mine", "mine.png", 2);
  }
}

class RuinsSquare extends Square {
  constructor(x, y)
  {
    super(x, y, "ruins", "ruins.png", 3);
  }
}

class Unit {
  constructor(x, y, hp, player, sprite)
  {
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.sprite = sprite;
    this.player = player;
  }

  takeDamage(damage)
  {
    this.hp -= damage;
    if(this.hp <= 0)
      destroy();
  }

  destroy()
  {

  }
}

class Town extends Unit {
  constructor(x, y, player)
  {
    super(x, y, 1000, player,"town.png");
  }

  createUnit(type)
  {
    this.player.units.push(type);
  }
}

class Wall extends Unit {
  constructor(x, y, player)
  {
    super(x, y, 100, player, "wall.png");
  }
}

class Watchtower extends Unit {
  constructor(x, y, player)
  {
    super(x, y, 50, player, "watchtower.png");
    this.range = 3;
    this.damage = 20;
  }

  attack(enemy)
  {
    enemy.takeDamage(this.damage);
  }
}

class HumanUnit extends Unit {
  constructor(x, y, hp, moves, sprite, player)
  {
    super(x, y, hp, player, sprite);
    this.moves = moves;
  }

  move(posX, posY) // posiciones absolutas a las que se va a mover la unidad
  {
    if((this.x == posX && Math.abs(this.y - posY)<= this.moves) || (this.y == posY && Math.abs(this.x - posX)<= this.moves))
      {
        this.x = posX;
        this.y = posY;
      }
  }
}

class Worker extends HumanUnit {
  constructor(x, y, player)
  {
    super(x, y, 20, 1, "worker.png", player);
  }

  work()
  {
    
  }

  build(type)
  {
    this.player.units.push(type);
  }
}

class CombatUnit extends HumanUnit {
  constructor(x, y, hp, moves, sprite, player, range, damage, element)
  {
    super(x, y, hp, moves, sprite, player);
    this.range = range;
    this.damage = damage;
    this.element = element;
  }

  attack(enemy)
  {
    var bonusDamage;

    if(this.element == enemy.element)
      bonusDamage = 1;
    else if((this.element == "archer" && enemy.element == "cavalry") || (this.element == "infantry" && enemy.element == "archer") ||
    (this.element == "cavalry" && enemy.element == "infantry"))
      bonusDamage = 1.25;
    else if ((this.element == "archer" && enemy.element == "infantry") || (this.element == "infantry" && enemy.element == "cavalry") ||
    (this.element == "cavalry" && enemy.element == "archer"))
      bonusDamage = 0.75;
    else
      bonusDamage = 1;

    enemy.takeDamage(this.damage * bonusDamage);
  }
}

class Archer extends CombatUnit {
  constructor(x, y, player)
  {
    super(x, y, 30, 1, "archer.png", player, 2, 10, "archer");
  }
}

class Infantry extends CombatUnit {
  constructor(x, y, player)
  {
    super(x, y, 50, 1, "infantry.png", player, 1, 10, "infantry");
  }
}

class Cavalry extends CombatUnit {
  constructor(x, y, player)
  {
    super(x, y, 40, 2, "cavalry.png", player, 1, 10, "cavalry");
  }
}

class Cursor {
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
    this.sprite = "cursor.png";
  }

  move(dir)
  {
    switch(dir)
    {
      case "left":
        this.x--;
        break;
      case "right":
        this.x++;
        break;
      case "up":
        this.y--;
        break;
      case "down":
        this.y++;
        break;
    }
  }
}



