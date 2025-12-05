/**
 * Main Application Entry Point - SPA Architecture
 *
 * This is the root of the Cordova SPA application.
 * Responsible ONLY for:
 * 1. Listening for deviceready event
 * 2. Calling AppInitializer.initialize() ONCE
 * 3. Navigating to initial screen (TutorialHome)
 *
 * SPA Architecture Pattern:
 * - SDK handlers initialized ONCE here
 * - Handlers persist for entire app lifecycle
 * - Screen-specific logic belongs in screen modules (not here!)
 * - No UI manipulation (handled by screens)
 * - No business logic (handled by services and screens)
 *
 * Clean Separation of Concerns:
 * - app.js: App bootstrap (deviceready → init → navigate)
 * - AppInitializer.js: SDK handler registration
 * - Screens: UI logic and user interactions
 * - Services: SDK API calls
 * - NavigationService: Screen transitions
 */

const App = {
  /**
   * Initialize the application
   * Sets up deviceready listener
   */
  initialize() {
    console.log('App - Initializing application');
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  /**
   * Device ready handler
   * Called once when Cordova is ready
   *
   * Responsibilities:
   * 1. Initialize SDK handlers (ONE TIME)
   * 2. Navigate to home screen
   * 3. That's it! Everything else handled by screens.
   */
  onDeviceReady() {
    console.log('App - Device ready');
    console.log('App - Platform:', this.getPlatformInfo());

    try {
      // Initialize SDK handlers ONCE (SPA magic!)
      console.log('App - Calling AppInitializer.initialize()');
      AppInitializer.initialize();

      // Initialize drawer menu (persistent UI element)
      console.log('App - Initializing drawer menu');
      NavigationService.initializeDrawer();

      // Navigate to home screen (SPA first screen)
      console.log('App - Navigating to TutorialHome');
      NavigationService.navigate('TutorialHome');

      console.log('App - Initialization complete');
      console.log('App - SDK handlers will persist for entire app lifecycle');
    } catch (error) {
      console.error('App - Critical initialization error:', error);
      alert(`App Initialization Failed\n\n${error.message}\n\nPlease restart the app.`);
    }
  },

  /**
   * Get platform information for debugging
   * @returns {string} Platform info string
   */
  getPlatformInfo() {
    if (typeof device !== 'undefined') {
      return `${device.platform} ${device.version} (${device.model})`;
    }
    return 'Unknown platform';
  }
};

// Bootstrap the application
App.initialize();
