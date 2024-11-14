import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import { Sparkles, RotateCcw } from 'lucide-react';

function App() {
  const { gameState, selectedTile, handleTileClick, resetGame } = useGameLogic();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2342')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            Gem Crush
          </h1>
          <p className="text-white/60">Match 3 or more gems to score points!</p>
        </div>

        <ScoreBoard
          score={gameState.score}
          moves={gameState.moves}
          targetScore={gameState.targetScore}
          lastPoints={gameState.lastPoints}
        />

        <Board
          board={gameState.board}
          selectedTile={selectedTile}
          onTileClick={handleTileClick}
        />

        {(gameState.gameOver || gameState.won) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                {gameState.won ? 'Congratulations!' : 'Game Over'}
              </h2>
              <p className="text-white/80 mb-6">
                {gameState.won
                  ? `You reached the target score of ${gameState.targetScore}!`
                  : `Final score: ${gameState.score}`}
              </p>
              <button
                onClick={resetGame}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;