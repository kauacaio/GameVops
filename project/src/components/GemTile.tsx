import React from 'react';
import { Diamond, Circle, Square, Triangle, Star, Heart } from 'lucide-react';
import { Gem } from '../types';

interface GemTileProps {
  gem: Gem;
  isSelected: boolean;
  isMatched?: boolean;
  isNew?: boolean;
  onClick: () => void;
}

const GemTile: React.FC<GemTileProps> = ({ 
  gem, 
  isSelected, 
  isMatched = false,
  isNew = false,
  onClick 
}) => {
  const gemComponents = {
    diamond: Diamond,
    circle: Circle,
    square: Square,
    triangle: Triangle,
    star: Star,
    heart: Heart,
  };

  const GemIcon = gemComponents[gem.type];
  const colors = {
    diamond: 'text-blue-400',
    circle: 'text-red-400',
    square: 'text-green-400',
    triangle: 'text-yellow-400',
    star: 'text-purple-400',
    heart: 'text-pink-400',
  };

  const animationClasses = [
    isSelected && 'gem-selected',
    isMatched && 'gem-matched',
    isNew && 'gem-new',
    'gem-swapping'
  ].filter(Boolean).join(' ');

  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 flex items-center justify-center rounded-lg transition-all duration-200 ${
        isSelected
          ? 'bg-white/20 scale-95'
          : 'bg-white/10 hover:bg-white/15'
      } ${animationClasses}`}
    >
      <GemIcon
        className={`w-8 h-8 ${colors[gem.type]} transition-transform ${
          isSelected ? 'scale-110' : ''
        }`}
      />
    </button>
  );
};

export default GemTile;