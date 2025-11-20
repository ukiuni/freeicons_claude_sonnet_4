# Free SVG Icons - 仕様書

## 概要
10,000個のSVGアイコンをダウンロード・コピーできるWebサイト。
GitHub Pagesで配信される静的サイト。

## 機能要件

### 1. アイコン表示
- **表示形式**: タイル/グリッドレイアウト
- **アイコン仕様**:
  - SVG形式
  - 正方形に収まるサイズ（例: 24x24, 48x48, viewBox="0 0 24 24"など）
- **メタデータ**:
  - `title`: アイコンの名前（一言）
  - `description`: アイコンの詳細説明

### 2. 検索機能
- titleとdescriptionの両方を対象にした全文検索
- リアルタイムフィルタリング（入力時に即座に結果を更新）
- 検索結果の件数表示

### 3. アイコン操作
- **ダウンロード**: SVGファイルとしてダウンロード
- **コピー**: SVGコードをクリップボードにコピー

### 4. パフォーマンス最適化
- 10,000個のアイコンを扱うため、以下の対策を実施:
  - 仮想スクロール（Virtual Scrolling）またはページネーション
  - 遅延読み込み（Lazy Loading）
  - 検索インデックスの最適化

## 技術スタック

### フロントエンド
- **フレームワーク**: React + Vite（高速ビルド、軽量）
- **スタイリング**: CSS Modules または Tailwind CSS
- **状態管理**: React Hooks (useState, useMemo, useCallback)

### データ管理
- **アイコンデータ**: JSON形式でメタデータを管理
- **SVGファイル**: public/iconsディレクトリに格納、またはインライン化

### デプロイ
- **ホスティング**: GitHub Pages
- **ビルド**: GitHub Actions（自動デプロイ）

## ディレクトリ構成

```
freesvgicons/
├── public/
│   ├── icons/           # SVGファイル（必要に応じて）
│   └── data/
│       └── icons.json   # アイコンメタデータ
├── src/
│   ├── components/
│   │   ├── IconGrid.jsx      # アイコン一覧表示
│   │   ├── IconCard.jsx      # 個別アイコンカード
│   │   ├── SearchBar.jsx     # 検索バー
│   │   └── Header.jsx        # ヘッダー
│   ├── hooks/
│   │   ├── useIconSearch.js  # 検索ロジック
│   │   └── useVirtualScroll.js # 仮想スクロール
│   ├── utils/
│   │   ├── iconLoader.js     # アイコン読み込み
│   │   └── clipboard.js      # クリップボード操作
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions設定
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## データ構造

### icons.json
```json
[
  {
    "id": "icon-001",
    "title": "Home",
    "description": "ホームアイコン。住宅や家を表すシンボル。",
    "svg": "<svg viewBox=\"0 0 24 24\">...</svg>",
    "tags": ["home", "house", "building"]
  },
  ...
]
```

## UI/UX設計

### レイアウト
1. **ヘッダー**:
   - サイトタイトル
   - 検索バー
   - 総アイコン数 / 検索結果数

2. **メインコンテンツ**:
   - レスポンシブグリッド（画面幅に応じて列数調整）
   - 各アイコンカード:
     - SVGプレビュー
     - Title表示
     - ホバー時にアクション表示（ダウンロード/コピー）
     - クリックで詳細モーダル表示

3. **詳細モーダル**:
   - 大きなSVGプレビュー
   - Title & Description
   - ダウンロードボタン
   - コピーボタン
   - SVGコード表示

### レスポンシブ対応
- モバイル: 2列
- タブレット: 4列
- デスクトップ: 6-8列

## パフォーマンス目標
- 初回ロード: < 3秒
- 検索レスポンス: < 100ms
- スムーズなスクロール（60fps）

## 今後の拡張性
- カテゴリ分類
- お気に入り機能（localStorage）
- カラーカスタマイズ
- サイズバリエーション（16px, 24px, 48px）
- SVGスプライトシート生成
