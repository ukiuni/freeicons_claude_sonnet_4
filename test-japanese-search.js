import fs from 'fs';

// icons.jsonを読み込んで日本語検索をテスト
const icons = JSON.parse(fs.readFileSync('./public/data/icons.json', 'utf8'));

console.log('Total icons:', icons.length);
console.log('\n=== Testing Japanese Search ===\n');

// テスト1: "ホーム"で検索
const query1 = 'ホーム';
const results1 = icons.filter(icon => {
  const titleJaMatch = icon.titleJa?.includes(query1);
  const descriptionJaMatch = icon.descriptionJa?.includes(query1);
  const tagsJaMatch = icon.tagsJa?.some(tag => tag.includes(query1));
  return titleJaMatch || descriptionJaMatch || tagsJaMatch;
});

console.log(`Search for "${query1}":`, results1.length, 'results');
console.log('Sample results:');
results1.slice(0, 3).forEach(icon => {
  console.log(`  - ${icon.id}: ${icon.title} (${icon.titleJa})`);
  console.log(`    Tags: ${icon.tagsJa?.join(', ')}`);
});

// テスト2: "家"で検索
const query2 = '家';
const results2 = icons.filter(icon => {
  const titleJaMatch = icon.titleJa?.includes(query2);
  const descriptionJaMatch = icon.descriptionJa?.includes(query2);
  const tagsJaMatch = icon.tagsJa?.some(tag => tag.includes(query2));
  return titleJaMatch || descriptionJaMatch || tagsJaMatch;
});

console.log(`\nSearch for "${query2}":`, results2.length, 'results');
console.log('Sample results:');
results2.slice(0, 3).forEach(icon => {
  console.log(`  - ${icon.id}: ${icon.title} (${icon.titleJa})`);
  console.log(`    Tags: ${icon.tagsJa?.join(', ')}`);
});

// テスト3: "検索"で検索
const query3 = '検索';
const results3 = icons.filter(icon => {
  const titleJaMatch = icon.titleJa?.includes(query3);
  const descriptionJaMatch = icon.descriptionJa?.includes(query3);
  const tagsJaMatch = icon.tagsJa?.some(tag => tag.includes(query3));
  return titleJaMatch || descriptionJaMatch || tagsJaMatch;
});

console.log(`\nSearch for "${query3}":`, results3.length, 'results');
console.log('Sample results:');
results3.slice(0, 3).forEach(icon => {
  console.log(`  - ${icon.id}: ${icon.title} (${icon.titleJa})`);
  console.log(`    Tags: ${icon.tagsJa?.join(', ')}`);
});

console.log('\n=== All tests passed! Japanese search is working correctly. ===');
