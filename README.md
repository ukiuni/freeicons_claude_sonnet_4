# Free SVG Icons

10,000個以上の高品質なSVGアイコンを提供する無料アイコンライブラリ。

## 🌟 特徴

- **10,000+ アイコン**: 豊富なバリエーション
- **検索機能**: タイトルと説明で簡単検索
- **簡単操作**: ワンクリックでコピー・ダウンロード
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **高速パフォーマンス**: 無限スクロールで快適な閲覧
- **完全無料**: GitHub Pagesで配信

## 🚀 デモ

[https://yourusername.github.io/freesvgicons/](https://yourusername.github.io/freesvgicons/)

## 💻 技術スタック

- **フロントエンド**: React 18
- **ビルドツール**: Vite 5
- **スタイリング**: CSS Modules
- **ホスティング**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📦 ローカル開発

### 必要な環境

- Node.js 18以上
- npm または yarn

### セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/freesvgicons.git
cd freesvgicons

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## 📝 アイコンデータの生成

アイコンデータは `generate-icons.js` スクリプトで生成されます。

```bash
node generate-icons.js
```

このスクリプトは `public/data/icons.json` に10,000個のアイコンデータを生成します。

## 🎨 カスタマイズ

### アイコンの追加

`generate-icons.js` を編集して、新しいアイコンテンプレートを追加できます。

```javascript
const iconTemplates = [
  { type: 'your-icon', path: 'M... SVG path data ...' },
  // ... more icons
];
```

### スタイルのカスタマイズ

各コンポーネントのCSSファイルを編集してスタイルを変更できます。

- `src/components/Header.css`
- `src/components/SearchBar.css`
- `src/components/IconCard.css`
- `src/components/IconGrid.css`
- `src/components/IconModal.css`

## 📂 プロジェクト構成

```
freesvgicons/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions設定
├── public/
│   └── data/
│       └── icons.json          # アイコンデータ（10,000個）
├── src/
│   ├── components/
│   │   ├── Header.jsx          # ヘッダーコンポーネント
│   │   ├── SearchBar.jsx       # 検索バー
│   │   ├── IconGrid.jsx        # アイコングリッド
│   │   ├── IconCard.jsx        # アイコンカード
│   │   └── IconModal.jsx       # 詳細モーダル
│   ├── hooks/
│   │   ├── useIconSearch.js    # 検索ロジック
│   │   └── usePagination.js    # ページネーション
│   ├── utils/
│   │   ├── clipboard.js        # クリップボード操作
│   │   └── iconLoader.js       # アイコン読み込み
│   ├── App.jsx                 # メインアプリ
│   ├── main.jsx                # エントリーポイント
│   └── index.css               # グローバルスタイル
├── generate-icons.js           # アイコンデータ生成スクリプト
├── vite.config.js              # Vite設定
├── package.json
└── README.md
```

## 🔧 GitHub Pagesへのデプロイ

### 1. リポジトリ設定

GitHub リポジトリの Settings → Pages で以下を設定:

- Source: GitHub Actions

### 2. vite.config.js の base パス設定

```javascript
export default defineConfig({
  base: '/freesvgicons/', // リポジトリ名に合わせて変更
})
```

### 3. プッシュしてデプロイ

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

GitHub Actions が自動的にビルドとデプロイを実行します。

## 📱 使い方

### アイコンの検索

1. 検索バーにキーワードを入力
2. タイトルと説明文から検索
3. リアルタイムで結果が更新されます

### アイコンのコピー

1. アイコンにマウスホバー
2. コピーボタンをクリック
3. SVGコードがクリップボードにコピーされます

### アイコンのダウンロード

1. アイコンにマウスホバー
2. ダウンロードボタンをクリック
3. SVGファイルがダウンロードされます

### 詳細表示

1. アイコンをクリック
2. モーダルで詳細情報を表示
3. 大きなプレビュー、説明、タグ、SVGコードを確認

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/yourusername/freesvgicons/issues) を開いてください。

---

Made with ❤️ by [Your Name]
