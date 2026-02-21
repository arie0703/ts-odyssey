
export type EntityType = 'PLAYER' | 'ENEMY' | 'COIN' | 'PLATFORM' | 'STAR';

export interface Vector2D {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  type: EntityType;
  pos: Vector2D;
  size: Vector2D;
  vel: Vector2D;
  isDead?: boolean;
  isCollected?: boolean;
}

export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAMEOVER = 'GAMEOVER',
  CLEAR = 'CLEAR'
}

export interface GameState {
  player: Entity & { 
    life: number; 
    score: number;
    isHurt?: boolean;
  };
  enemies: Entity[];
  coins: Entity[];
  platforms: Entity[];
  star: Entity | null;
  viewportX: number;
  status: GameStatus;
}
