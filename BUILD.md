# 🌟 Wellbeing Tracker - Build Instrukce

## Ikona aplikace
Aplikace používá ikonu zářící hvězdy 🌟 uloženou v `build/icon.svg`.

## Build příkazy

### Pro aktuální platformu (Linux)
```bash
npm run build
```
Vytvoří instalátor pro aktuální platformu (Linux). Výstup: AppImage + DEB balíček v adresáři `release/`.

### Pro Linux
```bash
npm run build:linux
```
Vytvoří:
- `Wellbeing Tracker-1.0.0.AppImage` - přenosná aplikace
- `wellbeing-tracker_1.0.0_amd64.deb` - DEB balíček pro Debian/Ubuntu

### Pro Windows
```bash
npm run build:win
```
Vytvoří:
- `Wellbeing Tracker Setup 1.0.0.exe` - NSIS instalátor pro Windows

**Poznámka:** Pro build Windows aplikace z Linuxu potřebujete wine nainstalované.

### Pro macOS
```bash
npm run build:mac
```
Vytvoří:
- `Wellbeing Tracker-1.0.0.dmg` - DMG instalátor pro macOS

**Poznámka:** Pro build macOS aplikace potřebujete macOS systém nebo můžete použít cross-kompilaci (vyžaduje další nastavení).

### Pro všechny platformy
```bash
npm run build:all
```
Vytvoří instalátory pro Linux, Windows i macOS najednou.

### Testovací build (bez vytváření instalátoru)
```bash
npm run build:dir
```
Vytvoří pouze unpacked aplikaci v `release/linux-unpacked/` bez vytváření instalátoru. Užitečné pro rychlé testování.

## Výstupy

Všechny vytvořené instalátory a aplikace se nachází v adresáři `release/`:

```
release/
├── Wellbeing Tracker-1.0.0.AppImage          # Linux AppImage
├── wellbeing-tracker_1.0.0_amd64.deb        # Linux DEB
├── Wellbeing Tracker Setup 1.0.0.exe        # Windows instalátor
├── Wellbeing Tracker-1.0.0.dmg              # macOS instalátor
└── linux-unpacked/                          # Unpacked Linux aplikace (build:dir)
```

## Požadavky

- Node.js 18+
- npm nebo yarn
- Pro Windows build: wine (na Linuxu)
- Pro macOS build: macOS systém nebo cross-kompilace setup

## Vývoj

Pro spuštění aplikace ve vývojovém režimu:

```bash
npm run dev
```

Spustí Vite dev server a Electron aplikaci s hot reload.

## Ikona aplikace

Ikona aplikace je zářící hvězda 🌟 vytvořená jako SVG soubor v `build/icon.svg`.
Electron-builder automaticky konvertuje SVG na všechny potřebné formáty (ICO, ICNS, PNG) pro různé platformy.

### Změna ikony

Pokud chcete změnit ikonu:
1. Upravte nebo nahraďte soubor `build/icon.svg`
2. SVG soubor by měl být 512x512 px
3. Znovu spusťte build příkaz

## Konfigurace

Build konfigurace se nachází v `package.json` v sekci `"build"`.

Hlavní nastavení:
- **appId**: `com.wellbeing.tracker`
- **productName**: `Wellbeing Tracker`
- **icon**: `build/icon.svg`
- **output**: `release/`

## Troubleshooting

### Build selže s chybou ikony
- Ujistěte se, že `build/icon.svg` existuje
- Zkontrolujte, že SVG je validní
- Zkuste znovu spustit build

### Windows build na Linuxu nefunguje
- Nainstalujte wine: `sudo apt install wine64`
- Nebo použijte GitHub Actions / CI pro cross-platform build

### Nedostatek místa na disku
- Smazejte staré buildy: `rm -rf release/`
- Smazejte node_modules a znovu nainstalujte: `rm -rf node_modules && npm install`
