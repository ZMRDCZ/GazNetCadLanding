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
    
    # Ensure 404.html exists for SPA routing
    $notFoundPath = Join-Path $tempDir "404.html"
    if (-not (Test-Path $notFoundPath)) {
        Write-Host "📄 Creating 404.html for SPA routing..." -ForegroundColor Yellow
        $notFoundContent = @"
<!DOCTYPE html>
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
</html>
"@
        Set-Content -Path $notFoundPath -Value $notFoundContent -Encoding UTF8
    }
    
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