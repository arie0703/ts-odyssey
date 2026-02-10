# ディレクトリ構成

このドキュメントは、ts-odysseyプロジェクトの現在のディレクトリ構成を説明します。

## プロジェクト構造

```
ts-odyssey/
├── src/                          # ソースコードのルートディレクトリ
│   ├── components/               # Reactコンポーネント
│   │   └── Player.tsx            # プレイヤーコンポーネント
│   ├── engine/                   # ゲームエンジン
│   │   └── engine.ts             # ゲームロジック（状態管理、物理演算、衝突検出）
│   ├── types/                    # 型定義
│   │   ├── types.ts              # ゲーム関連の型定義（Entity, GameState, GameStatusなど）
│   │   └── index.ts              # 型定義の再エクスポート
│   ├── constants/                # 定数
│   │   ├── constants.ts          # ゲーム定数（TILE_SIZE, GRAVITY, JUMP_FORCEなど）
│   │   └── index.ts              # 定数の再エクスポート
│   ├── App.tsx                   # メインアプリケーションコンポーネント
│   └── index.tsx                 # エントリーポイント
│
├── assets/                       # アセットファイル
│   └── images/                   # 画像ファイル
│       └── kiro-ghost.png        # プレイヤー画像
│
├── docs/                         # ドキュメント
│   └── directory-structure.md     # このファイル
│
├── node_modules/                 # 依存パッケージ（自動生成）
│
├── index.html                    # HTMLエントリーポイント
├── package.json                  # プロジェクト設定と依存関係
├── package-lock.json             # 依存関係のロックファイル
├── tsconfig.json                 # TypeScript設定
├── vite.config.ts                # Vite設定
├── metadata.json                 # メタデータ
└── README.md                     # プロジェクト説明
```

## ディレクトリの説明

### `src/`
すべてのソースコードが配置されるルートディレクトリです。

### `src/components/`
Reactコンポーネントを配置するディレクトリです。

- **`Player.tsx`**: プレイヤーキャラクターを表示するコンポーネント

### `src/engine/`
ゲームエンジンのコアロジックを配置するディレクトリです。

- **`engine.ts`**: 
  - `createInitialState()`: 初期ゲーム状態の生成
  - `updateState()`: ゲーム状態の更新（物理演算、衝突検出、入力処理）
  - `checkCollision()`: 衝突検出関数

### `src/types/`
TypeScriptの型定義を配置するディレクトリです。

- **`types.ts`**: 
  - `EntityType`: エンティティの種類
  - `Vector2D`: 2次元ベクトル
  - `Entity`: ゲームエンティティの基本型
  - `GameStatus`: ゲーム状態の列挙型
  - `GameState`: ゲーム全体の状態

- **`index.ts`**: 型定義の再エクスポート（インポートを簡潔にするため）

### `src/constants/`
ゲームで使用する定数を配置するディレクトリです。

- **`constants.ts`**: 
  - `TILE_SIZE`: タイルサイズ
  - `GRAVITY`: 重力定数
  - `JUMP_FORCE`: ジャンプ力
  - `MOVE_SPEED`: 移動速度
  - `VIEWPORT_WIDTH`, `VIEWPORT_HEIGHT`: ビューポートサイズ
  - `WORLD_WIDTH`: ワールド幅
  - `INITIAL_LIFE`: 初期ライフ
  - `ASSET_PATHS`: アセットパスの設定

- **`index.ts`**: 定数の再エクスポート（インポートを簡潔にするため）

### `assets/`
画像、音声、その他のアセットファイルを配置するディレクトリです。

- **`images/`: 画像ファイルを配置

### `docs/`
プロジェクトのドキュメントを配置するディレクトリです。

## インポートパス

プロジェクトでは`@`エイリアスを使用して、`src/`ディレクトリからの相対パスでインポートできます。

### 例

```typescript
// 型定義のインポート
import { GameState, Entity } from '@/types';

// 定数のインポート
import { TILE_SIZE, GRAVITY } from '@/constants';

// エンジンのインポート
import { createInitialState, updateState } from '@/engine/engine';

// コンポーネントのインポート
import Player from '@/components/Player';
```

## 設定ファイル

- **`vite.config.ts`**: Viteの設定。`@`エイリアスが`src/`に設定されています
- **`tsconfig.json`**: TypeScriptの設定。パスエイリアスが設定されています
- **`index.html`**: HTMLエントリーポイント。`/src/index.tsx`を読み込みます

## 今後の拡張

この構成は小規模・個人開発向けにシンプルに保たれていますが、将来的に以下のような拡張が可能です：

- `src/components/`に新しいコンポーネントを追加
- `src/engine/`に物理演算や衝突検出を分離
- `src/systems/`にゲームシステム（入力、オーディオなど）を追加
- `src/hooks/`にカスタムReactフックを追加
- `src/utils/`にユーティリティ関数を追加
