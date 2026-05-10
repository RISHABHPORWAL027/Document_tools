const fs = require('fs');
const { execSync } = require('child_process');

const files = [
  'src/app/api/pvt-ltd/auditor-casual-vacancy/egm-resolution/docx/route.ts',
  'src/app/api/pvt-ltd/auditor-casual-vacancy/appointment-letter/docx/route.ts',
  'src/app/api/pvt-ltd/auditor-casual-vacancy/eligibility-letter/docx/route.ts',
  'src/app/api/llp/mrl/docx/route.ts'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  // Replace \` with `
  // Replace \${ with ${
  content = content.replace(/\\`/g, '`').replace(/\\\$\{/g, '${');
  fs.writeFileSync(file, content, 'utf-8');
  console.log(`Fixed ${file}`);
});
