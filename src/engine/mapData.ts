import { MapData } from '../types/mapData';
import { TILE_SIZE, VIEWPORT_HEIGHT, WORLD_WIDTH } from '../constants';

/**
 * デフォルトマップデータ
 * このファイルを編集することで、マップの構成を変更できます
 */
export const defaultMapData: MapData = {
  // 基本床のパターン
  // 120個のタイルを生成し、15個ごとに10番目と11番目をスキップ（穴を作る）
  floorPattern: {
    tileCount: 120,
    gapInterval: 15,
    gapPositions: [10, 11]
  },

  // 中間プラットフォーム
  platforms: [
    { id: 'p-mid-1', pos: { x: 400, y: 400 }, size: { x: 120, y: 20 } },
    { id: 'p-mid-2', pos: { x: 700, y: 300 }, size: { x: 120, y: 20 } },
    { id: 'p-mid-3', pos: { x: 1200, y: 350 }, size: { x: 200, y: 20 } }
  ],

  // 敵の配置
  enemies: [
    { id: 'e1', pos: { x: 600, y: 500 }, size: { x: 40, y: 40 }, vel: { x: -2, y: 0 } },
    { id: 'e2', pos: { x: 1200, y: 500 }, size: { x: 40, y: 40 }, vel: { x: -1.5, y: 0 } },
    { id: 'e3', pos: { x: 2000, y: 500 }, size: { x: 40, y: 40 }, vel: { x: -2.5, y: 0 } }
  ],

  // コインの配置
  // 15個のコインを、x: 500 + i * 300, y: 400 - (i % 3) * 50 の位置に配置
  coins: Array.from({ length: 15 }).map((_, i) => ({
    id: `c-${i}`,
    pos: { x: 500 + i * 300, y: 400 - (i % 3) * 50 },
    size: { x: 25, y: 25 }
  })),

  // スター（ゴール）の配置
  star: {
    id: 'star-goal',
    pos: { x: WORLD_WIDTH - 200, y: 500 },
    size: { x: 50, y: 50 }
  }
};
