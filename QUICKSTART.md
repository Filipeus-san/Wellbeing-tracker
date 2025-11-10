# 🚀 Quick Start Guide

Quick guide to getting the React Wellbeing Tracker application up and running.

## 1. Frontend Installation

```bash
# In the project root directory
npm install
```

## 2. Running Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (or another available port).

## 3. (Optional) Installing and Running Backend Server for Claude CLI

If you want to use Claude AI integration:

### 3a. Install Claude CLI

If you don't have Claude CLI installed yet, follow the official documentation:
- https://github.com/anthropics/anthropic-cli

Verify installation:
```bash
claude --version
```

### 3b. Install Backend Server

```bash
cd server
npm install
```

### 3c. Run Backend Server

```bash
npm start
```

Server will run on `http://localhost:3001`.

### 3d. Activate Claude Integration in the Application

1. Open the application in your browser
2. Go to **Settings**
3. Enable **Claude AI integration**
4. Click **Test Claude CLI** to verify
5. Click **Save Settings**

## 4. First Use

1. **Daily Questionnaire**:
   - Fill out 13 questions (scale 1-5)
   - You can add notes
   - Click **Save Daily Record**
   - 🆕 **After completion**: Click **🤖 Generate AI Summary** for:
     - Personalized feedback on today
     - Recognition of positive areas
     - Specific recommendations for tomorrow
     - Motivational comment from AI coach

2. **Weekly Summary**:
   - After filling out several days, go to **Weekly Summary**
   - You'll see charts, critical areas, and micro-actions
   - (Optional) Generate AI weekly summary

3. **Export Data**:
   - In **Settings** you can export data as a backup
   - Import data from backup

## 🎯 Recommended Workflow

```
┌─────────────────────┐
│  Every evening      │
│  (5 minutes)        │
│  Fill questionnaire │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Once a week        │
│  Review weekly      │
│  summary            │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Implement          │
│  micro-actions      │
│  during the week    │
└─────────────────────┘
```

## 🔧 Troubleshooting

### Frontend won't start
- Check Node.js version (20.19+ or 22.12+)
- Delete `node_modules` and `package-lock.json`, try `npm install` again

### Backend server not working
- Check that Claude CLI is installed: `claude --version`
- Check that server is running: `curl http://localhost:3001/api/health`

### Data not saving
- Check that browser has LocalStorage enabled
- Try opening the application in incognito mode

## 📚 More Information

- Complete documentation: [README.md](./README.md)
- Server documentation: [server/README.md](./server/README.md)

---

**Enjoy tracking your wellbeing! 🌟**
