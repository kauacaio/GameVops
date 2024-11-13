// script.js
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
const statusElement = document.getElementById("status");
const cells = document.querySelectorAll(".cell");

function handleCellClick(event) {
    const cellIndex = event.target.getAttribute("data-index");
    
    if (board[cellIndex] !== "" || !gameActive) {
        return; // Se a célula já estiver preenchida ou o jogo acabou
    }

    board[cellIndex] = currentPlayer;
    event.target.textContent = currentPlayer;
    checkWinner();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
}

function checkWinner() {
    const winningCombination = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];

    for (let combination of winningCombination) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            statusElement.textContent = `Jogador ${currentPlayer} venceu!`;
            return;
        }
    }

    if (!board.includes("")) {
        gameActive = false;
        statusElement.textContent = "Empate!";
    }
}

function updateStatus() {
    if (gameActive) {
        statusElement.textContent = `Agora é a vez do jogador ${currentPlayer}`;
    }
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusElement.textContent = "Jogador X começa!";
    cells.forEach(cell => cell.textContent = "");
}

cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});
