/**
 * Set Password Screen - SPA Module
 *
 * Password creation screen for MFA authentication flow.
 * Handles password creation with policy validation and confirmation matching.
 *
 * Features:
 * - Password and confirm password inputs
 * - Password policy parsing and display
 * - Real-time validation and error handling
 * - Password visibility toggle
 * - Close button (calls resetAuthState)
 * - Loading states during API call
 *
 * SDK Integration:
 * - Receives getPassword event data via params (challengeMode = 1)
 * - Extracts RELID_PASSWORD_POLICY from challengeInfo
 * - Calls rdnaService.setPassword(password, challengeMode)
 * - Handles password match validation
 *
 * SPA Pattern:
 * - onContentLoaded(params) called when navigated to
 * - setupEventListeners() attaches DOM handlers
 * - extractPasswordPolicy() parses and displays policy
 * - No page reload, just content swap
 */

const SetPasswordScreen = {
  /**
   * Current state (replaces React useState)
   */
  state: {
    password: '',
    confirmPassword: '',
    error: '',
    isSubmitting: false,
    challengeMode: 1,
    userID: '',
    passwordPolicyMessage: ''
  },

  /**
   * Called when screen content is loaded into #app-content
   *
   * @param {Object} params - Navigation parameters
   * @param {Object} params.responseData - SDK event data from getPassword
   */
  onContentLoaded(params) {
    console.log('SetPasswordScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Reset state
    this.state = {
      password: '',
      confirmPassword: '',
      error: '',
      isSubmitting: false,
      challengeMode: params.challengeMode || 1,
      userID: params.userID || '',
      passwordPolicyMessage: ''
    };

    // Setup DOM event listeners
    this.setupEventListeners();

    // Update subtitle with userID
    const subtitle = document.getElementById('setpwd-subtitle');
    if (subtitle && this.state.userID) {
      subtitle.textContent = `Create a secure password for user: ${this.state.userID}`;
    }

    // Extract and display password policy
    if (params.responseData) {
      this.extractPasswordPolicy(params.responseData);
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
      console.log('SetPasswordScreen - API error:', errorMessage);
      this.showError(errorMessage);
      this.showStatusBanner(errorMessage, 'error');
      this.clearPasswordFields();
      return;
    }

    // THEN check for status errors (statusCode !== 100)
    if (responseData.challengeResponse &&
        responseData.challengeResponse.status.statusCode !== 100 &&
        responseData.challengeResponse.status.statusCode !== 0) {
      const errorMessage = responseData.challengeResponse.status.statusMessage;
      console.log('SetPasswordScreen - Status error:', errorMessage);
      this.showError(errorMessage);
      this.showStatusBanner(errorMessage, 'error');
      this.clearPasswordFields();
      return;
    }

    console.log('SetPasswordScreen - Ready for password input');
  },

  /**
   * Attach event listeners to DOM elements
   */
  setupEventListeners() {
    const passwordInput = document.getElementById('password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    const setPasswordBtn = document.getElementById('set-password-btn');
    const closeBtn = document.getElementById('setpwd-close-btn');
    const togglePasswordBtn = document.getElementById('toggle-password-btn');
    const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password-btn');

    if (passwordInput) {
      passwordInput.oninput = () => {
        this.state.password = passwordInput.value;
        this.hideError();
      };

      // Navigate to confirm password field on Enter
      passwordInput.onkeypress = (e) => {
        if (e.key === 'Enter' && confirmPasswordInput) {
          e.preventDefault();
          confirmPasswordInput.focus();
        }
      };

      passwordInput.focus();
    }

    if (confirmPasswordInput) {
      confirmPasswordInput.oninput = () => {
        this.state.confirmPassword = confirmPasswordInput.value;
        this.hideError();
      };

      // Submit form on Enter
      confirmPasswordInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleSetPassword();
        }
      };
    }

    if (setPasswordBtn) {
      setPasswordBtn.onclick = () => this.handleSetPassword();
    }

    if (closeBtn) {
      closeBtn.onclick = () => this.handleClose();
    }

    if (togglePasswordBtn) {
      togglePasswordBtn.onclick = () => this.togglePasswordVisibility('password-input');
    }

    if (toggleConfirmPasswordBtn) {
      toggleConfirmPasswordBtn.onclick = () => this.togglePasswordVisibility('confirm-password-input');
    }
  },

  /**
   * Extract password policy from challenge info
   */
  extractPasswordPolicy(responseData) {
    if (!responseData.challengeResponse || !responseData.challengeResponse.challengeInfo) {
      console.log('SetPasswordScreen - No challenge info available');
      return;
    }

    // Find RELID_PASSWORD_POLICY in challengeInfo array
    const policyInfo = responseData.challengeResponse.challengeInfo.find(
      info => info.key === 'RELID_PASSWORD_POLICY'
    );

    if (policyInfo && policyInfo.value) {
      console.log('SetPasswordScreen - Password policy found, parsing...');

      // Parse and generate user-friendly message
      const policyMessage = parseAndGeneratePolicyMessage(policyInfo.value);
      this.state.passwordPolicyMessage = policyMessage;

      // Display policy
      const policyCard = document.getElementById('password-policy-card');
      const policyText = document.getElementById('password-policy-text');

      if (policyCard && policyText) {
        policyText.textContent = policyMessage;
        policyCard.style.display = 'block';
      }

      console.log('SetPasswordScreen - Password policy:', policyMessage);
    } else {
      console.log('SetPasswordScreen - No password policy in challenge info');
    }
  },

  /**
   * Handle setPassword button click
   */
  async handleSetPassword() {
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;

    // Validation
    if (!password) {
      this.showError('Please enter a password');
      return;
    }

    if (!confirmPassword) {
      this.showError('Please confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      this.showError('Passwords do not match');
      return;
    }

    console.log('SetPasswordScreen - Setting password (challengeMode:', this.state.challengeMode + ')');
    this.setSubmitting(true);
    this.hideError();

    try {
      const syncResponse = await rdnaService.setPassword(password, this.state.challengeMode);
      console.log('SetPasswordScreen - setPassword sync response received:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // Sync response successful - waiting for async events
      console.log('SetPasswordScreen - Waiting for SDK async events');

    } catch (error) {
      console.error('SetPasswordScreen - setPassword error:', error);
      this.setSubmitting(false);

      const errorMessage = error.error?.errorString || 'Failed to set password';
      this.showError(errorMessage);
      this.clearPasswordFields();
    }
  },

  /**
   * Handle close button (reset auth state)
   */
  async handleClose() {
    console.log('SetPasswordScreen - Close button clicked, calling resetAuthState');

    try {
      await rdnaService.resetAuthState();
      console.log('SetPasswordScreen - ResetAuthState successful');
      // SDK will trigger getUser event automatically
    } catch (error) {
      console.error('SetPasswordScreen - ResetAuthState error:', error);
      const errorMessage = error.error?.errorString || 'Failed to reset authentication';
      alert('Reset Error\n\n' + errorMessage);
    }
  },

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  },

  /**
   * Set submitting state
   */
  setSubmitting(isSubmitting) {
    this.state.isSubmitting = isSubmitting;

    const btn = document.getElementById('set-password-btn');
    const btnText = document.getElementById('set-password-btn-text');
    const btnLoader = document.getElementById('set-password-btn-loader');

    if (btn) btn.disabled = isSubmitting;
    if (btnText) btnText.style.display = isSubmitting ? 'none' : 'inline';
    if (btnLoader) btnLoader.style.display = isSubmitting ? 'inline-flex' : 'none';
  },

  /**
   * Clear password input fields
   */
  clearPasswordFields() {
    const passwordInput = document.getElementById('password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');

    if (passwordInput) passwordInput.value = '';
    if (confirmPasswordInput) confirmPasswordInput.value = '';

    this.state.password = '';
    this.state.confirmPassword = '';
  },

  /**
   * Show error message
   */
  showError(message) {
    const errorDiv = document.getElementById('password-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  },

  /**
   * Hide error message
   */
  hideError() {
    const errorDiv = document.getElementById('password-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
  },

  /**
   * Show status banner
   */
  showStatusBanner(message, type = 'info') {
    const banner = document.getElementById('setpwd-status-banner');
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
    const banner = document.getElementById('setpwd-status-banner');
    if (banner) {
      banner.style.display = 'none';
    }
  }
};

// Expose to global scope for NavigationService
window.SetPasswordScreen = SetPasswordScreen;
