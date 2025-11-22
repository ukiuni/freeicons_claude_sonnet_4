const fs = require('fs');

// SVG検証関数(fix-invalid-svgs.cjsと同じロジック)
function isValidSVG(svg) {
  if (svg.includes('NaN')) return false;
  
  const pathMatch = svg.match(/d="([^"]*)"/);
  if (!pathMatch) return true;
  
  const pathData = pathMatch[1];
  if (pathData.trim() === '') return false;
  
  // 絶対座標コマンド (M, L, H, V, C, S, Q, T, A) の後の数値のみチェック
  // 相対座標コマンド (h, v, etc.) は負の値も有効
  const absoluteCommands = /[MLHVCSQTA]\s*(-?\d+\.?\d*)/g;
  const matches = [];
  let match;
  while ((match = absoluteCommands.exec(pathData)) !== null) {
    matches.push(match[1]);
  }
  
  for (const num of matches) {
    const value = parseFloat(num);
    if (isNaN(value)) return false;
    if (value < 0 || value > 24) return false;
  }
  
  return true;
}

const icons = JSON.parse(fs.readFileSync('./public/data/icons.json', 'utf8'));

console.log('Searching for remaining invalid icon...\n');

let invalidCount = 0;
icons.forEach((icon, index) => {
  if (!isValidSVG(icon.svg)) {
    invalidCount++;
    console.log(`=== Invalid icon #${invalidCount} ===`);
    console.log('Array index:', index);
    console.log('ID:', icon.id);
    console.log('Title:', icon.title);
    console.log('SVG:', icon.svg);
    
    // Extract numbers to show which ones are out of range
    const pathMatch = icon.svg.match(/d="([^"]*)"/);
    if (pathMatch) {
      const numbers = pathMatch[1].match(/-?\d+\.?\d*/g);
      if (numbers) {
        const outOfRange = numbers.filter(num => {
          const v = parseFloat(num);
          return v < 0 || v > 24;
        });
        console.log('Out-of-range values:', outOfRange.join(', '));
      }
    }
    console.log('');
  }
});

console.log(`Total invalid icons: ${invalidCount}`);
