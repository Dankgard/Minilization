'use strict';

class Cursor extends Phaser.Sprite {
  constructor(game, x, y, squareWidth, squareHeight, gameMap, players, playingPlayer, player1Town, player2Town) {
    super(game, x * squareWidth + 50, y * squareHeight, 'cursor');
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

    this.Key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.Key1.onDown.add(this.buildInfantry, this);
    this.Key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.Key2.onDown.add(this.buildCavalry, this);
    this.Key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    this.Key3.onDown.add(this.buildArcher, this);
    this.Key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    this.Key4.onDown.add(this.buildWorker, this);
    this.Key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    this.Key5.onDown.add(this.buildTower, this);
    this.Key6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
    this.Key6.onDown.add(this.buildWall, this);

    this.selectedUnit = 'null';
    this.unitSelection = this.game.add.sprite(50, 0, 'unitselection');
    this.unitSelection.scale.setTo(2, 2);
    this.unitSelection.visible = false;
    this.enemyMarker = this.game.add.sprite(50, 0, 'enemymarker');
    this.enemyMarker.scale.setTo(2, 2);
    this.enemyMarker.visible = false;
    this.allyMarker = this.game.add.sprite(50, 0, 'allymarker');
    this.allyMarker.scale.setTo(2, 2);
    this.allyMarker.visible = false;

    this.player1Town = player1Town;
    this.player2Town = player2Town;

    this.skipTurn = false;

    this.unitStyle = { font: "16px Arial", fill: "#ffffff" };

    this.infantryHUD = this.game.add.sprite(3, 150, 'blueknight');
    this.infantryHUD.scale.setTo(1.7,1.7);
    this.infantryText=this.game.add.text(30,155,"(5)", this.unitStyle);

    this.cavalryHUD = this.game.add.sprite(3, 250, 'bluerider');
    this.cavalryHUD.scale.setTo(1.7,1.7);
    this.cavalryText=this.game.add.text(30, 255, "(5)", this.unitStyle);

    this.archerHUD = this.game.add.sprite(3, 350, 'bluearcher');
    this.archerHUD.scale.setTo(1.7,1.7);
    this.archerText=this.game.add.text(30, 355, "(5)", this.unitStyle);
    
    this.workerHUD = this.game.add.sprite(3, 450, 'bluevillager');
    this.workerHUD.scale.setTo(1.7,1.7);
    this.workerText=this.game.add.text(30, 455, "(7)", this.unitStyle);

    //this.towerHUD = this.game.add.text(900 - 40, 250, "TOWER (20)", this.unitStyle);
    this.towerHUD = this.game.add.sprite(900 - 55, 250, 'bluetower');
    this.towerHUD.scale.setTo(1.7,1.7);
    this.towerText=this.game.add.text(900 - 30, 255, "(20)", this.unitStyle);

    //this.wallText = this.game.add.text(900 - 40, 350, "WALL (15)", this.unitStyle);
    this.wallHUD = this.game.add.sprite(900 - 50, 350, 'bluewall');
    this.wallHUD.scale.setTo(1.7,1.7);
    this.wallText=this.game.add.text(900 - 27, 355, "(15)", this.unitStyle);


    this.towerText.visible = false;
    this.towerHUD.visible=false;
    this.wallText.visible = false;
    this.wallHUD.visible=false;
    this.keyStyle = { font: "30px Arial", fill: "#ffffff" };
    this.infantryKey = this.game.add.text(16, 180, "1", this.keyStyle);
    this.cavalryKey = this.game.add.text(16, 280, "2", this.keyStyle);
    this.archerKey = this.game.add.text(14, 380, "3", this.keyStyle);
    this.workerKey = this.game.add.text(14, 480, "4", this.keyStyle);
    this.towerKey = this.game.add.text(900 - 30, 280, "5", this.keyStyle);
    this.wallKey = this.game.add.text(900 - 30, 380, "6", this.keyStyle);
    this.towerKey.visible = false;
    this.wallKey.visible = false;

    this.attackSound = this.game.add.audio('attack');
    this.moveSound = this.game.add.audio('move');
    this.selectSound = this.game.add.audio('select');
    this.cancelSound = this.game.add.audio('cancel');
    this.errorSound = this.game.add.audio('error');
  }

  workerUnitsVisible(visible) {
    this.towerText.visible = visible;
    this.towerHUD.visible=visible;
    this.wallText.visible = visible;
    this.wallHUD.visible=visible;
    this.towerKey.visible = visible;
    this.wallKey.visible = visible;
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

    // saltar turno
    if (this.skipTurn) {
      this.skipTurn = false;
      if (this.playingPlayer == 1)
        this.playingPlayer = 2;
      else
        this.playingPlayer = 1;
      return true;
    }
    else return false;
  }

