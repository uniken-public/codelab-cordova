/**
 * Step-Up Authentication Manager
 *
 * Centralized manager for handling step-up authentication (challengeMode 3)
 * for notification actions. Manages context, modal display, and password verification.
 *
 * This module keeps SDKEventProvider clean by separating step-up auth logic.
 *
 * Key Responsibilities:
 * - Store step-up authentication context (notification details)
 * - Show/hide step-up password dialog
 * - Handle password submission with challengeMode 3
 * - Handle cancellation and cleanup
 *
 * Usage:
 * ```javascript
 * // Before calling updateNotification
 * StepUpAuthManager.setContext({ notificationUUID, notificationTitle, ... });
 *
 * // When SDK triggers getPassword with challengeMode 3
 * StepUpAuthManager.showPasswordDialog(data);
 *
 * // After success/error
 * StepUpAuthManager.clearContext();
 * ```
 */

const StepUpAuthManager = {
  /**
   * Step-up authentication context
   * Stores notification details when updateNotification triggers step-up auth
   */
  _context: {
    notificationUUID: null,
    notificationTitle: '',
    notificationMessage: '',
    action: null,
    userID: '',
    sessionParams: {}
  },

  /**
   * Set step-up authentication context
   * Called by GetNotificationsScreen before calling updateNotification
   *
   * @param {Object} context - Step-up context
   * @param {string} context.notificationUUID - UUID of notification being acted upon
   * @param {string} context.notificationTitle - Title to display in modal
   * @param {string} context.notificationMessage - Message to display in modal
   * @param {string} context.action - Action being performed
   * @param {string} context.userID - Current user ID
   * @param {Object} context.sessionParams - Session parameters for navigation
   */
  setContext(context) {
    console.log('StepUpAuthManager - Setting context:', JSON.stringify(context, null, 2));
    this._context = {
      notificationUUID: context.notificationUUID || null,
      notificationTitle: context.notificationTitle || '',
      notificationMessage: context.notificationMessage || '',
      action: context.action || null,
      userID: context.userID || '',
      sessionParams: context.sessionParams || {}
    };
  },

  /**
   * Clear step-up authentication context
   * Called after successful/failed authentication or on error
   */
  clearContext() {
    console.log('StepUpAuthManager - Clearing context');
    this._context = {
      notificationUUID: null,
      notificationTitle: '',
      notificationMessage: '',
      action: null,
      userID: '',
      sessionParams: {}
    };
  },

  /**
   * Get step-up authentication context
   * @returns {Object} Step-up context
   */
  getContext() {
    return this._context;
  },

  /**
   * Check if context is set (has notification UUID)
   * @returns {boolean} True if context is set
   */
  hasContext() {
    return !!this._context.notificationUUID;
  },

  /**
   * Show step-up password dialog
   * Called by SDKEventProvider when getPassword event received with challengeMode 3
   *
   * @param {Object} data - Get password data from SDK
   */
  showPasswordDialog(data) {
    console.log('StepUpAuthManager - Showing password dialog');

    // Check for error status codes
    const statusCode = data.challengeResponse?.status?.statusCode;
    const statusMessage = data.challengeResponse?.status?.statusMessage || '';
    const errorMessage = statusCode !== 100 ? (statusMessage || 'Authentication failed. Please try again.') : '';

    // Show step-up password dialog
    if (typeof StepUpPasswordDialog !== 'undefined') {
      StepUpPasswordDialog.show({
        notificationTitle: this._context.notificationTitle || 'Notification Action',
        notificationMessage: this._context.notificationMessage || '',
        userID: this._context.userID || data.userID || '',
        attemptsLeft: data.attemptsLeft,
        errorMessage: errorMessage,
        onSubmitPassword: (password) => this.handlePasswordSubmit(password),
        onCancel: () => this.handleCancel()
      });
    } else {
      console.error('StepUpAuthManager - StepUpPasswordDialog not found');
    }
  },

  /**
   * Hide step-up password dialog
   */
  hidePasswordDialog() {
    console.log('StepUpAuthManager - Hiding password dialog');

    if (typeof StepUpPasswordDialog !== 'undefined') {
      StepUpPasswordDialog.hide();
    }
  },

  /**
   * Handle password submission
   * @param {string} password - User-entered password
   */
  handlePasswordSubmit(password) {
    console.log('StepUpAuthManager - Password submitted');

    // Update modal to show loading state
    if (typeof StepUpPasswordDialog !== 'undefined') {
      StepUpPasswordDialog.update({ isSubmitting: true });
    }

    // Call setPassword with challengeMode 3
    rdnaService.setPassword(password, 3)
      .then((syncResponse) => {
        console.log('StepUpAuthManager - setPassword sync response:', JSON.stringify({
          longErrorCode: syncResponse.error?.longErrorCode,
          errorString: syncResponse.error?.errorString
        }, null, 2));

        // If setPassword succeeds, SDK will either:
        // 1. Trigger getPassword again if password is wrong (with error status)
        // 2. Process the updateNotification and trigger onUpdateNotification
        // The modal will stay visible until we get the final response
      })
      .catch((error) => {
        console.error('StepUpAuthManager - setPassword sync error:', JSON.stringify(error, null, 2));

        const errorMessage = error?.error?.errorString || 'Failed to verify password';

        // Update modal with error
        if (typeof StepUpPasswordDialog !== 'undefined') {
          StepUpPasswordDialog.update({
            errorMessage: errorMessage,
            isSubmitting: false
          });
        }
      });
  },

  /**
   * Handle cancellation
   */
  handleCancel() {
    console.log('StepUpAuthManager - Authentication cancelled');

    // Clear context
    this.clearContext();

    // Hide modal
    this.hidePasswordDialog();
  },

  /**
   * Handle successful authentication
   * Called by GetNotificationsScreen after receiving onUpdateNotification with success
   */
  handleSuccess() {
    console.log('StepUpAuthManager - Authentication successful');

    // Clear context
    this.clearContext();

    // Hide modal
    this.hidePasswordDialog();
  },

  /**
   * Handle authentication error
   * Called by GetNotificationsScreen after receiving onUpdateNotification with error
   */
  handleError() {
    console.log('StepUpAuthManager - Authentication failed');

    // Clear context
    this.clearContext();

    // Hide modal
    this.hidePasswordDialog();
  }
};
