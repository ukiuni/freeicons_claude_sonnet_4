const fs = require('fs');
const crypto = require('crypto');

// 既存の検出ロジック
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

// 改良版: より多様なSVG生成
function generateDiverseSvg(seed) {
  // 擬似乱数生成器
  const random = (offset = 0) => {
    const x = Math.sin((seed + offset) * 12.9898 + (seed + offset) * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  
  const patternType = Math.floor(random(0) * 15);
  
  switch (patternType) {
    case 0: // 複雑なパス
      return generateComplexPath(seed, random);
    case 1: // グリッド
      return generateGrid(seed, random);
    case 2: // 波形
      return generateWave(seed, random);
    case 3: // ポリゴン
      return generatePolygon(seed, random);
    case 4: // 螺旋
      return generateSpiral(seed, random);
    case 5: // 複数の円
      return generateMultipleCircles(seed, random);
    case 6: // 矩形の組み合わせ
      return generateRectPattern(seed, random);
    case 7: // 曲線パターン
      return generateCurvePattern(seed, random);
    case 8: // 放射状
      return generateRadialPattern(seed, random);
    case 9: // ジグザグ
      return generateZigzag(seed, random);
    case 10: // クロス
      return generateCrossPattern(seed, random);
    case 11: // ドット
      return generateDotPattern(seed, random);
    case 12: // 楕円
      return generateEllipsePattern(seed, random);
    case 13: // 三角形パターン
      return generateTrianglePattern(seed, random);
    default: // ランダムベジェ曲線
      return generateBezier(seed, random);
  }
}

function generateComplexPath(seed, random) {
  const points = 5 + Math.floor(random(1) * 8);
  let path = `M ${(random(2) * 20 + 2).toFixed(2)} ${(random(3) * 20 + 2).toFixed(2)}`;
  
  for (let i = 0; i < points; i++) {
    const x = (random(i * 2 + 4) * 20 + 2).toFixed(2);
    const y = (random(i * 2 + 5) * 20 + 2).toFixed(2);
    path += ` L ${x} ${y}`;
  }
  path += ' Z';
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
}

function generateGrid(seed, random) {
  const rows = 2 + Math.floor(random(1) * 3);
  const cols = 2 + Math.floor(random(2) * 3);
  const size = Math.min(18 / rows, 18 / cols);
  const gap = size * 0.2;
  
  let shapes = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = 3 + c * (size + gap);
      const y = 3 + r * (size + gap);
      if (random(r * cols + c + 10) > 0.3) {
        shapes += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(size - gap).toFixed(2)}" height="${(size - gap).toFixed(2)}" fill="currentColor"/>`;
      }
    }
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${shapes}</svg>`;
}

function generateWave(seed, random) {
  const amplitude = 3 + random(1) * 4;
  const frequency = 0.5 + random(2) * 1.5;
  const segments = 8 + Math.floor(random(3) * 12);
  
  let path = `M 2 ${12 + amplitude * Math.sin(0)}`;
  for (let i = 1; i <= segments; i++) {
    const x = 2 + (i / segments) * 20;
    const y = 12 + amplitude * Math.sin(i * frequency);
    path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(1 + random(4)).toFixed(2)}" fill="none"/></svg>`;
}

