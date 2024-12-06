import { TETROMINOS, COLORS } from '../config/constants.js';

export default class Tetromino {
  constructor(type) {
    this.type = type;
    this.shape = TETROMINOS[type];
    this.color = COLORS[type];
    this.x = type === 'I' || type === 'O' 
      ? Math.floor((10 - this.shape[0].length) / 2)
      : Math.floor((10 - this.shape[0].length) / 2) - 1;
    this.y = type === 'I' ? 21 : 22;
    this.rotation = 0;
  }

  rotate(direction) {
    const newShape = Array(this.shape.length).fill()
      .map(() => Array(this.shape[0].length).fill(0));

    if (direction === 1) { // clockwise
      for (let y = 0; y < this.shape.length; y++) {
        for (let x = 0; x < this.shape[0].length; x++) {
          newShape[x][this.shape.length - 1 - y] = this.shape[y][x];
        }
      }
    } else { // counter-clockwise
      for (let y = 0; y < this.shape.length; y++) {
        for (let x = 0; x < this.shape[0].length; x++) {
          newShape[this.shape[0].length - 1 - x][y] = this.shape[y][x];
        }
      }
    }

    this.shape = newShape;
  }

  getGhostPosition(board) {
    let ghostY = this.y;
    while (!this.checkCollision(board, 0, ghostY + 1)) {
      ghostY++;
    }
    return ghostY;
  }

  checkCollision(board, offsetX = 0, offsetY = 0) {
    const newX = this.x + offsetX;
    const newY = this.y + offsetY;

    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        if (this.shape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          
          // Check boundaries and board collision
          if (
            boardX < 0 || // Left wall
            boardX >= board[0].length || // Right wall
            boardY >= board.length || // Bottom boundary
            (boardY >= 0 && board[boardY][boardX]) // Collision with placed pieces
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
}