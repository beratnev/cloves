const fs = require('fs');
const path = require('path');

const targets = [
  { file: 'inventory/page.tsx', regex: /const inventoryItems:\s*InventoryItem\[\]\s*=\s*\[[\s\S]*?\n\]/ },
  { file: 'page.tsx', regex: /const recentOrders\s*=\s*\[[\s\S]*?\n\]/ },
  { file: 'page.tsx', regex: /const topProducts\s*=\s*\[[\s\S]*?\n\]/ },
  { file: 'page.tsx', regex: /const topCategories\s*=\s*\[[\s\S]*?\n\]/ }
];

for (const target of targets) {
  const fullPath = path.join(__dirname, 'src/app/admin', target.file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    const varNameMatch = content.match(target.regex);
    if (varNameMatch) {
      const varDecl = varNameMatch[0].split('=')[0]; 
      content = content.replace(target.regex, varDecl + '= []');
      fs.writeFileSync(fullPath, content);
      console.log('Cleared ' + target.file);
    } else {
      console.log('Could not match regex in ' + target.file);
    }
  }
}
