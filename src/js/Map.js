'use strict';
var square=require('./Square.js');

class Map{
  constructor(game,width, height, squareWidth, squareHeight)
  {
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

    for(var i=0;i<numberOfForests;i++)
    {
      var x = Math.round(Math.random() * (width-1));
      var y = Math.round(Math.random() * (height-1));
      this.squares[y][x] = new square.ForestSquare(game,x,y,squareWidth, squareHeight);
    }

    for(var i=0;i<numberOfMines;i++)
    {
      var x = Math.round(Math.random() * (width-1));
      var y = Math.round(Math.random() * (height-1));
      this.squares[y][x] = new square.MineSquare(game,x,y,squareWidth, squareHeight);
    }

    for(var i=0;i<numberOfRuins;i++)
    {
      var x = Math.round(Math.random() * (width-1));
      var y = Math.round(Math.random() * (height-1));
      this.squares[y][x] = new square.RuinsSquare(game,x,y,squareWidth, squareHeight);
    }
  }

  createEmptySquare(x,y)
  {
    this.squares[y][x] = new square.EmptySquare(x, y);
  }
}

module.exports = Map;