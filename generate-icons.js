// サンプルSVGアイコンを生成するスクリプト
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 基本的なSVGアイコンテンプレート
const iconTemplates = [
  { type: 'home', path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  { type: 'star', path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' },
  { type: 'heart', path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  { type: 'user', path: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
  { type: 'settings', path: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z' },
  { type: 'search', path: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' },
  { type: 'menu', path: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' },
  { type: 'close', path: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' },
  { type: 'check', path: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
  { type: 'arrow-right', path: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z' },
  { type: 'download', path: 'M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z' },
  { type: 'upload', path: 'M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z' },
  { type: 'edit', path: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' },
  { type: 'delete', path: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' },
  { type: 'add', path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' },
  { type: 'remove', path: 'M19 13H5v-2h14v2z' },
  { type: 'info', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' },
  { type: 'warning', path: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' },
  { type: 'error', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
  { type: 'success', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
];

const categories = [
  'UI', 'Social', 'Device', 'File', 'Communication', 'Business', 'Shopping',
  'Media', 'Navigation', 'Weather', 'Food', 'Sports', 'Travel', 'Education'
];

const adjectives = [
  'filled', 'outlined', 'rounded', 'sharp', 'bold', 'light', 'solid', 'thin',
  'regular', 'duotone', 'simple', 'modern', 'classic', 'minimal', 'detailed'
];

function generateIconData(count) {
  const icons = [];
  
  for (let i = 0; i < count; i++) {
    const template = iconTemplates[i % iconTemplates.length];
    const category = categories[Math.floor(i / iconTemplates.length) % categories.length];
    const adjective = adjectives[i % adjectives.length];
    const variation = Math.floor(i / (iconTemplates.length * categories.length)) + 1;
    
    const id = `icon-${String(i + 1).padStart(5, '0')}`;
    const title = `${adjective} ${template.type} ${variation > 1 ? variation : ''}`.trim();
    const description = `${category}カテゴリの${template.type}アイコン（${adjective}スタイル）。${getDescriptionText(template.type, category)}`;
    
    const svg = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="${template.path}"/></svg>`;
    
    const tags = [template.type, category.toLowerCase(), adjective, 'icon'];
    
    icons.push({
      id,
      title,
      description,
      svg,
      tags,
      category
    });
  }
  
  return icons;
}

function getDescriptionText(type, category) {
  const descriptions = {
    home: 'ホームページや住居を表現するのに最適です。ナビゲーションメニューでよく使用されます。',
    star: 'お気に入りや評価、重要度を示すのに使用されます。レビューシステムに最適です。',
    heart: 'いいねやお気に入り、愛情を表現します。ソーシャルメディアアプリケーションで人気です。',
    user: 'ユーザープロフィール、アカウント設定、ログインボタンなどに使用されます。',
    settings: '設定メニュー、構成オプション、カスタマイズ機能へのアクセスを示します。',
    search: '検索機能を表します。検索バーやフィルター機能のトリガーとして使用されます。',
    menu: 'ハンバーガーメニュー、ナビゲーション開閉のトリガーとして使用されます。',
    close: '閉じる、キャンセル、削除アクションを示します。モーダルやダイアログの終了に使用されます。',
    check: '確認、完了、成功を示します。タスク完了やフォーム送信の確認に使用されます。',
    'arrow-right': '次へ進む、詳細を見る、右方向への移動を示します。',
    download: 'ファイルのダウンロードアクションを示します。',
    upload: 'ファイルのアップロードアクションを示します。',
    edit: '編集モードへの切り替えや、コンテンツの変更を示します。',
    delete: '削除アクションを示します。不要な項目の除去に使用されます。',
    add: '新規作成、追加アクションを示します。',
    remove: '削除、減少アクションを示します。',
    info: '情報、ヘルプ、詳細説明へのアクセスを示します。',
    warning: '警告、注意喚起を示します。',
    error: 'エラー、失敗、問題発生を示します。',
    success: '成功、完了、正常終了を示します。'
  };
  
  return descriptions[type] || 'さまざまな用途に使用できる汎用的なアイコンです。';
}

// 10,000個のアイコンデータを生成
const icons = generateIconData(10000);

// ディレクトリを作成
mkdirSync('public/data', { recursive: true });

// JSONファイルに保存
writeFileSync('public/data/icons.json', JSON.stringify(icons, null, 2));

console.log(`✅ ${icons.length}個のアイコンデータを生成しました。`);
console.log(`📁 保存先: public/data/icons.json`);
console.log(`📊 ファイルサイズ: ${(JSON.stringify(icons).length / 1024 / 1024).toFixed(2)}MB`);