  cancelSelection() {
    delete this.selectedUnit;
    this.selectedUnit = 'null';
    this.unitSelection.visible = false;
    this.enemyMarker.visible = false;
    this.allyMarker.visible = false;
    console.log("unit deselected");
    this.cancelSound.play();
  }

  turnSkip() {
    this.skipTurn = true;
  }

  updateMarker() {
    this.enemyMarker.visible = false;
    this.allyMarker.visible = false;
    if (this.selectedUnit != 'null') {
      if (this.gameMap.squares[this.posY][this.posX] == undefined)
        this.gameMap.createEmptySquare(this.posX, this.posY);
      var hoveringSquare = this.gameMap.squares[this.posY][this.posX];
      var marker;
      if (hoveringSquare.unit == 'null' && hoveringSquare.building == 'null' && this.selectedUnit.canMove(this.posX, this.posY))
        marker = this.allyMarker;
      else if (this.selectedUnit.isCombatUnit() && this.selectedUnit.canAttack(this.posX, this.posY) && hoveringSquare.unit.player != this.selectedUnit.player)
        marker = this.enemyMarker;
      if (marker != undefined) {
        marker.visible = true;
        marker.position.x = hoveringSquare.posX * this.gameMap.squareWidth + 50;
        marker.position.y = hoveringSquare.posY * this.gameMap.squareHeight;
      }
    }
  }

  moveLeft() {
    if (this.posX > 0) {
      this.x -= this.gameMap.squareWidth;
      this.posX--;
      this.updateMarker();
      this.game.world.bringToTop(this);
    }
    else
      this.errorSound.play();
  }

  moveRight() {
    if (this.posX < this.gameMap.width - 1) {
      this.x += this.gameMap.squareWidth;
      this.posX++;
      this.updateMarker();
      this.game.world.bringToTop(this);
    }
    else
      this.errorSound.play();
  }

  moveUp() {
    if (this.posY > 0) {
      this.y -= this.gameMap.squareHeight;
      this.posY--;
      this.updateMarker();
      this.game.world.bringToTop(this);
    }
    else
      this.errorSound.play();
  }

  moveDown() {
    if (this.posY < this.gameMap.height - 1) {
      this.y += this.gameMap.squareHeight;
      this.posY++;
      this.updateMarker();
      this.game.world.bringToTop(this);
    }
    else 
      this.errorSound.play();
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
      this.unitSelection.visible = true;
      this.unitSelection.position.x = this.posX * this.gameMap.squareWidth + 50;
      this.unitSelection.position.y = this.posY * this.gameMap.squareHeight;
      console.log(this.selectedUnit.element);
      this.selectSound.play();
      if (this.selectedUnit.isWorker())
        this.workerUnitsVisible(true);
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
          this.moveSound.play();
        }
        else {
          console.log("cannot move " + this.selectedUnit.element);
          this.errorSound.play();
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
          this.attackSound.play();
          console.log("attacking enemy");
          if (destroyed) {
            this.gameMap.emptySquareFromUnit(enemyX, enemyY);
            this.players[enemyTeam - 1].destroyUnit(enemyNumber);
          }
        }
        else
          this.errorSound.play();
      }
      if (this.wallText.visible == true)
        this.workerUnitsVisible(false);
      delete this.selectedUnit;
      this.selectedUnit = 'null';
      this.unitSelection.visible = false;
    }
  }

  buildWall() {
    if (this.selectedUnit.isWorker()) {
      this.selectedUnit.build("wall", this.players, this.gameMap);
      if (this.wallText.visible == true)
        this.workerUnitsVisible(false);
      delete this.selectedUnit;
      this.selectedUnit = 'null';
      this.unitSelection.visible = false;
    }
  }

  buildTower() {
    if (this.selectedUnit.isWorker()) {
      this.selectedUnit.build("watchtower", this.players, this.gameMap);
      if (this.wallText.visible == true)
        this.workerUnitsVisible(false);
      delete this.selectedUnit;
      this.selectedUnit = 'null';
      this.unitSelection.visible = false;
    }
  }

  buildInfantry() {
    if (this.playingPlayer == 1)
      this.player1Town.createUnit("infantry", this.players, this.gameMap);
    else
      this.player2Town.createUnit("infantry", this.players, this.gameMap);
  }

  buildCavalry() {
    if (this.playingPlayer == 1)
      this.player1Town.createUnit("cavalry", this.players, this.gameMap);
    else
      this.player2Town.createUnit("cavalry", this.players, this.gameMap);
  }

  buildArcher() {
    console.log("building archer");
    if (this.playingPlayer == 1)
      this.player1Town.createUnit("archer", this.players, this.gameMap);
    else
      this.player2Town.createUnit("archer", this.players, this.gameMap);
  }

  buildWorker() {
    if (this.playingPlayer == 1)
      this.player1Town.createUnit("worker", this.players, this.gameMap);
    else
      this.player2Town.createUnit("worker", this.players, this.gameMap);
  }
}

module.exports = Cursor;