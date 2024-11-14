const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configurações do Jogo
const playerWidth = 50;
const playerHeight = 30;
const playerSpeed = 5;
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 10;

let bullets = [];
const bulletWidth = 5;
const bulletHeight = 15;
const bulletSpeed = 7;

let enemies = [];
const enemyWidth = 50;
const enemyHeight = 30;
let enemySpeed = 1; // Velocidade inicial dos inimigos bem baixa

let score = 0;
let isGameOver = false;
let gameTime = 0; // Para aumentar a dificuldade com o tempo

// Função para desenhar o jogador
function drawPlayer() {
    ctx.fillStyle = '#00FF00'; // Cor verde para a nave
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

// Função para desenhar os inimigos
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = '#FF0000'; // Cor vermelha para os inimigos
        ctx.fillRect(enemy.x, enemy.y, enemyWidth, enemyHeight);
    });
}

// Função para desenhar os tiros
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = '#FFFF00'; // Cor amarela para os tiros
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    });
}

// Função para desenhar a pontuação
function drawScore() {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.fillText('Pontuação: ' + score, 10, 30);
}

// Função para atualizar a posição do jogador
function updatePlayer() {
    if (keys.left && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (keys.right && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }
}

// Função para atualizar a posição dos tiros
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;

        // Remove os tiros que saem da tela
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Função para atualizar a posição dos inimigos
function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;

        // Se o inimigo atingir o fundo, termina o jogo
        if (enemy.y + enemyHeight >= canvas.height) {
            isGameOver = true;
        }

        // Verifica colisão com os tiros
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemyWidth &&
                bullet.x + bulletWidth > enemy.x &&
                bullet.y < enemy.y + enemyHeight &&
                bullet.y + bulletHeight > enemy.y
            ) {
                // Remover inimigo e tiro quando colidem
                enemies.splice(index, 1);
                bullets.splice(bulletIndex, 1);
                score += 10; // Aumenta a pontuação
            }
        });
    });
}

// Função para gerar inimigos
function generateEnemies() {
    // Começa com uma chance muito baixa, aumentando a cada segundo
    if (Math.random() < 0.005 + gameTime / 15000) {  // Chance muito pequena no início
        const x = Math.random() * (canvas.width - enemyWidth);
        enemies.push({ x, y: -enemyHeight });
    }
}

// Função para verificar a tecla pressionada
const keys = {
    left: false,
    right: false,
    space: false
};

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        keys.left = true;
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
        keys.right = true;
    }
    if (event.key === ' ' || event.key === 'Enter') {
        keys.space = true;
        if (!isGameOver) {
            bullets.push({ x: playerX + playerWidth / 2 - bulletWidth / 2, y: playerY });
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        keys.left = false;
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
        keys.right = false;
    }
    if (event.key === ' ' || event.key === 'Enter') {
        keys.space = false;
    }
});

// Função para desenhar o Game Over
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '40px Arial';
    ctx.fillText('GAME OVER', canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = '30px Arial';
    ctx.fillText('Pontuação Final: ' + score, canvas.width / 2 - 100, canvas.height / 2 + 50);
    ctx.fillText('Pressione F5 para reiniciar', canvas.width / 2 - 150, canvas.height / 2 + 100);
}

// Função do loop principal do jogo
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    if (isGameOver) {
        drawGameOver(); // Exibe a tela de Game Over
    } else {
        drawBackground();
        drawPlayer();
        drawEnemies();
        drawBullets();
        drawScore();

        updatePlayer();
        updateBullets();
        updateEnemies();
        generateEnemies();
    }

    gameTime++; // Aumenta o tempo de jogo

    if (gameTime % 1000 === 0) { // A cada 1 segundo, aumenta a dificuldade
        if (enemySpeed < 3) {  // Limita o aumento de velocidade
            enemySpeed += 0.02; // Aumenta a velocidade dos inimigos muito lentamente
        }
    }

    requestAnimationFrame(gameLoop); // Chama o loop de animação
}

// Função para desenhar o fundo (simples)
function drawBackground() {
    ctx.fillStyle = '#000'; // Fundo preto
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

gameLoop(); // Inicia o loop do jogo
