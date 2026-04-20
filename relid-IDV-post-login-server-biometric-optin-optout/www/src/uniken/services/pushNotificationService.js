/**
 * Push Notification Service
 *
 * Cross-platform FCM integration for REL-ID SDK using cordova-plugin-firebasex.
 * Handles token registration with REL-ID backend via rdnaService.setDeviceToken().
 *
 * Features:
 * - Cross-platform FCM token retrieval (Android & iOS)
 * - Notification permission handling
 * - Automatic token refresh handling
 * - REL-ID SDK integration
 * - Singleton pattern
 *
 * Usage:
 * const pushService = PushNotificationService.getInstance();
 * await pushService.initialize();
 *
 * @requires cordova-plugin-firebasex
 * @requires google-services.json (Android) or GoogleService-Info.plist (iOS)
 */

/**
 * Push Notification Service
 * Singleton for FCM token management using cordova-plugin-firebasex
 */
const PushNotificationService = {
  /** @type {PushNotificationService|null} */
  _instance: null,

  /** @type {boolean} */
  _initialized: false,

  /** @type {RdnaService|null} */
  _rdnaService: null,

  /**
   * Gets singleton instance
   * @returns {PushNotificationService}
   */
  getInstance() {
    if (!this._instance) {
      this._instance = this;
      // Lazy-load rdnaService when first accessed
      if (typeof RdnaService !== 'undefined') {
        this._rdnaService = RdnaService.getInstance();
      }
    }
    return this._instance;
  },

  /**
   * Initialize FCM and register token with REL-ID SDK
   * Supports both Android and iOS platforms
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this._initialized) {
      console.log('PushNotificationService - Already initialized');
      return;
    }

    const platform = getPlatformId();
    console.log('PushNotificationService - Starting FCM initialization for', platform);

    try {
      // Ensure Firebase plugin is available
      if (typeof FirebasePlugin === 'undefined') {
        throw new Error('FirebasePlugin not available. Ensure cordova-plugin-firebasex is installed.');
      }

      // Request permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('PushNotificationService - Permission not granted on', platform);
        return;
      }

      // Get and register initial token
      await this.getAndRegisterToken();

      // Set up token refresh listener
      this.setupTokenRefreshListener();

      this._initialized = true;
      console.log('PushNotificationService - Initialization complete for', platform);
    } catch (error) {
      console.error('PushNotificationService - Initialization failed:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  /**
   * Request FCM permissions
   * Android: Notification permissions (auto-granted on Android <13)
   * iOS: Requests notification authorization (Alert, Sound, Badge)
   * @returns {Promise<boolean>}
   */
  async requestPermissions() {
    return new Promise((resolve) => {
      try {
        const platform = getPlatformId();
        console.log('PushNotificationService - Checking permission for', platform);

        // Check current permission status
        FirebasePlugin.hasPermission((hasPermission) => {
          console.log('PushNotificationService - Current permission status:', hasPermission);

          if (hasPermission) {
            console.log('PushNotificationService - Permission already granted');
            resolve(true);
            return;
          }

          // Request permission (iOS will show dialog, Android handles automatically)
          console.log('PushNotificationService - Requesting permission');
          FirebasePlugin.grantPermission((granted) => {
            console.log('PushNotificationService - Permission result:', granted);
            resolve(granted);
          }, (error) => {
            console.error('PushNotificationService - Permission request failed:', JSON.stringify(error, null, 2));
            resolve(false);
          });
        }, (error) => {
          console.error('PushNotificationService - Permission check failed:', JSON.stringify(error, null, 2));
          resolve(false);
        });
      } catch (error) {
        console.error('PushNotificationService - Permission request error:', JSON.stringify(error, null, 2));
        resolve(false);
      }
    });
  },

  /**
   * Get FCM token and register with REL-ID SDK
   * Android: Gets FCM registration token
   * iOS: Gets FCM token (mapped from APNS token by Firebase automatically)
   * @returns {Promise<void>}
   */
  async getAndRegisterToken() {
    return new Promise((resolve, reject) => {
      try {
        const platform = getPlatformId();
        console.log('PushNotificationService - Getting FCM token for', platform);

        // On iOS, also log APNS token for debugging
        if (platform === 'ios') {
          FirebasePlugin.getAPNSToken((apnsToken) => {
            if (apnsToken) {
              console.log('PushNotificationService - iOS APNS token available, length:', apnsToken.length);
              console.log('PushNotificationService - APNS TOKEN:', apnsToken);
            } else {
              console.log('PushNotificationService - iOS APNS token not yet available');
            }
          }, (error) => {
            console.log('PushNotificationService - APNS token check failed (non-critical):', JSON.stringify(error, null, 2));
          });
        }

        FirebasePlugin.getToken((token) => {
          if (!token) {
            console.warn('PushNotificationService - No FCM token received for', platform);
            resolve();
            return;
          }

          console.log('PushNotificationService - FCM token received for', platform, ', length:', token.length);
          console.log('PushNotificationService - FCM TOKEN:', token);

          try {
            // Register with REL-ID SDK
            if (this._rdnaService && typeof this._rdnaService.setDeviceToken === 'function') {
              this._rdnaService.setDeviceToken(token);
              console.log('PushNotificationService - Token registered with REL-ID SDK');
            } else {
              console.warn('PushNotificationService - rdnaService not available, token not registered');
            }

            resolve();
          } catch (error) {
            console.error('PushNotificationService - REL-ID registration failed:', JSON.stringify(error, null, 2));
            reject(error);
          }
        }, (error) => {
          // On iOS, APNS token may not be ready yet (error code 505)
          // Firebase will trigger token refresh when APNS becomes available
          const platform = getPlatformId();
          const errorStr = error ? error.toString() : '';
          const hasCode505 = (error && error.code === 505) || (errorStr.includes('Code=505') || errorStr.includes('code 505'));

          if (hasCode505 && platform === 'ios') {
            console.log('PushNotificationService - APNS not ready yet, waiting for token refresh listener');
            resolve(); // Don't fail - token will come through refresh listener
            return;
          }

          console.error('PushNotificationService - Token retrieval failed:', JSON.stringify(error, null, 2));
          reject(error);
        });
      } catch (error) {
        console.error('PushNotificationService - getAndRegisterToken error:', JSON.stringify(error, null, 2));
        reject(error);
      }
    });
  },

  /**
   * Set up automatic token refresh
   * Handles token refresh for both Android and iOS
   */
  setupTokenRefreshListener() {
    const platform = getPlatformId();
    console.log('PushNotificationService - Setting up token refresh listener for', platform);

    try {
      FirebasePlugin.onTokenRefresh((token) => {
        console.log('PushNotificationService - Token refreshed for', platform, ', length:', token.length);
        console.log('PushNotificationService - REFRESHED FCM TOKEN:', token);

        try {
          // Register new token with REL-ID SDK
          if (this._rdnaService && typeof this._rdnaService.setDeviceToken === 'function') {
            this._rdnaService.setDeviceToken(token);
            console.log('PushNotificationService - Refreshed token registered with REL-ID SDK');
          } else {
            console.warn('PushNotificationService - rdnaService not available, refreshed token not registered');
          }
        } catch (error) {
          console.error('PushNotificationService - Token refresh registration failed:', JSON.stringify(error, null, 2));
        }
      }, (error) => {
        console.error('PushNotificationService - Token refresh listener error:', JSON.stringify(error, null, 2));
      });
    } catch (error) {
      console.error('PushNotificationService - setupTokenRefreshListener error:', JSON.stringify(error, null, 2));
    }
  },

  /**
   * Get current FCM token (for debugging)
   * @returns {Promise<string|null>}
   */
  async getCurrentToken() {
    return new Promise((resolve) => {
      try {
        FirebasePlugin.getToken((token) => {
          resolve(token);
        }, (error) => {
          console.error('PushNotificationService - Failed to get current token:', JSON.stringify(error, null, 2));
          resolve(null);
        });
      } catch (error) {
        console.error('PushNotificationService - getCurrentToken error:', JSON.stringify(error, null, 2));
        resolve(null);
      }
    });
  },

  /**
   * Get APNS token (iOS only)
   * For iOS, this returns the raw APNS token before Firebase maps it to an FCM token
   * @returns {Promise<string|null>}
   */
  async getAPNSToken() {
    const platform = getPlatformId();

    if (platform !== 'ios') {
      console.log('PushNotificationService - getAPNSToken is only available on iOS');
      return null;
    }

    return new Promise((resolve) => {
      try {
        FirebasePlugin.getAPNSToken((token) => {
          if (token) {
            console.log('PushNotificationService - APNS token received, length:', token.length);
            console.log('PushNotificationService - APNS TOKEN:', token);
          } else {
            console.log('PushNotificationService - No APNS token available yet');
          }
          resolve(token);
        }, (error) => {
          console.error('PushNotificationService - Failed to get APNS token:', JSON.stringify(error, null, 2));
          resolve(null);
        });
      } catch (error) {
        console.error('PushNotificationService - getAPNSToken error:', JSON.stringify(error, null, 2));
        resolve(null);
      }
    });
  },

  /**
   * Cleanup (reset initialization state)
   */
  cleanup() {
    console.log('PushNotificationService - Cleanup');
    this._initialized = false;
  }
};

// Export singleton instance for global access
// Usage: window.pushNotificationService.initialize()
if (typeof window !== 'undefined') {
  window.pushNotificationService = PushNotificationService.getInstance();
}
