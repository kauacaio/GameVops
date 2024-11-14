const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configurações do Jogo
const birdWidth = 35;
const birdHeight = 35;
let birdX = 100;
let birdY = canvas.height / 2;
const birdSpeed = 2;
let gravity = 0.5;
let jumpStrength = -12;
let birdVelocity = 0;
let isGameOver = false;

let pipes = [];
let pipeWidth = 80;
let pipeGap = 180;
let pipeSpeed = 3;

let score = 0;
let passedPipes = 0; // Contador de tubos passados

// Função para desenhar o fundo (sem estrelas)
function drawBackground() {
    ctx.fillStyle = "#70c5ce"; // Cor do fundo
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
}

// Função para desenhar o passarinho
function drawBird() {
    ctx.fillStyle = "#FFD700";  // Cor dourada para o passarinho
    ctx.beginPath();
    ctx.arc(birdX + birdWidth / 2, birdY + birdHeight / 2, birdWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFD700";
    ctx.stroke();
}

// Função para desenhar os tubos
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = "#228B22"; // Verde para os tubos
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);  // Tubo superior
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap); // Tubo inferior
    });
}

// Função para desenhar o placar
function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "40px 'Press Start 2P', cursive"; // Fonte diferente e estilo retrô
    ctx.fillText("Pontuação: " + score, 20, 50);
}

// Função para desenhar a mensagem de Game Over
function drawGameOverMessage() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // Tela escura
    ctx.fillStyle = "#fff";
    ctx.font = "60px 'Press Start 2P', cursive";
    ctx.fillText("Game Over", canvas.width / 2 - 150, canvas.height / 2 - 50); // Mensagem de fim
    ctx.font = "30px 'Press Start 2P', cursive";
    ctx.fillText("Pontuação Final: " + score, canvas.width / 2 - 120, canvas.height / 2); // Pontuação
    ctx.fillText("Pressione F5 para reiniciar", canvas.width / 2 - 170, canvas.height / 2 + 50); // Reiniciar
}

// Função para atualizar a posição do passarinho
function updateBird() {
    birdVelocity += gravity; // Aplica a gravidade
    birdY += birdVelocity;

    // Limita o passarinho para que não saia da tela
    if (birdY <= 0) birdY = 0;
    if (birdY + birdHeight >= canvas.height) {
        birdY = canvas.height - birdHeight;
        if (!isGameOver) {
            endGame();
        }
    }
}

// Função para gerar e mover os tubos
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed; // Move os tubos para a esquerda
    });

    // Adicionar novos tubos
    if (pipes.length === 0 || pipes[pipes.length - 1].x <= canvas.width - 350) {
        const pipeHeight = Math.random() * (canvas.height - pipeGap - 100);
        pipes.push({ x: canvas.width, top: pipeHeight });
    }

    // Remover tubos que saíram da tela
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// Função para verificar colisões
function checkCollisions() {
    pipes.forEach(pipe => {
        if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth) {
            if (birdY < pipe.top || birdY + birdHeight > pipe.top + pipeGap) {
                endGame();
            }
        }
    });
}

// Função para verificar se o passarinho passou por um tubo
function checkPassedPipes() {
    pipes.forEach(pipe => {
        if (pipe.x + pipeWidth < birdX && !pipe.passed) {
            pipe.passed = true; // Marca o tubo como "passado"
            passedPipes++; // Incrementa o contador de tubos passados
            score = passedPipes; // Atualiza a pontuação
        }
    });
}

// Função para finalizar o jogo
function endGame() {
    isGameOver = true;
    drawGameOverMessage(); // Exibe a mensagem de Game Over
}

// Função para reiniciar o jogo
function restartGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    passedPipes = 0;
    score = 0;
    isGameOver = false;
    gameLoop(); // Reinicia o loop do jogo
}

// Função do loop do jogo
function gameLoop() {
    drawBackground(); // Chama a função para desenhar o fundo
    updateBird();
    updatePipes();
    checkCollisions();
    checkPassedPipes();
    drawBird();
    drawPipes();
    drawScore();

    if (!isGameOver) {
        requestAnimationFrame(gameLoop); // Continua o loop se o jogo não acabou
    }
}

// Função para lidar com o evento de pular
document.addEventListener("keydown", function(event) {
    if (event.key === " " || event.key === "ArrowUp") {
        birdVelocity = jumpStrength; // Dá a força do pulo
    }
});

// Escuta a tecla para reiniciar o jogo
document.addEventListener("keydown", function(event) {
    if (event.key === "F5" || event.key.toLowerCase() === "r") {
        restartGame(); // Reinicia o jogo sem recarregar a página
    }
});

gameLoop(); // Inicia o loop do jogo
