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