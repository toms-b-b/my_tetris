import { 
  MIN_CELL_SIZE,
  COLORS, 
  PLAYFIELD_HEIGHT,
  PLAYFIELD_WIDTH,
  VISIBLE_HEIGHT,
  VISIBLE_NEXT_PIECES,
  GHOST_OPACITY 
} from '../config/constants.js';
import Tetromino from './Tetromino.js';

export default class Renderer {
  constructor() {
    this.gameCanvas = document.getElementById('gameCanvas');
    this.holdCanvas = document.getElementById('holdCanvas');
    this.nextCanvas = document.getElementById('nextCanvas');
    
    this.gameCtx = this.gameCanvas.getContext('2d');
    this.holdCtx = this.holdCanvas.getContext('2d');
    this.nextCtx = this.nextCanvas.getContext('2d');
    
    this.cellSize = this.calculateCellSize();
    this.initializeCanvases();
    
  }

  calculateCellSize() {
    const maxWidth = 0.6 * (window.innerWidth) - 40; // 40px for padding
    const maxHeight = window.innerHeight - 40; // 40px for padding
    
    const cellByWidth = Math.floor(maxWidth / PLAYFIELD_WIDTH);
    const cellByHeight = Math.floor(maxHeight / VISIBLE_HEIGHT);
    
    return Math.max(MIN_CELL_SIZE, Math.min(cellByWidth, cellByHeight));
  }

  initializeCanvases() {
    // Get container dimensions dynamically
    const holdContainer = document.querySelector('.hold-piece');
    const nextContainer = document.querySelector('.next-pieces');
  
    // Main game canvas
    this.gameCanvas.width = this.cellSize * PLAYFIELD_WIDTH;
    this.gameCanvas.height = this.cellSize * VISIBLE_HEIGHT;
  
    // Hold piece canvas (4x4 grid)
    this.holdCanvas.width = this.cellSize * 4;
    this.holdCanvas.height = this.cellSize * 2;
  
    // Next pieces canvas (adjust height dynamically based on number of pieces to display)
    this.nextCanvas.width = this.cellSize * 4; // 4x4 grid width
    this.nextCanvas.height = this.cellSize * VISIBLE_NEXT_PIECES * 2; // 2 rows per piece
  
    // Apply responsive CSS styling
    this.holdCanvas.style.width = `${holdContainer.offsetWidth}px`;
    this.holdCanvas.style.height = `${holdContainer.offsetHeight}px`;
  
    this.nextCanvas.style.width = `${nextContainer.offsetWidth}px`;
    this.nextCanvas.style.height = `${nextContainer.offsetHeight}px`;
  }
  

  render(gameState) {
    this.clearCanvas(this.gameCtx);
    this.clearCanvas(this.holdCtx);
    this.clearCanvas(this.nextCtx);
    
    this.drawBoard(gameState.board);
    this.drawGhostPiece(gameState.ghostPiece);
    this.drawCurrentPiece(gameState.currentPiece);
    this.drawHoldPiece(gameState.holdPiece);
    this.drawNextPieces(gameState.bag.slice(0, 6));
    this.updateScore(gameState);
    
    if (gameState.gameOver) {
      this.drawGameOver();
    } else if (gameState.paused) {
      this.drawPaused();
    }
  }

