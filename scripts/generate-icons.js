import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, isMaskable = false) {
  // RGBA buffer: 4 bytes per pixel + 1 filter byte per scanline
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.min(width, height) / 2;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep Charcoal Background: #111827 (17, 24, 39)
      let r = 17;
      let g = 24;
      let b = 39;
      let a = 255;

      // Outer border / hazard ring (Alert Amber #F59E0B = 245, 158, 11)
      const ringRadius = isMaskable ? maxR * 0.75 : maxR * 0.88;
      if (Math.abs(dist - ringRadius) < Math.max(2, width * 0.015)) {
        r = 245;
        g = 158;
        b = 11;
      }

      // Inner danger glow (Safety Crimson #EF4444 = 239, 68, 68)
      const innerRadius = isMaskable ? maxR * 0.5 : maxR * 0.6;
      if (Math.abs(dist - innerRadius) < Math.max(1.5, width * 0.01)) {
        r = 239;
        g = 68;
        b = 68;
      }

      // Lightning bolt shape
      // Normalize to [-1, 1] relative to center
      const nx = dx / (maxR * (isMaskable ? 0.65 : 0.75));
      const ny = dy / (maxR * (isMaskable ? 0.65 : 0.75));

      // Check if point is inside lightning bolt polygon
      // Vertices roughly: (0.1, -0.8), (-0.4, 0), (0, 0), (-0.2, 0.8), (0.4, -0.1), (0, -0.1)
      const inUpperBolt = ny >= -0.75 && ny <= 0.05 && nx >= -0.35 + (ny + 0.75) * 0.1 && nx <= 0.15 - (ny + 0.75) * 0.2;
      const inLowerBolt = ny >= -0.05 && ny <= 0.75 && nx >= -0.25 + (ny + 0.05) * 0.35 && nx <= 0.35 - (ny + 0.05) * 0.1;
      const inCenterTie = ny >= -0.15 && ny <= 0.15 && nx >= -0.3 && nx <= 0.25;

      if (inUpperBolt || inLowerBolt || inCenterTie) {
        // Golden Amber / Yellow gradient in bolt
        r = 250;
        g = 204;
        b = 21;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // Compress with deflate
  const compressedData = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT Chunk
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeInt32BE(crc, 8 + len);
  return chunk;
}

// Standard CRC32 implementation
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return crc ^ -1;
}

const crcTable = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. pwa-192x192.png
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, false));
console.log('Created public/pwa-192x192.png');

// 2. pwa-512x512.png
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, false));
console.log('Created public/pwa-512x512.png');

// 3. pwa-maskable-512x512.png (with safe-zone margin)
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));
console.log('Created public/pwa-maskable-512x512.png');

// 4. apple-touch-icon.png (180x180)
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, false));
console.log('Created public/apple-touch-icon.png');

// 5. favicon.ico (copy 192 png as icon or minimal icon)
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPNG(64, 64, false));
console.log('Created public/favicon.ico');
