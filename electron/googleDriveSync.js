import { google } from 'googleapis';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';

/**
 * Google Drive Sync Service
 * Poskytuje synchronizaci dat aplikace s Google Diskem
 */

const CREDENTIALS_DIR = join(app.getPath('userData'), 'google-credentials');
const TOKEN_PATH = join(CREDENTIALS_DIR, 'token.json');
const DRIVE_FILE_NAME = 'wellbeing-data.json';

// Scopes pro Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

class GoogleDriveSync {
  constructor() {
    this.oauth2Client = null;
    this.drive = null;
    this.fileId = null; // ID souboru na Google Drive
    this.isAuthenticated = false;
    this.syncEnabled = false;
  }

  /**
   * Inicializace OAuth2 klienta s client credentials
   */
  async initializeOAuth(clientId, clientSecret) {
    try {
      this.oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        'http://localhost' // Redirect URI pro desktop aplikaci
      );

      // Pokusit se načíst existující token
      await this.loadToken();

      if (this.isAuthenticated) {
        this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
        console.log('✅ Google Drive OAuth2 client initialized');
      }

      return this.isAuthenticated;
    } catch (error) {
      console.error('❌ Error initializing OAuth2 client:', error);
      return false;
    }
  }

  /**
   * Získání URL pro autorizaci
   */
  getAuthUrl() {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized');
    }

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent', // Vždy vynutit výběr účtu a souhlas
    });
  }

  /**
   * Výměna autorizačního kódu za token
   */
  async authenticateWithCode(code) {
    try {
      if (!this.oauth2Client) {
        throw new Error('OAuth2 client not initialized');
      }

      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      // Uložit token
      await this.saveToken(tokens);

      this.isAuthenticated = true;
      this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });

      console.log('✅ Successfully authenticated with Google Drive');
      return true;
    } catch (error) {
      console.error('❌ Error authenticating with code:', error);
      throw error;
    }
  }

  /**
   * Načtení uloženého tokenu
   */
  async loadToken() {
    try {
      if (!existsSync(TOKEN_PATH)) {
        return false;
      }

      const tokenData = await readFile(TOKEN_PATH, 'utf-8');
      const tokens = JSON.parse(tokenData);

      this.oauth2Client.setCredentials(tokens);
      this.isAuthenticated = true;

      console.log('✅ Token loaded from file');
      return true;
    } catch (error) {
      console.error('❌ Error loading token:', error);
      return false;
    }
  }

  /**
   * Uložení tokenu
   */
  async saveToken(tokens) {
    try {
      if (!existsSync(CREDENTIALS_DIR)) {
        await mkdir(CREDENTIALS_DIR, { recursive: true });
      }

      await writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2), 'utf-8');
      console.log('✅ Token saved to file');
    } catch (error) {
      console.error('❌ Error saving token:', error);
      throw error;
    }
  }

  /**
   * Odhlášení - smazání tokenu
   */
  async disconnect() {
    try {
      if (existsSync(TOKEN_PATH)) {
        const fs = await import('fs/promises');
        await fs.unlink(TOKEN_PATH);
      }

      this.oauth2Client = null;
      this.drive = null;
      this.fileId = null;
      this.isAuthenticated = false;
      this.syncEnabled = false;

      console.log('✅ Disconnected from Google Drive');
      return true;
    } catch (error) {
      console.error('❌ Error disconnecting:', error);
      return false;
    }
  }

  /**
   * Kontrola, zda je uživatel přihlášen
   */
  isConnected() {
    return this.isAuthenticated && this.oauth2Client !== null;
  }

  /**
   * Najít nebo vytvořit soubor na Google Drive
   */
  async findOrCreateFile() {
    try {
      if (!this.drive) {
        throw new Error('Drive not initialized');
      }

      // Najít existující soubor
      const response = await this.drive.files.list({
        q: `name='${DRIVE_FILE_NAME}' and trashed=false`,
        fields: 'files(id, name, modifiedTime)',
        spaces: 'drive',
      });

      if (response.data.files && response.data.files.length > 0) {
        this.fileId = response.data.files[0].id;
        console.log('✅ Found existing file on Google Drive:', this.fileId);
        return this.fileId;
      }

      // Vytvořit nový soubor
      const fileMetadata = {
        name: DRIVE_FILE_NAME,
        mimeType: 'application/json',
      };

      const file = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id',
      });

      this.fileId = file.data.id;
      console.log('✅ Created new file on Google Drive:', this.fileId);
      return this.fileId;
    } catch (error) {
      console.error('❌ Error finding or creating file:', error);
      throw error;
    }
  }

  /**
   * Nahrát data na Google Drive
   */
  async uploadData(data) {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Google Drive');
      }

      // Ujistit se, že máme fileId
      if (!this.fileId) {
        await this.findOrCreateFile();
      }

      const jsonData = JSON.stringify(data, null, 2);

      const media = {
        mimeType: 'application/json',
        body: jsonData,
      };

      await this.drive.files.update({
        fileId: this.fileId,
        media: media,
      });

      console.log('✅ Data uploaded to Google Drive');
      return { success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('❌ Error uploading data:', error);
      throw error;
    }
  }

  /**
   * Stáhnout data z Google Drive
   */
  async downloadData() {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Google Drive');
      }

      // Ujistit se, že máme fileId
      if (!this.fileId) {
        await this.findOrCreateFile();
      }

      const response = await this.drive.files.get({
        fileId: this.fileId,
        alt: 'media',
      });

      console.log('✅ Data downloaded from Google Drive');
      return response.data;
    } catch (error) {
      console.error('❌ Error downloading data:', error);
      throw error;
    }
  }

  /**
   * Získat metadata souboru (včetně času poslední změny)
   */
  async getFileMetadata() {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Google Drive');
      }

      if (!this.fileId) {
        await this.findOrCreateFile();
      }

      const response = await this.drive.files.get({
        fileId: this.fileId,
        fields: 'id, name, modifiedTime, size',
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error getting file metadata:', error);
      throw error;
    }
  }

  /**
   * Povolení/zakázání automatické synchronizace
   */
  setSyncEnabled(enabled) {
    this.syncEnabled = enabled;
    console.log(`🔄 Sync ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Kontrola, zda je synchronizace povolena
   */
  isSyncEnabled() {
    return this.syncEnabled && this.isConnected();
  }
}

// Singleton instance
const googleDriveSync = new GoogleDriveSync();

export default googleDriveSync;
