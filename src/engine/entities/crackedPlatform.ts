/**
 * ひび割れた床エンティティの処理
 */

import { Entity } from '../../types';
import { checkCollision } from '../utils/collision';

// フレームレートを60fpsと仮定（1フレーム ≈ 16.67ms）
const FRAME_TIME_MS = 1000 / 60;

/**
 * プレイヤーがひび割れた床の上に着地しているかチェック
 */
function isPlayerOnCrackedPlatform(
  player: Entity & { life: number; score: number; isHurt?: boolean },
  platform: Entity
): boolean {
  if (!checkCollision(player, platform)) {
    return false;
  }
  
  // プレイヤーが上から着地しているかチェック
  // プレイヤーの下辺がプラットフォームの上辺に近い（5px以内）
  const tolerance = 5;
  const playerBottom = player.pos.y + player.size.y;
  const platformTop = platform.pos.y;
  
  return playerBottom <= platformTop + tolerance && player.vel.y >= 0;
}

/**
 * ひび割れた床の更新処理
 * プレイヤーが着地している間、タイマーをカウントダウンし、0になったら消滅させる
 * プレイヤーが離れた場合はタイマーをリセットする
 */
export function updateCrackedPlatform(
  platform: Entity & { isCracked?: boolean; crackTimer?: number; isDestroyed?: boolean },
  player: Entity & { life: number; score: number; isHurt?: boolean }
): Entity {
  // 既に消滅している場合は何もしない
  if (platform.isDestroyed) {
    return platform;
  }

  // ひび割れた床でない場合は何もしない
  if (!platform.isCracked || platform.crackTimer === undefined) {
    return platform;
  }

  // プレイヤーが着地しているかチェック
  if (isPlayerOnCrackedPlatform(player, platform)) {
    // タイマーをカウントダウン（フレームベース）
    const newTimer = Math.max(0, platform.crackTimer - FRAME_TIME_MS);
    
    if (newTimer <= 0) {
      // タイマーが0になったら消滅
      return {
        ...platform,
        crackTimer: 0,
        isDestroyed: true
      };
    } else {
      // タイマーを更新
      return {
        ...platform,
        crackTimer: newTimer
      };
    }
  } else {
    // プレイヤーが離れた場合はタイマーをリセット
    // 「一定時間着地した状態が続くと」という要件のため、離れたらリセットする
    if (platform.crackTimer < 1000) {
      return {
        ...platform,
        crackTimer: 1000
      };
    }
  }

  return platform;
}
