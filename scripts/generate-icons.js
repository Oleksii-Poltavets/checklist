const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputSvg = path.join(__dirname, '..', 'public', 'icons', 'placeholder.svg');
const outDir = path.join(__dirname, '..', 'public', 'icons');

const sizes = [48,72,96,128,144,152,192,384,512];

async function generate() {
  if (!fs.existsSync(inputSvg)) {
    console.error('Source SVG not found:', inputSvg);
    process.exit(1);
  }
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Generating icons from', inputSvg);
  for (const s of sizes) {
    const out = path.join(outDir, `icon-${s}x${s}.png`);
    await sharp(inputSvg).resize(s, s).png().toFile(out);
    console.log('Written', out);
  }

  // apple touch
  await sharp(inputSvg).resize(180, 180).png().toFile(path.join(outDir, 'apple-touch-icon.png'));
  console.log('Written apple-touch-icon.png');

  // maskable (512)
  await sharp(inputSvg).resize(512, 512).png().toFile(path.join(outDir, 'maskable-icon-512x512.png'));
  // standard 512
  await sharp(inputSvg).resize(512, 512).png().toFile(path.join(outDir, 'icon-512x512.png'));
  console.log('Written maskable and 512 icons');

  console.log('Done');
}

generate().catch(err => { console.error(err); process.exit(1); });
