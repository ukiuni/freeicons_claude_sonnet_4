// 視覚的に重複しているパスを完全に削除
import { readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';

function normalizeSVG(svg) {
  const pathMatch = svg.match(/d="([^"]+)"/);
  if (!pathMatch) return '';
  return pathMatch[1];
}

function generateHash(svgContent) {
  return createHash('md5').update(svgContent).digest('hex').substring(0, 8);
}

console.log('📖 icons.jsonを読み込み中...');
const data = JSON.parse(readFileSync('public/data/icons.json', 'utf-8'));
console.log(`総アイコン数: ${data.length}`);

// 視覚的に重複しているアイコンを削除（最初の1つだけ残す）
const pathHashes = new Map();
const uniqueIcons = [];

data.forEach((icon, index) => {
  const path = normalizeSVG(icon.svg);
  const pathHash = generateHash(path);
  
  if (!pathHashes.has(pathHash)) {
    pathHashes.set(pathHash, index);
    uniqueIcons.push(icon);
  }
});

console.log(`\n✅ 視覚的にユニークなアイコン: ${uniqueIcons.length} 個`);
console.log(`❌ 削除された重複: ${data.length - uniqueIcons.length} 個`);

// 保存
writeFileSync('public/data/icons.json', JSON.stringify(uniqueIcons, null, 2));

console.log(`\n✨ 完了！`);
console.log(`📊 最終アイコン数: ${uniqueIcons.length}`);
console.log(`\n⚠️  注意: 10,000個から${uniqueIcons.length}個に削減されました`);
console.log(`この数を10,000個にするには、さらに多くの基本テンプレートが必要です。`);
