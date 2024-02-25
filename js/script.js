var brd;
const pX = 'X';
const pO = 'O';
const cmb = [
[0, 1, 2],
[3, 4, 5],
[6, 7, 8],
[0, 3, 6],
[1, 4, 7],
[2, 5, 8],
[0, 4, 8],
[6, 4, 2]
]

const cls = document.querySelectorAll('.cell');
start();

function start() {
document.querySelector(".end").style.display = "none";
brd = Array.from(Array(9).keys());
for (var i = 0; i < cls.length; i++) {
cls[i].innerText = '';
cls[i].style.removeProperty('background-color');
cls[i].addEventListener('click', play, false);
}
}

function play(square) {
    var currentPlayer = (brd.filter(s => typeof s == 'number').length % 2 == 0) ? pO : pX;
    if (typeof brd[square.target.id] == 'number') {
        takeTurn(square.target.id, currentPlayer);
        let winResult = checkWin(brd, currentPlayer);
        if (winResult) {
            gameOver(winResult);
        } else {
            checkDraw();
        }
    }
}

function takeTurn(squareId, player) {
brd[squareId] = player;
document.getElementById(squareId).innerText = player;
let winResult = checkWin(brd, player)
if (winResult) gameOver(winResult)
}

function bestMove() {
return minimax(brd, pO).index;
}

function checkWin(board, player) {
let plays = board.reduce((a, e, i) =>
(e === player) ? a.concat(i) : a, []);
let winResult = null;
for (let [index, win] of cmb.entries()) {
if (win.every(elem => plays.indexOf(elem) > -1)) {
winResult = {index: index, player: player};
break;
}
}
return winResult;
}

function gameOver(winResult) {
for (let index of cmb[winResult.index]) {
document.getElementById(index).style.backgroundColor =
winResult.player == pX ? "blue" : "red";
}
for (var i = 0; i < cls.length; i++) {
cls[i].removeEventListener('click', play, false);
}
announceWinner(winResult.player == pX ? "Победил X!" : "Победил O!");
}

function announceWinner(who) {
document.querySelector(".end").style.display = "block";
document.querySelector(".end .txt").innerText = who;
}

function emptySquares() {
return brd.filter(s => typeof s == 'number');
}

function checkDraw() {
if (emptySquares().length == 0) {
for (var i = 0; i < cls.length; i++) {
cls[i].style.backgroundColor = "green";
cls[i].removeEventListener('click', play, false);
}
announceWinner("Ничья!")
return true;
}
return false;
}

function minimax(newBoard, player) {
var availSpots = emptySquares();
if (checkWin(newBoard, pX)) {
return {score: -10};
} else if (checkWin(newBoard, pO)) {
return {score: 10};
} else if (availSpots.length === 0) {
return {score: 0};
}
var moves = [];
for (var i = 0; i < availSpots.length; i++) {
	var move = {};
	move.index = newBoard[availSpots[i]];
	newBoard[availSpots[i]] = player;

	if (player == pO) {
		var result = minimax(newBoard, pX);
		move.score = result.score;
	} else {
		var result = minimax(newBoard, pO);
		move.score = result.score;
	}
	newBoard[availSpots[i]] = move.index;
	moves.push(move);
}
var bestMove;
if(player === pO) {
	var bestScore = -10000;
	for(var i = 0; i < moves.length; i++) {
		if (moves[i].score > bestScore) {
			bestScore = moves[i].score;
			bestMove = i;
		}
	}
} else {
	var bestScore = 10000;
	for(var i = 0; i < moves.length; i++) {
		if (moves[i].score < bestScore) {
			bestScore = moves[i].score;
			bestMove = i;
		}
	}
}
return moves[bestMove];
}