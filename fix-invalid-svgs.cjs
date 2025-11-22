const fs = require('fs');
const crypto = require('crypto');

// SVG検証関数
function isValidSVG(svg) {
  // NaN値をチェック
  if (svg.includes('NaN')) return false;
  
  // パスデータを抽出
  const pathMatch = svg.match(/d="([^"]*)"/);
  if (!pathMatch) return true; // パスがない要素は許可（circle, rectなど）
  
  const pathData = pathMatch[1];
  
  // 空のパスをチェック
  if (pathData.trim() === '') return false;
  
  // パスコマンドと座標のペアに分割
  // 絶対座標コマンド (M, L, H, V, C, S, Q, T, A, Z) の後の数値のみチェック
  // 相対座標コマンド (m, l, h, v, c, s, q, t, a) は負の値も有効なので除外
  
  // 絶対座標コマンドの後の数値のみを抽出
  const absoluteCommands = /[MLHVCSQTA]\s*(-?\d+\.?\d*)/g;
  const matches = [];
  let match;
  while ((match = absoluteCommands.exec(pathData)) !== null) {
    matches.push(match[1]);
  }
  
  // 絶対座標値が範囲内かチェック
  for (const num of matches) {
    const value = parseFloat(num);
    if (isNaN(value)) return false;
    if (value < 0 || value > 24) return false;
  }
  
  return true;
}

// パス構造ハッシュ計算
function calculateStructureHash(svg) {
  const pathMatch = svg.match(/d="([^"]*)"/);
  if (!pathMatch) {
    return crypto.createHash('md5').update(svg).digest('hex').substring(0, 8);
  }
  
  const pathData = pathMatch[1];
  const structure = pathData
    .replace(/-?\d+\.?\d*/g, 'N')
    .replace(/\s+/g, ' ')
    .trim();
  
  return crypto.createHash('md5').update(structure).digest('hex').substring(0, 8);
}

// より高度な乱数生成
function advancedRandom(seed, offset) {
  const primes = [7919, 104729, 1299709, 15485863];
  let value = seed;
  for (let i = 0; i < primes.length; i++) {
    value = (value * primes[i] + offset * primes[(i + 1) % primes.length]) % 2147483647;
  }
  const x = Math.sin(value) * 43758.5453123;
  return x - Math.floor(x);
}

