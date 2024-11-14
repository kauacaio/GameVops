import React from 'react';
import { Trophy } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  moves: number;
  targetScore: number;
  lastPoints?: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, moves, targetScore, lastPoints }) => {
  return (
    <div className="flex gap-6 items-center justify-center mb-6">
      <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm relative">
        <h3 className="text-white/60 text-sm mb-1">Score</h3>
        <p className="text-2xl font-bold text-white score-pop">{score}</p>
        {lastPoints > 0 && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold score-pop">
            +{lastPoints}
          </div>
        )}
      </div>
      <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
        <h3 className="text-white/60 text-sm mb-1">Moves Left</h3>
        <p className="text-2xl font-bold text-white">{moves}</p>
      </div>
      <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm flex items-center gap-2">
        <Trophy className="text-yellow-400 w-6 h-6" />
        <div>
          <h3 className="text-white/60 text-sm mb-1">Target</h3>
          <p className="text-2xl font-bold text-white">{targetScore}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;