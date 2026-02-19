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
