'use strict';

class GameManager {
    constructor(turn, playingPlayer, playerNumber)
    {
      this.turn = turn;
      this.playingPlayer = playingPlayer;
      this.playerNumber = playerNumber;
      this.players = new Array(playerNumber);
  
      for(var i=0;i<playerNumber;i++)
      {
        players[i] = new Player(i,0);
      }
    }
  }
