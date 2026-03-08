const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

let board, currentPlayer, gameOver;
let players = {};
let scores = { 1: 0, 2: 0, draw: 0 };

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Theme
const themeToggle = $('#theme-toggle');
const savedTheme = localStorage.getItem('ttt-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ttt-theme', next);
});

// Setup
$('#start-btn').addEventListener('click', () => {
  players = {
    1: { name: $('#p1-name').value.trim() || 'Player 1', mark: 'X', color: $('#p1-color').value },
    2: { name: $('#p2-name').value.trim() || 'Player 2', mark: 'O', color: $('#p2-color').value },
  };
  scores = { 1: 0, 2: 0, draw: 0 };
  $('#setup').classList.add('hidden');
  $('#game').classList.remove('hidden');
  startRound();
});

// Game
function startRound() {
  board = Array(9).fill(null);
  currentPlayer = 1;
  gameOver = false;
  $$('.cell').forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.style.color = '';
  });
  updateStatus();
  updateScoreboard();
}

function updateStatus(msg) {
  const p = players[currentPlayer];
  $('#status').textContent = msg || `${p.name}'s turn (${p.mark})`;
  $('#status').style.color = msg ? '' : p.color;
}

function updateScoreboard() {
  $('#score-p1').textContent = `${players[1].name}: ${scores[1]}`;
  $('#score-p2').textContent = `${players[2].name}: ${scores[2]}`;
  $('#score-draw').textContent = `Draws: ${scores.draw}`;
}

function checkWin(mark) {
  return WIN_COMBOS.find(combo => combo.every(i => board[i] === mark)) || null;
}

function handleClick(e) {
  const cell = e.target;
  const idx = parseInt(cell.dataset.index);
  if (gameOver || board[idx] !== null) return;

  const p = players[currentPlayer];
  board[idx] = p.mark;
  cell.textContent = p.mark;
  cell.style.color = p.color;
  cell.classList.add('taken');

  const winCombo = checkWin(p.mark);
  if (winCombo) {
    gameOver = true;
    scores[currentPlayer]++;
    winCombo.forEach(i => $$('.cell')[i].classList.add('win'));
    updateStatus(`${p.name} wins!`);
    updateScoreboard();
    return;
  }

  if (board.every(c => c !== null)) {
    gameOver = true;
    scores.draw++;
    updateStatus("It's a draw!");
    updateScoreboard();
    return;
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateStatus();
}

$$('.cell').forEach(cell => cell.addEventListener('click', handleClick));

$('#restart-btn').addEventListener('click', startRound);

$('#new-game-btn').addEventListener('click', () => {
  $('#game').classList.add('hidden');
  $('#setup').classList.remove('hidden');
});
