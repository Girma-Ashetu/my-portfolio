const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const exts = ['.png', '.jpg', '.jpeg'];
const sizes = [480, 768, 1024, 1600];

async function optimizeFile(filePath) {
  try {
    const { dir, name, ext } = path.parse(filePath);
    const input = path.join(dir, name + ext);
    const metadata = await sharp(input).metadata();
    const outDir = dir; // keep next to original

    // produce AVIF and WebP at multiple sizes, but not larger than original
    for (const size of sizes) {
      if (metadata.width && metadata.width < size) continue;
      const webpOut = path.join(outDir, `${name}-${size}.webp`);
      const avifOut = path.join(outDir, `${name}-${size}.avif`);

      await sharp(input)
        .resize({ width: size })
        .webp({ quality: 78 })
        .toFile(webpOut);

      await sharp(input)
        .resize({ width: size })
        .avif({ quality: 55 })
        .toFile(avifOut);

      console.log(`Wrote: ${webpOut}, ${avifOut}`);
    }

    // also write a baseline optimized webp at original size
    const webpOrig = path.join(outDir, `${name}.webp`);
    await sharp(input).webp({ quality: 82 }).toFile(webpOrig);
    console.log(`Wrote: ${webpOrig}`);
  } catch (err) {
    console.error('Error optimizing', filePath, err);
  }
}

async function walkAndOptimize(dir) {
  const items = fs.readdirSync(dir);
  for (const it of items) {
    const full = path.join(dir, it);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      await walkAndOptimize(full);
    } else if (stat.isFile()) {
      const ext = path.extname(full).toLowerCase();
      if (exts.includes(ext)) {
        const kb = stat.size / 1024;
        if (kb > 20) {
          console.log('Optimizing', full, Math.round(kb), 'KB');
          await optimizeFile(full);
        }
      }
    }
  }
}

walkAndOptimize(publicDir).then(()=>console.log('Done')).catch(e=>console.error(e));
