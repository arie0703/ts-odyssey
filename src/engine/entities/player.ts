/**
 * プレイヤーエンティティの処理
 */

import { Entity, GameState } from '../../types';
import { GRAVITY, JUMP_FORCE, MOVE_SPEED, VIEWPORT_HEIGHT } from '../../constants';
import { checkCollision } from '../utils/collision';

/**
 * プレイヤーの入力処理
 */
export function handlePlayerInput(
  player: Entity & { life: number; score: number; isHurt?: boolean },
  keys: { [key: string]: boolean }
): void {
  // 横移動
  if (keys['ArrowLeft']) player.vel.x = -MOVE_SPEED;
  else if (keys['ArrowRight']) player.vel.x = MOVE_SPEED;
  else player.vel.x = 0;

  // ジャンプ
  if (keys[' '] && player.vel.y === 0) {
    player.vel.y = JUMP_FORCE;
  }
}

/**
 * プレイヤーの物理演算
 */
export function applyPlayerPhysics(
  player: Entity & { life: number; score: number; isHurt?: boolean }
): void {
  player.vel.y += GRAVITY;
  player.pos.x += player.vel.x;
  player.pos.y += player.vel.y;
}

/**
 * プレイヤーのプラットフォーム衝突処理
 */
export function handlePlayerPlatformCollisions(
  player: Entity & { life: number; score: number; isHurt?: boolean },
  platforms: Entity[]
): void {
  platforms.forEach((platform) => {
    if (checkCollision(player, platform)) {
      if (player.vel.y > 0 && player.pos.y + player.size.y - player.vel.y <= platform.pos.y + 5) {
        // 上から着地
        player.pos.y = platform.pos.y - player.size.y;
        player.vel.y = 0;
      } else if (player.vel.y < 0 && player.pos.y - player.vel.y >= platform.pos.y + platform.size.y - 5) {
        // 下から衝突
        player.pos.y = platform.pos.y + platform.size.y;
        player.vel.y = 1;
      }
    }
  });
}

/**
 * プレイヤーの落下判定
 */
export function checkPlayerFall(
  player: Entity & { life: number; score: number; isHurt?: boolean },
  onDamage: (isFall: boolean) => void
): boolean {
  if (player.pos.y > VIEWPORT_HEIGHT) {
    onDamage(true);
    return true;
  }
  return false;
}
