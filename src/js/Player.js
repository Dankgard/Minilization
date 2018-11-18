'use strict';

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