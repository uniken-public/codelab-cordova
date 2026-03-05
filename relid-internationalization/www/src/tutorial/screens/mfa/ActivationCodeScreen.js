/**
 * Activation Code Screen - SPA Module
 *
 * Activation code (OTP) input screen for MFA authentication.
 * Handles activation code submission and resend functionality.
 *
 * Features:
 * - Activation code input with validation
 * - Attempts counter display
 * - Resend code functionality
 * - Real-time error handling
 * - Loading states for both buttons
 *
 * SDK Integration:
 * - Receives getActivationCode event data via params
 * - Displays attempts remaining
 * - Calls rdnaService.setActivationCode(code)
 * - Calls rdnaService.resendActivationCode()
 *
 * SPA Pattern:
 * - onContentLoaded(params) called when navigated to
 * - setupEventListeners() attaches DOM handlers
 * - No page reload, just content swap
 */

const ActivationCodeScreen = {
  state: {
    activationCode: '',
    userID: '',
    verificationKey: '',
    attemptsLeft: 3,
    isVerifying: false,
    isResending: false
  },

  onContentLoaded(params) {
    console.log('ActivationCodeScreen - Content loaded:', JSON.stringify(params, null, 2));

    this.state = {
      activationCode: '',
      userID: params.userID || params.responseData?.userID || '',
      verificationKey: params.responseData?.verificationKey || '',
      attemptsLeft: params.attemptsLeft || params.responseData?.attemptsLeft || 3,
      isVerifying: false,
      isResending: false
    };

    this.setupEventListeners();
    this.updateSubtitle();
    this.updateAttemptsDisplay();

    // Process response data for errors (status code 106 = invalid code)
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
      console.log('ActivationCodeScreen - API error:', errorMessage);
      this.showError(errorMessage);
      this.showStatusBanner(errorMessage, 'error');
      this.clearCodeField();
      return;
    }

    // THEN check for status errors (statusCode !== 100)
    if (responseData.challengeResponse &&
        responseData.challengeResponse.status.statusCode !== 100 &&
        responseData.challengeResponse.status.statusCode !== 0) {
      const errorMessage = responseData.challengeResponse.status.statusMessage;
      console.log('ActivationCodeScreen - Status error:', errorMessage);
      this.showError(errorMessage);
      this.showStatusBanner(errorMessage, 'error');
      this.clearCodeField();
      return;
    }

    console.log('ActivationCodeScreen - Ready for activation code input');
  },

  setupEventListeners() {
    const codeInput = document.getElementById('activation-code-input');
    const verifyBtn = document.getElementById('verify-code-btn');
    const resendBtn = document.getElementById('resend-code-btn');
    const closeBtn = document.getElementById('activationcode-close-btn');

    if (codeInput) {
      codeInput.oninput = () => {
        this.state.activationCode = codeInput.value;
        this.hideError();
      };

      codeInput.onkeypress = (e) => {
        if (e.key === 'Enter') this.handleVerifyCode();
      };

      codeInput.focus();
    }

    if (verifyBtn) {
      verifyBtn.onclick = () => this.handleVerifyCode();
    }

    if (resendBtn) {
      resendBtn.onclick = () => this.handleResendCode();
    }

    if (closeBtn) {
      closeBtn.onclick = () => this.handleClose();
    }
  },

  async handleVerifyCode() {
    const code = this.state.activationCode.trim();

    if (!code) {
      this.showError('Please enter the activation code');
      return;
    }

    console.log('ActivationCodeScreen - Verifying code for user:', this.state.userID);
    this.setVerifying(true);
    this.hideError();

    try {
      await rdnaService.setActivationCode(code);
      console.log('ActivationCodeScreen - Code verification submitted, waiting for SDK events');
    } catch (error) {
      console.error('ActivationCodeScreen - Verification error:', error);
      this.setVerifying(false);

      const errorMessage = error.error?.errorString || 'Verification failed';
      this.showError(errorMessage);
      this.clearCodeField();
    }
  },

  async handleResendCode() {
    console.log('ActivationCodeScreen - Resending activation code');
    this.setResending(true);

    try {
      await rdnaService.resendActivationCode();
      console.log('ActivationCodeScreen - Resend requested, waiting for new getActivationCode event');
      // SDK will trigger new getActivationCode with updated data
    } catch (error) {
      console.error('ActivationCodeScreen - Resend error:', error);
      this.setResending(false);

      const errorMessage = error.error?.errorString || 'Failed to resend code';
      alert('Resend Error\n\n' + errorMessage);
    }
  },

  /**
   * Handle close button (reset auth state)
   */
  async handleClose() {
    console.log('ActivationCodeScreen - Close button clicked, calling resetAuthState');

    try {
      await rdnaService.resetAuthState();
      console.log('ActivationCodeScreen - ResetAuthState successful');
      // SDK will trigger getUser event automatically
    } catch (error) {
      console.error('ActivationCodeScreen - ResetAuthState error:', error);
      const errorMessage = error.error?.errorString || 'Failed to reset authentication';
      alert('Reset Error\n\n' + errorMessage);
    }
  },

  updateSubtitle() {
    const subtitle = document.getElementById('activation-subtitle');
    if (subtitle && this.state.userID) {
      subtitle.textContent = `Enter the activation code for user: ${this.state.userID}`;
    }
  },

  updateAttemptsDisplay() {
    const attemptsDiv = document.getElementById('activation-attempts');
    const attemptsCount = document.getElementById('activation-attempts-count');

    if (attemptsDiv && attemptsCount) {
      attemptsCount.textContent = this.state.attemptsLeft;
      attemptsDiv.style.display = 'block';
    }
  },

  clearCodeField() {
    const codeInput = document.getElementById('activation-code-input');
    if (codeInput) codeInput.value = '';
    this.state.activationCode = '';
  },

  setVerifying(isVerifying) {
    this.state.isVerifying = isVerifying;

    const btn = document.getElementById('verify-code-btn');
    const btnText = document.getElementById('verify-code-btn-text');
    const btnLoader = document.getElementById('verify-code-btn-loader');

    if (btn) btn.disabled = isVerifying;
    if (btnText) btnText.style.display = isVerifying ? 'none' : 'inline';
    if (btnLoader) btnLoader.style.display = isVerifying ? 'inline-flex' : 'none';
  },

  setResending(isResending) {
    this.state.isResending = isResending;

    const btn = document.getElementById('resend-code-btn');
    const btnText = document.getElementById('resend-code-btn-text');
    const btnLoader = document.getElementById('resend-code-btn-loader');

    if (btn) btn.disabled = isResending;
    if (btnText) btnText.style.display = isResending ? 'none' : 'inline';
    if (btnLoader) btnLoader.style.display = isResending ? 'inline-flex' : 'none';
  },

  showError(message) {
    const errorDiv = document.getElementById('activation-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  },

  hideError() {
    const errorDiv = document.getElementById('activation-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  },

  /**
   * Show status banner
   */
  showStatusBanner(message, type = 'info') {
    const banner = document.getElementById('activation-status-banner');
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
    const banner = document.getElementById('activation-status-banner');
    if (banner) {
      banner.style.display = 'none';
    }
  }
};

// Expose to global scope for NavigationService
window.ActivationCodeScreen = ActivationCodeScreen;
