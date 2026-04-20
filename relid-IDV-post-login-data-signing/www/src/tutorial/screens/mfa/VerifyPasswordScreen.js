/**
 * Verify Password Screen - SPA Module
 *
 * Password verification screen for MFA authentication flow.
 * Handles existing password verification for login.
 *
 * **FORGOT PASSWORD FEATURE:**
 * - Shows "Forgot Password?" link when challengeMode = 0 and ENABLE_FORGOT_PASSWORD = true
 * - Calls rdnaService.forgotPassword(userID) when link clicked
 * - SDK triggers verification challenge flow → password reset → automatic login
 *
 * Features:
 * - Password input with validation
 * - Password visibility toggle
 * - **Forgot Password link (conditional)**
 * - Attempts counter display
 * - Real-time error handling
 * - Loading states during API call
 *
 * SDK Integration:
 * - Receives getPassword event data via params (challengeMode = 0)
 * - Displays attempts remaining
 * - Calls rdnaService.setPassword(password, 0)
 * - **Calls rdnaService.forgotPassword(userID) for password reset**
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
    isSubmitting: false,
    isForgotPasswordLoading: false,
    responseData: null
  },

  onContentLoaded(params) {
    console.log('VerifyPasswordScreen - Content loaded:', JSON.stringify(params, null, 2));

    this.state = {
      password: '',
      userID: params.userID || '',
      challengeMode: params.challengeMode || 0,
      attemptsLeft: params.attemptsLeft || 3,
      isSubmitting: false,
      isForgotPasswordLoading: false,
      responseData: params.responseData || null
    };

    this.setupEventListeners();
    this.updateAttemptsDisplay();

    // Show/hide forgot password link based on conditions
    this.updateForgotPasswordDisplay();

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
    const forgotPasswordLink = document.getElementById('forgot-password-link');

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

    // **FORGOT PASSWORD:** Attach handler to forgot password link
    if (forgotPasswordLink) {
      forgotPasswordLink.onclick = (e) => {
        e.preventDefault();
        this.handleForgotPassword();
      };
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
  },

  // ============================================================================
  // FORGOT PASSWORD FUNCTIONALITY
  // ============================================================================

  /**
   * Check if forgot password feature is enabled
   * Shows "Forgot Password?" link only when:
   * - challengeMode === 0 (manual password entry for login)
   * - ENABLE_FORGOT_PASSWORD flag is true in responseData
   *
   * @returns {boolean} True if forgot password should be shown
   */
  isForgotPasswordEnabled() {
    // Only show for challengeMode 0 (password verification, not creation)
    if (this.state.challengeMode !== 0) {
      return false;
    }

    // Check for ENABLE_FORGOT_PASSWORD in responseData
    if (this.state.responseData && this.state.responseData.challengeResponse) {
      const challengeInfo = this.state.responseData.challengeResponse.challenge;

      if (challengeInfo && challengeInfo.challengeData) {
        // Parse challengeData to find ENABLE_FORGOT_PASSWORD
        for (let i = 0; i < challengeInfo.challengeData.length; i++) {
          const item = challengeInfo.challengeData[i];
          if (item.Key === 'ENABLE_FORGOT_PASSWORD') {
            const enabled = item.Value === 'true';
            console.log('VerifyPasswordScreen - ENABLE_FORGOT_PASSWORD found:', enabled);
            return enabled;
          }
        }
      }
    }

    // Default to true for challengeMode 0 if configuration is not available
    // This maintains backward compatibility
    console.log('VerifyPasswordScreen - ENABLE_FORGOT_PASSWORD not found in config, defaulting to true for challengeMode 0');
    return true;
  },

  /**
   * Update forgot password link visibility based on conditions
   */
  updateForgotPasswordDisplay() {
    const forgotPasswordContainer = document.getElementById('forgot-password-container');

    if (forgotPasswordContainer) {
      if (this.isForgotPasswordEnabled()) {
        console.log('VerifyPasswordScreen - Showing forgot password link');
        forgotPasswordContainer.style.display = 'block';
      } else {
        console.log('VerifyPasswordScreen - Hiding forgot password link');
        forgotPasswordContainer.style.display = 'none';
      }
    }
  },

  /**
   * Handle forgot password flow
   * Calls rdnaService.forgotPassword() to initiate password reset
   * SDK will trigger verification challenge → password reset → automatic login
   */
  async handleForgotPassword() {
    if (this.state.isForgotPasswordLoading || this.state.isSubmitting) {
      return;
    }

    if (!this.state.userID) {
      alert('Error\n\nUser ID is required for forgot password');
      return;
    }

    console.log('VerifyPasswordScreen - Initiating forgot password flow for userID:', this.state.userID);

    this.state.isForgotPasswordLoading = true;
    this.updateForgotPasswordLoadingState();
    this.hideError();

    try {
      await rdnaService.forgotPassword(this.state.userID);
      console.log('VerifyPasswordScreen - ForgotPassword sync response successful');
      console.log('VerifyPasswordScreen - SDK will now trigger verification challenge (e.g., activation code)');
      // SDK will handle the rest - verification challenge → reset flow → auto login
    } catch (error) {
      console.error('VerifyPasswordScreen - ForgotPassword sync error:', error);

      this.state.isForgotPasswordLoading = false;
      this.updateForgotPasswordLoadingState();

      const errorMessage = error.error?.errorString || 'Forgot password request failed';
      this.showError(errorMessage);

      // Show detailed error in alert
      alert('Forgot Password Error\n\n' + errorMessage +
            '\n\nError Code: ' + (error.error?.longErrorCode || 'Unknown'));
    }
  },

  /**
   * Update forgot password link loading state
   */
  updateForgotPasswordLoadingState() {
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const forgotPasswordLoader = document.getElementById('forgot-password-loader');
    const forgotPasswordText = document.getElementById('forgot-password-text');

    if (this.state.isForgotPasswordLoading) {
      if (forgotPasswordLink) forgotPasswordLink.style.pointerEvents = 'none';
      if (forgotPasswordLink) forgotPasswordLink.style.opacity = '0.6';
      if (forgotPasswordText) forgotPasswordText.style.display = 'none';
      if (forgotPasswordLoader) forgotPasswordLoader.style.display = 'inline-flex';
    } else {
      if (forgotPasswordLink) forgotPasswordLink.style.pointerEvents = 'auto';
      if (forgotPasswordLink) forgotPasswordLink.style.opacity = '1';
      if (forgotPasswordText) forgotPasswordText.style.display = 'inline';
      if (forgotPasswordLoader) forgotPasswordLoader.style.display = 'none';
    }
  }
};

// Expose to global scope for NavigationService
window.VerifyPasswordScreen = VerifyPasswordScreen;
