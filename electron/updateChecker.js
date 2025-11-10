/**
 * Update Checker Service
 * Checks for new releases on GitHub and notifies the user
 */

import { app } from 'electron';
import https from 'https';

const GITHUB_REPO = 'Filipeus-san/Wellbeing-tracker';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // Check once per day

/**
 * Fetches the latest release info from GitHub
 * @returns {Promise<{version: string, url: string, notes: string} | null>}
 */
async function fetchLatestRelease() {
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent': 'Wellbeing-Tracker-App',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    https.get(GITHUB_API_URL, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const release = JSON.parse(data);
            resolve({
              version: release.tag_name.replace(/^v/, ''), // Remove 'v' prefix
              url: release.html_url,
              notes: release.body || 'No release notes available',
              downloadUrl: release.assets?.[0]?.browser_download_url || release.html_url
            });
          } catch (error) {
            console.error('Error parsing release data:', error);
            resolve(null);
          }
        } else {
          console.error('GitHub API request failed:', res.statusCode);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching latest release:', error);
      resolve(null);
    });
  });
}

/**
 * Compares two semantic versions
 * @param {string} current - Current version (e.g., "1.0.1")
 * @param {string} latest - Latest version (e.g., "1.0.2")
 * @returns {boolean} True if latest is newer than current
 */
function isNewerVersion(current, latest) {
  const currentParts = current.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const currentPart = currentParts[i] || 0;
    const latestPart = latestParts[i] || 0;

    if (latestPart > currentPart) return true;
    if (latestPart < currentPart) return false;
  }

  return false; // Versions are equal
}

/**
 * Checks for updates and returns update info if available
 * @returns {Promise<{available: boolean, version?: string, url?: string, notes?: string}>}
 */
export async function checkForUpdates() {
  const currentVersion = app.getVersion();
  console.log('Checking for updates... Current version:', currentVersion);

  const latestRelease = await fetchLatestRelease();

  if (!latestRelease) {
    return { available: false };
  }

  console.log('Latest release:', latestRelease.version);

  if (isNewerVersion(currentVersion, latestRelease.version)) {
    console.log('New version available:', latestRelease.version);
    return {
      available: true,
      version: latestRelease.version,
      url: latestRelease.url,
      notes: latestRelease.notes,
      downloadUrl: latestRelease.downloadUrl
    };
  }

  console.log('App is up to date');
  return { available: false };
}

/**
 * Starts periodic update checks
 * @param {Function} onUpdateAvailable - Callback when update is available
 */
export function startPeriodicUpdateCheck(onUpdateAvailable) {
  // Check on startup
  setTimeout(async () => {
    const updateInfo = await checkForUpdates();
    if (updateInfo.available && onUpdateAvailable) {
      onUpdateAvailable(updateInfo);
    }
  }, 5000); // Wait 5 seconds after startup

  // Check periodically
  setInterval(async () => {
    const updateInfo = await checkForUpdates();
    if (updateInfo.available && onUpdateAvailable) {
      onUpdateAvailable(updateInfo);
    }
  }, CHECK_INTERVAL);
}
