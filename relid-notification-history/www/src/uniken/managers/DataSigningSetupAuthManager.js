/**
 * Data Signing Setup Authentication Manager
 *
 * Centralized manager for handling step-up authentication (challengeMode 12)
 * during data signing operations. Manages context, modal display, and password verification.
 *
 * This module separates data signing authentication logic from the main event flow.
 *
 * Key Responsibilities:
 * - Store data signing authentication context (payload, auth level, etc.)
 * - Show/hide password challenge modal for data signing
 * - Handle password submission with challengeMode 12
 * - Handle cancellation and cleanup
 * - Process data signing responses
 *
 * Challenge Mode 12 Flow:
 * 1. User initiates data signing with auth level requiring password (Level 4)
 * 2. SDK triggers getPassword event with challengeMode 12
 * 3. Manager shows password modal
 * 4. User enters password, manager calls setPassword(password, 12)
 * 5. SDK processes authentication and triggers onAuthenticateUserAndSignData
 *
 * Usage:
 * ```javascript
 * // Before calling authenticateUserAndSignData
 * DataSigningSetupAuthManager.setContext({
 *   payload: 'data to sign',
 *   authLevel: 4,
 *   authenticatorType: 2,
 *   reason: 'Transaction approval'
 * });
 *
 * // When SDK triggers getPassword with challengeMode 12
 * DataSigningSetupAuthManager.showPasswordDialog(data);
 *
 * // After success/error
 * DataSigningSetupAuthManager.clearContext();
 * ```
 */

