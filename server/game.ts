type Player = {
    id: string;
    paddleY: number;
  };
  
  type GameState = {
    players: Player[];
    ball: {
      x: number;
      y: number;
      vx: number;
      vy: number;
    };
    score: {
      left: number;
      right: number;
    };
  };
  
  export class GameRoom {
    private players: Player[] = [];
    private gameState: GameState;
  
    constructor(public roomId: string) {
      this.gameState = {
        players: [],
        ball: {
          x: 400,
          y: 300,
          vx: 4,
          vy: 3,
        },
        score: {
          left: 0,
          right: 0,
        }
      };
    }
  
    addPlayer(socketId: string) {
      if (this.players.length >= 2) return;
      this.players.push({ id: socketId, paddleY: 250 });
      this.gameState.players = this.players;
    }
  
    removePlayer(socketId: string) {
      this.players = this.players.filter(p => p.id !== socketId);
      this.gameState.players = this.players;
    }
  
    updatePaddle(socketId: string, newY: number) {
      const player = this.players.find(p => p.id === socketId);
      if (player) {
        player.paddleY = newY;
      }
    }
  
    updateGameLogic() {
      const ball = this.gameState.ball;
      ball.x += ball.vx;
      ball.y += ball.vy;
  
      // bounce off top/bottom
      if (ball.y <= 0 || ball.y >= 600) {
        ball.vy *= -1;
      }
  
      // check paddle collisions, scoring, etc. (to be expanded later)
  
      this.gameState.ball = ball;
    }
  
    getState() {
        console.log("📤 Sending game state:", this.gameState);
        return this.gameState;
      }
      
  }
  