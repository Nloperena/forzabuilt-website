import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const SIZE_THRESHOLD = 500 * 1024; // 500KB

async function findLargeImages(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        await findLargeImages(filePath, results);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext) && stat.size > SIZE_THRESHOLD) {
        results.push({
          path: filePath,
          size: stat.size,
          ext: ext
        });
      }
    }
  }
  return results;
}

async function compressImages() {
  console.log('🔍 Scanning for images > 500KB in:', PUBLIC_DIR);
  const largeImages = await findLargeImages(PUBLIC_DIR);
  
  if (largeImages.length === 0) {
    console.log('✅ No large images found.');
    return;
  }
  
  console.log(`📊 Found ${largeImages.length} large images. Starting compression...`);
  
  let totalSaved = 0;
  
  for (const img of largeImages) {
    const webpPath = img.path.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    console.log(`Processing: ${path.relative(PUBLIC_DIR, img.path)} (${(img.size / 1024).toFixed(2)} KB)`);
    
    try {
      const info = await sharp(img.path)
        .webp({ quality: 80 })
        .toFile(webpPath);
      
      const saved = img.size - info.size;
      totalSaved += saved;
      
      console.log(`  ✅ Compressed to: ${path.basename(webpPath)} (${(info.size / 1024).toFixed(2)} KB) - Saved: ${(saved / 1024).toFixed(2)} KB (${(saved / img.size * 100).toFixed(1)}%)`);
      
      // If we want to replace the original, we could do:
      // fs.unlinkSync(img.path);
      // but usually better to keep both or let the user decide.
      // The instructions say "converting them to WebP format", implying new files.
    } catch (err) {
      console.error(`  ❌ Error processing ${img.path}:`, err.message);
    }
  }
  
  console.log(`\n🎉 Compression complete! Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
  console.log('💡 Note: Original files were kept. You should update your code to use the new .webp versions.');
}

compressImages().catch(console.error);

