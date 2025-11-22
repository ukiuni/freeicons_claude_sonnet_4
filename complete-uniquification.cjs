const fs = require('fs');
const { buildCompletelyUniqueIcons, generateUniqueSVG } = require('./final-unique-generator.cjs');

// advanced-duplicate-detector.cjs と同じロジックを使用
const crypto = require('crypto');

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

// ループで完全にユニークになるまで実行
function completeUniquification(inputPath, outputPath, targetCount = 10000, maxIterations = 10) {
  console.log('=== Complete Uniquification Process ===\n');
  
  let iteration = 0;
  let lastUniqueCount = 0;
  
  while (iteration < maxIterations) {
    iteration++;
    console.log(`\n--- Iteration ${iteration} ---`);
    
    const icons = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    // ユニークアイコンを抽出
    const hashMap = new Map();
    const unique = [];
    let duplicateCount = 0;
    
    icons.forEach((icon, index) => {
      const hash = calculateStructureHash(icon.svg);
      
      if (!hashMap.has(hash)) {
        hashMap.set(hash, true);
        unique.push(icon);
      } else {
        duplicateCount++;
      }
    });
    
    console.log(`  Total: ${icons.length}`);
    console.log(`  Unique: ${unique.length}`);
    console.log(`  Duplicates: ${duplicateCount}`);
    
    if (unique.length === targetCount && duplicateCount === 0) {
      console.log('\n✓ All icons are unique!');
      fs.writeFileSync(outputPath, JSON.stringify(unique, null, 2));
      return { success: true, iterations: iteration, uniqueCount: unique.length };
    }
    
    if (unique.length === lastUniqueCount) {
      console.log('\n! No progress made. Need to generate with different strategy.');
    }
    lastUniqueCount = unique.length;
    
    // 不足分を生成
    const needed = targetCount - unique.length;
    console.log(`  Need to generate: ${needed}`);
    
    if (needed > 0) {
      const existingHashes = new Set(hashMap.keys());
      const newIcons = [];
      let totalAttempts = 0;
      let currentId = unique.length + 1;
      
      console.log('  Generating new icons...');
      
      for (let i = 0; i < needed; i++) {
        const id = `icon-${String(currentId).padStart(5, '0')}`;
        let svg, hash, attempts = 0;
        const maxAttempts = 100000;
        
        do {
          // より多様なシード生成
          const baseSeed = (iteration * 1000000) + (i * 10000) + (attempts * 100) + Date.now() % 1000000;
          svg = generateUniqueSVG(baseSeed);
          hash = calculateStructureHash(svg);
          attempts++;
        } while (existingHashes.has(hash) && attempts < maxAttempts);
        
        if (attempts >= maxAttempts) {
          console.log(`  Warning: Max attempts reached for icon ${i + 1}/${needed}`);
          continue;
        }
        
        existingHashes.add(hash);
        totalAttempts += attempts;
        
        const categories = ['common', 'action', 'navigation', 'media', 'communication', 'ui'];
        const category = categories[i % categories.length];
        
        newIcons.push({
          id,
          title: `${category} icon ${i + 1}`,
          description: `Generated unique ${category} icon`,
          svg,
          hash,
          tags: [category, 'generated', 'unique'],
          category,
          titleJa: `${category}アイコン ${i + 1}`,
          descriptionJa: `生成されたユニークな${category}アイコン`,
          tagsJa: [category, '生成', 'ユニーク']
        });
        
        currentId++;
        
        if ((i + 1) % 1000 === 0) {
          console.log(`    Generated ${i + 1}/${needed} (avg attempts: ${(totalAttempts / (i + 1)).toFixed(1)})`);
        }
      }
      
      console.log(`  Generated ${newIcons.length} new icons (avg attempts: ${(totalAttempts / newIcons.length).toFixed(1)})`);
      
      const combined = [...unique, ...newIcons];
      fs.writeFileSync(inputPath, JSON.stringify(combined, null, 2));
    } else {
      // 重複を削除して保存
      fs.writeFileSync(inputPath, JSON.stringify(unique, null, 2));
    }
  }
  
  console.log(`\n✗ Max iterations (${maxIterations}) reached without achieving complete uniqueness.`);
  return { success: false, iterations: maxIterations, uniqueCount: lastUniqueCount };
}

// メイン実行
if (require.main === module) {
  const result = completeUniquification(
    './public/data/icons.json',
    './public/data/icons.json',
    10000,
    10
  );
  
  console.log('\n=== Final Result ===');
  console.log(`Success: ${result.success}`);
  console.log(`Iterations: ${result.iterations}`);
  console.log(`Unique Count: ${result.uniqueCount}`);
}
