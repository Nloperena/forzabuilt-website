import fs from 'fs';
import path from 'path';

const productsData = JSON.parse(fs.readFileSync('./src/data/productsSimplified.json', 'utf8'));
const products = productsData.products;

// Create a mapping of old slugs to new canonical URLs
// We'll also try to match by ID if slug starts with ID
const slugMap = {};
products.forEach(p => {
  const id = p.id.toLowerCase();
  const category = p.category.toLowerCase();
  const canonical = `/products/${category}/${id}`;
  
  slugMap[id] = canonical;
});

function fixLinksInFile(filePath) {
  console.log(`Fixing links in ${filePath}...`);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Pattern 1: https://forzabuilt.com/product/slug/
  content = content.replace(/https:\/\/forzabuilt\.com\/product\/([a-z0-9-]+)\/?/g, (match, slug) => {
    // Try to find the ID in the slug
    // Many slugs start with the ID followed by a dash
    const parts = slug.split('-');
    // Try parts one by one to see if they are a valid ID
    for (let i = 1; i <= parts.length; i++) {
      const possibleId = parts.slice(0, i).join('-');
      if (slugMap[possibleId]) {
        return slugMap[possibleId];
      }
    }
    // Fallback: if it starts with /product/ just point to /products/
    return `/products/${slug}`;
  });

  // Pattern 2: /product/slug/
  content = content.replace(/\/product\/([a-z0-9-]+)\/?/g, (match, slug) => {
    const parts = slug.split('-');
    for (let i = 1; i <= parts.length; i++) {
      const possibleId = parts.slice(0, i).join('-');
      if (slugMap[possibleId]) {
        return slugMap[possibleId];
      }
    }
    return `/products/${slug}`;
  });

  // Pattern 3: /product-category/slug/
  content = content.replace(/\/product-category\/([a-z0-9-]+)\/?/g, (match, slug) => {
    if (slug === 'adhesives') return '/products/bond';
    if (slug === 'sealants') return '/products/seal';
    if (slug === 'tapes') return '/products/tape';
    if (slug === 'foam') return '/industries/insulation';
    return '/products';
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  - No changes in ${filePath}`);
  }
}

const filesToFix = [
  './src/data/blogPosts.json',
  './src/data/industrialDatasheet.ts',
  './src/data/constructionMapData.ts',
  './src/data/buildingMapData.ts',
  './src/data/industries/construction.ts',
  './src/data/industries/composites.ts',
  './src/data/industries/insulation.ts',
  './src/data/industries/transportation.ts',
  './src/data/industries/transportation-v2.ts',
  './src/data/industries/marine.ts'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    fixLinksInFile(file);
  } else {
    console.warn(`  ❌ File not found: ${file}`);
  }
});


