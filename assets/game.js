const board = document.getElementById('board');
const timeLabel = document.getElementById('timeLabel');
const scoreLabel = document.getElementById('scoreLabel');
const bestLabel = document.getElementById('bestLabel');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

let timeLeft = 30;
let score = 0;
let best = Number(localStorage.getItem('focus-sprint-best') || '0');
let countdownId = null;
let moveId = null;
let activeTarget = null;

bestLabel.textContent = best;

function updateLabels() {
  timeLabel.textContent = `${timeLeft} 秒`;
  scoreLabel.textContent = score;
  bestLabel.textContent = best;
}

function createTarget() {
  if (!board) return;
  if (activeTarget) {
    activeTarget.removeEventListener('click', handleHit);
    activeTarget.remove();
  }

  const target = document.createElement('button');
  target.className = 'target';
  target.type = 'button';
  target.textContent = 'GO!';

  const boardRect = board.getBoundingClientRect();
  const size = 72;
  const maxX = boardRect.width - size;
  const maxY = boardRect.height - size;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  target.addEventListener('click', handleHit);

  board.appendChild(target);
  activeTarget = target;
}

function handleHit(event) {
  event.preventDefault();
  score += 1;
  updateLabels();
  createTarget();
}

function startGame() {
  if (countdownId) return; // already running
  score = 0;
  timeLeft = 30;
  updateLabels();
  createTarget();

  countdownId = window.setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 0) {
      timeLeft = 0;
      endGame();
      return;
    }
    updateLabels();
  }, 1000);

  moveId = window.setInterval(() => {
    createTarget();
  }, 900);
}

function endGame() {
  clearInterval(countdownId);
  clearInterval(moveId);
  countdownId = null;
  moveId = null;

  if (activeTarget) {
    activeTarget.removeEventListener('click', handleHit);
    activeTarget.remove();
    activeTarget = null;
  }

  if (score > best) {
    best = score;
    localStorage.setItem('focus-sprint-best', String(best));
  }

  updateLabels();
}

function resetGame() {
  endGame();
  score = 0;
  timeLeft = 30;
  updateLabels();
}

startButton?.addEventListener('click', startGame);
resetButton?.addEventListener('click', resetGame);

updateLabels();
