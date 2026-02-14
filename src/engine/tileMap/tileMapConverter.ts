import { TileType } from '../../types/tileMap';

/**
 * 1次元配列を2次元配列に変換する（後方互換性のため）
 * @param tiles1d 1次元配列のタイルデータ
 * @param width マップの幅（タイル数）
 * @param height マップの高さ（タイル数）
 * @returns 2次元配列のタイルデータ
 */
export function convert1DTo2DTiles(
  tiles1d: TileType[],
  width: number,
  height: number
): TileType[][] {
  const tiles2d: TileType[][] = [];
  for (let y = 0; y < height; y++) {
    const row: TileType[] = [];
    for (let x = 0; x < width; x++) {
      row.push(tiles1d[y * width + x]);
    }
    tiles2d.push(row);
  }
  return tiles2d;
}
