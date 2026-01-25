const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'icon.svg');

async function generateIcons() {
  console.log('Reading SVG from:', svgPath);

  const svgBuffer = fs.readFileSync(svgPath);

  // Generate PNG icons
  const sizes = [
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
  ];

  for (const { name, size } of sizes) {
    const outputPath = path.join(publicDir, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Created: ${name} (${size}x${size})`);
  }

  // Generate favicon.ico (using 32x32 PNG as base - browsers support PNG favicons)
  const faviconPath = path.join(publicDir, 'favicon.ico');
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(faviconPath.replace('.ico', '.png'));

  // For proper .ico, we'll create a 32x32 PNG and rename it
  // Modern browsers support PNG favicons, but we'll create proper multi-size ico
  const favicon16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const favicon32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const favicon48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  // Create a simple ICO file (basic format)
  // ICO header: 6 bytes
  // ICO entry: 16 bytes per image
  // Then image data (PNG format is supported in ICO)

  const images = [
    { size: 16, buffer: favicon16 },
    { size: 32, buffer: favicon32 },
    { size: 48, buffer: favicon48 },
  ];

  // Calculate total size
  const headerSize = 6;
  const entrySize = 16 * images.length;
  let dataOffset = headerSize + entrySize;

  // ICO header
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // Reserved
  header.writeUInt16LE(1, 2);      // Type: 1 = ICO
  header.writeUInt16LE(images.length, 4);  // Number of images

  // Build entries and collect image data
  const entries = [];
  const imageBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 0);  // Width
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 1);  // Height
    entry.writeUInt8(0, 2);        // Color palette
    entry.writeUInt8(0, 3);        // Reserved
    entry.writeUInt16LE(1, 4);     // Color planes
    entry.writeUInt16LE(32, 6);    // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8);  // Image size
    entry.writeUInt32LE(dataOffset, 12);        // Image offset

    entries.push(entry);
    imageBuffers.push(img.buffer);
    dataOffset += img.buffer.length;
  }

  // Combine all parts
  const ico = Buffer.concat([header, ...entries, ...imageBuffers]);
  fs.writeFileSync(faviconPath, ico);
  console.log('Created: favicon.ico (16x16, 32x32, 48x48)');

  // Clean up the temporary PNG
  const tempPng = faviconPath.replace('.ico', '.png');
  if (fs.existsSync(tempPng)) {
    fs.unlinkSync(tempPng);
  }

  // Generate og-image.jpg (1200x630 - social media preview)
  // Create a simple branded image with the logo centered
  const ogWidth = 1200;
  const ogHeight = 630;
  const logoSize = 200;

  // Create background with brand color
  const ogImage = await sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 4,
      background: { r: 230, g: 57, b: 70, alpha: 1 }  // #e63946
    }
  })
  .composite([
    {
      input: await sharp(svgBuffer)
        .resize(logoSize, logoSize)
        .png()
        .toBuffer(),
      gravity: 'center'
    }
  ])
  .jpeg({ quality: 90 })
  .toFile(path.join(publicDir, 'og-image.jpg'));

  console.log('Created: og-image.jpg (1200x630)');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
