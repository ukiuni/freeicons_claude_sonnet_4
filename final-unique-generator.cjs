const fs = require('fs');
const crypto = require('crypto');

// SVGパスからコマンドのシーケンスを抽出
function extractPathStructure(svg) {
  const pathMatch = svg.match(/d="([^"]*)"/);
  if (!pathMatch) {
    // d属性がない場合、SVG全体からパターンを抽出
    return svg.replace(/\s+/g, ' ').trim();
  }
  
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

// より高度な乱数生成（複数の素数の組み合わせ）
function advancedRandom(seed, offset) {
  const primes = [7919, 104729, 1299709, 15485863];
  let value = seed;
  for (let i = 0; i < primes.length; i++) {
    value = (value * primes[i] + offset * primes[(i + 1) % primes.length]) % 2147483647;
  }
  const x = Math.sin(value) * 43758.5453123;
  return x - Math.floor(x);
}

// より多様なSVG生成（数値精度を上げる）
function generateUniqueSVG(seed) {
  const r = (offset) => advancedRandom(seed, offset);
  
  // 20種類以上のパターンから選択
  const patternType = Math.floor(r(0) * 25);
  
  const precision = 3; // 小数点3桁で生成
  
  switch (patternType) {
    case 0: { // 複雑なパス（頂点数可変）
      const points = 4 + Math.floor(r(1) * 12);
      let path = `M ${(r(2) * 22 + 1).toFixed(precision)} ${(r(3) * 22 + 1).toFixed(precision)}`;
      for (let i = 0; i < points; i++) {
        const x = (r(i * 3 + 4) * 22 + 1).toFixed(precision);
        const y = (r(i * 3 + 5) * 22 + 1).toFixed(precision);
        const cmd = r(i * 3 + 6) > 0.5 ? 'L' : 'C';
        if (cmd === 'C' && i < points - 2) {
          const cx1 = (r(i * 3 + 7) * 22 + 1).toFixed(precision);
          const cy1 = (r(i * 3 + 8) * 22 + 1).toFixed(precision);
          const cx2 = (r(i * 3 + 9) * 22 + 1).toFixed(precision);
          const cy2 = (r(i * 3 + 10) * 22 + 1).toFixed(precision);
          path += ` C ${cx1} ${cy1} ${cx2} ${cy2} ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      }
      path += ' Z';
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
    
    case 1: { // グリッドパターン（可変）
      const rows = 2 + Math.floor(r(1) * 5);
      const cols = 2 + Math.floor(r(2) * 5);
      const cellW = 18 / cols;
      const cellH = 18 / rows;
      let shapes = '';
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (r(row * 100 + col * 10 + 100) > 0.4) {
            const x = (3 + col * cellW).toFixed(precision);
            const y = (3 + row * cellH).toFixed(precision);
            const w = (cellW * (0.7 + r(row * 100 + col * 10 + 101) * 0.3)).toFixed(precision);
            const h = (cellH * (0.7 + r(row * 100 + col * 10 + 102) * 0.3)).toFixed(precision);
            shapes += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="currentColor"/>`;
          }
        }
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${shapes}</svg>`;
    }
    
    case 2: { // ベジェ曲線の組み合わせ
      const curves = 2 + Math.floor(r(1) * 5);
      let path = '';
      for (let i = 0; i < curves; i++) {
        const x0 = (2 + r(i * 10) * 20).toFixed(precision);
        const y0 = (2 + r(i * 10 + 1) * 20).toFixed(precision);
        const x1 = (2 + r(i * 10 + 2) * 20).toFixed(precision);
        const y1 = (2 + r(i * 10 + 3) * 20).toFixed(precision);
        const x2 = (2 + r(i * 10 + 4) * 20).toFixed(precision);
        const y2 = (2 + r(i * 10 + 5) * 20).toFixed(precision);
        const x3 = (2 + r(i * 10 + 6) * 20).toFixed(precision);
        const y3 = (2 + r(i * 10 + 7) * 20).toFixed(precision);
        path += `M ${x0} ${y0} C ${x1} ${y1} ${x2} ${y2} ${x3} ${y3} `;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(0.5 + r(200) * 2).toFixed(precision)}" fill="none"/></svg>`;
    }
    
    case 3: { // ポリゴン（辺数可変、回転可変）
      const sides = 3 + Math.floor(r(1) * 10);
      const cx = (12 + r(2) * 4 - 2).toFixed(precision);
      const cy = (12 + r(3) * 4 - 2).toFixed(precision);
      const radius = (5 + r(4) * 6).toFixed(precision);
      const rotation = r(5) * Math.PI * 2;
      const irregularity = 0.7 + r(6) * 0.6; // 不規則性
      
      let path = '';
      for (let i = 0; i < sides; i++) {
        const angle = rotation + (i / sides) * Math.PI * 2;
        const rVar = parseFloat(radius) * (irregularity + r(i + 10) * (1 - irregularity));
        const x = (parseFloat(cx) + rVar * Math.cos(angle)).toFixed(precision);
        const y = (parseFloat(cy) + rVar * Math.sin(angle)).toFixed(precision);
        path += (i === 0 ? 'M ' : ' L ') + `${x} ${y}`;
      }
      path += ' Z';
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
    
    case 4: { // 複数の円（個数と配置可変）
      const count = 3 + Math.floor(r(1) * 8);
      let circles = '';
      for (let i = 0; i < count; i++) {
        const cx = (3 + r(i * 4) * 18).toFixed(precision);
        const cy = (3 + r(i * 4 + 1) * 18).toFixed(precision);
        const radius = (0.5 + r(i * 4 + 2) * 3.5).toFixed(precision);
        const opacity = r(i * 4 + 3) > 0.7 ? ' fill-opacity="0.7"' : '';
        circles += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="currentColor"${opacity}/>`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${circles}</svg>`;
    }
    
    case 5: { // 星型（より詳細なバリエーション）
      const points = 3 + Math.floor(r(1) * 8);
      const cx = 12;
      const cy = 12;
      const outerR = (6 + r(2) * 4).toFixed(precision);
      const innerR = (2 + r(3) * 3).toFixed(precision);
      const rotation = r(4) * Math.PI * 2;
      
      let path = '';
      for (let i = 0; i < points * 2; i++) {
        const angle = rotation + (Math.PI / points) * i;
        const radius = i % 2 === 0 ? parseFloat(outerR) : parseFloat(innerR);
        const rVar = radius * (0.9 + r(i + 10) * 0.2); // 微妙な変動
        const x = (cx + rVar * Math.cos(angle)).toFixed(precision);
        const y = (cy + rVar * Math.sin(angle)).toFixed(precision);
        path += (i === 0 ? 'M ' : ' L ') + `${x} ${y}`;
      }
      path += ' Z';
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
    
    case 6: { // 螺旋
      const turns = 1.5 + r(1) * 3;
      const segments = 25 + Math.floor(r(2) * 40);
      const startR = 1 + r(3) * 2;
      const endR = 7 + r(4) * 4;
      
      let path = '';
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * turns * Math.PI * 2;
        const radius = startR + t * (endR - startR);
        const x = (12 + radius * Math.cos(angle)).toFixed(precision);
        const y = (12 + radius * Math.sin(angle)).toFixed(precision);
        path += (i === 0 ? 'M ' : ' L ') + `${x} ${y}`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(0.5 + r(100)).toFixed(precision)}" fill="none"/></svg>`;
    }
    
    case 7: { // 放射パターン
      const rays = 4 + Math.floor(r(1) * 16);
      const innerR = 1 + r(2) * 3;
      const outerR = 7 + r(3) * 5;
      const rotation = r(4) * Math.PI / rays;
      
      let path = '';
      for (let i = 0; i < rays; i++) {
        const angle = rotation + (i / rays) * Math.PI * 2;
        const rInner = innerR * (0.9 + r(i + 10) * 0.2);
        const rOuter = outerR * (0.9 + r(i + 20) * 0.2);
        const x1 = (12 + rInner * Math.cos(angle)).toFixed(precision);
        const y1 = (12 + rInner * Math.sin(angle)).toFixed(precision);
        const x2 = (12 + rOuter * Math.cos(angle)).toFixed(precision);
        const y2 = (12 + rOuter * Math.sin(angle)).toFixed(precision);
        path += `M ${x1} ${y1} L ${x2} ${y2} `;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(0.3 + r(200) * 1.5).toFixed(precision)}"/></svg>`;
    }
    
    case 8: { // 波形
      const frequency = 0.3 + r(1) * 2;
      const amplitude = 2 + r(2) * 5;
      const segments = 15 + Math.floor(r(3) * 25);
      const phase = r(4) * Math.PI * 2;
      const yOffset = 12 + r(5) * 4 - 2;
      
      let path = `M 1 ${yOffset}`;
      for (let i = 1; i <= segments; i++) {
        const x = (1 + (i / segments) * 22).toFixed(precision);
        const y = (yOffset + amplitude * Math.sin(phase + i * frequency)).toFixed(precision);
        path += ` L ${x} ${y}`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(0.5 + r(100) * 2).toFixed(precision)}" fill="none"/></svg>`;
    }
    
    case 9: { // ジグザグ
      const points = 5 + Math.floor(r(1) * 12);
      const amplitude = 3 + r(2) * 6;
      const yBase = 12;
      
      let path = `M 2 ${yBase}`;
      for (let i = 1; i <= points; i++) {
        const x = (2 + (i / points) * 20).toFixed(precision);
        const yOffset = (i % 2 === 0 ? amplitude : -amplitude) * (0.7 + r(i + 10) * 0.6);
        const y = (yBase + yOffset).toFixed(precision);
        path += ` L ${x} ${y}`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(0.5 + r(100) * 1.5).toFixed(precision)}" fill="none"/></svg>`;
    }
    
    case 10: { // クロスライン
      const lines = 2 + Math.floor(r(1) * 6);
      let path = '';
      for (let i = 0; i < lines; i++) {
        const x1 = (2 + r(i * 5) * 20).toFixed(precision);
        const y1 = (2 + r(i * 5 + 1) * 20).toFixed(precision);
        const x2 = (2 + r(i * 5 + 2) * 20).toFixed(precision);
        const y2 = (2 + r(i * 5 + 3) * 20).toFixed(precision);
        path += `M ${x1} ${y1} L ${x2} ${y2} `;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(0.5 + r(100) * 2).toFixed(precision)}"/></svg>`;
    }
    
    case 11: { // 楕円パターン
      const count = 2 + Math.floor(r(1) * 6);
      let ellipses = '';
      for (let i = 0; i < count; i++) {
        const cx = (4 + r(i * 5) * 16).toFixed(precision);
        const cy = (4 + r(i * 5 + 1) * 16).toFixed(precision);
        const rx = (1 + r(i * 5 + 2) * 5).toFixed(precision);
        const ry = (1 + r(i * 5 + 3) * 4).toFixed(precision);
        const rotation = (r(i * 5 + 4) * 180).toFixed(precision);
        ellipses += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rotation} ${cx} ${cy})" fill="currentColor"/>`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${ellipses}</svg>`;
    }
    
    case 12: { // 矩形のモザイク
      const rects = 3 + Math.floor(r(1) * 8);
      let shapes = '';
      for (let i = 0; i < rects; i++) {
        const x = (1 + r(i * 5) * 18).toFixed(precision);
        const y = (1 + r(i * 5 + 1) * 18).toFixed(precision);
        const w = (2 + r(i * 5 + 2) * 8).toFixed(precision);
        const h = (2 + r(i * 5 + 3) * 8).toFixed(precision);
        const rotation = (r(i * 5 + 4) * 90).toFixed(precision);
        shapes += `<rect x="${x}" y="${y}" width="${w}" height="${h}" transform="rotate(${rotation} ${(parseFloat(x) + parseFloat(w) / 2).toFixed(precision)} ${(parseFloat(y) + parseFloat(h) / 2).toFixed(precision)})" fill="currentColor"/>`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${shapes}</svg>`;
    }
    
    case 13: { // 三角形パターン
      const triangles = 2 + Math.floor(r(1) * 6);
      let path = '';
      for (let i = 0; i < triangles; i++) {
        const x1 = (2 + r(i * 7) * 20).toFixed(precision);
        const y1 = (2 + r(i * 7 + 1) * 20).toFixed(precision);
        const x2 = (2 + r(i * 7 + 2) * 20).toFixed(precision);
        const y2 = (2 + r(i * 7 + 3) * 20).toFixed(precision);
        const x3 = (2 + r(i * 7 + 4) * 20).toFixed(precision);
        const y3 = (2 + r(i * 7 + 5) * 20).toFixed(precision);
        path += `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z `;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
    
    case 14: { // 二次ベジェ曲線チェーン
      const segments = 3 + Math.floor(r(1) * 7);
      let path = `M ${(2 + r(2) * 10).toFixed(precision)} ${(2 + r(3) * 10).toFixed(precision)}`;
      for (let i = 0; i < segments; i++) {
        const cx = (2 + r(i * 4 + 4) * 20).toFixed(precision);
        const cy = (2 + r(i * 4 + 5) * 20).toFixed(precision);
        const x = (2 + r(i * 4 + 6) * 20).toFixed(precision);
        const y = (2 + r(i * 4 + 7) * 20).toFixed(precision);
        path += ` Q ${cx} ${cy} ${x} ${y}`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(0.5 + r(100) * 1.5).toFixed(precision)}" fill="none"/></svg>`;
    }
    
    case 15: { // ドットパターン（ランダム配置）
      const dots = 5 + Math.floor(r(1) * 25);
      let circles = '';
      for (let i = 0; i < dots; i++) {
        const cx = (3 + r(i * 3) * 18).toFixed(precision);
        const cy = (3 + r(i * 3 + 1) * 18).toFixed(precision);
        const radius = (0.3 + r(i * 3 + 2) * 1.5).toFixed(precision);
        circles += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="currentColor"/>`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${circles}</svg>`;
    }
    
    case 16: { // アーチパターン
      const arches = 2 + Math.floor(r(1) * 5);
      let path = '';
      for (let i = 0; i < arches; i++) {
        const x1 = (3 + r(i * 6) * 14).toFixed(precision);
        const y1 = (5 + r(i * 6 + 1) * 12).toFixed(precision);
        const rx = (2 + r(i * 6 + 2) * 6).toFixed(precision);
        const ry = (2 + r(i * 6 + 3) * 4).toFixed(precision);
        const x2 = (parseFloat(x1) + parseFloat(rx) * (1 + r(i * 6 + 4))).toFixed(precision);
        const y2 = (parseFloat(y1) + r(i * 6 + 5) * 6).toFixed(precision);
        path += `M ${x1} ${y1} A ${rx} ${ry} 0 0 1 ${x2} ${y2} `;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(0.5 + r(100) * 1.5).toFixed(precision)}" fill="none"/></svg>`;
    }
    
    case 17: { // 階段パターン
      const steps = 3 + Math.floor(r(1) * 8);
      const stepW = 18 / steps;
      const stepH = 18 / steps;
      let path = 'M 3 21';
      for (let i = 0; i < steps; i++) {
        const x = (3 + i * stepW).toFixed(precision);
        const y = (21 - i * stepH).toFixed(precision);
        const x2 = (3 + (i + 1) * stepW).toFixed(precision);
        path += ` H ${x2} V ${y}`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(0.5 + r(100) * 1.5).toFixed(precision)}" fill="none"/></svg>`;
    }
    
    case 18: { // 同心円
      const rings = 2 + Math.floor(r(1) * 6);
      const cx = (12 + r(2) * 3 - 1.5).toFixed(precision);
      const cy = (12 + r(3) * 3 - 1.5).toFixed(precision);
      let circles = '';
      for (let i = 0; i < rings; i++) {
        const radius = ((i + 1) * (8 / rings) + r(i + 10)).toFixed(precision);
        circles += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="currentColor" stroke-width="${(0.3 + r(i + 100) * 0.7).toFixed(precision)}"/>`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${circles}</svg>`;
    }
    
    case 19: { // ランダムポリライン
      const points = 5 + Math.floor(r(1) * 15);
      let path = `M ${(3 + r(2) * 8).toFixed(precision)} ${(3 + r(3) * 18).toFixed(precision)}`;
      for (let i = 1; i < points; i++) {
        const x = (3 + r(i * 2 + 4) * 18).toFixed(precision);
        const y = (3 + r(i * 2 + 5) * 18).toFixed(precision);
        path += ` L ${x} ${y}`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(0.5 + r(100) * 2).toFixed(precision)}" fill="none"/></svg>`;
    }
    
    case 20: { // ハニカムパターン（六角形）
      const rows = 2 + Math.floor(r(1) * 3);
      const cols = 2 + Math.floor(r(2) * 3);
      const size = Math.min(6 / rows, 6 / cols);
      let path = '';
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (r(row * 10 + col + 100) > 0.3) {
            const cx = 5 + col * size * 1.7 + (row % 2) * size * 0.85;
            const cy = 5 + row * size * 1.5;
            // 六角形
            let hexPath = '';
            for (let i = 0; i < 6; i++) {
              const angle = (i / 6) * Math.PI * 2;
              const x = (cx + size * Math.cos(angle)).toFixed(precision);
              const y = (cy + size * Math.sin(angle)).toFixed(precision);
              hexPath += (i === 0 ? 'M ' : ' L ') + `${x} ${y}`;
            }
            hexPath += ' Z ';
            path += hexPath;
          }
        }
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
    
    case 21: { // サインコサイン組み合わせ
      const segments = 20 + Math.floor(r(1) * 30);
      const freq1 = 0.5 + r(2) * 2;
      const freq2 = 0.5 + r(3) * 2;
      const amp1 = 3 + r(4) * 4;
      const amp2 = 2 + r(5) * 3;
      
      let path = '';
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = (2 + t * 20).toFixed(precision);
        const y = (12 + amp1 * Math.sin(t * freq1 * Math.PI * 2) + amp2 * Math.cos(t * freq2 * Math.PI * 2)).toFixed(precision);
        path += (i === 0 ? 'M ' : ' L ') + `${x} ${y}`;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="currentColor" stroke-width="${(0.5 + r(100) * 1.5).toFixed(precision)}" fill="none"/></svg>`;
    }
    
    case 22: { // ダイヤモンド/菱形パターン
      const count = 2 + Math.floor(r(1) * 6);
      let path = '';
      for (let i = 0; i < count; i++) {
        const cx = (5 + r(i * 5) * 14).toFixed(precision);
        const cy = (5 + r(i * 5 + 1) * 14).toFixed(precision);
        const w = (2 + r(i * 5 + 2) * 4).toFixed(precision);
        const h = (2 + r(i * 5 + 3) * 4).toFixed(precision);
        const rotation = (r(i * 5 + 4) * 90).toFixed(1);
        
        const cxNum = parseFloat(cx);
        const cyNum = parseFloat(cy);
        const wNum = parseFloat(w);
        const hNum = parseFloat(h);
        
        // Diamond shape
        const top = `${cxNum.toFixed(precision)} ${(cyNum - hNum).toFixed(precision)}`;
        const right = `${(cxNum + wNum).toFixed(precision)} ${cyNum.toFixed(precision)}`;
        const bottom = `${cxNum.toFixed(precision)} ${(cyNum + hNum).toFixed(precision)}`;
        const left = `${(cxNum - wNum).toFixed(precision)} ${cyNum.toFixed(precision)}`;
        
        path += `M ${top} L ${right} L ${bottom} L ${left} Z `;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
    
    case 23: { // L字型の組み合わせ
      const count = 2 + Math.floor(r(1) * 5);
      let path = '';
      for (let i = 0; i < count; i++) {
        const x = (3 + r(i * 6) * 16).toFixed(precision);
        const y = (3 + r(i * 6 + 1) * 16).toFixed(precision);
        const w = (2 + r(i * 6 + 2) * 5).toFixed(precision);
        const h = (2 + r(i * 6 + 3) * 5).toFixed(precision);
        const thickness = (1 + r(i * 6 + 4) * 2).toFixed(precision);
        
        // L-shape
        path += `M ${x} ${y} h ${w} v ${thickness} h ${(-parseFloat(w) + parseFloat(thickness)).toFixed(precision)} v ${h} h ${(-parseFloat(thickness)).toFixed(precision)} Z `;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
    
    default: { // T字型パターン
      const count = 2 + Math.floor(r(1) * 4);
      let path = '';
      for (let i = 0; i < count; i++) {
        const cx = (6 + r(i * 5) * 12).toFixed(precision);
        const cy = (6 + r(i * 5 + 1) * 12).toFixed(precision);
        const w = (3 + r(i * 5 + 2) * 4).toFixed(precision);
        const h = (4 + r(i * 5 + 3) * 5).toFixed(precision);
        const thickness = (1 + r(i * 5 + 4) * 1.5).toFixed(precision);
        
        const cxNum = parseFloat(cx);
        const cyNum = parseFloat(cy);
        const wNum = parseFloat(w);
        const hNum = parseFloat(h);
        const tNum = parseFloat(thickness);
        
        // T-shape: horizontal bar + vertical stem
        path += `M ${(cxNum - wNum / 2).toFixed(precision)} ${cyNum.toFixed(precision)} h ${wNum.toFixed(precision)} v ${tNum.toFixed(precision)} h ${(-(wNum - tNum) / 2).toFixed(precision)} v ${hNum.toFixed(precision)} h ${(-tNum).toFixed(precision)} v ${(-hNum).toFixed(precision)} h ${(-(wNum - tNum) / 2).toFixed(precision)} Z `;
      }
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`;
    }
  }
}

// ユニークアイコンを生成（重複チェック付き、より高い試行回数）
function generateTrulyUniqueIcon(id, baseSeed, existingHashes) {
  let svg, hash;
  let attempts = 0;
  const maxAttempts = 50000; // 試行回数を大幅に増加
  
  do {
    // より広範囲のシード変動
    const seed = baseSeed * 1000000 + attempts * 999983 + Math.floor(attempts / 1000) * 7919;
    svg = generateUniqueSVG(seed);
    hash = calculateStructureHash(svg);
    attempts++;
  } while (existingHashes.has(hash) && attempts < maxAttempts);
  
  if (attempts >= maxAttempts) {
    console.warn(`Warning: Could not generate unique for ${id} after ${maxAttempts} attempts`);
  }
  
  return { svg, hash, attempts };
}

// メイン処理
function buildCompletelyUniqueIcons(inputPath, outputPath, targetCount = 10000) {
  console.log('=== Starting Comprehensive Unique Icon Generation ===\n');
  console.log(`Target: ${targetCount} completely unique icons\n`);
  
  const existingIcons = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  // Step 1: 既存アイコンからユニークなものを抽出
  console.log('Step 1: Extracting unique icons from existing set...');
  const hashMap = new Map();
  const uniqueOriginal = [];
  
  existingIcons.forEach((icon, index) => {
    const hash = calculateStructureHash(icon.svg);
    if (!hashMap.has(hash)) {
      hashMap.set(hash, true);
      uniqueOriginal.push(icon);
    }
  });
  
  console.log(`  Original count: ${existingIcons.length}`);
  console.log(`  Unique count: ${uniqueOriginal.length}`);
  console.log(`  Duplicates removed: ${existingIcons.length - uniqueOriginal.length}\n`);
  
  const needed = targetCount - uniqueOriginal.length;
  
  if (needed <= 0) {
    console.log('No additional icons needed. Saving...');
    fs.writeFileSync(outputPath, JSON.stringify(uniqueOriginal.slice(0, targetCount), null, 2));
    return { unique: targetCount, generated: 0, total: targetCount };
  }
  
  console.log(`Step 2: Generating ${needed} new unique icons...\n`);
  
  const existingHashes = new Set(hashMap.keys());
  const newIcons = [];
  let totalAttempts = 0;
  let currentId = uniqueOriginal.length + 1;
  
  const startTime = Date.now();
  
  for (let i = 0; i < needed; i++) {
    const id = `icon-${String(currentId).padStart(5, '0')}`;
    const baseSeed = i + 1;
    
    const result = generateTrulyUniqueIcon(id, baseSeed, existingHashes);
    
    if (!existingHashes.has(result.hash)) {
      existingHashes.add(result.hash);
      totalAttempts += result.attempts;
      
      const categories = ['common', 'action', 'navigation', 'media', 'communication', 'ui'];
      const category = categories[i % categories.length];
      
      newIcons.push({
        id,
        title: `${category} icon ${i + 1}`,
        description: `Generated unique ${category} icon`,
        svg: result.svg,
        hash: result.hash,
        tags: [category, 'generated', 'unique'],
        category,
        titleJa: `${category}アイコン ${i + 1}`,
        descriptionJa: `生成されたユニークな${category}アイコン`,
        tagsJa: [category, '生成', 'ユニーク']
      });
      
      currentId++;
    } else {
      console.log(`  Collision detected for ${id}, retrying...`);
      i--; // Retry
      continue;
    }
    
    if ((i + 1) % 500 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const avgAttempts = (totalAttempts / (i + 1)).toFixed(1);
      const remaining = needed - (i + 1);
      const eta = ((elapsed / (i + 1)) * remaining).toFixed(0);
      console.log(`  Progress: ${i + 1}/${needed} (${((i + 1) / needed * 100).toFixed(1)}%) | Avg attempts: ${avgAttempts} | ETA: ${eta}s`);
    }
  }
  
  const finalIcons = [...uniqueOriginal, ...newIcons];
  
  console.log(`\nStep 3: Saving ${finalIcons.length} icons...`);
  fs.writeFileSync(outputPath, JSON.stringify(finalIcons, null, 2));
  
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const avgAttempts = (totalAttempts / needed).toFixed(1);
  
  console.log('\n=== Generation Complete ===');
  console.log(`Unique from original: ${uniqueOriginal.length}`);
  console.log(`Newly generated: ${newIcons.length}`);
  console.log(`Total icons: ${finalIcons.length}`);
  console.log(`Average attempts per icon: ${avgAttempts}`);
  console.log(`Total time: ${totalTime}s`);
  console.log(`Output: ${outputPath}`);
  
  return {
    unique: uniqueOriginal.length,
    generated: newIcons.length,
    total: finalIcons.length,
    avgAttempts: parseFloat(avgAttempts),
    timeSeconds: parseFloat(totalTime)
  };
}

// メイン実行
if (require.main === module) {
  buildCompletelyUniqueIcons(
    './public/data/icons.json',
    './public/data/icons.json', // 直接上書き
    10000
  );
}

module.exports = { buildCompletelyUniqueIcons, generateUniqueSVG };
