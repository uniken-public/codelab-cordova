/**
 * Language Storage
 *
 * localStorage wrapper for persisting language preferences.
 * Replaces React Native's AsyncStorage with browser's localStorage.
 *
 * @fileoverview Language persistence using localStorage
 */

const LANGUAGE_KEY = 'tutorial_app_language';

/**
 * Language Storage API
 */
const languageStorage = {
  /**
   * Save selected language code to persistent storage
   *
   * @param {string} languageCode - Language code to save (e.g., 'en-US', 'hi-IN')
   * @returns {Promise<void>}
   */
  save(languageCode) {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(LANGUAGE_KEY, languageCode);
        console.log('languageStorage - Language saved to storage:', languageCode);
        resolve();
      } catch (error) {
        console.error('languageStorage - Failed to save language:', error);
        reject(error);
      }
    });
  },

  /**
   * Load previously saved language code
   *
   * @returns {Promise<string|null>} Language code or null if not found
   */
  load() {
    return new Promise((resolve, reject) => {
      try {
        const code = localStorage.getItem(LANGUAGE_KEY);
        console.log('languageStorage - Language loaded from storage:', code);
        resolve(code);
      } catch (error) {
        console.error('languageStorage - Failed to load language:', error);
        reject(error);
      }
    });
  },

  /**
   * Clear saved language preference
   *
   * @returns {Promise<void>}
   */
  clear() {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem(LANGUAGE_KEY);
        console.log('languageStorage - Language preference cleared');
        resolve();
      } catch (error) {
        console.error('languageStorage - Failed to clear language:', error);
        reject(error);
      }
    });
  }
};

// Export for global access
if (typeof window !== 'undefined') {
  window.languageStorage = languageStorage;
}
