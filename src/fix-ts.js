const fs = require('fs');

function fixTS(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\{t\("sort_" \+ option\.value\)/g, '{t(("sort_" + option.value) as any)');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed TS in ${filePath}`);
}

fixTS('C:/Users/berat/cloves/src/app/categories/[slug]/page.tsx');
fixTS('C:/Users/berat/cloves/src/app/products/page.tsx');
