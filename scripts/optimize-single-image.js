const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const RESPONSIVE_SIZES = [480, 800, 1400];

async function optimizeSingleImage(imagePath) {
  if (!fs.existsSync(imagePath)) {
    console.error(`Error: Image ${imagePath} does not exist.`);
    process.exit(1);
  }

  try {
    console.log(`Processing image: ${imagePath}`);
    
    const ext = path.extname(imagePath).toLowerCase();
    const baseName = path.basename(imagePath, ext);
    const outputDir = path.dirname(imagePath);
    
    // Create responsive versions
    for (const size of RESPONSIVE_SIZES) {
      const outputPath = path.join(
        outputDir,
        `${baseName}-${size}${ext}`
      );
      
      console.log(`Creating responsive image: ${outputPath}`);
      await sharp(imagePath)
        .resize(size)
        .jpeg({ quality: 85, mozjpeg: true })
        .png({ quality: 85, compressionLevel: 9 })
        .toFile(outputPath);
    }
    
    // Create size-specific WebP versions
    for (const size of RESPONSIVE_SIZES) {
      const sizedWebpPath = path.join(
        outputDir,
        `${baseName}-${size}.webp`
      );
      
      console.log(`Creating WebP image (${size}px): ${sizedWebpPath}`);
      await sharp(imagePath)
        .resize(size)
        .webp({ quality: 85 })
        .toFile(sizedWebpPath);
    }
    
    // Create size-specific AVIF versions
    for (const size of RESPONSIVE_SIZES) {
      const sizedAvifPath = path.join(
        outputDir,
        `${baseName}-${size}.avif`
      );
      
      console.log(`Creating AVIF image (${size}px): ${sizedAvifPath}`);
      await sharp(imagePath)
        .resize(size)
        .avif({ quality: 80 })
        .toFile(sizedAvifPath);
    }
    
    console.log('Image optimization complete!');
    
    // Print size comparison (800px variants)
    const originalSize = fs.statSync(imagePath).size;
    const webpSize = fs.statSync(path.join(outputDir, `${baseName}-800.webp`)).size;
    const avifSize = fs.statSync(path.join(outputDir, `${baseName}-800.avif`)).size;
    
    console.log('\nSize comparison (800px):');
    console.log(`Original: ${formatBytes(originalSize)}`);
    console.log(`WebP: ${formatBytes(webpSize)} (${Math.round((1 - webpSize/originalSize) * 100)}% smaller)`);
    console.log(`AVIF: ${formatBytes(avifSize)} (${Math.round((1 - avifSize/originalSize) * 100)}% smaller)`);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Get image path from command line
const imagePath = process.argv[2];

if (!imagePath) {
  console.error('Error: Please provide an image path.');
  console.log('Usage: node optimize-single-image.js path/to/image.jpg');
  process.exit(1);
}

optimizeSingleImage(imagePath);
