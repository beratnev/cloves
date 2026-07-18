const fs = require('fs');
const path = require('path');

const targets = [
  { file: 'brands/page.tsx', regex: /const brands:\s*Brand\[\]\s*=\s*\[[\s\S]*?\n\]/ },
  { file: 'categories/page.tsx', regex: /const categories:\s*Category\[\]\s*=\s*\[[\s\S]*?\n\]/ },
  { file: 'collections/page.tsx', regex: /const collections:\s*Collection\[\]\s*=\s*\[[\s\S]*?\n\]/ },
  { file: 'coupons/page.tsx', regex: /const coupons:\s*Coupon\[\]\s*=\s*\[[\s\S]*?\n\]/ },
  { file: 'customers/page.tsx', regex: /const customers:\s*Customer\[\]\s*=\s*\[[\s\S]*?\n\]/ },
  { file: 'orders/page.tsx', regex: /const orders:\s*Order\[\]\s*=\s*\[[\s\S]*?\n\]/ },
  { file: 'reviews/page.tsx', regex: /const reviews:\s*Review\[\]\s*=\s*\[[\s\S]*?\n\]/ },
  { file: 'products/page.tsx', regex: /const initialProducts:\s*Product\[\]\s*=\s*\[[\s\S]*?\n\]/ }
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
