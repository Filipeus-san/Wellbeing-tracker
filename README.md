# 🌟 Wellbeing Tracker - Desktop Application

A modern **desktop application** for tracking mental wellbeing built on **Electron + React + TypeScript**. Uses psychological models **Maslow**, **SDT** (Self-Determination Theory), and **PERMA** for comprehensive wellbeing measurement.

> **📱 Electron Version**: This is the desktop version of the application. Data is stored locally on your computer.
>
> **📖 Detailed Electron Guide**: See [README-ELECTRON.md](./README-ELECTRON.md)

## ✨ Main Features

### 📝 Daily Questionnaire
- 13 questions covering all wellbeing areas
- Rating on a 1-5 scale with color coding
- Space for personal notes
- **🤖 AI daily summary and recommendations** (after completing the questionnaire)
- Saved to LocalStorage for offline access
- Ability to fill out for any date

### 📊 Weekly Summary
- Automatic generation of weekly statistics
- **Data visualization**:
  - Radar chart for overall category overview
  - Bar chart for critical areas
  - Detailed overview of all questions with color coding
- **Identification of critical areas** (score < 2.5)
- **Recommended micro-actions** to improve wellbeing

### 🤖 Claude AI Integration (optional)
- Personalized summaries from AI coach
- Recommendations based on your data
- Secure API key storage in LocalStorage
- Ability to enable/disable integration

### ⚙️ Settings and Data Management
- Export data to JSON (backup)
- Import data from backup
- Delete all data
- Configure Claude API key
- Test API key

## 🎯 Psychological Models

### Maslow - Hierarchy of Needs
1. **Physiological needs** - sleep, food, rest
2. **Safety** - finances, health, housing
3. **Belonging** - connection with people
4. **Self-esteem** - confidence, achievements
5. **Self-actualization** - personal growth, potential

### SDT - Self-Determination Theory
1. **Autonomy** - freedom of choice
2. **Competence** - sense of capability
3. **Relatedness** - support from others

### PERMA - Wellbeing Model
1. **Positive emotions** - joy, calm, enthusiasm
2. **Engagement** - flow states, immersion
3. **Relationships** - quality of interactions
4. **Meaning** - purpose of activities
5. **Accomplishment** - progress and achievement

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

### Requirements
- Node.js 20.x+
- npm or yarn
- Claude CLI (optional, for AI summaries)

## 📁 Project Structure

```
.
├── electron/            # Electron backend (main process)
│   ├── main.js         # Main Electron process
│   └── preload.js      # Preload script for IPC
│
├── src/                # React frontend (renderer process)
│   ├── components/
│   │   ├── DailyQuestionnaire.tsx   # Daily questionnaire
│   │   ├── WeeklySummary.tsx        # Weekly summary
│   │   └── Settings.tsx             # Settings
│   ├── data/
│   │   └── questions.ts             # Question definitions
│   ├── types/
│   │   └── index.ts                 # TypeScript types
│   ├── utils/
│   │   ├── storage.ts               # IPC communication for data
│   │   ├── analytics.ts             # Calculations and analytics
│   │   ├── microActions.ts          # Micro-actions algorithm
│   │   └── claudeApi.ts             # Claude CLI via IPC
│   ├── App.tsx                      # Main component
│   └── main.tsx                     # Entry point
│
├── dist/               # Vite build output
├── release/            # Electron distribution
└── server/             # Deprecated (original Express server)
```

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

## 🔐 Security and Privacy

- ✅ All data stored **locally on your computer**
  - Linux: `~/.config/wellbeing-tracker/data/`
  - macOS: `~/Library/Application Support/wellbeing-tracker/data/`
  - Windows: `%APPDATA%\wellbeing-tracker\data/`
- ✅ No third-party servers (except optional Claude CLI)
- ✅ Secure IPC communication via Electron contextBridge
- ✅ Export/import for data backup
- ✅ Ability to delete all data

## 🤖 Setting up Claude AI (Claude CLI)

The application uses **locally installed Claude CLI** called directly from the Electron main process.

### Installing Claude CLI

```bash
# If you don't have Claude CLI installed yet
# Guide: https://github.com/anthropics/anthropic-cli
```

### Using in the Application

1. Run the application (`npm run dev`)
2. Go to the **Settings** section
3. Enable **Claude AI integration**
4. Click **Test Claude CLI** to verify
5. Save settings

Claude CLI is used for:
- **Daily summary** - after completing the daily questionnaire
- **Weekly summary** - analysis of the whole week
- **Personalized recommendations** - tailored to your scores
- **Motivational comments** - encouragement and specific tips

**Note**: All Claude calls are made locally from the Electron main process. No data is sent via web API.

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

## 🎯 Recommended Usage

1. **Daily** - Fill out the questionnaire at the end of the day (5-10 minutes)
2. **Weekly** - Review the weekly summary
3. **Actively** - Track micro-actions and implement them
4. **Regularly** - Export data for backup

## 📝 Development Notes

### TypeScript Configuration
The project uses `verbatimModuleSyntax` for proper type imports:

```typescript
// ✅ Correct
import type { DailyScore } from '../types';
import { WellbeingCategory } from '../types';

// ❌ Wrong
import { DailyScore, WellbeingCategory } from '../types';
```

### Adding New Questions

Questions are defined in `src/data/questions.ts`:

```typescript
{
  id: 'unique_id',
  category: WellbeingCategory.CATEGORY_NAME,
  text: 'Question text?',
  model: 'maslow' | 'sdt' | 'perma',
}
```

## 🐛 Troubleshooting

### Build fails
- Check Node.js version (20.19+ or 22.12+)
- Try `npm install` again

### Data not saving
- Check write permissions to user folder
- Look at logs in terminal (main process)

### Claude CLI not working
- Verify Claude CLI is installed (`claude --version`)
- Try the test in the application (Settings → Test Claude CLI)
- Check the main process console for any errors

### Electron sandbox issues
- The application uses `--no-sandbox` flag in package.json
- This is a common solution for Linux environments

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Open an issue or pull request.

---

**Created with ❤️ to support mental wellbeing**
