import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  site: 'https://www.forzabuilt.com',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://forza-product-managementsystem-b7c3ff8d3d2d.herokuapp.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path,
        },
      },
    },
  },
  output: 'static',
  // SEO-friendly trailing slash handling
  trailingSlash: 'ignore',
});
