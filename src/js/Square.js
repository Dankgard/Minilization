'use strict';

class Square extends Phaser.Sprite  {
  constructor(x, y, type, sprite, goldPerTurn)
  {
    super(game, x, y, sprite, nombre);
    this.type = type;
    this.goldPerTurn = goldPerTurn;
  }
}