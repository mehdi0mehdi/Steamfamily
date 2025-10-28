const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const docsIndex = path.join(repoRoot, 'docs', 'index.html');
const docs404 = path.join(repoRoot, 'docs', '404.html');

try {
  if (!fs.existsSync(docsIndex)) {
    console.error('docs/index.html not found. Did the Vite build complete?');
    process.exit(1);
  }

  fs.copyFileSync(docsIndex, docs404);
  console.log('Copied docs/index.html -> docs/404.html');
} catch (err) {
  console.error('Failed to copy index.html to 404.html:', err);
  process.exit(1);
}
