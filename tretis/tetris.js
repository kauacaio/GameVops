const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configurações do Tetris
const rows = 20;
const cols = 10;
const blockSize = 30; // Tamanho de cada bloco
const gameWidth = cols * blockSize;
const gameHeight = rows * blockSize;

canvas.width = gameWidth;
canvas.height = gameHeight;

// Peças do Tetris
const tetrominos = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]] // J
];

const colors = ['#00FFFF', '#FFFF00', '#00FF00', '#FF0000', '#800080', '#FF8000', '#0000FF'];

let board = Array.from({ length: rows }, () => Array(cols).fill(0));
let currentPiece = getRandomPiece();
let gameOver = false;
let score = 0;

// Função para desenhar o tabuleiro
function drawBoard() {
    ctx.clearRect(0, 0, gameWidth, gameHeight); // Limpa o canvas

    // Desenha o tabuleiro
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col]) {
                ctx.fillStyle = colors[board[row][col] - 1];
                ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
                ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
            }
        }
    }
}

// Função para desenhar a peça atual
function drawPiece(piece) {
    const shape = piece.shape;
    ctx.fillStyle = piece.color;

    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                ctx.fillRect((piece.x + col) * blockSize, (piece.y + row) * blockSize, blockSize, blockSize);
                ctx.strokeRect((piece.x + col) * blockSize, (piece.y + row) * blockSize, blockSize, blockSize);
            }
        }
    }
}

// Função para gerar uma nova peça aleatória
function getRandomPiece() {
    const randomIndex = Math.floor(Math.random() * tetrominos.length);
    const shape = tetrominos[randomIndex];
    const color = colors[randomIndex];
    return { shape, color, x: Math.floor(cols / 2) - 1, y: 0 };
}

// Função para rotacionar a peça
function rotatePiece(piece) {
    const newShape = piece.shape[0].map((_, i) =>
        piece.shape.map(row => row[i])
    ).reverse();

    const newPiece = { ...piece, shape: newShape };
    return newPiece;
}

// Função para mover a peça
function movePiece(piece, dx, dy) {
    const newPiece = { ...piece, x: piece.x + dx, y: piece.y + dy };

    if (!isValidPosition(newPiece)) {
        return piece;
    }

    return newPiece;
}

// Função para verificar se a peça pode ser movida para a nova posição
function isValidPosition(piece) {
    const shape = piece.shape;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const x = piece.x + col;
                const y = piece.y + row;
                if (x < 0 || x >= cols || y >= rows || (y >= 0 && board[y][x])) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Função para fixar a peça no tabuleiro
function fixPiece(piece) {
    const shape = piece.shape;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                board[piece.y + row][piece.x + col] = tetrominos.indexOf(piece.shape) + 1;
            }
        }
    }

    // Remover linhas completas
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(cols).fill(0));
            score += 100;
        }
    }

    // Gerar nova peça
    currentPiece = getRandomPiece();

    // Verificar se o jogo acabou
    if (!isValidPosition(currentPiece)) {
        gameOver = true;
    }
}

// Função para desenhar a tela de Game Over
function drawGameOver() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", gameWidth / 2, gameHeight / 2 - 20);
    
    ctx.font = "20px Arial";
    ctx.fillText(`Sua pontuação: ${score}`, gameWidth / 2, gameHeight / 2 + 20);

    ctx.font = "16px Arial";
    ctx.fillText("Pressione F5 para reiniciar", gameWidth / 2, gameHeight / 2 + 60);
}

// Função para atualizar o jogo
function update() {
    if (gameOver) {
        drawGameOver();
        return;
    }

    // Tenta mover a peça para baixo
    const newPiece = movePiece(currentPiece, 0, 1);
    if (newPiece === currentPiece) {
        fixPiece(currentPiece);
    } else {
        currentPiece = newPiece;
    }

    drawBoard();
    drawPiece(currentPiece);
    drawScore();
}

// Função para desenhar o placar
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Pontuação: ${score}`, 10, 30);
}

// Função para lidar com a entrada do teclado
document.addEventListener("keydown", (event) => {
    if (gameOver) return;

    if (event.key === "ArrowLeft") {
        currentPiece = movePiece(currentPiece, -1, 0);
    } else if (event.key === "ArrowRight") {
        currentPiece = movePiece(currentPiece, 1, 0);
    } else if (event.key === "ArrowDown") {
        currentPiece = movePiece(currentPiece, 0, 1);
    } else if (event.key === "ArrowUp") {
        const rotatedPiece = rotatePiece(currentPiece);
        if (isValidPosition(rotatedPiece)) {
            currentPiece = rotatedPiece;
        }
    }
});

// Função para iniciar o loop do jogo
function gameLoop() {
    update();
    setTimeout(gameLoop, 1000 / 2); // Atualiza a cada 500ms
}

gameLoop();
