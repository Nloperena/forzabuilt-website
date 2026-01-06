import sharp from 'sharp';
import fs from 'fs';

async function convert() {
  const files = [
    'public/logos/Composite-Icon.png',
    'public/logos/Insulation-Icon.png'
  ];

  for (const file of files) {
    const webp = file.replace('.png', '.webp');
    console.log(`Converting ${file} to ${webp}`);
    await sharp(file).webp().toFile(webp);
  }
}

convert().catch(console.error);


