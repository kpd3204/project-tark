# Project Tark Platform - Deployment Bundle

This bundle contains all compiled files, source code, and assets for **Project Tark Platform**.

## 🚀 Quick Deployment Options

### Option 1: Single Standalone HTML File
- `standalone.html` (or `index.html` in this folder) is a **complete self-contained standalone build**.
- You can drag-and-drop `standalone.html` or the `platform-bundle` folder directly onto services like:
  - **Netlify Drop**: https://app.netlify.com/drop
  - **Vercel CLI / Web**: `vercel`
  - **GitHub Pages**: Upload contents to `gh-pages` branch or `/docs` folder.
  - **Cloudflare Pages**: Drag and drop `platform-bundle` folder.
  - **Surge.sh**: `surge ./platform-bundle`

### Option 2: Full Web Server Distribution
- The `dist/` directory contains the complete Vite production build.
- Point your web server root (Nginx, Apache, Caddy, Cloudflare, S3, Netlify, Vercel) to `dist/` or `platform-bundle/`.

## 🛠 Local Development & Testing
- To run locally using Node.js:
  ```bash
  npm i
  npm run dev
  ```
- To preview the production bundle locally:
  ```bash
  npx vite preview
  ```

## 📄 Contents
- `standalone.html` / `index.html`: Inlined single-file hostable version of the platform.
- `dist/`: Minified HTML, CSS, JS, and image assets.
- `assets/`: PNG, GIF, and photo media files used across pages.
- `src/`: Complete TypeScript and React source codebase.
- `README.md`: Deployment instructions and project details.