  clearCanvas(ctx) {
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  drawBoard(board) {
    for (let y = PLAYFIELD_HEIGHT - VISIBLE_HEIGHT; y < PLAYFIELD_HEIGHT; y++) {
      for (let x = 0; x < PLAYFIELD_WIDTH; x++) {
        const cell = board.grid[y][x];
        if (cell) {
          this.drawCell(
            this.gameCtx,
            x * this.cellSize,
            (y - (PLAYFIELD_HEIGHT - VISIBLE_HEIGHT)) * this.cellSize,
            COLORS[cell]
          );
        }
      }
    }
    this.drawGrid();
  }

  drawGrid() {
    this.gameCtx.strokeStyle = COLORS.grid;
    this.gameCtx.lineWidth = 1;

    for (let x = 0; x <= PLAYFIELD_WIDTH; x++) {
      this.gameCtx.beginPath();
      this.gameCtx.moveTo(x * this.cellSize, 0);
      this.gameCtx.lineTo(x * this.cellSize, this.gameCanvas.height);
      this.gameCtx.stroke();
    }

    for (let y = 0; y <= VISIBLE_HEIGHT; y++) {
      this.gameCtx.beginPath();
      this.gameCtx.moveTo(0, y * this.cellSize);
      this.gameCtx.lineTo(this.gameCanvas.width, y * this.cellSize);
      this.gameCtx.stroke();
    }
  }

  drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, this.cellSize, this.cellSize);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.strokeRect(x, y, this.cellSize, this.cellSize);
  }

  drawCurrentPiece(piece) {
    if (!piece) return;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const drawX = (piece.x + x) * this.cellSize;
          const drawY = (piece.y - (PLAYFIELD_HEIGHT - VISIBLE_HEIGHT) + y) * this.cellSize;
          this.drawCell(this.gameCtx, drawX, drawY, piece.color);
        }
      }
    }
  }

  drawGhostPiece(ghost) {
    if (!ghost) return;
    
    const ghostColor = `${COLORS[ghost.type]}${Math.floor(GHOST_OPACITY * 255).toString(16).padStart(2, '0')}`;
    
    for (let y = 0; y < ghost.shape.length; y++) {
      for (let x = 0; x < ghost.shape[y].length; x++) {
        if (ghost.shape[y][x]) {
          const drawX = (ghost.x + x) * this.cellSize;
          const drawY = (ghost.y - (PLAYFIELD_HEIGHT - VISIBLE_HEIGHT) + y) * this.cellSize;
          this.drawCell(this.gameCtx, drawX, drawY, ghostColor);
        }
      }
    }
  }

  drawHoldPiece(pieceType) {
    if (!pieceType) return;
    const piece = new Tetromino(pieceType);
    this.drawPiecePreview(this.holdCtx, piece);
  }

  drawNextPieces(pieces) {
    const scaleFactor = 0.6; // Uniform scaling factor
    const gridSize = 4; // Each piece fits within a 4x4 grid
    const scaledCellSize = this.cellSize * scaleFactor; // Scaled cell size for each tetromino
  
    const pieceHeight = 2 * scaledCellSize; // Approximate vertical space per piece
    const totalHeight = this.nextCanvas.height; // Total height of the Next Pieces canvas
    const totalSpacing = totalHeight - VISIBLE_NEXT_PIECES * pieceHeight; // Vertical spacing available
    const spacing = totalSpacing / (VISIBLE_NEXT_PIECES + 1); // Spacing between pieces
  
    // Draw each piece
    pieces.forEach((pieceType, index) => {
      const piece = new Tetromino(pieceType);
  
      const offsetX = (this.nextCanvas.width - gridSize * scaledCellSize) / 2; // Center horizontally
      const offsetY = spacing * (index + 1) + pieceHeight * index; // Distribute vertically
  
      this.drawPiecePreview(this.nextCtx, piece, offsetX, offsetY, scaledCellSize);
    });
  }
  
  
  

  drawPiecePreview(ctx, piece, offsetX, offsetY, scaledCellSize) {
    // Center the tetromino within the 4x4 grid
    const pieceWidth = piece.shape[0].length * scaledCellSize;
    const pieceHeight = piece.shape.length * scaledCellSize;
  
    const centerX = (4 * scaledCellSize - pieceWidth) / 2; // Horizontal centering
    const centerY = (2 * scaledCellSize - pieceHeight) / 2; // Vertical centering
  
    // Draw each block of the tetromino
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const drawX = offsetX + centerX + x * scaledCellSize;
          const drawY = offsetY + centerY + y * scaledCellSize;
          ctx.fillStyle = piece.color;
          ctx.fillRect(drawX, drawY, scaledCellSize, scaledCellSize);
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.strokeRect(drawX, drawY, scaledCellSize, scaledCellSize);
        }
      }
    }
  }
  
  
  
  

  updateScore(gameState) {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('lines').textContent = gameState.lines;
  }

  drawGameOver() {
    this.drawOverlay('GAME OVER');
  }

  drawPaused() {
    this.drawOverlay('PAUSED');
  }

  drawOverlay(text) {
    this.gameCtx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.gameCtx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    
    this.gameCtx.fillStyle = '#fff';
    this.gameCtx.font = `${this.cellSize}px Arial`;
    this.gameCtx.textAlign = 'center';
    this.gameCtx.textBaseline = 'middle';
    this.gameCtx.fillText(
      text,
      this.gameCanvas.width / 2,
      this.gameCanvas.height / 2
    );
  }
}