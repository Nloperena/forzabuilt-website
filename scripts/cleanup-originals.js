import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const BACKUP_DIR = path.resolve(__dirname, '../backup_assets');

function moveOriginals(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'backup_assets') {
        moveOriginals(filePath);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        if (fs.existsSync(webpPath)) {
          // We have a webp version, move the original to backup
          const relativePath = path.relative(PUBLIC_DIR, filePath);
          const destPath = path.join(BACKUP_DIR, relativePath);
          const destDir = path.dirname(destPath);
          
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          
          console.log(`Moving to backup: ${relativePath}`);
          fs.renameSync(filePath, destPath);
        }
      }
    }
  }
}

console.log('🚀 Starting cleanup of original images...');
moveOriginals(PUBLIC_DIR);
console.log('✅ Cleanup complete!');




