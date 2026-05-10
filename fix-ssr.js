const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('find src/app/\\(dashboard\\) -name "page.tsx"').toString().split('\n').filter(Boolean);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('ssr: false')) {
    content = content.replace(/\s*ssr:\s*false,\n/g, '\n');
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Removed ssr: false from ${file}`);
  }
});
