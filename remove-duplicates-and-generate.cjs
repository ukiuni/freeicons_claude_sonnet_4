const fs = require('fs');
const crypto = require('crypto');

// 既存の検出ロジックをインポート
function extractPathStructure(svg) {
  const pathMatch = svg.match(/d="([^"]*)"/);
  if (!pathMatch) return '';
  
  const pathData = pathMatch[1];
  const structure = pathData
    .replace(/-?\d+\.?\d*/g, 'N')
    .replace(/\s+/g, ' ')
    .trim();
  
  return structure;
}

function calculateStructureHash(svg) {
  const structure = extractPathStructure(svg);
  return crypto.createHash('md5').update(structure).digest('hex').substring(0, 8);
}

// ユニークなアイコンを抽出
function extractUniqueIcons(icons) {
  const hashMap = new Map();
  const unique = [];
  
  icons.forEach(icon => {
    const hash = calculateStructureHash(icon.svg);
    
    if (!hashMap.has(hash)) {
      hashMap.set(hash, true);
      unique.push(icon);
    }
  });
  
  return unique;
}

// 新しいユニークなSVGアイコンを生成
function generateUniqueSvg(index, category) {
  const categories = {
    'common': ['utility', 'tool', 'object', 'symbol'],
    'action': ['click', 'touch', 'swipe', 'drag'],
    'navigation': ['arrow', 'chevron', 'direction', 'pointer'],
    'media': ['play', 'pause', 'stop', 'record'],
    'communication': ['message', 'mail', 'phone', 'chat'],
    'ui': ['button', 'slider', 'toggle', 'checkbox']
  };
  
  const categoryTypes = categories[category] || categories['common'];
  const typeIndex = index % categoryTypes.length;
  const variation = Math.floor(index / categoryTypes.length);
  
  // ランダムシードを使用して一貫性のある生成
  const seed = index * 7919; // 大きな素数を使用
  const random = (n) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };
  
  // 様々な形状パターンを生成
  const patterns = [
    // 円形
    (i) => {
      const cx = 12 + random(i) * 4 - 2;
      const cy = 12 + random(i + 1) * 4 - 2;
      const r = 3 + random(i + 2) * 4;
      return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" fill="currentColor"/>`;
    },
    // 矩形
    (i) => {
      const x = 4 + random(i) * 8;
      const y = 4 + random(i + 1) * 8;
      const w = 6 + random(i + 2) * 8;
      const h = 6 + random(i + 3) * 8;
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" fill="currentColor"/>`;
    },
    // パス（複雑な形状）
    (i) => {
      const x1 = 6 + random(i) * 6;
      const y1 = 6 + random(i + 1) * 6;
      const x2 = 12 + random(i + 2) * 6;
      const y2 = 12 + random(i + 3) * 6;
      const x3 = 6 + random(i + 4) * 6;
      const y3 = 18 + random(i + 5) * 3;
      return `<path d="M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} Z" fill="currentColor"/>`;
    },
    // 複数の円
    (i) => {
      const c1x = 8 + random(i) * 4;
      const c1y = 8 + random(i + 1) * 4;
      const c2x = 16 + random(i + 2) * 4;
      const c2y = 16 + random(i + 3) * 4;
      const r = 2 + random(i + 4) * 2;
      return `<circle cx="${c1x.toFixed(2)}" cy="${c1y.toFixed(2)}" r="${r.toFixed(2)}" fill="currentColor"/><circle cx="${c2x.toFixed(2)}" cy="${c2y.toFixed(2)}" r="${r.toFixed(2)}" fill="currentColor"/>`;
    },
    // 星型
    (i) => {
      const cx = 12;
      const cy = 12;
      const points = 5;
      const outerR = 6 + random(i) * 3;
      const innerR = 3 + random(i + 1) * 2;
      let path = 'M ';
      for (let j = 0; j < points * 2; j++) {
        const angle = (Math.PI / points) * j - Math.PI / 2;
        const r = j % 2 === 0 ? outerR : innerR;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        path += `${x.toFixed(2)} ${y.toFixed(2)} `;
        if (j > 0) path = path.replace(` ${x.toFixed(2)}`, ` L ${x.toFixed(2)}`);
      }
      path += 'Z';
      return `<path d="${path}" fill="currentColor"/>`;
    },
    // 曲線パス
    (i) => {
      const x1 = 6 + random(i) * 4;
      const y1 = 6 + random(i + 1) * 4;
      const cx1 = 12 + random(i + 2) * 4;
      const cy1 = 6 + random(i + 3) * 4;
      const x2 = 18 + random(i + 4) * 2;
      const y2 = 12 + random(i + 5) * 4;
      return `<path d="M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${cx1.toFixed(2)} ${cy1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}" stroke="currentColor" stroke-width="2" fill="none"/>`;
    }
  ];
  
  const patternIndex = index % patterns.length;
  const shape = patterns[patternIndex](index);
  
  const svg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${shape}</svg>`;
  
  return svg;
}

// 新しいアイコンオブジェクトを生成
function generateNewIcon(id, index, existingHashes) {
  const categories = ['common', 'action', 'navigation', 'media', 'communication', 'ui'];
  const category = categories[index % categories.length];
  
  let svg, hash;
  let attempts = 0;
  const maxAttempts = 1000;
  
  // ユニークなSVGが生成されるまで試行
  do {
    svg = generateUniqueSvg(index + attempts * 100000, category);
    hash = calculateStructureHash(svg);
    attempts++;
  } while (existingHashes.has(hash) && attempts < maxAttempts);
  
  if (attempts >= maxAttempts) {
    console.warn(`Warning: Could not generate unique icon for ${id} after ${maxAttempts} attempts`);
  }
  
  const titles = {
    'common': `generic icon ${index}`,
    'action': `action icon ${index}`,
    'navigation': `nav icon ${index}`,
    'media': `media icon ${index}`,
    'communication': `comm icon ${index}`,
    'ui': `ui element ${index}`
  };
  
  const titlesJa = {
    'common': `汎用アイコン ${index}`,
    'action': `アクションアイコン ${index}`,
    'navigation': `ナビゲーションアイコン ${index}`,
    'media': `メディアアイコン ${index}`,
    'communication': `通信アイコン ${index}`,
    'ui': `UI要素 ${index}`
  };
  
  return {
    id: id,
    title: titles[category],
    description: `${titles[category]} description`,
    svg: svg,
    hash: hash,
    tags: [category, 'generated', 'unique'],
    category: category,
    titleJa: titlesJa[category],
    descriptionJa: `${titlesJa[category]}の説明`,
    tagsJa: [category, '生成', 'ユニーク']
  };
}

// メイン処理: 重複削除と新規生成
function removeDuplicatesAndGenerate(inputPath, outputPath, targetCount = 10000) {
  console.log('Loading icons...');
  const icons = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  console.log(`Original count: ${icons.length}`);
  
  // ユニークなアイコンを抽出
  console.log('Extracting unique icons...');
  const uniqueIcons = extractUniqueIcons(icons);
  console.log(`Unique icons: ${uniqueIcons.length}`);
  
  const needed = targetCount - uniqueIcons.length;
  console.log(`Need to generate: ${needed} new icons`);
  
  if (needed <= 0) {
    console.log('No new icons needed. Saving unique icons...');
    fs.writeFileSync(outputPath, JSON.stringify(uniqueIcons, null, 2));
    return { unique: uniqueIcons.length, generated: 0, total: uniqueIcons.length };
  }
  
  // 既存のハッシュを記録
  const existingHashes = new Set();
  uniqueIcons.forEach(icon => {
    existingHashes.add(calculateStructureHash(icon.svg));
  });
  
  // 新しいアイコンを生成
  console.log('Generating new unique icons...');
  const newIcons = [];
  let currentId = uniqueIcons.length + 1;
  
  for (let i = 0; i < needed; i++) {
    const id = `icon-${String(currentId).padStart(5, '0')}`;
    const newIcon = generateNewIcon(id, i, existingHashes);
    
    existingHashes.add(newIcon.hash);
    newIcons.push(newIcon);
    currentId++;
    
    if ((i + 1) % 1000 === 0) {
      console.log(`  Generated ${i + 1}/${needed} icons...`);
    }
  }
  
  console.log(`Generated ${newIcons.length} new icons`);
  
  // 統合
  const finalIcons = [...uniqueIcons, ...newIcons];
  console.log(`Final count: ${finalIcons.length}`);
  
  // 保存
  console.log('Saving to file...');
  fs.writeFileSync(outputPath, JSON.stringify(finalIcons, null, 2));
  console.log(`Saved to ${outputPath}`);
  
  return {
    unique: uniqueIcons.length,
    generated: newIcons.length,
    total: finalIcons.length
  };
}

// メイン実行
if (require.main === module) {
  const inputPath = './public/data/icons.json';
  const outputPath = './public/data/icons-deduped.json';
  
  const result = removeDuplicatesAndGenerate(inputPath, outputPath, 10000);
  
  console.log('\n=== Summary ===');
  console.log(`Unique icons from original: ${result.unique}`);
  console.log(`Newly generated icons: ${result.generated}`);
  console.log(`Total icons: ${result.total}`);
}

module.exports = { removeDuplicatesAndGenerate, generateNewIcon, extractUniqueIcons };
