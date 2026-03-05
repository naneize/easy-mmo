const fs = require('fs');

try {
  const data = fs.readFileSync('src/locales/th/translation.json', 'utf8');
  console.log('Raw data length:', data.length);
  console.log('Raw data (first 200 chars):', data.substring(0, 200));
  
  const parsed = JSON.parse(data);
  console.log('JSON parsed successfully');
  console.log('Maps section:', parsed.maps);
  console.log('starterField:', parsed.maps?.starterField);
  console.log('starterField.name:', parsed.maps?.starterField?.name);
} catch(e) {
  console.log('Error:', e.message);
  console.log('Stack:', e.stack);
}
