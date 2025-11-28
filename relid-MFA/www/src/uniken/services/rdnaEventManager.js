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
      { name: 'onUserLoggedOff', handler: onUserLoggedOffListener }
    );

    console.log('RdnaEventManager - Native event listeners registered (including MTD and MFA)');
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

    console.log('RdnaEventManager - Cleanup completed');
  }
}

// Export singleton instance
const rdnaEventManager = RdnaEventManager.getInstance();
