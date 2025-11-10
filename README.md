# 🌟 Wellbeing Tracker - Desktop Application

A modern **desktop application** for tracking mental wellbeing built on **Electron + React + TypeScript**. Uses psychological models **Maslow**, **SDT** (Self-Determination Theory), and **PERMA** for comprehensive wellbeing measurement.

> **📱 Electron Version**: This is the desktop version of the application. Data is stored locally on your computer.
>
> **📖 Detailed Electron Guide**: See [README-ELECTRON.md](./README-ELECTRON.md)

## ✨ Main Features

### 📝 Daily Questionnaire
- **18 comprehensive questions** covering all wellbeing areas:
  - 9 questions from **Maslow's Hierarchy** (including practical habits like hygiene, cleaning, addiction management, health)
  - 3 questions from **SDT** (Self-Determination Theory)
  - 6 questions from **PERMA** model (including physical exercise)
- Rating on a **1-5 scale** with intuitive color coding
- Space for **personal notes and reflections**
- **🤖 AI-powered daily summary and recommendations** (optional, after completing the questionnaire)
- Data stored locally for **offline access**
- Ability to **fill out for any date** (past or present)
- **Date picker** for easy navigation

### 📊 Weekly Summary
- Automatic generation of weekly statistics
- **Data visualization**:
  - Radar chart for overall category overview
  - Bar chart for critical areas
  - Detailed overview of all questions with color coding
- **Identification of critical areas** (score < 2.5)
- **🤖 AI-powered weekly analysis** (optional)
- **Recommended micro-actions** to improve wellbeing

### 🎯 Habits Tracker
- **Create custom habits** with name, description, and emoji icon
- **Flexible scheduling**:
  - Choose specific days of week (Monday-Sunday)
  - Select specific weeks of month (1st-5th week)
  - Or track daily habits
- **Drag & drop reordering** to prioritize your habits
- **Edit or archive** habits as your routines evolve
- **Visual organization** with emoji icons and descriptions
- Integrates with daily questionnaire data

### 🤖 AI Integration (optional)
- **Three AI providers supported**:
  - **Claude CLI** - Anthropic's AI assistant
  - **OpenAI Codex** - OpenAI's coding AI
  - **GitHub Copilot** - GitHub's AI assistant
- **Personalized summaries** from AI coach
- **Recommendations** based on your wellbeing data
- **OAuth authentication** via browser (secure, no manual API keys)
- Ability to **enable/disable** and **switch providers**
- **In-app setup guide** for each provider

### ⚙️ Settings and Data Management
- Export data to JSON (backup)
- Import data from backup
- Delete all data
- Configure Claude API key
- Test API key
- **☁️ Google Drive synchronization** (optional)
  - Automatic backup to cloud
  - Data synchronization across devices
  - Secure OAuth2 authentication

## 🎯 Psychological Models

### Maslow - Hierarchy of Needs
1. **Physiological needs** - sleep, food, rest
2. **Safety** - finances, health, housing
3. **Belonging** - connection with people
4. **Self-esteem** - confidence, achievements
5. **Self-actualization** - personal growth, potential

**Plus practical daily habits:**
- **Hygiene** - personal care and cleanliness
- **Cleaning** - environment and organization
- **Addiction management** - controlling substance and behavioral dependencies
- **Health/Illness** - physical wellbeing and sickness tracking

### SDT - Self-Determination Theory
1. **Autonomy** - freedom of choice and self-direction
2. **Competence** - sense of capability and mastery
3. **Relatedness** - support and connection from others

### PERMA - Wellbeing Model
1. **Positive emotions** - joy, calm, enthusiasm
2. **Engagement** - flow states, deep immersion
3. **Relationships** - quality of social interactions
4. **Meaning** - purpose and significance of activities
5. **Accomplishment** - progress, achievement, and success

**Extended with:**
- **Exercise** - physical activity and movement

## 🎨 Score Color Coding

- 🔴 **Critical** (< 2.5): Requires immediate attention
- 🟡 **Medium** (2.5 - 3.5): Room for improvement
- 🟢 **Good** (> 3.5): Doing well

## 💡 Micro-Actions

The application automatically generates up to 5 personalized micro-actions based on:
- Critical areas (low scores)
- Overall wellbeing status
- Priorities (high, medium, low)

Each micro-action contains:
- Name
- Detailed description
- Wellbeing category
- Priority

## 🚀 Quick Start

### Installation and Running

```bash
# 1. Install dependencies
npm install

# 2. Run Electron application (development)
npm run dev

# 3. Build distribution package
npm run build
```

After building, you'll find the installer in the `release/` folder:
- **Linux**: `Wellbeing Tracker-1.0.0.AppImage`
- **macOS**: `Wellbeing Tracker-1.0.0.dmg`
- **Windows**: `Wellbeing Tracker Setup 1.0.0.exe`

For detailed build instructions, see [BUILD.md](./BUILD.md).

### Requirements
- Node.js 20.x+
- npm or yarn
- Claude CLI (optional, for AI summaries)

## 🔐 Security and Privacy

