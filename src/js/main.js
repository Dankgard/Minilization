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
    /*var frameWidth = 110/7;
    var frameNumber = 308;
    this.game.load.spritesheet('spritesheet', 'images/gametile.png', frameWidth, frameWidth, frameNumber);*/

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

class Player  {
  constructor(number, money)
  {
    this.number = number;
    this.money = money;
    this.numberOfUnits = 0;
    this.units = [];
  }

  addUnit(type, x, y)
  {
    var unit;
    var cost;
    switch (type)
    {
      case "town":
        unit = new Town(x, y, this.number, numberOfUnits);
        cost = 100;
        break;
      case "wall":
        unit = new Wall(x, y, this.number, numberOfUnits);
        cost = 40;
        break;
      case "watchtower":
        unit = new Watchtower(x, y, this.number, numberOfUnits);
        cost = 40;
        break;
      case "worker":
        unit = new Worker(x, y, this.number, numberOfUnits);
        cost = 50;
        break;
      case "infantry":
        unit = new Infantry(x, y, this.number, numberOfUnits);
        cost = 30;
        break;
      case "cavalry":
        unit = new Cavalry(x, y, this.number, numberOfUnits);
        cost = 30;
        break;
      case "archer":
        unit = new Archer(x, y, this.number, numberOfUnits);
        cost = 30;
        break;
    }
    this.money -= cost;
    this.numberOfUnits++;
    this.units.push(unit);
  }

  destroyUnit(unitNumber)
  {
    this.units.splice(unitNumber, 1);
  }
}

class Map{
  constructor(width, height)
  {
    this.width = width;
    this.height = height;
    this.squares = new Array(height);
    for (var i = 0; i < squares.length; i++) {
      squares[i] = new Array(width);
    }

    for (var i = 0; i < height; i++) {
      for(var j = 0; i < width;j++)
      {
        squares[j][i] = new Square(j,i,"empty","empty.png",0);
      }
    }
  }
}


class Square extends Phaser.Sprite  {
  constructor(x, y, type, sprite, goldPerTurn)
  {
    super(game, x, y, sprite, nombre);
    this.type = type;
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

class Unit extends Phaser.Sprite {
  constructor(x, y, hp, player, sprite, unitNumber)
  {
    super(game, x, y, sprite);
    this.hp = hp;
    this.player = player;
    this.unitNumber = unitNumber;
  }

  takeDamage(damage)
  {
    this.hp -= damage;
    if(this.hp <= 0)
      destroy();
  }

  destroy()
  {
    players[player].destroy(this.unitNumber);
  }
}

class Town extends Unit {
  constructor(x, y, player, unitNumber)
  {
    super(x, y, 1000, player,"town.png", unitNumber);
  }

  createUnit(type)
  {
    players[player].addUnit(type, this.x, this.y);
  }
}

class Wall extends Unit {
  constructor(x, y, player, unitNumber)
  {
    super(x, y, 100, player, "wall.png", unitNumber);
  }
}

class Watchtower extends Unit {
  constructor(x, y, player, unitNumber)
  {
    super(x, y, 50, player, "watchtower.png", unitNumber);
    this.range = 3;
    this.damage = 20;
  }

  attack(enemy)
  {
    enemy.takeDamage(this.damage);
  }
}

class HumanUnit extends Unit {
  constructor(x, y, hp, moves, sprite, player, unitNumber)
  {
    super(x, y, hp, player, sprite, unitNumber);
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
  constructor(x, y, player, unitNumber)
  {
    super(x, y, 20, 1, "worker.png", player, unitNumber);
  }

  work()
  {
    players[player].money += squares[x][y].goldPerTurn;
  }

  build(type)
  {
    players[player].addUnit(type, this.x, this.y);
  }
}

class CombatUnit extends HumanUnit {
  constructor(x, y, hp, moves, sprite, player, range, damage, element, unitNumber)
  {
    super(x, y, hp, moves, sprite, player, unitNumber);
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
  constructor(x, y, player, unitNumber)
  {
    super(x, y, 30, 1, "archer.png", player, 2, 10, "archer", unitNumber);
  }
}

class Infantry extends CombatUnit {
  constructor(x, y, player, unitNumber)
  {
    super(x, y, 50, 1, "infantry.png", player, 1, 10, "infantry", unitNumber);
  }
}

class Cavalry extends CombatUnit {
  constructor(x, y, player, unitNumber)
  {
    super(x, y, 40, 2, "cavalry.png", player, 1, 10, "cavalry", unitNumber);
  }
}

class Cursor extends Phaser.Sprite {
  constructor(x, y)
  {
    super(game, x, y, sprite);
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



