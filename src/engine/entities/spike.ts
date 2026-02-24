/**
 * トゲエンティティの処理
 */

import { Entity } from '../../types';
import { checkCollision } from '../utils/collision';

/**
 * トゲの更新処理
 * トゲは移動せず、プレイヤーとの衝突判定のみを行う
 */
export function updateSpike(
  spike: Entity,
  player: Entity & { life: number; score: number; isHurt?: boolean },
  onDamage: (isFall: boolean) => void
): Entity {
  // プレイヤーとの衝突判定
  if (checkCollision(player, spike)) {
    // プレイヤーがダメージを受ける
    onDamage(false);
  }

  return spike;
}
