import { TileMapDefinition, TileType } from '../../types/tileMap';
import { Entity } from '../../types';
import { TILE_SIZE, VIEWPORT_HEIGHT } from '../../constants';
import tileMapJson from './tileMap.json';
import { convert1DTo2DTiles } from './tileMapConverter';

/**
 * タイルマップデータを読み込む
 */
export function loadTileMap(): TileMapDefinition {
  return tileMapJson as TileMapDefinition;
}

/**
 * タイルマップからエンティティを生成する
 */
export function createEntitiesFromTileMap(): {
  platforms: Entity[];
  enemies: Entity[];
  coins: Entity[];
  star: Entity | null;
  playerSpawn: { x: number; y: number };
} {
  const tileMap = loadTileMap();
  const { map, enemySpawns = [], coinSpawns = [], starSpawn, playerSpawn } = tileMap;

  // タイル配列を2次元配列として扱う
  const tiles = Array.isArray(map.tiles[0])
    ? (map.tiles as number[][])
    : convert1DTo2DTiles(map.tiles as TileType[], map.width, map.height);

  const platforms: Entity[] = [];
  const enemies: Entity[] = [];
  const coins: Entity[] = [];
  let star: Entity | null = null;

  // Spawns情報を位置でマップ化（速度などの追加情報を取得するため）
  const enemySpawnMap = new Map<string, typeof enemySpawns[0]>();
  enemySpawns.forEach(spawn => {
    const key = `${spawn.tileX},${spawn.tileY}`;
    enemySpawnMap.set(key, spawn);
  });

  const coinSpawnMap = new Map<string, typeof coinSpawns[0]>();
  coinSpawns.forEach(spawn => {
    const key = `${spawn.tileX},${spawn.tileY}`;
    coinSpawnMap.set(key, spawn);
  });

  // タイルマップを走査してエンティティを生成
  let enemyIndex = 0;
  let coinIndex = 0;
  
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tile = tiles[y][x];
      const pixelX = x * map.tileSize;
      const pixelY = y * map.tileSize;

      switch (tile) {
        case 1: // 地面
          platforms.push({
            id: `p-${x}-${y}`,
            type: 'PLATFORM',
            pos: { x: pixelX, y: pixelY },
            size: { x: map.tileSize, y: map.tileSize },
            vel: { x: 0, y: 0 }
          });
          break;
        case 2: // 敵（タイルマップ内の位置から生成）
          {
            const key = `${x},${y}`;
            const spawnInfo = enemySpawnMap.get(key);
            enemies.push({
              id: spawnInfo?.id || `e-${enemyIndex++}`,
              type: 'ENEMY',
              pos: { x: pixelX, y: pixelY },
              size: { x: 40, y: 40 },
              vel: spawnInfo?.vel || { x: -2, y: 0 },
              isDead: false
            });
          }
          break;
        case 3: // コイン（タイルマップ内の位置から生成）
          {
            const key = `${x},${y}`;
            const spawnInfo = coinSpawnMap.get(key);
            coins.push({
              id: spawnInfo?.id || `c-${coinIndex++}`,
              type: 'COIN',
              pos: { x: pixelX, y: pixelY },
              size: { x: 25, y: 25 },
              vel: { x: 0, y: 0 },
              isCollected: false
            });
          }
          break;
        case 4: // スター（タイルマップ内の位置から生成）
          {
            if (!star) {
              const key = `${x},${y}`;
              const spawnInfo = starSpawn && `${starSpawn.tileX},${starSpawn.tileY}` === key
                ? starSpawn
                : null;
              star = {
                id: spawnInfo?.id || 'star-goal',
                type: 'STAR',
                pos: { x: pixelX, y: pixelY },
                size: { x: 50, y: 50 },
                vel: { x: 0, y: 0 }
              };
            }
          }
          break;
      }
    }
  }

  // プレイヤーの初期位置
  const playerSpawnPos = playerSpawn
    ? {
        x: playerSpawn.tileX * map.tileSize,
        y: playerSpawn.tileY * map.tileSize
      }
    : { x: 100, y: VIEWPORT_HEIGHT - TILE_SIZE - 100 };

  return {
    platforms,
    enemies,
    coins,
    star,
    playerSpawn: playerSpawnPos
  };
}
