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
    location.reload();
};

restartButton.addEventListener('click', startGame);

function createFireworks() {
    for (let i = 0; i < 10; i++) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.animationDelay = `${Math.random() * 2}s`;  // Variedade no tempo de início
        
        fireworksContainer.appendChild(firework);
        
        setTimeout(() => {
            firework.remove();
        }, 1500);
    }
}

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

            const highScore = localStorage.getItem('highScore') || 0;
            if (score > highScore) {
                localStorage.setItem('highScore', score);

                newRecordText.style.display = 'block';

              
                createFireworks();

             
                setTimeout(() => {
                    newRecordText.style.display = 'none';
                }, 3000); 
            }
        }
    }
}, 10);


document.addEventListener('keydown', jump);


restartButton.addEventListener('click', startGame);
