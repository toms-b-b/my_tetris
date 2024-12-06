import { PLAYFIELD_WIDTH, PLAYFIELD_HEIGHT } from '../config/constants.js';

export default class Board {
  constructor() {
    this.grid = Array(PLAYFIELD_HEIGHT).fill()
      .map(() => Array(PLAYFIELD_WIDTH).fill(0));
    this.reset();
  }

  reset() {
    for (let y = 0; y < PLAYFIELD_HEIGHT; y++) {
      for (let x = 0; x < PLAYFIELD_WIDTH; x++) {
        this.grid[y][x] = 0;
      }
    }
  }

  isLineFull(y) {
    return this.grid[y].every(cell => cell !== 0);
  }

  clearLines() {
    let linesCleared = 0;
    
    for (let y = PLAYFIELD_HEIGHT - 1; y >= 0; y--) {
      if (this.isLineFull(y)) {
        // Remove the line and add empty line at top
        this.grid.splice(y, 1);
        this.grid.unshift(Array(PLAYFIELD_WIDTH).fill(0));
        linesCleared++;
        y++; // Check the same row again
      }
    }
    
    return linesCleared;
  }

  addPiece(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            this.grid[boardY][boardX] = piece.type;
          }
        }
      }
    }
  }
}