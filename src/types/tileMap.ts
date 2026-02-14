/**
 * タイルマップのタイルタイプ
 * 0 = 何もない透過ブロック
 * 1 = 地面（プラットフォーム）
 * 2 = 敵
 * 3 = コイン
 * 4 = スター（ゴール）
 * 5 = プレイヤー初期位置
 */
export type TileType = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * タイルマップデータ
 * 2次元配列でマップを表現
 * [行][列] の形式
 */
export interface TileMapData {
  /** マップの幅（タイル数） */
  width: number;
  /** マップの高さ（タイル数） */
  height: number;
  /** タイルマップデータ（1次元配列または2次元配列） */
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
  /** プレイヤーの初期位置（タイル座標） */
  playerSpawn?: { tileX: number; tileY: number };
  /** 敵の初期位置リスト */
  enemySpawns?: EntitySpawn[];
  /** コインの初期位置リスト */
  coinSpawns?: EntitySpawn[];
  /** スター（ゴール）の初期位置 */
  starSpawn?: EntitySpawn;
}
