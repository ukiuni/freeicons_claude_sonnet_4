const fs = require('fs');

// 既存のアイコンデータを読み込む
const icons = JSON.parse(fs.readFileSync('./public/data/icons.json', 'utf8'));

console.log('=== Analyzing Icon SVG Validity ===\n');

let totalIcons = icons.length;
let invalidCount = 0;
let negativeCoords = 0;
let nanValues = 0;
let emptyPaths = 0;

const issues = [];

icons.forEach((icon, index) => {
  const svg = icon.svg;
  const problems = [];
  
  // NaN値をチェック
  if (svg.includes('NaN')) {
    nanValues++;
    problems.push('Contains NaN');
  }
  
  // 負の座標をチェック
  const coords = svg.match(/-\d+\.?\d*/g);
  if (coords && coords.length > 0) {
    negativeCoords++;
    problems.push(`Negative coordinates: ${coords.slice(0, 3).join(', ')}`);
  }
  
  // パスが空かチェック
  const pathMatch = svg.match(/d="([^"]*)"/);
  if (!pathMatch || pathMatch[1].trim() === '') {
    emptyPaths++;
    problems.push('Empty or missing path');
  }
  
  if (problems.length > 0) {
    invalidCount++;
    if (issues.length < 20) { // 最初の20件のみ表示
      issues.push({
        id: icon.id,
        title: icon.title,
        problems: problems,
        svg: svg.substring(0, 150) + '...'
      });
    }
  }
});

console.log(`Total icons: ${totalIcons}`);
console.log(`Invalid icons: ${invalidCount} (${(invalidCount / totalIcons * 100).toFixed(1)}%)`);
console.log(`- With NaN values: ${nanValues}`);
console.log(`- With negative coordinates: ${negativeCoords}`);
console.log(`- With empty paths: ${emptyPaths}`);
console.log('\nFirst 20 issues:');
issues.forEach((issue, i) => {
  console.log(`\n${i + 1}. ${issue.id} (${issue.title})`);
  console.log(`   Problems: ${issue.problems.join(', ')}`);
  console.log(`   SVG: ${issue.svg}`);
});

console.log(`\n... and ${Math.max(0, invalidCount - 20)} more invalid icons`);
