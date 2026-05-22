const fs = require('fs');
const path = require('path');

const umaDataPath = path.join(__dirname, 'uma_data.js');
let code = fs.readFileSync(umaDataPath, 'utf8');

const exportIndex = code.indexOf('export{');
if (exportIndex > -1) {
  code = code.substring(0, exportIndex);
}
code += '\nmodule.exports = { characters: _, skills: v };';

const scratchDir = path.join(__dirname, '..', '..', '..', '.gemini', 'antigravity', 'brain', '0796612b-afca-4d1c-bde5-3962fedf9e26', 'scratch');
const tempModulePath = path.join(scratchDir, 'temp_uma_data_2.js');
fs.writeFileSync(tempModulePath, code, 'utf8');

const { skills } = require(tempModulePath);

const categories = new Set();
const rarities = new Set();
const iconIds = new Set();

skills.forEach(s => {
  categories.add(s.skillCategory);
  rarities.add(s.rarity);
  iconIds.add(s.iconId);
});

console.log('Categories:', [...categories]);
console.log('Rarities:', [...rarities]);
console.log('Sample Icon IDs (first 20):', [...iconIds].slice(0, 20));

// Let's print one skill of each category
console.log('\n--- Category Samples ---');
for (const cat of categories) {
  const sample = skills.find(s => s.skillCategory === cat);
  console.log(`\n[${cat}] ->`, JSON.stringify(sample, null, 2));
}

try {
  fs.unlinkSync(tempModulePath);
} catch (e) {}
