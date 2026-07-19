const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const tsPath = './src/lib/i18n/db-translations.ts';

async function main() {
  const currentDbContent = fs.readFileSync(tsPath, 'utf-8');
  
  const products = await prisma.product.findMany();
  const stringsToTranslate = new Set();
  
  const addIfMissing = (str) => {
    if (!str) return;
    // VERY simple check if the exact string exists in the TS file
    // Escaping quotes for a basic string literal check
    if (!currentDbContent.includes(`"${str}"`) && !currentDbContent.includes(`'${str}'`)) {
      stringsToTranslate.add(str);
    }
  };
  
  for (const p of products) {
    addIfMissing(p.name);
    addIfMissing(p.description);
    addIfMissing(p.department);
    addIfMissing(p.category);
    
    if (p.attributes) {
      for (const [key, val] of Object.entries(p.attributes)) {
        addIfMissing(key);
        if (typeof val === 'string') addIfMissing(val);
      }
    }
    
    if (p.aiAdvice) {
      if (p.aiAdvice.usageTips) {
        for (const tip of p.aiAdvice.usageTips) addIfMissing(tip);
      }
      if (p.aiAdvice.keyBenefits) {
        for (const ben of p.aiAdvice.keyBenefits) addIfMissing(ben);
      }
    }
  }
  
  const missingArr = Array.from(stringsToTranslate);
  fs.writeFileSync('missing_translations.json', JSON.stringify(missingArr, null, 2));
  console.log(`Found ${missingArr.length} missing strings.`);
}

main().finally(() => prisma.$disconnect());
