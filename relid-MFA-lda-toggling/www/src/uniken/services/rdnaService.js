/**
 * REL-ID Service
 *
 * Centralized service for REL-ID SDK operations.
 * Provides a singleton pattern for consistent SDK access across the application.
 *
 * @typedef {Object} RDNASyncResponse
 * @property {Object} error
 * @property {number} error.longErrorCode
 * @property {number} error.shortErrorCode
 * @property {string} error.errorString
 */

class RdnaService {
  constructor() {
    if (RdnaService.instance) {
      return RdnaService.instance;
    }

    this.eventManager = null;
    RdnaService.instance = this;
  }

  /**
   * Gets the singleton instance of RdnaService
   * @returns {RdnaService}
   */
  static getInstance() {
    if (!RdnaService.instance) {
      RdnaService.instance = new RdnaService();
    }
    return RdnaService.instance;
  }

  /**
   * Cleans up the service and event manager
   */
  cleanup() {
    console.log('RdnaService - Cleaning up service');
    if (this.eventManager) {
      this.eventManager.cleanup();
    }
  }

  /**
   * Gets the event manager instance for external callback setup
   * @returns {RdnaEventManager}
   */
  getEventManager() {
    if (!this.eventManager) {
      // Lazy load to avoid circular dependency
      this.eventManager = RdnaEventManager.getInstance();
    }
    return this.eventManager;
  }

