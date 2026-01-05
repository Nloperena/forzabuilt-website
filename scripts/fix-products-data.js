import fs from 'fs';
import path from 'path';

const productsDataPath = './src/data/productsData.ts';

function fixProductsData() {
  if (!fs.existsSync(productsDataPath)) return;
  console.log(`Fixing links in ${productsDataPath}...`);
  let content = fs.readFileSync(productsDataPath, 'utf8');
  
  // Replace full product URLs with root-relative /products/ links
  content = content.replace(/url: 'https:\/\/forzabuilt\.com\/product\/([a-z0-9-]+)\/'/g, "url: '/products/$1'");
  
  fs.writeFileSync(productsDataPath, content);
  console.log('  ✅ Updated productsData.ts');
}

fixProductsData();

