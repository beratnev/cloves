const fs = require('fs');

function removeDuplicates(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const seenKeys = new Set();
  const newLines = [];
  
  for (let line of lines) {
    const match = line.match(/^\s*([a-zA-Z0-9_]+)\s*:/);
    if (match) {
      const key = match[1];
      if (seenKeys.has(key)) {
        console.log(`Removed duplicate key '${key}' from ${filePath}`);
        continue; // Skip duplicate line
      } else {
        seenKeys.add(key);
      }
    }
    newLines.push(line);
  }
  
  fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
}

removeDuplicates('C:/Users/berat/cloves/src/lib/i18n/dictionaries/en.ts');
removeDuplicates('C:/Users/berat/cloves/src/lib/i18n/dictionaries/tr.ts');
