'use strict';

var map;
var capa;
var PlayScene = {
  create: function () {

    /*var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');      
    logo.anchor.setTo(0.5, 0.5);*/

    /*var width = 16;
    var height = 12;
    var frameLength = 800/16;
    var grasstype = 0;
    for(var y=0;y<height;y++){
      for(var x=0;x<width;x++){
        if(grasstype % 2 == 0)
          var tile = this.game.add.sprite(x*frameLength, y*frameLength,'grass1');
        else
          var tile = this.game.add.sprite(x*frameLength, y*frameLength,'grass2');
        tile.scale.setTo(frameLength, frameLength);
        grasstype++;
      }
    }*/

    //map = game.add.tilemap('tileset');
    //map.addTilesetImage('spritesheet');
    //capa = map.createLayer('grass');
    //capa.resizeWorld();

    var tile = this.game.add.sprite(0,0,'tileset');    
    var arquero=this.game.add.sprite(0,0,'bluearcher');
    arquero.scale.setTo(2,2);
  }
};

module.exports = PlayScene;
