// Configurações do canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 800;

// Variáveis do jogo
let paddleWidth = 80;
let paddleHeight = 10;
let ballSize = 10;

let paddleX = canvas.width / 2 - paddleWidth / 2;
let paddleSpeed = 0;

let balls = [
  { x: canvas.width / 2, y: canvas.height / 2, speedX: 4, speedY: 4 }
];

let score = 0;
let lives = 3;
let level = 1;
let gameOver = false;

// Controles do jogador
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") paddleSpeed = -6;
  if (e.key === "ArrowRight") paddleSpeed = 6;
});

document.addEventListener("keyup", () => {
  paddleSpeed = 0;
});

// Atualização do jogo
function update() {
  if (gameOver) return; // Se o jogo acabou, não atualiza

  // Movendo a plaquinha
  paddleX += paddleSpeed;
  if (paddleX < 0) paddleX = 0;
  if (paddleX > canvas.width - paddleWidth) paddleX = canvas.width - paddleWidth;

  // Movendo as bolinhas
  balls.forEach((ball, index) => {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Colisão com paredes laterais (esquerda e direita)
    if (ball.x < 0 || ball.x > canvas.width - ballSize) {
      ball.speedX *= -1; // Reflete a bola
    }

    // Colisão com o topo
    if (ball.y < 0) {
      ball.speedY *= -1; // Reflete a bola
    }

    // Colisão com a plaquinha
    if (
      ball.y > canvas.height - paddleHeight - ballSize &&
      ball.x > paddleX &&
      ball.x < paddleX + paddleWidth
    ) {
      ball.speedY *= -1;
      score++; // Adiciona ponto
      // Verifica aumento de nível
      if (score % 3 === 0) increaseLevel();
    }

    // Bolinha tocando o chão (perde vida)
    if (ball.y > canvas.height) {
      balls.splice(index, 1); // Remove a bolinha
      lives--; // Perde uma vida

      // Reinsere a bolinha inicial se houver vidas restantes
      if (lives > 0 && balls.length === 0) {
        balls.push({ x: canvas.width / 2, y: canvas.height / 2, speedX: 4, speedY: 4 });
      }

      if (lives <= 0) {
        gameOver = true;
      }
    }
  });
}

// Aumenta o nível e adiciona novas bolinhas
function increaseLevel() {
  level++;
  if (level >= 3) {
    // Adiciona uma bolinha extra
    balls.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      speedX: 4 + level, // Aumenta a velocidade com o nível
      speedY: 4 + level,
    });
  }
}

// Reseta o jogo
function resetGame() {
  score = 0;
  lives = 3;
  level = 1;
  gameOver = false;
  balls = [
    { x: canvas.width / 2, y: canvas.height / 2, speedX: 4, speedY: 4 }
  ];
}

// Renderização do jogo
function draw() {
  // Fundo com estrelas e planetas
  if (!gameOver) {
    ctx.fillStyle = "#000"; // Cor de fundo preta para o espaço
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fundo preto
    drawStars();
    drawPlanets();
  } else {
    // Tela de Game Over
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 90, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText(`Pontuação Final: ${score}`, canvas.width / 2 - 100, canvas.height / 2 + 40);
  }

  // Desenhar a plaquinha
  ctx.fillStyle = "white";
  ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

  // Desenhar as bolinhas
  balls.forEach((ball) => {
    ctx.fillRect(ball.x, ball.y, ballSize, ballSize);
  });

  // Mostrar pontuação, vidas e nível
  if (!gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Pontos: ${score}`, 20, 30);
    ctx.fillText(`Vidas: ${lives}`, canvas.width / 2 - 40, 30);
    ctx.fillText(`Nível: ${level}`, canvas.width - 120, 30);
  }
}

// Função para desenhar estrelas no fundo
function drawStars() {
  for (let i = 0; i < 100; i++) {
    const starX = Math.random() * canvas.width;
    const starY = Math.random() * canvas.height;
    ctx.fillStyle = "white";
    ctx.fillRect(starX, starY, 1, 1);
  }
}

// Função para desenhar planetas no fundo
function drawPlanets() {
  // Desenhando um planeta fictício
  ctx.beginPath();
  ctx.arc(100, 150, 30, 0, 2 * Math.PI);
  ctx.fillStyle = "#ff6347"; // Cor de um planeta
  ctx.fill();
}

// Loop do jogo
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
