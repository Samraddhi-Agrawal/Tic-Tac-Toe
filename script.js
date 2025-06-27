const HEART = '♥';      // Human
const DIAMOND = '♦';    // Computer
let board, currentPlayer, gameActive;

const statusDiv = document.getElementById('status');
const gameDiv = document.getElementById('game');
const resetBtn = document.getElementById('reset');

function initGame() {
  board = Array(9).fill('');
  currentPlayer = HEART; // Human always starts
  gameActive = true;
  renderBoard();
  updateStatus();
}

function renderBoard() {
  gameDiv.innerHTML = '';
  board.forEach((cell, idx) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    if (cell === HEART) cellDiv.classList.add('heart');
    if (cell === DIAMOND) cellDiv.classList.add('diamond');
    cellDiv.textContent = cell;
    // Only allow clicks if it's human's turn, cell is empty, and game is active
    if (currentPlayer === HEART && !cell && gameActive) {
      cellDiv.addEventListener('click', () => handleHumanMove(idx));
    }
    gameDiv.appendChild(cellDiv);
  });
}

function handleHumanMove(idx) {
  if (!gameActive || board[idx]) return;
  board[idx] = HEART;

  if (checkWinner(HEART)) {
    renderBoard();
    statusDiv.textContent = "You (Heart) win! 🎉";
    gameActive = false;
    return;
  } else if (board.every(cell => cell)) {
    renderBoard();
    statusDiv.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = DIAMOND;
  renderBoard();
  updateStatus();

  setTimeout(computerMove, 500); // Delay for realism
}

function computerMove() {
  if (!gameActive) return;

  // Try to win or block
  let move = findBestMove();
  if (move === null) {
    // Pick random empty cell
    const emptyCells = board
      .map((cell, idx) => cell === '' ? idx : null)
      .filter(idx => idx !== null);
    move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  board[move] = DIAMOND;

  if (checkWinner(DIAMOND)) {
    renderBoard();
    statusDiv.textContent = "Computer (Diamond) wins! 💎";
    gameActive = false;
    return;
  } else if (board.every(cell => cell)) {
    renderBoard();
    statusDiv.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = HEART;
  renderBoard();
  updateStatus();
}

// AI: Try to win, then block, else null
function findBestMove() {
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = DIAMOND;
      if (checkWinner(DIAMOND)) {
        board[i] = '';
        return i;
      }
      board[i] = '';
    }
  }
  // Try to block human
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = HEART;
      if (checkWinner(HEART)) {
        board[i] = '';
        return i;
      }
      board[i] = '';
    }
  }
  return null;
}

function updateStatus() {
  if (!gameActive) return;
  statusDiv.textContent = currentPlayer === HEART
    ? "Your turn (♥)"
    : "Computer's turn (♦)";
}

function checkWinner(token) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
  ];
  return winPatterns.some(pattern =>
    pattern.every(idx => board[idx] === token)
  );
}

resetBtn.addEventListener('click', initGame);

// Start the game
initGame();
