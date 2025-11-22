import fs from 'fs';

const icons = JSON.parse(fs.readFileSync('./public/data/icons.json', 'utf8'));

console.log('=== Translation Coverage Report ===\n');

let totalIcons = icons.length;
let iconsWithTitleJa = 0;
let iconsWithDescriptionJa = 0;
let iconsWithTagsJa = 0;

icons.forEach(icon => {
  if (icon.titleJa) iconsWithTitleJa++;
  if (icon.descriptionJa) iconsWithDescriptionJa++;
  if (icon.tagsJa && icon.tagsJa.length > 0) iconsWithTagsJa++;
});

console.log(`Total icons: ${totalIcons}`);
console.log(`Icons with titleJa: ${iconsWithTitleJa} (${(iconsWithTitleJa/totalIcons*100).toFixed(1)}%)`);
console.log(`Icons with descriptionJa: ${iconsWithDescriptionJa} (${(iconsWithDescriptionJa/totalIcons*100).toFixed(1)}%)`);
console.log(`Icons with tagsJa: ${iconsWithTagsJa} (${(iconsWithTagsJa/totalIcons*100).toFixed(1)}%)`);

console.log('\n=== Sample Japanese Translations ===\n');

// カテゴリ別にサンプルを表示
const categories = {};
icons.forEach(icon => {
  if (!categories[icon.category]) {
    categories[icon.category] = [];
  }
  if (categories[icon.category].length < 2) {
    categories[icon.category].push(icon);
  }
});

Object.keys(categories).slice(0, 5).forEach(category => {
  console.log(`Category: ${category}`);
  categories[category].forEach(icon => {
    console.log(`  ${icon.title} -> ${icon.titleJa}`);
    console.log(`    Tags: ${icon.tags?.join(', ')} -> ${icon.tagsJa?.join(', ')}`);
  });
  console.log('');
});
