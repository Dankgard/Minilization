(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

class Cursor extends Phaser.Sprite {
  constructor(game, x, y, squareWidth, squareHeight, gameMap, players, playingPlayer, player1Town, player2Town) {
    super(game, x * squareWidth + 50, y * squareHeight, 'cursor');
    game.add.existing(this);
    this.posX = x;
    this.posY = y;
    this.oldX = 0;
    this.oldY = 0;

    this.gameMap = gameMap;
    this.players = players;
    this.playingPlayer = playingPlayer;

    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    this.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.zKey.onDown.add(this.actionKey, this);

    this.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
    this.xKey.onDown.add(this.cancelSelection, this);

    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(this.turnSkip, this);

    this.Key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.Key1.onDown.add(this.buildInfantry, this);
    this.Key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.Key2.onDown.add(this.buildCavalry, this);
    this.Key3 = game.input.keyboard.addKey(Phaser.Keyboard.TREE);
    this.Key3.onDown.add(this.buildArcher, this);
    this.Key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    this.Key4.onDown.add(this.buildWorker, this);
    this.Key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    this.Key5.onDown.add(this.buildTower, this);
    this.Key6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
    this.Key6.onDown.add(this.buildWall, this);

    this.selectedUnit = 'null';
    this.unitSelection = this.game.add.sprite(50, 0, 'unitselection');
    this.unitSelection.scale.setTo(2,2);
    this.unitSelection.visible = false;
    this.player1Town = player1Town;
    this.player2Town = player2Town;

    this.skipTurn = false;

    this.unitStyle = { font: "7px Arial", fill: "#ffffff" };
    this.infantryText = this.game.add.text(5, 150, "INFANTRY", this.unitStyle);
    this.cavalryText = this.game.add.text(5, 250, "CAVALRY", this.unitStyle);
    this.archerText = this.game.add.text(5, 350, "ARCHER", this.unitStyle);
    this.workerText = this.game.add.text(5, 450, "WORKER", this.unitStyle);
    this.towerText = this.game.add.text(900 - 40, 250, "TOWER", this.unitStyle);
    this.wallText = this.game.add.text(900 - 40, 350, "WALL", this.unitStyle);
    this.towerText.visible = false;
    this.wallText.visible = false;
    this.keyStyle = { font: "30px Arial", fill: "#ffffff" };
    this.infantryKey = this.game.add.text(15, 170, "1", this.keyStyle);
    this.cavalryKey = this.game.add.text(15, 270, "2", this.keyStyle);
    this.archerKey = this.game.add.text(15, 370, "3", this.keyStyle);
    this.workerKey = this.game.add.text(15, 470, "4", this.keyStyle);
    this.towerKey = this.game.add.text(900 - 30, 270, "5", this.keyStyle);
    this.wallKey = this.game.add.text(900 - 30, 370, "6", this.keyStyle);
    this.towerKey.visible = false;
    this.wallKey.visible = false;
  }

  workerUnitsVisible(visible) {
    this.towerText.visible = visible;
    this.wallText.visible = visible;
    this.towerKey.visible = visible;
    this.wallKey.visible = visible;
  }

  handleEvents() {
    // mover izquierda
    if (this.leftKey.isDown)
      this.moveLeft();

    // mover derecha
    if (this.rightKey.isDown)
      this.moveRight();

    // mover arriba
    if (this.upKey.isDown)
      this.moveUp();

    // mover abajo 
    if (this.downKey.isDown)
      this.moveDown();

    // saltar turno
    if (this.skipTurn) {
      this.skipTurn = false;
      if (this.playingPlayer == 1)
        this.playingPlayer = 2;
      else
        this.playingPlayer = 1;
      return true;
    }
    else return false;
  }

  cancelSelection() {
    delete this.selectedUnit;
    this.selectedUnit = 'null';
    this.unitSelection.visible = false;
    console.log("unit deselected");
  }

  turnSkip() {
    this.skipTurn = true;
  }

  moveLeft() {
    if (this.posX > 0) {
      this.x -= this.gameMap.squareWidth;
      this.posX--;
      this.game.world.bringToTop(this);
    }
  }

  moveRight() {
    if (this.posX < this.gameMap.width - 1) {
      this.x += this.gameMap.squareWidth;
      this.posX++;
      this.game.world.bringToTop(this);
    }
  }

  moveUp() {
    if (this.posY > 0) {
      this.y -= this.gameMap.squareHeight;
      this.posY--;
      this.game.world.bringToTop(this);
    }
  }

  moveDown() {
    if (this.posY < this.gameMap.height - 1) {
      this.y += this.gameMap.squareHeight;
      this.posY++;
      this.game.world.bringToTop(this);
    }
  }

  actionKey() {
    if (this.gameMap.squares[this.posY][this.posX] == undefined)
      this.gameMap.createEmptySquare(this.posX, this.posY);

    var hoveringSquare = this.gameMap.squares[this.posY][this.posX];
    var hoveringUnit = hoveringSquare.unit;
    var hoveringBuilding = hoveringSquare.building;

    // seleccionar unidades
    if (hoveringUnit != 'null' && hoveringUnit.player == this.playingPlayer && this.selectedUnit == 'null') {
      this.oldX = this.posX;
      this.oldY = this.posY;
      this.selectedUnit = hoveringUnit;
      this.unitSelection.visible = true;
      this.unitSelection.position.x = this.posX * this.gameMap.squareWidth + 50;
      this.unitSelection.position.y = this.posY * this.gameMap.squareHeight;
      console.log(this.selectedUnit.element);
      if (this.selectedUnit.isWorker())
        this.workerUnitsVisible(true);
    }
    // teniendo la unidad ya seleccionada
    else if (this.selectedUnit != 'null') {
      // mover unidad seleccionada
      if (hoveringUnit == 'null' && hoveringBuilding == 'null' || hoveringBuilding.player == this.selectedUnit.player) {
        // si entra en el rango de movimiento y no se ha movido todavia
        if (this.selectedUnit.canMove(this.posX, this.posY) && this.selectedUnit.movementDone == false) {
          this.selectedUnit.move(this.posX, this.posY, this.gameMap);
          this.selectedUnit.movementDone = true;
          console.log("moved " + this.selectedUnit.element);
          this.gameMap.emptySquareFromUnit(this.oldX, this.oldY);
          this.gameMap.squares[this.posY][this.posX].unit = this.selectedUnit;
          this.game.world.bringToTop(this.selectedUnit);
          this.game.world.bringToTop(this);
        }
        else {
          console.log("cannot move " + this.selectedUnit.element);
        }
      }
      // saltar movimiento de la unidad
      else if (this.selectedUnit == hoveringUnit) {
        this.selectedUnit.movementDone = true;
        console.log(this.selectedUnit.element + " skipped move");
      }
      // atacar enemigos
      else if (this.selectedUnit.isCombatUnit() && (hoveringUnit != 'null' || hoveringBuilding != 'null')) {

        var hovering;
        // atacar unidad enemiga
        if (hoveringUnit != 'null' && this.selectedUnit.player != hoveringUnit.player)
          hovering = hoveringUnit;

        // atacar edificios enemigos
        else if (hoveringBuilding != 'null' && this.selectedUnit.player != hoveringBuilding.player)
          hovering = hoveringBuilding;

        var enemyX = hovering.posX;
        var enemyY = hovering.posY;
        var enemyTeam = hovering.player;
        var enemyNumber = hovering.unitNumber;
        // si no ha atacado todavia y entra en el rango de ataque
        if (this.selectedUnit.canAttack(enemyX, enemyY) && this.selectedUnit.attackDone == false) {
          this.selectedUnit.attackDone = true;
          var destroyed = this.selectedUnit.attack(hovering);
          console.log("attacking enemy");
          if (destroyed) {
            this.gameMap.emptySquareFromUnit(enemyX, enemyY);
            this.players[enemyTeam - 1].destroyUnit(enemyNumber);
          }
        }
      }
      if (this.wallText.visible == true)
        this.workerUnitsVisible(false);
      delete this.selectedUnit;
      this.selectedUnit = 'null';
      this.unitSelection.visible = false;
    }
  }

  buildWall() {
    if (this.selectedUnit.isWorker()) {
        this.selectedUnit.build("wall", this.players, this.gameMap);
        if (this.wallText.visible == true)
          this.workerUnitsVisible(false);
        delete this.selectedUnit;
        this.selectedUnit = 'null';
        this.unitSelection.visible = false;
    }
  }

  buildTower() {
    if (this.selectedUnit.isWorker()) {
        this.selectedUnit.build("watchtower", this.players, this.gameMap);
        if (this.wallText.visible == true)
          this.workerUnitsVisible(false);
        delete this.selectedUnit;
        this.selectedUnit = 'null';
        this.unitSelection.visible = false;
    }
  }

  buildInfantry() {
    if (this.playingPlayer == 1)
      this.player1Town.createUnit("infantry", this.players, this.gameMap);
    else
      this.player2Town.createUnit("infantry", this.players, this.gameMap);
  }

  buildCavalry() {
    if (this.playingPlayer == 1)
      this.player1Town.createUnit("cavalry", this.players, this.gameMap);
    else
      this.player2Town.createUnit("cavalry", this.players, this.gameMap);
  }

  buildArcher() {
    if (this.playingPlayer == 1)
      this.player1Town.createUnit("archer", this.players, this.gameMap);
    else
      this.player2Town.createUnit("archer", this.players, this.gameMap);
  }

  buildWorker() {
    if (this.playingPlayer == 1)
      this.player1Town.createUnit("worker", this.players, this.gameMap);
    else
      this.player2Town.createUnit("worker", this.players, this.gameMap);
  }
}

module.exports = Cursor;
},{}],2:[function(require,module,exports){
'use strict';
var square = require('./Square.js');

class Map {
  constructor(game, width, height, squareWidth, squareHeight) {
    this.width = width;
    this.height = height;
    this.squareWidth = squareWidth;
    this.squareHeight = squareHeight;

    this.squares = new Array(height);
    for (var i = 0; i < this.squares.length; i++) {
      this.squares[i] = new Array(width);
    }

    var numberOfForests = Math.round(Math.random() * 10);
    var numberOfMines = Math.round(Math.random() * 10);
    var numberOfRuins = Math.round(Math.random() * 10);

    for (var i = 0; i < numberOfForests; i++) {
      var x = Math.round(Math.random() * (width - 1));
      var y = Math.round(Math.random() * (height - 1));
      this.squares[y][x] = new square.ForestSquare(game, x, y, squareWidth, squareHeight);
    }

    for (var i = 0; i < numberOfMines; i++) {
      var x = Math.round(Math.random() * (width - 1));
      var y = Math.round(Math.random() * (height - 1));
      this.squares[y][x] = new square.MineSquare(game, x, y, squareWidth, squareHeight);
    }

    for (var i = 0; i < numberOfRuins; i++) {
      var x = Math.round(Math.random() * (width - 1));
      var y = Math.round(Math.random() * (height - 1));
      this.squares[y][x] = new square.RuinsSquare(game, x, y, squareWidth, squareHeight);
    }
  }

  createEmptySquare(x, y) {
    this.squares[y][x] = new square.EmptySquare(x, y);
  }

  emptySquareFromUnit(x, y) {
    delete this.squares[y][x].unit;
    this.squares[y][x].unit = 'null';
  }

  emptySquareFromBuilding(x, y)
  {
    delete this.squares[y][x].building;
    this.squares[y][x].building = 'null';
  }
}

module.exports = Map;
},{"./Square.js":4}],3:[function(require,module,exports){
'use strict';

var units = require('./Units.js');

class Player {
  constructor(number, money) {
    this.number = number;
    this.money = money;
    this.numberOfUnits = 0;
    this.units = [];
  }

  addUnit(game, type, x, y, gameMap, free) {
    var unit;
    var cost;
    switch (type) {
      case "town":
        unit = new units.Town(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
        cost = 100;
        break;
      case "wall":
        unit = new units.Wall(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
        cost = 40;
        break;
      case "watchtower":
        unit = new units.Watchtower(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
        cost = 40;
        break;
      case "worker":
        unit = new units.Worker(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
        cost = 50;
        break;
      case "infantry":
        unit = new units.Infantry(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
        cost = 30;
        break;
      case "cavalry":
        unit = new units.Cavalry(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
        cost = 30;
        break;
      case "archer":
        unit = new units.Archer(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
        cost = 30;
        break;
    }
    if (!free && this.money >= cost)
      this.money -= cost;
    this.numberOfUnits++;
    this.units.push(unit);

    if (gameMap.squares[y][x] == undefined)
      gameMap.createEmptySquare(x, y);
    if (unit.isMovable())
      gameMap.squares[y][x].unit = unit;
    else
      gameMap.squares[y][x].building = unit;
  }

  destroyUnit(unitNumber) {
    this.units.splice(unitNumber, 1);
    this.numberOfUnits--;
  }

  resetUnitUse() {
    for (var i = 0; i < this.numberOfUnits; i++) {
      if (this.units[i].isMovable()) {
        this.units[i].movementDone = false;

        if (this.units[i].isCombatUnit())
          this.units[i].attackDone = false;

        if (this.units[i].isWorker())
          this.units[i].buildDone = false;
      }
      else if (this.units[i].isTown())
        this.units[i].buildDone = false;
    }
  }

  workerWork(gameMap) {
    for (var i = 0; i < this.numberOfUnits; i++) {
      if (this.units[i] instanceof units.Worker) {
        this.money += gameMap.squares[this.units[i].posY][this.units[i].posX].goldPerTurn;
      }
    }
    console.log("gold: " + this.money);
  }

  towerAttack(gameMap) {
    for (var i = 0; i < this.numberOfUnits; i++) {
      if (this.units[i] instanceof units.Watchtower)
        this.units[i].attack(gameMap, this);
    }
  }
}

module.exports = Player;
},{"./Units.js":5}],4:[function(require,module,exports){
'use strict';

class Square extends Phaser.Sprite {
  constructor(game, x, y, type, sprite, goldPerTurn, squareWidth, squareHeight) {
    super(game, x * squareWidth + 50, y * squareHeight, sprite);
    game.add.existing(this);
    this.scale.setTo(2, 2);
    this.type = type;
    this.goldPerTurn = goldPerTurn;
    this.posX = x;
    this.posY = y;
    this.unit = 'null';
    this.building = 'null';
  }
}

class EmptySquare {
  constructor(x, y) {
    this.posX = x;
    this.posY = y;
    this.unit = 'null';
    this.building = 'null';
    this.goldPerTurn = 0;
  }
}

class RuinsSquare extends Square {
  constructor(game, x, y, squareWidth, squareHeight) {
    super(game, x, y, "ruins", 'ruins', 3, squareWidth, squareHeight);
  }
}

class MineSquare extends Square {
  constructor(game, x, y, squareWidth, squareHeight) {
    super(game, x, y, "mine", 'mine', 2, squareWidth, squareHeight);
  }
}

class ForestSquare extends Square {
  constructor(game, x, y, squareWidth, squareHeight) {
    super(game, x, y, "forest", 'forest', 1, squareWidth, squareHeight);
  }
}

module.exports = {
  Square: Square, EmptySquare: EmptySquare, RuinsSquare: RuinsSquare, MineSquare: MineSquare, ForestSquare: ForestSquare
};
},{}],5:[function(require,module,exports){
'use strict';

class Unit extends Phaser.Sprite {
  constructor(game, x, y, hp, player, sprite, unitNumber, squareWidth, squareHeight) {
    super(game, x * squareWidth + 50, y * squareHeight, sprite);
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

  isTown() {
    if (this instanceof Town)
      return true;
    else
      return false;
  }

  isWorker() {
    if (this instanceof Worker)
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

    this.buildDone = false;
  }

  createUnit(type, players, gameMap) {
    if (this.buildDone == false) {
      players[this.player - 1].addUnit(this.game, type, this.posX, this.posY, gameMap, true);
      this.buildDone = true;
    }
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

    this.range = 2;
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
      if (!attacked && (this.posX + attackRange) < gameMap.width) {
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
      if (!attacked && (this.posY - attackRange) >= 0) {
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
      if (!attacked && (this.posY + attackRange) < gameMap.height) {
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
    this.x = posX * gameMap.squareWidth + 50;
    this.posY = posY;
    this.y = posY * gameMap.squareHeight;

  }
}

class Worker extends HumanUnit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 20, 1, 'bluevillager', player, unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 20, 1, 'redvillager', player, unitNumber, squareWidth, squareHeight);
    }

    this.buildDone = false;
  }

  build(type, players, gameMap) {
    if (this.buildDone == false) {
      players[this.player].addUnit(this.game, type, this.posX, this.posY, gameMap, true);
      this.buildDone = true;
      this.game.world.bringToTop(this);
    }
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
},{}],6:[function(require,module,exports){
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

    //Audios
    this.game.load.audio('fondo','audio/Theme.mp3');

    var casillas
  },

  create: function () {
    this.game.state.start('play');
  }
};


window.onload = function () {
  var game = new Phaser.Game(900, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);  

  game.state.start('boot');  
};






},{"./play_scene.js":7}],7:[function(require,module,exports){
'use strict';
var cursor = require('./Cursor.js');
var map = require('./Map.js');
var player = require('./Player.js');
var square = require('./Square.js');
var units = require('./Units.js');

var PlayScene = {
  create: function () {
    this.turn = 1;
    this.playingPlayer = 1; // jugador que juega en cada momento
    this.playerNumber = 2;
    this.players = new Array(this.playerNumber);

    this.mapWidth = 25;
    this.mapHeight = 19;
    this.squareWidth = 800 / (this.mapWidth);
    this.squareHeight = 600 / (this.mapHeight);

    for (var i = 0; i < this.playerNumber; i++) {
      this.players[i] = new player(i + 1, 0);
    }

    this.gameMap;
    this.gameCursor;

    this.calltime = 5;
    this.call = 0;

    this.skipTurn = false;

    this.blueStyle = { font: "32px Arial", fill: "#3366ff" };
    this.blueStyle2 = { font: "8px Arial", fill: "#3366ff" };
    this.blueGold = this.game.add.text(15, 25, this.players[0].money, this.blueStyle);
    this.blueGoldText = this.game.add.text(13, 15, "GOLD", this.blueStyle2);
    this.redStyle = { font: "32px Arial", fill: "#ff0000" };
    this.redStyle2 = { font: "8px Arial", fill: "#ff0000" };
    this.redGold = this.game.add.text(900 - 35, 25, this.players[1].money, this.redStyle);
    this.redGoldText = this.game.add.text(900 - 37, 15, "GOLD", this.redStyle2);
    this.yellowStyle = { font: "8px Arial", fill: "#ffff00" };
    this.playing = this.game.add.text(10, 580, "PLAYING", this.yellowStyle);


    var tileset = this.game.add.sprite(50, 0, 'tileset');
    this.gameMap = new map(this.game, this.mapWidth, this.mapHeight, this.squareWidth, this.squareHeight);

    var y = Math.round(Math.random() * (this.mapHeight - 1));
    this.players[0].addUnit(this.game, "town", 0, y, this.gameMap, true);
    var y = Math.round(Math.random() * (this.mapHeight - 1))
    this.players[1].addUnit(this.game, "town", this.mapWidth - 1, y, this.gameMap, true);

    this.player1Town = this.players[0].units[0];
    this.player2Town = this.players[1].units[0];
    this.gameCursor = new cursor(this.game, 10, 10, this.squareWidth, this.squareHeight, this.gameMap, this.players, this.playingPlayer, this.player1Town, this.player2Town);

    this.players[0].addUnit(this.game, "infantry", 0, 1, this.gameMap, true);
    this.players[0].addUnit(this.game, "archer", 0, 2, this.gameMap, true);
    this.players[0].addUnit(this.game, "cavalry", 0, 3, this.gameMap, true);
    this.players[0].addUnit(this.game, "infantry", 0, 4, this.gameMap, true);
    this.players[0].addUnit(this.game, "archer", 0, 5, this.gameMap, true);
    this.players[0].addUnit(this.game, "cavalry", 0, 6, this.gameMap, true);
    this.players[0].addUnit(this.game, "infantry", 0, 7, this.gameMap, true);
    this.players[0].addUnit(this.game, "archer", 0, 8, this.gameMap, true);
    this.players[0].addUnit(this.game, "cavalry", 0, 9, this.gameMap, true);
    this.players[0].addUnit(this.game, "worker", 0, 10, this.gameMap, true);
    this.players[0].addUnit(this.game, "watchtower", 2, 9, this.gameMap, true)


    this.players[1].addUnit(this.game, "infantry", 24, 9, this.gameMap, true);
    this.players[1].addUnit(this.game, "archer", 24, 10, this.gameMap, true);
    this.players[1].addUnit(this.game, "cavalry", 24, 11, this.gameMap, true);
    this.players[1].addUnit(this.game, "infantry", 24, 12, this.gameMap, true);
    this.players[1].addUnit(this.game, "archer", 24, 13, this.gameMap, true);
    this.players[1].addUnit(this.game, "cavalry", 24, 14, this.gameMap, true);
    this.players[1].addUnit(this.game, "infantry", 24, 15, this.gameMap, true);
    this.players[1].addUnit(this.game, "archer", 24, 16, this.gameMap, true);
    this.players[1].addUnit(this.game, "cavalry", 24, 17, this.gameMap, true);
    this.players[1].addUnit(this.game, "cavalry", 23, 18, this.gameMap, true);
    this.players[1].addUnit(this.game, "worker", 24, 18, this.gameMap, true);

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

    console.log("turn skip. playing " + this.playingPlayer);
  }
};

module.exports = PlayScene;

},{"./Cursor.js":1,"./Map.js":2,"./Player.js":3,"./Square.js":4,"./Units.js":5}]},{},[6]);
