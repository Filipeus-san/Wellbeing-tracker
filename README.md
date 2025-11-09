# 🌟 Wellbeing Tracker - Desktop Aplikace

Moderní **desktopová aplikace** pro sledování duševní pohody postavená na **Electron + React + TypeScript**. Využívá psychologické modely **Maslow**, **SDT** (Self-Determination Theory) a **PERMA** pro komplexní měření wellbeingu.

> **📱 Electron Verze**: Toto je desktopová verze aplikace. Data jsou ukládána lokálně na vašem počítači.
>
> **📖 Podrobný návod pro Electron**: Viz [README-ELECTRON.md](./README-ELECTRON.md)

## ✨ Hlavní funkce

### 📝 Denní dotazník
- 13 otázek pokrývajících všechny oblasti wellbeingu
- Hodnocení na škále 1-5 s barevným označením
- Prostor pro osobní poznámky
- **🤖 AI denní shrnutí a doporučení** (po dokončení dotazníku)
- Uložení do LocalStorage pro offline přístup
- Možnost vyplnění pro libovolné datum

### 📊 Týdenní shrnutí
- Automatické generování týdenních statistik
- **Vizualizace dat**:
  - Radar graf pro celkový přehled kategorií
  - Bar graf pro kritické oblasti
  - Detailní přehled všech otázek s barevným označením
- **Identifikace kritických oblastí** (skóre < 2.5)
- **Doporučené mikro-akce** pro zlepšení wellbeingu

### 🤖 Claude AI Integrace (volitelné)
- Personalizovaná shrnutí od AI kouče
- Doporučení založená na vašich datech
- Bezpečné uložení API klíče v LocalStorage
- Možnost zapnutí/vypnutí integrace

### ⚙️ Nastavení a správa dat
- Export dat do JSON (záloha)
- Import dat ze zálohy
- Smazání všech dat
- Nastavení Claude API klíče
- Test API klíče

## 🎯 Psychologické modely

### Maslow - Hierarchie potřeb
1. **Fyziologické potřeby** - spánek, jídlo, odpočinek
2. **Bezpečí** - finance, zdraví, bydlení
3. **Sounáležitost** - spojení s lidmi
4. **Sebeúcta** - sebevědomí, úspěchy
5. **Seberealizace** - osobní růst, potenciál

### SDT - Self-Determination Theory
1. **Autonomie** - svoboda rozhodování
2. **Kompetence** - pocit schopnosti
3. **Sounáležitost** - podpora od druhých

### PERMA - Model wellbeingu
1. **Pozitivní emoce** - radost, klid, nadšení
2. **Engagement** - flow stavy, ponoření
3. **Vztahy** - kvalita interakcí
4. **Smysl** - účel aktivit
5. **Úspěchy** - pokrok a accomplishment

## 🚀 Rychlý start

### Instalace a spuštění

```bash
# 1. Instalace závislostí
npm install

# 2. Spuštění Electron aplikace (development)
npm run dev

# 3. Build distribučního balíčku
npm run build
```

Po buildu najdete instalátor v `release/` složce:
- **Linux**: `Wellbeing Tracker-1.0.0.AppImage`
- **macOS**: `Wellbeing Tracker-1.0.0.dmg`
- **Windows**: `Wellbeing Tracker Setup 1.0.0.exe`

### Požadavky
- Node.js 20.x+
- npm nebo yarn
- Claude CLI (volitelné, pro AI shrnutí)

## 📁 Struktura projektu

```
.
├── electron/            # Electron backend (main proces)
│   ├── main.js         # Hlavní Electron proces
│   └── preload.js      # Preload script pro IPC
│
├── src/                # React frontend (renderer proces)
│   ├── components/
│   │   ├── DailyQuestionnaire.tsx   # Denní dotazník
│   │   ├── WeeklySummary.tsx        # Týdenní shrnutí
│   │   └── Settings.tsx             # Nastavení
│   ├── data/
│   │   └── questions.ts             # Definice otázek
│   ├── types/
│   │   └── index.ts                 # TypeScript typy
│   ├── utils/
│   │   ├── storage.ts               # IPC komunikace pro data
│   │   ├── analytics.ts             # Výpočty a analýzy
│   │   ├── microActions.ts          # Algoritmus mikro-akcí
│   │   └── claudeApi.ts             # Claude CLI přes IPC
│   ├── App.tsx                      # Hlavní komponenta
│   └── main.tsx                     # Entry point
│
├── dist/               # Vite build výstup
├── release/            # Electron distribuce
└── server/             # Deprecated (původní Express server)
```

