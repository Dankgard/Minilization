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
    this.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.selectedUnit = 'null';
  }

  handleEvents(game, gameMap, players, playingPlayer) {
    var skipTurn = false;
    // mover izquierda
    if (this.leftKey.isDown)
      this.moveLeft(game, gameMap);

    // mover derecha
    if (this.rightKey.isDown)
      this.moveRight(game, gameMap);

    // mover arriba
    if (this.upKey.isDown)
      this.moveUp(game, gameMap);

    // mover abajo 
    if (this.downKey.isDown)
      this.moveDown(game, gameMap);

    // tecla de acciones
    if (this.zKey.isDown)
      this.actionKey(game, gameMap, players, playingPlayer);

    // deseleccionar unidad
    if(this.xKey.isDown)
    {
      delete this.selectedUnit;
      this.selectedUnit = 'null';
      console.log("unit deselected");
    }

    // pasar turno
    if(this.spaceKey.isDown)
      skipTurn = true;

    return skipTurn;
  }

  moveLeft(game, gameMap) {
    if (this.posX > 0) {
      this.x -= gameMap.squareWidth;
      this.posX--;
      game.world.bringToTop(this);
    }
  }

  moveRight(game, gameMap) {
    if (this.posX < gameMap.width - 1) {
      this.x += gameMap.squareWidth;
      this.posX++;
      game.world.bringToTop(this);
    }
  }

  moveUp(game, gameMap) {
    if (this.posY > 0) {
      this.y -= gameMap.squareHeight;
      this.posY--;
      game.world.bringToTop(this);
    }
  }

  moveDown(game, gameMap) {
    if (this.posY < gameMap.height - 1) {
      this.y += gameMap.squareHeight;
      this.posY++;
      game.world.bringToTop(this);
    }
  }

  actionKey(game, gameMap, players, playingPlayer) {
    if (gameMap.squares[this.posY][this.posX] == undefined)
      gameMap.createEmptySquare(this.posX, this.posY);

    var hoveringSquare = gameMap.squares[this.posY][this.posX];
    var hoveringUnit = hoveringSquare.unit;
    var hoveringBuilding = hoveringSquare.building;

    // seleccionar unidades
    if (hoveringUnit != 'null' && hoveringUnit.player == playingPlayer && this.selectedUnit == 'null') {
      this.oldX = this.posX;
      this.oldY = this.posY;
      this.selectedUnit = hoveringUnit;
      console.log(this.selectedUnit.element);
    }
    // teniendo la unidad ya seleccionada
    else if (this.selectedUnit != 'null') {
      // mover unidad seleccionada
      if (hoveringUnit == 'null' && hoveringBuilding == 'null' || hoveringBuilding.player == this.selectedUnit.player) {
        // si entra en el rango de movimiento y no se ha movido todavia
        if (this.selectedUnit.canMove(this.posX, this.posY) && this.selectedUnit.movementDone == false) {
          this.selectedUnit.move(this.posX, this.posY, gameMap);
          this.selectedUnit.movementDone = true;
          console.log("moved " + this.selectedUnit.element);
          gameMap.emptySquareFromUnit(this.oldX, this.oldY);
          gameMap.squares[this.posY][this.posX].unit = this.selectedUnit;
          game.world.bringToTop(this.selectedUnit);
          game.world.bringToTop(this);
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
      // atacar enemigos
      else if (hoveringUnit != 'null' || hoveringBuilding != 'null') {

        var hovering;
        // atacar unidad enemiga
        if (hoveringUnit != 'null' && this.selectedUnit.player != hoveringUnit.player)
          hovering = hoveringUnit;

        // atacar edificios enemigos
        else if (hoveringBuilding != 'null' && this.selectedUnit.player != hoveringBuilding.player)
          hovering = hoveringBuilding;

        var enemyX = hovering.posX;
        var enemyY = hovering.posY;
        var enemyTeam = hovering.player;
        var enemyNumber = hovering.unitNumber;
        // si no ha atacado todavia y entra en el rango de ataque
        if (this.selectedUnit.canAttack(enemyX, enemyY) && this.selectedUnit.attackDone == false) {
          this.selectedUnit.attackDone = true;
          var destroyed = this.selectedUnit.attack(hovering);
          console.log("attacking enemy");
          if (destroyed) {
            gameMap.emptySquareFromUnit(enemyX, enemyY);
            players[enemyTeam - 1].destroyUnit(enemyNumber);
          }
        }
      }
      delete this.selectedUnit;
      this.selectedUnit = 'null';
    }
  }
}

module.exports = Cursor;