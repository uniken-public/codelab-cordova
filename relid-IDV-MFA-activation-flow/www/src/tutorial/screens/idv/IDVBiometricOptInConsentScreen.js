/**
 * IDV Biometric Opt-In Consent Screen
 *
 * This screen displays biometric template storage consent options and allows users to accept or deny.
 * Triggered by the getIDVBiometricOptInConsent event during IDV workflows.
 *
 * Key Features:
 * - Biometric consent explanation with challenge mode specific messaging
 * - Accept/Reject consent options
 * - Real-time error handling and loading states
 * - Challenge mode based consent text variations
 *
 * Usage:
 * NavigationService.navigate('IDVBiometricOptInConsent', {
 *   challengeMode: 8,
 *   eventData: data
 * });
 */

const IDVBiometricOptInConsentScreen = {
  // Screen state
  state: {
    challengeMode: null,
    eventData: null,
    isProcessing: false,
    error: ''
  },

  /**
   * Called when NavigationService.navigate('IDVBiometricOptInConsent', params)
   *
   * @param {Object} params - Navigation parameters
   * @param {number} params.challengeMode - Challenge operation mode
   * @param {Object} params.eventData - Event data from SDK
   */
  onContentLoaded(params) {
    console.log('IDVBiometricOptInConsent - Screen loaded with params:', JSON.stringify(params, null, 2));

    // Initialize state
    this.state = {
      challengeMode: params.challengeMode,
      eventData: params.eventData,
      isProcessing: false,
      error: ''
    };

    // Setup event listeners
    this.setupEventListeners();

    // Update consent description based on challenge mode
    this.updateConsentDescription();

    // Clear any previous errors
    this.hideError();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Approve button
    const approveButton = document.getElementById('idv-consent-approve-btn');
    if (approveButton) {
      approveButton.onclick = () => this.handleConsentAction(true);
    }

    // Reject button
    const rejectButton = document.getElementById('idv-consent-reject-btn');
    if (rejectButton) {
      rejectButton.onclick = () => this.handleConsentAction(false);
    }

    // Close button
    const closeButton = document.getElementById('idv-consent-close-btn');
    if (closeButton) {
      closeButton.onclick = () => this.handleClose();
    }
  },

  /**
   * Get consent description based on challenge mode
   *
   * @returns {string} Consent description text
   */
  getConsentDescription() {
    const mode = this.state.challengeMode || 8;

    switch (mode) {
      case 10:
        return 'Your biometric template will be used for enhanced security verification. This allows for faster and more secure authentication in future sessions.';
      default:
        return 'Your selfie biometric template will be securely stored for identity verification. This enables faster authentication and enhanced security for your account.';
    }
  },

  /**
   * Update consent description in the UI
   */
  updateConsentDescription() {
    const descriptionEl = document.getElementById('idv-consent-description');
    if (descriptionEl) {
      descriptionEl.textContent = this.getConsentDescription();
    }
  },

  /**
   * Handle Close Button
   * Calls resetAuthState to cancel entire IDV flow
   */
  async handleClose() {
    if (this.state.isProcessing) return;

    this.setProcessing(true);
    this.hideError();

    try {
      console.log('IDVBiometricOptInConsent - Calling resetAuthState to cancel IDV flow');
      await rdnaService.resetAuthState();
      console.log('IDVBiometricOptInConsent - ResetAuthState successful');
    } catch (error) {
      console.error('IDVBiometricOptInConsent - ResetAuthState error:', JSON.stringify(error, null, 2));
      const errorMessage = error?.error?.errorString || 'Failed to cancel. Please try again.';
      this.showError(errorMessage);
    } finally {
      this.setProcessing(false);
    }
  },

  /**
   * Handle Consent Action (Approve or Reject)
   *
   * @param {boolean} isOptIn - true for approve, false for reject
   */
  async handleConsentAction(isOptIn) {
    const challengeMode = this.state.challengeMode;

    if (challengeMode === null && challengeMode !== 0) {
      this.showError('Invalid challenge mode. Unable to process consent.');
      return;
    }

    this.setProcessing(true);
    this.hideError();

    try {
      console.log('IDVBiometricOptInConsent - Processing biometric opt-in consent:', isOptIn);

      await rdnaIDVService.setIDVBiometricOptInConsent(
        isOptIn,
        challengeMode
      );

      console.log('IDVBiometricOptInConsent - Consent processed successfully');

      // SDK will handle navigation to next step

    } catch (error) {
      console.error('IDVBiometricOptInConsent - Failed to process consent:', JSON.stringify(error, null, 2));
      const errorMessage = error?.error?.errorString || 'Failed to process consent. Please try again.';
      this.showError(errorMessage);
    } finally {
      this.setProcessing(false);
    }
  },

  /**
   * Set processing state and update UI
   *
   * @param {boolean} isProcessing - Whether operation is in progress
   */
  setProcessing(isProcessing) {
    this.state.isProcessing = isProcessing;

    // Update approve button
    const approveButton = document.getElementById('idv-consent-approve-btn');
    if (approveButton) {
      approveButton.disabled = isProcessing;
      approveButton.textContent = isProcessing ? 'Processing...' : 'Approve';
      if (isProcessing) {
        approveButton.classList.add('loading');
      } else {
        approveButton.classList.remove('loading');
      }
    }

    // Update reject button
    const rejectButton = document.getElementById('idv-consent-reject-btn');
    if (rejectButton) {
      rejectButton.disabled = isProcessing;
      rejectButton.textContent = isProcessing ? 'Processing...' : 'Reject';
      if (isProcessing) {
        rejectButton.classList.add('loading');
      } else {
        rejectButton.classList.remove('loading');
      }
    }

    // Update close button
    const closeButton = document.getElementById('idv-consent-close-btn');
    if (closeButton) {
      closeButton.disabled = isProcessing;
    }
  },

  /**
   * Show error message
   *
   * @param {string} message - Error message to display
   */
  showError(message) {
    this.state.error = message;

    const errorDiv = document.getElementById('idv-consent-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  },

  /**
   * Hide error message
   */
  hideError() {
    this.state.error = '';

    const errorDiv = document.getElementById('idv-consent-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
  }
};

// Expose to global scope for NavigationService
window.IDVBiometricOptInConsentScreen = IDVBiometricOptInConsentScreen;
