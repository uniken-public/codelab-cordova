/**
 * SDK Event Provider
 *
 * Centralized provider for REL-ID SDK event handling.
 * Manages all SDK events, screen state, and navigation logic in one place.
 *
 * Key Features:
 * - Consolidated event handling for all SDK events
 * - Response routing to appropriate screens
 * - Navigation logic for different event types
 *
 * Usage:
 * Call SDKEventProvider.initialize() on app startup (deviceready)
 */

const SDKEventProvider = {
  /**
   * Initialization flag for idempotent behavior
   */
  _initialized: false,

  /**
   * Initialize the provider - register global event handlers
   * Idempotent - safe to call multiple times (SPA pattern)
   */
  initialize() {
    if (this._initialized) {
      console.log('SDKEventProvider - Already initialized, skipping');
      return;
    }

    console.log('SDKEventProvider - Initializing global event handlers');

    // Get event manager instance
    const eventManager = rdnaService.getEventManager();

    // Set up global handler for onInitialized event
    eventManager.setInitializedHandler(this.handleInitialized.bind(this));

    this._initialized = true;
    console.log('SDKEventProvider - Global event handlers registered');
  },

  /**
   * Handle successful initialization event
   * This is a global handler that navigates to success screen
   * @param {Object} data - Initialized data from SDK
   */
  handleInitialized(data) {
    console.log('SDKEventProvider - Successfully initialized, Session ID:', data.session.sessionID);

    // Navigate to success screen with session data
    NavigationService.navigate('TutorialSuccess', {
      statusCode: data.status.statusCode,
      statusMessage: data.status.statusMessage,
      sessionId: data.session.sessionID,
      sessionType: data.session.sessionType
    });
  },

  /**
   * Cleanup event handlers
   */
  cleanup() {
    console.log('SDKEventProvider - Cleaning up');
    const eventManager = rdnaService.getEventManager();
    eventManager.cleanup();
  }
};
