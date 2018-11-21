'use strict';
var square=require('./Square.js');

class Map{
  constructor(game,width, height)
  {
    this.width = width;
    this.height = height;
    this.squareWidth = 800/(this.width);
    this.squareHeight = 600/(this.height);
    this.squares = new Array(height);
    for (var i = 0; i < this.squares.length; i++) {
      this.squares[i] = new Array(width);
    }

    var numberOfForests = Math.abs(Math.random() * 5);
    var numberOfMines = Math.abs(Math.random() * 5);
    var numberOfRuins = Math.abs(Math.random() * 5);

    for(var i=0;i<numberOfForests;i++)
    {
      var x = Math.abs(Math.random() * width);
      var y = Math.abs(Math.random() * height);
      this.squares[y][x] = new square.ForestSquare(game,x,y);
    }

    for(var i=0;i<numberOfMines;i++)
    {
      var x = Math.abs(Math.random() * width);
      var y = Math.abs(Math.random() * height);
      this.squares[y][x] = new square.ForestSquare(game,x,y);
    }

    for(var i=0;i<numberOfRuins;i++)
    {
      var x = Math.abs(Math.random() * width);
      var y = Math.abs(Math.random() * height);
      this.squares[y][x] = new square.ForestSquare(game,x,y);
    }

  }
}

module.exports = Map;