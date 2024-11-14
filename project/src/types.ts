export type GemType = 'diamond' | 'circle' | 'square' | 'triangle' | 'star' | 'heart';

export interface Gem {
  type: GemType;
  id: string;
  isNew?: boolean;
  isMatched?: boolean;
}

export interface GameState {
  board: Gem[][];
  score: number;
  moves: number;
  targetScore: number;
  gameOver: boolean;
  won: boolean;
  lastPoints: number;
}