// SVGの視覚的な重複も検知する詳細ツール
import { readFileSync } from 'fs';
import { createHash } from 'crypto';

// SVGを正規化（属性順序、空白などを無視）
function normalizeSVG(svg) {
  // pathのd属性のみを抽出
  const pathMatch = svg.match(/d="([^"]+)"/);
  if (!pathMatch) return '';
  return pathMatch[1];
}

// SVG文字列からハッシュを生成
function generateHash(svgContent) {
  return createHash('md5').update(svgContent).digest('hex');
}

// icons.jsonを読み込んで重複をチェック
const data = JSON.parse(readFileSync('public/data/icons.json', 'utf-8'));

console.log(`📊 総アイコン数: ${data.length}`);

// 1. 完全一致チェック（SVG文字列全体）
console.log('\n=== 完全一致チェック ===');
const fullHashes = new Map();
data.forEach((icon, index) => {
  const hash = generateHash(icon.svg);
  if (fullHashes.has(hash)) {
    fullHashes.get(hash).push(index);
  } else {
    fullHashes.set(hash, [index]);
  }
});

const fullDuplicates = Array.from(fullHashes.values()).filter(indices => indices.length > 1).length;
console.log(`重複グループ数: ${fullDuplicates}`);
console.log(`ユニークなSVG数: ${fullHashes.size}`);

// 2. パス一致チェック（視覚的な重複）
console.log('\n=== パス一致チェック（視覚的重複） ===');
const pathHashes = new Map();
data.forEach((icon, index) => {
  const path = normalizeSVG(icon.svg);
  const hash = generateHash(path);
  if (pathHashes.has(hash)) {
    pathHashes.get(hash).push(index);
  } else {
    pathHashes.set(hash, [index]);
  }
});

const pathDuplicates = Array.from(pathHashes.values()).filter(indices => indices.length > 1);
console.log(`視覚的に重複しているグループ数: ${pathDuplicates.length}`);
console.log(`視覚的にユニークなパス数: ${pathHashes.size}`);

if (pathDuplicates.length > 0) {
  console.log('\n視覚的重複の詳細（最初の20グループ）:');
  pathDuplicates.slice(0, 20).forEach((indices, i) => {
    console.log(`\nグループ ${i + 1}:`);
    console.log(`  重複数: ${indices.length}`);
    console.log(`  インデックス: ${indices.slice(0, 10).join(', ')}${indices.length > 10 ? '...' : ''}`);
    const examples = indices.slice(0, 3).map(idx => data[idx].title);
    console.log(`  タイトル例: ${examples.join(', ')}`);
    console.log(`  パス: ${normalizeSVG(data[indices[0]].svg).substring(0, 80)}...`);
  });
  
  if (pathDuplicates.length > 20) {
    console.log(`\n... 他 ${pathDuplicates.length - 20} グループ`);
  }
}

// 3. 統計情報
console.log('\n=== 統計情報 ===');
console.log(`完全一致の重複: ${data.length - fullHashes.size} 個`);
console.log(`視覚的重複: ${data.length - pathHashes.size} 個`);

// 4. hashフィールドの重複チェック
console.log('\n=== hashフィールドチェック ===');
const storedHashes = new Map();
data.forEach((icon, index) => {
  if (storedHashes.has(icon.hash)) {
    storedHashes.get(icon.hash).push(index);
  } else {
    storedHashes.set(icon.hash, [index]);
  }
});

const hashDuplicates = Array.from(storedHashes.values()).filter(indices => indices.length > 1).length;
console.log(`hashフィールドの重複グループ数: ${hashDuplicates}`);
console.log(`ユニークなhash値数: ${storedHashes.size}`);

if (fullDuplicates === 0 && pathDuplicates.length === 0) {
  console.log('\n✨ すべてのSVGが完全にユニークです！');
  process.exit(0);
} else {
  console.log('\n⚠️  重複が検出されました。');
  process.exit(1);
}
