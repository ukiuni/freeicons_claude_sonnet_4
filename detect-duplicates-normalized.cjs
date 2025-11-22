const fs = require('fs');
const crypto = require('crypto');

// SVGを正規化（サイズ違いを同一視）
function normalizeSvg(svg) {
  // viewBox属性を削除
  let normalized = svg.replace(/viewBox="[^"]*"/g, 'viewBox="0 0 24 24"');
  
  // width/height属性を削除
  normalized = normalized.replace(/\s*width="[^"]*"/g, '');
  normalized = normalized.replace(/\s*height="[^"]*"/g, '');
  
  // 空白文字を正規化
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  // パス内の数値を正規化（小数点以下2桁に統一）
  normalized = normalized.replace(/d="([^"]*)"/g, (match, pathData) => {
    const normalizedPath = pathData.replace(/-?\d+\.?\d*/g, (num) => {
      const parsed = parseFloat(num);
      return parsed.toFixed(2);
    });
    return `d="${normalizedPath}"`;
  });
  
  return normalized;
}

// 正規化されたSVGのハッシュを計算
function calculateNormalizedHash(svg) {
  const normalized = normalizeSvg(svg);
  return crypto.createHash('md5').update(normalized).digest('hex').substring(0, 8);
}

// 重複を検知
function detectDuplicates(iconsPath) {
  const icons = JSON.parse(fs.readFileSync(iconsPath, 'utf8'));
  
  console.log(`Total icons: ${icons.length}`);
  
  const hashMap = new Map();
  const duplicates = [];
  const unique = [];
  
  icons.forEach((icon, index) => {
    const normalizedHash = calculateNormalizedHash(icon.svg);
    
    if (hashMap.has(normalizedHash)) {
      // 重複発見
      duplicates.push({
        index,
        id: icon.id,
        title: icon.title,
        hash: normalizedHash,
        originalId: hashMap.get(normalizedHash).id,
        originalTitle: hashMap.get(normalizedHash).title
      });
    } else {
      // ユニーク
      hashMap.set(normalizedHash, {
        index,
        id: icon.id,
        title: icon.title,
        svg: icon.svg
      });
      unique.push(icon);
    }
  });
  
  console.log(`\nUnique icons: ${unique.length}`);
  console.log(`Duplicate icons: ${duplicates.length}`);
  
  if (duplicates.length > 0) {
    console.log(`\n=== First 20 Duplicates ===`);
    duplicates.slice(0, 20).forEach((dup, i) => {
      console.log(`${i + 1}. ${dup.id} (${dup.title}) is duplicate of ${dup.originalId} (${dup.originalTitle})`);
    });
    
    if (duplicates.length > 20) {
      console.log(`\n... and ${duplicates.length - 20} more duplicates`);
    }
  }
  
  return {
    total: icons.length,
    unique: unique.length,
    duplicates: duplicates.length,
    duplicateList: duplicates,
    uniqueIcons: unique
  };
}

// メイン処理
if (require.main === module) {
  const iconsPath = './public/data/icons.json';
  const result = detectDuplicates(iconsPath);
  
  // 結果を保存
  fs.writeFileSync(
    './duplicate-report.json',
    JSON.stringify(result, null, 2)
  );
  
  console.log(`\nReport saved to duplicate-report.json`);
}

module.exports = { detectDuplicates, normalizeSvg, calculateNormalizedHash };
