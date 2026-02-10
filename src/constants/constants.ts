
export const TILE_SIZE = 40;
export const GRAVITY = 0.8; // 初期の値に戻しました
export const JUMP_FORCE = -16; // 初期の値に戻しました
export const MOVE_SPEED = 5;
export const VIEWPORT_WIDTH = 800;
export const VIEWPORT_HEIGHT = 600;
export const WORLD_WIDTH = 5000;
export const INITIAL_LIFE = 3;

// アセットパスの設定（本来は /assets/ フォルダに配置する）
export const ASSET_PATHS = {
  PLAYER: '/assets/images/kiro-ghost.png',
  ENEMY: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=enemy',
  COIN: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=coin',
  STAR: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=star',
  BRICK: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=brick'
};
