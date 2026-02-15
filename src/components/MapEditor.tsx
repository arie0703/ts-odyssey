import React, { useState, useCallback, useEffect } from 'react';
import { TileType, TileMapDefinition, EntitySpawn } from '../types/tileMap';
import { loadTileMap } from '../engine/tileMap/tileMapLoader';
import { convert1DTo2DTiles } from '../engine/tileMap/tileMapConverter';

const TILE_TYPES: { value: TileType; label: string; color: string }[] = [
  { value: 0, label: '空', color: 'transparent' },
  { value: 1, label: '地面', color: '#92400e' },
  { value: 2, label: '敵', color: '#dc2626' },
  { value: 3, label: 'コイン', color: '#fbbf24' },
  { value: 4, label: 'スター', color: '#f59e0b' },
  { value: 5, label: 'プレイヤー', color: '#3b82f6' },
];

const DEFAULT_WIDTH = 125;
const DEFAULT_HEIGHT = 15;
const DEFAULT_TILE_SIZE = 40;
const TILE_DISPLAY_SIZE = 20; // エディターでの表示サイズ

const MapEditor: React.FC = () => {
  const [selectedTileType, setSelectedTileType] = useState<TileType>(1);
  const [mapWidth, setMapWidth] = useState(DEFAULT_WIDTH);
  const [mapHeight, setMapHeight] = useState(DEFAULT_HEIGHT);
  const [tileSize, setTileSize] = useState(DEFAULT_TILE_SIZE);
  const [tiles, setTiles] = useState<TileType[][]>(() => {
    // 初期マップを空で作成
    return Array(mapHeight).fill(null).map(() => Array(mapWidth).fill(0) as TileType[]);
  });
  const [playerSpawn, setPlayerSpawn] = useState<{ tileX: number; tileY: number } | null>(null);
  const [enemySpawns, setEnemySpawns] = useState<EntitySpawn[]>([]);
  const [coinSpawns, setCoinSpawns] = useState<EntitySpawn[]>([]);
  const [starSpawn, setStarSpawn] = useState<EntitySpawn | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 既存マップの読み込み
  const loadExistingMap = useCallback(() => {
    try {
      setIsLoading(true);
      const existingMap = loadTileMap();
      const { map, playerSpawn: ps, enemySpawns: es, coinSpawns: cs, starSpawn: ss } = existingMap;

      // タイル配列を2次元配列に変換
      const tiles2D = Array.isArray(map.tiles[0])
        ? (map.tiles as TileType[][])
        : convert1DTo2DTiles(map.tiles as TileType[], map.width, map.height);

      setMapWidth(map.width);
      setMapHeight(map.height);
      setTileSize(map.tileSize);
      setTiles(tiles2D);
      setPlayerSpawn(ps || null);
      setEnemySpawns(es || []);
      setCoinSpawns(cs || []);
      setStarSpawn(ss || null);
    } catch (error) {
      console.error('マップの読み込みに失敗しました:', error);
      alert('マップの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // マップサイズの変更
  useEffect(() => {
    setTiles(prev => {
      const newTiles: TileType[][] = Array(mapHeight).fill(null).map((_, y) => {
        if (y < prev.length) {
          const oldRow = prev[y];
          return Array(mapWidth).fill(null).map((_, x) => {
            return x < oldRow.length ? oldRow[x] : 0;
          }) as TileType[];
        }
        return Array(mapWidth).fill(0) as TileType[];
      });
      return newTiles;
    });
  }, [mapWidth, mapHeight]);

  // タイルの配置
  const handleTileClick = useCallback((x: number, y: number) => {
    setTiles(prev => {
      const newTiles = prev.map(row => [...row]);
      const oldType = newTiles[y][x];
      newTiles[y][x] = selectedTileType;

      // Spawns情報の更新
      if (selectedTileType === 2) { // 敵
        if (oldType === 2) {
          // 既存の敵を削除
          setEnemySpawns(prev => prev.filter(e => !(e.tileX === x && e.tileY === y)));
        } else {
          // 新しい敵を追加
          const enemyId = `e-${enemySpawns.length + 1}`;
          setEnemySpawns(prev => [...prev, {
            id: enemyId,
            tileX: x,
            tileY: y,
            vel: { x: -2, y: 0 }
          }]);
        }
      } else if (selectedTileType === 3) { // コイン
        if (oldType === 3) {
          setCoinSpawns(prev => prev.filter(c => !(c.tileX === x && c.tileY === y)));
        } else {
          const coinId = `c-${coinSpawns.length}`;
          setCoinSpawns(prev => [...prev, {
            id: coinId,
            tileX: x,
            tileY: y
          }]);
        }
      } else if (selectedTileType === 4) { // スター
        if (oldType === 4) {
          setStarSpawn(null);
        } else {
          setStarSpawn({
            id: 'star-goal',
            tileX: x,
            tileY: y
          });
        }
      } else if (selectedTileType === 5) { // プレイヤー
        setPlayerSpawn({ tileX: x, tileY: y });
      } else {
        // 他のタイルタイプに変更された場合、Spawns情報を削除
        if (oldType === 2) {
          setEnemySpawns(prev => prev.filter(e => !(e.tileX === x && e.tileY === y)));
        } else if (oldType === 3) {
          setCoinSpawns(prev => prev.filter(c => !(c.tileX === x && c.tileY === y)));
        } else if (oldType === 4) {
          setStarSpawn(prev => prev && prev.tileX === x && prev.tileY === y ? null : prev);
        } else if (oldType === 5) {
          setPlayerSpawn(prev => prev && prev.tileX === x && prev.tileY === y ? null : prev);
        }
      }

      return newTiles;
    });
  }, [selectedTileType, enemySpawns.length, coinSpawns.length]);

  // マウスドラッグ処理
  const handleMouseDown = useCallback((x: number, y: number) => {
    setIsDragging(true);
    handleTileClick(x, y);
  }, [handleTileClick]);

  const handleMouseMove = useCallback((x: number, y: number) => {
    if (isDragging) {
      handleTileClick(x, y);
    }
  }, [isDragging, handleTileClick]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // JSON出力
  const handleExport = useCallback(() => {
    const mapData: TileMapDefinition = {
      map: {
        width: mapWidth,
        height: mapHeight,
        tileSize: tileSize,
        tiles: tiles
      },
      playerSpawn: playerSpawn || undefined,
      enemySpawns: enemySpawns.length > 0 ? enemySpawns : undefined,
      coinSpawns: coinSpawns.length > 0 ? coinSpawns : undefined,
      starSpawn: starSpawn || undefined
    };

    const jsonString = JSON.stringify(mapData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tileMap_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [mapWidth, mapHeight, tileSize, tiles, playerSpawn, enemySpawns, coinSpawns, starSpawn]);

  // マップクリア
  const handleClear = useCallback(() => {
    if (confirm('マップをクリアしますか？')) {
      setTiles(Array(mapHeight).fill(null).map(() => Array(mapWidth).fill(0) as TileType[]));
      setPlayerSpawn(null);
      setEnemySpawns([]);
      setCoinSpawns([]);
      setStarSpawn(null);
    }
  }, [mapWidth, mapHeight]);

  return (
    <div className="w-full h-screen bg-gray-100 p-4 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">マップエディター</h1>

        {/* コントロールパネル */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* タイルタイプ選択 */}
            <div>
              <label className="block text-sm font-medium mb-2">タイルタイプ</label>
              <div className="grid grid-cols-3 gap-2">
                {TILE_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedTileType(type.value)}
                    className={`p-2 rounded border-2 transition ${
                      selectedTileType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: type.value === selectedTileType ? type.color + '20' : 'white' }}
                  >
                    <div
                      className="w-full h-8 rounded mb-1 border"
                      style={{ backgroundColor: type.color }}
                    />
                    <div className="text-xs">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* マップサイズ設定 */}
            <div>
              <label className="block text-sm font-medium mb-2">マップサイズ</label>
              <div className="space-y-2">
                <div>
                  <label className="text-xs">幅: {mapWidth}</label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={mapWidth}
                    onChange={(e) => setMapWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs">高さ: {mapHeight}</label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={mapHeight}
                    onChange={(e) => setMapHeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs">タイルサイズ: {tileSize}px</label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="10"
                    value={tileSize}
                    onChange={(e) => setTileSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div>
              <label className="block text-sm font-medium mb-2">操作</label>
              <div className="space-y-2">
                <button
                  onClick={loadExistingMap}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? '読み込み中...' : '既存マップ読み込み'}
                </button>
                <button
                  onClick={handleClear}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  クリア
                </button>
                <button
                  onClick={handleExport}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  JSON出力
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* マップ表示 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="overflow-auto">
            <div
              className="inline-block border-2 border-gray-300"
              onMouseLeave={handleMouseUp}
            >
              {tiles.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((tile, x) => {
                    const tileType = TILE_TYPES.find(t => t.value === tile);
                    const isPlayerSpawn = playerSpawn && playerSpawn.tileX === x && playerSpawn.tileY === y;
                    const isEnemySpawn = enemySpawns.some(e => e.tileX === x && e.tileY === y);
                    const isCoinSpawn = coinSpawns.some(c => c.tileX === x && c.tileY === y);
                    const isStarSpawn = starSpawn && starSpawn.tileX === x && starSpawn.tileY === y;

                    return (
                      <div
                        key={`${x}-${y}`}
                        className="border border-gray-200 cursor-pointer hover:opacity-80 transition"
                        style={{
                          width: TILE_DISPLAY_SIZE,
                          height: TILE_DISPLAY_SIZE,
                          backgroundColor: tileType?.color || 'transparent',
                          position: 'relative'
                        }}
                        onMouseDown={() => handleMouseDown(x, y)}
                        onMouseMove={() => handleMouseMove(x, y)}
                        onMouseUp={handleMouseUp}
                        title={`(${x}, ${y}) - ${tileType?.label || '不明'}`}
                      >
                        {/* プレイヤースポーン表示 */}
                        {isPlayerSpawn && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            P
                          </div>
                        )}
                        {/* 敵スポーン表示 */}
                        {isEnemySpawn && tile === 2 && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            E
                          </div>
                        )}
                        {/* コインスポーン表示 */}
                        {isCoinSpawn && tile === 3 && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
                            $
                          </div>
                        )}
                        {/* スタースポーン表示 */}
                        {isStarSpawn && tile === 4 && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            ★
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 情報表示 */}
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold mb-2">マップ情報</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">サイズ: </span>
              {mapWidth} × {mapHeight}
            </div>
            <div>
              <span className="font-medium">タイルサイズ: </span>
              {tileSize}px
            </div>
            <div>
              <span className="font-medium">プレイヤー: </span>
              {playerSpawn ? `(${playerSpawn.tileX}, ${playerSpawn.tileY})` : '未設定'}
            </div>
            <div>
              <span className="font-medium">敵: </span>
              {enemySpawns.length}体
            </div>
            <div>
              <span className="font-medium">コイン: </span>
              {coinSpawns.length}個
            </div>
            <div>
              <span className="font-medium">スター: </span>
              {starSpawn ? `(${starSpawn.tileX}, ${starSpawn.tileY})` : '未設定'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapEditor;
