/**
 * Language Configuration
 *
 * Centralized language constants and utility functions for internationalization.
 * Provides default language options and conversion utilities for SDK integration.
 *
 * @fileoverview Language configuration for REL-ID SDK internationalization
 */

/**
 * Default Hardcoded Languages
 * Shown before SDK initialization completes
 * Using full locale codes for consistency with SDK
 *
 * @type {Array<Language>}
 */
const DEFAULT_SUPPORTED_LANGUAGES = [
  {
    lang: 'en-US',
    display_text: 'English',
    nativeName: 'English',
    direction: 0,
    isRTL: false
  },
  {
    lang: 'hi-IN',
    display_text: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 0,
    isRTL: false
  },
  {
    lang: 'ar-SA',
    display_text: 'Arabic',
    nativeName: 'العربية',
    direction: 1,
    isRTL: true
  },
  {
    lang: 'es-ES',
    display_text: 'Spanish',
    nativeName: 'Español',
    direction: 0,
    isRTL: false
  },
  {
    lang: 'fr-FR',
    display_text: 'French',
    nativeName: 'Français',
    direction: 0,
    isRTL: false
  }
];

/**
 * Default Language (English)
 * @type {Language}
 */
const DEFAULT_LANGUAGE = DEFAULT_SUPPORTED_LANGUAGES[0];

/**
 * Native Name Lookup Table
 * SDK doesn't provide native names, so we maintain this hardcoded mapping
 * Maps language code prefix to native script name
 *
 * @type {Object<string, string>}
 */
const NATIVE_NAME_LOOKUP = {
  'en': 'English',
  'hi': 'हिन्दी',
  'ar': 'العربية',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português',
  'ru': 'Русский',
  'zh': '中文',
  'ja': '日本語',
  'ko': '한국어'
};

/**
 * Get native name for a language code
 * Extracts base language code and looks up native name
 *
 * @param {string} langCode - Full locale code (e.g., 'en-US', 'hi-IN')
 * @param {string} displayText - Display text as fallback
 * @returns {string} Native name or display_text as fallback
 */
function getNativeName(langCode, displayText) {
  const baseCode = langCode.split('-')[0]; // 'en-US' → 'en'
  return NATIVE_NAME_LOOKUP[baseCode] || displayText;
}

/**
 * Convert SDK's RDNASupportedLanguage to Customer's Language interface
 * Maps SDK response format to customer UI format with native names
 *
 * SDK Format:
 * {
 *   lang: "en-US",
 *   display_text: "English",
 *   direction: "LTR"  // or "RTL"
 * }
 *
 * Customer Format:
 * {
 *   lang: "en-US",
 *   display_text: "English",
 *   nativeName: "English",
 *   direction: 0,       // 0 = LTR, 1 = RTL
 *   isRTL: false
 * }
 *
 * @param {RDNASupportedLanguage} sdkLang - SDK language object
 * @returns {Language} Customer Language object
 */
function convertSDKLanguageToCustomer(sdkLang) {
  const directionNum = sdkLang.direction === 'RTL' ? 1 : 0;
  const isRTL = sdkLang.direction === 'RTL';
  const nativeName = getNativeName(sdkLang.lang, sdkLang.display_text);

  return {
    lang: sdkLang.lang,
    display_text: sdkLang.display_text,
    nativeName: nativeName,
    direction: directionNum,
    isRTL: isRTL
  };
}

/**
 * Get language by locale code
 *
 * @param {string} langCode - Full locale code (e.g., 'en-US') or base code (e.g., 'en')
 * @param {Array<Language>} languages - Language array to search in
 * @returns {Language} Matching language or default
 */
function getLanguageByCode(langCode, languages) {
  // Try exact match first
  let found = languages.find(lang => lang.lang === langCode);

  // If not found, try matching base code (e.g., 'en' matches 'en-US')
  if (!found) {
    const baseCode = langCode.split('-')[0];
    found = languages.find(lang => lang.lang.startsWith(baseCode));
  }

  return found || DEFAULT_LANGUAGE;
}

/**
 * Extract short language code for SDK initOptions
 * SDK initOptions expects short codes like 'en', 'hi', 'ar'
 *
 * @param {string} fullLocale - Full locale code (e.g., 'en-US')
 * @returns {string} Short language code (e.g., 'en')
 */
function getShortLanguageCode(fullLocale) {
  return fullLocale.split('-')[0];
}

// Export for global access
if (typeof window !== 'undefined') {
  window.languageConfig = {
    DEFAULT_SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE,
    NATIVE_NAME_LOOKUP,
    getNativeName,
    convertSDKLanguageToCustomer,
    getLanguageByCode,
    getShortLanguageCode
  };
}
