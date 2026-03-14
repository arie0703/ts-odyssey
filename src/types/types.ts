
export type EntityType = 'PLAYER' | 'ENEMY' | 'DANGEROUS_ENEMY' | 'COIN' | 'PLATFORM' | 'CRACKED_PLATFORM' | 'STAR' | 'SPIKE';

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
  // ひび割れた床用のプロパティ
  isCracked?: boolean;        // ひび割れ状態かどうか
  crackTimer?: number;        // 消滅までのタイマー（ミリ秒）
  isDestroyed?: boolean;      // 消滅済みかどうか
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
  spikes: Entity[];
  viewportX: number;
  status: GameStatus;
  backgroundColor: string;
  platformColor: string;
}
