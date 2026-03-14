import React, { useState, useCallback, useEffect } from 'react';
import { TileType, TileMapDefinition, EntitySpawn, TILE_TYPES } from '../types/tileMap';
import { loadTileMap } from '../engine/tileMap/tileMapLoader';
import { convert1DTo2DTiles } from '../engine/tileMap/tileMapConverter';

const TILE_TYPE_OPTIONS: { value: TileType; label: string; color: string }[] = [
  { value: 0, label: '空', color: 'transparent' },
  { value: 10, label: '地面', color: '#92400e' },
  { value: 11, label: 'ひび割れた床', color: '#78350f' },
  { value: 20, label: '敵', color: '#dc2626' },
  { value: 21, label: '危険な敵', color: '#9333ea' },
  { value: 30, label: 'コイン', color: '#fbbf24' },
  { value: 31, label: 'スター', color: '#f59e0b' },
  { value: 50, label: 'プレイヤー', color: '#3b82f6' },
  { value: 40, label: 'トゲ', color: '#4b5563' },
];

const DEFAULT_WIDTH = 125;
const DEFAULT_HEIGHT = 15;
const DEFAULT_TILE_SIZE = 40;
const TILE_DISPLAY_SIZE = 20; // エディターでの表示サイズ
const DEFAULT_BACKGROUND_COLOR = '#87ceeb'; // sky-300相当
const DEFAULT_PLATFORM_COLOR = '#92400e'; // orange-800相当