## 🎨 Barevné označení skóre

- 🔴 **Kritické** (< 2.5): Vyžaduje okamžitou pozornost
- 🟡 **Střední** (2.5 - 3.5): Prostor pro zlepšení
- 🟢 **Dobré** (> 3.5): V pořádku

## 💡 Mikro-akce

Aplikace automaticky generuje až 5 personalizovaných mikro-akcí na základě:
- Kritických oblastí (nízké skóre)
- Celkového stavu wellbeingu
- Priorit (high, medium, low)

Každá mikro-akce obsahuje:
- Název
- Detailní popis
- Kategorii wellbeingu
- Prioritu

## 🔐 Bezpečnost a soukromí

- ✅ Všechna data ukládána **lokálně na vašem počítači**
  - Linux: `~/.config/wellbeing-tracker/data/`
  - macOS: `~/Library/Application Support/wellbeing-tracker/data/`
  - Windows: `%APPDATA%\wellbeing-tracker\data/`
- ✅ Žádné servery třetích stran (kromě volitelné Claude CLI)
- ✅ Bezpečná IPC komunikace přes Electron contextBridge
- ✅ Export/import pro zálohu dat
- ✅ Možnost smazání všech dat

## 🤖 Nastavení Claude AI (Claude CLI)

Aplikace používá **lokálně nainstalovaný Claude CLI** volaný přímo z Electron main procesu.

### Instalace Claude CLI

```bash
# Pokud ještě nemáte Claude CLI nainstalované
# Návod: https://github.com/anthropics/anthropic-cli
```

### Použití v aplikaci

1. Spusťte aplikaci (`npm run dev`)
2. Přejděte do sekce **Nastavení**
3. Zapněte **Claude AI integraci**
4. Klikněte na **Test Claude CLI** pro ověření
5. Uložte nastavení

Claude CLI se používá pro:
- **Denní shrnutí** - po dokončení denního dotazníku
- **Týdenní shrnutí** - analýza celého týdne
- **Personalizovaná doporučení** - na míru vašim skóre
- **Motivační komentáře** - povzbuzení a konkrétní tipy

**Poznámka**: Všechna volání Claude probíhají lokálně z Electron main procesu. Žádná data nejsou posílána přes webové API.

## 📦 Technologie

### Desktop
- **Electron** - Cross-platform desktop framework
- **Node.js** - Backend runtime (main proces)

### Frontend (Renderer)
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Recharts** - Grafy a vizualizace
- **date-fns** - Práce s datumy

### Backend (Main)
- **Electron IPC** - Inter-process communication
- **Node.js fs/promises** - File system operace
- **Claude CLI** - AI asistent (volitelné)

## 🎯 Doporučené používání

1. **Denně** - Vyplňte dotazník na konci dne (5-10 minut)
2. **Týdně** - Zkontrolujte týdenní shrnutí
3. **Aktivně** - Sledujte mikro-akce a implementujte je
4. **Pravidelně** - Exportujte data pro zálohu

## 📝 Poznámky k vývoji

### TypeScript konfigurace
Projekt používá `verbatimModuleSyntax` pro správné type importy:

```typescript
// ✅ Správně
import type { DailyScore } from '../types';
import { WellbeingCategory } from '../types';

// ❌ Špatně
import { DailyScore, WellbeingCategory } from '../types';
```

### Přidání nových otázek

Otázky jsou definovány v `src/data/questions.ts`:

```typescript
{
  id: 'unique_id',
  category: WellbeingCategory.CATEGORY_NAME,
  text: 'Textová otázka?',
  model: 'maslow' | 'sdt' | 'perma',
}
```

## 🐛 Řešení problémů

### Build selhává
- Zkontrolujte verzi Node.js (20.19+ nebo 22.12+)
- Zkuste `npm install` znovu

### Data se neukládají
- Zkontrolujte oprávnění k zápisu do uživatelské složky
- Podívejte se na logy v terminálu (main proces)

### Claude CLI nefunguje
- Ověřte, že Claude CLI je nainstalované (`claude --version`)
- Zkuste test v aplikaci (Nastavení → Test Claude CLI)
- Zkontrolujte konzoli main procesu pro případné chyby

### Electron sandbox problémy
- Aplikace používá `--no-sandbox` flag v package.json
- To je běžné řešení pro Linux prostředí

## 📄 Licence

MIT License

## 🤝 Přispění

Příspěvky jsou vítány! Otevřete issue nebo pull request.

---

**Vytvořeno s ❤️ pro podporu duševní pohody**
