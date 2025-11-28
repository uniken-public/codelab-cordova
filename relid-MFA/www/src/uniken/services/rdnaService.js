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

          // Success callback - always errorCode 0
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
}

// Export singleton instance
const rdnaService = RdnaService.getInstance();