// 有効なSVGを生成（viewBox内に確実に収まる）
function generateValidSVG(seed) {
  const r = (offset) => advancedRandom(seed, offset);
  const patternType = Math.floor(r(0) * 20);
  
  // 安全な範囲: 2-22 (viewBox 0-24の中央寄り)
  const safeMin = 2;
  const safeMax = 22;
  const safeRange = safeMax - safeMin;
  
  const coord = (offset) => (safeMin + r(offset) * safeRange).toFixed(2);
  const size = (offset, min = 2, max = 8) => (min + r(offset) * (max - min)).toFixed(2);
  
  switch (patternType) {
    case 0: { // シンプルな円
      const cx = coord(1);
      const cy = coord(2);
      const radius = size(3, 2, 6);
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="${cx}" cy="${cy}" r="${radius}" fill="currentColor"/></svg>`;
    }
    
    case 1: { // 矩形
      const x = coord(1);
      const y = coord(2);
      const w = size(3, 4, 10);
      const h = size(4, 4, 10);
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="currentColor"/></svg>`;
    }
    
    case 2: { // 三角形
      const x1 = coord(1);
      const y1 = coord(2);
      const x2 = coord(3);
      const y2 = coord(4);
      const x3 = coord(5);
      const y3 = coord(6);
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z" fill="currentColor"/></svg>`;
    }
    
    case 3: { // 星型（5角形ベース）
      const cx = 12;
      const cy = 12;
      const points = 5;
      const outerR = 8;
      const innerR = 3.5;
      let path = '';
      for (let i = 0; i < points * 2; i++) {
        const angle = (Math.PI / points) * i - Math.PI / 2;
        const radius = i % 2 === 0 ? outerR : innerR;
        const x = (cx + radius * Math.cos(angle) * (0.9 + r(i + 10) * 0.2)).toFixed(2);
        const y = (cy + radius * Math.sin(angle) * (0.9 + r(i + 20) * 0.2)).toFixed(2);
        path += (i === 0 ? 'M ' : ' L ') + `${x} ${y}`;
      }
      path += ' Z';
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
    
    case 4: { // ハート型
      const cx = 12;
      const cy = 10;
      const path = `M ${cx} ${cy + 8} C ${cx - 3} ${cy + 5} ${cx - 6} ${cy + 2} ${cx - 6} ${cy - 1} C ${cx - 6} ${cy - 4} ${cx - 3} ${cy - 6} ${cx} ${cy - 4} C ${cx + 3} ${cy - 6} ${cx + 6} ${cy - 4} ${cx + 6} ${cy - 1} C ${cx + 6} ${cy + 2} ${cx + 3} ${cy + 5} ${cx} ${cy + 8} Z`;
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
    
    case 5: { // 複数の円
      const count = 3 + Math.floor(r(1) * 5);
      let circles = '';
      for (let i = 0; i < count; i++) {
        const cx = coord(i * 3);
        const cy = coord(i * 3 + 1);
        const radius = size(i * 3 + 2, 1, 3);
        circles += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="currentColor"/>`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${circles}</svg>`;
    }
    
    case 6: { // ポリゴン
      const sides = 3 + Math.floor(r(1) * 6);
      const cx = 12;
      const cy = 12;
      const radius = 8;
      let path = '';
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
        const x = (cx + radius * Math.cos(angle)).toFixed(2);
        const y = (cy + radius * Math.sin(angle)).toFixed(2);
        path += (i === 0 ? 'M ' : ' L ') + `${x} ${y}`;
      }
      path += ' Z';
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
    
    case 7: { // 楕円
      const cx = coord(1);
      const cy = coord(2);
      const rx = size(3, 3, 7);
      const ry = size(4, 2, 5);
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="currentColor"/></svg>`;
    }
    
    case 8: { // クロスライン
      const lines = 2 + Math.floor(r(1) * 4);
      let path = '';
      for (let i = 0; i < lines; i++) {
        const x1 = coord(i * 4);
        const y1 = coord(i * 4 + 1);
        const x2 = coord(i * 4 + 2);
        const y2 = coord(i * 4 + 3);
        path += `M ${x1} ${y1} L ${x2} ${y2} `;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;
    }
    
    case 9: { // グリッド
      const rows = 2 + Math.floor(r(1) * 3);
      const cols = 2 + Math.floor(r(2) * 3);
      const cellW = safeRange / (cols + 1);
      const cellH = safeRange / (rows + 1);
      let rects = '';
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (r(row * 10 + col + 100) > 0.3) {
            const x = (safeMin + (col + 0.5) * cellW).toFixed(2);
            const y = (safeMin + (row + 0.5) * cellH).toFixed(2);
            const w = (cellW * 0.7).toFixed(2);
            const h = (cellH * 0.7).toFixed(2);
            rects += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="currentColor"/>`;
          }
        }
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
    }
    
    case 10: { // 波形
      const segments = 10;
      const amplitude = 4;
      const frequency = 1 + r(1) * 2;
      let path = `M ${safeMin} 12`;
      for (let i = 1; i <= segments; i++) {
        const x = (safeMin + (i / segments) * safeRange).toFixed(2);
        const y = (12 + amplitude * Math.sin((i / segments) * frequency * Math.PI * 2)).toFixed(2);
        path += ` L ${x} ${y}`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;
    }
    
    case 11: { // ダイヤモンド
      const cx = coord(1);
      const cy = coord(2);
      const w = parseFloat(size(3, 3, 6));
      const h = parseFloat(size(4, 3, 6));
      const cxNum = parseFloat(cx);
      const cyNum = parseFloat(cy);
      const path = `M ${cxNum} ${cyNum - h} L ${cxNum + w} ${cyNum} L ${cxNum} ${cyNum + h} L ${cxNum - w} ${cyNum} Z`;
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
    
    case 12: { // 矩形の回転
      const x = coord(1);
      const y = coord(2);
      const w = size(3, 4, 8);
      const h = size(4, 4, 8);
      const rotation = (r(5) * 45).toFixed(1);
      const cx = (parseFloat(x) + parseFloat(w) / 2).toFixed(2);
      const cy = (parseFloat(y) + parseFloat(h) / 2).toFixed(2);
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="${x}" y="${y}" width="${w}" height="${h}" transform="rotate(${rotation} ${cx} ${cy})" fill="currentColor"/></svg>`;
    }
    
    case 13: { // 放射線
      const rays = 6 + Math.floor(r(1) * 8);
      const innerR = 2;
      const outerR = 9;
      let path = '';
      for (let i = 0; i < rays; i++) {
        const angle = (i / rays) * Math.PI * 2;
        const x1 = (12 + innerR * Math.cos(angle)).toFixed(2);
        const y1 = (12 + innerR * Math.sin(angle)).toFixed(2);
        const x2 = (12 + outerR * Math.cos(angle)).toFixed(2);
        const y2 = (12 + outerR * Math.sin(angle)).toFixed(2);
        path += `M ${x1} ${y1} L ${x2} ${y2} `;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="1.5"/></svg>`;
    }
    
    case 14: { // 同心円
      const rings = 2 + Math.floor(r(1) * 4);
      let circles = '';
      for (let i = 0; i < rings; i++) {
        const radius = (2 + (i + 1) * (8 / rings)).toFixed(2);
        circles += `<circle cx="12" cy="12" r="${radius}" fill="none" stroke="currentColor" stroke-width="1"/>`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${circles}</svg>`;
    }
    
    case 15: { // 複雑なパス
      const points = 4 + Math.floor(r(1) * 6);
      let path = `M ${coord(2)} ${coord(3)}`;
      for (let i = 1; i < points; i++) {
        path += ` L ${coord(i * 2 + 2)} ${coord(i * 2 + 3)}`;
      }
      path += ' Z';
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
    
    case 16: { // ベジェ曲線
      const x1 = coord(1);
      const y1 = coord(2);
      const cx1 = coord(3);
      const cy1 = coord(4);
      const cx2 = coord(5);
      const cy2 = coord(6);
      const x2 = coord(7);
      const y2 = coord(8);
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;
    }
    
    case 17: { // 十字
      const thickness = size(1, 2, 4);
      const length = size(2, 12, 18);
      const center = 12;
      const half = parseFloat(thickness) / 2;
      const ext = parseFloat(length) / 2;
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M ${center - half} ${center - ext} h ${thickness} v ${ext - half} h ${ext - half} v ${thickness} h ${-(ext - half)} v ${ext - half} h ${-thickness} v ${-(ext - half)} h ${-(ext - half)} v ${-thickness} h ${ext - half} Z" fill="currentColor"/></svg>`;
    }
    
    case 18: { // 月
      const cx = 12;
      const cy = 12;
      const radius = 7;
      const offset = 2 + r(1) * 3;
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 0 ${cx} ${cy + radius} A ${radius - offset} ${radius - offset} 0 1 1 ${cx} ${cy - radius} Z" fill="currentColor"/></svg>`;
    }
    
    default: { // ジグザグ
      const points = 5 + Math.floor(r(1) * 7);
      const amplitude = 3;
      let path = `M ${safeMin} 12`;
      for (let i = 1; i <= points; i++) {
        const x = (safeMin + (i / points) * safeRange).toFixed(2);
        const y = (12 + (i % 2 === 0 ? amplitude : -amplitude)).toFixed(2);
        path += ` L ${x} ${y}`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;
    }
  }
}

// メイン処理
function fixInvalidIcons() {
  console.log('=== Fixing Invalid SVG Icons ===\n');
  
  const icons = JSON.parse(fs.readFileSync('./public/data/icons.json', 'utf8'));
  
  let fixedCount = 0;
  let validCount = 0;
  const existingHashes = new Set();
  
  // まず有効なアイコンのハッシュを収集
  icons.forEach(icon => {
    if (isValidSVG(icon.svg)) {
      existingHashes.add(calculateStructureHash(icon.svg));
      validCount++;
    }
  });
  
  console.log(`Valid icons: ${validCount}`);
  console.log(`Invalid icons to fix: ${icons.length - validCount}\n`);
  
  // 無効なアイコンを修正
  const fixedIcons = icons.map((icon, index) => {
    if (isValidSVG(icon.svg)) {
      return icon;
    }
    
    // 新しい有効なSVGを生成
    let newSvg, hash, attempts = 0;
    const maxAttempts = 10000;
    
    do {
      const seed = (index * 100000) + (attempts * 1000) + Date.now() % 100000;
      newSvg = generateValidSVG(seed);
      hash = calculateStructureHash(newSvg);
      attempts++;
    } while (existingHashes.has(hash) && attempts < maxAttempts);
    
    if (attempts < maxAttempts) {
      existingHashes.add(hash);
      fixedCount++;
      
      if (fixedCount % 50 === 0) {
        console.log(`  Fixed ${fixedCount} icons...`);
      }
      
      return {
        ...icon,
        svg: newSvg,
        hash: hash
      };
    } else {
      console.warn(`  Warning: Could not fix ${icon.id} after ${maxAttempts} attempts`);
      return icon;
    }
  });
  
  // 検証
  let stillInvalid = 0;
  const stillInvalidIcons = [];
  fixedIcons.forEach((icon, index) => {
    if (!isValidSVG(icon.svg)) {
      stillInvalid++;
      stillInvalidIcons.push({ index, id: icon.id, title: icon.title });
    }
  });
  
  console.log(`\nFixed: ${fixedCount}`);
  console.log(`Still invalid: ${stillInvalid}`);
  
  // 修正したアイコンがある場合は必ず保存
  if (fixedCount > 0) {
    fs.writeFileSync('./public/data/icons.json', JSON.stringify(fixedIcons, null, 2));
    console.log('Saved to icons.json');
  }
  
  if (stillInvalid === 0) {
    console.log('\n✓ All icons are now valid!');
  } else {
    console.log(`\n✗ ${stillInvalid} icons are still invalid`);
    console.log('\nStill invalid icons:');
    stillInvalidIcons.forEach(icon => {
      console.log(`  - Index ${icon.index}: ${icon.id} - ${icon.title}`);
    });
  }
  
  return { fixed: fixedCount, stillInvalid, stillInvalidIcons };
}

if (require.main === module) {
  fixInvalidIcons();
}

module.exports = { fixInvalidIcons, isValidSVG, generateValidSVG };
