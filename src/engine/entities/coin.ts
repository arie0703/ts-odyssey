/**
 * コインエンティティの処理
 */

import { Entity } from '../../types';
import { checkCollision } from '../utils/collision';

/**
 * コインの更新処理
 */
export function updateCoin(
  coin: Entity,
  player: Entity & { life: number; score: number; isHurt?: boolean }
): Entity {
  if (coin.isCollected) return coin;

  if (checkCollision(player, coin)) {
    player.score += 100;
    return { ...coin, isCollected: true };
  }

  return coin;
}
