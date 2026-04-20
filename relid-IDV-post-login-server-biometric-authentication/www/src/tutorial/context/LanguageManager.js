/**
 * Language Manager
 *
 * Centralized language state management for Cordova SPA.
 * Replaces React Native's LanguageContext with singleton pattern.
 *
 * Features:
 * - Manages current language and supported languages
 * - Persists language selection to localStorage
 * - Syncs with SDK's language configuration
 * - Event-driven UI updates
 * - Idempotent initialization
 *
 * @fileoverview Language state manager for internationalization
 */

/**
 * Language Manager Singleton
 */
const LanguageManager = {
  _instance: null,
  _initialized: false,

  /**
   * Current selected language
   * @type {Language}
   */
  currentLanguage: null,

  /**
   * Array of supported languages
   * @type {Array<Language>}
   */
  supportedLanguages: [],

  /**
   * Loading state
   * @type {boolean}
   */
  isLoading: true,

  /**
   * Get singleton instance
   * @returns {Object} LanguageManager instance
   */
  getInstance() {
    if (!LanguageManager._instance) {
      LanguageManager._instance = LanguageManager;
    }
    return LanguageManager._instance;
  },

  /**
   * Initialize Language Manager
   * Idempotent - safe to call multiple times
   * Loads persisted language from localStorage
   */
  async initialize() {
    if (this._initialized) {
      console.log('LanguageManager - Already initialized, skipping');
      return;
    }

    console.log('LanguageManager - Initializing');

    try {
      // Get language config
      const config = window.languageConfig;
      if (!config) {
        console.error('LanguageManager - languageConfig not loaded');
        this.supportedLanguages = [];
        this.currentLanguage = {
          lang: 'en-US',
          display_text: 'English',
          nativeName: 'English',
          direction: 0,
          isRTL: false
        };
        this.isLoading = false;
        this._initialized = true;
        return;
      }

      // Set default supported languages
      this.supportedLanguages = config.DEFAULT_SUPPORTED_LANGUAGES;
      this.currentLanguage = config.DEFAULT_LANGUAGE;

      // Load persisted language
      await this.loadPersistedLanguage();

      this.isLoading = false;
      this._initialized = true;

      console.log('LanguageManager - Initialization complete');
      console.log('LanguageManager - Current language:', this.currentLanguage.display_text);
      console.log('LanguageManager - Supported languages:', this.supportedLanguages.length);

      // Notify listeners
      this.notifyListeners();
    } catch (error) {
      console.error('LanguageManager - Initialization failed:', error);
      this.isLoading = false;
      this._initialized = true;
    }
  },

  /**
   * Load persisted language from localStorage
   * @private
   */
  async loadPersistedLanguage() {
    try {
      const storage = window.languageStorage;
      if (!storage) {
        console.warn('LanguageManager - languageStorage not loaded');
        return;
      }

      const savedCode = await storage.load();

      if (savedCode) {
        const config = window.languageConfig;
        const language = config.getLanguageByCode(savedCode, this.supportedLanguages);
        this.currentLanguage = language;
        console.log('LanguageManager - Loaded persisted language:', language.display_text);
      } else {
        console.log('LanguageManager - No persisted language, using default:', this.currentLanguage.display_text);
      }
    } catch (error) {
      console.error('LanguageManager - Error loading persisted language:', error);
    }
  },

  /**
   * Change language and persist to storage
   *
   * @param {Language} language - New language to set
   * @returns {Promise<void>}
   */
  async changeLanguage(language) {
    try {
      console.log('LanguageManager - Changing language to:', language.display_text);

      // Update current language
      this.currentLanguage = language;

      // Persist to localStorage
      const storage = window.languageStorage;
      if (storage) {
        await storage.save(language.lang);
      }

      console.log('LanguageManager - Language changed successfully to:', language.display_text);

      // Notify listeners
      this.notifyListeners();
    } catch (error) {
      console.error('LanguageManager - Error changing language:', error);
      throw error;
    }
  },

  /**
   * Update supported languages and current language from SDK response
   * Called after SDK initialization completes
   *
   * @param {Array<RDNASupportedLanguage>} sdkLanguages - Array of languages from SDK's additionalInfo.supportedLanguage
   * @param {string} sdkSelectedLanguage - Selected language code from SDK's additionalInfo.selectedLanguage
   */
  updateFromSDK(sdkLanguages, sdkSelectedLanguage) {
    try {
      console.log('LanguageManager - Updating from SDK:', JSON.stringify({
        sdkLanguagesCount: sdkLanguages.length,
        sdkSelectedLanguage: sdkSelectedLanguage
      }, null, 2));

      const config = window.languageConfig;
      if (!config) {
        console.error('LanguageManager - languageConfig not loaded');
        return;
      }

      // Convert SDK languages to customer format
      const convertedLanguages = sdkLanguages.map(config.convertSDKLanguageToCustomer);

      // Update supported languages
      this.supportedLanguages = convertedLanguages;
      console.log('LanguageManager - Updated supported languages:', convertedLanguages.map(l => l.lang));

      // Update current language based on SDK's selected language
      const sdkCurrentLanguage = config.getLanguageByCode(sdkSelectedLanguage, convertedLanguages);
      this.currentLanguage = sdkCurrentLanguage;
      console.log('LanguageManager - SDK selected language:', sdkCurrentLanguage.display_text);

      // Persist SDK's selected language
      const storage = window.languageStorage;
      if (storage) {
        storage.save(sdkCurrentLanguage.lang).catch(error => {
          console.error('LanguageManager - Failed to persist SDK language:', error);
        });
      }

      // Notify listeners
      this.notifyListeners();
    } catch (error) {
      console.error('LanguageManager - Error updating from SDK:', error);
    }
  },

  /**
   * Notify all listeners of language change
   * Dispatches custom event for UI updates
   * @private
   */
  notifyListeners() {
    try {
      const event = new CustomEvent('languageChanged', {
        detail: {
          language: this.currentLanguage,
          supportedLanguages: this.supportedLanguages
        }
      });
      document.dispatchEvent(event);
      console.log('LanguageManager - Notified listeners of language change');
    } catch (error) {
      console.error('LanguageManager - Error notifying listeners:', error);
    }
  },

  /**
   * Get current language
   * @returns {Language} Current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  },

  /**
   * Get supported languages
   * @returns {Array<Language>} Supported languages
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  },

  /**
   * Check if manager is initialized
   * @returns {boolean} True if initialized
   */
  isInitialized() {
    return this._initialized;
  }
};

// Export for global access
if (typeof window !== 'undefined') {
  window.LanguageManager = LanguageManager;
}
