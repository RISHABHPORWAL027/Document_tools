const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('find src/app/\\(dashboard\\)/incorporation -name "page.tsx"').toString().split('\n').filter(Boolean);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  if (content.includes('next/dynamic')) return;

  const importMatch = content.match(/import\s+(\w+)\s+from\s+['"](@\/components\/[^'"]+)['"]/);
  if (!importMatch) return;

  const componentName = importMatch[1];
  const componentPath = importMatch[2];

  content = content.replace(
    importMatch[0],
    `import dynamic from "next/dynamic";\n\nconst ${componentName} = dynamic(() => import("${componentPath}"), {\n  ssr: false,\n  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>\n});`
  );

  fs.writeFileSync(file, content, 'utf-8');
  console.log(`Updated ${file}`);
});
