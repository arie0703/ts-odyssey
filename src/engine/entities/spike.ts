/**
 * トゲエンティティの処理
 */

import { Entity } from '../../types';
import { checkCollision, applyCollisionMargin } from '../utils/collision';

/**
 * トゲの更新処理
 * トゲは移動せず、プレイヤーとの衝突判定のみを行う
 */
export function updateSpike(
  spike: Entity,
  player: Entity & { life: number; score: number; isHurt?: boolean },
  onDamage: (isFall: boolean) => void
): Entity {
  // 横方向のマージン（判定エリアを縮小）
  const marginX = 15;
  // 縦方向のマージン（判定エリアを縮小）
  const marginY = 10;
  
  // マージンを適用した判定エリアで衝突判定
  const adjustedSpike = applyCollisionMargin(spike, marginX, marginY);
  
  if (checkCollision(player, adjustedSpike)) {
    // プレイヤーがダメージを受ける
    onDamage(false);
  }

  return spike;
}
