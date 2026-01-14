import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = 'public/images/homepage-heroes/industrial-hero.png';
const outputPath = 'public/images/homepage-heroes/industrial-hero.webp';

async function convert() {
  console.log(`Converting ${inputPath} to ${outputPath}...`);
  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(`Successfully converted to WebP`);
  } catch (err) {
    console.error(`Error converting:`, err);
  }
}

convert();


