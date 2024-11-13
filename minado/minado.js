document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 8; // Tamanho do tabuleiro
    let board = [];
    let score = 0;
    let level = 1;
    let timer = 60;
    let timerInterval;
    let revealedTiles = 0; // Contador de células reveladas
    const totalMines = 10; // Número de minas por nível

    const boardElement = document.getElementById('board');
    const levelElement = document.getElementById('level');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');

    // Função para criar o tabuleiro
    function createBoard() {
        boardElement.innerHTML = ''; // Limpar o tabuleiro

        // Reiniciar o tabuleiro para a fase atual
        board = Array(boardSize).fill().map(() => Array(boardSize).fill({ mine: false, revealed: false, adjacent: 0 }));

        // Colocar as minas
        let minesPlaced = 0;
        while (minesPlaced < totalMines) {
            const row = Math.floor(Math.random() * boardSize);
            const col = Math.floor(Math.random() * boardSize);
            if (!board[row][col].mine) {
                board[row][col].mine = true;
                minesPlaced++;
            }
        }

        // Contar as minas adjacentes
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (board[row][col].mine) continue;
                board[row][col].adjacent = countAdjacentMines(row, col);
            }
        }

        // Exibir o tabuleiro
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.setAttribute('data-row', row);
                tile.setAttribute('data-col', col);
                tile.addEventListener('click', () => handleTileClick(row, col));
                boardElement.appendChild(tile);
            }
        }

        boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 40px)`;
        boardElement.style.gridTemplateRows = `repeat(${boardSize}, 40px)`;
    }

    // Contar minas adjacentes
    function countAdjacentMines(row, col) {
        let count = 0;
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c].mine) {
                    count++;
                }
            }
        }
        return count;
    }

    // Lidar com o clique nas células
    function handleTileClick(row, col) {
        if (board[row][col].revealed) return; // Ignorar se a célula já foi revelada

        if (board[row][col].mine) {
            // O jogador clicou numa mina
            revealMines();
            alert('Você perdeu! Clique em OK para reiniciar.');
            resetGame();
            return;
        }

        revealTile(row, col);
        revealedTiles++;
        checkWinCondition();
    }

    // Revelar uma célula
    function revealTile(row, col) {
        const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        tile.classList.add('revealed');

        if (board[row][col].adjacent > 0) {
            tile.classList.add('number');
            tile.textContent = board[row][col].adjacent;
        }

        board[row][col].revealed = true;
    }

    // Revelar todas as minas
    function revealMines() {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (board[row][col].mine) {
                    const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    tile.classList.add('revealed', 'mine');
                }
            }
        }
    }

    // Verificar se o jogador ganhou
    function checkWinCondition() {
        if (revealedTiles === (boardSize * boardSize - totalMines)) {
            clearInterval(timerInterval);
            alert('Você ganhou! Parabéns!');
            nextLevel();
        }
    }

    // Iniciar o cronômetro
    function startTimer() {
        timerElement.textContent = timer;
        timerInterval = setInterval(() => {
            timer--;
            timerElement.textContent = timer;
            if (timer === 0) {
                clearInterval(timerInterval);
                alert('Tempo esgotado! Você perdeu!');
                resetGame();
            }
        }, 1000);
    }

    // Resetar o jogo
    function resetGame() {
        clearInterval(timerInterval);
        timer = 60;
        level = 1;
        score = 0;
        revealedTiles = 0;
        scoreElement.textContent = score;
        levelElement.textContent = level;
        startGame();
    }

    // Avançar para o próximo nível
    function nextLevel() {
        level++;
        score += 100; // Adiciona pontos por vencer a fase
        levelElement.textContent = level;
        scoreElement.textContent = score;
        totalMines += 2; // Aumenta o número de minas a cada nível
        startGame();
    }

    // Iniciar o jogo
    function startGame() {
        createBoard();
        startTimer();
    }

    // Inicializar o jogo
    startGame();
});
