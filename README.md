# GazNetCAD Landing Page

Modern interactive UI for GazNetCAD gas distribution network design platform.

## 🚀 Features

- Vue 3 with TypeScript
- 3D visualization with Three.js
- Interactive pipeline design
- Real-time calculations
- Modern responsive UI
- KPI dashboards
- Project management tools

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

### GitHub Pages (Automatic)

The site is automatically deployed to GitHub Pages when you push to the `main` or `master` branch.

**Manual deployment:**
```bash
npm run deploy
```

### Manual Deployment

1. Build the project:
```bash
npm run build:gh-pages
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

## 🔧 Configuration

- **Base URL**: Configured for GitHub Pages at `/GazNetCadLanding/`
- **Build Output**: `dist/` directory
- **Framework**: Vue 3 + Vite + TypeScript

## 📁 Project Structure

```
src/
├── components/     # Vue components
├── views/         # Page components
├── stores/        # Pinia stores
├── router/        # Vue Router configuration
├── styles/        # Global styles
└── plugins/       # Vue plugins
```

## 🎨 Technologies

- **Frontend**: Vue 3, TypeScript, Vite
- **Styling**: SCSS, CSS Custom Properties
- **3D Graphics**: Three.js
- **Animations**: GSAP
- **State Management**: Pinia
- **Routing**: Vue Router
- **Charts**: Chart.js
- **Icons**: Lucide Vue

## 📄 License

MIT License - see LICENSE file for details. 