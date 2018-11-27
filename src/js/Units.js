'use strict';

class Unit extends Phaser.Sprite {
  constructor(game, x, y, hp, player, sprite, unitNumber, squareWidth, squareHeight) {
    super(game, x * squareWidth, y * squareHeight, sprite);
    game.add.existing(this);
    this.scale.setTo(2, 2);
    this.hp = hp;
    this.player = player;
    this.unitNumber = unitNumber;
    this.posX = x;
    this.posY = y;

    var style = { font: "8px Arial", fill: "#ffffff" };
    this.healthHud = this.game.add.text(0, -5, this.hp, style);
    this.addChild(this.healthHud);
  }

  takeDamage(damage) {
    this.hp -= damage;
    this.healthHud.setText(this.hp);
    if (this.hp <= 0) {
      this.destroyUnit();
      return true;
    }
    else
      return false;
  }

  destroyUnit() {
    this.destroy();
  }

  isMovable() {
    if (this instanceof Archer || this instanceof Infantry || this instanceof Cavalry || this instanceof Worker)
      return true;
    else
      return false;
  }

  isCombatUnit() {
    if (this instanceof Archer || this instanceof Infantry || this instanceof Cavalry)
      return true;
    else
      return false;
  }
}

class Town extends Unit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 1000, player, 'bluetown', unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 1000, player, 'redtown', unitNumber, squareWidth, squareHeight);
    }

  }

  createUnit(type) {
    players[player].addUnit(type, this.x, this.y);
  }
}

class Wall extends Unit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 500, player, 'bluewall', unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 500, player, 'redwall', unitNumber, squareWidth, squareHeight);
    }
  }
}

class Watchtower extends Unit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 200, player, 'bluetower', unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 200, player, 'redtower', unitNumber, squareWidth, squareHeight);
    }

    this.range = 3;
    this.damage = 20;
  }

  // ataque automatico a la unidad enemiga mas cercana
  attack(gameMap, player) {
    var attacked = false;
    var destroyed = false;
    var attackRange = 1;
    var enemy;
    while (!attacked && attackRange <= this.range) {

      // izquierda
      if (!attacked && (this.posX - attackRange) >= 0) {
        if (gameMap.squares[this.posY][this.posX - attackRange] == undefined)
          gameMap.createEmptySquare(this.posX - attackRange, this.posY);
        if (gameMap.squares[this.posY][this.posX - attackRange].unit != 'null' &&
          this.player != gameMap.squares[this.posY][this.posX - attackRange].unit.player) {
          destroyed = gameMap.squares[this.posY][this.posX - attackRange].unit.takeDamage(this.damage);
          enemy = gameMap.squares[this.posY][this.posX - attackRange].unit;
          attacked = true;
        }

      }

      // derecha
      else if (!attacked && (this.posX + attackRange) < gameMap.width) {
        if (gameMap.squares[this.posY][this.posX + attackRange] == undefined)
          gameMap.createEmptySquare(this.posX + attackRange, this.posY);
        if (gameMap.squares[this.posY][this.posX + attackRange].unit != 'null' &&
          this.player != gameMap.squares[this.posY][this.posX + attackRange].unit.player) {
          destroyed = gameMap.squares[this.posY][this.posX + attackRange].unit.takeDamage(this.damage);
          enemy = gameMap.squares[this.posY][this.posX + attackRange].unit;
          attacked = true;
        }

      }

      // arriba
      else if (!attacked && (this.posY - attackRange) >= 0) {
        if (gameMap.squares[this.posY - attackRange][this.posX] == undefined)
          gameMap.createEmptySquare(this.posX, this.posY - attackRange);
        if (gameMap.squares[this.posY - attackRange][this.posX].unit != 'null' &&
          this.player != gameMap.squares[this.posY - attackRange][this.posX].unit.player) {
          destroyed = gameMap.squares[this.posY - attackRange][this.posX].unit.takeDamage(this.damage);
          enemy = gameMap.squares[this.posY - attackRange][this.posX].unit;
          attacked = true;
        }

      }

      // abajo
      else if (!attacked && (this.posY + attackRange) < gameMap.height) {
        if (gameMap.squares[this.posY + attackRange][this.posX] == undefined)
          gameMap.createEmptySquare(this.posX, this.posY + attackRange);
        if (gameMap.squares[this.posY + attackRange][this.posX].unit != 'null' &&
          this.player != gameMap.squares[this.posY + attackRange][this.posX].unit.player) {
          destroyed = gameMap.squares[this.posY + attackRange][this.posX].unit.takeDamage(this.damage);
          enemy = gameMap.squares[this.posY + attackRange][this.posX].unit;
          attacked = true;
        }

      }
      attackRange++;
    }
    if (destroyed) {
      gameMap.emptySquareFromUnit(enemy.posX, enemy.posY);
      player.destroyUnit(enemy.unitNumber);
    }
  }
}