- ✅ All data stored **locally on your computer**
  - Linux: `~/.config/wellbeing-tracker/data/`
  - macOS: `~/Library/Application Support/wellbeing-tracker/data/`
  - Windows: `%APPDATA%\wellbeing-tracker\data/`
- ✅ No third-party servers (except optional Claude CLI and Google Drive sync)
- ✅ **Optional Google Drive sync** uses your own OAuth2 credentials (BYOC)
  - Your credentials stay only with you
  - Minimum access scope - app only sees files it creates
  - Modern OAuth2 security (PKCE, loopback redirect)
- ✅ Secure IPC communication via Electron contextBridge
- ✅ Export/import for data backup
- ✅ Ability to delete all data

## 🤖 AI Integration

The application supports **three AI providers** for personalized summaries and recommendations:
- **Claude CLI** (Anthropic) - Recommended, excellent for wellbeing advice
- **OpenAI Codex** - Good for structured responses
- **GitHub Copilot CLI** - For users with Copilot subscription

### How It Works

1. **OAuth Authentication** - Modern, secure browser-based login (no manual API keys!)
2. **Local CLI Execution** - AI runs on your computer via command-line tools
3. **Data Privacy** - Your wellbeing data stays local, only prompts are sent to AI
4. **Provider Selection** - Easy switching between AI providers in settings

### Setup Process

The application includes **detailed in-app guides** for each provider:

**Access the guide**: Settings → AI Integration → "Show detailed AI setup guide" button

Each guide walks you through:
1. **Installation** - One-command CLI installation
2. **Authentication** - Browser-based OAuth login (automatic)
3. **Activation** - Enable in the app and test

**Estimated time**: 5-10 minutes per provider

### AI Features

Once configured, AI provides:
- **📝 Daily summary** - After completing the daily questionnaire
- **📊 Weekly summary** - Comprehensive analysis of the whole week
- **🎯 Personalized recommendations** - Tailored to your specific scores
- **💭 Motivational comments** - Encouragement and actionable tips
- **🔍 Pattern recognition** - Identifying trends in your wellbeing data

### Security

- ✅ **Secure OAuth** - Modern authentication via browser
- ✅ **Local execution** - CLI runs on your computer
- ✅ **No API keys to manage** - OAuth handles everything
- ✅ **PKCE protection** - Advanced security for token exchange
- ✅ **Data minimization** - Only necessary prompts sent to AI

## ☁️ Google Drive Synchronization

The application supports **optional** cloud backup via Google Drive using your own OAuth2 credentials (BYOC - Bring Your Own Credentials).

### Why BYOC (Bring Your Own Credentials)?

- ✅ **Maximum Privacy** - Your credentials and data stay only with you
- ✅ **Free** - No monthly subscription fees
- ✅ **Full Control** - You manage access and can revoke it anytime
- ✅ **Secure** - Uses Google's OAuth2 with modern security protocols (PKCE)

### Features

1. **Automatic Synchronization**
   - Enable auto-sync to backup data on every change
   - Data is automatically uploaded after adding daily records, habits, etc.

2. **Manual Backup**
   - Upload current data to Google Drive on demand
   - Download data from Google Drive to restore on a new device

3. **Security**
   - Uses OAuth2 with Desktop app flow
   - Minimum access scope (`drive.file`) - app only sees files it creates
   - Loopback redirect (`http://localhost`) following Google 2025 standards
   - Support for PKCE (Proof Key for Code Exchange)
   - Encrypted HTTPS communication
   - Tokens stored locally in `~/.config/wellbeing-tracker/google-credentials/`

### Setup Process (10-15 minutes)

The application includes a **detailed in-app guide** that walks you through:

1. **Creating Google Cloud Project** (free)
2. **Enabling Google Drive API**
3. **Configuring OAuth Consent Screen**
   - Setting up External user type
   - Adding required scopes (`drive.file`)
   - Adding yourself as a test user
4. **Creating OAuth2 Desktop Credentials**
5. **Connecting to the app via OAuth2 flow**

**Access the guide**: Settings → Google Drive Sync → "Show detailed setup guide" button

### Data Storage

- Backup file: `wellbeing-tracker-data.json`
- Location: Google Drive root folder (created by the app)
- Content: All your daily records, habits, and settings
- Format: JSON (human-readable, can be inspected)

### Important Notes

- ⚠️ **Test Users Required**: You must add yourself as a test user in OAuth consent screen
- 🔒 **"Unverified app" warning is normal** - it's your own project, safe to continue
- 🔄 **Refresh tokens** - App automatically renews access without re-authentication
- 🗑️ **Easy to disconnect** - Revoke access anytime in Google account settings

## 📦 Technologies

### Desktop
- **Electron** - Cross-platform desktop framework
- **Node.js** - Backend runtime (main process)

### Frontend (Renderer)
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Recharts** - Charts and visualization
- **date-fns** - Date handling

### Backend (Main)
- **Electron IPC** - Inter-process communication
- **Node.js fs/promises** - File system operations
- **Claude CLI** - AI assistant (optional)
- **Google Drive API** - Cloud backup (optional, via OAuth2)
- **googleapis** - Google API client library

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Open an issue or pull request.

---

**Created with ❤️ to support mental wellbeing**
