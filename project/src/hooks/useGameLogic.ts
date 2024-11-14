import { useState, useCallback, useEffect } from 'react';
import { Gem, GemType, GameState } from '../types';
import useSound from 'use-sound';

const BOARD_SIZE = 8;
const MATCH_MIN = 3;
const GEM_TYPES: GemType[] = ['diamond', 'circle', 'square', 'triangle', 'star', 'heart'];

const createGem = (isNew = false): Gem => ({
  type: GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)],
  id: Math.random().toString(36).substr(2, 9),
  isNew,
  isMatched: false
});

const createBoard = (): Gem[][] => {
  const board: Gem[][] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = createGem();
    }
  }
  return board;
};

const initialState: GameState = {
  board: createBoard(),
  score: 0,
  moves: 30,
  targetScore: 1000,
  gameOver: false,
  won: false,
  lastPoints: 0
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [playMatch] = useSound('https://assets.mixkit.co/active_storage/sfx/2019/match-success.wav', { volume: 0.5 });
  const [playSwap] = useSound('https://assets.mixkit.co/active_storage/sfx/2020/swap-gems.wav', { volume: 0.5 });

  const checkMatches = useCallback((board: Gem[][]) => {
    const matches: Set<string> = new Set();

    // Check horizontal matches
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j <= BOARD_SIZE - MATCH_MIN; j++) {
        const gem = board[i][j].type;
        let matchLength = 1;
        
        for (let k = 1; k < BOARD_SIZE - j; k++) {
          if (board[i][j + k].type === gem) {
            matchLength++;
          } else {
            break;
          }
        }

        if (matchLength >= MATCH_MIN) {
          for (let k = 0; k < matchLength; k++) {
            matches.add(`${i}-${j + k}`);
          }
        }
      }
    }

    // Check vertical matches
    for (let j = 0; j < BOARD_SIZE; j++) {
      for (let i = 0; i <= BOARD_SIZE - MATCH_MIN; i++) {
        const gem = board[i][j].type;
        let matchLength = 1;
        
        for (let k = 1; k < BOARD_SIZE - i; k++) {
          if (board[i + k][j].type === gem) {
            matchLength++;
          } else {
            break;
          }
        }

        if (matchLength >= MATCH_MIN) {
          for (let k = 0; k < matchLength; k++) {
            matches.add(`${i + k}-${j}`);
          }
        }
      }
    }

    return matches;
  }, []);

  const removeMatches = useCallback((matches: Set<string>, board: Gem[][]) => {
    // First mark matched gems
    const newBoard = board.map(row => row.map(gem => ({...gem})));
    matches.forEach((match) => {
      const [row, col] = match.split('-').map(Number);
      newBoard[row][col].isMatched = true;
    });

    setGameState(prev => ({
      ...prev,
      board: newBoard,
    }));

    // After animation, remove matches and drop gems
    setTimeout(() => {
      matches.forEach((match) => {
        const [row, col] = match.split('-').map(Number);
        // Move all gems above down
        for (let i = row; i > 0; i--) {
          newBoard[i][col] = {...newBoard[i - 1][col], isNew: false};
        }
        // Add new gem at top
        newBoard[0][col] = createGem(true);
      });

      setGameState(prev => ({
        ...prev,
        board: newBoard,
      }));

      // Clear new gem flags after animation
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          board: prev.board.map(row => 
            row.map(gem => ({...gem, isNew: false}))
          )
        }));
        setIsProcessing(false);
      }, 300);
    }, 300);

    return newBoard;
  }, []);

  const handleTileClick = useCallback((row: number, col: number) => {
    if (gameState.gameOver || isProcessing) return;

    if (!selectedTile) {
      setSelectedTile({ row, col });
      return;
    }

    // Check if clicked tile is adjacent to selected tile
    const rowDiff = Math.abs(selectedTile.row - row);
    const colDiff = Math.abs(selectedTile.col - col);
    
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      setIsProcessing(true);
      
      // Create a deep copy of the board
      const newBoard = gameState.board.map(row => row.map(gem => ({...gem})));
      
      // Swap gems
      [newBoard[selectedTile.row][selectedTile.col], newBoard[row][col]] = 
      [newBoard[row][col], newBoard[selectedTile.row][selectedTile.col]];

      playSwap();

      // Update board immediately for visual feedback
      setGameState(prev => ({
        ...prev,
        board: newBoard
      }));

      const matches = checkMatches(newBoard);
      if (matches.size > 0) {
        playMatch();
        const updatedBoard = removeMatches(matches, newBoard);
        const points = matches.size * 10;

        setGameState(prev => ({
          ...prev,
          board: updatedBoard,
          score: prev.score + points,
          lastPoints: points,
          moves: prev.moves - 1,
          gameOver: prev.moves <= 1,
          won: prev.score + points >= prev.targetScore,
        }));

        setTimeout(() => {
          setGameState(prev => ({...prev, lastPoints: 0}));
        }, 1000);
      } else {
        // Swap back if no matches
        [newBoard[selectedTile.row][selectedTile.col], newBoard[row][col]] = 
        [newBoard[row][col], newBoard[selectedTile.row][selectedTile.col]];
        
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            board: newBoard
          }));
          setIsProcessing(false);
        }, 300);
      }
    }
    
    setSelectedTile(null);
  }, [selectedTile, gameState, isProcessing, checkMatches, removeMatches, playMatch, playSwap]);

  const resetGame = useCallback(() => {
    setGameState({
      ...initialState,
      board: createBoard()
    });
    setSelectedTile(null);
    setIsProcessing(false);
  }, []);

  // Check for matches after board updates
  useEffect(() => {
    if (gameState.gameOver || isProcessing) return;

    const matches = checkMatches(gameState.board);
    if (matches.size > 0) {
      setIsProcessing(true);
      playMatch();
      const updatedBoard = removeMatches(matches, gameState.board);
      const points = matches.size * 10;
      
      setGameState(prev => ({
        ...prev,
        board: updatedBoard,
        score: prev.score + points,
        lastPoints: points,
        won: prev.score + points >= prev.targetScore,
      }));

      setTimeout(() => {
        setGameState(prev => ({...prev, lastPoints: 0}));
      }, 1000);
    }
  }, [gameState.board, gameState.gameOver, isProcessing, checkMatches, removeMatches, playMatch]);

  return {
    gameState,
    selectedTile,
    handleTileClick,
    resetGame,
  };
};