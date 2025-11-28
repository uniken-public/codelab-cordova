/**
 * Verify Password Screen - SPA Module
 *
 * Password verification screen for MFA authentication flow.
 * Handles existing password verification for login.
 *
 * Features:
 * - Password input with validation
 * - Password visibility toggle
 * - Attempts counter display
 * - Real-time error handling
 * - Loading states during API call
 *
 * SDK Integration:
 * - Receives getPassword event data via params (challengeMode = 0)
 * - Displays attempts remaining
 * - Calls rdnaService.setPassword(password, 0)
 *
 * SPA Pattern:
 * - onContentLoaded(params) called when navigated to
 * - setupEventListeners() attaches DOM handlers
 * - No page reload, just content swap
 */

const VerifyPasswordScreen = {
  state: {
    password: '',
    userID: '',
    challengeMode: 0,
    attemptsLeft: 3,
    isSubmitting: false
  },

  onContentLoaded(params) {
    console.log('VerifyPasswordScreen - Content loaded:', JSON.stringify(params, null, 2));

    this.state = {
      password: '',
      userID: params.userID || '',
      challengeMode: params.challengeMode || 0,
      attemptsLeft: params.attemptsLeft || 3,
      isSubmitting: false
    };

    this.setupEventListeners();
    this.updateAttemptsDisplay();

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
      console.log('VerifyPasswordScreen - API error:', errorMessage);
      this.showError(errorMessage);
      this.showStatusBanner(errorMessage, 'error');
      this.clearPasswordField();
      return;
    }

    // THEN check for status errors (statusCode !== 100)
    if (responseData.challengeResponse &&
        responseData.challengeResponse.status.statusCode !== 100 &&
        responseData.challengeResponse.status.statusCode !== 0) {
      const errorMessage = responseData.challengeResponse.status.statusMessage;
      console.log('VerifyPasswordScreen - Status error:', errorMessage);
      this.showError(errorMessage);
      this.showStatusBanner(errorMessage, 'error');
      this.clearPasswordField();
      return;
    }

    console.log('VerifyPasswordScreen - Ready for password input');
  },

  setupEventListeners() {
    const passwordInput = document.getElementById('verify-password-input');
    const verifyBtn = document.getElementById('verify-password-btn');
    const toggleBtn = document.getElementById('toggle-verify-password-btn');
    const closeBtn = document.getElementById('verifypwd-close-btn');

    if (passwordInput) {
      passwordInput.oninput = () => {
        this.state.password = passwordInput.value;
        this.hideError();
      };

      passwordInput.onkeypress = (e) => {
        if (e.key === 'Enter') this.handleVerifyPassword();
      };

      passwordInput.focus();
    }

    if (verifyBtn) {
      verifyBtn.onclick = () => this.handleVerifyPassword();
    }

    if (toggleBtn) {
      toggleBtn.onclick = () => {
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
      };
    }

    if (closeBtn) {
      closeBtn.onclick = () => this.handleClose();
    }
  },

  async handleVerifyPassword() {
    const password = this.state.password.trim();

    if (!password) {
      this.showError('Please enter your password');
      return;
    }

    console.log('VerifyPasswordScreen - Verifying password for user:', this.state.userID);
    this.setSubmitting(true);
    this.hideError();

    try {
      await rdnaService.setPassword(password, this.state.challengeMode);
      console.log('VerifyPasswordScreen - Password verification submitted, waiting for SDK events');
    } catch (error) {
      console.error('VerifyPasswordScreen - Verification error:', error);
      this.setSubmitting(false);

      const errorMessage = error.error?.errorString || 'Verification failed';
      this.showError(errorMessage);
      this.clearPasswordField();
    }
  },

  /**
   * Handle close button (reset auth state)
   */
  async handleClose() {
    console.log('VerifyPasswordScreen - Close button clicked, calling resetAuthState');

    try {
      await rdnaService.resetAuthState();
      console.log('VerifyPasswordScreen - ResetAuthState successful');
      // SDK will trigger getUser event automatically
    } catch (error) {
      console.error('VerifyPasswordScreen - ResetAuthState error:', error);
      const errorMessage = error.error?.errorString || 'Failed to reset authentication';
      alert('Reset Error\n\n' + errorMessage);
    }
  },

  updateAttemptsDisplay() {
    const attemptsDiv = document.getElementById('verifypwd-attempts');
    const attemptsCount = document.getElementById('verifypwd-attempts-count');

    if (attemptsDiv && attemptsCount) {
      attemptsCount.textContent = this.state.attemptsLeft;
      attemptsDiv.style.display = 'block';
    }
  },

  clearPasswordField() {
    const passwordInput = document.getElementById('verify-password-input');
    if (passwordInput) passwordInput.value = '';
    this.state.password = '';
  },

  setSubmitting(isSubmitting) {
    this.state.isSubmitting = isSubmitting;

    const btn = document.getElementById('verify-password-btn');
    const btnText = document.getElementById('verify-password-btn-text');
    const btnLoader = document.getElementById('verify-password-btn-loader');

    if (btn) btn.disabled = isSubmitting;
    if (btnText) btnText.style.display = isSubmitting ? 'none' : 'inline';
    if (btnLoader) btnLoader.style.display = isSubmitting ? 'inline-flex' : 'none';
  },

  showError(message) {
    const errorDiv = document.getElementById('verifypwd-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  },

  hideError() {
    const errorDiv = document.getElementById('verifypwd-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  },

  /**
   * Show status banner
   */
  showStatusBanner(message, type = 'info') {
    const banner = document.getElementById('verifypwd-status-banner');
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
    const banner = document.getElementById('verifypwd-status-banner');
    if (banner) {
      banner.style.display = 'none';
    }
  }
};

// Expose to global scope for NavigationService
window.VerifyPasswordScreen = VerifyPasswordScreen;