const MapEditor: React.FC = () => {
  const [selectedTileType, setSelectedTileType] = useState<TileType>(10);
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
  const [backgroundColor, setBackgroundColor] = useState<string>(DEFAULT_BACKGROUND_COLOR);
  const [platformColor, setPlatformColor] = useState<string>(DEFAULT_PLATFORM_COLOR);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 既存マップの読み込み
  const loadExistingMap = useCallback(() => {
    try {
      setIsLoading(true);
      const existingMap = loadTileMap();
      const { map, playerSpawn: ps, enemySpawns: es, coinSpawns: cs, starSpawn: ss, backgroundColor: bg, platformColor: pf } = existingMap;

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
      setBackgroundColor(bg || DEFAULT_BACKGROUND_COLOR);
      setPlatformColor(pf || DEFAULT_PLATFORM_COLOR);
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
      if (selectedTileType === TILE_TYPES.ENEMY.BASIC) { // 敵
        if (oldType === TILE_TYPES.ENEMY.BASIC) {
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
      } else if (selectedTileType === TILE_TYPES.ENEMY.DANGEROUS) { // 危険な敵
        if (oldType === TILE_TYPES.ENEMY.DANGEROUS) {
          // 既存の危険な敵を削除
          setEnemySpawns(prev => prev.filter(e => !(e.tileX === x && e.tileY === y)));
        } else {
          // 新しい危険な敵を追加
          const enemyId = `de-${enemySpawns.length + 1}`;
          setEnemySpawns(prev => [...prev, {
            id: enemyId,
            tileX: x,
            tileY: y,
            vel: { x: -2, y: 0 }
          }]);
        }
      } else if (selectedTileType === TILE_TYPES.COLLECTIBLE.COIN) { // コイン
        if (oldType === TILE_TYPES.COLLECTIBLE.COIN) {
          setCoinSpawns(prev => prev.filter(c => !(c.tileX === x && c.tileY === y)));
        } else {
          const coinId = `c-${coinSpawns.length}`;
          setCoinSpawns(prev => [...prev, {
            id: coinId,
            tileX: x,
            tileY: y
          }]);
        }
      } else if (selectedTileType === TILE_TYPES.COLLECTIBLE.STAR) { // スター
        if (oldType === TILE_TYPES.COLLECTIBLE.STAR) {
          setStarSpawn(null);
        } else {
          setStarSpawn({
            id: 'star-goal',
            tileX: x,
            tileY: y
          });
        }
      } else if (selectedTileType === TILE_TYPES.SPECIAL.PLAYER_SPAWN) { // プレイヤー
        setPlayerSpawn({ tileX: x, tileY: y });
      } else if (selectedTileType === TILE_TYPES.HAZARD.SPIKE) { // トゲ
        // トゲはSpawns情報が不要なので、タイルタイプだけを設定
      } else {
        // 他のタイルタイプに変更された場合、Spawns情報を削除
        if (oldType === TILE_TYPES.ENEMY.BASIC || oldType === TILE_TYPES.ENEMY.DANGEROUS) {
          setEnemySpawns(prev => prev.filter(e => !(e.tileX === x && e.tileY === y)));
        } else if (oldType === TILE_TYPES.COLLECTIBLE.COIN) {
          setCoinSpawns(prev => prev.filter(c => !(c.tileX === x && c.tileY === y)));
        } else if (oldType === TILE_TYPES.COLLECTIBLE.STAR) {
          setStarSpawn(prev => prev && prev.tileX === x && prev.tileY === y ? null : prev);
        } else if (oldType === TILE_TYPES.SPECIAL.PLAYER_SPAWN) {
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
      backgroundColor: backgroundColor !== DEFAULT_BACKGROUND_COLOR ? backgroundColor : undefined,
      platformColor: platformColor !== DEFAULT_PLATFORM_COLOR ? platformColor : undefined,
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
  }, [mapWidth, mapHeight, tileSize, tiles, playerSpawn, enemySpawns, coinSpawns, starSpawn, backgroundColor, platformColor]);

  // マップクリア
  const handleClear = useCallback(() => {
    if (confirm('マップをクリアしますか？')) {
      setTiles(Array(mapHeight).fill(null).map(() => Array(mapWidth).fill(0) as TileType[]));
      setPlayerSpawn(null);
      setEnemySpawns([]);
      setCoinSpawns([]);
      setStarSpawn(null);
      setBackgroundColor(DEFAULT_BACKGROUND_COLOR);
      setPlatformColor(DEFAULT_PLATFORM_COLOR);
    }
  }, [mapWidth, mapHeight]);

  return (
    <div className="w-full h-screen bg-gray-100 p-4 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">マップエディター</h1>

        {/* コントロールパネル */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* タイルタイプ選択 */}
            <div>
              <label className="block text-sm font-medium mb-2">タイルタイプ</label>
              <div className="grid grid-cols-3 gap-2">
                {TILE_TYPE_OPTIONS.map(type => (
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

            {/* 色設定 */}
            <div>
              <label className="block text-sm font-medium mb-2">色設定</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs block mb-1">背景色</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                      placeholder="#87ceeb"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs block mb-1">地面色</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={platformColor}
                      onChange={(e) => setPlatformColor(e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={platformColor}
                      onChange={(e) => setPlatformColor(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                      placeholder="#92400e"
                    />
                  </div>
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
                    const tileType = TILE_TYPE_OPTIONS.find(t => t.value === tile);
                    const isPlayerSpawn = playerSpawn && playerSpawn.tileX === x && playerSpawn.tileY === y;
                    const isEnemySpawn = enemySpawns.some(e => e.tileX === x && e.tileY === y);
                    const isCoinSpawn = coinSpawns.some(c => c.tileX === x && c.tileY === y);
                    const isStarSpawn = starSpawn && starSpawn.tileX === x && starSpawn.tileY === y;
                    const isSpike = tile === TILE_TYPES.HAZARD.SPIKE;

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
                        {isEnemySpawn && tile === TILE_TYPES.ENEMY.BASIC && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            E
                          </div>
                        )}
                        {/* 危険な敵スポーン表示 */}
                        {isEnemySpawn && tile === TILE_TYPES.ENEMY.DANGEROUS && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-yellow-300">
                            D
                          </div>
                        )}
                        {/* コインスポーン表示 */}
                        {isCoinSpawn && tile === TILE_TYPES.COLLECTIBLE.COIN && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
                            $
                          </div>
                        )}
                        {/* スタースポーン表示 */}
                        {isStarSpawn && tile === TILE_TYPES.COLLECTIBLE.STAR && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            ★
                          </div>
                        )}
                        {/* トゲ表示 */}
                        {isSpike && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-300">
                            ▲
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
            <div>
              <span className="font-medium">トゲ: </span>
              {tiles.flat().filter(t => t === TILE_TYPES.HAZARD.SPIKE).length}個
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapEditor;
