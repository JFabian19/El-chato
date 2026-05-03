import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PLATOS_DIR = path.resolve('public/platos');
const MAX_WIDTH = 500;
const QUALITY = 75;

// These are .webp files that failed due to EBUSY (file lock) - we need to re-optimize them
const filesToOptimize = [
  'Chicharrones de pescado.webp',
  'Dúo carretillero 1.webp',
  'Dúo carretillero 3.webp',
  'Dúo carretillero 9.webp',
  'Fuente de chicharrón mixto.webp',
  'Leche de tigre de pota.webp',
  'Maretazo 2.webp',
  'Sudado de Merluza.webp',
];

async function optimizeRemaining() {
  for (const file of filesToOptimize) {
    const inputPath = path.join(PLATOS_DIR, file);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠ File not found: ${file}`);
      continue;
    }

    const originalSize = fs.statSync(inputPath).size;
    const tmpPath = inputPath + '.optimized.webp';

    try {
      // Read into buffer first to avoid file lock issues
      const buffer = fs.readFileSync(inputPath);
      
      const optimized = await sharp(buffer)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();

      // Write to temp, then replace
      fs.writeFileSync(tmpPath, optimized);
      fs.unlinkSync(inputPath);
      fs.renameSync(tmpPath, inputPath);

      const newSize = optimized.length;
      const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
      console.log(`✓ ${file} | ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller)`);
    } catch (err) {
      console.error(`✗ Error with ${file}:`, err.message);
      // Clean up temp if exists
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }
  }
}

optimizeRemaining().catch(console.error);
