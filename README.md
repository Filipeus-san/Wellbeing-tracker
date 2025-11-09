# 🌟 React Wellbeing Tracker

Moderní aplikace pro sledování duševní pohody postavená na React s TypeScript. Využívá psychologické modely **Maslow**, **SDT** (Self-Determination Theory) a **PERMA** pro komplexní měření wellbeingu.

## ✨ Hlavní funkce

### 📝 Denní dotazník
- 13 otázek pokrývajících všechny oblasti wellbeingu
- Hodnocení na škále 1-5 s barevným označením
- Prostor pro osobní poznámky
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

## 🚀 Instalace a spuštění

### Předpoklady
- Node.js 20.19+ nebo 22.12+
- npm nebo yarn

### Instalace

```bash
# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev
```

### Build pro produkci

```bash
npm run build
```

Vybuildovaná aplikace bude v adresáři `dist/`.

## 📁 Struktura projektu

```
.
├── src/                 # Frontend aplikace
│   ├── components/
│   │   ├── DailyQuestionnaire.tsx   # Denní dotazník
│   │   ├── WeeklySummary.tsx        # Týdenní shrnutí
│   │   └── Settings.tsx             # Nastavení
│   ├── data/
│   │   └── questions.ts             # Definice otázek
│   ├── types/
│   │   └── index.ts                 # TypeScript typy
│   ├── utils/
│   │   ├── storage.ts               # LocalStorage operace
│   │   ├── analytics.ts             # Výpočty a analýzy
│   │   ├── microActions.ts          # Algoritmus mikro-akcí
│   │   └── claudeApi.ts             # Claude CLI proxy integrace
│   ├── App.tsx                      # Hlavní komponenta
│   └── main.tsx                     # Entry point
│
└── server/              # Backend proxy server
    ├── index.js         # Express server pro Claude CLI
    └── package.json     # Server dependencies
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

- ✅ Všechna data ukládána **lokálně** v prohlížeči (LocalStorage)
- ✅ Žádné servery třetích stran (kromě volitelné Claude API)
- ✅ API klíč uložen bezpečně v LocalStorage
- ✅ Export/import pro zálohu dat
- ✅ Možnost smazání všech dat

## 🤖 Nastavení Claude AI (Claude CLI)

Aplikace používá **lokálně nainstalovaný Claude CLI** místo přímého volání API (řeší CORS problémy).

### Prerekvizity

1. **Nainstalujte Claude CLI**:
   ```bash
   # Pokud ještě nemáte Claude CLI nainstalované
   # Návod: https://github.com/anthropics/anthropic-cli
   ```

2. **Spusťte backend proxy server**:
   ```bash
   # V samostatném terminálu
   cd server
   npm install
   npm start
   ```

   Server poběží na `http://localhost:3001`

### Použití v aplikaci

1. Přejděte do sekce **Nastavení**
2. Zapněte **Claude AI integraci**
3. Klikněte na **Test Claude CLI** pro ověření
4. Uložte nastavení

Claude CLI se používá pouze pro:
- Generování týdenních shrnutí
- Personalizovaná doporučení
- Motivační komentáře

**Poznámka**: Všechna volání Claude probíhají lokálně přes backend server, žádná data nejsou posílána přímo na Anthropic API z prohlížeče.

## 📦 Technologie

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Recharts** - Grafy a vizualizace
- **date-fns** - Práce s datumy
- **LocalStorage** - Perzistence dat

### Backend
- **Express** - Backend server
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
- Zkontrolujte, zda má prohlížeč povolený LocalStorage
- Zkuste vymazat cookies a cache

### Claude CLI nefunguje
- Zkontrolujte, že backend server běží (`cd server && npm start`)
- Ověřte, že Claude CLI je nainstalované (`claude --version`)
- Zkuste test v aplikaci (Nastavení → Test Claude CLI)
- Zkontrolujte konzoli serveru pro případné chyby

## 📄 Licence

MIT License

## 🤝 Přispění

Příspěvky jsou vítány! Otevřete issue nebo pull request.

---

**Vytvořeno s ❤️ pro podporu duševní pohody**
