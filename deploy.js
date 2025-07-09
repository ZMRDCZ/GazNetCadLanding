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