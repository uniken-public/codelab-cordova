/**
 * App Initializer
 *
 * Centralized initialization for SDK event handlers in SPA architecture.
 * This is the single source of truth for SDK handler registration.
 *
 * SPA Architecture Benefits:
 * - Called ONCE in app.js deviceready handler
 * - Handlers persist for entire app lifecycle
 * - No re-initialization needed on navigation
 * - Idempotent (safe to call multiple times)
 *
 * Initialization Order:
 * 1. RdnaEventManager.initialize() - Registers document.addEventListener for SDK events
 * 2. SDKEventProvider.initialize() - Registers global navigation handlers
 * 3. MTDThreatManager.getInstance().initialize() - Registers MTD threat handlers
 * 4. SessionManager.getInstance().initialize() - Registers session management handlers
 * 5. PushNotificationProvider.initialize() - Initializes FCM and registers device token
 *
 * Usage:
 * ```javascript
 * // In app.js deviceready handler:
 * AppInitializer.initialize();
 * ```
 *
 * Why needed in SPA:
 * - Prevents code duplication across screens
 * - Ensures consistent handler registration
 * - Maintains event handler persistence
 * - Simplifies screen implementation
 */

const AppInitializer = {
  /**
   * Initialization flag for idempotent behavior
   */
  _initialized: false,

  /**
   * Initialize all SDK event handlers (call ONCE in app.js)
   * Safe to call multiple times - will skip if already initialized
   */
  initialize() {
    if (this._initialized) {
      console.log('AppInitializer - Already initialized, skipping');
      return;
    }

    console.log('AppInitializer - Initializing SDK handlers');

    try {
      // Step 1: Initialize event manager (registers document.addEventListener)
      console.log('AppInitializer - Initializing RdnaEventManager');
      const eventManager = rdnaService.getEventManager();
      eventManager.initialize();

      // Step 2: Initialize SDK event provider (registers global navigation handlers)
      console.log('AppInitializer - Initializing SDKEventProvider');
      SDKEventProvider.initialize();

      // Step 3: Initialize MTD Threat Manager (registers threat event handlers)
      console.log('AppInitializer - Initializing MTDThreatManager');
      MTDThreatManager.getInstance().initialize();

      // Step 4: Initialize Session Manager (registers session management handlers)
      console.log('AppInitializer - Initializing SessionManager');
      SessionManager.getInstance().initialize();

      // Step 5: Initialize Push Notification Provider (FCM token registration)
      console.log('AppInitializer - Initializing PushNotificationProvider');
      // Push notification initialization is async but non-blocking
      // Don't await - let it initialize in background
      PushNotificationProvider.initialize().catch((error) => {
        console.error('AppInitializer - Push notification initialization failed (non-critical):', JSON.stringify(error, null, 2));
      });

      this._initialized = true;
      console.log('AppInitializer - SDK handlers successfully initialized (including MTD, Session, and Push Notifications)');
      console.log('AppInitializer - Handlers will persist for entire app lifecycle (SPA)');
    } catch (error) {
      console.error('AppInitializer - Failed to initialize:', error);
      throw error;
    }
  },

  /**
   * Check if SDK handlers are initialized
   * @returns {boolean} True if initialized
   */
  isInitialized() {
    return this._initialized;
  },

  /**
   * Reset initialization state (for testing only)
   * @private
   */
  _reset() {
    console.warn('AppInitializer - Resetting initialization state (for testing only)');
    this._initialized = false;
  }
};
