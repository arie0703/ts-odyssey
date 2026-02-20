/**
 * スターエンティティの処理
 */

import { Entity, GameStatus } from '../../types';
import { checkCollision } from '../utils/collision';

/**
 * スターの更新処理
 * @returns ゲームクリアの場合はGameStatus.CLEAR、それ以外はnull
 */
export function updateStar(
  star: Entity | null,
  player: Entity & { life: number; score: number; isHurt?: boolean }
): GameStatus | null {
  if (!star) return null;

  if (checkCollision(player, star)) {
    return GameStatus.CLEAR;
  }

  return null;
}
