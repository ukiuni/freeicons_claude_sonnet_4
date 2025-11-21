// 重複SVGを検知するツール
import { readFileSync } from 'fs';
import { createHash } from 'crypto';

// SVG文字列からハッシュを生成
function generateHash(svgContent) {
  return createHash('md5').update(svgContent).digest('hex');
}

// icons.jsonを読み込んで重複をチェック
const data = JSON.parse(readFileSync('public/data/icons.json', 'utf-8'));

console.log(`📊 総アイコン数: ${data.length}`);

// SVGコンテンツでハッシュを計算
const svgHashes = new Map(); // hash -> [icon indices]
const duplicates = [];

data.forEach((icon, index) => {
  const hash = generateHash(icon.svg);
  
  if (svgHashes.has(hash)) {
    svgHashes.get(hash).push(index);
    duplicates.push({
      hash,
      indices: svgHashes.get(hash),
      svg: icon.svg,
      title: icon.title
    });
  } else {
    svgHashes.set(hash, [index]);
  }
});

const uniqueCount = svgHashes.size;
const duplicateGroupCount = Array.from(svgHashes.values()).filter(indices => indices.length > 1).length;
const totalDuplicates = data.length - uniqueCount;

console.log(`✅ ユニークなSVG数: ${uniqueCount}`);
console.log(`❌ 重複グループ数: ${duplicateGroupCount}`);
console.log(`🔄 重複アイコン総数: ${totalDuplicates}`);

if (duplicateGroupCount > 0) {
  console.log('\n重複詳細:');
  const duplicateGroups = Array.from(svgHashes.entries())
    .filter(([hash, indices]) => indices.length > 1)
    .slice(0, 10); // 最初の10グループのみ表示
  
  duplicateGroups.forEach(([hash, indices], i) => {
    console.log(`\nグループ ${i + 1}:`);
    console.log(`  ハッシュ: ${hash}`);
    console.log(`  重複数: ${indices.length}`);
    console.log(`  インデックス: ${indices.slice(0, 5).join(', ')}${indices.length > 5 ? '...' : ''}`);
    console.log(`  タイトル例: ${data[indices[0]].title}`);
    console.log(`  SVG: ${data[indices[0]].svg.substring(0, 100)}...`);
  });
  
  if (duplicateGroupCount > 10) {
    console.log(`\n... 他 ${duplicateGroupCount - 10} グループ`);
  }
  
  process.exit(1);
} else {
  console.log('\n✨ すべてのSVGがユニークです！');
  process.exit(0);
}
