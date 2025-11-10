# 🌟 Wellbeing Tracker - Build Instructions

## Application Icon
The application uses a shining star icon 🌟 stored in `build/icon.svg`.

## Build Commands

### For Current Platform (Linux)
```bash
npm run build
```
Creates an installer for the current platform (Linux). Output: AppImage + DEB package in the `release/` directory.

### For Linux
```bash
npm run build:linux
```
Creates:
- `Wellbeing Tracker-1.0.0.AppImage` - portable application
- `wellbeing-tracker_1.0.0_amd64.deb` - DEB package for Debian/Ubuntu

### For Windows
```bash
npm run build:win
```
Creates:
- `Wellbeing Tracker Setup 1.0.0.exe` - NSIS installer for Windows

**Note:** To build a Windows application from Linux, you need wine installed.

### For macOS
```bash
npm run build:mac
```
Creates:
- `Wellbeing Tracker-1.0.0.dmg` - DMG installer for macOS

**Note:** To build a macOS application, you need a macOS system or can use cross-compilation (requires additional setup).

### For All Platforms
```bash
npm run build:all
```
Creates installers for Linux, Windows, and macOS at once.

### Test Build (without creating installer)
```bash
npm run build:dir
```
Creates only the unpacked application in `release/linux-unpacked/` without creating an installer. Useful for quick testing.

## Output Files

All created installers and applications are located in the `release/` directory:

```
release/
├── Wellbeing Tracker-1.0.0.AppImage          # Linux AppImage
├── wellbeing-tracker_1.0.0_amd64.deb        # Linux DEB
├── Wellbeing Tracker Setup 1.0.0.exe        # Windows installer
├── Wellbeing Tracker-1.0.0.dmg              # macOS installer
└── linux-unpacked/                          # Unpacked Linux app (build:dir)
```

## Requirements

- Node.js 18+
- npm or yarn
- For Windows build: wine (on Linux)
- For macOS build: macOS system or cross-compilation setup

## Development

To run the application in development mode:

```bash
npm run dev
```

Starts Vite dev server and Electron application with hot reload.

## Application Icon

The application icon is a shining star 🌟 created as an SVG file in `build/icon.svg`.
Electron-builder automatically converts the SVG to all necessary formats (ICO, ICNS, PNG) for different platforms.

### Changing the Icon

If you want to change the icon:
1. Edit or replace the `build/icon.svg` file
2. The SVG file should be 512x512 px
3. Run the build command again

## Configuration

Build configuration is located in `package.json` in the `"build"` section.

Main settings:
- **appId**: `com.wellbeing.tracker`
- **productName**: `Wellbeing Tracker`
- **icon**: `build/icon.svg`
- **output**: `release/`

## Troubleshooting

### Build fails with icon error
- Make sure `build/icon.svg` exists
- Check that the SVG is valid
- Try running the build again

### Windows build on Linux doesn't work
- Install wine: `sudo apt install wine64`
- Or use GitHub Actions / CI for cross-platform builds

### Not enough disk space
- Delete old builds: `rm -rf release/`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
