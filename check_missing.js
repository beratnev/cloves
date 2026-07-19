const fs = require('fs');
const missing = JSON.parse(fs.readFileSync('missing_translations.json'));
const db = fs.readFileSync('./src/lib/i18n/db-translations.ts', 'utf-8');

const stillMissing = missing.filter(m => {
  if (!m) return false;
  // basic check
  if (db.includes(`"${m}"`)) return false;
  return true;
});

fs.writeFileSync('still_missing.json', JSON.stringify(stillMissing, null, 2));
console.log('Still missing:', stillMissing.length);
