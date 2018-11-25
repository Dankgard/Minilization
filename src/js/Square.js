'use strict';

class Square extends Phaser.Sprite {
  constructor(game, x, y, type, sprite, goldPerTurn, squareWidth, squareHeight) {
    super(game, x * squareWidth, y * squareHeight, sprite);
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