'use strict';

class Unit extends Phaser.Sprite {
  constructor(game,x, y, hp, player, sprite, unitNumber)
  {
    super(game, x, y, sprite);
    game.add.existing(this);
    this.scale.setTo(2,2);
    this.hp = hp;
    this.player = player;
    this.unitNumber = unitNumber;
  }

  takeDamage(damage)
  {
    this.hp -= damage;
    if(this.hp <= 0)
      destroy();
  }

  destroy()
  {
    players[player].destroy(this.unitNumber);
  }
}

class Town extends Unit {
  constructor(game,x, y, player, unitNumber)
  {
    if(player==1){
        super(game,x, y, 1000, player,'bluetown', unitNumber);
    }       
    else{
        super(game,x, y, 1000, player,'redtown', unitNumber);
    }
    
  }

  createUnit(type)
  {
    players[player].addUnit(type, this.x, this.y);
  }
}

class Wall extends Unit {
  constructor(game,x, y, player, unitNumber)
  {
    if(player==1){
        super(game,x, y, 500, player,'bluewall', unitNumber);
    }       
    else{
        super(game,x, y, 500, player,'redwall', unitNumber);
    }
  }
}

class Watchtower extends Unit {
  constructor(game,x, y, player, unitNumber)
  {
    if(player==1){
        super(game,x, y, 200, player,'bluetower', unitNumber);
    }       
    else{
        super(game,x, y, 200, player,'redtower', unitNumber);
    }
    
    this.range = 3;
    this.damage = 20;
  }

  attack(enemy)
  {
    enemy.takeDamage(this.damage);
  }
}

class HumanUnit extends Unit {
  constructor(game,x, y, hp, moves, sprite, player, unitNumber)
  {
    super(game,x, y, hp, player, sprite, unitNumber);
    this.moves = moves;
  }

  move(posX, posY) // posiciones absolutas a las que se va a mover la unidad
  {
    if((this.x == posX && Math.abs(this.y - posY)<= this.moves) || (this.y == posY && Math.abs(this.x - posX)<= this.moves))
      {
        this.x = posX;
        this.y = posY;
      }
  }
}

class Worker extends HumanUnit {
  constructor(game,x, y, player, unitNumber)
  {
      if(player=1){
        super(game,x, y, 20, 1, 'bluevillager', player, unitNumber);
      }
      else{
        super(game,x, y, 20, 1, 'redvillager', player, unitNumber);
      }    
  }

  work()
  {
    players[player].money += squares[x][y].goldPerTurn;
  }

  build(type)
  {
    players[player].addUnit(type, this.x, this.y);
  }
}

class CombatUnit extends HumanUnit {
  constructor(game,x, y, hp, moves, sprite, player, range, damage, element, unitNumber)
  {
    super(game,x, y, hp, moves, sprite, player, unitNumber);
    this.range = range;
    this.damage = damage;
    this.element = element;
  }

  attack(enemy)
  {
    var bonusDamage;

    if(this.element == enemy.element)
      bonusDamage = 1;
    else if((this.element == "archer" && enemy.element == "cavalry") || (this.element == "infantry" && enemy.element == "archer") ||
    (this.element == "cavalry" && enemy.element == "infantry"))
      bonusDamage = 1.25;
    else if ((this.element == "archer" && enemy.element == "infantry") || (this.element == "infantry" && enemy.element == "cavalry") ||
    (this.element == "cavalry" && enemy.element == "archer"))
      bonusDamage = 0.75;
    else
      bonusDamage = 1;

    enemy.takeDamage(this.damage * bonusDamage);
  }
}

class Archer extends CombatUnit {
  constructor(game,x, y, player, unitNumber)
  {
      if(player==1){
        super(game,x, y, 30, 1, 'bluearcher', player, 2, 10, "archer", unitNumber);
      }
      else{
        super(game,x, y, 30, 1, 'redarcher', player, 2, 10, "archer", unitNumber);
      }
    
  }
}
//MIRAAAAAR

class Infantry extends CombatUnit {
  constructor(game,x, y, player, unitNumber)
  {
    if(player==1){
        super(game,x, y, 50, 1, 'blueknight', player, 1, 10, "infantry", unitNumber);
      }
      else{
        super(game,x, y, 50, 1, 'redknight', player, 1, 10, "infantry", unitNumber);
      }
  }
}

class Cavalry extends CombatUnit {
  constructor(game,x, y, player, unitNumber)
  {
    if(player==1)
    {
      super(game,x, y, 40, 2, 'bluerider', player, 1, 10, "cavalry", unitNumber);
    }
    else{
      super(game,x, y, 40, 2, 'redrider', player, 1, 10, "cavalry", unitNumber);
    }
  }
}

module.exports = {
  Unit:Unit, Town:Town, Wall:Wall, Watchtower:Watchtower, HumanUnit:HumanUnit, Worker:Worker, CombatUnit:CombatUnit, Archer:Archer, Infantry:Infantry, Cavalry:Cavalry
};