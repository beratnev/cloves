const fs = require('fs');
const path = require('path');

function replaceArrays(filePath, arrayRegexes) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    for (const regex of arrayRegexes) {
      const match = content.match(regex);
      if (match) {
        const varDecl = match[0].split('=')[0]; 
        content = content.replace(regex, varDecl + '= []');
      }
    }
    fs.writeFileSync(fullPath, content);
    console.log('Cleaned arrays in ' + filePath);
  }
}

function clearJSXMetrics(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // <div className="text-2xl font-bold">$45,231.89</div>
    content = content.replace(/(<div className="text-2xl font-bold">)[^<]+(<\/div>)/g, '$10$2');
    
    // <span className="text-green-600">+20.1%</span>
    content = content.replace(/(<span className="text-green-600">)[^<]+(<\/span>)/g, '$10%$2');
    content = content.replace(/(<span className="text-red-600">)[^<]+(<\/span>)/g, '$10%$2');
    
    fs.writeFileSync(fullPath, content);
    console.log('Cleaned metrics in ' + filePath);
  }
}

// Media
replaceArrays('src/app/admin/media/page.tsx', [
  /const mediaFiles:\s*MediaFile\[\]\s*=\s*\[[\s\S]*?\n\]/,
  /const folders\s*=\s*\[[\s\S]*?\n\]/
]);

// Marketing
replaceArrays('src/app/admin/marketing/page.tsx', [
  /const campaigns:\s*Campaign\[\]\s*=\s*\[[\s\S]*?\n\]/
]);

// Clear JSX Hardcoded metrics
clearJSXMetrics('src/app/admin/analytics/page.tsx');
clearJSXMetrics('src/app/admin/marketing/page.tsx');

