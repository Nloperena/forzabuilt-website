import fs from 'fs';
import path from 'path';

const datasheetPath = './src/data/industrialDatasheet.ts';

function fixLinks() {
  console.log('Fixing links in industrialDatasheet.ts...');
  let content = fs.readFileSync(datasheetPath, 'utf8');
  
  // Find all objects in the array
  // We'll use a regex to match the objects and replace the URL field based on ID and category
  // This is safer than a global string replace which might catch text in descriptions
  
  const lines = content.split('\n');
  let currentId = '';
  let currentCategory = '';
  
  const fixedLines = lines.map(line => {
    // Extract ID
    const idMatch = line.match(/"id":\s*"([^"]+)"/);
    if (idMatch) {
      currentId = idMatch[1];
    }
    
    // Extract Category
    const categoryMatch = line.match(/"category":\s*"([^"]+)"/);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].toLowerCase();
    }
    
    // Replace URL
    const urlMatch = line.match(/"url":\s*"https:\/\/forzabuilt\.com\/product\/[^"]+"/);
    if (urlMatch && currentId && currentCategory) {
      return line.replace(/"url":\s*"https:\/\/forzabuilt\.com\/product\/[^"]+"/, `"url": "/products/${currentCategory}/${currentId}"`);
    }
    
    // Also catch relative links starting with /product/
    const relUrlMatch = line.match(/"url":\s*"\/(?:product|products)\/[^"]+"/);
    if (relUrlMatch && currentId && currentCategory) {
      return line.replace(/"url":\s*"\/(?:product|products)\/[^"]+"/, `"url": "/products/${currentCategory}/${currentId}"`);
    }
    
    return line;
  });
  
  fs.writeFileSync(datasheetPath, fixedLines.join('\n'));
  console.log('Links fixed successfully!');
}

fixLinks();