const DataSigningSetupAuthManager = {
  /**
   * Data signing authentication context
   * Stores signing parameters when authenticateUserAndSignData triggers password challenge
   */
  _context: {
    payload: '',
    authLevel: 0,
    authenticatorType: 0,
    reason: '',
    userID: '',
    isActive: false
  },

  /**
   * Set data signing authentication context
   * Called by DataSigningInputScreen before calling authenticateUserAndSignData
   *
   * @param {Object} context - Data signing context
   * @param {string} context.payload - Data payload to sign
   * @param {number} context.authLevel - Authentication level (0, 1, or 4)
   * @param {number} context.authenticatorType - Authenticator type enum
   * @param {string} context.reason - Reason for signing
   * @param {string} context.userID - Current user ID
   */
  setContext(context) {
    console.log('DataSigningSetupAuthManager - Setting context:', JSON.stringify({
      payloadLength: context.payload?.length || 0,
      authLevel: context.authLevel,
      authenticatorType: context.authenticatorType,
      reasonLength: context.reason?.length || 0,
      userID: context.userID
    }, null, 2));

    this._context = {
      payload: context.payload || '',
      authLevel: context.authLevel || 0,
      authenticatorType: context.authenticatorType || 0,
      reason: context.reason || '',
      userID: context.userID || '',
      isActive: true
    };
  },

  /**
   * Clear data signing authentication context
   * Called after successful/failed authentication or on error
   */
  clearContext() {
    console.log('DataSigningSetupAuthManager - Clearing context');
    this._context = {
      payload: '',
      authLevel: 0,
      authenticatorType: 0,
      reason: '',
      userID: '',
      isActive: false
    };
  },

  /**
   * Get data signing authentication context
   * @returns {Object} Data signing context
   */
  getContext() {
    return this._context;
  },

  /**
   * Check if context is active (data signing in progress)
   * @returns {boolean} True if context is active
   */
  isActive() {
    return this._context.isActive;
  },

  /**
   * Show password challenge modal
   * Called by DataSigningInputScreen when getPassword event received with challengeMode 12
   *
   * @param {Object} data - Get password data from SDK
   */
  showPasswordDialog(data) {
    console.log('DataSigningSetupAuthManager - Showing password dialog:', JSON.stringify({
      challengeMode: data.challengeMode,
      attemptsLeft: data.attemptsLeft,
      userID: data.userID,
      hasStatusError: !!data.challengeResponse?.status?.statusCode && data.challengeResponse.status.statusCode !== 100
    }, null, 2));

    if (typeof PasswordChallengeModal === 'undefined') {
      console.error('DataSigningSetupAuthManager - PasswordChallengeModal not found');
      return;
    }

    // Check for error status codes (e.g., wrong password)
    const statusCode = data.challengeResponse?.status?.statusCode;
    const statusMessage = data.challengeResponse?.status?.statusMessage || '';
    const errorMessage = statusCode !== 100 ? (statusMessage || 'Incorrect password. Please try again.') : '';

    // Check if modal is already visible (re-triggered after wrong password)
    const modal = document.getElementById('data-signing-password-modal');
    const isModalVisible = modal && modal.style.display !== 'none';

    if (isModalVisible && errorMessage) {
      // Modal already visible, update with error and new attempts count
      console.log('DataSigningSetupAuthManager - Updating modal with error:', errorMessage);
      PasswordChallengeModal.update({
        attemptsLeft: data.attemptsLeft,
        errorMessage: errorMessage,
        isSubmitting: false
      });
    } else {
      // First time showing modal
      console.log('DataSigningSetupAuthManager - Showing modal for first time');
      PasswordChallengeModal.show(data.challengeMode, data.attemptsLeft, {
        payload: this._context.payload,
        authLevel: this._context.authLevel,
        authenticatorType: this._context.authenticatorType,
        reason: this._context.reason
      });
    }
  },

  /**
   * Hide password challenge modal
   */
  hidePasswordDialog() {
    console.log('DataSigningSetupAuthManager - Hiding password dialog');

    if (typeof PasswordChallengeModal !== 'undefined') {
      PasswordChallengeModal.hide();
    }
  },

  /**
   * Handle password submission
   * Called by PasswordChallengeModal when user submits password
   *
   * @param {string} password - User-entered password
   * @returns {Promise<Object>} Promise resolving with sync response
   */
  async handlePasswordSubmit(password) {
    console.log('DataSigningSetupAuthManager - Password submitted');

    try {
      // Call setPassword with challengeMode 12
      const syncResponse = await rdnaService.setPassword(password, 12);

      console.log('DataSigningSetupAuthManager - setPassword sync response:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // If setPassword succeeds, SDK will either:
      // 1. Trigger getPassword again if password is wrong (with error status)
      // 2. Process the data signing and trigger onAuthenticateUserAndSignData
      // The modal will stay visible until we get the final response

      return syncResponse;
    } catch (error) {
      console.error('DataSigningSetupAuthManager - setPassword sync error:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  /**
   * Handle cancellation
   * Called by PasswordChallengeModal when user cancels
   */
  async handleCancel() {
    console.log('DataSigningSetupAuthManager - Authentication cancelled');

    try {
      // Reset data signing state in SDK
      await DataSigningService.resetState();
    } catch (error) {
      console.error('DataSigningSetupAuthManager - Reset state failed:', error);
    }

    // Clear context
    this.clearContext();

    // Hide modal
    this.hidePasswordDialog();

    // Navigate back to input screen
    NavigationService.navigate('DataSigningInput');
  },

  /**
   * Handle successful data signing
   * Called by DataSigningInputScreen after receiving onAuthenticateUserAndSignData with success
   *
   * @param {Object} signingResult - Data signing response from SDK
   */
  handleSuccess(signingResult) {
    console.log('DataSigningSetupAuthManager - Data signing successful');

    // Clear context
    this.clearContext();

    // Hide modal
    this.hidePasswordDialog();

    // Navigate to results screen
    // (DataSigningInputScreen handles this navigation)
  },

  /**
   * Handle authentication error
   * Called by DataSigningInputScreen after receiving onAuthenticateUserAndSignData with error
   *
   * @param {Object} error - Error details
   */
  handleError(error) {
    console.log('DataSigningSetupAuthManager - Data signing failed:', JSON.stringify(error, null, 2));

    // Clear context
    this.clearContext();

    // Hide modal
    this.hidePasswordDialog();

    // Show error message
    // (DataSigningInputScreen handles error display)
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.DataSigningSetupAuthManager = DataSigningSetupAuthManager;
}
