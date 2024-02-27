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

document.querySelectorAll('input[name="player"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
		var humanPlayer = document.querySelector('input[name="player"]:checked').value;
		if (humanPlayer === 'human') {
			document.getElementById('difficulty').style.display = 'none';
			document.getElementById('gameTable').style.top = "260px";
		}
		else{
			document.getElementById('difficulty').style.display = '';
			document.getElementById('gameTable').style.top = "300px";
		}
    });
});

const cls = document.querySelectorAll('.cell');
start();

function start() {
document.querySelector(".end").style.display = "none";
brd = Array.from(Array(9).keys());
for (var i = 0; i < cls.length; i++) {
cls[i].innerText = '';
cls[i].style.removeProperty('background-color');
var humanPlayer = document.querySelector('input[name="player"]:checked').value;
if (humanPlayer === 'human') {
	cls[i].removeEventListener('click', playComputer, false);
	cls[i].addEventListener('click', playHuman, false);
}
else{
	cls[i].removeEventListener('click', playHuman, false);
	cls[i].addEventListener('click', playComputer, false);
}
}
}

function playHuman(square) {
    var currentPlayer = (brd.filter(s => typeof s == 'number').length % 2 == 0) ? pO : pX;
    if (typeof brd[square.target.id] == 'number') {
        takeTurnHuman(square.target.id, currentPlayer);
        let winResult = checkWin(brd, currentPlayer);
        if (winResult) {
            gameOverHuman(winResult);
        } else {
            checkDrawHuman();
        }
    }
}

function playComputer(square) {
	if (typeof brd[square.target.id] == 'number') {
	takeTurnComputer(square.target.id, pX)
	if (!checkWin(brd, pX) && !checkDrawComputer())
	{
		let difficulty = document.getElementById('difficulty-select').value;
		if (difficulty === 'hard'){
			takeTurnComputer(bestMove(), pO);
		}
		else{
			let availableSquares = emptySquares();
            let randomSquareIndex = Math.floor(Math.random() * availableSquares.length);
            let randomSquareId = availableSquares[randomSquareIndex];
			takeTurnComputer(randomSquareId, pO);
		}
	}
	}
}

function takeTurnHuman(squareId, player) {
brd[squareId] = player;
document.getElementById(squareId).innerText = player;
let winResult = checkWin(brd, player)
if (winResult) gameOverHuman(winResult)
}

function takeTurnComputer(squareId, player) {
	brd[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let winResult = checkWin(brd, player)
	if (winResult) gameOverComputer(winResult)
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

function gameOverHuman(winResult) {
for (let index of cmb[winResult.index]) {
document.getElementById(index).style.backgroundColor =
winResult.player == pX ? "blue" : "red";
}
for (var i = 0; i < cls.length; i++) {
cls[i].removeEventListener('click', playHuman, false);
}
announceWinner(winResult.player == pX ? "Победил X!" : "Победил O!");
}

function gameOverComputer(winResult) {
	for (let index of cmb[winResult.index]) {
	document.getElementById(index).style.backgroundColor =
	winResult.player == pX ? "blue" : "red";
	}
	for (var i = 0; i < cls.length; i++) {
	cls[i].removeEventListener('click', playComputer, false);
	}
	announceWinner(winResult.player == pX ? "Вы победили!" : "Вы проиграли.");
}

function announceWinner(who) {
document.querySelector(".end").style.display = "block";
document.querySelector(".end .txt").innerText = who;
}

function emptySquares() {
return brd.filter(s => typeof s == 'number');
}

function checkDrawHuman() {
if (emptySquares().length == 0) {
for (var i = 0; i < cls.length; i++) {
cls[i].style.backgroundColor = "green";
cls[i].removeEventListener('click', playHuman, false);
}
announceWinner("Ничья!")
return true;
}
return false;
}

function checkDrawComputer() {
	if (emptySquares().length == 0) {
	for (var i = 0; i < cls.length; i++) {
	cls[i].style.backgroundColor = "green";
	cls[i].removeEventListener('click', playComputer, false);
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