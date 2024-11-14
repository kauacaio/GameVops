import React from 'react';
import { Gem } from '../types';
import GemTile from './GemTile';

interface BoardProps {
  board: Gem[][];
  selectedTile: { row: number; col: number } | null;
  onTileClick: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, selectedTile, onTileClick }) => {
  return (
    <div className="grid gap-1 p-4 bg-purple-900/20 rounded-lg backdrop-blur-sm">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((gem, colIndex) => (
            <GemTile
              key={`${rowIndex}-${colIndex}`}
              gem={gem}
              isSelected={selectedTile?.row === rowIndex && selectedTile?.col === colIndex}
              isMatched={gem.isMatched}
              isNew={gem.isNew}
              onClick={() => onTileClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;