  /**
   * Gets the version of the REL-ID SDK
   * @returns {Promise<string>} SDK version string
   */
  async getSDKVersion() {
    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.getSDKVersion(
        (response) => {
          console.log('RdnaService - SDK version response received');

          try {
            // Plugin returns JSON string - must parse
            const parsed = JSON.parse(response);
            const version = parsed?.response || 'Unknown';
            console.log('RdnaService - SDK Version:', version);
            resolve(version);
          } catch (error) {
            console.error('RdnaService - Failed to parse SDK version:', error);
            reject(new Error('Failed to parse SDK version response'));
          }
        },
        (error) => {
          console.error('RdnaService - getSDKVersion error:', error);
          reject(error);
        },
        [] // No parameters for getSDKVersion
      );
    });
  }

  /**
   * Registers device push notification token with REL-ID SDK
   * Used to enable push notifications for REL-ID server notifications
   *
   * @param {string} token - FCM token from Firebase (Android/iOS)
   * @throws {Error} if token registration fails
   */
  setDeviceToken(token) {
    console.log('RdnaService - Registering device push token with REL-ID SDK');
    console.log('RdnaService - Token length:', token ? token.length : 0);

    if (!token || typeof token !== 'string') {
      const error = 'Invalid token: must be a non-empty string';
      console.error('RdnaService - ' + error);
      throw new Error(error);
    }

    try {
      // Call native plugin to register token with REL-ID backend
      // This is a fire-and-forget operation - no callback needed
      com.uniken.rdnaplugin.RdnaClient.setDeviceToken(
        () => {
          console.log('RdnaService - Device push token registration successful');
        },
        (error) => {
          console.error('RdnaService - Device push token registration failed:', JSON.stringify(error, null, 2));
        },
        [token]
      );

      console.log('RdnaService - Device push token registration initiated');
    } catch (error) {
      console.error('RdnaService - Device push token registration error:', JSON.stringify(error, null, 2));
      throw new Error('Failed to register device push token: ' + error);
    }
  }

  /**
   * Initializes the REL-ID SDK
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async initialize() {
    // Load connection profile
    const profile = await loadAgentInfo();
    console.log('RdnaService - Loaded connection profile:', JSON.stringify({
      host: profile.host,
      port: profile.port,
      relId: profile.relId.substring(0, 10) + '...',
    }, null, 2));

    console.log('RdnaService - Starting initialization');

    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.initialize(
        (response) => {
          console.log('RdnaService - Initialize sync callback received');
          
            // Plugin returns JSON string - must parse
          const result = JSON.parse(response);
          console.log('RdnaService - Initialize sync response:', JSON.stringify({
              longErrorCode: result.error?.longErrorCode,
              shortErrorCode: result.error?.shortErrorCode,
              errorString: result.error?.errorString
            }, null, 2));
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - Initialize sync error callback:');
          const result = JSON.parse(error);
          console.log('RdnaService - Initialize sync error response:', JSON.stringify({
              longErrorCode: result.error?.longErrorCode,
              shortErrorCode: result.error?.shortErrorCode,
              errorString: result.error?.errorString
            }, null, 2));
          reject(result);
        },
        [
          profile.relId,                                              // 0: agentInfo - The REL-ID encrypted string
          profile.host,                                               // 1: gatewayHost - Hostname or IP of the gateway server
          profile.port,                                               // 2: gatewayPort - Port number for gateway server
          '',                                                         // 3: cipherSpecs - Encryption format string
          '',                                                         // 4: cipherSalt - Cryptographic salt
          '',                                                         // 5: proxySettings - Proxy configuration (JSON string, optional)
          '',                                                         // 6: sslCertificate - SSL certificate configuration (optional)
          com.uniken.rdnaplugin.RdnaClient.RDNALoggingLevel.RDNA_NO_LOGS  // 7: logLevel - Logging level 
        ]
      );
    });
  }

  /**
   * Takes action on detected security threats
   *
   * @param {string} modifiedThreatsJson - JSON string containing threat action decisions
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   *
   * @example
   * const modifiedThreats = threats.map(threat => ({
   *   ...threat,
   *   shouldProceedWithThreats: true,
   *   rememberActionForSession: true
   * }));
   * await rdnaService.takeActionOnThreats(JSON.stringify(modifiedThreats));
   */
  async takeActionOnThreats(modifiedThreatsJson) {
    console.log('RdnaService - Taking action on threats');

    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.takeActionOnThreats(
        (response) => {
          console.log('RdnaService - Take action on threats sync callback received');

            // Plugin returns JSON string - must parse
          const result = JSON.parse(response);
          console.log('RdnaService - takeActionOnThreats sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - takeActionOnThreats error callback');
          const result = JSON.parse(error);
          console.error('RdnaService - takeActionOnThreats error:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          reject(result);

        },
        [modifiedThreatsJson] // ← CRITICAL: Must be array with stringified JSON
      );
    });
  }

  /**
   * Sets user for MFA User Activation Flow
   *
   * This method submits the username for user validation during the MFA flow.
   * It validates the user identity and prepares for subsequent authentication steps.
   * Uses sync response pattern similar to initialize() method.
   *
   * @see https://developer.uniken.com/docs/setuser
   *
   * Response Validation Logic:
   * - Success callback: Always has errorCode 0, async events will follow
   * - Error callback: Called when API fails
   *
   * @param {string} username - The username to validate
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async setUser(username) {
    console.log('RdnaService - Setting user for MFA flow:', username);

    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.setUser(
        (response) => {
          console.log('RdnaService - SetUser sync callback received');

          // Plugin returns JSON string - must parse
          const result = JSON.parse(response);
          console.log('RdnaService - setUser sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0
          console.log('RdnaService - SetUser sync response success, waiting for async events');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - setUser error callback:', error);
          const result = JSON.parse(error);
          reject(result);
        },
        [username]
      );
    });
  }

  /**
   * Sets activation code for MFA User Activation Flow
   *
   * This method submits the activation code for user validation during the MFA flow.
   * It processes the OTP/activation code and validates the user identity.
   * Uses sync response pattern similar to initialize() method.
   *
   * @see https://developer.uniken.com/docs/setactivationcode
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Async events will be handled by event listeners for getActivationCode, etc.
   *
   * @param {string} activationCode - The activation code to validate
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async setActivationCode(activationCode) {
    console.log('RdnaService - Setting activation code for MFA flow:', activationCode);

    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.setActivationCode(
        (response) => {
          console.log('RdnaService - SetActivationCode sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - setActivationCode sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0
          console.log('RdnaService - SetActivationCode sync response success, waiting for async events');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - setActivationCode error callback:', error);
          const result = JSON.parse(error);
          reject(result);
        },
        [activationCode]
      );
    });
  }

  /**
   * Sets user consent for LDA (Local Device Authentication)
   *
   * This method submits the user's consent for LDA enrollment during authentication flows.
   * It processes the user's decision and the authentication parameters from getUserConsentForLDA event.
   * Uses sync response pattern similar to initialize() method.
   *
   * @see https://developer.uniken.com/docs/get-user-consent-for-lda
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Async events will be handled by event listeners for subsequent authentication steps
   *
   * @param {boolean} isEnrollLDA - User consent decision (true = approve, false = reject)
   * @param {number} challengeMode - Challenge mode from getUserConsentForLDA event
   * @param {number} authenticationType - Authentication type from getUserConsentForLDA event
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async setUserConsentForLDA(isEnrollLDA, challengeMode, authenticationType) {
    console.log('RdnaService - Setting user consent for LDA:', JSON.stringify({
      isEnrollLDA,
      challengeMode,
      authenticationType
    }, null, 2));

    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.setUserConsentForLDA(
        (response) => {
          console.log('RdnaService - SetUserConsentForLDA sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - setUserConsentForLDA sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0
          console.log('RdnaService - SetUserConsentForLDA sync response success, waiting for async events');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - setUserConsentForLDA error callback:', error);
          const result = JSON.parse(error);
          reject(result);
        },
        [isEnrollLDA, challengeMode, authenticationType]
      );
    });
  }

  /**
   * Resends activation code for MFA User Activation Flow
   *
   * This method requests a new activation code (OTP) to be sent to the user via email or SMS.
   * It's used when the user hasn't received their original activation code and needs a resend.
   * Calling this method triggers a new getActivationCode event with updated information.
   * Uses sync response pattern similar to initialize() method.
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. A new getActivationCode event will be triggered with fresh OTP information
   * 3. Async events will be handled by event listeners for getActivationCode, etc.
   *
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async resendActivationCode() {
    console.log('RdnaService - Requesting resend of activation code');

    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.resendActivationCode(
        (response) => {
          console.log('RdnaService - ResendActivationCode sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - resendActivationCode sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0
          console.log('RdnaService - ResendActivationCode sync response success, waiting for new getActivationCode event');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - resendActivationCode error callback:', error);
          const result = JSON.parse(error);
          reject(result);
        },
        []
      );
    });
  }

  /**
   * Sets password for MFA User Authentication Flow
   *
   * This method submits the user's password for authentication during the MFA flow.
   * It processes the password and validates it against the challenge requirements.
   * Uses sync response pattern similar to initialize() method.
   *
   * @see https://developer.uniken.com/docs/setpassword
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Async events will be handled by event listeners for subsequent authentication steps
   *
   * @param {string} password - The password to validate
   * @param {number} challengeMode - Challenge mode from getPassword event (0=verify, 1=create)
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async setPassword(password, challengeMode = 1) {
    console.log('RdnaService - Setting password for MFA flow (challengeMode:', challengeMode + ')');

    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.setPassword(
        (response) => {
          console.log('RdnaService - SetPassword sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - setPassword sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0 (plugin routes by error code)
          console.log('RdnaService - SetPassword sync response success, waiting for async events');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - setPassword error callback:', error);
          const result = JSON.parse(error);
          reject(result);
        },
        [password, challengeMode]
      );
    });
  }

  /**
   * Resets authentication state and returns to initial flow
   *
   * This method resets the current authentication flow and clears any stored state.
   * After successful reset, the SDK will trigger a new getUser event to restart the flow.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/reset-authentication
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. A new getUser event will be triggered to restart the authentication flow
   * 3. Async events will be handled by event listeners
   *
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async resetAuthState() {
    console.log('RdnaService - Resetting authentication state');

    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.resetAuthState(
        (response) => {
          console.log('RdnaService - ResetAuthState sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - resetAuthState sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0
          console.log('RdnaService - ResetAuthState sync response success, waiting for new getUser event');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - resetAuthState error callback:', error);
          const result = JSON.parse(error);
          reject(result);
        },
        []
      );
    });
  }

  /**
   * Logs off the user and terminates their authenticated session
   *
   * This method securely terminates the user's authenticated session.
   * After successful logoff, the SDK will trigger an onUserLoggedOff event followed by getUser event.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/logoff
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onUserLoggedOff event will be triggered to confirm successful logout
   * 3. A getUser event will be triggered to restart the authentication flow
   * 4. Async events will be handled by event listeners
   *
   * @param {string} userID - The unique user identifier for the user to log off
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async logOff(userID) {
    console.log('RdnaService - Logging off user:', userID);

    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.logOff(
        (response) => {
          console.log('RdnaService - LogOff sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - logOff sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0
          console.log('RdnaService - LogOff sync response success, waiting for onUserLoggedOff event');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - logOff error callback:', error);
          const result = JSON.parse(error);
          reject(result);
        },
        [userID]
      );
    });
  }

  /**
   * Extends the session idle timeout period
   *
   * This method extends the current session's idle timeout when the user is approaching session expiration.
   * It's typically called in response to a session timeout notification (onSessionTimeOutNotification event)
   * when the user chooses to extend their session rather than let it expire.
   *
   * The SDK will respond with an onSessionExtensionResponse event containing the result of the extension attempt.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/session-management
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onSessionExtensionResponse event will be triggered with the extension result
   * 3. Async events will be handled by event listeners (SessionManager)
   *
   * Event Flow:
   * - User receives onSessionTimeOutNotification (idle timeout warning)
   * - User clicks "Extend Session" button
   * - This method is called
   * - SDK processes the extension request
   * - SDK triggers onSessionExtensionResponse event
   * - SessionManager handles the response and updates UI accordingly
   *
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async extendSessionIdleTimeout() {
    console.log('RdnaService - Extending session idle timeout');

    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.extendSessionIdleTimeout(
        (response) => {
          console.log('RdnaService - ExtendSessionIdleTimeout sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - extendSessionIdleTimeout sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0
          console.log('RdnaService - ExtendSessionIdleTimeout sync response success, waiting for onSessionExtensionResponse event');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - extendSessionIdleTimeout error callback:', error);
          const result = JSON.parse(error);
          reject(result);
        },
        [] // No parameters required
      );
    });
  }

  /**
   * Fetches notifications from the REL-ID server
   *
   * This method retrieves pending notifications from the server.
   * After successful API call, the SDK will trigger an onGetNotifications event with notification list.
   * Uses sync response pattern similar to other API methods.
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onGetNotifications event will be triggered with notification array
   * 3. Async events will be handled by event listeners
   *
   * @param {number} recordCount - Number of records to fetch (0 = all)
   * @param {number} startIndex - Starting index for pagination (default: 1)
   * @param {string} startDate - Optional start date filter (format: YYYY-MM-DD)
   * @param {string} endDate - Optional end date filter (format: YYYY-MM-DD)
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async getNotifications(recordCount = 0, startIndex = 1, startDate = '', endDate = '') {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Fetching notifications with recordCount:', recordCount, 'startIndex:', startIndex);

      com.uniken.rdnaplugin.RdnaClient.getNotifications(
        (response) => {
          console.log('RdnaService - GetNotifications sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - getNotifications sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0 (plugin routes by error code)
          console.log('RdnaService - GetNotifications sync response success, waiting for onGetNotifications event');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - getNotifications error callback:', error);
          const result = JSON.parse(error);
          reject(result);
        },
        [recordCount, '', startIndex, startDate, endDate] // [RECORD_COUNT, ENTERPRISE_ID, START_RECORD, START_DATE, END_DATE]
      );
    });
  }

  /**
   * Updates a notification with user's action response
   *
   * This method submits the user's response to a notification action.
   * After successful API call, the SDK will trigger an onUpdateNotification event with update status.
   * Uses sync response pattern similar to other API methods.
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onUpdateNotification event will be triggered with update status
   * 3. Async events will be handled by event listeners
   *
   * @param {string} notificationId - The notification UUID to update
   * @param {string} actionResponse - The action response value selected by user
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async updateNotification(notificationId, actionResponse) {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Updating notification:', notificationId, 'with response:', actionResponse);

      com.uniken.rdnaplugin.RdnaClient.updateNotification(
        (response) => {
          console.log('RdnaService - UpdateNotification sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - updateNotification sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0 (plugin routes by error code)
          console.log('RdnaService - UpdateNotification sync response success, waiting for onUpdateNotification event');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - updateNotification error callback:', error);
          const result = JSON.parse(error);
          reject(result);
        },
        [notificationId, actionResponse] // [NOTIFICATION_ID, NOTIFICATION_ACTION]
      );
    });
  }

  /**
   * Performs verify authentication for new device activation
   *
   * This method processes the user's decision on new device activation via REL-ID Verify.
   * When called with true, it sends verification notifications to registered devices.
   * When called with false, it cancels the verification process.
   * Uses sync response pattern similar to other API methods.
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Async events will be handled by event listeners for subsequent steps
   * 3. Success typically leads to LDA consent or password flow
   *
   * @param {boolean} verifyAuthStatus - User's decision (true = proceed with verification, false = cancel)
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async performVerifyAuth(verifyAuthStatus) {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Performing verify auth with status:', verifyAuthStatus);

      com.uniken.rdnaplugin.RdnaClient.performVerifyAuth(
        (response) => {
          console.log('RdnaService - PerformVerifyAuth sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - performVerifyAuth sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0 (plugin routes by error code)
          console.log('RdnaService - PerformVerifyAuth sync response success, waiting for async events');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - performVerifyAuth error callback:', error);
          const result = JSON.parse(error);
          reject(result);
        },
        [verifyAuthStatus, false] // [Verify Auth, Enterprise Registration]
      );
    });
  }

  /**
   * Initiates fallback new device activation flow
   *
   * This method provides an alternative device activation method when REL-ID Verify
   * is not available, fails, or expires. It initiates a server-configured fallback
   * challenge flow, typically triggering a getActivationCode event.
   * Uses sync response pattern similar to other API methods.
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Typically triggers getActivationCode event for alternative verification
   * 3. Async events will be handled by event listeners
   *
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async fallbackNewDeviceActivationFlow() {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Initiating fallback new device activation flow');

      com.uniken.rdnaplugin.RdnaClient.fallbackNewDeviceActivationFlow(
        (response) => {
          console.log('RdnaService - FallbackNewDeviceActivationFlow sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - fallbackNewDeviceActivationFlow sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0 (plugin routes by error code)
          console.log('RdnaService - FallbackNewDeviceActivationFlow sync response success, waiting for async events');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - fallbackNewDeviceActivationFlow error callback:', error);
          const result = JSON.parse(error);
          reject(result);
        }
        // No parameters required
      );
    });
  }

  /**
   * Initiates forgot password flow for password reset
   *
   * This method initiates the forgot password flow when challengeMode == 0 and ENABLE_FORGOT_PASSWORD is true.
   * It triggers a verification challenge followed by password reset process.
   * Can only be used on an active device and requires user verification.
   * Uses sync response pattern similar to other API methods.
   *
   * @see https://developer.uniken.com/docs/forgot-password
   *
   * Workflow:
   * 1. User initiates forgot password
   * 2. SDK triggers verification challenge (e.g., activation code, email OTP)
   * 3. User completes challenge
   * 4. SDK validates challenge
   * 5. User sets new password
   * 6. SDK logs user in automatically
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Success typically navigates to home screen or triggers verification challenge
   * 3. Error Code 170 = Feature not supported
   * 4. Async events will be handled by event listeners
   *
   * @param {string} userId - User ID for the forgot password flow (optional)
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async forgotPassword(userId = '') {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Initiating forgot password flow for userId:', userId || 'current user');

      com.uniken.rdnaplugin.RdnaClient.forgotPassword(
        (response) => {
          console.log('RdnaService - ForgotPassword sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - forgotPassword sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0 (plugin routes by error code)
          console.log('RdnaService - ForgotPassword sync response success, starting verification challenge');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - forgotPassword error callback:', error);
          const result = JSON.parse(error);
          console.error('RdnaService - forgotPassword sync error:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          reject(result);
        },
        [userId] // [USER_ID] - Optional user ID parameter
      );
    });
  }

  /**
   * Updates password when expired (Password Expiry Flow)
   *
   * This method is specifically used for updating expired passwords during the MFA flow.
   * When a password is expired during login (challengeMode=0), the SDK automatically
   * re-triggers getPassword() with challengeMode=4 (RDNA_OP_UPDATE_ON_EXPIRY).
   * The app should then call this method with both current and new passwords.
   *
   * @see https://developer.uniken.com/docs/password-expiry
   *
   * Workflow:
   * 1. User logs in with expired password (challengeMode = 0)
   * 2. SDK re-triggers getPassword with challengeMode = 4
   * 3. App calls updatePassword(currentPassword, newPassword, 4)
   * 4. On success, SDK triggers onUserLoggedIn event
   * 5. User is automatically logged in with new password
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. On success, triggers onUserLoggedIn event immediately
   * 3. Status Code 164 = Password reuse error (new password same as old passwords)
   * 4. Status Code 153 = Attempts exhausted
   * 5. Async events will be handled by event listeners
   *
   * @param {string} currentPassword - The user's current password
   * @param {string} newPassword - The new password to set
   * @param {number} challengeMode - Challenge mode (should be 4 for RDNA_OP_UPDATE_ON_EXPIRY)
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async updatePassword(currentPassword, newPassword, challengeMode) {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Updating password with challengeMode:', challengeMode);

      com.uniken.rdnaplugin.RdnaClient.updatePassword(
        (response) => {
          console.log('RdnaService - UpdatePassword sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - updatePassword sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Success callback - always errorCode 0 (plugin routes by error code)
          console.log('RdnaService - UpdatePassword sync response success, waiting for onUserLoggedIn event');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - updatePassword error callback:', error);
          const result = JSON.parse(error);
          console.error('RdnaService - updatePassword sync error:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          reject(result);
        },
        [currentPassword, newPassword, challengeMode] // [CURRENT_PASSWORD, NEW_PASSWORD, CHALLENGE_MODE]
      );
    });
  }

  /**
   * Gets all available challenges for a user
   *
   * This method retrieves all credentials that can be updated for a given user.
   * After successful API call, the SDK triggers onCredentialsAvailableForUpdate event
   * with an array of available credential types (e.g., ["Password", "SecurityQuestions"]).
   *
   * Usage:
   * - Call this method after successful login to check if password update is available
   * - Listen for onCredentialsAvailableForUpdate event to get the list of credentials
   * - Check if "Password" is in the options array to show password update UI
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. An onCredentialsAvailableForUpdate event will be triggered with available options
   * 3. Async events will be handled by event listeners
   *
   * @param {string} username - The username for which to retrieve available challenges
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async getAllChallenges(username) {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Getting all available challenges for user:', username);

      com.uniken.rdnaplugin.RdnaClient.getAllChallenges(
        (response) => {
          console.log('RdnaService - GetAllChallenges sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - getAllChallenges sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          if (result.error && result.error.longErrorCode === 0) {
            console.log('RdnaService - GetAllChallenges sync response success, waiting for onCredentialsAvailableForUpdate event');
            resolve(result);
          } else {
            console.error('RdnaService - GetAllChallenges sync response error');
            reject(result);
          }
        },
        (error) => {
          console.error('RdnaService - getAllChallenges error callback:', error);
          const result = JSON.parse(error);
          console.error('RdnaService - getAllChallenges sync error:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          reject(result);
        },
        [username] // [USERNAME]
      );
    });
  }

  /**
   * Initiates update flow for a specific credential type
   *
   * This method starts the credential update flow for the specified credential type.
   * After successful API call, the SDK triggers the appropriate getXXX event based on
   * the credential type (e.g., getPassword for "Password" credential).
   *
   * Usage:
   * - Call this method when user wants to update a credential (e.g., from settings screen)
   * - For "Password", triggers getPassword event with challengeMode = 2 (RDNA_OP_UPDATE_CREDENTIALS)
   * - Navigate to appropriate update screen when getPassword event is received
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. For "Password", triggers getPassword event with challengeMode = 2 (RDNA_OP_UPDATE_CREDENTIALS)
   * 3. Async events will be handled by event listeners
   *
   * @param {string} credentialType - The credential type to update (e.g., "Password")
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async initiateUpdateFlowForCredential(credentialType) {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Initiating update flow for credential:', credentialType);

      com.uniken.rdnaplugin.RdnaClient.initiateUpdateFlowForCredential(
        (response) => {
          console.log('RdnaService - InitiateUpdateFlowForCredential sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - initiateUpdateFlowForCredential sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          if (result.error && result.error.longErrorCode === 0) {
            console.log('RdnaService - InitiateUpdateFlowForCredential sync response success, waiting for get credential event');
            resolve(result);
          } else {
            console.error('RdnaService - InitiateUpdateFlowForCredential sync response error');
            reject(result);
          }
        },
        (error) => {
          console.error('RdnaService - initiateUpdateFlowForCredential error callback:', error);
          const result = JSON.parse(error);
          console.error('RdnaService - initiateUpdateFlowForCredential sync error:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          reject(result);
        },
        [credentialType] // [CREDENTIAL_TYPE]
      );
    });
  }

  /**
   * Gets device authentication details (LDA Toggling)
   *
   * Retrieves the list of authentication capabilities supported by the device.
   * This method returns data synchronously in the callback - there is NO async event.
   * Used by LDA Toggling screen to display available authentication types.
   *
   * @see https://developer.uniken.com/docs/lda-toggling
   *
   * Workflow:
   * 1. User navigates to LDA Toggling screen
   * 2. Screen calls getDeviceAuthenticationDetails()
   * 3. Sync callback returns { error, authenticationCapabilities: [...] }
   * 4. Screen displays authentication types with toggle switches
   *
   * Response Structure:
   * {
   *   error: { longErrorCode, shortErrorCode, errorString },
   *   authenticationCapabilities: [
   *     {
   *       authenticationType: number,  // 0=None, 1=Biometric, 2=Face, 3=Pattern, 4=SSKB, 9=DeviceLDA
   *       isAuthenticationEnabled: boolean,
   *       isDualAuthEnabled: boolean
   *     }
   *   ]
   * }
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Parse authenticationCapabilities array from response
   * 3. No async events - all data returned in sync callback
   *
   * @returns {Promise<Object>} Promise that resolves with authentication details
   */
  async getDeviceAuthenticationDetails() {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Getting device authentication details');

      com.uniken.rdnaplugin.RdnaClient.getDeviceAuthenticationDetails(
        (response) => {
          console.log('RdnaService - GetDeviceAuthenticationDetails sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - getDeviceAuthenticationDetails whole sync response:', result);
          console.log('RdnaService - getDeviceAuthenticationDetails sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString,
            capabilitiesCount: result.authenticationCapabilities?.length || 0
          }, null, 2));

          // Always resolve with result (let caller check error.longErrorCode)
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - getDeviceAuthenticationDetails error callback:', error);
          const result = JSON.parse(error);
          console.error('RdnaService - getDeviceAuthenticationDetails sync error:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          reject(result);
        },
        [] // No parameters
      );
    });
  }

  /**
   * Manages device authentication modes (LDA Toggling)
   *
   * Enables or disables a specific authentication mode.
   * This method has both sync callback AND async event (onDeviceAuthManagementStatus).
   * May also trigger getPassword (challengeMode 5, 14, 15) or getUserConsentForLDA (challengeMode 16).
   *
   * @see https://developer.uniken.com/docs/lda-toggling
   *
   * Workflow:
   * 1. User toggles authentication switch
   * 2. Screen calls manageDeviceAuthenticationModes(isEnabled, authType)
   * 3. SDK may trigger password verification or LDA consent challenge
   * 4. After challenge completion, SDK triggers onDeviceAuthManagementStatus event
   * 5. Event contains success/failure status
   *
   * Challenge Modes Triggered:
   * - Disabling LDA → getPassword with challengeMode 5, 14, or 15 (password verification)
   * - Enabling LDA → getUserConsentForLDA with challengeMode 16 (biometric consent)
   *
   * Response Structure (Sync):
   * {
   *   error: { longErrorCode, shortErrorCode, errorString }
   * }
   *
   * Event Structure (Async - onDeviceAuthManagementStatus):
   * {
   *   authMode: number,
   *   statusCode: number,
   *   statusMessage: string,
   *   error: { longErrorCode, shortErrorCode, errorString }
   * }
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Wait for onDeviceAuthManagementStatus event for final result
   * 3. Handle intermediate getPassword or getUserConsentForLDA events
   *
   * @param {boolean} isEnabled - True to enable, false to disable
   * @param {number} authType - Authentication type number (1=Biometric, 2=Face, etc.)
   * @returns {Promise<Object>} Promise that resolves with sync response
   */
  async manageDeviceAuthenticationModes(isEnabled, authType) {
    return new Promise((resolve, reject) => {
      console.log('RdnaService - Managing device authentication modes:', JSON.stringify({
        isEnabled,
        authType
      }, null, 2));

      com.uniken.rdnaplugin.RdnaClient.manageDeviceAuthenticationModes(
        (response) => {
          console.log('RdnaService - ManageDeviceAuthenticationModes sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaService - manageDeviceAuthenticationModes sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));

          // Always resolve with result (let caller check error.longErrorCode)
          // Async event (onDeviceAuthManagementStatus) will follow
          console.log('RdnaService - ManageDeviceAuthenticationModes sync response, waiting for onDeviceAuthManagementStatus event');
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - manageDeviceAuthenticationModes error callback:', error);
          const result = JSON.parse(error);
          console.error('RdnaService - manageDeviceAuthenticationModes sync error:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          reject(result);
        },
        [isEnabled, authType] // [IS_ENABLED, AUTH_TYPE]
      );
    });
  }
}

// Export singleton instance
const rdnaService = RdnaService.getInstance();
