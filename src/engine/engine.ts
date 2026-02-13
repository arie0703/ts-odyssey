
import { GameState, GameStatus, Entity } from '../types';
import { 
  TILE_SIZE, GRAVITY, JUMP_FORCE, MOVE_SPEED, 
  VIEWPORT_HEIGHT, WORLD_WIDTH, INITIAL_LIFE 
} from '../constants';
import { defaultMapData } from './mapData';

/**
 * マップデータからエンティティを生成する
 */
function createEntitiesFromMapData() {
  const mapData = defaultMapData;

  // 基本床の生成
  const floorPlatforms: Entity[] = Array.from({ length: mapData.floorPattern.tileCount })
    .map((_, i) => {
      // 間隔内での位置を計算（例: 15個ごとに10番目と11番目をスキップ）
      const positionInInterval = i % mapData.floorPattern.gapInterval;
      if (mapData.floorPattern.gapPositions.includes(positionInInterval)) {
        return null; // 穴を作る
      }
      return {
        id: `p-${i}`,
        type: 'PLATFORM' as const,
        pos: { x: i * TILE_SIZE, y: VIEWPORT_HEIGHT - TILE_SIZE },
        size: { x: TILE_SIZE, y: TILE_SIZE },
        vel: { x: 0, y: 0 }
      } as Entity;
    })
    .filter((p): p is Entity => p !== null);

  // 中間プラットフォームの生成
  const midPlatforms: Entity[] = mapData.platforms.map(platform => ({
    id: platform.id,
    type: 'PLATFORM' as const,
    pos: platform.pos,
    size: platform.size,
    vel: { x: 0, y: 0 }
  }));

  // 敵の生成
  const enemies: Entity[] = mapData.enemies.map(enemy => ({
    id: enemy.id,
    type: 'ENEMY' as const,
    pos: enemy.pos,
    size: enemy.size,
    vel: enemy.vel,
    isDead: false
  }));

  // コインの生成
  const coins: Entity[] = mapData.coins.map(coin => ({
    id: coin.id,
    type: 'COIN' as const,
    pos: coin.pos,
    size: coin.size,
    vel: { x: 0, y: 0 },
    isCollected: false
  }));

  // スターの生成
  const star: Entity = {
    id: mapData.star.id,
    type: 'STAR' as const,
    pos: mapData.star.pos,
    size: mapData.star.size,
    vel: { x: 0, y: 0 }
  };

  return {
    platforms: [...floorPlatforms, ...midPlatforms],
    enemies,
    coins,
    star
  };
}

export function createInitialState(): GameState {
  const { platforms, enemies, coins, star } = createEntitiesFromMapData();

  return {
    player: {
      id: 'player',
      type: 'PLAYER',
      pos: { x: 100, y: 500 },
      size: { x: 32, y: 48 },
      vel: { x: 0, y: 0 },
      life: INITIAL_LIFE,
      score: 0,
      isHurt: false
    },
    platforms,
    enemies,
    coins,
    star,
    viewportX: 0,
    status: GameStatus.START
  };
}

export function checkCollision(a: { pos: { x: number, y: number }, size: { x: number, y: number } }, b: { pos: { x: number, y: number }, size: { x: number, y: number } }): boolean {
  return (
    a.pos.x < b.pos.x + b.size.x &&
    a.pos.x + a.size.x > b.pos.x &&
    a.pos.y < b.pos.y + b.size.y &&
    a.pos.y + a.size.y > b.pos.y
  );
}

export function updateState(
  prev: GameState, 
  keys: { [key: string]: boolean }, 
  onDamage: (isFall: boolean) => void
): GameState {
  if (prev.status !== GameStatus.PLAYING) return prev;

  const newState = JSON.parse(JSON.stringify(prev)) as GameState;
  const { player } = newState;

  // 1. 入力
  if (keys['ArrowLeft']) player.vel.x = -MOVE_SPEED;
  else if (keys['ArrowRight']) player.vel.x = MOVE_SPEED;
  else player.vel.x = 0;

  if (keys[' '] && player.vel.y === 0) {
    player.vel.y = JUMP_FORCE;
  }

  // 2. 物理
  player.vel.y += GRAVITY;
  player.pos.x += player.vel.x;
  player.pos.y += player.vel.y;

  // 3. 足場衝突
  newState.platforms.forEach(p => {
    if (checkCollision(player, p)) {
      if (player.vel.y > 0 && player.pos.y + player.size.y - player.vel.y <= p.pos.y + 5) {
        player.pos.y = p.pos.y - player.size.y;
        player.vel.y = 0;
      } else if (player.vel.y < 0 && player.pos.y - player.vel.y >= p.pos.y + p.size.y - 5) {
        player.pos.y = p.pos.y + p.size.y;
        player.vel.y = 1;
      }
    }
  });

  // 4. 落下
  if (player.pos.y > VIEWPORT_HEIGHT) {
    onDamage(true);
    return prev; // App.tsx側のhandleDamageで状態が更新されるため
  }

  // 5. 敵
  newState.enemies = newState.enemies.map(enemy => {
    if (enemy.isDead) return enemy;
    enemy.pos.x += enemy.vel.x;
    if (enemy.pos.x < 0 || enemy.pos.x > WORLD_WIDTH) enemy.vel.x *= -1;

    if (checkCollision(player, enemy)) {
      if (player.vel.y > 0 && player.pos.y + player.size.y - player.vel.y <= enemy.pos.y + 10) {
        player.vel.y = JUMP_FORCE / 1.5;
        return { ...enemy, isDead: true };
      } else {
        onDamage(false);
      }
    }
    return enemy;
  });

  // 6. コイン
  newState.coins = newState.coins.map(coin => {
    if (!coin.isCollected && checkCollision(player, coin)) {
      player.score += 100;
      return { ...coin, isCollected: true };
    }
    return coin;
  });

  // 7. スター
  if (newState.star && checkCollision(player, newState.star)) {
    newState.status = GameStatus.CLEAR;
  }

  return newState;
}
