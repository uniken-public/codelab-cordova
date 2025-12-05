/**
 * REL-ID SDK Event Manager
 *
 * Manages all REL-ID SDK events in a centralized, type-safe manner.
 * Provides a singleton pattern for consistent event handling across the application.
 *
 * Supported Events:
 * - onInitializeProgress: SDK initialization progress updates
 * - onInitializeError: SDK initialization error handling
 * - onInitialized: Successful SDK initialization with session data
 * - onUserConsentThreats: Non-terminating threats requiring user consent (MTD)
 * - onTerminateWithThreats: Critical threats requiring app termination (MTD)
 * - onSdkLogPrintRequest: SDK log print requests for debugging
 *
 * Key Features:
 * - Singleton pattern for global event management
 * - Type-safe callback handling with JSDoc
 * - Automatic event listener registration and cleanup
 * - Single event handler per type for simplicity
 * - Comprehensive error handling and logging
 *
 * @typedef {Object} RDNAJsonResponse
 * @property {string} response - JSON string containing event data
 *
 * @typedef {Object} RDNAProgressData
 * @property {string} systemThreatCheckStatus
 * @property {string} appThreatCheckStatus
 * @property {string} networkThreatCheckStatus
 * @property {string} initializeStatus
 *
 * @typedef {Object} RDNAInitializeErrorData
 * @property {number} longErrorCode
 * @property {number} shortErrorCode
 * @property {string} errorString
 *
 * @typedef {Object} RDNAInitializedData
 * @property {Object} status
 * @property {number} status.statusCode
 * @property {string} status.statusMessage
 * @property {Object} session
 * @property {number} session.sessionType
 * @property {string} session.sessionID
 * @property {Object} additionalInfo
 * @property {Array} challengeInfo
 *
 * @typedef {Object} RDNAThreatInfo
 * @property {string} threatName
 * @property {string} threatMsg
 * @property {string|number} threatId
 * @property {string} threatCategory - "SYSTEM", "APPLICATION", "NETWORK"
 * @property {string} threatSeverity - "HIGH", "MEDIUM", "LOW"
 * @property {string|string[]} threatReason
 * @property {boolean|number} shouldProceedWithThreats - Set by app before takeActionOnThreats
 * @property {boolean|number} rememberActionForSession - Set by app before takeActionOnThreats
 * @property {Object} appInfo
 * @property {Object} networkInfo
 *
 * @typedef {Object} RDNAUserConsentThreatsData
 * @property {RDNAThreatInfo[]} threats
 *
 * @typedef {Object} RDNATerminateWithThreatsData
 * @property {RDNAThreatInfo[]} threats
 *
 * @callback RDNAInitializeProgressCallback
 * @param {RDNAProgressData} data
 *
 * @callback RDNAInitializeErrorCallback
 * @param {RDNAInitializeErrorData} data
 *
 * @callback RDNAInitializeSuccessCallback
 * @param {RDNAInitializedData} data
 *
 * @callback RDNAUserConsentThreatsCallback
 * @param {RDNAUserConsentThreatsData} data
 *
 * @callback RDNATerminateWithThreatsCallback
 * @param {RDNATerminateWithThreatsData} data
 */

class RdnaEventManager {
  constructor() {
    if (RdnaEventManager.instance) {
      return RdnaEventManager.instance;
    }

    this._initialized = false;
    this.listeners = [];

    // Composite event handlers (can handle multiple concerns)
    this.initializeProgressHandler = null;
    this.initializeErrorHandler = null;
    this.initializedHandler = null;
    this.sdkLogPrintRequestHandler = null;

    // MTD event handlers
    this.userConsentThreatsHandler = null;
    this.terminateWithThreatsHandler = null;

    // MFA event handlers
    this.getUserHandler = null;
    this.getActivationCodeHandler = null;
    this.getUserConsentForLDAHandler = null;
    this.getPasswordHandler = null;
    this.onUserLoggedInHandler = null;
    this.onUserLoggedOffHandler = null;

    // Session Management event handlers
    this.sessionTimeoutHandler = null;
    this.sessionTimeoutNotificationHandler = null;
    this.sessionExtensionResponseHandler = null;

    // Device Activation event handlers
    this.addNewDeviceOptionsHandler = null;

    // Notification Management event handlers
    this.getNotificationsHandler = null;
    this.updateNotificationHandler = null;

    // Password Update event handlers
    this.credentialsAvailableForUpdateHandler = null;
    this.updateCredentialResponseHandler = null;

    // LDA Toggling event handlers
    this.deviceAuthManagementStatusHandler = null;

    // Data Signing event handlers
    this.dataSigningResponseHandler = null;

    RdnaEventManager.instance = this;
  }

  /**
   * Gets the singleton instance
   * @returns {RdnaEventManager}
   */
  static getInstance() {
    if (!RdnaEventManager.instance) {
      RdnaEventManager.instance = new RdnaEventManager();
    }
    return RdnaEventManager.instance;
  }

