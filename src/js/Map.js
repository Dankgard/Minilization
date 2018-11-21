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

    var numberOfForests = Math.round(Math.random() * 10);
    var numberOfMines = Math.round(Math.random() * 10);
    var numberOfRuins = Math.round(Math.random() * 10);

    for(var i=0;i<numberOfForests;i++)
    {
      var x = Math.round(Math.random() * width);
      var y = Math.round(Math.random() * height);
      console.log(x);
      console.log(y);
      this.squares[y][x] = new square.ForestSquare(game,x*this.squareWidth,y*this.squareHeight);
    }

    for(var i=0;i<numberOfMines;i++)
    {
      var x = Math.round(Math.random() * width);
      var y = Math.round(Math.random() * height);
      this.squares[y][x] = new square.MineSquare(game,x*this.squareWidth,y*this.squareHeight);
    }

    for(var i=0;i<numberOfRuins;i++)
    {
      var x = Math.round(Math.random() * width);
      var y = Math.round(Math.random() * height);
      this.squares[y][x] = new square.RuinsSquare(game,x*this.squareWidth,y*this.squareHeight);
    }

  }
}

module.exports = Map;