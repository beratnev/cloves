const fs = require('fs');
const filePath = 'C:/Users/berat/cloves/src/app/products/[slug]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The file has {t("women")}
content = content.replace(/\{t\("women"\)\}/g, '{"Women"}');

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Fixed TS in ${filePath}`);
