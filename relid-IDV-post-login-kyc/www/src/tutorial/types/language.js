/**
 * Language Type Definitions
 *
 * JSDoc type definitions for language-related objects.
 * These types help with IDE autocomplete and documentation.
 *
 * @fileoverview Language type definitions for internationalization
 */

/**
 * Customer Language Interface
 * Separate from SDK's RDNASupportedLanguage - optimized for customer UI
 *
 * @typedef {Object} Language
 * @property {string} lang - Full locale code: 'en-US', 'hi-IN', 'ar-SA', 'es-ES', 'fr-FR'
 * @property {string} display_text - Display name: 'English', 'Hindi', 'Arabic', 'Spanish', 'French'
 * @property {string} nativeName - Native script: 'English', 'हिन्दी', 'العربية', 'Español', 'Français'
 * @property {number} direction - 0 = LTR, 1 = RTL (matches SDK initOptions)
 * @property {boolean} isRTL - Helper for UI decisions
 */

/**
 * SDK's Supported Language Format
 * Returned by SDK in additionalInfo.supportedLanguage array
 *
 * @typedef {Object} RDNASupportedLanguage
 * @property {string} lang - Full locale code: 'en-US', 'hi-IN', 'ar-SA'
 * @property {string} display_text - Display name: 'English', 'Hindi', 'Arabic'
 * @property {string} direction - Direction: 'LTR' or 'RTL'
 */

/**
 * Language Options for SDK InitOptions
 * Passed to rdnaService.initialize(initOptions)
 *
 * @typedef {Object} LanguageOptions
 * @property {string} localeCode - Full locale code: 'en-US', 'hi-IN', 'ar-SA'
 * @property {string} localeName - Display name: 'English', 'Hindi', 'Arabic'
 * @property {number} languageDirection - 0 = LTR, 1 = RTL
 */

/**
 * Set Language Response Data
 * Returned by SDK when setSDKLanguage() is called
 *
 * @typedef {Object} RDNASetLanguageResponseData
 * @property {string} localeCode - Updated locale code
 * @property {string} localeName - Updated locale name
 * @property {number} languageDirection - Updated direction (0 = LTR, 1 = RTL)
 * @property {Array<RDNASupportedLanguage>} supportedLanguages - Updated supported languages from SDK
 * @property {Object} status - Status object
 * @property {number} status.statusCode - Status code (100 = success)
 * @property {string} status.statusMessage - Status message
 * @property {Object} error - Error object
 * @property {number} error.longErrorCode - Long error code (0 = no error)
 * @property {number} error.shortErrorCode - Short error code
 * @property {string} error.errorString - Error description
 */

// Export types documentation
// Note: These are JSDoc types, not runtime values
// They provide IDE autocomplete and documentation only
