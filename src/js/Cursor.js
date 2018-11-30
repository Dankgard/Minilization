'use strict';

class Cursor extends Phaser.Sprite {
  constructor(game, x, y, squareWidth, squareHeight, gameMap, players, playingPlayer) {
    super(game, x * squareWidth, y * squareHeight, 'cursor');
    game.add.existing(this);
    this.posX = x;
    this.posY = y;
    this.oldX = 0;
    this.oldY = 0;

    this.gameMap = gameMap;
    this.players = players;
    this.playingPlayer = playingPlayer;

    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    this.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.zKey.onDown.add(this.actionKey, this);

    this.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
    this.xKey.onDown.add(this.cancelSelection, this);
    
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(this.turnSkip, this);

    this.selectedUnit = 'null';

    this.skipTurn = false;
  }

  handleEvents() {    
    // mover izquierda
    if (this.leftKey.isDown)
      this.moveLeft();

    // mover derecha
    if (this.rightKey.isDown)
      this.moveRight();

    // mover arriba
    if (this.upKey.isDown)
      this.moveUp();

    // mover abajo 
    if (this.downKey.isDown)
      this.moveDown();

    return this.skipTurn;
  }

  cancelSelection() {
    delete this.selectedUnit;
    this.selectedUnit = 'null';
    console.log("unit deselected");
  }

  turnSkip()
  {
    this.skipTurn = true;
  }

  moveLeft() {
    if (this.posX > 0) {
      this.x -= this.gameMap.squareWidth;
      this.posX--;
      this.game.world.bringToTop(this);
    }
  }

  moveRight() {
    if (this.posX < this.gameMap.width - 1) {
      this.x += this.gameMap.squareWidth;
      this.posX++;
      this.game.world.bringToTop(this);
    }
  }

  moveUp() {
    if (this.posY > 0) {
      this.y -= this.gameMap.squareHeight;
      this.posY--;
      this.game.world.bringToTop(this);
    }
  }

  moveDown() {
    if (this.posY < this.gameMap.height - 1) {
      this.y += this.gameMap.squareHeight;
      this.posY++;
      this.game.world.bringToTop(this);
    }
  }

  actionKey() {
    if (this.gameMap.squares[this.posY][this.posX] == undefined)
      this.gameMap.createEmptySquare(this.posX, this.posY);

    var hoveringSquare = this.gameMap.squares[this.posY][this.posX];
    var hoveringUnit = hoveringSquare.unit;
    var hoveringBuilding = hoveringSquare.building;

    // seleccionar unidades
    if (hoveringUnit != 'null' && hoveringUnit.player == this.playingPlayer && this.selectedUnit == 'null') {
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
          this.selectedUnit.move(this.posX, this.posY, this.gameMap);
          this.selectedUnit.movementDone = true;
          console.log("moved " + this.selectedUnit.element);
          this.gameMap.emptySquareFromUnit(this.oldX, this.oldY);
          this.gameMap.squares[this.posY][this.posX].unit = this.selectedUnit;
          this.game.world.bringToTop(this.selectedUnit);
          this.game.world.bringToTop(this);
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
      else if (this.selectedUnit.isCombatUnit() && (hoveringUnit != 'null' || hoveringBuilding != 'null')) {

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
            this.gameMap.emptySquareFromUnit(enemyX, enemyY);
            this.players[enemyTeam - 1].destroyUnit(enemyNumber);
          }
        }
      }
      delete this.selectedUnit;
      this.selectedUnit = 'null';
    }
  }
}

module.exports = Cursor;