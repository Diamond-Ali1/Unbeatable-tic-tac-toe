const cells = Array.from(document.querySelectorAll('.cell'));
const totalLoses = document.querySelector('.loses');
const displayMessage = document.querySelector('.messageContainer');
const retry = document.querySelector('.retry');
const play = document.querySelector('.play');
const coverImage = document.querySelector('.coverImage');
const page = document.querySelector('.container');
const gameBoard = document.querySelector('.gameBoard');
const message = document.querySelector('.message')
let replay = document.querySelector('.replay');
const totalTies= document.querySelector('.ties')
const player = {
  human:'X', 
  ai:'O'
}
//game status
let stats = {
  wins:0,
  loses:0,
  ties:0
}
//array 0-8 to represent 9 empty spaces
let defaultBoard = Array.from(Array(9).keys());
let availableSpaces = emptySpots(defaultBoard);
let humanPlayed = false;
let currWinCombo;
//all possible win combinations
const winCombos = [
 [0,1,2],
 [3,4,5],
 [6,7,8],
 [0,4,8],
 [2,4,6],
 [0,3,6], 
 [1,4,7], 
 [2,5,8]
];
function startGame() {
  defaultBoard = Array.from(Array(9).keys());
  gameOver = false;
  currWinCombo = null;
  cells.map(cell => {
    cell.innerText = '';
    cell.style.background = 'rgb(29,54,64)';
    cell.style.color = '#f0af39'
    if (typeof defaultBoard[cell.id] == 'number' && !checkGameOver()) {
      cell.onclick = () => {
        if (typeof defaultBoard[cell.id] == 'number') {
          cell.style.color = '#37c2be';
        }
        insertPlayer(cell);
        if (humanPlayed) {
          insertAi(cells);
        }
        declareGameOver();
        checkWin(defaultBoard, player.ai)
      };
    }
  })
}
function insertPlayer(square) {
  if (!checkGameOver() && square.textContent == '') {
    square.innerText = player.human;
    defaultBoard[square.id] = player.human;
    availableSpaces = emptySpots(defaultBoard)
    humanPlayed = true;
  }
}
function emptySpots(board) {
  return board.filter(elt => typeof elt == 'number');
}
function checkWin(board, player) {
  let ComboStorage = [];
  board.map((square, index) => {
    if (square == player) {
      ComboStorage.push(index);
    }
  })
  for (let i = 0; i < winCombos.length; i++) {
    let combo = winCombos[i];
    if (combo.every(square => ComboStorage.includes(square))) {
      currWinCombo = i;
      return true;
    } 
  }
}
function checkForTie(board) {
  if (board.every((elt) => typeof elt == 'string')) {
    return true;
  } else return false;
}
function checkGameOver() {
  if (checkWin(defaultBoard, player.ai)) return true;
  if (checkForTie(defaultBoard)) return true;
}
//changes in the ui when game is over
function declareGameOver() {
  if (checkWin(defaultBoard, player.ai)) {
    winCombos[currWinCombo].map(square => {
      cells[square].style.background = '#f0af39'
      cells[square].style.color = 'rgb(26, 43,51)';
      message.textContent = 'You lose! ';
      displayMessage.style.display = 'block';
    })
    stats.loses++;
    localStorage.setItem('loses', JSON.stringify(stats.loses)); 
    totalLoses.innerHTML = stats.loses;
  } else if(checkForTie(defaultBoard)) {
    cells.map(cell => {
      cell.style.background = '#a6bec8'
      cell.style.color = 'rgb(26, 43,51)';
    })
    displayMessage.style.display = 'block';
      message.textContent = 'Its a tie!'
    stats.ties++;
    localStorage.setItem('ties', JSON.stringify(stats.ties));
    totalTies.innerHTML = stats.ties;
  }
}
//inserts computer play3r
function insertAi(board) {
  let index = minimax(defaultBoard, player.ai).index;
  if (!checkGameOver()) {
    if (availableSpaces.length !== 0) {
      defaultBoard[index] = player.ai;
      board[index].innerText = player.ai
    }
    availableSpaces = defaultBoard.filter(elt => typeof elt == 'number');
    humanPlayed = false;
  }
}
function restart() {
  startGame();
  displayMessage.style.display = 'none';
}
//recursive minimax function
function minimax(board , currPlayer) {
  if (checkWin(board, player.ai)) return {score:1};
  if (checkWin(board, player.human)) return {score:-1}
  if (checkForTie(board)) {
    return {score:0}
  }
  let availSpots = emptySpots(board);
  const boardInfo = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = availSpots[i];
    board[availSpots[i]] = currPlayer;
    if (currPlayer == player.ai) {
      let result = minimax(board, player.human);
      move.score = result.score;
    } else {
      let result = minimax(board, player.ai);
      move.score = result.score;
    } 
    board[availSpots[i]] = availSpots[i];
    boardInfo.push(move);
  }
  let bestMove;
  if (currPlayer == player.ai) {
    let bestScore = -Infinity;
    for (let i = 0; i < boardInfo.length; i++) {
      if (boardInfo[i].score > bestScore) {
        bestScore = boardInfo[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boardInfo.length; i++) {
      if (boardInfo[i].score < bestScore) {
        bestScore = boardInfo[i].score;
        bestMove = i;
      }
    }
  } 
  return boardInfo[bestMove];
}
play.addEventListener('click', () => {
		gameBoard.style.display = 'block';
		page.style.background = 'rgb(20, 38,47)';
  startGame();
  coverImage.style.display = 'none';
})
replay.addEventListener('click', startGame);
retry.addEventListener('click', restart)
//load previous game statistics 
addEventListener('load', () => {
  let loses = JSON.parse(localStorage.getItem("loses"));
  let ties = JSON.parse(localStorage.getItem("ties"));
  if (loses) stats.loses = loses;
  if (ties) stats.ties = ties;
  totalLoses.innerHTML = stats.loses;
  totalTies.innerHTML = stats.ties;
})
