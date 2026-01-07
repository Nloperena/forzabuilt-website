import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
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
  adapter: vercel({
    imageService: true, // Enable Vercel's native image optimization
    imagesConfig: {
      sizes: [64, 128, 256, 384, 512, 640, 750, 828, 1080, 1200, 1920, 2048],
      domains: ['jw4to4yw6mmciodr.public.blob.vercel-storage.com', 'www.forzabuilt.com', 'forzabuilt.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'jw4to4yw6mmciodr.public.blob.vercel-storage.com',
        },
      ],
    },
  }),
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
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jw4to4yw6mmciodr.public.blob.vercel-storage.com',
      },
    ],
  },
});