  /**
   * Initializes event listeners (idempotent - safe to call multiple times)
   * In SPA architecture, this is called ONCE in AppInitializer
   */
  initialize() {
    if (this._initialized) {
      console.log('RdnaEventManager - Already initialized, skipping');
      return;
    }

    console.log('RdnaEventManager - Initializing event listeners');
    this.registerEventListeners();
    this._initialized = true;
  }

  /**
   * Registers native event listeners for all SDK events
   * @private
   */
  registerEventListeners() {
    console.log('RdnaEventManager - Registering native event listeners');

    // Register event listeners using document.addEventListener
    const progressListener = this.onInitializeProgress.bind(this);
    const errorListener = this.onInitializeError.bind(this);
    const initializedListener = this.onInitialized.bind(this);
    const logPrintListener = this.onSdkLogPrintRequest.bind(this);
    const userConsentThreatsListener = this.onUserConsentThreats.bind(this);
    const terminateWithThreatsListener = this.onTerminateWithThreats.bind(this);

    // MFA event listeners
    const getUserListener = this.onGetUser.bind(this);
    const getActivationCodeListener = this.onGetActivationCode.bind(this);
    const getUserConsentForLDAListener = this.onGetUserConsentForLDA.bind(this);
    const getPasswordListener = this.onGetPassword.bind(this);
    const onUserLoggedInListener = this.onUserLoggedIn.bind(this);
    const onUserLoggedOffListener = this.onUserLoggedOff.bind(this);

    // Session Management event listeners
    const sessionTimeoutListener = this.onSessionTimeout.bind(this);
    const sessionTimeoutNotificationListener = this.onSessionTimeoutNotification.bind(this);
    const sessionExtensionResponseListener = this.onSessionExtensionResponse.bind(this);

    // Device Activation event listeners
    const addNewDeviceOptionsListener = this.onAddNewDeviceOptions.bind(this);

    // Notification Management event listeners
    const getNotificationsListener = this.onGetNotifications.bind(this);
    const updateNotificationListener = this.onUpdateNotification.bind(this);
    const getNotificationHistoryListener = this.onGetNotificationHistory.bind(this);

    // Password Update event listeners
    const credentialsAvailableForUpdateListener = this.onCredentialsAvailableForUpdate.bind(this);
    const updateCredentialResponseListener = this.onUpdateCredentialResponse.bind(this);

    // LDA Toggling event listeners
    const deviceAuthManagementStatusListener = this.onDeviceAuthManagementStatus.bind(this);

    // Data Signing event listeners
    const dataSigningResponseListener = this.onAuthenticateUserAndSignData.bind(this);

    document.addEventListener('onInitializeProgress', progressListener, false);
    document.addEventListener('onInitializeError', errorListener, false);
    document.addEventListener('onInitialized', initializedListener, false);
    document.addEventListener('onSdkLogPrintRequest', logPrintListener, false);
    document.addEventListener('onUserConsentThreats', userConsentThreatsListener, false);
    document.addEventListener('onTerminateWithThreats', terminateWithThreatsListener, false);

    // MFA event registrations
    document.addEventListener('getUser', getUserListener, false);
    document.addEventListener('getActivationCode', getActivationCodeListener, false);
    document.addEventListener('getUserConsentForLDA', getUserConsentForLDAListener, false);
    document.addEventListener('getPassword', getPasswordListener, false);
    document.addEventListener('onUserLoggedIn', onUserLoggedInListener, false);
    document.addEventListener('onUserLoggedOff', onUserLoggedOffListener, false);

    // Session Management event registrations
    document.addEventListener('onSessionTimeout', sessionTimeoutListener, false);
    document.addEventListener('onSessionTimeOutNotification', sessionTimeoutNotificationListener, false);
    document.addEventListener('onSessionExtensionResponse', sessionExtensionResponseListener, false);

    // Device Activation event registrations
    document.addEventListener('addNewDeviceOptions', addNewDeviceOptionsListener, false);

    // Notification Management event registrations
    document.addEventListener('onGetNotifications', getNotificationsListener, false);
    document.addEventListener('onUpdateNotification', updateNotificationListener, false);
    document.addEventListener('onGetNotificationsHistory', getNotificationHistoryListener, false);

    // Password Update event registrations
    document.addEventListener('onCredentialsAvailableForUpdate', credentialsAvailableForUpdateListener, false);
    document.addEventListener('onUpdateCredentialResponse', updateCredentialResponseListener, false);

    // LDA Toggling event registrations
    document.addEventListener('onDeviceAuthManagementStatus', deviceAuthManagementStatusListener, false);

    // Data Signing event registrations
    document.addEventListener('onAuthenticateUserAndSignData', dataSigningResponseListener, false);

    // Store listeners for cleanup
    this.listeners.push(
      { name: 'onInitializeProgress', handler: progressListener },
      { name: 'onInitializeError', handler: errorListener },
      { name: 'onInitialized', handler: initializedListener },
      { name: 'onSdkLogPrintRequest', handler: logPrintListener },
      { name: 'onUserConsentThreats', handler: userConsentThreatsListener },
      { name: 'onTerminateWithThreats', handler: terminateWithThreatsListener },
      { name: 'getUser', handler: getUserListener },
      { name: 'getActivationCode', handler: getActivationCodeListener },
      { name: 'getUserConsentForLDA', handler: getUserConsentForLDAListener },
      { name: 'getPassword', handler: getPasswordListener },
      { name: 'onUserLoggedIn', handler: onUserLoggedInListener },
      { name: 'onUserLoggedOff', handler: onUserLoggedOffListener },
      { name: 'onSessionTimeout', handler: sessionTimeoutListener },
      { name: 'onSessionTimeOutNotification', handler: sessionTimeoutNotificationListener },
      { name: 'onSessionExtensionResponse', handler: sessionExtensionResponseListener },
      { name: 'addNewDeviceOptions', handler: addNewDeviceOptionsListener },
      { name: 'onGetNotifications', handler: getNotificationsListener },
      { name: 'onUpdateNotification', handler: updateNotificationListener },
      { name: 'onGetNotificationsHistory', handler: getNotificationHistoryListener },
      { name: 'onCredentialsAvailableForUpdate', handler: credentialsAvailableForUpdateListener },
      { name: 'onUpdateCredentialResponse', handler: updateCredentialResponseListener },
      { name: 'onDeviceAuthManagementStatus', handler: deviceAuthManagementStatusListener },
      { name: 'onAuthenticateUserAndSignData', handler: dataSigningResponseListener }
    );

    console.log('RdnaEventManager - Native event listeners registered (including MTD, MFA, Session, Device Activation, Notifications, Password Update, LDA Toggling, and Data Signing)');
  }

