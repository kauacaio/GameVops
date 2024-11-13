const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 600;
let snake = [{ x: 160, y: 160 }];
let direction = 'right';
let food = spawnFood();
let score = 0;

// Carregar o recorde do localStorage (ou definir como 0 se não existir)
let highScore = localStorage.getItem('highScore') || 0;
document.getElementById("recorde").innerText = `Recorde: ${highScore}`;

// Função para desenhar a cobra
function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// Função para desenhar a comida
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Função para mover a cobra
function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y -= gridSize; break;
        case 'down': head.y += gridSize; break;
        case 'left': head.x -= gridSize; break;
        case 'right': head.x += gridSize; break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = spawnFood();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || isCollision(head)) {
        gameOver();
    }
}

// Função para verificar colisão
function isCollision(head) {
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

// Função para gerar comida
function spawnFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

// Função para desenhar a pontuação
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText('Pontuação: ' + score, 10, 20);
}

// Função para mudar a direção
function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    }
}

// Função de final de jogo
function gameOver() {
    let message = `Seu Recorde foi: ${score}`; // Mensagem com o recorde atual
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // Salva o novo recorde
        message = `Novo Recorde! Sua pontuação foi: ${score}`; // Mensagem de novo recorde
        document.getElementById("recorde").innerText = `Recorde: ${highScore}`; // Atualiza o texto do recorde
    }

    // Exibe a mensagem na tela
    document.getElementById("gameMessage").innerText = message;

    // Reset do jogo
    score = 0;
    snake = [{ x: 160, y: 160 }];
    direction = 'right';
    food = spawnFood();
}

// Atualizar o jogo
function updateGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize); // Limpa o canvas
    moveSnake();
    drawSnake();
    drawFood();
    drawScore();
}

// Teclas de controle
document.addEventListener('keydown', changeDirection);

// Atualização a cada 100ms
setInterval(updateGame, 100);
