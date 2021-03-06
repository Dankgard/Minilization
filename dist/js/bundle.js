(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

class Cursor extends Phaser.Sprite {
  constructor(game, x, y, squareWidth, squareHeight, gameMap, players, playingPlayer, player1Town, player2Town) {
    super(game, x * squareWidth + 50, y * squareHeight, 'cursor');
    game.add.existing(this);
    this.posX = 5;
    this.posY = 5;
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
    game.input.activePointer.leftButton.onDown.add(this.actionKey, this);

    this.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
    this.xKey.onDown.add(this.cancelSelection, this);
    game.input.activePointer.rightButton.onDown.add(this.cancelSelection, this);

    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(this.turnSkip, this);

    this.Key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.Key1.onDown.add(this.buildInfantry, this);
    this.Key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.Key2.onDown.add(this.buildCavalry, this);
    this.Key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    this.Key3.onDown.add(this.buildArcher, this);
    this.Key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    this.Key4.onDown.add(this.buildWorker, this);
    this.Key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    this.Key5.onDown.add(this.buildTower, this);
    this.Key6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
    this.Key6.onDown.add(this.buildWall, this);

    this.escapeKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.escapeKey.onDown.add(this.backToMenu, this);

    this.selectedUnit = 'null';
    this.unitSelection = this.game.add.sprite(50, 0, 'unitselection');
    this.unitSelection.scale.setTo(2, 2);
    this.unitSelection.visible = false;
    this.enemyMarker = this.game.add.sprite(50, 0, 'enemymarker');
    this.enemyMarker.scale.setTo(2, 2);
    this.enemyMarker.visible = false;
    this.allyMarker = this.game.add.sprite(50, 0, 'allymarker');
    this.allyMarker.scale.setTo(2, 2);
    this.allyMarker.visible = false;

    this.player1Town = player1Town;
    this.player2Town = player2Town;

    this.skipTurn = false;

    this.unitStyle = { font: "16px Arial", fill: "#ffffff" };

    this.infantryHUD = this.game.add.sprite(3, 150, 'blueknight');
    this.infantryHUD.scale.setTo(1.7, 1.7);
    this.infantryText = this.game.add.text(30, 155, "(5)", this.unitStyle);

    this.cavalryHUD = this.game.add.sprite(3, 250, 'bluerider');
    this.cavalryHUD.scale.setTo(1.7, 1.7);
    this.cavalryText = this.game.add.text(30, 255, "(5)", this.unitStyle);

    this.archerHUD = this.game.add.sprite(3, 350, 'bluearcher');
    this.archerHUD.scale.setTo(1.7, 1.7);
    this.archerText = this.game.add.text(30, 355, "(5)", this.unitStyle);

    this.workerHUD = this.game.add.sprite(3, 450, 'bluevillager');
    this.workerHUD.scale.setTo(1.7, 1.7);
    this.workerText = this.game.add.text(30, 455, "(7)", this.unitStyle);

    //this.towerHUD = this.game.add.text(900 - 40, 250, "TOWER (20)", this.unitStyle);
    this.towerHUD = this.game.add.sprite(900 - 55, 250, 'bluetower');
    this.towerHUD.scale.setTo(1.7, 1.7);
    this.towerText = this.game.add.text(900 - 30, 255, "(20)", this.unitStyle);

    //this.wallText = this.game.add.text(900 - 40, 350, "WALL (15)", this.unitStyle);
    this.wallHUD = this.game.add.sprite(900 - 50, 350, 'bluewall');
    this.wallHUD.scale.setTo(1.7, 1.7);
    this.wallText = this.game.add.text(900 - 27, 355, "(15)", this.unitStyle);

    this.towerText.visible = false;
    this.towerHUD.visible = false;
    this.wallText.visible = false;
    this.wallHUD.visible = false;
    this.keyStyle = { font: "30px Arial", fill: "#ffffff" };
    this.infantryKey = this.game.add.text(16, 180, "1", this.keyStyle);
    this.cavalryKey = this.game.add.text(16, 280, "2", this.keyStyle);
    this.archerKey = this.game.add.text(14, 380, "3", this.keyStyle);
    this.workerKey = this.game.add.text(14, 480, "4", this.keyStyle);
    this.towerKey = this.game.add.text(900 - 30, 280, "5", this.keyStyle);
    this.wallKey = this.game.add.text(900 - 30, 380, "6", this.keyStyle);
    this.towerKey.visible = false;
    this.wallKey.visible = false;

    this.infantryKey.visible = false;
    this.cavalryKey.visible = false;
    this.archerKey.visible = false;
    this.workerKey.visible = false;
    this.infantryHUD.visible = false;
    this.infantryText.visible = false;
    this.cavalryHUD.visible = false;
    this.cavalryText.visible = false;
    this.archerHUD.visible = false;
    this.archerText.visible = false;
    this.workerHUD.visible = false;
    this.workerText.visible = false;

    this.attackSound = this.game.add.audio('attack');
    this.moveSound = this.game.add.audio('move');
    this.selectSound = this.game.add.audio('select');
    this.cancelSound = this.game.add.audio('cancel');
    this.errorSound = this.game.add.audio('error');
  }

  showUnitBuildInfo() {
    if ((this.posX == this.player1Town.posX && this.posY == this.player1Town.posY) || (this.posX == this.player2Town.posX && this.posY == this.player2Town.posY))
      this.cityUnitsVisible(true);
    else
      this.cityUnitsVisible(false);
  }

  cityUnitsVisible(visible) {
    this.infantryKey.visible = visible;
    this.cavalryKey.visible = visible;
    this.archerKey.visible = visible;
    this.workerKey.visible = visible;
    this.infantryHUD.visible = visible;
    this.infantryText.visible = visible;
    this.cavalryHUD.visible = visible;
    this.cavalryText.visible = visible;
    this.archerHUD.visible = visible;
    this.archerText.visible = visible;
    this.workerHUD.visible = visible;
    this.workerText.visible = visible;
  }

  workerUnitsVisible(visible) {
    this.towerText.visible = visible;
    this.towerHUD.visible = visible;
    this.wallText.visible = visible;
    this.wallHUD.visible = visible;
    this.towerKey.visible = visible;
    this.wallKey.visible = visible;
  }

  handleEvents() {

    this.moveWithMouse();

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

  roundMouse(value, step) {
    step || (step = 1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
  }

  moveWithMouse() {
    this.x = this.gameMap.squareWidth / 2 + this.roundMouse(this.game.input.mousePointer.x - this.gameMap.squareWidth / 2, this.gameMap.squareWidth);
    this.y = this.roundMouse(this.game.input.mousePointer.y, this.gameMap.squareHeight);
    this.posX = this.x / this.gameMap.squareWidth - 1.5;
    this.posY = Math.round(this.y / this.gameMap.squareHeight);
    this.updateMarker();
    this.game.world.bringToTop(this);
    this.showUnitBuildInfo();
  }

  cancelSelection() {
    delete this.selectedUnit;
    this.selectedUnit = 'null';
    if (this.wallText.visible)
      this.workerUnitsVisible(false);
    this.unitSelection.visible = false;
    this.enemyMarker.visible = false;
    this.allyMarker.visible = false;
    console.log("unit deselected");
    this.cancelSound.play();
  }

  turnSkip() {
    this.skipTurn = true;
  }

  updateMarker() {
    if (this.posY <= this.gameMap.height - 1) {
      this.enemyMarker.visible = false;
      this.allyMarker.visible = false;
      if (this.selectedUnit != 'null') {
        if (this.gameMap.squares[this.posY][this.posX] == undefined)
          this.gameMap.createEmptySquare(this.posX, this.posY);
        var hoveringSquare = this.gameMap.squares[this.posY][this.posX];
        var marker;
        if (hoveringSquare.unit == 'null' && hoveringSquare.building == 'null' && this.selectedUnit.canMove(this.posX, this.posY))
          marker = this.allyMarker;
        else if (this.selectedUnit.isCombatUnit() && this.selectedUnit.canAttack(this.posX, this.posY) && hoveringSquare.unit.player != this.selectedUnit.player)
          marker = this.enemyMarker;
        if (marker != undefined) {
          marker.visible = true;
          marker.position.x = hoveringSquare.posX * this.gameMap.squareWidth + 50;
          marker.position.y = hoveringSquare.posY * this.gameMap.squareHeight;
        }
      }
    }
  }

  moveLeft() {
    if (this.posX > 0) {
      this.x -= this.gameMap.squareWidth;
      this.posX--;
      this.updateMarker();
      this.game.world.bringToTop(this);
      this.showUnitBuildInfo();
    }
    else
      this.errorSound.play();
  }

  moveRight() {
    if (this.posX < this.gameMap.width - 1) {
      this.x += this.gameMap.squareWidth;
      this.posX++;
      this.updateMarker();
      this.game.world.bringToTop(this);
      this.showUnitBuildInfo();
    }
    else
      this.errorSound.play();
  }

  moveUp() {
    if (this.posY > 0) {
      this.y -= this.gameMap.squareHeight;
      this.posY--;
      this.updateMarker();
      this.game.world.bringToTop(this);
      this.showUnitBuildInfo();
    }
    else
      this.errorSound.play();
  }

  moveDown() {
    if (this.posY < this.gameMap.height - 1) {
      this.y += this.gameMap.squareHeight;
      this.posY++;
      this.updateMarker();
      this.game.world.bringToTop(this);
      this.showUnitBuildInfo();
    }
    else
      this.errorSound.play();
  }

  actionKey() {
    if (this.posX >= 0 && this.posX <= this.gameMap.width - 1) {
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
        this.selectSound.play();
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
            this.moveSound.play();
          }
          else {
            console.log("cannot move " + this.selectedUnit.element);
            this.errorSound.play();
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

          if (hovering != undefined) {
            var enemyX = hovering.posX;
            var enemyY = hovering.posY;
            var enemyTeam = hovering.player;
            var enemyNumber = hovering.unitNumber;
            // si no ha atacado todavia y entra en el rango de ataque
            if (this.selectedUnit.canAttack(enemyX, enemyY) && this.selectedUnit.attackDone == false) {
              this.selectedUnit.attackDone = true;
              var destroyed = this.selectedUnit.attack(hovering);
              this.attackSound.play();
              console.log("attacking enemy");
              if (destroyed) {
                this.gameMap.emptySquareFromUnit(enemyX, enemyY);
                this.players[enemyTeam - 1].destroyUnit(enemyNumber);
              }
            }
            else
              this.errorSound.play();
          }
        }
        if (this.wallText.visible)
          this.workerUnitsVisible(false);
        delete this.selectedUnit;
        this.selectedUnit = 'null';
        this.unitSelection.visible = false;
      }
    }
  }

  buildWall() {
    if (this.selectedUnit != 'null' && this.selectedUnit.isWorker()) {
      this.selectedUnit.build("wall", this.players, this.gameMap);
      if (this.wallText.visible)
        this.workerUnitsVisible(false);
      delete this.selectedUnit;
      this.selectedUnit = 'null';
      this.unitSelection.visible = false;
    }
  }

  buildTower() {
    if (this.selectedUnit != 'null' && this.selectedUnit.isWorker()) {
      this.selectedUnit.build("watchtower", this.players, this.gameMap);
      if (this.wallText.visible)
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
    console.log("building archer");
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

  backToMenu() {
    this.game.sound.stopAll();
    this.menumusic = this.game.add.audio('menutheme');
    this.menumusic.loop = true;
    this.menumusic.play();
    this.game.state.start('MainMenu');
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
  constructor(game, number, money) {
    this.number = number;
    this.money = money;
    this.numberOfUnits = 0;
    this.units = [];

    this.buildSound = game.add.audio('build');
    this.errorSound = game.add.audio('error');
  }

  linkHUD(goldText)
  {
    this.goldText = goldText;
  }

  addUnit(game, type, x, y, gameMap, free) {
    var unitBuilt = false;
    var unit;
    var cost;
    var unitThere = false;
    var buildingThere = false;
    
    if (gameMap.squares[y][x] == undefined)
        gameMap.createEmptySquare(x, y);
    if (gameMap.squares[y][x].unit != 'null')
      unitThere = true;
    if (gameMap.squares[y][x].building != 'null')
      buildingThere = true;

    switch (type) {
      case "town":
        cost = 100;
        if (!buildingThere && (free || (!free && this.money >= cost))) {
          unit = new units.Town(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
          unitBuilt = true;
        }
        break;
      case "wall":
        cost = 15;
        console.log(free + " " + this.money + " " + cost);
        if (!buildingThere && (free || (!free && this.money >= cost))) {
          unit = new units.Wall(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
          unitBuilt = true;
        }
        break;
      case "watchtower":
        cost = 20;
        if (!buildingThere && (free || (!free && this.money >= cost))) {
          unit = new units.Watchtower(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
          unitBuilt = true;
        }
        break;
      case "worker":
        cost = 7;
        if (!unitThere && (free || (!free && this.money >= cost))) {
          unit = new units.Worker(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
          unitBuilt = true;
        }
        break;
      case "infantry":
        cost = 5;
        if (!unitThere && (free || (!free && this.money >= cost))) {
          unit = new units.Infantry(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
          unitBuilt = true;
        }
        break;
      case "cavalry":
        cost = 5;
        if (!unitThere && (free || (!free && this.money >= cost))) {
          unit = new units.Cavalry(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
          unitBuilt = true;
        }
        break;
      case "archer":
        cost = 5;
        if (!unitThere && (free || (!free && this.money >= cost))) {
          unit = new units.Archer(game, x, y, this.number, this.numberOfUnits, gameMap.squareWidth, gameMap.squareHeight);
          unitBuilt = true;
        }
        break;
    }

    if (unitBuilt) {
      if (!free && this.money >= cost)
        this.money -= cost;
      this.goldText.setText(this.money);
      this.numberOfUnits++;
      this.units.push(unit);

      if (unit.isMovable())
        gameMap.squares[y][x].unit = unit;
      else
        gameMap.squares[y][x].building = unit;
      this.buildSound.play();
    }
    else
      this.errorSound.play();

  }

  destroyUnit(unitNumber) {
    this.units.splice(unitNumber, 1);
    this.numberOfUnits--;
  }

  resetUnitUse() {
    for (var i = 0; i < this.numberOfUnits; i++) {
      this.units[i].resetUse();
    }
  }

  workerWork(gameMap) {
    for (var i = 0; i < this.numberOfUnits; i++) {
      {
        this.money += this.units[i].work(gameMap.squares[this.units[i].posY][this.units[i].posX].goldPerTurn);
      }
    }
    console.log("gold: " + this.money);
  }

  towerAttack(gameMap) {
    for (var i = 0; i < this.numberOfUnits; i++) {
        this.units[i].towerAttack(gameMap, this);
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
var PlayScene = require('./main.js');

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

  // metodos abstractos no implementados aquí

  resetUse()
  {
    return 0;
  }

  work(goldPerTurn)
  {
    return 0;
  }

  towerAttack(gameMap, player)
  {
    return 0;
  }

  // fin de métodos abstractos no implementados

  takeDamage(damage) {
    this.hp -= damage;
    this.healthHud.setText(this.hp);
    if (this.hp <= 0) {
      this.destroyUnit(this.game);
      return true;
    }
    else
      return false;
  }

  destroyUnit(game) {
    this.destroy();
  }

  isMovable() {
    return false;
  }

  isCombatUnit() {
    return false;
  }

  isTown() {
    return false;
  }

  isWorker() {
    return false;
  }
}

class Town extends Unit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 100, player, 'bluetown', unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 100, player, 'redtown', unitNumber, squareWidth, squareHeight);
    }

    this.buildDone = false;
  }

  resetUse()
  {
    this.buildDone = false;
  }

  isTown() {
    return true;
  }

  destroyUnit(game) {
    this.destroy();

    if (this.player == 2) {
      game.state.start('humanes');
      console.log("Ha ganado Humanes");
    }
    else {
      game.state.start('algete');
      console.log("Ha ganado Algete");
    }
  }

  createUnit(type, players, gameMap) {
    if (this.buildDone == false) {
      players[this.player - 1].addUnit(this.game, type, this.posX, this.posY, gameMap, false);
      this.buildDone = true;
    }
  }
}

class Wall extends Unit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 50, player, 'bluewall', unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 50, player, 'redwall', unitNumber, squareWidth, squareHeight);
    }
  }
}

class Watchtower extends Unit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 30, player, 'bluetower', unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 30, player, 'redtower', unitNumber, squareWidth, squareHeight);
    }

    this.range = 2;
    this.damage = 20;
  }

  // ataque automatico a la unidad enemiga mas cercana
  towerAttack(gameMap, player) {
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
  }

  canMove(posX, posY) {
    if ((this.posX == posX && Math.abs(this.posY - posY) <= this.moves) || (this.posY == posY && Math.abs(this.posX - posX) <= this.moves))
      return true;
    else
      return false;
  }

  isMovable() {
    return true;
  }

  resetUse()
  {
    this.movementDone = false;
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
      super(game, x, y, 20, 2, 'bluevillager', player, unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 20, 2, 'redvillager', player, unitNumber, squareWidth, squareHeight);
    }

    this.buildDone = false;
  }

  resetUse()
  {
    this.movementDone = false;
    this.buildDone = false;
  }

  isWorker() {
    return true;
  }

  work(goldPerTurn)
  {
    return goldPerTurn;
  }

  build(type, players, gameMap) {
    if (this.buildDone == false) {
      players[this.player - 1].addUnit(this.game, type, this.posX, this.posY, gameMap, false);
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
    this.attackDone = false;
  }

  canAttack(posX, posY) {
    if ((this.posX == posX && Math.abs(this.posY - posY) <= this.range) || (this.posY == posY && Math.abs(this.posX - posX) <= this.range))
      return true;
    else
      return false;
  }

  isCombatUnit() {
    return true;
  }

  resetUse()
  {
    this.movementDone = false;
    this.attackDone = false;
  }

  attack(enemy) {
    var bonusDamage;
    var destroyed = false;

    if (this.element == enemy.element)
      bonusDamage = 1;
    else if ((this.element == "archer" && enemy.element == "cavalry") || (this.element == "infantry" && enemy.element == "archer") ||
      (this.element == "cavalry" && enemy.element == "infantry"))
      bonusDamage = 2;
    else if ((this.element == "archer" && enemy.element == "infantry") || (this.element == "infantry" && enemy.element == "cavalry") ||
      (this.element == "cavalry" && enemy.element == "archer"))
      bonusDamage = 0.5;
    else
      bonusDamage = 1;

    destroyed = enemy.takeDamage(Math.round(this.damage * bonusDamage));
    return destroyed;
  }
}

