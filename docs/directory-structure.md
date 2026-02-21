# ディレクトリ構成

このドキュメントは、ts-odysseyプロジェクトの現在のディレクトリ構成を説明します。

## プロジェクト構造

```
ts-odyssey/
├── src/                          # ソースコードのルートディレクトリ
│   ├── components/               # Reactコンポーネント
│   ├── engine/                   # ゲームエンジン
│   │   ├── entities/             # エンティティ処理
│   │   ├── tileMap/              # タイルマップ関連
│   │   ├── utils/                # ユーティリティ
│   │   ├── engine.ts             # ゲームロジック（状態管理、物理演算、衝突検出）
│   │   └── mapData.ts            # マップデータ処理
│   ├── input/                    # 入力処理
│   ├── types/                    # 型定義
│   ├── constants/                # 定数
│   ├── mapdata/                  # マップデータファイル
│   ├── App.tsx                   # メインアプリケーションコンポーネント
│   └── index.tsx                 # エントリーポイント
│
├── assets/                       # アセットファイル
│   └── images/                   # 画像ファイル
│
├── docs/                         # ドキュメント
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
Reactコンポーネントを配置するディレクトリです。プレイヤーやマップエディターなどのUIコンポーネントが含まれます。

### `src/engine/`
ゲームエンジンのコアロジックを配置するディレクトリです。

- **`entities/`**: 各エンティティ（プレイヤー、敵、コイン、スターなど）の処理を管理
- **`tileMap/`**: タイルマップの読み込みや変換処理
- **`utils/`**: 衝突検出などのユーティリティ関数
- **`engine.ts`**: ゲーム状態の初期化と更新処理
- **`mapData.ts`**: マップデータの処理

### `src/input/`
キーボード入力などの入力処理を配置するディレクトリです。ポーズ機能などの入力ハンドラーが含まれます。

### `src/types/`
TypeScriptの型定義を配置するディレクトリです。ゲームエンティティ、ゲーム状態、マップデータなどの型定義が含まれます。

### `src/constants/`
ゲームで使用する定数（重力、ジャンプ力、移動速度、ビューポートサイズなど）を配置するディレクトリです。

### `src/mapdata/`
マップエディターで生成されたマップデータファイルを配置するディレクトリです。

### `assets/`
画像、音声、その他のアセットファイルを配置するディレクトリです。

- **`images/`**: 画像ファイルを配置

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

// エンティティのインポート
import { handlePlayerInput } from '@/engine/entities/player';

// 入力処理のインポート
import { createPauseHandler } from '@/input/pause';

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
- `src/input/`に他の入力処理（移動、ジャンプなど）を追加
- `src/engine/`に物理演算や衝突検出を分離
- `src/hooks/`にカスタムReactフックを追加
- `src/utils/`にユーティリティ関数を追加
