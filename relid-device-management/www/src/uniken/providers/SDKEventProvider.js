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
   * Available credentials for update (e.g., ["Password", "SecurityQuestions"])
   * Populated after successful login via getAllChallenges() API
   */
  _availableCredentials: [],

  /**
   * Current session parameters (stored after login for use across screens)
   */
  _sessionParams: null,

  /**
   * Get available credentials for update
   * @returns {string[]} Array of available credential types
   */
  getAvailableCredentials() {
    return this._availableCredentials;
  },

  /**
   * Store session parameters for use across screens
   * @param {Object} params - Session parameters (userID, sessionID, jwtToken, etc.)
   */
  setSessionParams(params) {
    this._sessionParams = params;
    console.log('SDKEventProvider - Session params stored');
  },

  /**
   * Get stored session parameters
   * @returns {Object} Session parameters or empty object
   */
  getSessionParams() {
    return this._sessionParams || {};
  },

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

    // Set up MFA event handlers
    eventManager.setGetUserHandler(this.handleGetUser.bind(this));
    eventManager.setGetActivationCodeHandler(this.handleGetActivationCode.bind(this));
    eventManager.setGetUserConsentForLDAHandler(this.handleGetUserConsentForLDA.bind(this));
    eventManager.setGetPasswordHandler(this.handleGetPassword.bind(this));
    eventManager.setOnUserLoggedInHandler(this.handleUserLoggedIn.bind(this));
    eventManager.setOnUserLoggedOffHandler(this.handleUserLoggedOff.bind(this));

    // Set up Device Activation event handler
    eventManager.setAddNewDeviceOptionsHandler(this.handleAddNewDeviceOptions.bind(this));

    // Set up Password Update event handlers
    eventManager.setCredentialsAvailableForUpdateHandler(this.handleCredentialsAvailableForUpdate.bind(this));

    this._initialized = true;
    console.log('SDKEventProvider - Global event handlers registered (including MFA, Device Activation, and Password Update)');
  },

  /**
   * Handle successful initialization event
   * This is a global handler that navigates to success screen
   * @param {Object} data - Initialized data from SDK
   */
  handleInitialized(data) {
    console.log('SDKEventProvider - Successfully initialized, Session ID:', data.session.sessionID);
    // In MFA flow, after onInitialized, SDK automatically triggers getUser, getActivationCode, or getPassword
    // So no explicit navigation needed here - let the MFA events handle navigation
    console.log('SDKEventProvider - Waiting for SDK to trigger MFA events (getUser, getActivationCode, or getPassword)');
  },

  /**
   * Handle get user event for MFA authentication
   * @param {Object} data - Get user data from SDK
   */
  handleGetUser(data) {
    console.log('SDKEventProvider - Get user event received, status:', data.challengeResponse.status.statusCode);

    // Navigate to CheckUser (NavigationService will append 'Screen')
    NavigationService.navigate('CheckUser', {
      eventData: data,
      responseData: data,
      title: 'Enter Username',
      subtitle: 'Enter your username to continue',
      placeholder: 'Username',
      buttonText: 'Continue'
    });
  },

  /**
   * Handle get activation code event for MFA authentication
   * @param {Object} data - Get activation code data from SDK
   */
  handleGetActivationCode(data) {
    console.log('SDKEventProvider - Get activation code event received, userID:', data.userID);

    // Navigate to ActivationCode (NavigationService will append 'Screen')
    NavigationService.navigate('ActivationCode', {
      eventData: data,
      responseData: data,
      title: 'Enter Activation Code',
      subtitle: `Enter the activation code for user: ${data.userID}`,
      placeholder: 'Activation Code',
      buttonText: 'Verify',
      attemptsLeft: data.attemptsLeft
    });
  },

  /**
   * Handle get user consent for LDA event
   * @param {Object} data - Get user consent for LDA data from SDK
   */
  handleGetUserConsentForLDA(data) {
    console.log('SDKEventProvider - Get user consent for LDA event received, userID:', data.userID, 'challengeMode:', data.challengeMode);

    if (data.challengeMode === 16) {
      // challengeMode = 16: LDA consent for LDA toggling (enabling LDA)
      console.log('SDKEventProvider - LDA toggling consent required, showing dialog');

      // Show unified LDA toggle auth dialog
      if (typeof LDAToggleAuthDialog !== 'undefined') {
        LDAToggleAuthDialog.show(data);
      } else {
        console.error('SDKEventProvider - LDAToggleAuthDialog not found');
      }
    } else {
      // Normal LDA consent flow (initial login)
      // Navigate to UserLDAConsent (NavigationService will append 'Screen')
      NavigationService.navigate('UserLDAConsent', {
        eventData: data,
        responseData: data,
        title: 'Local Device Authentication',
        subtitle: `Grant permission for biometric authentication`,
        userID: data.userID,
        challengeMode: data.challengeMode,
        authenticationType: data.authenticationType
      });
    }
  },

  /**
   * Handle get password event for MFA authentication
   * @param {Object} data - Get password data from SDK
   */
  handleGetPassword(data) {
    console.log('SDKEventProvider - Get password event received, challengeMode:', data.challengeMode);

    if (data.challengeMode === 0) {
      // challengeMode = 0: Verify existing password
      NavigationService.navigate('VerifyPassword', {
        eventData: data,
        responseData: data,
        title: 'Verify Password',
        subtitle: 'Enter your password to continue',
        userID: data.userID,
        challengeMode: data.challengeMode,
        attemptsLeft: data.attemptsLeft
      });
    } else if (data.challengeMode === 1) {
      // challengeMode = 1: Set new password
      NavigationService.navigate('SetPassword', {
        eventData: data,
        responseData: data,
        title: 'Set Password',
        subtitle: `Create a secure password for user: ${data.userID}`,
        userID: data.userID,
        challengeMode: data.challengeMode,
        attemptsLeft: data.attemptsLeft
      });
    } else if (data.challengeMode === 2) {
      // challengeMode = 2: Update password (RDNA_OP_UPDATE_CREDENTIALS)
      console.log('SDKEventProvider - User-initiated password update, navigating to UpdatePassword screen');
      NavigationService.navigate('UpdatePassword', {
        ...this.getSessionParams(), // Include session params for navigation back to Dashboard
        eventData: data,
        responseData: data,
        title: 'Update Password',
        subtitle: 'Update your account password',
        userID: data.userID,
        challengeMode: data.challengeMode,
        attemptsLeft: data.attemptsLeft
      });
    } else if (data.challengeMode === 3) {
      // challengeMode = 3: Step-up authentication for notification actions (RDNA_OP_AUTHORIZE_NOTIFICATION)
      // Delegate to StepUpAuthManager for modular handling
      console.log('SDKEventProvider - Step-up authentication required, delegating to StepUpAuthManager');

      if (typeof StepUpAuthManager !== 'undefined') {
        StepUpAuthManager.showPasswordDialog(data);
      } else {
        console.error('SDKEventProvider - StepUpAuthManager not found');
      }
    } else if (data.challengeMode === 4) {
      // challengeMode = 4: Update expired password (RDNA_OP_UPDATE_ON_EXPIRY)
      // Extract status message from response (e.g., "Password has expired. Please contact the admin.")
      const statusMessage = data.challengeResponse?.status?.statusMessage || 'Your password has expired. Please update it to continue.';

      console.log('SDKEventProvider - Password expired, navigating to UpdateExpiryPassword screen');
      NavigationService.navigate('UpdateExpiryPassword', {
        eventData: data,
        responseData: data,
        title: 'Update Expired Password',
        subtitle: statusMessage,
        userID: data.userID,
        challengeMode: data.challengeMode,
        attemptsLeft: data.attemptsLeft
      });
    } else if (data.challengeMode === 5 || data.challengeMode === 14 || data.challengeMode === 15) {
      // challengeMode = 5, 14, 15: Password verification for LDA toggling (disabling LDA)
      console.log('SDKEventProvider - LDA toggling password verification required, showing dialog');

      // Show unified LDA toggle auth dialog
      if (typeof LDAToggleAuthDialog !== 'undefined') {
        // Check if dialog already visible with same challengeMode (re-trigger scenario)
        if (LDAToggleAuthDialog.visible && LDAToggleAuthDialog.challengeMode === data.challengeMode) {
          // SDK re-triggered getPassword - process errors (same pattern as SetPasswordScreen)
          const errorResult = LDAToggleAuthDialog.processResponseData(data);

          // Update existing dialog with error message from SDK response
          LDAToggleAuthDialog.update({
            attemptsLeft: data.attemptsLeft,
            errorMessage: errorResult.hasError ? errorResult.errorMessage : 'Incorrect password. Please try again.'
          });
        } else {
          // Show new dialog
          LDAToggleAuthDialog.show(data);
        }
      } else {
        console.error('SDKEventProvider - LDAToggleAuthDialog not found');
      }
    } else if (data.challengeMode === 12) {
      // challengeMode = 12: Data signing password verification (RDNA_OP_DATA_SIGNING)
      console.log('SDKEventProvider - Data signing password verification required, delegating to DataSigningSetupAuthManager');

      // Route to DataSigningSetupAuthManager if context is active
      if (typeof DataSigningSetupAuthManager !== 'undefined' && DataSigningSetupAuthManager.isActive()) {
        DataSigningSetupAuthManager.showPasswordDialog(data);
      } else {
        console.error('SDKEventProvider - DataSigningSetupAuthManager not active or not found');
      }
    } else {
      console.warn('SDKEventProvider - Unknown challengeMode:', data.challengeMode);
    }
  },

  /**
   * Handle user logged in event (successful authentication)
   * @param {Object} data - User logged in data from SDK
   */
  async handleUserLoggedIn(data) {
    console.log('SDKEventProvider - User logged in event received for user:', data.userID);
    console.log('SDKEventProvider - Session ID:', data.challengeResponse.session.sessionID);

    // Extract session and JWT information
    const sessionID = data.challengeResponse.session.sessionID;
    const sessionType = data.challengeResponse.session.sessionType;
    const additionalInfo = data.challengeResponse.additionalInfo;
    const jwtToken = additionalInfo.jwtJsonTokenInfo;

    // Navigate to Dashboard (NavigationService will append 'Screen')
    NavigationService.navigate('Dashboard', {
      userID: data.userID,
      sessionID: sessionID,
      sessionType: sessionType,
      jwtToken: jwtToken,
      loginTime: new Date().toLocaleString()
    });

    // After successful login, call getAllChallenges to check available credential updates
    try {
      console.log('SDKEventProvider - Calling getAllChallenges after login for user:', data.userID);
      await rdnaService.getAllChallenges(data.userID);
      console.log('SDKEventProvider - getAllChallenges called successfully, waiting for onCredentialsAvailableForUpdate event');
    } catch (error) {
      console.error('SDKEventProvider - getAllChallenges failed:', error);
    }
  },

  /**
   * Handle user logged off event
   * @param {Object} data - User logged off data from SDK
   */
  handleUserLoggedOff(data) {
    console.log('SDKEventProvider - User logged off event received for user:', data.userID);
    console.log('SDKEventProvider - Session ID:', data.challengeResponse.session.sessionID);

    // Log the event - getUser will be triggered automatically by SDK
    console.log('SDKEventProvider - User logged off, waiting for SDK to trigger getUser event');
  },

  /**
   * Handle add new device options event for device activation
   * This event is triggered when an unregistered device attempts authentication.
   * Automatically navigates to VerifyAuthScreen for REL-ID Verify activation.
   *
   * @param {Object} data - Device options data from SDK
   */
  handleAddNewDeviceOptions(data) {
    console.log('SDKEventProvider - Add new device options event received');
    console.log('SDKEventProvider - Device activation required, options count:', data.options?.length);

    // Automatically navigate to VerifyAuth screen for device activation
    NavigationService.navigate('VerifyAuth', {
      eventData: data,
      responseData: data,
      deviceOptions: data.options || [],
      challengeMode: data.challengeMode,
      title: 'Device Activation',
      subtitle: 'Verify this device to continue'
    });
  },

  /**
   * Handle credentials available for update event
   * This event is triggered after calling getAllChallenges() API.
   * Stores the available credentials in state for drawer menu to access.
   *
   * @param {Object} data - Credentials available for update data from SDK
   */
  handleCredentialsAvailableForUpdate(data) {
    console.log('SDKEventProvider - Credentials available for update event received for user:', data.userID);
    console.log('SDKEventProvider - Available options:', JSON.stringify(data.options, null, 2));

    // Store available credentials for drawer menu to use
    this._availableCredentials = data.options || [];

    // Trigger drawer menu update if updateDrawerMenu function exists
    if (typeof updateDrawerMenu === 'function') {
      updateDrawerMenu();
    }
  },

  /**
   * Cleanup event handlers
   */
  cleanup() {
    console.log('SDKEventProvider - Cleaning up');
    const eventManager = rdnaService.getEventManager();
    eventManager.cleanup();
    this._availableCredentials = [];

    // Clear step-up context via manager
    if (typeof StepUpAuthManager !== 'undefined') {
      StepUpAuthManager.clearContext();
    }
  }
};
