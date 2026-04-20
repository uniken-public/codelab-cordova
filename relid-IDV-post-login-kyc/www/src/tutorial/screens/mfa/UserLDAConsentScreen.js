/**
 * User LDA Consent Screen - SPA Module
 *
 * Local Device Authentication (LDA) consent screen for MFA flow.
 * Handles user consent for biometric authentication enrollment.
 *
 * Features:
 * - Authentication type detection and display
 * - Approve/Reject buttons for user decision
 * - Real-time error handling
 * - Loading states for both buttons
 * - Info card explaining LDA benefits
 *
 * SDK Integration:
 * - Receives getUserConsentForLDA event data via params
 * - Displays authentication type (Face ID, Touch ID, Fingerprint, etc.)
 * - Calls rdnaService.setUserConsentForLDA(isEnroll, challengeMode, authType)
 *
 * SPA Pattern:
 * - onContentLoaded(params) called when navigated to
 * - setupEventListeners() attaches DOM handlers
 * - No page reload, just content swap
 */

const UserLDAConsentScreen = {
  state: {
    userID: '',
    challengeMode: 0,
    authenticationType: 0,
    isProcessing: false,
    isApproving: false
  },

  onContentLoaded(params) {
    console.log('UserLDAConsentScreen - Content loaded:', JSON.stringify(params, null, 2));

    this.state = {
      userID: params.userID || params.responseData?.userID || '',
      challengeMode: params.challengeMode || params.responseData?.challengeMode || 0,
      authenticationType: params.authenticationType || params.responseData?.authenticationType || 0,
      isProcessing: false,
      isApproving: false
    };

    this.setupEventListeners();
    this.updateUserDisplay();
    this.updateAuthTypeDisplay();

    // Process response data for errors
    if (params.responseData) {
      this.processResponseData(params.responseData);
    }
  },

  /**
   * Process SDK response data and display errors if any
   */
  processResponseData(responseData) {
    // Check for API errors FIRST (error.longErrorCode !== 0)
    if (responseData.error && responseData.error.longErrorCode !== 0) {
      const errorMessage = responseData.error.errorString;
      console.log('UserLDAConsentScreen - API error:', errorMessage);
      this.showStatusBanner(errorMessage, 'error');
      return;
    }

    // THEN check for status errors (statusCode !== 100)
    if (responseData.challengeResponse &&
        responseData.challengeResponse.status.statusCode !== 100 &&
        responseData.challengeResponse.status.statusCode !== 0) {
      const errorMessage = responseData.challengeResponse.status.statusMessage;
      console.log('UserLDAConsentScreen - Status error:', errorMessage);
      this.showStatusBanner(errorMessage, 'error');
      return;
    }

    console.log('UserLDAConsentScreen - Ready for consent input');
  },

  setupEventListeners() {
    const approveBtn = document.getElementById('approve-lda-btn');
    const rejectBtn = document.getElementById('reject-lda-btn');
    const closeBtn = document.getElementById('lda-close-btn');

    if (approveBtn) {
      approveBtn.onclick = () => this.handleApprove();
    }

    if (rejectBtn) {
      rejectBtn.onclick = () => this.handleReject();
    }

    if (closeBtn) {
      closeBtn.onclick = () => this.handleClose();
    }
  },

  async handleApprove() {
    console.log('UserLDAConsentScreen - User approved LDA consent');
    this.setProcessing(true, true);

    try {
      await rdnaService.setUserConsentForLDA(true, this.state.challengeMode, this.state.authenticationType);
      console.log('UserLDAConsentScreen - LDA consent approved, waiting for SDK events');
    } catch (error) {
      console.error('UserLDAConsentScreen - Approve error:', error);
      this.setProcessing(false, true);

      const errorMessage = error.error?.errorString || 'Failed to approve consent';
      alert('Consent Error\n\n' + errorMessage);
    }
  },

  async handleReject() {
    console.log('UserLDAConsentScreen - User rejected LDA consent');
    this.setProcessing(true, false);

    try {
      await rdnaService.setUserConsentForLDA(false, this.state.challengeMode, this.state.authenticationType);
      console.log('UserLDAConsentScreen - LDA consent rejected, waiting for SDK events');
    } catch (error) {
      console.error('UserLDAConsentScreen - Reject error:', error);
      this.setProcessing(false, false);

      const errorMessage = error.error?.errorString || 'Failed to reject consent';
      alert('Consent Error\n\n' + errorMessage);
    }
  },

  /**
   * Handle close button (reset auth state)
   */
  async handleClose() {
    console.log('UserLDAConsentScreen - Close button clicked, calling resetAuthState');

    try {
      await rdnaService.resetAuthState();
      console.log('UserLDAConsentScreen - ResetAuthState successful');
      // SDK will trigger getUser event automatically
    } catch (error) {
      console.error('UserLDAConsentScreen - ResetAuthState error:', error);
      const errorMessage = error.error?.errorString || 'Failed to reset authentication';
      alert('Reset Error\n\n' + errorMessage);
    }
  },

  updateUserDisplay() {
    const usernameEl = document.getElementById('lda-username');
    if (usernameEl) {
      usernameEl.textContent = this.state.userID;
    }
  },

  updateAuthTypeDisplay() {
    // Map authentication type to friendly name
    const authTypeNames = {
      1: 'Touch ID / Face ID',
      2: 'Fingerprint',
      3: 'Device Passcode',
      4: 'Pattern',
      5: 'Biometric Authentication'
    };

    const authTypeName = authTypeNames[this.state.authenticationType] || 'Biometric Authentication';

    const titleEl = document.getElementById('lda-auth-type-title');
    if (titleEl) {
      titleEl.textContent = `${authTypeName} Available`;
    }

    const descEl = document.getElementById('lda-auth-type-desc');
    if (descEl) {
      descEl.textContent = `Your device supports ${authTypeName.toLowerCase()} for secure and convenient authentication.`;
    }
  },

  setProcessing(isProcessing, isApproving) {
    this.state.isProcessing = isProcessing;
    this.state.isApproving = isApproving;

    if (isApproving) {
      const btn = document.getElementById('approve-lda-btn');
      const btnText = document.getElementById('approve-lda-btn-text');
      const btnLoader = document.getElementById('approve-lda-btn-loader');

      if (btn) btn.disabled = isProcessing;
      if (btnText) btnText.style.display = isProcessing ? 'none' : 'inline';
      if (btnLoader) btnLoader.style.display = isProcessing ? 'inline-flex' : 'none';
    } else {
      const btn = document.getElementById('reject-lda-btn');
      const btnText = document.getElementById('reject-lda-btn-text');
      const btnLoader = document.getElementById('reject-lda-btn-loader');

      if (btn) btn.disabled = isProcessing;
      if (btnText) btnText.style.display = isProcessing ? 'none' : 'inline';
      if (btnLoader) btnLoader.style.display = isProcessing ? 'inline-flex' : 'none';
    }

    // Disable other button while processing
    const otherBtn = isApproving ?
      document.getElementById('reject-lda-btn') :
      document.getElementById('approve-lda-btn');
    if (otherBtn) otherBtn.disabled = isProcessing;
  },

  /**
   * Show status banner
   */
  showStatusBanner(message, type = 'info') {
    const banner = document.getElementById('lda-status-banner');
    if (banner) {
      banner.textContent = message;
      banner.className = `status-banner status-${type}`;
      banner.style.display = 'block';
    }
  },

  /**
   * Hide status banner
   */
  hideStatusBanner() {
    const banner = document.getElementById('lda-status-banner');
    if (banner) {
      banner.style.display = 'none';
    }
  }
};

// Expose to global scope for NavigationService
window.UserLDAConsentScreen = UserLDAConsentScreen;
