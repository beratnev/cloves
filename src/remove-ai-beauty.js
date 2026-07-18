const fs = require('fs');
const path = 'C:/Users/berat/cloves/src/components/layout/header.tsx';
let content = fs.readFileSync(path, 'utf8');

// Remove AI Beauty from desktop and mobile navbars
const regex = /<Link href="\/ai-assistant" className="text-sm font-medium text-primary transition-colors hover:text-primary\/80">[\s\S]*?<\/Link>/g;

content = content.replace(regex, '');

fs.writeFileSync(path, content, 'utf8');
console.log("AI Beauty removed from navbar.");
