# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated builds and releases.

## 📦 Release Workflow (`release.yml`)

Automatically builds and uploads installer packages when a new GitHub release is created.

### Trigger

The workflow runs when you **create a new release** on GitHub.

### Supported Platforms

The workflow builds installers for three platforms in parallel:

- **🐧 Linux** - AppImage (runs on `ubuntu-latest`)
- **🍎 macOS** - DMG installer (runs on `macos-latest`)
- **🪟 Windows** - EXE installer (runs on `windows-latest`)

### How to Use

1. **Create a new release on GitHub:**
   - Go to your repository on GitHub
   - Click "Releases" → "Create a new release"
   - Enter a tag version (e.g., `v1.0.0`, `v1.0.1`)
   - Add release title and description
   - Click "Publish release"

2. **GitHub Actions automatically:**
   - Checks out the code
   - Sets up Node.js 20
   - Installs dependencies
   - Builds the Electron app for each platform
   - Uploads installer packages to the release

3. **Download installers:**
   - After the workflow completes (usually 10-20 minutes)
   - Go to the release page
   - Download the installer for your platform

### Output Files

The workflow uploads the following files to the GitHub release:

- `Wellbeing Tracker-{version}.AppImage` - Linux installer
- `Wellbeing Tracker-{version}.dmg` - macOS installer
- `Wellbeing Tracker Setup {version}.exe` - Windows installer

### Requirements

- **GitHub Token**: Automatically provided by GitHub Actions (`secrets.GITHUB_TOKEN`)
- **Node.js 20**: Set up automatically in the workflow
- **npm dependencies**: Installed with `npm ci`

### Troubleshooting

If the workflow fails:

1. **Check the Actions tab** on GitHub to see error logs
2. **Common issues:**
   - Build failures: Check that `npm run build` works locally
   - Missing dependencies: Ensure `package.json` is up to date
   - Permission issues: Make sure repository settings allow GitHub Actions

### Local Testing

Before creating a release, test the build locally:

```bash
# Test the build command
npm run build

# Check that installers are created in release/ directory
ls -la release/
```

### Workflow Configuration

The workflow is configured with:

- **Node.js version**: 20 (with npm cache)
- **Timeout**: Default (6 hours max per job)
- **Concurrency**: 3 parallel jobs (one per platform)
- **Permissions**: `contents: write` (to upload release assets)

### Security

- Uses `softprops/action-gh-release@v1` for secure asset uploads
- Uses official GitHub Actions (`actions/checkout@v4`, `actions/setup-node@v4`)
- `GITHUB_TOKEN` is automatically scoped to the repository
