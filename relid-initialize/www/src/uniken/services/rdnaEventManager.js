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
 * - onUserConsentThreats: Non-terminating threats requiring user consent
 * - onTerminateWithThreats: Critical threats requiring app termination
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
 * @callback RDNAInitializeProgressCallback
 * @param {RDNAProgressData} data
 *
 * @callback RDNAInitializeErrorCallback
 * @param {RDNAInitializeErrorData} data
 *
 * @callback RDNAInitializeSuccessCallback
 * @param {RDNAInitializedData} data
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

    document.addEventListener('onInitializeProgress', progressListener, false);
    document.addEventListener('onInitializeError', errorListener, false);
    document.addEventListener('onInitialized', initializedListener, false);
    document.addEventListener('onSdkLogPrintRequest', logPrintListener, false);

    // Store listeners for cleanup
    this.listeners.push(
      { name: 'onInitializeProgress', handler: progressListener },
      { name: 'onInitializeError', handler: errorListener },
      { name: 'onInitialized', handler: initializedListener },
      { name: 'onSdkLogPrintRequest', handler: logPrintListener }
    );

    console.log('RdnaEventManager - Native event listeners registered');
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

    console.log('RdnaEventManager - Cleanup completed');
  }
}
