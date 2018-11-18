'use strict';

class Map{
  constructor(width, height)
  {
    this.width = width;
    this.height = height;
    this.squares = new Array(height);
    for (var i = 0; i < squares.length; i++) {
      squares[i] = new Array(width);
    }

    for (var i = 0; i < height; i++) {
      for(var j = 0; i < width;j++)
      {
        squares[j][i] = new Square(j,i,"empty","empty.png",0);
      }
    }
  }
}