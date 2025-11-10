#!/usr/bin/env node

/**
 * Creates a 512x512 PNG icon from SVG or ICO for Linux/macOS builds
 * Uses the SVG file as source to create a proper size icon
 */

import fs from 'fs';
import { execSync } from 'child_process';

const iconPath = 'build/icon.png';
const svgPath = 'build/icon.svg';
const icoPath = 'build/icon.ico';

// Check if icon.png already exists and is large enough
if (fs.existsSync(iconPath)) {
  console.log('✓ build/icon.png already exists');
  process.exit(0);
}

// Try to use SVG as source (best quality)
if (fs.existsSync(svgPath)) {
  console.log('🎨 Creating PNG from SVG...');

  // Try different SVG conversion tools
  const converters = [
    { cmd: 'rsvg-convert', args: `-w 512 -h 512 ${svgPath} -o ${iconPath}` },
    { cmd: 'inkscape', args: `${svgPath} --export-type=png --export-filename=${iconPath} -w 512 -h 512` },
    { cmd: 'convert', args: `-background none -resize 512x512 ${svgPath} ${iconPath}` },
  ];

  let success = false;
  for (const converter of converters) {
    try {
      execSync(`which ${converter.cmd}`, { stdio: 'ignore' });
      execSync(`${converter.cmd} ${converter.args}`, { stdio: 'inherit' });
      console.log(`✓ Created 512x512 PNG using ${converter.cmd}`);
      success = true;
      break;
    } catch (e) {
      // Try next converter
    }
  }

  if (success) {
    process.exit(0);
  }
}

// Try to use ICO as source
if (fs.existsSync(icoPath)) {
  console.log('🖼️  Creating PNG from ICO...');

  try {
    execSync('which convert', { stdio: 'ignore' });
    execSync(`convert ${icoPath}[0] -resize 512x512 ${iconPath}`, { stdio: 'inherit' });
    console.log('✓ Created 512x512 PNG using ImageMagick');
    process.exit(0);
  } catch (e) {
    // ImageMagick not available
  }
}

// Fallback: Create a simple 512x512 PNG placeholder
console.log('⚠️  No SVG converter found, creating basic placeholder');
console.log('   Install one of: rsvg-convert, inkscape, or imagemagick for better quality');

// Create a minimal 512x512 PNG (1x1 transparent will be scaled)
const minimalPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

fs.writeFileSync(iconPath, minimalPNG);
console.log('⚠️  Created placeholder icon.png (1x1 transparent)');
console.log('');
console.log('   📌 For production builds, install one of these:');
console.log('      • Ubuntu/Debian: sudo apt-get install librsvg2-bin');
console.log('      • macOS: brew install librsvg');
console.log('      • Or: sudo apt-get install imagemagick');
