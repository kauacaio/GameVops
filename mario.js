const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreDisplay = document.querySelector('.score');
const gameOverText = document.querySelector('.game-over');
const restartButton = document.querySelector('.restart-btn');
const newRecordText = document.querySelector('.new-record');
const fireworksContainer = document.querySelector('.fireworks');

let score = 0;
let isGameOver = false;

const jump = () => {
    if (!isGameOver) {
        mario.classList.add('jump');
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
};

const startGame = () => {
    // Redefine a página atual, reiniciando o jogo
    location.reload();
};

// Reinicia o jogo ao clicar no botão
restartButton.addEventListener('click', startGame);

// Loop do jogo
// Função para criar fogos de artifício
function createFireworks() {
    for (let i = 0; i < 10; i++) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        
        // Definindo posição aleatória para o "fogo de artifício"
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.animationDelay = `${Math.random() * 2}s`;  // Variedade no tempo de início
        
        fireworksContainer.appendChild(firework);
        
        // Remover fogos de artifício depois de terminar a animação
        setTimeout(() => {
            firework.remove();
        }, 1500);
    }
}

// Loop do jogo
const gameLoop = setInterval(() => {
    if (!isGameOver) {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        score++;
        scoreDisplay.innerText = `Pontuação: ${score}`;

        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
            isGameOver = true;

            // Pausa a animação do pipe e do Mario
            pipe.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;
            mario.style.animation = 'none';
            mario.style.bottom = `${marioPosition}px`;

            // Troca a imagem do Mario para "Game Over"
            mario.src = 'game-over.png';
            mario.style.width = '75px';
            mario.style.marginLeft = '50px';
            gameOverText.style.display = 'block';
            restartButton.style.display = 'block';

            // Atualiza a maior pontuação
            const highScore = localStorage.getItem('highScore') || 0;
            if (score > highScore) {
                localStorage.setItem('highScore', score);

                // Mostra a animação do novo recorde
                newRecordText.style.display = 'block';

                // Cria os fogos de artifício
                createFireworks();

                // Esconde a mensagem após 3 segundos
                setTimeout(() => {
                    newRecordText.style.display = 'none';
                }, 3000); // A animação do recorde dura 3 segundos
            }
        }
    }
}, 10);


// Evento para pular ao pressionar qualquer tecla
document.addEventListener('keydown', jump);

// Inicia o jogo ao clicar em "Jogar Novamente"
restartButton.addEventListener('click', startGame);
