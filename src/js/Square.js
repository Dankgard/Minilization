'use strict';

class Square extends Phaser.Sprite  {
  constructor(game, x, y, type, sprite, goldPerTurn)
  {
    super(this, game, x, y, sprite);
    this.type = type;
    this.goldPerTurn = goldPerTurn;
  }
}

class RuinsSquare extends Square {
  constructor(game,x, y)
  {
    super(game,x, y, "ruins", 'ruins', 3);
  }
}

class MineSquare extends Square {
  constructor(game,x, y)
  {
    super(game,x, y, "mine", 'mine', 2);
  }
}

class ForestSquare extends Square {
  constructor(game,x, y)
  {
    super(x, y, "forest", 'forest', 1);
  }
}

