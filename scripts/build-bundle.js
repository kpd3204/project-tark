import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Step 1: Building Project Tark with Vite...');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

const distDir = path.join(rootDir, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');
let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

console.log('📦 Step 2: Inlining CSS and JS into Standalone HTML...');

// Find CSS file
const assetsDir = path.join(distDir, 'assets');
const assetFiles = fs.readdirSync(assetsDir);
const cssFile = assetFiles.find(f => f.endsWith('.css'));
const jsFile = assetFiles.find(f => f.endsWith('.js'));

if (!cssFile || !jsFile) {
  console.error('❌ Could not find compiled CSS or JS files in dist/assets!');
  process.exit(1);
}

const cssPath = path.join(assetsDir, cssFile);
const jsPath = path.join(assetsDir, jsFile);

const cssContent = fs.readFileSync(cssPath, 'utf8');
let jsContent = fs.readFileSync(jsPath, 'utf8');

// Replace /assets/ references in JS to ./assets/ so relative paths work offline or under subdirectories
jsContent = jsContent.replace(/\/assets\//g, './assets/');

// Remove original script and link tags from HTML
htmlContent = htmlContent.replace(/<link rel="stylesheet"[^>]*>/gi, '');
htmlContent = htmlContent.replace(/<script type="module"[^>]*><\/script>/gi, '');

// Inject inlined style and script into HTML head and body
const styleTag = `<style>\n${cssContent}\n</style>`;
const scriptTag = `<script type="module">\n${jsContent}\n</script>`;

htmlContent = htmlContent.replace('</head>', `${styleTag}\n</head>`);
htmlContent = htmlContent.replace('</body>', `${scriptTag}\n</body>`);

// Also fix relative paths in HTML
htmlContent = htmlContent.replace(/href="\/assets\//g, 'href="./assets/');
htmlContent = htmlContent.replace(/src="\/assets\//g, 'src="./assets/');

const standalonePathInDist = path.join(distDir, 'standalone.html');
fs.writeFileSync(standalonePathInDist, htmlContent, 'utf8');
console.log(`✅ Created standalone.html in dist: ${standalonePathInDist}`);

console.log('📂 Step 3: Compiling consolidated platform-bundle folder...');
const bundleDir = path.join(rootDir, 'platform-bundle');

if (fs.existsSync(bundleDir)) {
  fs.rmSync(bundleDir, { recursive: true, force: true });
}

fs.mkdirSync(bundleDir, { recursive: true });

// Copy dist to platform-bundle/dist
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy dist
copyRecursiveSync(distDir, path.join(bundleDir, 'dist'));

// Copy standalone.html directly to root of platform-bundle
fs.writeFileSync(path.join(bundleDir, 'index.html'), htmlContent, 'utf8');
fs.writeFileSync(path.join(bundleDir, 'standalone.html'), htmlContent, 'utf8');

// Copy public assets into platform-bundle/assets and platform-bundle/dist
copyRecursiveSync(assetsDir, path.join(bundleDir, 'assets'));

// Copy source files into platform-bundle/src for reference
if (fs.existsSync(path.join(rootDir, 'src'))) {
  copyRecursiveSync(path.join(rootDir, 'src'), path.join(bundleDir, 'src'));
}

// Copy configuration files
const filesToCopy = ['package.json', 'vite.config.ts', 'tsconfig.json', 'README.md'];
filesToCopy.forEach(file => {
  const srcFile = path.join(rootDir, file);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, path.join(bundleDir, file));
  }
});

// Create Deployment README
const deployReadmeContent = `# Project Tark Platform - Deployment Bundle

This bundle contains all compiled files, source code, and assets for **Project Tark Platform**.

## 🚀 Quick Deployment Options

### Option 1: Single Standalone HTML File
- \`standalone.html\` (or \`index.html\` in this folder) is a **complete self-contained standalone build**.
- You can drag-and-drop \`standalone.html\` or the \`platform-bundle\` folder directly onto services like:
  - **Netlify Drop**: https://app.netlify.com/drop
  - **Vercel CLI / Web**: \`vercel\`
  - **GitHub Pages**: Upload contents to \`gh-pages\` branch or \`/docs\` folder.
  - **Cloudflare Pages**: Drag and drop \`platform-bundle\` folder.
  - **Surge.sh**: \`surge ./platform-bundle\`

### Option 2: Full Web Server Distribution
- The \`dist/\` directory contains the complete Vite production build.
- Point your web server root (Nginx, Apache, Caddy, Cloudflare, S3, Netlify, Vercel) to \`dist/\` or \`platform-bundle/\`.

## 🛠 Local Development & Testing
- To run locally using Node.js:
  \`\`\`bash
  npm i
  npm run dev
  \`\`\`
- To preview the production bundle locally:
  \`\`\`bash
  npx vite preview
  \`\`\`

## 📄 Contents
- \`standalone.html\` / \`index.html\`: Inlined single-file hostable version of the platform.
- \`dist/\`: Minified HTML, CSS, JS, and image assets.
- \`assets/\`: PNG, GIF, and photo media files used across pages.
- \`src/\`: Complete TypeScript and React source codebase.
- \`README.md\`: Deployment instructions and project details.
`;

fs.writeFileSync(path.join(bundleDir, 'README.md'), deployReadmeContent, 'utf8');

console.log('🗜 Step 4: Creating ZIP archive of platform-bundle...');
try {
  const zipPath = path.join(rootDir, 'project-tark-platform-bundle.zip');
  execSync(`zip -r "${zipPath}" platform-bundle`, { cwd: rootDir, stdio: 'inherit' });
  console.log(`🎉 Created ZIP Archive: ${zipPath}`);
} catch (err) {
  console.warn('Notice: ZIP command not available or failed:', err.message);
}

console.log('\n✨ Compilation finished successfully!');
