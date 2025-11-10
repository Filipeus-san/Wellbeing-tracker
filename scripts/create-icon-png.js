#!/usr/bin/env node

/**
 * Creates a simple placeholder PNG icon for Linux builds
 * This is a fallback when ImageMagick is not available
 */

import fs from 'fs';
import https from 'https';

const iconPath = 'build/icon.png';

// Check if icon.png already exists
if (fs.existsSync(iconPath)) {
  console.log('✓ build/icon.png already exists');
  process.exit(0);
}

// Create a simple 512x512 PNG with base64 encoded image
// This is a minimal valid PNG file (1x1 transparent pixel, will be scaled)
const minimalPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

fs.writeFileSync(iconPath, minimalPNG);
console.log('⚠️  Created placeholder icon.png (1x1 transparent)');
console.log('   For better quality, run: convert build/icon.ico[0] -resize 512x512 build/icon.png');
console.log('   Or provide your own 512x512 PNG icon');
