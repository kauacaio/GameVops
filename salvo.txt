const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreDisplay = document.querySelector('.score');
const gameOverText = document.querySelector('.game-over');
const restartButton = document.querySelector('.restart-btn');




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
    isGameOver = false;
    score = 0;
    scoreDisplay.innerText = 'Pontuação: 0';
    gameOverText.style.display = 'none';
    restartButton.style.display = 'none';
    mario.src = 'mario.gif';
    mario.style.width = '150px';
    mario.style.marginLeft = '50px';

    // Reinicia a animação do cano
    pipe.style.animation = 'none'; // Para garantir que a animação reinicie
    void pipe.offsetWidth; // Força o reflow para reiniciar a animação
    pipe.style.animation = 'pipe-animation 2s infinite linear'; // Reinicia a animação do pipe
};

// Certifique-se de que o botão de reinício está definido corretamente
restartButton.addEventListener('click', startGame);



const gameLoop = setInterval(() => {
    if (!isGameOver) {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        score++;
        scoreDisplay.innerText = `Pontuação: ${score}`;

        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
            isGameOver = true;
            
            pipe.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;
            mario.style.animation = 'none';
            mario.style.bottom = `${marioPosition}px`;


            mario.src = 'game-over.png';
            mario.style.width = '75px';
            mario.style.marginLeft = '50px';
            gameOverText.style.display = 'block';
            restartButton.style.display = 'block';
        }
    }
}, 10);

restartButton.addEventListener('click', startGame);
document.addEventListener('keydown', jump);