class Archer extends CombatUnit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 30, 2, 'bluearcher', player, 3, 20, "archer", unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 30, 2, 'redarcher', player, 3, 20, "archer", unitNumber, squareWidth, squareHeight);
    }
  }
}


class Infantry extends CombatUnit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 50, 2, 'blueknight', player, 1, 20, "infantry", unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 50, 2, 'redknight', player, 1, 20, "infantry", unitNumber, squareWidth, squareHeight);
    }
  }
}

class Cavalry extends CombatUnit {
  constructor(game, x, y, player, unitNumber, squareWidth, squareHeight) {
    if (player == 1) {
      super(game, x, y, 40, 4, 'bluerider', player, 1, 20, "cavalry", unitNumber, squareWidth, squareHeight);
    }
    else {
      super(game, x, y, 40, 4, 'redrider', player, 1, 20, "cavalry", unitNumber, squareWidth, squareHeight);
    }
  }
}

module.exports = {
  Unit: Unit, Town: Town, Wall: Wall, Watchtower: Watchtower, HumanUnit: HumanUnit, Worker: Worker, CombatUnit: CombatUnit, Archer: Archer, Infantry: Infantry, Cavalry: Cavalry
};
},{"./main.js":6}],6:[function(require,module,exports){
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

    this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); } 
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
    var infotexC= this.game.add.text(500, 400, "-Infantry-", this.ruleStyle);
    var Infa=this.game.add.sprite(515,430,'blueknight');
    Infa.scale.setTo(2,2);
    var infotexA= this.game.add.text(600, 400, "-Archers-", this.ruleStyle);
    var Arch=this.game.add.sprite(615,430,'bluearcher');
    Arch.scale.setTo(2,2);
    var infotexJ= this.game.add.text(700, 400, "-Cavalry-", this.ruleStyle);
    var Jine=this.game.add.sprite(715,430,'bluerider');
    Jine.scale.setTo(2,2);
    var infotexW= this.game.add.text(550, 500, "-Wall-", this.ruleStyle);
    var Wa=this.game.add.sprite(555,530,'bluewall');
    Wa.scale.setTo(2,2);
    var infotexT= this.game.add.text(650, 500, "-Tower-", this.ruleStyle);
    var To=this.game.add.sprite(655,530,'bluetower');
    To.scale.setTo(2,2);
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






},{"./play_scene.js":7}],7:[function(require,module,exports){
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

    this.calltime = 2;
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

    this.players[0].linkHUD(this.blueGold);
    this.players[1].linkHUD(this.redGold);
  },

  createArmies: function() {
    var y = Math.round(Math.random() * (this.mapHeight - 1));
    this.players[0].addUnit(this.game, "town", 0, y, this.gameMap, true);
    var y = Math.round(Math.random() * (this.mapHeight - 1))
    this.players[1].addUnit(this.game, "town", this.mapWidth - 1, y, this.gameMap, true);

    this.player1Town = this.players[0].units[0];
    this.player2Town = this.players[1].units[0];
    this.gameCursor = new cursor(this.game, 0, 0, this.squareWidth, this.squareHeight, this.gameMap, this.players, this.playingPlayer, this.player1Town, this.player2Town);

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

},{"./Cursor.js":1,"./Map.js":2,"./Player.js":3,"./Square.js":4,"./Units.js":5}]},{},[6]);
