# 🚀 Release Process

This document explains how to create a new release of Wellbeing Tracker.

## 📋 Prerequisites

- Push all changes to the `main` branch (or your default branch)
- Make sure the build works locally: `npm run build`
- Update `CHANGELOG.md` with new features and fixes (optional but recommended)

## 🔢 Version Numbers

The application uses **semantic versioning** (SemVer): `MAJOR.MINOR.PATCH`

- **MAJOR** (1.x.x) - Breaking changes, incompatible API changes
- **MINOR** (x.1.x) - New features, backwards-compatible
- **PATCH** (x.x.1) - Bug fixes, backwards-compatible

## 🎯 Quick Release Process

### Option 1: Automatic Version Update (Recommended)

The GitHub Actions workflow **automatically updates** `package.json` version from the git tag.

**Steps:**

1. **Create a release on GitHub:**
   ```bash
   # Go to: https://github.com/your-username/wellbeing-tracker/releases/new
   # Or use GitHub CLI:
   gh release create v1.0.1 --title "Version 1.0.1" --notes "Release notes here"
   ```

2. **Enter release details:**
   - **Tag**: `v1.0.1` (must start with `v`)
   - **Title**: `Version 1.0.1` (or any title)
   - **Description**: Release notes, changelog, etc.
   - Click **"Publish release"**

3. **Wait for builds** (10-20 minutes):
   - GitHub Actions automatically:
     - Updates `package.json` to version `1.0.1`
     - Builds Linux packages (.deb, .rpm, .AppImage)
     - Builds macOS DMG
     - Builds Windows EXE
     - Uploads all installers to the release

4. **Download installers:**
   - Go to the release page
   - Download installers for your platform

### Option 2: Manual Version Update

If you prefer to manually control the version in `package.json`:

1. **Update version in package.json:**
   ```bash
   npm version 1.0.1 --no-git-tag-version
   # Or edit package.json manually: "version": "1.0.1"
   ```

2. **Commit the change:**
   ```bash
   git add package.json
   git commit -m "Bump version to 1.0.1"
   git push
   ```

3. **Create release on GitHub** (as in Option 1, step 1-4)

## 🔍 Monitoring the Build

1. **Go to Actions tab** on GitHub:
   ```
   https://github.com/your-username/wellbeing-tracker/actions
   ```

2. **Click on the running workflow** to see progress

3. **Check each job**:
   - ✅ `build-linux` - Linux packages (.deb, .rpm, .AppImage)
   - ✅ `build-macos` - macOS DMG
   - ✅ `build-windows` - Windows EXE

4. **If a job fails:**
   - Click on the failed job
   - Expand the failed step
   - Read error logs
   - Fix the issue and create a new release

## 📦 Output Files

After successful build, these files are uploaded to the release:

- **Linux**:
  - `wellbeing-tracker_1.0.1_amd64.deb` (Debian/Ubuntu)
  - `wellbeing-tracker-1.0.1.x86_64.rpm` (Fedora/RedHat)
  - `Wellbeing Tracker-1.0.1.AppImage` (Universal)
- **macOS**: `Wellbeing Tracker-1.0.1.dmg`
- **Windows**: `Wellbeing Tracker Setup 1.0.1.exe`

## 🛠️ Troubleshooting

### Problem: Version mismatch (e.g., tag is v1.0.1 but installer is 1.0.0)

**Cause**: The automatic version update step failed or `package.json` wasn't updated.

**Solution**:
1. Check the "Update package.json version from tag" step in Actions logs
2. If it failed, manually update `package.json` to `1.0.1`
3. Create a new release with tag `v1.0.2`

### Problem: Build fails on one platform

**Cause**: Platform-specific build issue.

**Solution**:
1. Check the failed job's logs
2. Test the build locally on that platform: `npm run build:linux|mac|win`
3. Fix the issue
4. Create a new release

### Problem: Upload fails with "Resource not accessible"

**Cause**: Missing `contents: write` permission.

**Solution**:
1. Check that `.github/workflows/release.yml` has:
   ```yaml
   permissions:
     contents: write
   ```
2. If missing, add it and push the change
3. Create a new release

### Problem: electron-builder tries to publish (conflict)

**Cause**: `publish` configuration is not set to `null`.

**Solution**:
1. Check `package.json` has:
   ```json
   "build": {
     ...
     "publish": null
   }
   ```
2. Add it if missing
3. Create a new release

## 📝 Release Checklist

Before creating a release:

- [ ] All tests pass locally
- [ ] Build works locally: `npm run build`
- [ ] `package.json` version is correct (or will be auto-updated)
- [ ] `CHANGELOG.md` is updated (optional)
- [ ] All PRs are merged
- [ ] Documentation is up to date

After creating a release:

- [ ] GitHub Actions completed successfully
- [ ] All three installers are uploaded
- [ ] Download and test installers on target platforms
- [ ] Announce the release (social media, mailing list, etc.)

## 🔐 Security Notes

- **Code signing**: Currently disabled. For production releases, consider adding code signing certificates
- **Auto-updates**: Not implemented. Users must manually download new versions
- **GitHub Token**: Automatically provided by GitHub Actions, no manual configuration needed

## 📚 Additional Resources

- [GitHub Actions Workflow](.github/workflows/release.yml)
- [Workflow Documentation](.github/workflows/README.md)
- [electron-builder Documentation](https://www.electron.build/)
- [Semantic Versioning](https://semver.org/)
