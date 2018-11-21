'use strict';

class Cursor extends Phaser.Sprite {
  constructor(game, x, y, squareWidth, squareHeight)
  {
    super(game, x*squareWidth, y*squareHeight, 'cursor');
    game.add.existing(this);
    this.posX = x;
    this.posY = y;
    this.oldX = 0;
    this.oldY = 0;

    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);

    this.selectedUnit = 'null';
  }

  handleEvents(game, gameMap)
  {
    if (this.leftKey.isDown)
        if(this.posX > 0)
        {
          this.x-= gameMap.squareWidth;
          this.posX--;
        }
        
   if (this.rightKey.isDown)
        if(this.posX < gameMap.width-1)
        {
          this.x+= gameMap.squareWidth;
          this.posX++;
        }
        
   if (this.upKey.isDown)
        if(this.posY > 0)
        {
          this.y-= gameMap.squareHeight;
          this.posY--;
        }
        
   if (this.downKey.isDown)
        if(this.posY < gameMap.height-1)
        {
          this.y+= gameMap.squareHeight;
          this.posY++;
        }

    if(this.zKey.isDown)
    {
      if(gameMap.squares[this.posY][this.posX] == undefined)
        gameMap.createEmptySquare(this.posX, this.posY);

      var hoveringSquare = gameMap.squares[this.posY][this.posX];
      var hoveringUnit = hoveringSquare.unit;

      if(hoveringUnit != 'null' && this.selectedUnit == 'null')
        {
          this.oldX = this.posX;
          this.oldY = this.posY;
          this.selectedUnit = hoveringUnit;
          console.log(this.selectedUnit.element);
        }
     if(this.selectedUnit != 'null' && hoveringUnit == 'null')
      {
        // llamar solo si entra en el rango
        this.selectedUnit.move(this.posX,this.posY,gameMap);
        console.log("moved" + this.selectedUnit.element);
        gameMap.createEmptySquare(this.oldX, this.oldY);
        gameMap.squares[this.posY][this.posX].unit = this.selectedUnit;
        this.selectedUnit = 'null';
      }
    }

    
  }
}

module.exports = Cursor;