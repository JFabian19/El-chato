import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PLATOS_DIR = path.resolve('public/platos');
const BANNER_PATH = path.resolve('public/banner.png');
const OPTIMIZED_DIR = path.resolve('public/platos_optimized');
const MAX_WIDTH = 500; // Good for mobile displays
const QUALITY = 75; // WebP quality (0-100)
const BANNER_QUALITY = 70;
const BANNER_MAX_WIDTH = 800;

async function optimizeImages() {
  // Create output directory
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
  }

  // Get all image files
  const files = fs.readdirSync(PLATOS_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  console.log(`Found ${files.length} images to optimize...\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const inputPath = path.join(PLATOS_DIR, file);
    const baseName = path.basename(file, path.extname(file));
    const outputPath = path.join(PLATOS_DIR, `${baseName}.webp`);

    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    try {
      // If already webp, still re-compress it with our settings
      await sharp(inputPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outputPath === inputPath ? outputPath + '.tmp' : outputPath);

      // If the source was already .webp, replace it
      if (path.extname(file).toLowerCase() === '.webp') {
        if (fs.existsSync(outputPath + '.tmp')) {
          fs.unlinkSync(inputPath);
          fs.renameSync(outputPath + '.tmp', outputPath);
        }
      } else {
        // Delete original non-webp file
        fs.unlinkSync(inputPath);
      }

      const optimizedSize = fs.statSync(outputPath).size;
      totalOptimized += optimizedSize;

      const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
      console.log(`✓ ${file} → ${baseName}.webp | ${(originalSize / 1024).toFixed(0)}KB → ${(optimizedSize / 1024).toFixed(0)}KB (${savings}% smaller)`);
    } catch (err) {
      console.error(`✗ Error with ${file}:`, err.message);
      totalOptimized += originalSize; // count original if failed
    }
  }

  // Optimize banner
  console.log(`\nOptimizing banner...`);
  const bannerOriginal = fs.statSync(BANNER_PATH).size;
  totalOriginal += bannerOriginal;

  const bannerOutput = path.resolve('public/banner.webp');
  await sharp(BANNER_PATH)
    .resize({ width: BANNER_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: BANNER_QUALITY })
    .toFile(bannerOutput);

  fs.unlinkSync(BANNER_PATH);
  const bannerOptimized = fs.statSync(bannerOutput).size;
  totalOptimized += bannerOptimized;

  const bannerSavings = ((1 - bannerOptimized / bannerOriginal) * 100).toFixed(1);
  console.log(`✓ banner.png → banner.webp | ${(bannerOriginal / 1024).toFixed(0)}KB → ${(bannerOptimized / 1024).toFixed(0)}KB (${bannerSavings}% smaller)`);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`TOTAL: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Saved: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)}MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
  console.log(`${'='.repeat(60)}`);

  // Now update data.json with new paths
  console.log(`\nUpdating data.json paths...`);
  const dataPath = path.resolve('src/data.json');
  let dataContent = fs.readFileSync(dataPath, 'utf-8');

  // Replace all image extensions to .webp in paths
  dataContent = dataContent.replace(/\/platos\/([^"]+)\.(jpg|jpeg|png|webp)"/g, (match, name, ext) => {
    return `/platos/${name}.webp"`;
  });

  // Update banner
  dataContent = dataContent.replace(/banner\.png/g, 'banner.webp');

  fs.writeFileSync(dataPath, dataContent, 'utf-8');
  console.log(`✓ data.json updated with .webp paths`);
}

optimizeImages().catch(console.error);
