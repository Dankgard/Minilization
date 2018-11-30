'use strict';

var units = require('./Units.js');

class Player {
  constructor(number, money) {
    this.number = number;
    this.money = money;
    this.numberOfUnits = 0;
    this.units = [];
  }

  addUnit(game, type, x, y, gameMap,free) {
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
    if(!free)
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
      }
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