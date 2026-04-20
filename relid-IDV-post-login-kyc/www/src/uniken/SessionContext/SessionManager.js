/**
 * Session Manager
 *
 * Manages session timeout state and handles SDK session events in Cordova.
 * Provides a singleton pattern for global session management across the application.
 *
 * This is the Cordova equivalent of React Native's SessionContext.
 * Converted from React Context Provider to Singleton with initialize() pattern.
 *
 * Features:
 * - Hard Session Timeout (onSessionTimeout): Mandatory timeout requiring app navigation
 * - Idle Session Timeout Warning (onSessionTimeOutNotification): User can extend or let expire
 * - Session Extension (extendSessionIdleTimeout API): Extends idle session timeout
 * - Modal UI Management: Shows/hides session modal with appropriate configuration
 * - Automatic Navigation: Navigates to home screen on hard timeout
 *
 * @typedef {Object} SessionTimeoutData
 * @property {string} userID - User identifier
 * @property {string} message - Timeout message from SDK
 *
 * @typedef {Object} SessionTimeoutNotificationData
 * @property {string} userID - User identifier
 * @property {number} timeLeftInSeconds - Remaining time before session expires
 * @property {number} sessionCanBeExtended - 1 if can extend, 0 if cannot
 * @property {string} message - Timeout notification message from SDK
 *
 * @typedef {Object} SessionExtensionResponseData
 * @property {Object} status
 * @property {number} status.statusCode
 * @property {string} status.statusMessage
 * @property {Object} error
 * @property {number} error.longErrorCode
 * @property {string} error.errorString
 */

class SessionManager {
  constructor() {
    if (SessionManager.instance) {
      return SessionManager.instance;
    }

    this._initialized = false;

    // Session state
    this.isSessionModalVisible = false;
    this.sessionTimeoutData = null;
    this.sessionTimeoutNotificationData = null;
    this.isProcessing = false;

    // Track current operation to avoid conflicts
    this.currentOperation = 'none'; // 'none' | 'extend'

    SessionManager.instance = this;
  }

