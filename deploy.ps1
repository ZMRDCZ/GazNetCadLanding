# PowerShell deployment script for GazNetCad
Write-Host "🚀 Starting GazNetCad deployment..." -ForegroundColor Green

try {
    # Build the project
    Write-Host "📦 Building project..." -ForegroundColor Yellow
    npm run build:gh-pages
    
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
    
    # Create temporary directory with short path
    $tempDir = Join-Path $env:TEMP "gaznetcad-deploy"
    $distDir = Join-Path (Get-Location) "dist"
    
    # Clean up existing temp directory
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
    
    # Create temp directory
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    
    # Copy dist contents
    Write-Host "📁 Copying build files..." -ForegroundColor Yellow
    Copy-Item -Path "$distDir\*" -Destination $tempDir -Recurse -Force
    
    # Change to temp directory
    Push-Location $tempDir
    
    # Initialize git and deploy
    Write-Host "🌐 Deploying to GitHub Pages..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Deploy to GitHub Pages"
    git branch -M gh-pages
    git remote add origin https://github.com/ZMRDCZ/GazNetCadLanding.git
    git push -f origin gh-pages
    
    # Return to original directory
    Pop-Location
    
    # Clean up
    Remove-Item $tempDir -Recurse -Force
    
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 