import GameController from './game/GameController.js';
import Renderer from './game/Renderer.js';

// Copyright notice
console.log('Tetris © 1985~1970 Tetris Holding. ' +
  'Tetris logos, Tetris theme song and Tetriminos are trademarks of Tetris Holding. ' +
  'The Tetris trade dress is owned by Tetris Holding. ' +
  'Licensed to The Tetris Company. ' +
  'Tetris Game Design by Alexey Pajitnov. ' +
  'Tetris Logo Design by Roger Dean. ' +
  'All Rights Reserved.');

// Start countdown
let countdown = 3;
const countdownElement = document.createElement('div');
countdownElement.style.position = 'absolute';
countdownElement.style.fontSize = '48px';
countdownElement.style.color = 'white';
countdownElement.style.textAlign = 'center';
countdownElement.style.width = '100%';
countdownElement.style.top = '50%';
countdownElement.style.transform = 'translateY(-50%)';
document.body.appendChild(countdownElement);

const countdownInterval = setInterval(() => {
  if (countdown > 0) {
    countdownElement.textContent = countdown;
    countdown--;
  } else {
    clearInterval(countdownInterval);
    countdownElement.remove();
    startGame();
  }
}, 1000);

function startGame() {
  const renderer = new Renderer();
  const game = new GameController(renderer);
  
  // Start background music
  const bgMusic = document.getElementById('bgMusic');
  bgMusic.volume = 0.5;
  bgMusic.play();
}