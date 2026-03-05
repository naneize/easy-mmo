// Simple test without Node.js dependencies
const fs = require('fs');

console.log('=== I18n Debug Test ===');

// Test Thai file
try {
  const thaiContent = fs.readFileSync('src/locales/th/translation.json', 'utf8');
  console.log('✅ Thai file read successfully');
  console.log('File size:', thaiContent.length, 'characters');
  
  // Check for common JSON issues
  const hasTrailingComma = thaiContent.includes(',\n  }');
  const hasUnescapedChars = thaiContent.includes('\\n') || thaiContent.includes('\\t');
  
  console.log('Has trailing comma:', hasTrailingComma);
  console.log('Has unescaped chars:', hasUnescapedChars);
  
  // Try to parse
  const thaiData = JSON.parse(thaiContent);
  console.log('✅ Thai JSON parsed successfully');
  console.log('Maps keys:', Object.keys(thaiData.maps || {}));
  console.log('starterField exists:', !!thaiData.maps?.starterField);
  console.log('starterField.name:', thaiData.maps?.starterField?.name);
  
} catch (error) {
  console.log('❌ Thai file error:', error.message);
}

console.log('\n---\n');

// Test English file
try {
  const englishContent = fs.readFileSync('src/locales/en/translation.json', 'utf8');
  console.log('✅ English file read successfully');
  console.log('File size:', englishContent.length, 'characters');
  
  const englishData = JSON.parse(englishContent);
  console.log('✅ English JSON parsed successfully');
  console.log('Maps keys:', Object.keys(englishData.maps || {}));
  console.log('starterField exists:', !!englishData.maps?.starterField);
  console.log('starterField.name:', englishData.maps?.starterField?.name);
  
} catch (error) {
  console.log('❌ English file error:', error.message);
}

console.log('\n=== Test Complete ===');
