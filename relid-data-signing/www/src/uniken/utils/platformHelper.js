/**
 * Platform Helper Utility
 *
 * Provides platform detection and platform-specific functionality.
 * Uses Cordova's platformId for reliable platform identification.
 *
 * @module platformHelper
 */

/**
 * Get the current platform identifier
 * @returns {string} Platform ID ('ios', 'android', 'browser', etc.)
 */
function getPlatformId() {
  if (typeof cordova !== 'undefined' && cordova.platformId) {
    return cordova.platformId;
  }
  // Fallback for browser testing
  return 'browser';
}

/**
 * Check if the current platform is iOS
 * @returns {boolean} True if iOS platform
 */
function isIOSPlatform() {
  return getPlatformId() === 'ios';
}

/**
 * Check if the current platform is Android
 * @returns {boolean} True if Android platform
 */
function isAndroidPlatform() {
  return getPlatformId() === 'android';
}

/**
 * Exit the application (Android only)
 * On iOS, this has no effect due to Apple HIG guidelines.
 * Apps should not programmatically terminate themselves on iOS.
 */
function exitApp() {
  const platform = getPlatformId();

  console.log('platformHelper - exitApp called on platform:', platform);

  if (platform === 'android') {
    // Use cordova-plugin-app-exit if available
    if (typeof navigator !== 'undefined' && navigator.app && navigator.app.exitApp) {
      console.log('platformHelper - Calling navigator.app.exitApp()');
      navigator.app.exitApp();
    } else if (typeof navigator !== 'undefined' && navigator.device && navigator.device.exitApp) {
      console.log('platformHelper - Calling navigator.device.exitApp()');
      navigator.device.exitApp();
    } else {
      console.warn('platformHelper - No exit API available');
    }
  } else if (platform === 'ios') {
    console.log('platformHelper - iOS does not support programmatic exit (HIG compliance)');
    // iOS apps should not exit programmatically
    // Instead, navigate to SecurityExitScreen for user guidance
  } else {
    console.warn('platformHelper - exitApp not supported on platform:', platform);
  }
}

// Expose functions to global scope
window.getPlatformId = getPlatformId;
window.isIOSPlatform = isIOSPlatform;
window.isAndroidPlatform = isAndroidPlatform;
window.exitApp = exitApp;
