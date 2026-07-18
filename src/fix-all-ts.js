const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('C:/Users/berat/cloves/src');
files.forEach(file => {
  let original = fs.readFileSync(file, 'utf8');
  // Avoid replacing if it's the definition of t itself
  if (file.includes('i18n') && !file.includes('page.tsx')) return;
  
  let replaced = original.replace(/t\("([^"]+)"\)/g, 't("$1" as any)');
  replaced = replaced.replace(/as any as any/g, 'as any');
  
  if (original !== replaced) {
    fs.writeFileSync(file, replaced, 'utf8');
    console.log('Fixed ' + file);
  }
});
