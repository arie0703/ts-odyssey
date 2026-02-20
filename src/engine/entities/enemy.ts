/**
 * 敵エンティティの処理
 */

import { Entity } from '../../types';
import { JUMP_FORCE, WORLD_WIDTH } from '../../constants';
import { checkCollision } from '../utils/collision';

/**
 * 敵の足元に地面があるかチェック
 */
function hasGroundBelow(
  enemy: Entity,
  x: number,
  y: number,
  platforms: Entity[]
): boolean {
  const checkY = y + enemy.size.y; // 敵の足元のY座標
  const checkX = x + enemy.size.x / 2; // 敵の中心のX座標

  // 敵の足元から少し下（5ピクセル）の範囲でプラットフォームをチェック
  const checkArea = {
    pos: { x: checkX - enemy.size.x / 2, y: checkY },
    size: { x: enemy.size.x, y: 5 }
  };

  return platforms.some((platform) => checkCollision(checkArea, platform));
}

/**
 * 敵の更新処理
 */
export function updateEnemy(
  enemy: Entity,
  player: Entity & { life: number; score: number; isHurt?: boolean },
  platforms: Entity[],
  onDamage: (isFall: boolean) => void
): Entity {
  if (enemy.isDead) return enemy;

  // 移動前の位置で地面をチェック
  const currentGround = hasGroundBelow(enemy, enemy.pos.x, enemy.pos.y, platforms);

  // 移動先の位置で地面をチェック
  const nextX = enemy.pos.x + enemy.vel.x;
  const nextGround = hasGroundBelow(enemy, nextX, enemy.pos.y, platforms);

  // 現在位置または移動先に地面がない場合は方向を反転
  if (!currentGround || !nextGround) {
    enemy.vel.x *= -1;
  } else {
    // 地面がある場合のみ移動
    enemy.pos.x += enemy.vel.x;
  }

  // マップの端に到達した場合は方向を反転
  if (enemy.pos.x < 0 || enemy.pos.x > WORLD_WIDTH) {
    enemy.vel.x *= -1;
  }

  // プレイヤーとの衝突判定
  if (checkCollision(player, enemy)) {
    if (player.vel.y > 0 && player.pos.y + player.size.y - player.vel.y <= enemy.pos.y + 10) {
      // プレイヤーが上から踏みつけた
      player.vel.y = JUMP_FORCE / 1.5;
      return { ...enemy, isDead: true };
    } else {
      // プレイヤーがダメージを受ける
      onDamage(false);
    }
  }

  return enemy;
}