function generatePolygon(seed, random) {
  const sides = 3 + Math.floor(random(1) * 8);
  const cx = 12;
  const cy = 12;
  const radius = 6 + random(2) * 4;
  const rotation = random(3) * Math.PI * 2;
  
  let path = '';
  for (let i = 0; i < sides; i++) {
    const angle = rotation + (i / sides) * Math.PI * 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    path += (i === 0 ? 'M ' : ' L ') + `${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  path += ' Z';
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
}

function generateSpiral(seed, random) {
  const turns = 2 + random(1) * 3;
  const segments = 30 + Math.floor(random(2) * 30);
  
  let path = '';
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * turns * Math.PI * 2;
    const radius = t * 8;
    const x = 12 + radius * Math.cos(angle);
    const y = 12 + radius * Math.sin(angle);
    path += (i === 0 ? 'M ' : ' L ') + `${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(1 + random(3) * 0.5).toFixed(2)}" fill="none"/></svg>`;
}

function generateMultipleCircles(seed, random) {
  const count = 3 + Math.floor(random(1) * 7);
  let circles = '';
  
  for (let i = 0; i < count; i++) {
    const cx = (4 + random(i * 3) * 16).toFixed(2);
    const cy = (4 + random(i * 3 + 1) * 16).toFixed(2);
    const r = (1 + random(i * 3 + 2) * 3).toFixed(2);
    circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="currentColor"/>`;
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${circles}</svg>`;
}

function generateRectPattern(seed, random) {
  const count = 2 + Math.floor(random(1) * 6);
  let rects = '';
  
  for (let i = 0; i < count; i++) {
    const x = (2 + random(i * 4) * 16).toFixed(2);
    const y = (2 + random(i * 4 + 1) * 16).toFixed(2);
    const w = (2 + random(i * 4 + 2) * 6).toFixed(2);
    const h = (2 + random(i * 4 + 3) * 6).toFixed(2);
    rects += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="currentColor"/>`;
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

function generateCurvePattern(seed, random) {
  const curves = 2 + Math.floor(random(1) * 4);
  let path = '';
  
  for (let i = 0; i < curves; i++) {
    const x1 = (4 + random(i * 6) * 16).toFixed(2);
    const y1 = (4 + random(i * 6 + 1) * 16).toFixed(2);
    const cx = (4 + random(i * 6 + 2) * 16).toFixed(2);
    const cy = (4 + random(i * 6 + 3) * 16).toFixed(2);
    const x2 = (4 + random(i * 6 + 4) * 16).toFixed(2);
    const y2 = (4 + random(i * 6 + 5) * 16).toFixed(2);
    path += `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2} `;
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(1 + random(100)).toFixed(2)}" fill="none"/></svg>`;
}

function generateRadialPattern(seed, random) {
  const rays = 4 + Math.floor(random(1) * 12);
  const cx = 12;
  const cy = 12;
  const innerR = 2 + random(2) * 3;
  const outerR = 8 + random(3) * 4;
  
  let path = '';
  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2;
    const x1 = cx + innerR * Math.cos(angle);
    const y1 = cy + innerR * Math.sin(angle);
    const x2 = cx + outerR * Math.cos(angle);
    const y2 = cy + outerR * Math.sin(angle);
    path += `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} `;
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(0.5 + random(4)).toFixed(2)}"/></svg>`;
}

function generateZigzag(seed, random) {
  const points = 6 + Math.floor(random(1) * 10);
  const amplitude = 3 + random(2) * 5;
  
  let path = `M 2 12`;
  for (let i = 1; i <= points; i++) {
    const x = 2 + (i / points) * 20;
    const y = 12 + (i % 2 === 0 ? amplitude : -amplitude) * (0.5 + random(i));
    path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(1 + random(100)).toFixed(2)}" fill="none"/></svg>`;
}

function generateCrossPattern(seed, random) {
  const lines = 2 + Math.floor(random(1) * 4);
  let path = '';
  
  for (let i = 0; i < lines; i++) {
    const x1 = (2 + random(i * 4) * 20).toFixed(2);
    const y1 = (2 + random(i * 4 + 1) * 20).toFixed(2);
    const x2 = (2 + random(i * 4 + 2) * 20).toFixed(2);
    const y2 = (2 + random(i * 4 + 3) * 20).toFixed(2);
    path += `M ${x1} ${y1} L ${x2} ${y2} `;
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(1 + random(50)).toFixed(2)}"/></svg>`;
}

function generateDotPattern(seed, random) {
  const rows = 3 + Math.floor(random(1) * 4);
  const cols = 3 + Math.floor(random(2) * 4);
  const r = 0.5 + random(3) * 1.5;
  
  let circles = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (random(row * cols + col + 10) > 0.3) {
        const cx = 4 + col * (16 / (cols - 1));
        const cy = 4 + row * (16 / (rows - 1));
        circles += `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" fill="currentColor"/>`;
      }
    }
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${circles}</svg>`;
}

function generateEllipsePattern(seed, random) {
  const count = 2 + Math.floor(random(1) * 5);
  let ellipses = '';
  
  for (let i = 0; i < count; i++) {
    const cx = (6 + random(i * 4) * 12).toFixed(2);
    const cy = (6 + random(i * 4 + 1) * 12).toFixed(2);
    const rx = (2 + random(i * 4 + 2) * 4).toFixed(2);
    const ry = (1 + random(i * 4 + 3) * 3).toFixed(2);
    ellipses += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="currentColor"/>`;
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${ellipses}</svg>`;
}

function generateTrianglePattern(seed, random) {
  const count = 2 + Math.floor(random(1) * 5);
  let path = '';
  
  for (let i = 0; i < count; i++) {
    const x1 = (4 + random(i * 6) * 16).toFixed(2);
    const y1 = (4 + random(i * 6 + 1) * 16).toFixed(2);
    const x2 = (4 + random(i * 6 + 2) * 16).toFixed(2);
    const y2 = (4 + random(i * 6 + 3) * 16).toFixed(2);
    const x3 = (4 + random(i * 6 + 4) * 16).toFixed(2);
    const y3 = (4 + random(i * 6 + 5) * 16).toFixed(2);
    path += `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z `;
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
}

function generateBezier(seed, random) {
  const curves = 2 + Math.floor(random(1) * 4);
  let path = '';
  
  for (let i = 0; i < curves; i++) {
    const x1 = (2 + random(i * 8) * 20).toFixed(2);
    const y1 = (2 + random(i * 8 + 1) * 20).toFixed(2);
    const cx1 = (2 + random(i * 8 + 2) * 20).toFixed(2);
    const cy1 = (2 + random(i * 8 + 3) * 20).toFixed(2);
    const cx2 = (2 + random(i * 8 + 4) * 20).toFixed(2);
    const cy2 = (2 + random(i * 8 + 5) * 20).toFixed(2);
    const x2 = (2 + random(i * 8 + 6) * 20).toFixed(2);
    const y2 = (2 + random(i * 8 + 7) * 20).toFixed(2);
    path += `M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2} `;
  }
  
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(1 + random(200)).toFixed(2)}" fill="none"/></svg>`;
}