  /**
   * Gets the singleton instance
   * @returns {SessionManager}
   */
  static getInstance() {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Initializes session event handlers (idempotent - safe to call multiple times)
   * In SPA architecture, this is called ONCE in AppInitializer
   */
  initialize() {
    if (this._initialized) {
      console.log('SessionManager - Already initialized, skipping');
      return;
    }

    console.log('SessionManager - Initializing session event handlers');

    const eventManager = rdnaService.getEventManager();

    // Register session event handlers
    eventManager.setSessionTimeoutHandler((data) => {
      console.log('SessionManager - Session timeout received:', JSON.stringify(data, null, 2));
      this.showSessionTimeout(data);
    });

    eventManager.setSessionTimeoutNotificationHandler((data) => {
      console.log('SessionManager - Session timeout notification received:', JSON.stringify({
        userID: data.userID,
        timeLeft: data.timeLeftInSeconds,
        canExtend: data.sessionCanBeExtended === 1
      }, null, 2));
      this.showSessionTimeoutNotification(data);
    });

    eventManager.setSessionExtensionResponseHandler((data) => {
      console.log('SessionManager - Session extension response received:', JSON.stringify({
        statusCode: data.status?.statusCode,
        statusMessage: data.status?.statusMessage,
        errorCode: data.error?.longErrorCode,
        errorString: data.error?.errorString
      }, null, 2));
      this.handleSessionExtensionResponse(data);
    });

    this._initialized = true;
    console.log('SessionManager - Session event handlers successfully initialized');
  }

  /**
   * Shows session timeout modal (hard timeout - mandatory)
   * Session has already expired, user must acknowledge and will be redirected to home.
   *
   * @param {SessionTimeoutData} data
   */
  showSessionTimeout(data) {
    console.log('SessionManager - Session timed out, showing modal');

    // Update state
    this.sessionTimeoutData = data;
    this.sessionTimeoutNotificationData = null;
    this.isSessionModalVisible = true;
    this.isProcessing = false;
    this.currentOperation = 'none';

    // Show modal with hard timeout configuration
    SessionModal.show({
      type: 'hard-timeout',
      data: data,
      onDismiss: () => this.handleDismiss()
    });
  }

  /**
   * Shows session timeout notification modal (idle timeout warning)
   * User can choose to extend session or let it expire.
   *
   * @param {SessionTimeoutNotificationData} data
   */
  showSessionTimeoutNotification(data) {
    console.log('SessionManager - Showing session timeout notification modal');

    // Update state
    this.sessionTimeoutNotificationData = data;
    this.sessionTimeoutData = null;
    this.isSessionModalVisible = true;
    this.isProcessing = false;
    this.currentOperation = 'none';

    // Show modal with idle timeout configuration
    SessionModal.show({
      type: 'idle-timeout',
      data: data,
      onExtendSession: () => this.handleExtendSession(),
      onDismiss: () => this.handleDismiss()
    });
  }

  /**
   * Hides the session modal and resets state
   */
  hideSessionModal() {
    console.log('SessionManager - Hiding session modal');

    this.isSessionModalVisible = false;
    this.sessionTimeoutData = null;
    this.sessionTimeoutNotificationData = null;
    this.isProcessing = false;
    this.currentOperation = 'none';

    SessionModal.hide();
  }

  /**
   * Handles user choosing to extend session
   * Calls extendSessionIdleTimeout API and waits for response
   */
  async handleExtendSession() {
    console.log('SessionManager - User chose to extend session');

    if (this.currentOperation !== 'none') {
      console.log('SessionManager - Operation already in progress, ignoring extend request');
      return;
    }

    this.isProcessing = true;
    this.currentOperation = 'extend';

    // Update UI to show processing state
    SessionModal.setProcessing(true);

    try {
      // Call extend session API
      await rdnaService.extendSessionIdleTimeout();
      console.log('SessionManager - Session extension API called successfully');

      // Note: We don't hide the modal immediately as we're waiting for onSessionExtensionResponse
      // The response handler will determine success/failure and take appropriate action
    } catch (error) {
      console.error('SessionManager - Session extension failed:', error);

      this.isProcessing = false;
      this.currentOperation = 'none';
      SessionModal.setProcessing(false);

      const result = error;
      alert(
        `Extension Failed\n\nFailed to extend session:\n${result.error.errorString}\n\nError Code: ${result.error.longErrorCode}`
      );
    }
  }

  /**
   * Handles user dismissing session modal
   * For hard timeout, navigates to home screen
   * For idle timeout notification, just closes modal
   */
  handleDismiss() {
    console.log('SessionManager - User dismissed session modal');

    // Check timeout type BEFORE hiding (hideSessionModal clears the data)
    const isHardTimeout = this.sessionTimeoutData !== null;
    const isIdleTimeout = this.sessionTimeoutNotificationData !== null;

    // Always hide modal
    this.hideSessionModal();

    // For hard session timeout (mandatory), navigate to home screen
    if (isHardTimeout) {
      console.log('SessionManager - Hard session timeout - navigating to home screen');
      NavigationService.reset('TutorialHome');
    }

    // For session timeout notification, just dismiss - user chose to let it expire
    if (isIdleTimeout) {
      console.log('SessionManager - User chose to let idle session expire');
    }
  }

  /**
   * Handles session extension response from SDK
   * Called when onSessionExtensionResponse event is received
   *
   * @param {SessionExtensionResponseData} data
   */
  handleSessionExtensionResponse(data) {
    console.log('SessionManager - Processing session extension response');

    // Only process if we're currently extending
    if (this.currentOperation !== 'extend') {
      console.log('SessionManager - Extension response received but no extend operation in progress, ignoring');
      return;
    }

    const isSuccess = data.error.longErrorCode === 0 && data.status.statusCode === 100;

    if (isSuccess) {
      console.log('SessionManager - Session extension successful');
      this.hideSessionModal();
    } else {
      console.log('SessionManager - Session extension failed:', JSON.stringify({
        statusCode: data.status.statusCode,
        statusMessage: data.status.statusMessage,
        errorCode: data.error.longErrorCode,
        errorString: data.error.errorString
      }, null, 2));

      this.isProcessing = false;
      this.currentOperation = 'none';
      SessionModal.setProcessing(false);

      const errorMessage = data.error.longErrorCode !== 0
        ? data.error.errorString
        : data.status.statusMessage;

      alert(`Extension Failed\n\nFailed to extend session:\n${errorMessage}`);
    }
  }
}

// Export singleton instance
const sessionManager = SessionManager.getInstance();
