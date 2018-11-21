'use strict';

class Cursor extends Phaser.Sprite {
  constructor(game, x, y)
  {
    super(game, x, y, 'cursor');
    game.add.existing(this);
    this.scale.setTo(2,2);
  }

  move(dir)
  {
    switch(dir)
    {
      case "left":
        this.x--;
        break;
      case "right":
        this.x++;
        break;
      case "up":
        this.y--;
        break;
      case "down":
        this.y++;
        break;
    }
  }
}

module.exports = Cursor;