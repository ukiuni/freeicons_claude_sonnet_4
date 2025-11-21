// 不足分の431個を、新しいプログラム的に生成された形状で補う
import { readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';

function generateHash(svgContent) {
  return createHash('md5').update(svgContent).digest('hex').substring(0, 8);
}

function normalizeSVG(svg) {
  const pathMatch = svg.match(/d="([^"]+)"/);
  if (!pathMatch) return '';
  return pathMatch[1];
}

console.log('📖 既存のicons.jsonを読み込み中...');
const existingIcons = JSON.parse(readFileSync('public/data/icons.json', 'utf-8'));
console.log(`既存アイコン数: ${existingIcons.length}`);

const usedSVGHashes = new Set(existingIcons.map(icon => icon.hash));
const usedPathHashes = new Set(existingIcons.map(icon => generateHash(normalizeSVG(icon.svg))));

const needed = 10000 - existingIcons.length;
console.log(`\n🔨 ${needed}個の新しいアイコンを生成中...\n`);

const newIcons = [];

// 幾何学的な形状を生成する関数群
function generateCirclePath(cx, cy, r) {
  return `M${cx - r},${cy}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 -${r * 2},0`;
}

function generateRectPath(x, y, w, h, rx = 0) {
  if (rx === 0) {
    return `M${x},${y}h${w}v${h}h-${w}z`;
  }
  return `M${x + rx},${y}h${w - 2 * rx}a${rx},${rx} 0 0 1 ${rx},${rx}v${h - 2 * rx}a${rx},${rx} 0 0 1 -${rx},${rx}h-${w - 2 * rx}a${rx},${rx} 0 0 1 -${rx},-${rx}v-${h - 2 * rx}a${rx},${rx} 0 0 1 ${rx},-${rx}z`;
}

function generatePolygonPath(cx, cy, r, sides) {
  let path = '';
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2);
  }
  return path + 'z';
}

function generateStarPath(cx, cy, outerR, innerR, points) {
  let path = '';
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2);
  }
  return path + 'z';
}

function generateSpiralPath(cx, cy, startR, endR, turns) {
  let path = '';
  const steps = turns * 50;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * 2 * Math.PI;
    const r = startR + (endR - startR) * t;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2);
  }
  return path;
}

function generateWavePath(startX, startY, endX, amplitude, frequency) {
  let path = `M${startX},${startY}`;
  const steps = 50;
  const length = endX - startX;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = startX + length * t;
    const y = startY + amplitude * Math.sin(t * frequency * 2 * Math.PI);
    path += `L${x.toFixed(2)},${y.toFixed(2)}`;
  }
  return path;
}

function generateGridPath(x, y, w, h, cols, rows) {
  let path = '';
  const cellW = w / cols;
  const cellH = h / rows;
  // 垂直線
  for (let i = 0; i <= cols; i++) {
    const cx = x + i * cellW;
    path += `M${cx.toFixed(2)},${y}V${y + h}`;
  }
  // 水平線
  for (let i = 0; i <= rows; i++) {
    const cy = y + i * cellH;
    path += `M${x},${cy.toFixed(2)}H${x + w}`;
  }
  return path;
}

let generated = 0;
let shapeIndex = 0;

