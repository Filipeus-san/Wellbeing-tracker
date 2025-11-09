# 🚀 Quick Start Guide

Rychlý návod k rozběhnutí React Wellbeing Tracker aplikace.

## 1. Instalace Frontend

```bash
# V kořenovém adresáři projektu
npm install
```

## 2. Spuštění Frontend

```bash
npm run dev
```

Frontend poběží na `http://localhost:5173` (nebo jiném volném portu).

## 3. (Volitelné) Instalace a spuštění Backend serveru pro Claude CLI

Pokud chcete používat Claude AI integraci:

### 3a. Nainstalujte Claude CLI

Pokud ještě nemáte Claude CLI nainstalované, postupujte podle oficiální dokumentace:
- https://github.com/anthropics/anthropic-cli

Ověřte instalaci:
```bash
claude --version
```

### 3b. Nainstalujte Backend server

```bash
cd server
npm install
```

### 3c. Spusťte Backend server

```bash
npm start
```

Server poběží na `http://localhost:3001`.

### 3d. Aktivujte Claude integraci v aplikaci

1. Otevřete aplikaci v prohlížeči
2. Přejděte do **Nastavení**
3. Zapněte **Claude AI integraci**
4. Klikněte na **Test Claude CLI** pro ověření
5. Klikněte **Uložit nastavení**

## 4. První použití

1. **Denní dotazník**:
   - Vyplňte 13 otázek (škála 1-5)
   - Můžete přidat poznámky
   - Klikněte **Uložit denní záznam**
   - 🆕 **Po dokončení**: Klikněte na **🤖 Vygenerovat AI shrnutí** pro:
     - Personalizovaný feedback k dnešnímu dni
     - Ocenění pozitivních oblastí
     - Konkrétní doporučení na zítřek
     - Motivační komentář od AI kouče

2. **Týdenní shrnutí**:
   - Po vyplnění několika dní přejděte do **Týdenní shrnutí**
   - Uvidíte grafy, kritické oblasti a mikro-akce
   - (Volitelně) Vygenerujte AI shrnutí týdne

3. **Export dat**:
   - V **Nastavení** můžete exportovat data jako zálohu
   - Import dat ze zálohy

## 🎯 Doporučené workflow

```
┌─────────────────────┐
│  Každý večer (5min) │
│  Vyplnit dotazník   │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Jednou týdně       │
│  Zkontrolovat       │
│  týdenní shrnutí    │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Implementovat      │
│  mikro-akce         │
│  během týdne        │
└─────────────────────┘
```

## 🔧 Troubleshooting

### Frontend nenabootuje
- Zkontrolujte verzi Node.js (20.19+ nebo 22.12+)
- Smažte `node_modules` a `package-lock.json`, zkuste `npm install` znovu

### Backend server nefunguje
- Zkontrolujte, že Claude CLI je nainstalované: `claude --version`
- Zkontrolujte, že server běží: `curl http://localhost:3001/api/health`

### Data se neukládají
- Zkontrolujte, že prohlížeč má povolený LocalStorage
- Zkuste otevřít aplikaci v incognito režimu

## 📚 Další informace

- Kompletní dokumentace: [README.md](./README.md)
- Server dokumentace: [server/README.md](./server/README.md)

---

**Užijte si sledování své pohody! 🌟**
