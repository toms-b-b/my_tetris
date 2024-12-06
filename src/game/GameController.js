import Board from './Board.js';
import Tetromino from './Tetromino.js';
import { SCORING, LEVEL_SPEEDS, LOCK_DELAY } from '../config/constants.js';

export default class GameController {
  constructor(renderer) {
    this.board = new Board();
    this.renderer = renderer;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.gameOver = false;
    this.paused = false;
    this.holdPiece = null;
    this.canHold = true;
    this.bag = [];
    this.currentPiece = null;
    this.ghostPiece = null;
    this.lastMoveTime = 0;
    this.lockDelayTimer = null;
    
    this.initializeGame();
    this.setupInputHandlers();
  }

  initializeGame() {
    this.fillBag();
    this.currentPiece = this.getNextPiece();
    this.updateGhostPiece();
    this.startGameLoop();
  }

  fillBag() {
    if (this.bag.length <= 7) {
      const pieces = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      const newBag = [...pieces].sort(() => Math.random() - 0.5);
      this.bag = [...this.bag, ...newBag];
    }
  }

  getNextPiece() {
    this.fillBag();
    return new Tetromino(this.bag.shift());
  }

  updateGhostPiece() {
    if (!this.currentPiece) return;
    this.ghostPiece = { ...this.currentPiece };
    this.ghostPiece.y = this.currentPiece.getGhostPosition(this.board.grid);
  }

  setupInputHandlers() {
    document.addEventListener('keydown', (event) => {
      if (this.gameOver || this.paused) return;

      switch (event.code) {
        case 'ArrowLeft':
          this.movePiece(-1, 0);
          break;
        case 'ArrowRight':
          this.movePiece(1, 0);
          break;
        case 'ArrowDown':
          this.movePiece(0, 1);
          this.score += SCORING.SOFT_DROP;
          break;
        case 'ArrowUp':
        case 'KeyX':
          this.rotatePiece(1);
          break;
        case 'KeyZ':
        case 'ControlLeft':
          this.rotatePiece(-1);
          break;
        case 'Space':
          this.hardDrop();
          break;
        case 'ShiftLeft':
        case 'KeyC':
          this.holdPiece();
          break;
        case 'Escape':
        case 'F1':
          this.togglePause();
          break;
      }
    });
  }

  movePiece(dx, dy) {
    if (!this.currentPiece.checkCollision(this.board.grid, dx, dy)) {
      this.currentPiece.x += dx;
      this.currentPiece.y += dy;
      this.updateGhostPiece();
      return true;
    }
    return false;
  }

  rotatePiece(direction) {
    const originalShape = [...this.currentPiece.shape];
    this.currentPiece.rotate(direction);
    
    if (this.currentPiece.checkCollision(this.board.grid)) {
      this.currentPiece.shape = originalShape;
    } else {
      this.updateGhostPiece();
    }
  }

  hardDrop() {
    while (this.movePiece(0, 1)) {
      this.score += SCORING.HARD_DROP;
    }
    this.lockPiece();
  }

  holdPiece() {
    if (!this.canHold) return;
    
    const temp = this.currentPiece.type;
    if (this.holdPiece === null) {
      this.holdPiece = temp;
      this.currentPiece = this.getNextPiece();
    } else {
      this.currentPiece = new Tetromino(this.holdPiece);
      this.holdPiece = temp;
    }
    
    this.canHold = false;
    this.updateGhostPiece();
  }

  lockPiece() {
    this.board.addPiece(this.currentPiece);
    const linesCleared = this.board.clearLines();
    this.updateScore(linesCleared);
    
    this.currentPiece = this.getNextPiece();
    this.canHold = true;
    
    if (this.currentPiece.checkCollision(this.board.grid)) {
      this.gameOver = true;
    }
    
    this.updateGhostPiece();
  }

  updateScore(linesCleared) {
    switch (linesCleared) {
      case 1:
        this.score += SCORING.SINGLE * this.level;
        break;
      case 2:
        this.score += SCORING.DOUBLE * this.level;
        break;
      case 3:
        this.score += SCORING.TRIPLE * this.level;
        break;
      case 4:
        this.score += SCORING.TETRIS * this.level;
        break;
    }
    
    this.lines += linesCleared;
    this.level = Math.floor(this.lines / 10) + 1;
  }

  togglePause() {
    this.paused = !this.paused;
  }

  update(timestamp) {
    if (this.gameOver || this.paused) return;

    const deltaTime = timestamp - this.lastMoveTime;
    
    if (deltaTime > LEVEL_SPEEDS[this.level]) {
      if (!this.movePiece(0, 1)) {
        if (!this.lockDelayTimer) {
          this.lockDelayTimer = setTimeout(() => {
            this.lockPiece();
            this.lockDelayTimer = null;
          }, LOCK_DELAY);
        }
      } else {
        if (this.lockDelayTimer) {
          clearTimeout(this.lockDelayTimer);
          this.lockDelayTimer = null;
        }
      }
      this.lastMoveTime = timestamp;
    }
  }

  startGameLoop() {
    const gameLoop = (timestamp) => {
      this.update(timestamp);
      this.renderer.render(this);
      requestAnimationFrame(gameLoop);
    };
    requestAnimationFrame(gameLoop);
  }
}