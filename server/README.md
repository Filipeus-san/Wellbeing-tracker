# Backend Proxy Server pro Claude CLI

Express server, který slouží jako proxy pro volání Claude CLI z frontend aplikace. Řeší CORS problémy a umožňuje bezpečné volání lokálně nainstalovaného Claude CLI.

## 🚀 Instalace

```bash
npm install
```

## ▶️ Spuštění

```bash
# Produkční režim
npm start

# Development režim (s auto-reload)
npm run dev
```

Server poběží na `http://localhost:3001`

## 📡 Endpointy

### `POST /api/claude/summary`
Generuje shrnutí pomocí Claude CLI.

**Request:**
```json
{
  "prompt": "Text promptu pro Claude..."
}
```

**Response:**
```json
{
  "success": true,
  "content": "Odpověď od Claude..."
}
```

### `GET /api/claude/test`
Testuje, zda Claude CLI je dostupné.

**Response:**
```json
{
  "success": true,
  "version": "claude-cli version...",
  "message": "Claude CLI is available"
}
```

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-09T12:00:00.000Z"
}
```

## 🔧 Prerekvizity

- Node.js 18+
- Nainstalovaný Claude CLI v systému
- Claude CLI musí být dostupný v PATH

## 🧪 Testování

```bash
# Test, že Claude CLI je dostupné
curl http://localhost:3001/api/claude/test

# Test generování shrnutí
curl -X POST http://localhost:3001/api/claude/summary \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Ahoj, jak se máš?"}'
```

## ⚙️ Konfigurace

Server defaultně běží na portu **3001**. Pro změnu upravte konstantu `PORT` v `index.js`.

## 🐛 Řešení problémů

### "Claude CLI is not available"
- Zkontrolujte, že Claude CLI je nainstalované: `claude --version`
- Ujistěte se, že Claude CLI je v PATH

### CORS chyby
- Server má CORS povolený pro všechny origins
- Frontend musí běžet na `http://localhost:5173` nebo jiném lokálním portu

### Timeout chyby
- Claude CLI má timeout 60s
- Pro delší prompty zvyšte timeout v `index.js`
