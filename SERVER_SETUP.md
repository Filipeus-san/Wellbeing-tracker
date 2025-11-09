# Wellbeing Tracker - Server Setup

## Změny v aplikaci

Aplikace nyní používá **server-side storage** místo localStorage v prohlížeči. Všechna data se ukládají do JSON souboru na serveru.

## Spuštění aplikace

Pro správné fungování aplikace je nutné spustit **2 procesy současně**:

### 1. Spuštění API serveru

V prvním terminálu:

```bash
npm run server
```

Server poběží na `http://localhost:3001` a vytvoří složku `server/data/` pro ukládání dat.

### 2. Spuštění React aplikace

V druhém terminálu:

```bash
npm run dev
```

React aplikace poběží na `http://localhost:5173` (nebo jiném portu, pokud je 5173 obsazený).

## Struktura projektu

```
.
├── server/
│   ├── index.js           # Express API server
│   └── data/              # Data storage (vytvoří se automaticky)
│       └── wellbeing-data.json
├── src/
│   ├── utils/
│   │   └── storage.ts     # API klient (místo localStorage)
│   └── ...
└── package.json
```

## API Endpoints

Server poskytuje následující endpointy:

### Daily Scores
- `GET /api/data/daily-scores` - Získat všechna denní skóre
- `GET /api/data/daily-scores/:date` - Získat skóre pro konkrétní datum
- `POST /api/data/daily-scores` - Uložit nebo aktualizovat denní skóre

### Weekly Summaries
- `GET /api/data/weekly-summaries` - Získat všechna týdenní shrnutí
- `GET /api/data/weekly-summaries/:weekStart` - Získat shrnutí pro konkrétní týden
- `POST /api/data/weekly-summaries` - Uložit nebo aktualizovat týdenní shrnutí

### Settings
- `GET /api/data/settings` - Získat nastavení
- `POST /api/data/settings` - Uložit nastavení

### Data Management
- `GET /api/data/export` - Exportovat všechna data
- `POST /api/data/import` - Importovat data
- `DELETE /api/data/clear` - Smazat všechna data (kromě nastavení)

### Claude CLI (existující)
- `POST /api/claude/summary` - Generovat AI shrnutí pomocí Claude CLI
- `GET /api/claude/test` - Testovat dostupnost Claude CLI

### Health Check
- `GET /api/health` - Zkontrolovat, zda server běží

## Ukládání dat

- Data se ukládají do souboru `server/data/wellbeing-data.json`
- Soubor je automaticky vytvořen při prvním spuštění serveru
- Data zůstávají zachována i po restartu serveru
- Můžete zálohovat data zkopírováním tohoto souboru

## Řešení problémů

### Server neběží
- Zkontrolujte, zda port 3001 není obsazený jiným procesem
- Ujistěte se, že jste spustili `npm run server`
- Zkontrolujte výstup v terminálu pro případné chyby

### React aplikace hlásí chyby připojení
- Ujistěte se, že server běží na `http://localhost:3001`
- Zkontrolujte konzoli prohlížeče pro CORS nebo network chyby
- Server musí běžet **před** použitím React aplikace

### Data se neukládají
- Zkontrolujte, zda složka `server/data/` existuje
- Zkontrolujte oprávnění k zápisu do této složky
- Podívejte se do `server/data/wellbeing-data.json`, zda se soubor aktualizuje

## Migrace z localStorage

Pokud jste měli data v localStorage:

1. Otevřete starou verzi aplikace v prohlížeči
2. Přejděte do Nastavení → Exportovat data
3. Stáhněte JSON soubor s daty
4. Spusťte novou verzi s API serverem
5. Přejděte do Nastavení → Importovat data
6. Nahrajte stažený JSON soubor

## Výhody server-side storage

- Data jsou perzistentní napříč všemi zařízeními
- Není omezeno velikostí localStorage (5-10 MB)
- Data lze snadno zálohovat
- Možnost sdílení dat mezi více uživateli (v budoucnu)
- Centralizované ukládání pro případné rozšíření
