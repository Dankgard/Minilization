'use strict';

class Cursor extends Phaser.Sprite {
  constructor(game, x, y,mapWidth, mapHeight, squareWidth, squareHeight)
  {
    super(game, x*squareWidth, y*squareHeight, 'cursor');
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.squareWidth = squareWidth;
    this.squareHeight = squareHeight;
    game.add.existing(this);
    this.posX = x;
    this.posY = y;

    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  }

  move(game)
  {
    if (this.leftKey.isDown)
        if(this.posX > 0)
        {
          this.x-= this.squareWidth;
          this.posX--;
        }
        
    if (this.rightKey.isDown)
        if(this.posX < this.mapWidth-1)
        {
          this.x+= this.squareWidth;
          this.posX++;
        }
        
    if (this.upKey.isDown)
        if(this.posY > 0)
        {
          this.y-= this.squareHeight;
          this.posY--;
        }
        
    if (this.downKey.isDown)
        if(this.posY < this.mapHeight-1)
        {
          this.y+= this.squareHeight;
          this.posY++;
        }

    console.log(this.posX + "," + this.posY + "," + this.x + "," + this.y);
    
  }
}

module.exports = Cursor;