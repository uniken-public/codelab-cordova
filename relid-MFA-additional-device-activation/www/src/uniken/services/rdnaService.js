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
}

// Export singleton instance
const rdnaService = RdnaService.getInstance();