// ユニークなアイコン生成（重複チェック付き）
function generateUniqueIcon(id, seed, existingHashes) {
  let svg, hash;
  let attempts = 0;
  const maxAttempts = 10000;
  
  do {
    svg = generateDiverseSvg(seed + attempts * 999983); // 大きな素数でシード変更
    hash = calculateStructureHash(svg);
    attempts++;
  } while (existingHashes.has(hash) && attempts < maxAttempts);
  
  if (attempts >= maxAttempts) {
    console.warn(`Warning: Could not generate unique icon for ${id} after ${maxAttempts} attempts`);
  }
  
  return { svg, hash, attempts };
}

// メイン処理
function generateAllUniqueIcons(inputPath, outputPath, targetCount = 10000) {
  console.log('Loading existing icons...');
  const icons = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  // ユニークなアイコンを抽出
  const hashMap = new Map();
  const unique = [];
  
  icons.forEach(icon => {
    const hash = calculateStructureHash(icon.svg);
    if (!hashMap.has(hash)) {
      hashMap.set(hash, true);
      unique.push(icon);
    }
  });
  
  console.log(`Original: ${icons.length}, Unique: ${unique.length}`);
  
  const needed = targetCount - unique.length;
  console.log(`Need to generate: ${needed} new icons`);
  
  if (needed <= 0) {
    fs.writeFileSync(outputPath, JSON.stringify(unique, null, 2));
    return { unique: unique.length, generated: 0, total: unique.length };
  }
  
  // 新しいアイコンを生成
  const existingHashes = new Set(hashMap.keys());
  const newIcons = [];
  let currentId = unique.length + 1;
  let totalAttempts = 0;
  
  console.log('Generating new unique icons...');
  for (let i = 0; i < needed; i++) {
    const id = `icon-${String(currentId).padStart(5, '0')}`;
    const result = generateUniqueIcon(id, i * 7919, existingHashes);
    
    existingHashes.add(result.hash);
    totalAttempts += result.attempts;
    
    const categories = ['common', 'action', 'navigation', 'media', 'communication', 'ui'];
    const category = categories[i % categories.length];
    
    newIcons.push({
      id,
      title: `${category} icon ${i + 1}`,
      description: `Generated ${category} icon`,
      svg: result.svg,
      hash: result.hash,
      tags: [category, 'generated'],
      category,
      titleJa: `${category}アイコン ${i + 1}`,
      descriptionJa: `生成された${category}アイコン`,
      tagsJa: [category, '生成']
    });
    
    currentId++;
    
    if ((i + 1) % 1000 === 0) {
      console.log(`  Generated ${i + 1}/${needed} (avg attempts: ${(totalAttempts / (i + 1)).toFixed(1)})`);
    }
  }
  
  const finalIcons = [...unique, ...newIcons];
  fs.writeFileSync(outputPath, JSON.stringify(finalIcons, null, 2));
  
  console.log(`\nTotal attempts: ${totalAttempts}, Average: ${(totalAttempts / needed).toFixed(1)}`);
  
  return {
    unique: unique.length,
    generated: newIcons.length,
    total: finalIcons.length,
    avgAttempts: totalAttempts / needed
  };
}

// メイン実行
if (require.main === module) {
  const result = generateAllUniqueIcons(
    './public/data/icons.json',
    './public/data/icons-unique.json',
    10000
  );
  
  console.log('\n=== Final Summary ===');
  console.log(`Unique from original: ${result.unique}`);
  console.log(`Newly generated: ${result.generated}`);
  console.log(`Total: ${result.total}`);
  console.log(`Average attempts per icon: ${result.avgAttempts.toFixed(1)}`);
}

module.exports = { generateAllUniqueIcons, generateDiverseSvg };
