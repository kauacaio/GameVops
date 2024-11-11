// Função para exibir a maior pontuação salva
const displayHighScore = () => {
    const highScore = localStorage.getItem('highScore') || 0;
    document.querySelector('.high-score p').textContent = highScore;
};

// Função para iniciar o jogo
const startButton = document.querySelector('.start-btn');

startButton.addEventListener('click', () => {
    window.location.href = 'mario.html'; // Redireciona para a página do jogo
});

// Exibe a maior pontuação ao carregar a página
displayHighScore();
