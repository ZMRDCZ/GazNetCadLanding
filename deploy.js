import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const initialCwd = process.cwd();

// Create a temporary directory with a shorter path
const tempDir = path.join(os.tmpdir(), 'gaznetcad-deploy');
const distDir = path.join(process.cwd(), 'dist');

console.log('🚀 Starting deployment...');

try {
  // Clean up any existing temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  // Create temp directory
  fs.mkdirSync(tempDir, { recursive: true });

  // Copy dist contents to temp directory
  console.log('📁 Copying build files to temporary directory...');
  execSync(`xcopy "${distDir}" "${tempDir}" /E /I /Y`, { stdio: 'inherit' });

  // Ensure 404.html exists for SPA routing
  const indexPath = path.join(tempDir, 'index.html');
  const notFoundPath = path.join(tempDir, '404.html');
  
  if (!fs.existsSync(notFoundPath)) {
    console.log('📄 Creating 404.html for SPA routing...');
    const notFoundContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>GazNetCAD - Газовые сети</title>
    <script type="text/javascript">
        // Single Page Apps for GitHub Pages
        // MIT License
        // https://github.com/rafgraph/spa-github-pages
        // This script takes the current url and converts the path and query
        // string into just a query string, and then redirects the browser
        // to the new url with only a query string and hash fragment.
        var pathSegmentsToKeep = 1;

        var l = window.location;
        l.replace(
            l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
            l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
            l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
            (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
            l.hash
        );
    </script>
</head>
<body>
    Redirecting to GazNetCAD...
</body>
</html>`;
    fs.writeFileSync(notFoundPath, notFoundContent);
  }

  // Change to temp directory and deploy
  console.log('🌐 Deploying to GitHub Pages...');
  process.chdir(tempDir);
  
  // Initialize git and deploy
  execSync('git init', { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
  execSync('git branch -M gh-pages', { stdio: 'inherit' });
  execSync('git remote add origin https://github.com/ZMRDCZ/GazNetCadLanding.git', { stdio: 'inherit' });
  execSync('git push -f origin gh-pages', { stdio: 'inherit' });

  console.log('✅ Deployment completed successfully!');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} finally {
  // Clean up
  console.log('🧹 Cleaning up...');
  process.chdir(initialCwd);
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('🗑️ Temporary directory removed.');
  }
} 