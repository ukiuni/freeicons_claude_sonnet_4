const fs = require('fs');

// Validation function
function isValidSVG(svg) {
  if (!svg || typeof svg !== 'string') return false;
  
  // Check for NaN values
  if (svg.includes('NaN')) return false;
  
  // Extract all numbers
  const numbers = svg.match(/-?\d+\.?\d*/g);
  if (!numbers) return false;
  
  // Check for negative coordinates (outside viewBox 0-24)
  for (const num of numbers) {
    const value = parseFloat(num);
    if (isNaN(value)) return false;
    if (value < 0 || value > 24) return false;
  }
  
  return true;
}

// Load icons
const icons = JSON.parse(fs.readFileSync('./public/data/icons.json', 'utf8'));

console.log('Searching for invalid icons...\n');

let invalidCount = 0;
icons.forEach((icon, i) => {
  if (!isValidSVG(icon.svg)) {
    invalidCount++;
    console.log('=== Invalid icon found ===');
    console.log('Index:', i);
    console.log('ID:', icon.id);
    console.log('Title:', icon.title);
    console.log('SVG:', icon.svg);
    console.log('');
  }
});

console.log('Total invalid icons:', invalidCount);
