import { Vector2D } from './types';

/**
 * プラットフォームの定義
 */
export interface PlatformDefinition {
  id: string;
  pos: Vector2D;
  size: Vector2D;
}

/**
 * 基本床のパターン定義
 */
export interface FloorPattern {
  /** タイルの総数 */
  tileCount: number;
  /** 穴を作る間隔（例: 15個ごと） */
  gapInterval: number;
  /** 穴の位置（間隔内での位置、例: [10, 11]） */
  gapPositions: number[];
}

/**
 * 敵の定義
 */
export interface EnemyDefinition {
  id: string;
  pos: Vector2D;
  size: Vector2D;
  /** 初期速度 */
  vel: Vector2D;
}

/**
 * コインの定義
 */
export interface CoinDefinition {
  id: string;
  pos: Vector2D;
  size: Vector2D;
}

/**
 * スター（ゴール）の定義
 */
export interface StarDefinition {
  id: string;
  pos: Vector2D;
  size: Vector2D;
}

/**
 * マップデータの定義
 */
export interface MapData {
  /** 基本床のパターン */
  floorPattern: FloorPattern;
  /** 中間プラットフォーム */
  platforms: PlatformDefinition[];
  /** 敵 */
  enemies: EnemyDefinition[];
  /** コイン */
  coins: CoinDefinition[];
  /** スター（ゴール） */
  star: StarDefinition;
}
