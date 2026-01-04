# ForzaBuilt Website

Official website for ForzaBuilt - Industrial adhesives, sealants, and tapes solutions.

## Overview

This is the corporate website for ForzaBuilt, showcasing industrial adhesive, sealant, and tape solutions across multiple industries including transportation, marine, construction, and manufacturing.

## Tech Stack

- **Framework**: Astro
- **UI Library**: React
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Build Tool**: Vite

## Project Structure

```
/
├── public/          # Static assets (images, videos, documents)
├── src/
│   ├── components/  # React and Astro components
│   ├── pages/      # Route pages
│   ├── layouts/     # Page layouts
│   ├── data/       # Static data files
│   ├── services/   # API and service integrations
│   ├── styles/     # Global styles and CSS
│   ├── types/      # TypeScript type definitions
│   └── utils/      # Utility functions
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nloperena/forzabuilt-website.git
cd forzabuilt-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro ...` | Run Astro CLI commands |

## Features

- Industry-specific product showcases
- Interactive X-Ray product exploration
- Product catalog with filtering and search
- Blog system with SEO optimization
- Responsive design for all devices
- Performance optimized with Astro's static generation

## Key Pages

- **Home**: Main landing page with hero video and product overview
- **Industries**: Industry-specific pages (Industrial, Transportation, Marine, Construction, etc.)
- **Products**: Product catalog organized by category (Bond, Seal, Tape)
- **Blog**: Company news and product information
- **Contact**: Contact information and forms
- **Tools**: Interactive product selection and compatibility tools

## API Integration

The site integrates with the ForzaBuilt product management system API hosted on Heroku for dynamic product data.

## Deployment

The site is built as static HTML and can be deployed to any static hosting service such as:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## License

Proprietary - ForzaBuilt

## Contact

For questions or support, please contact the development team.
