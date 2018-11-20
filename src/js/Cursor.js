'use strict';

class Cursor extends Phaser.Sprite {
  constructor(x, y)
  {
    super(game, x, y, sprite);
    this.sprite = "cursor.png";
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