  /**
   * Handles SDK initialization progress events
   * @param {RDNAJsonResponse} event - Event from native SDK
   */
  onInitializeProgress(event) {
    console.log("RdnaEventManager - Initialize progress event received");

    try {
      // Parse JSON response from event
      const progressData = JSON.parse(event.response);
      console.log("RdnaEventManager - Progress:", progressData.initializeStatus);

      if (this.initializeProgressHandler) {
        this.initializeProgressHandler(progressData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse initialize progress:", error);
    }
  }

  /**
   * Handles SDK initialization error events
   * @param {RDNAJsonResponse} event - Event from native SDK containing error details
   */
  onInitializeError(event) {
    console.log("RdnaEventManager - Initialize error event received");

    try {
      const errorData = JSON.parse(event.response);
      console.error("RdnaEventManager - Initialize error:", errorData.errorString);

      if (this.initializeErrorHandler) {
        this.initializeErrorHandler(errorData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse initialize error:", error);
    }
  }

  /**
   * Handles SDK initialization success events
   * @param {RDNAJsonResponse} event - Event from native SDK containing session data
   */
  onInitialized(event) {
    console.log("RdnaEventManager - Initialize success event received");

    try {
      const initializedData = JSON.parse(event.response);
      console.log("RdnaEventManager - Successfully initialized, Session ID:", initializedData.session.sessionID);

      if (this.initializedHandler) {
        this.initializedHandler(initializedData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse initialize success:", error);
    }
  }

  /**
   * Handles SDK log print request events
   * @param {RDNAJsonResponse} event - Event from native SDK containing log data
   */
  onSdkLogPrintRequest(event) {
    console.log("RdnaEventManager - SDK log print request received");

    //Only the onSdkLogPrintRequest event does not need to parse the response
    const logData = event.response
    console.log("SDK Log:", logData);

    if (this.sdkLogPrintRequestHandler) {
        this.sdkLogPrintRequestHandler(logData);
    }
  }

  /**
   * Handles user consent threats events (MTD)
   * Non-terminating threats that require user action (proceed or exit)
   * @param {RDNAJsonResponse} event - Event from native SDK containing threat data
   */
  onUserConsentThreats(event) {
    console.log("RdnaEventManager - User consent threats event received");

    try {
      const threatsData = JSON.parse(event.response);

      // Determine threats count (data could be array or object with threats property)
      const threatCount = Array.isArray(threatsData)
        ? threatsData.length
        : (threatsData.threats?.length || 0);

      console.log("RdnaEventManager - User consent threats count:", threatCount);

      if (this.userConsentThreatsHandler) {
        this.userConsentThreatsHandler(threatsData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse user consent threats:", error);
      console.error("RdnaEventManager - Raw event data:", event.response);
    }
  }

  /**
   * Handles terminate with threats events (MTD)
   * Critical threats that require app termination
   * @param {RDNAJsonResponse} event - Event from native SDK containing threat data
   */
  onTerminateWithThreats(event) {
    console.log("RdnaEventManager - Terminate with threats event received");

    try {
      const threatsData = JSON.parse(event.response);

      // Determine threats count (data could be array or object with threats property)
      const threatCount = Array.isArray(threatsData)
        ? threatsData.length
        : (threatsData.threats?.length || 0);

      console.log("RdnaEventManager - Terminate threats count:", threatCount);

      if (this.terminateWithThreatsHandler) {
        this.terminateWithThreatsHandler(threatsData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse terminate with threats:", error);
      console.error("RdnaEventManager - Raw event data:", event.response);
    }
  }

  /**
   * Handles user input request events for MFA authentication
   * @param {RDNAJsonResponse} event - Event from native SDK containing user data
   */
  onGetUser(event) {
    console.log("RdnaEventManager - Get user event received");

    try {
      const getUserData = JSON.parse(event.response);
      console.log("RdnaEventManager - Get user status:", getUserData.challengeResponse?.status?.statusCode);

      if (this.getUserHandler) {
        this.getUserHandler(getUserData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse get user:", error);
    }
  }

  /**
   * Handles activation code request events for MFA authentication
   * @param {RDNAJsonResponse} event - Event from native SDK containing activation code data
   */
  onGetActivationCode(event) {
    console.log("RdnaEventManager - Get activation code event received");

    try {
      const getActivationCodeData = JSON.parse(event.response);
      console.log("RdnaEventManager - Get activation code status:", getActivationCodeData.challengeResponse?.status?.statusCode);
      console.log("RdnaEventManager - UserID:", getActivationCodeData.userID, "AttemptsLeft:", getActivationCodeData.attemptsLeft);

      if (this.getActivationCodeHandler) {
        this.getActivationCodeHandler(getActivationCodeData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse get activation code:", error);
    }
  }

  /**
   * Handles user consent for LDA request events
   * @param {RDNAJsonResponse} event - Event from native SDK containing user consent for LDA data
   */
  onGetUserConsentForLDA(event) {
    console.log("RdnaEventManager - Get user consent for LDA event received");

    try {
      const getUserConsentForLDAData = JSON.parse(event.response);
      console.log("RdnaEventManager - Get user consent for LDA status:", getUserConsentForLDAData.challengeResponse?.status?.statusCode);
      console.log("RdnaEventManager - UserID:", getUserConsentForLDAData.userID, "ChallengeMode:", getUserConsentForLDAData.challengeMode, "AuthenticationType:", getUserConsentForLDAData.authenticationType);

      if (this.getUserConsentForLDAHandler) {
        this.getUserConsentForLDAHandler(getUserConsentForLDAData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse get user consent for LDA:", error);
    }
  }

  /**
   * Handles password request events for MFA authentication
   * @param {RDNAJsonResponse} event - Event from native SDK containing password data
   */
  onGetPassword(event) {
    console.log("RdnaEventManager - Get password event received");

    try {
      const getPasswordData = JSON.parse(event.response);
      console.log("RdnaEventManager - Get password status:", getPasswordData.challengeResponse?.status?.statusCode);
      console.log("RdnaEventManager - UserID:", getPasswordData.userID, "ChallengeMode:", getPasswordData.challengeMode, "AttemptsLeft:", getPasswordData.attemptsLeft);

      if (this.getPasswordHandler) {
        this.getPasswordHandler(getPasswordData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse get password:", error);
    }
  }

  /**
   * Handles user logged in events indicating successful authentication
   * @param {RDNAJsonResponse} event - Event from native SDK containing user login data
   */
  onUserLoggedIn(event) {
    console.log("RdnaEventManager - User logged in event received");

    try {
      const userLoggedInData = JSON.parse(event.response);
      console.log("RdnaEventManager - User logged in:", userLoggedInData.userID);
      console.log("RdnaEventManager - Session ID:", userLoggedInData.challengeResponse?.session?.sessionID);

      if (this.onUserLoggedInHandler) {
        this.onUserLoggedInHandler(userLoggedInData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse user logged in:", error);
    }
  }

  /**
   * Handles user logged off events indicating successful logout
   * @param {RDNAJsonResponse} event - Event from native SDK containing user logout data
   */
  onUserLoggedOff(event) {
    console.log("RdnaEventManager - User logged off event received");

    try {
      const userLoggedOffData = JSON.parse(event.response);
      console.log("RdnaEventManager - User logged off:", userLoggedOffData.userID);
      console.log("RdnaEventManager - Session ID:", userLoggedOffData.challengeResponse?.session?.sessionID);

      if (this.onUserLoggedOffHandler) {
        this.onUserLoggedOffHandler(userLoggedOffData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse user logged off:", error);
    }
  }

  /**
   * Handles session timeout events (hard timeout - mandatory)
   * This event is triggered when the session has expired and must be terminated.
   * The user must acknowledge the timeout and will be redirected to home screen.
   *
   * NOTE: This event contains a plain string message in event.response, NOT JSON
   *
   * @param {Object} event - Event from native SDK containing session timeout message
   */
  onSessionTimeout(event) {
    console.log("RdnaEventManager - Session timeout event received (hard timeout)");

    try {
      // event.response contains plain string message, NOT JSON
      const message = event.response || 'Your session has timed out.';

      const sessionTimeoutData = {
        message: message,
        userID: null // userID not provided in this event
      };

      console.log("RdnaEventManager - Session timeout:", message);

      if (this.sessionTimeoutHandler) {
        this.sessionTimeoutHandler(sessionTimeoutData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to handle session timeout:", error);
    }
  }

  /**
   * Handles session timeout notification events (idle timeout warning)
   * This event is triggered when the session is approaching timeout and can be extended.
   * The user can choose to extend the session or let it expire.
   *
   * @param {RDNAJsonResponse} event - Event from native SDK containing session timeout notification data
   */
  onSessionTimeoutNotification(event) {
    console.log("RdnaEventManager - Session timeout notification event received (idle timeout warning)");

    try {
      const sessionTimeoutNotificationData = JSON.parse(event.response);
      console.log("RdnaEventManager - Session timeout notification:", JSON.stringify({
        userID: sessionTimeoutNotificationData.userID,
        timeLeftInSeconds: sessionTimeoutNotificationData.timeLeftInSeconds,
        sessionCanBeExtended: sessionTimeoutNotificationData.sessionCanBeExtended,
        message: sessionTimeoutNotificationData.message
      }, null, 2));

      if (this.sessionTimeoutNotificationHandler) {
        this.sessionTimeoutNotificationHandler(sessionTimeoutNotificationData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse session timeout notification:", error);
    }
  }

  /**
   * Handles session extension response events
   * This event is triggered after calling extendSessionIdleTimeout() API.
   * Contains the result of the session extension attempt (success or failure).
   *
   * @param {RDNAJsonResponse} event - Event from native SDK containing session extension response
   */
  onSessionExtensionResponse(event) {
    console.log("RdnaEventManager - Session extension response event received");

    try {
      const sessionExtensionResponseData = JSON.parse(event.response);
      console.log("RdnaEventManager - Session extension response:", JSON.stringify({
        statusCode: sessionExtensionResponseData.status?.statusCode,
        statusMessage: sessionExtensionResponseData.status?.statusMessage,
        errorCode: sessionExtensionResponseData.error?.longErrorCode,
        errorString: sessionExtensionResponseData.error?.errorString
      }, null, 2));

      if (this.sessionExtensionResponseHandler) {
        this.sessionExtensionResponseHandler(sessionExtensionResponseData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse session extension response:", error);
    }
  }

  /**
   * Handles add new device options events
   * This event is triggered when an unregistered device attempts authentication.
   * Contains device activation options for REL-ID Verify or fallback methods.
   *
   * @param {RDNAJsonResponse} event - Event from native SDK containing device options
   */
  onAddNewDeviceOptions(event) {
    console.log("RdnaEventManager - Add new device options event received");

    try {
      // Handle both string and object responses
      let deviceOptionsData;
      if (typeof event.response === 'string') {
        deviceOptionsData = JSON.parse(event.response);
      } else {
        deviceOptionsData = event.response;
      }

      console.log("RdnaEventManager - Device activation options:", JSON.stringify({
        optionsCount: deviceOptionsData.newDeviceOptions?.length || deviceOptionsData.options?.length,
        challengeMode: deviceOptionsData.challengeMode
      }, null, 2));

      if (this.addNewDeviceOptionsHandler) {
        this.addNewDeviceOptionsHandler(deviceOptionsData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse device options:", error);
    }
  }

  /**
   * Handles get notifications response events
   * This event is triggered after calling getNotifications() API.
   * Contains the list of pending notifications from the server.
   *
   * @param {RDNAJsonResponse} event - Event from native SDK containing notifications data
   */
  onGetNotifications(event) {
    console.log("RdnaEventManager - Get notifications response event received");

    try {
      // Handle both string and object responses
      let notificationsData;
      if (typeof event.response === 'string') {
        notificationsData = JSON.parse(event.response);
      } else {
        notificationsData = event.response;
      }

      console.log("RdnaEventManager - Notifications response:", JSON.stringify({
        statusCode: notificationsData.status?.statusCode,
        notificationsCount: notificationsData.notificationsList?.length,
        errorCode: notificationsData.error?.longErrorCode
      }, null, 2));

      if (this.getNotificationsHandler) {
        this.getNotificationsHandler(notificationsData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse notifications response:", error);
    }
  }

  /**
   * Handles update notification response events
   * This event is triggered after calling updateNotification() API.
   * Contains the result of the notification update operation.
   *
   * @param {RDNAJsonResponse} event - Event from native SDK containing update response
   */
  onUpdateNotification(event) {
    console.log("RdnaEventManager - Update notification response event received");

    try {
      // Handle both string and object responses
      let updateNotificationData;
      if (typeof event.response === 'string') {
        updateNotificationData = JSON.parse(event.response);
      } else {
        updateNotificationData = event.response;
      }

      console.log("RdnaEventManager - Update notification response:", JSON.stringify({
        statusCode: updateNotificationData.status?.statusCode,
        statusMessage: updateNotificationData.status?.statusMessage,
        errorCode: updateNotificationData.error?.longErrorCode,
        errorString: updateNotificationData.error?.errorString
      }, null, 2));

      if (this.updateNotificationHandler) {
        this.updateNotificationHandler(updateNotificationData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse update notification response:", error);
    }
  }

  /**
   * Handles get notification history response events
   * This event is triggered after calling getNotificationHistory() API.
   * Contains the list of historical notification records with their metadata.
   *
   * Note: The SDK fires 'onGetNotificationsHistory' event (plural "Notifications")
   *
   * @param {RDNAJsonResponse} event - Event from native SDK containing notification history data
   */
  onGetNotificationHistory(event) {
    console.log("RdnaEventManager - Get notification history response event received");

    try {
      // Handle both string and object responses
      let historyData;
      if (typeof event.response === 'string') {
        historyData = JSON.parse(event.response);
      } else {
        historyData = event.response;
      }

      console.log("RdnaEventManager - Notification history response:", JSON.stringify({
        statusCode: historyData.pArgs?.response?.StatusCode,
        historyCount: historyData.pArgs?.response?.ResponseData?.history?.length,
        errCode: historyData.errCode,
        errorString: historyData.error?.errorString
      }, null, 2));

      if (this.getNotificationHistoryHandler) {
        this.getNotificationHistoryHandler(historyData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse notification history response:", error);
    }
  }

  /**
   * Handles credentials available for update events
   * This event is triggered after calling getAllChallenges() API.
   * Contains an array of credential types that can be updated (e.g., ["Password", "SecurityQuestions"]).
   *
   * @param {RDNAJsonResponse} event - Event from native SDK containing credentials data
   */
  onCredentialsAvailableForUpdate(event) {
    console.log("RdnaEventManager - Credentials available for update event received");

    try {
      // Handle both string and object responses
      let credentialsData;
      if (typeof event.response === 'string') {
        credentialsData = JSON.parse(event.response);
      } else {
        credentialsData = event.response;
      }

      console.log("RdnaEventManager - Credentials available for update:", JSON.stringify({
        userID: credentialsData.userID,
        options: credentialsData.options,
        errorCode: credentialsData.error?.longErrorCode,
        errorString: credentialsData.error?.errorString
      }, null, 2));

      if (this.credentialsAvailableForUpdateHandler) {
        this.credentialsAvailableForUpdateHandler(credentialsData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse credentials available for update response:", error);
    }
  }

  /**
   * Handles update credential response events
   * This event is triggered after calling updatePassword() with challengeMode = 2.
   * Contains the result of the password update operation.
   *
   * IMPORTANT: When statusCode is 100, 110, or 153, the SDK automatically triggers
   * onUserLoggedOff → getUser event chain. These status codes are specific to
   * onUpdateCredentialResponse event:
   * - 100: Password updated successfully
   * - 110: Password has expired while updating password
   * - 153: Attempts exhausted
   *
   * @param {RDNAJsonResponse} event - Event from native SDK containing update response
   */
  onUpdateCredentialResponse(event) {
    console.log("RdnaEventManager - Update credential response event received");

    try {
      // Handle both string and object responses
      let updateCredentialData;
      if (typeof event.response === 'string') {
        updateCredentialData = JSON.parse(event.response);
      } else {
        updateCredentialData = event.response;
      }

      console.log("RdnaEventManager - Update credential response:", JSON.stringify({
        userID: updateCredentialData.userID,
        credType: updateCredentialData.credType,
        statusCode: updateCredentialData.status?.statusCode,
        statusMessage: updateCredentialData.status?.statusMessage,
        errorCode: updateCredentialData.error?.longErrorCode,
        errorString: updateCredentialData.error?.errorString
      }, null, 2));

      if (this.updateCredentialResponseHandler) {
        this.updateCredentialResponseHandler(updateCredentialData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse update credential response:", error);
    }
  }

  /**
   * Handles device authentication management status events (LDA Toggling)
   * This event is triggered after calling manageDeviceAuthenticationModes().
   * Contains the result of enabling/disabling authentication mode operation.
   *
   * Event is triggered AFTER user completes any required challenges:
   * - Password verification (challengeMode 5, 14, 15) for disabling LDA
   * - LDA consent (challengeMode 16) for enabling LDA
   *
   * @param {RDNAJsonResponse} event - Event from native SDK containing status data
   */
  onDeviceAuthManagementStatus(event) {
    console.log("RdnaEventManager - Device auth management status event received");

    try {
      // Handle both string and object responses
      let statusData;
      if (typeof event.response === 'string') {
        statusData = JSON.parse(event.response);
      } else {
        statusData = event.response;
      }

      console.log("RdnaEventManager - Device auth management status:", JSON.stringify({
        authMode: statusData.authMode,
        statusCode: statusData.statusCode,
        statusMessage: statusData.statusMessage,
        errorCode: statusData.error?.longErrorCode,
        errorString: statusData.error?.errorString
      }, null, 2));

      if (this.deviceAuthManagementStatusHandler) {
        this.deviceAuthManagementStatusHandler(statusData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse device auth management status response:", error);
    }
  }

  /**
   * Handles data signing response events
   * This event is triggered after calling authenticateUserAndSignData() and completing authentication.
   * Contains the cryptographic signature and metadata for the signed data.
   *
   * Event is triggered AFTER:
   * - User completes any required step-up authentication (password/biometric)
   * - SDK processes the data signing request
   * - Cryptographic signature is generated
   *
   * Response Structure:
   * {
   *   dataPayload: string,              // Original data payload
   *   dataPayloadLength: number,        // Length of data payload
   *   reason: string,                   // Signing reason
   *   payloadSignature: string,         // Cryptographic signature (long base64 string)
   *   dataSignatureID: string,          // Unique signature identifier
   *   authLevel: number,                // Authentication level used (0-4)
   *   authenticationType: number,       // Authenticator type used (0-3)
   *   status: {
   *     statusCode: number,             // 100 = success
   *     statusMessage: string           // Human-readable status
   *   },
   *   error: {
   *     longErrorCode: number,
   *     shortErrorCode: number,
   *     errorString: string
   *   }
   * }
   *
   * @param {RDNAJsonResponse} event - Event from native SDK containing signing response data
   */
  onAuthenticateUserAndSignData(event) {
    console.log("RdnaEventManager - Data signing response event received");

    try {
      // Handle both string and object responses
      let signingData;
      if (typeof event.response === 'string') {
        signingData = JSON.parse(event.response);
      } else {
        signingData = event.response;
      }

      console.log("RdnaEventManager - Data signing completed:", JSON.stringify({
        authLevel: signingData.authLevel,
        authenticationType: signingData.authenticationType,
        dataPayloadLength: signingData.dataPayloadLength,
        signatureLength: signingData.payloadSignature?.length || 0,
        dataSignatureID: signingData.dataSignatureID,
        statusCode: signingData.status?.statusCode,
        errorCode: signingData.error?.longErrorCode
      }, null, 2));

      if (this.dataSigningResponseHandler) {
        this.dataSigningResponseHandler(signingData);
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse data signing response:", error);
    }
  }

  /**
   * Sets event handlers for SDK events. Only one handler per event type.
   * @param {RDNAInitializeProgressCallback} callback
   */
  setInitializeProgressHandler(callback) {
    this.initializeProgressHandler = callback;
  }

  /**
   * Sets error handler for SDK initialization
   * @param {RDNAInitializeErrorCallback} callback
   */
  setInitializeErrorHandler(callback) {
    this.initializeErrorHandler = callback;
  }

  /**
   * Sets success handler for SDK initialization
   * @param {RDNAInitializeSuccessCallback} callback
   */
  setInitializedHandler(callback) {
    this.initializedHandler = callback;
  }

  /**
   * Sets handler for SDK log print requests
   * @param {Function} callback
   */
  setSdkLogPrintRequestHandler(callback) {
    this.sdkLogPrintRequestHandler = callback;
  }

  /**
   * Sets handler for user consent threats (MTD)
   * @param {RDNAUserConsentThreatsCallback} callback
   */
  setUserConsentThreatsHandler(callback) {
    this.userConsentThreatsHandler = callback;
  }

  /**
   * Sets handler for terminate with threats (MTD)
   * @param {RDNATerminateWithThreatsCallback} callback
   */
  setTerminateWithThreatsHandler(callback) {
    this.terminateWithThreatsHandler = callback;
  }

  /**
   * Sets handler for get user events (MFA)
   * @param {Function} callback
   */
  setGetUserHandler(callback) {
    this.getUserHandler = callback;
  }

  /**
   * Sets handler for get activation code events (MFA)
   * @param {Function} callback
   */
  setGetActivationCodeHandler(callback) {
    this.getActivationCodeHandler = callback;
  }

  /**
   * Sets handler for get user consent for LDA events (MFA)
   * @param {Function} callback
   */
  setGetUserConsentForLDAHandler(callback) {
    this.getUserConsentForLDAHandler = callback;
  }

  /**
   * Sets handler for get password events (MFA)
   * @param {Function} callback
   */
  setGetPasswordHandler(callback) {
    this.getPasswordHandler = callback;
  }

  /**
   * Sets handler for user logged in events (MFA)
   * @param {Function} callback
   */
  setOnUserLoggedInHandler(callback) {
    this.onUserLoggedInHandler = callback;
  }

  /**
   * Sets handler for user logged off events (MFA)
   * @param {Function} callback
   */
  setOnUserLoggedOffHandler(callback) {
    this.onUserLoggedOffHandler = callback;
  }

  /**
   * Sets handler for session timeout events (hard timeout - mandatory)
   * @param {Function} callback
   */
  setSessionTimeoutHandler(callback) {
    this.sessionTimeoutHandler = callback;
  }

  /**
   * Sets handler for session timeout notification events (idle timeout warning)
   * @param {Function} callback
   */
  setSessionTimeoutNotificationHandler(callback) {
    this.sessionTimeoutNotificationHandler = callback;
  }

  /**
   * Sets handler for session extension response events
   * @param {Function} callback
   */
  setSessionExtensionResponseHandler(callback) {
    this.sessionExtensionResponseHandler = callback;
  }

  /**
   * Sets handler for add new device options events (device activation)
   * @param {Function} callback
   */
  setAddNewDeviceOptionsHandler(callback) {
    this.addNewDeviceOptionsHandler = callback;
  }

  /**
   * Sets handler for get notifications response events
   * @param {Function} callback
   */
  setGetNotificationsHandler(callback) {
    this.getNotificationsHandler = callback;
  }

  /**
   * Sets handler for update notification response events
   * @param {Function} callback
   */
  setUpdateNotificationHandler(callback) {
    this.updateNotificationHandler = callback;
  }

  /**
   * Sets handler for get notification history response events
   * @param {Function} callback
   */
  setGetNotificationHistoryHandler(callback) {
    this.getNotificationHistoryHandler = callback;
  }

  /**
   * Gets the current get notification history handler
   * @returns {Function|undefined}
   */
  getOnGetNotificationHistoryHandler() {
    return this.getNotificationHistoryHandler;
  }

  /**
   * Sets handler for credentials available for update events
   * @param {Function} callback
   */
  setCredentialsAvailableForUpdateHandler(callback) {
    this.credentialsAvailableForUpdateHandler = callback;
  }

  /**
   * Sets handler for update credential response events
   * @param {Function} callback
   */
  setUpdateCredentialResponseHandler(callback) {
    this.updateCredentialResponseHandler = callback;
  }

  /**
   * Sets handler for device authentication management status events (LDA Toggling)
   * @param {Function} callback
   */
  setDeviceAuthManagementStatusHandler(callback) {
    this.deviceAuthManagementStatusHandler = callback;
  }

  /**
   * Sets handler for data signing response events
   * @param {Function} callback - Callback function receiving signing response data
   */
  setDataSigningResponseHandler(callback) {
    this.dataSigningResponseHandler = callback;
  }

  /**
   * Cleans up all event listeners and handlers
   */
  cleanup() {
    console.log('RdnaEventManager - Cleaning up event listeners and handlers');

    // Remove native event listeners
    this.listeners.forEach(listener => {
      document.removeEventListener(listener.name, listener.handler, false);
    });
    this.listeners = [];

    // Clear all event handlers
    this.initializeProgressHandler = null;
    this.initializeErrorHandler = null;
    this.initializedHandler = null;
    this.sdkLogPrintRequestHandler = null;
    this.userConsentThreatsHandler = null;
    this.terminateWithThreatsHandler = null;

    // Clear MFA event handlers
    this.getUserHandler = null;
    this.getActivationCodeHandler = null;
    this.getUserConsentForLDAHandler = null;
    this.getPasswordHandler = null;
    this.onUserLoggedInHandler = null;
    this.onUserLoggedOffHandler = null;

    // Clear Session Management event handlers
    this.sessionTimeoutHandler = null;
    this.sessionTimeoutNotificationHandler = null;
    this.sessionExtensionResponseHandler = null;

    // Clear Device Activation event handlers
    this.addNewDeviceOptionsHandler = null;

    // Clear Notification Management event handlers
    this.getNotificationsHandler = null;
    this.updateNotificationHandler = null;

    // Clear Password Update event handlers
    this.credentialsAvailableForUpdateHandler = null;
    this.updateCredentialResponseHandler = null;

    // Clear LDA Toggling event handlers
    this.deviceAuthManagementStatusHandler = null;

    // Clear Data Signing event handlers
    this.dataSigningResponseHandler = null;

    console.log('RdnaEventManager - Cleanup completed');
  }
}

// Export singleton instance
const rdnaEventManager = RdnaEventManager.getInstance();
