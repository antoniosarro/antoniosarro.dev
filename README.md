<div align="center">
  <h1>antoniosarro.dev</h1>
  <p><strong>A high-performance portfolio & blog built from scratch</strong></p>
  <p>Because using a template is like ordering pizza when you're a chef 🍕</p>

  <br />

  ![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

  <br />

  [Live Site](https://antoniosarro.dev) • [Blog](https://antoniosarro.dev/blogs) • [Changelog](https://antoniosarro.dev/changelog)
</div>

---

## ✨ Features

- **🏗️ Static Generation** — Pre-rendered at build time, served at the speed of light
- **🌙 Midnight Rebuilds** — Fresh data every night via CI/CD (GitHub contributions, project stats)
- **📝 Custom MDX Pipeline** — Syntax highlighting, line numbers, copy buttons, and diff annotations
- **🔤 Font Optimization** — 66% smaller fonts via pyftsubset character extraction
- **🖼️ Image Optimization** — AVIF/WebP generation with lazy loading
- **📚 Blog Series** — Multi-part articles with navigation and progress tracking
- **🎨 Dark/Light Theme** — System-aware with smooth transitions
- **💬 Comments** — Giscus integration (GitHub Discussions powered)
- **📊 Analytics** — Self-hosted Umami (privacy-first)
- **🔍 SEO Ready** — Sitemap, RSS feed, Open Graph, Twitter Cards

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| Styling | Tailwind CSS 4 |
| Content | Custom MDX processor (unified/rehype/shiki) |
| Deployment | Docker + Nginx |
| CI/CD | GitHub Actions + Komodo |
| Dev Environment | Nix Flake |

## 🚀 Quick Start

### Prerequisites

- Node.js 25+
- pnpm 10+
- Python 3 (for font optimization)

### Using Nix (Recommended)
```bash
# Clone and enter the directory (direnv auto-loads the environment)
git clone https://github.com/antoniosarro/antoniosarro.dev.git
cd antoniosarro.dev

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Manual Setup
```bash
# Install font tools
pip install fonttools brotli zopfli

# Install dependencies
pnpm install

# Development
pnpm run dev

# Production build (with optimizations)
pnpm run build:prod
```

## 📁 Project Structure
```
├── blog/                 # MDX blog posts
├── assets/
│   ├── fonts/           # Source fonts (pre-optimization)
│   └── images/          # Source images (pre-optimization)
├── scripts/
│   ├── build/           # Font & image optimization
│   ├── changelog/       # Auto-changelog generation
│   └── vite-plugins/    # Custom Vite plugins
├── src/
│   ├── lib/
│   │   ├── components/  # Svelte components
│   │   ├── data/        # Static data (projects, socials, etc.)
│   │   ├── mdx/         # MDX processor
│   │   ├── services/    # Data fetching (GitHub, blog)
│   │   ├── stores/      # Svelte stores
│   │   └── utils/       # Utility functions
│   └── routes/          # SvelteKit pages
└── static/              # Static assets (output)
```

## 🔧 Available Commands
```bash
# Development
pnpm run dev              # Start dev server
pnpm run check            # TypeScript check
pnpm run lint             # ESLint
pnpm run format           # Prettier

# Build
pnpm run build            # Standard build
pnpm run build:prod       # Production build (with optimizations)
pnpm run preview          # Preview production build

# Optimization
pnpm run optimize:images  # Generate AVIF/WebP variants
pnpm run optimize:fonts   # Subset fonts to used characters
```

## 🐳 Docker
```bash
# Build and run
docker compose up -d

# Production deployment
docker compose -f docker-compose.prod.yaml up -d
```

## 📄 License

This project is open source. Feel free to steal ideas, but maybe give credit? 😉

---

<div align="center">
  <sub>Built with 🖤 and an unhealthy amount of ☕ by <a href="https://antoniosarro.dev">Antonio Sarro</a></sub>
</div>