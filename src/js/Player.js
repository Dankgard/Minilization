'use strict';

var units= require('./Units.js');

class Player  {
  constructor(number, money)
  {
    this.number = number;
    this.money = money;
    this.numberOfUnits = 0;
    this.units = [];
  }

  addUnit(game,type, x, y)
  {
    var unit;
    var cost;
    switch (type)
    {
      case "town":
        unit = new units.Town(game,x, y, this.number, numberOfUnits);
        cost = 100;
        break;
      case "wall":
        unit = new units.Wall(game,x, y, this.number, numberOfUnits);
        cost = 40;
        break;
      case "watchtower":
        unit = new units.Watchtower(game,x, y, this.number, numberOfUnits);
        cost = 40;
        break;
      case "worker":
        unit = new units.Worker(game,x, y, this.number, numberOfUnits);
        cost = 50;
        break;
      case "infantry":
        unit = new units.Infantry(game,x, y, this.number, numberOfUnits);
        cost = 30;
        break;
      case "cavalry":
        unit = new units.Cavalry(game,x, y, this.number, numberOfUnits);
        cost = 30;
        break;
      case "archer":
        unit = new units.Archer(game,x, y, this.number, numberOfUnits);
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

module.exports = Player;