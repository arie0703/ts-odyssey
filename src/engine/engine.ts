
import { GameState, GameStatus } from '../types';
import { INITIAL_LIFE } from '../constants';
import { createEntitiesFromTileMap } from './tileMap/tileMapLoader';
import {
  handlePlayerInput,
  applyPlayerPhysics,
  handlePlayerPlatformCollisions,
  checkPlayerFall
} from './entities/player';
import { updateEnemy } from './entities/enemy';
import { updateCoin } from './entities/coin';
import { updateStar } from './entities/star';
import { updateSpike } from './entities/spike';

export function createInitialState(mapPath: string = 'default'): GameState {
  const { platforms, enemies, coins, star, spikes, playerSpawn } = createEntitiesFromTileMap(mapPath);

  return {
    player: {
      id: 'player',
      type: 'PLAYER',
      pos: playerSpawn,
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
    spikes,
    viewportX: 0,
    status: GameStatus.START
  };
}

export function updateState(
  prev: GameState,
  keys: { [key: string]: boolean },
  onDamage: (isFall: boolean) => void
): GameState {
  if (prev.status !== GameStatus.PLAYING) return prev;

  const newState = JSON.parse(JSON.stringify(prev)) as GameState;
  const { player } = newState;

  // 1. プレイヤー入力処理
  handlePlayerInput(player, keys);

  // 2. プレイヤー物理演算
  applyPlayerPhysics(player);

  // 3. プレイヤーとプラットフォームの衝突
  handlePlayerPlatformCollisions(player, newState.platforms);

  // 4. プレイヤーの落下判定
  if (checkPlayerFall(player, onDamage)) {
    return prev; // App.tsx側のhandleDamageで状態が更新されるため
  }

  // 5. 敵の更新
  newState.enemies = newState.enemies.map((enemy) =>
    updateEnemy(enemy, player, newState.platforms, onDamage)
  );

  // 6. コインの更新
  newState.coins = newState.coins.map((coin) => updateCoin(coin, player));

  // 7. スターの更新
  const starResult = updateStar(newState.star, player);
  if (starResult === GameStatus.CLEAR) {
    newState.status = GameStatus.CLEAR;
  }

  // 8. トゲの更新
  newState.spikes = newState.spikes.map((spike) =>
    updateSpike(spike, player, onDamage)
  );

  return newState;
}
