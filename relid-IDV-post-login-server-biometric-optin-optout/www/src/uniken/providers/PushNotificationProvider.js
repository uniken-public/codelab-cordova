/**
 * Push Notification Provider
 *
 * Ultra-simplified provider that initializes FCM push notifications
 * and registers tokens directly with REL-ID SDK. No complex state management needed
 * since the pushNotificationService singleton handles everything internally.
 *
 * In Cordova, this is a simple initializer (not a React Context).
 * Called once during app startup in AppInitializer.
 *
 * Usage:
 * PushNotificationProvider.initialize();
 */

/**
 * Push Notification Provider
 * Simple initialization manager for FCM push notifications
 */
const PushNotificationProvider = {
  /** @type {boolean} */
  _initialized: false,

  /**
   * Initialize FCM push notifications
   * Safe to call multiple times - will skip if already initialized
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this._initialized) {
      console.log('PushNotificationProvider - Already initialized, skipping');
      return;
    }

    console.log('PushNotificationProvider - Initializing FCM push notifications');

    try {
      // Wait for pushNotificationService to be available
      if (typeof window.pushNotificationService === 'undefined') {
        console.warn('PushNotificationProvider - pushNotificationService not available yet, waiting...');
        // Wait a bit for service to load
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (typeof window.pushNotificationService === 'undefined') {
        console.error('PushNotificationProvider - pushNotificationService still not available');
        return;
      }

      // Initialize the push notification service
      await window.pushNotificationService.initialize();

      this._initialized = true;
      console.log('PushNotificationProvider - FCM initialization successful');
    } catch (error) {
      console.error('PushNotificationProvider - FCM initialization failed:', JSON.stringify(error, null, 2));
      // Don't throw - push notifications are not critical to app function
      // App can continue without push notifications
    }
  },

  /**
   * Check if provider is initialized
   * @returns {boolean}
   */
  isInitialized() {
    return this._initialized;
  },

  /**
   * Reset initialization state (for testing)
   */
  reset() {
    console.log('PushNotificationProvider - Resetting initialization state');
    this._initialized = false;
  }
};

// Export for global access
if (typeof window !== 'undefined') {
  window.PushNotificationProvider = PushNotificationProvider;
}