class HumanUnit extends Unit {
  constructor(game, x, y, hp, moves, sprite, player, unitNumber, squareWidth, squareHeight) {
    super(game, x, y, hp, player, sprite, unitNumber, squareWidth, squareHeight);
    this.moves = moves;
    this.movementDone = false;
    this.attackDone = false;
  }

  canMove(posX, posY) {
    if ((this.posX == posX && Math.abs(this.posY - posY) <= this.moves) || (this.posY == posY && Math.abs(this.posX - posX) <= this.moves))
      return true;
    else
      return false;
  }


  move(posX, posY, gameMap) // posiciones absolutas a las que se va a mover la unidad
  {
    this.posX = posX;
    this.x = posX * gameMap.squareWidth;
    this.posY = posY;
    this.y = posY * gameMap.squareHeight;

  }
}

class Worker extends HumanUnit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player = 1) {
      super(game, x, y, 20, 1, 'bluevillager', player, unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 20, 1, 'redvillager', player, unitNumber, squareWidth, squareHeight);
    }
  }

  build(type) {
    players[player].addUnit(type, this.x, this.y);
  }
}

class CombatUnit extends HumanUnit {
  constructor(game, x, y, hp, moves, sprite, player, range, damage, element, unitNumber, squareWidth, squareHeight) {
    super(game, x, y, hp, moves, sprite, player, unitNumber, squareWidth, squareHeight);
    this.range = range;
    this.damage = damage;
    this.element = element;
  }

  canAttack(posX, posY) {
    if ((this.posX == posX && Math.abs(this.posY - posY) <= this.range) || (this.posY == posY && Math.abs(this.posX - posX) <= this.range))
      return true;
    else
      return false;
  }

  attack(enemy) {
    var bonusDamage;
    var destroyed = false;

    if (this.element == enemy.element)
      bonusDamage = 1;
    else if ((this.element == "archer" && enemy.element == "cavalry") || (this.element == "infantry" && enemy.element == "archer") ||
      (this.element == "cavalry" && enemy.element == "infantry"))
      bonusDamage = 1.25;
    else if ((this.element == "archer" && enemy.element == "infantry") || (this.element == "infantry" && enemy.element == "cavalry") ||
      (this.element == "cavalry" && enemy.element == "archer"))
      bonusDamage = 0.75;
    else
      bonusDamage = 1;

    destroyed = enemy.takeDamage(Math.round(this.damage * bonusDamage));
    return destroyed;
  }
}

class Archer extends CombatUnit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 30, 1, 'bluearcher', player, 2, 10, "archer", unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 30, 1, 'redarcher', player, 2, 10, "archer", unitNumber, squareWidth, squareHeight);
    }
  }
}


class Infantry extends CombatUnit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 50, 1, 'blueknight', player, 1, 10, "infantry", unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 50, 1, 'redknight', player, 1, 10, "infantry", unitNumber, squareWidth, squareHeight);
    }
  }
}

class Cavalry extends CombatUnit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 40, 2, 'bluerider', player, 1, 10, "cavalry", unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 40, 2, 'redrider', player, 1, 10, "cavalry", unitNumber, squareWidth, squareHeight);
    }
  }
}

module.exports = {
  Unit: Unit, Town: Town, Wall: Wall, Watchtower: Watchtower, HumanUnit: HumanUnit, Worker: Worker, CombatUnit: CombatUnit, Archer: Archer, Infantry: Infantry, Cavalry: Cavalry
};