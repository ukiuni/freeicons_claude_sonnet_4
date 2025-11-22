const fs = require('fs');
const crypto = require('crypto');

// SVGパスからコマンドのシーケンスを抽出（座標値を無視）
function extractPathStructure(svg) {
  // pathのd属性を抽出
  const pathMatch = svg.match(/d="([^"]*)"/);
  if (!pathMatch) return '';
  
  const pathData = pathMatch[1];
  
  // 数値を除去してコマンドのみを抽出
  // M, L, H, V, C, S, Q, T, A, Zなどのコマンドと相対位置指定（小文字）を保持
  const structure = pathData
    .replace(/-?\d+\.?\d*/g, 'N') // すべての数値をNに置き換え
    .replace(/\s+/g, ' ')           // 空白を正規化
    .trim();
  
  return structure;
}

// より高度な正規化: パスの形状パターンを抽出
function extractShapePattern(svg) {
  const pathMatch = svg.match(/d="([^"]*)"/);
  if (!pathMatch) return '';
  
  const pathData = pathMatch[1];
  
  // コマンドとその引数の数のパターンを抽出
  const commands = pathData.match(/[MLHVCSQTAZmlhvcsqtaz][^MLHVCSQTAZmlhvcsqtaz]*/g) || [];
  
  const pattern = commands.map(cmd => {
    const letter = cmd[0];
    const numbers = cmd.match(/-?\d+\.?\d*/g) || [];
    return `${letter}${numbers.length}`;
  }).join('_');
  
  return pattern;
}

// パス内の数値の比率パターンを抽出（スケール不変）
function extractRatioPattern(svg) {
  const pathMatch = svg.match(/d="([^"]*)"/);
  if (!pathMatch) return '';
  
  const pathData = pathMatch[1];
  const numbers = pathData.match(/-?\d+\.?\d*/g);
  
  if (!numbers || numbers.length < 2) return '';
  
  const values = numbers.map(n => parseFloat(n));
  const max = Math.max(...values.map(Math.abs));
  
  if (max === 0) return values.join(',');
  
  // 最大値で正規化して比率を取得
  const ratios = values.map(v => (v / max).toFixed(3));
  
  return ratios.join(',');
}

// 複数の手法を組み合わせたハッシュ
function calculateMultipleHashes(svg) {
  const structure = extractPathStructure(svg);
  const pattern = extractShapePattern(svg);
  const ratios = extractRatioPattern(svg);
  
  return {
    structure: crypto.createHash('md5').update(structure).digest('hex').substring(0, 8),
    pattern: crypto.createHash('md5').update(pattern).digest('hex').substring(0, 8),
    ratios: crypto.createHash('md5').update(ratios).digest('hex').substring(0, 8),
    combined: crypto.createHash('md5').update(structure + pattern + ratios).digest('hex').substring(0, 8)
  };
}

// 重複を検知（複数の基準で）
function detectDuplicates(iconsPath) {
  const icons = JSON.parse(fs.readFileSync(iconsPath, 'utf8'));
  
  console.log(`Total icons: ${icons.length}`);
  
  const methods = ['structure', 'pattern', 'ratios', 'combined'];
  const results = {};
  
  methods.forEach(method => {
    const hashMap = new Map();
    const duplicates = [];
    const unique = [];
    
    icons.forEach((icon, index) => {
      const hashes = calculateMultipleHashes(icon.svg);
      const hash = hashes[method];
      
      if (hashMap.has(hash)) {
        duplicates.push({
          index,
          id: icon.id,
          title: icon.title,
          hash: hash,
          originalId: hashMap.get(hash).id,
          originalTitle: hashMap.get(hash).title
        });
      } else {
        hashMap.set(hash, {
          index,
          id: icon.id,
          title: icon.title,
          svg: icon.svg
        });
        unique.push(icon);
      }
    });
    
    results[method] = {
      unique: unique.length,
      duplicates: duplicates.length,
      duplicateList: duplicates
    };
    
    console.log(`\n=== Method: ${method} ===`);
    console.log(`Unique icons: ${unique.length}`);
    console.log(`Duplicate icons: ${duplicates.length}`);
    
    if (duplicates.length > 0) {
      console.log(`First 10 duplicates:`);
      duplicates.slice(0, 10).forEach((dup, i) => {
        console.log(`  ${i + 1}. ${dup.id} (${dup.title}) = ${dup.originalId} (${dup.originalTitle})`);
      });
    }
  });
  
  // 最も重複を検出した方法を選択
  const bestMethod = methods.reduce((best, method) => {
    return results[method].duplicates > results[best].duplicates ? method : best;
  }, methods[0]);
  
  console.log(`\n=== Best Method: ${bestMethod} ===`);
  console.log(`Detected ${results[bestMethod].duplicates} duplicates`);
  
  return {
    total: icons.length,
    results: results,
    bestMethod: bestMethod,
    recommended: results[bestMethod]
  };
}

// メイン処理
if (require.main === module) {
  const iconsPath = './public/data/icons.json';
  const result = detectDuplicates(iconsPath);
  
  fs.writeFileSync(
    './duplicate-analysis.json',
    JSON.stringify(result, null, 2)
  );
  
  console.log(`\nAnalysis saved to duplicate-analysis.json`);
}

module.exports = { detectDuplicates, calculateMultipleHashes };
