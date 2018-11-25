'use strict';

class Cursor extends Phaser.Sprite {
  constructor(game, x, y, squareWidth, squareHeight) {
    super(game, x * squareWidth, y * squareHeight, 'cursor');
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

  handleEvents(game, gameMap, players) {
    // mover izquierda
    if (this.leftKey.isDown)
      if (this.posX > 0) {
        this.x -= gameMap.squareWidth;
        this.posX--;
        game.world.bringToTop(this);
      }
    // mover derecha
    if (this.rightKey.isDown)
      if (this.posX < gameMap.width - 1) {
        this.x += gameMap.squareWidth;
        this.posX++;
        game.world.bringToTop(this);
      }
    // mover arriba
    if (this.upKey.isDown)
      if (this.posY > 0) {
        this.y -= gameMap.squareHeight;
        this.posY--;
        game.world.bringToTop(this);
      }
    // mover abajo 
    if (this.downKey.isDown)
      if (this.posY < gameMap.height - 1) {
        this.y += gameMap.squareHeight;
        this.posY++;
        game.world.bringToTop(this);
      }
    // tecla de acciones
    if (this.zKey.isDown) {
      if (gameMap.squares[this.posY][this.posX] == undefined)
        gameMap.createEmptySquare(this.posX, this.posY);

      var hoveringSquare = gameMap.squares[this.posY][this.posX];
      var hoveringUnit = hoveringSquare.unit;

      // seleccionar unidades
      if (hoveringUnit != 'null' && this.selectedUnit == 'null') {
        this.oldX = this.posX;
        this.oldY = this.posY;
        this.selectedUnit = hoveringUnit;
        console.log(this.selectedUnit.element);
      }
      // teniendo la unidad ya seleccionada
      else if (this.selectedUnit != 'null') {
        // mover unidad seleccionada
        if (hoveringUnit == 'null') {
          // si entra en el rango de movimiento y no se ha movido todavia
          if (this.selectedUnit.canMove(this.posX, this.posY) && this.selectedUnit.movementDone == false) {
            this.selectedUnit.move(this.posX, this.posY, gameMap);
            this.selectedUnit.movementDone = true;
            console.log("moved " + this.selectedUnit.element);
            gameMap.emptySquareFromUnit(this.oldX, this.oldY);
            gameMap.squares[this.posY][this.posX].unit = this.selectedUnit;
          }
          else {
            console.log("cannot move " + this.selectedUnit.element);
          }
        }
        // saltar movimiento de la unidad
        else if (this.selectedUnit == hoveringUnit) {
          this.selectedUnit.movementDone = true;
          console.log(this.selectedUnit.element + " skipped move");
        }
        // atacar unidad enemiga
        else if (this.selectedUnit.player != hoveringUnit.player) {
          var enemyX = hoveringUnit.posX;
          var enemyY = hoveringUnit.posY;
          var enemyTeam = hoveringUnit.player;
          var enemyNumber = hoveringUnit.unitNumber;
          // si no ha atacado todavia y entra en el rango de ataque
          if (this.selectedUnit.canAttack(enemyX, enemyY) && this.selectedUnit.attackDone == false) {
            this.selectedUnit.attackDone = true;
            var destroyed = this.selectedUnit.attack(hoveringUnit);
            console.log("attacking enemy unit");
            if(destroyed)
            {
              gameMap.emptySquareFromUnit(enemyX, enemyY);
              players[enemyTeam - 1].destroyUnit(enemyNumber);
            }
          }
          // si ya ha atacado
          else {
            console.log("cannot attack");
          }
        }
      }
      this.selectedUnit = 'null';
    }
  }
}

module.exports = Cursor;