const fs = require('fs');

console.log('=== JSON Structure Validation ===\n');

// Check Thai file
try {
  const thaiData = JSON.parse(fs.readFileSync('src/locales/th/translation.json', 'utf8'));
  
  console.log('✅ Thai JSON Structure:');
  console.log('Root keys:', Object.keys(thaiData));
  console.log('Has "maps" at root:', !!thaiData.maps);
  console.log('Has "monsters" at root:', !!thaiData.monsters);
  console.log('Has "classes" at root:', !!thaiData.classes);
  
  // Check specific keys
  console.log('\n--- Specific Keys ---');
  console.log('maps.starterField.name:', thaiData.maps?.starterField?.name);
  console.log('monsters.m-01.name:', thaiData.monsters?.['m-01']?.name);
  console.log('ui.elementHint:', thaiData.ui?.elementHint);
  
} catch(e) {
  console.log('❌ Thai Error:', e.message);
}

console.log('\n---\n');

// Check English file
try {
  const englishData = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));
  
  console.log('✅ English JSON Structure:');
  console.log('Root keys:', Object.keys(englishData));
  console.log('Has "maps" at root:', !!englishData.maps);
  console.log('Has "monsters" at root:', !!englishData.monsters);
  console.log('Has "classes" at root:', !!englishData.classes);
  
  // Check specific keys
  console.log('\n--- Specific Keys ---');
  console.log('maps.starterField.name:', englishData.maps?.starterField?.name);
  console.log('monsters.m-01.name:', englishData.monsters?.['m-01']?.name);
  console.log('ui.elementHint:', englishData.ui?.elementHint);
  
} catch(e) {
  console.log('❌ English Error:', e.message);
}

console.log('\n=== Validation Complete ===');