// 各形状タイプのパラメータバリエーション
const shapeGenerators = [
  // 円形 (100種類)
  ...Array.from({ length: 100 }, (_, i) => ({
    type: 'circle',
    generate: () => {
      const cx = 8 + (i % 10) * 0.8;
      const cy = 8 + Math.floor(i / 10) * 0.8;
      const r = 3 + (i % 5) * 0.5;
      return generateCirclePath(cx, cy, r);
    },
    name: `circle-${i}`,
    category: 'shapes',
    tags: ['circle', 'geometric']
  })),
  
  // 長方形 (100種類)
  ...Array.from({ length: 100 }, (_, i) => ({
    type: 'rectangle',
    generate: () => {
      const x = 2 + (i % 10) * 0.5;
      const y = 2 + Math.floor(i / 10) * 0.5;
      const w = 10 + (i % 8) * 1.5;
      const h = 10 + Math.floor(i / 8) * 1.5;
      const rx = i % 5;
      return generateRectPath(x, y, w, h, rx);
    },
    name: `rect-${i}`,
    category: 'shapes',
    tags: ['rectangle', 'geometric']
  })),
  
  // 多角形 (100種類)
  ...Array.from({ length: 100 }, (_, i) => {
    const sides = 3 + (i % 8);
    return {
      type: 'polygon',
      generate: () => {
        const cx = 12;
        const cy = 12;
        const r = 7 + (i % 5) * 0.8;
        return generatePolygonPath(cx, cy, r, sides);
      },
      name: `polygon-${sides}s-${i}`,
      category: 'shapes',
      tags: ['polygon', 'geometric']
    };
  }),
  
  // 星形 (50種類)
  ...Array.from({ length: 50 }, (_, i) => {
    const points = 3 + (i % 7);
    return {
      type: 'star',
      generate: () => {
        const outerR = 8 + (i % 4);
        const innerR = 3 + (i % 3);
        return generateStarPath(12, 12, outerR, innerR, points);
      },
      name: `star-${points}p-${i}`,
      category: 'shapes',
      tags: ['star', 'geometric']
    };
  }),
  
  // スパイラル (50種類)
  ...Array.from({ length: 50 }, (_, i) => ({
    type: 'spiral',
    generate: () => {
      const startR = 0.5 + (i % 5) * 0.2;
      const endR = 8 + (i % 6);
      const turns = 2 + (i % 4);
      return generateSpiralPath(12, 12, startR, endR, turns);
    },
    name: `spiral-${i}`,
    category: 'patterns',
    tags: ['spiral', 'curve']
  })),
  
  // 波形 (50種類)
  ...Array.from({ length: 50 }, (_, i) => ({
    type: 'wave',
    generate: () => {
      const amplitude = 2 + (i % 5) * 0.8;
      const frequency = 1 + (i % 6) * 0.5;
      return generateWavePath(2, 12, 22, amplitude, frequency);
    },
    name: `wave-${i}`,
    category: 'patterns',
    tags: ['wave', 'curve']
  })),
  
  // グリッド (31種類 - 残り分)
  ...Array.from({ length: 31 }, (_, i) => {
    const cols = 2 + (i % 6);
    const rows = 2 + Math.floor(i / 6);
    return {
      type: 'grid',
      generate: () => {
        return generateGridPath(2, 2, 20, 20, cols, rows);
      },
      name: `grid-${cols}x${rows}`,
      category: 'patterns',
      tags: ['grid', 'pattern']
    };
  })
];

console.log(`🎨 ${shapeGenerators.length}種類の形状パターンを準備完了\n`);

for (const generator of shapeGenerators) {
  if (generated >= needed) break;
  
  const path = generator.generate();
  const pathHash = generateHash(path);
  
  if (!usedPathHashes.has(pathHash)) {
    const svg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor" stroke="none"/></svg>`;
    const svgHash = generateHash(svg);
    
    if (!usedSVGHashes.has(svgHash)) {
      usedSVGHashes.add(svgHash);
      usedPathHashes.add(pathHash);
      
      newIcons.push({
        id: `icon-${String(existingIcons.length + generated + 1).padStart(5, '0')}`,
        title: generator.name,
        description: `${generator.type} shape icon`,
        svg: svg,
        hash: svgHash,
        tags: generator.tags,
        category: generator.category
      });
      
      generated++;
      
      if (generated % 50 === 0) {
        console.log(`  生成済み: ${generated}/${needed}`);
      }
    }
  }
}

console.log(`\n✅ ${generated}個の新しいアイコンを生成しました`);

// 既存のアイコンと結合
const allIcons = [...existingIcons, ...newIcons];

console.log(`\n💾 ${allIcons.length}個のアイコンを保存中...`);
writeFileSync('public/data/icons.json', JSON.stringify(allIcons, null, 2));

console.log(`✨ 完了！`);
console.log(`📊 最終統計:`);
console.log(`  総アイコン数: ${allIcons.length}`);
console.log(`  新規追加: ${generated}`);
