/**
 * 衝突検出ユーティリティ
 */

export function checkCollision(
  a: { pos: { x: number; y: number }; size: { x: number; y: number } },
  b: { pos: { x: number; y: number }; size: { x: number; y: number } }
): boolean {
  return (
    a.pos.x < b.pos.x + b.size.x &&
    a.pos.x + a.size.x > b.pos.x &&
    a.pos.y < b.pos.y + b.size.y &&
    a.pos.y + a.size.y > b.pos.y
  );
}

/**
 * マージンを適用した判定エリアを作成する（当たり判定）
 * @param entity 元のエンティティ
 * @param marginX 横方向のマージン（左右から縮小する量）
 * @param marginY 縦方向のマージン（上下から縮小する量）
 * @returns マージンを適用した判定エリア
 */
export function applyCollisionMargin(
  entity: { pos: { x: number; y: number }; size: { x: number; y: number } },
  marginX: number = 0,
  marginY: number = 0
): { pos: { x: number; y: number }; size: { x: number; y: number } } {
  return {
    pos: {
      x: entity.pos.x + marginX,
      y: entity.pos.y + marginY
    },
    size: {
      x: Math.max(0, entity.size.x - marginX * 2),
      y: Math.max(0, entity.size.y - marginY * 2)
    }
  };
}
