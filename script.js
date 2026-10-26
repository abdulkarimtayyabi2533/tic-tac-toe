const cells = document.querySelectorAll(".cell");
const statusEl = document.getElementById("status");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDrawEl = document.getElementById("scoreDraw");
const mode2pBtn = document.getElementById("mode2p");
const modeCpuBtn = document.getElementById("modeCpu");

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;
let vsComputer = false;
let scores = { X: 0, O: 0, Draw: 0 };

function setStatus(text) {
  statusEl.textContent = text;
}

function updateScores() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.Draw;
}

function checkWinner() {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a, b, c] };
    }
  }
  return null;
}

function endRound(winner, line) {
  gameOver = true;
  cells.forEach((cell) => (cell.disabled = true));
  if (winner) {
    line.forEach((i) => cells[i].classList.add("win"));
    scores[winner]++;
    setStatus(`Player ${winner} wins! 🎉`);
  } else {
    scores.Draw++;
    setStatus("It's a draw! 🤝");
  }
  updateScores();
}

function placeMark(index, player) {
  board[index] = player;
  const cell = cells[index];
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
  cell.disabled = true;
}

function computerMove() {
  // Win if possible, block if needed, otherwise take center, corner, or any empty cell.
  const empty = board.map((v, i) => (v === "" ? i : null)).filter((i) => i !== null);

  for (const i of empty) {
    board[i] = "O";
    if (checkWinner()?.player === "O") { board[i] = ""; return i; }
    board[i] = "";
  }
  for (const i of empty) {
    board[i] = "X";
    if (checkWinner()?.player === "X") { board[i] = ""; return i; }
    board[i] = "";
  }
  if (board[4] === "") return 4;
  const corners = empty.filter((i) => [0, 2, 6, 8].includes(i));
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  return empty[Math.floor(Math.random() * empty.length)];
}

function handleMove(index) {
  if (gameOver || board[index] !== "") return;

  placeMark(index, currentPlayer);
  const result = checkWinner();
  if (result) return endRound(result.player, result.line);
  if (!board.includes("")) return endRound(null);

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  setStatus(vsComputer ? "Computer's turn..." : `Player ${currentPlayer}'s turn`);

  if (vsComputer && currentPlayer === "O" && !gameOver) {
    setTimeout(() => {
      const move = computerMove();
      placeMark(move, "O");
      const cpuResult = checkWinner();
      if (cpuResult) return endRound(cpuResult.player, cpuResult.line);
      if (!board.includes("")) return endRound(null);
      currentPlayer = "X";
      setStatus("Your turn (X)");
    }, 400);
  }
}

function startRound() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.className = "cell";
    cell.disabled = false;
  });
  setStatus(vsComputer ? "Your turn (X)" : "Player X's turn");
}

function setMode(cpu) {
  vsComputer = cpu;
  mode2pBtn.classList.toggle("active", !cpu);
  modeCpuBtn.classList.toggle("active", cpu);
  startRound();
}

cells.forEach((cell) => {
  cell.addEventListener("click", () => handleMove(Number(cell.dataset.index)));
});

document.getElementById("restart").addEventListener("click", startRound);
document.getElementById("resetScores").addEventListener("click", () => {
  scores = { X: 0, O: 0, Draw: 0 };
  updateScores();
  startRound();
});
mode2pBtn.addEventListener("click", () => setMode(false));
modeCpuBtn.addEventListener("click", () => setMode(true));

startRound();
