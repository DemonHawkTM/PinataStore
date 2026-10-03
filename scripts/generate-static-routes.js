import fs from 'fs';
import path from 'path';

/**
 * Post-build script to generate static directory entrypoints for SPA routes.
 * Ensures GitHub Pages and static web servers return HTTP 200 OK on deep links
 * instead of HTTP 404 (resolving critical search engine indexation issues).
 */
const distDir = path.resolve('dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexHtmlPath)) {
  const routes = ['shop', 'customize', 'contact', 'track', 'cart', 'checkout', 'wishlist'];
  const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

  for (const route of routes) {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), htmlContent);
    fs.writeFileSync(path.join(distDir, `${route}.html`), htmlContent);
  }
  console.log(`[SEO Post-Build] Generated static entrypoints for ${routes.length} deep routes (HTTP 200 OK): ${routes.join(', ')}`);
} else {
  console.warn('[SEO Post-Build] dist/index.html not found. Run vite build first.');
}
