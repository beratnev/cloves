const fs = require('fs');

function titleCase(str) {
  return str.toLowerCase().split(' ').map(word => {
    if (word === '&') return '&';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function updateHeader() {
  const path = 'C:/Users/berat/cloves/src/components/layout/header.tsx';
  let content = fs.readFileSync(path, 'utf8');

  // Convert ALL CAPS navigation links to Title Case
  const wordsToReplace = [
    "NEW", "FRAGRANCE", "BODY CARE", "BATH & SHOWER", 
    "SKINCARE", "HAIR CARE", "HOME FRAGRANCE", "GIFTS", 
    "MEN", "SALE", "AI BEAUTY"
  ];

  wordsToReplace.forEach(word => {
    const titleCased = titleCase(word);
    // Replace inside the Link tag body
    const regex = new RegExp(`>\\s*${word}\\s*</Link>`, 'g');
    content = content.replace(regex, `>\n              ${titleCased}\n            </Link>`);
  });

  fs.writeFileSync(path, content, 'utf8');
  console.log("Header updated.");
}

function updateFilters(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove the t("filter_" ...) wrapper for button text and badges
  // Matches {t("filter_" + variable.replace(/\s+/g, "")) || variable}
  // Matches {t("filter_" + variable.replace(/\\s+\/g, "")) || variable} 
  
  content = content.replace(/\{t\("filter_" \+ ([a-zA-Z0-9_]+)\.replace\(\/\\s\+\/g, ""\)\) \|\| \1\}/g, '{$1}');
  content = content.replace(/\{t\("filter_" \+ ([a-zA-Z0-9_]+)\.replace\(\/\\\\s\+\/g, ""\)\) \|\| \1\}/g, '{$1}');
  
  // also handle the select value
  // value={t("filter_" + selectedSkinType.replace(/\s+/g, "")) || selectedSkinType}
  content = content.replace(/value=\{t\("filter_" \+ ([a-zA-Z0-9_]+)\.replace\(\/\\s\+\/g, ""\)\) \|\| \1\}/g, 'value={$1}');
  content = content.replace(/value=\{t\("filter_" \+ ([a-zA-Z0-9_]+)\.replace\(\/\\\\s\+\/g, ""\)\) \|\| \1\}/g, 'value={$1}');

  // Also replace some specific strings that might have been hardcoded
  content = content.replace(/\{selectedBrand === "All" \? t\("filter_All"\) \: selectedBrand\}/g, '{selectedBrand}');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

updateHeader();
updateFilters('C:/Users/berat/cloves/src/app/products/page.tsx');
updateFilters('C:/Users/berat/cloves/src/app/categories/[slug]/page.tsx');
