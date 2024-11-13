let score = 0;
let level = 1;
let timer = 60;
let timerInterval;
let gameOver = false;
let pointsMultiplier = 1;

// Iniciar o jogo
function startGame() {
    gameOver = false;
    score = 0;
    level = 1;
    pointsMultiplier = 1;
    timer = 60;
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('timer').textContent = timer;
    document.getElementById('level-up').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('gameArea').innerHTML = ''; // Limpar a área de jogo
    startTimer();
    createNewTarget();
}

// Iniciar o cronômetro
function startTimer() {
    timerInterval = setInterval(() => {
        if (gameOver) return;
        timer--;
        document.getElementById('timer').textContent = timer;
        if (timer <= 0) {
            clearInterval(timerInterval);
            gameOver = true;
            showGameOverMessage();
        }
    }, 1000);
}

// Criar um novo alvo
function createNewTarget() {
    if (gameOver) return;

    const gameArea = document.getElementById('gameArea');
    const target = document.createElement('div');
    target.classList.add('target');

    // Randomizar o tipo de alvo
    const randomTarget = Math.random();
    if (randomTarget < 0.33) {
        target.classList.add('triangle');
        target.setAttribute('data-points', 20);
    } else if (randomTarget < 0.66) {
        target.classList.add('ball');
        target.setAttribute('data-points', 10);
    } else {
        target.classList.add('square');
        target.setAttribute('data-points', 5);
    }

    // Posição aleatória dentro da área do jogo
    const randomX = Math.random() * (gameArea.offsetWidth - 50);
    const randomY = Math.random() * (gameArea.offsetHeight - 50);
    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;

    target.addEventListener('click', () => hitTarget(target));

    gameArea.appendChild(target);

    // Criar um novo alvo a cada 1.5 segundos (ajustado pelo nível)
    setTimeout(createNewTarget, 1500 / level);
}

// Acertou o alvo
function hitTarget(target) {
    const points = parseInt(target.getAttribute('data-points')) * pointsMultiplier;
    score += points;
    document.getElementById('score').textContent = score;
    target.remove();
    checkLevelUp();
}

// Verificar se o jogador avançou de nível
function checkLevelUp() {
    if (score >= 100 * level) {
        level++;
        pointsMultiplier = level;
        document.getElementById('level').textContent = level;
        showLevelUpMessage();
    }
}

// Mostrar a tela de "Você Ganhou o Nível"
function showLevelUpMessage() {
    const levelUpMessage = document.getElementById('level-up');
    levelUpMessage.querySelector('p').textContent = `Você Ganhou o Nível ${level}!`;
    levelUpMessage.classList.remove('hidden');
}

// Mostrar a tela de "Fim de Jogo"
function showGameOverMessage() {
    const gameOverMessage = document.getElementById('game-over');
    document.getElementById('final-level').textContent = level;
    document.getElementById('final-score').textContent = score;
    gameOverMessage.classList.remove('hidden');
    document.getElementById('gameArea').innerHTML = ''; // Limpar a área de jogo
}

// Iniciar o jogo assim que carregar
startGame();

// Botão para reiniciar o jogo
document.getElementById('restart-button').addEventListener('click', function() {
    startGame();
});
