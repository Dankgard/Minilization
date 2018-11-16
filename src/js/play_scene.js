'use strict';

  var PlayScene = {
  create: function () {
    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');      
    logo.anchor.setTo(0.5, 0.5);
    for(var y=0;y<600;y++){
      for(var x=0;x<800;x++){
        this.game.add.sprite(x*10,y*10,'tile'); 
      }
    }       
  }
};

module.exports = PlayScene;
