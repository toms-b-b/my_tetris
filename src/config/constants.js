export const PLAYFIELD_WIDTH = 10;
export const PLAYFIELD_HEIGHT = 40;
export const VISIBLE_HEIGHT = 20;
export const VISIBLE_NEXT_PIECES = 6;

export const MIN_CELL_SIZE = 20; // Minimum cell size to maintain playability

export const GHOST_OPACITY = 0.3;

export const COLORS = {
  I: '#00f0f0', // Cyan
  O: '#f0f000', // Yellow
  T: '#a000f0', // Purple
  S: '#00f000', // Green
  Z: '#f00000', // Red
  J: '#0000f0', // Blue
  L: '#f0a000', // Orange
  ghost: '#ffffff',
  background: '#000000',
  grid: '#333333',
};

export const TETROMINOS = {
  I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
};

export const LEVEL_SPEEDS = {
  1: 1000,
  2: 900,
  3: 800,
  4: 700,
  5: 600,
  6: 500,
  7: 400,
  8: 300,
  9: 200,
  10: 100,
  // ... continue up to level 15
};

export const SCORING = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
  T_SPIN: 400,
};

export const LOCK_DELAY = 500; // 0.5 seconds