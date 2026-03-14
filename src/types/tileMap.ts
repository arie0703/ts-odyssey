/**
 * タイルマップのタイルタイプ（カテゴリ別範囲方式）
 * 
 * カテゴリ別範囲：
 * - 0: 空（何もない透過ブロック）
 * - 10-19: 地面系（10 = 通常の地面、11 = ひび割れた床）
 * - 20-29: 敵系（20 = 通常の敵）
 * - 30-39: アイテム系（30 = コイン、31 = スター）
 * - 40-49: 罠系（40 = トゲ）
 * - 50-59: 特殊系（50 = プレイヤー初期位置）
 */
export type TileType = 0 | 10 | 11 | 20 | 30 | 31 | 40 | 50;

/**
 * タイルカテゴリ
 */
export type TileCategory = 'EMPTY' | 'PLATFORM' | 'ENEMY' | 'COLLECTIBLE' | 'HAZARD' | 'SPECIAL';

/**
 * タイルタイプの定数定義
 */
export const TILE_TYPES = {
  EMPTY: 0,
  PLATFORM: {
    BASIC: 10,
    CRACKED: 11,
  },
  ENEMY: {
    BASIC: 20,
  },
  COLLECTIBLE: {
    COIN: 30,
    STAR: 31,
  },
  HAZARD: {
    SPIKE: 40,
  },
  SPECIAL: {
    PLAYER_SPAWN: 50,
  },
} as const;

/**
 * タイルのカテゴリを取得する
 */
export function getTileCategory(tile: number): TileCategory {
  if (tile === 0) return 'EMPTY';
  if (tile >= 10 && tile < 20) return 'PLATFORM';
  if (tile >= 20 && tile < 30) return 'ENEMY';
  if (tile >= 30 && tile < 40) return 'COLLECTIBLE';
  if (tile >= 40 && tile < 50) return 'HAZARD';
  if (tile >= 50 && tile < 60) return 'SPECIAL';
  return 'EMPTY';
}

/**
 * タイルマップデータ
 * 2次元配列でマップを表現
 * [行][列] の形式（tiles[y][x]）
 */
export interface TileMapData {
  /** マップの幅（タイル数） */
  width: number;
  /** マップの高さ（タイル数） */
  height: number;
  /** タイルマップデータ（2次元配列を推奨、1次元配列も後方互換性のためサポート） */
  tiles: TileType[] | TileType[][];
  /** タイルサイズ（ピクセル） */
  tileSize: number;
}

/**
 * エンティティの初期位置情報
 */
export interface EntitySpawn {
  /** タイルX座標 */
  tileX: number;
  /** タイルY座標 */
  tileY: number;
  /** エンティティID */
  id: string;
  /** 敵の場合の初期速度 */
  vel?: { x: number; y: number };
}

/**
 * タイルマップ定義
 */
export interface TileMapDefinition {
  /** タイルマップデータ */
  map: TileMapData;
  /** ステージの背景色（CSSカラー値、例: "#87ceeb" または "rgb(135, 206, 235)"） */
  backgroundColor?: string;
  /** 地面の色（CSSカラー値、例: "#92400e" または "rgb(146, 64, 14)"） */
  platformColor?: string;
  /** プレイヤーの初期位置（タイル座標） */
  playerSpawn?: { tileX: number; tileY: number };
  /** 敵の初期位置リスト */
  enemySpawns?: EntitySpawn[];
  /** コインの初期位置リスト */
  coinSpawns?: EntitySpawn[];
  /** スター（ゴール）の初期位置 */
  starSpawn?: EntitySpawn;
}
