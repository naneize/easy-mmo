// Final comprehensive check
const fs = require('fs');

console.log('=== FINAL I18N STRUCTURE CHECK ===\n');

// Check both files
const thaiData = JSON.parse(fs.readFileSync('src/locales/th/translation.json', 'utf8'));
const englishData = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

console.log('📋 ROOT LEVEL KEYS:');
console.log('Thai:', Object.keys(thaiData));
console.log('English:', Object.keys(englishData));

console.log('\n🗺️ MAPS SECTION:');
console.log('Thai maps exists:', !!thaiData.maps);
console.log('English maps exists:', !!englishData.maps);
console.log('Thai maps keys:', Object.keys(thaiData.maps || {}));
console.log('English maps keys:', Object.keys(englishData.maps || {}));

console.log('\n👹 MONSTERS SECTION:');
console.log('Thai monsters exists:', !!thaiData.monsters);
console.log('English monsters exists:', !!englishData.monsters);
console.log('Thai monsters keys:', Object.keys(thaiData.monsters || {}));
console.log('English monsters keys:', Object.keys(englishData.monsters || {}));

console.log('\n🎯 SPECIFIC KEYS TEST:');
console.log('maps.starterField.name (TH):', thaiData.maps?.starterField?.name);
console.log('maps.starterField.name (EN):', englishData.maps?.starterField?.name);
console.log('monsters.m-01.name (TH):', thaiData.monsters?.['m-01']?.name);
console.log('monsters.m-01.name (EN):', englishData.monsters?.['m-01']?.name);
console.log('ui.elementHint (TH):', thaiData.ui?.elementHint);
console.log('ui.elementHint (EN):', englishData.ui?.elementHint);

console.log('\n✅ CONCLUSION:');
const thaiValid = !!thaiData.maps && !!thaiData.monsters && !!thaiData.ui;
const englishValid = !!englishData.maps && !!englishData.monsters && !!englishData.ui;
console.log('Thai structure valid:', thaiValid);
console.log('English structure valid:', englishValid);
console.log('Both files ready:', thaiValid && englishValid);
