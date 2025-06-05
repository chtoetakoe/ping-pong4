export type Player = {
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
    public players: Player[] = [];
    private gameState: GameState;
  
    constructor(public roomId: string) {
      this.gameState = {
        players: [],
        ball: {
          x: 400,
          y: 300,
          vx: 4,
          vy: 3
        },
        score: {
          left: 0,
          right: 0
        }
      };
    }
  
    addPlayer(socketId: string) {
      if (this.players.length < 2) {
        this.players.push({ id: socketId, paddleY: 250 });
        this.gameState.players = this.players;
      }
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
      if (this.players.length < 2) return;
  
      const ball = this.gameState.ball;
      ball.x += ball.vx;
      ball.y += ball.vy;
  
      // Bounce off top and bottom
      if (ball.y <= 0 || ball.y >= 600) {
        ball.vy *= -1;
      }
  
      // Clamp to canvas
      ball.x = Math.max(0, Math.min(ball.x, 800));
      ball.y = Math.max(0, Math.min(ball.y, 600));
    }
  
    getState() {
      return this.gameState;
    }
  }
  