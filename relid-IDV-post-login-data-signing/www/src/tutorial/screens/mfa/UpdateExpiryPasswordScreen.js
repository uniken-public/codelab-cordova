/**
 * Update Expiry Password Screen (Password Expiry Flow)
 *
 * This screen is specifically designed for updating expired passwords during authentication flows.
 * It handles the challengeMode = 4 (RDNA_OP_UPDATE_ON_EXPIRY) scenario where users need to update
 * their expired password by providing both current and new passwords.
 *
 * Key Features:
 * - Current password, new password, and confirm password inputs with validation
 * - Password policy parsing and validation
 * - Real-time error handling and loading states
 * - Success/error feedback
 * - Password policy display
 * - Challenge mode 4 handling for password expiry
 *
 * Usage:
 * NavigationService.navigate('UpdateExpiryPassword', {
 *   eventData: data,
 *   title: 'Update Expired Password',
 *   subtitle: 'Your password has expired. Please update it to continue.',
 *   responseData: data
 * });
 */

const UpdateExpiryPasswordScreen = {
  state: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: '',
    isSubmitting: false,
    challengeMode: 4,
    userID: '',
    attemptsLeft: 3,
    passwordPolicyMessage: ''
  },

  /**
   * Called when screen content is loaded into #app-content
   * Replaces React's componentDidMount / useEffect
   *
   * @param {Object} params - Navigation parameters
   */
  onContentLoaded(params) {
    console.log('UpdateExpiryPasswordScreen - Content loaded', JSON.stringify(params, null, 2));

    // Initialize state
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      error: '',
      isSubmitting: false,
      challengeMode: params.challengeMode || 4,
      userID: params.userID || '',
      attemptsLeft: params.attemptsLeft || 3,
      passwordPolicyMessage: ''
    };

    // Setup DOM event listeners
    this.setupEventListeners();

    // Update UI with params
    this.updateUIWithParams(params);

    // Process response data
    if (params.responseData) {
      this.processResponseData(params.responseData);
    }

    // Focus on first input
    this.focusFirstInput();
  },

  /**
   * Setup DOM event listeners
   */
  setupEventListeners() {
    const currentPasswordInput = document.getElementById('update-expiry-current-password');
    const newPasswordInput = document.getElementById('update-expiry-new-password');
    const confirmPasswordInput = document.getElementById('update-expiry-confirm-password');
    const updateBtn = document.getElementById('update-expiry-password-btn');
    const closeBtn = document.getElementById('update-expiry-close-btn');

    // Password toggle buttons
    const toggleCurrentBtn = document.getElementById('toggle-current-password-btn');
    const toggleNewBtn = document.getElementById('toggle-new-password-btn');
    const toggleConfirmBtn = document.getElementById('toggle-confirm-password-btn');

    if (currentPasswordInput) {
      currentPasswordInput.oninput = () => {
        this.state.currentPassword = currentPasswordInput.value;
        this.hideError();
      };
      currentPasswordInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (newPasswordInput) newPasswordInput.focus();
        }
      };
    }

    if (newPasswordInput) {
      newPasswordInput.oninput = () => {
        this.state.newPassword = newPasswordInput.value;
        this.hideError();
      };
      newPasswordInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (confirmPasswordInput) confirmPasswordInput.focus();
        }
      };
    }

    if (confirmPasswordInput) {
      confirmPasswordInput.oninput = () => {
        this.state.confirmPassword = confirmPasswordInput.value;
        this.hideError();
      };
      confirmPasswordInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleUpdatePassword();
        }
      };
    }

    // Password toggle functionality
    if (toggleCurrentBtn && currentPasswordInput) {
      toggleCurrentBtn.onclick = () => {
        const isPassword = currentPasswordInput.type === 'password';
        currentPasswordInput.type = isPassword ? 'text' : 'password';
        toggleCurrentBtn.textContent = isPassword ? '🙈' : '👁';
      };
    }

    if (toggleNewBtn && newPasswordInput) {
      toggleNewBtn.onclick = () => {
        const isPassword = newPasswordInput.type === 'password';
        newPasswordInput.type = isPassword ? 'text' : 'password';
        toggleNewBtn.textContent = isPassword ? '🙈' : '👁';
      };
    }

    if (toggleConfirmBtn && confirmPasswordInput) {
      toggleConfirmBtn.onclick = () => {
        const isPassword = confirmPasswordInput.type === 'password';
        confirmPasswordInput.type = isPassword ? 'text' : 'password';
        toggleConfirmBtn.textContent = isPassword ? '🙈' : '👁';
      };
    }

    if (updateBtn) {
      updateBtn.onclick = () => this.handleUpdatePassword();
    }

    if (closeBtn) {
      closeBtn.onclick = () => this.handleClose();
    }
  },

  /**
   * Update UI elements with navigation params
   */
  updateUIWithParams(params) {
    // Update title
    const titleEl = document.getElementById('update-expiry-title');
    if (titleEl && params.title) {
      titleEl.textContent = params.title;
    }

    // Update subtitle - use subtitle from params or default
    const subtitleEl = document.getElementById('update-expiry-subtitle');
    if (subtitleEl && params.subtitle) {
      subtitleEl.textContent = params.subtitle;
    }

    // Update welcome banner (React Native style - two lines)
    const userNameEl = document.getElementById('update-expiry-username');
    const welcomeBanner = document.getElementById('update-expiry-welcome-banner');
    if (userNameEl && welcomeBanner && this.state.userID) {
      userNameEl.textContent = this.state.userID;
      welcomeBanner.style.display = 'block';
    } else if (welcomeBanner) {
      welcomeBanner.style.display = 'none';
    }

    // Update attempts counter
    this.updateAttemptsDisplay();
  },

  /**
   * Process response data from SDK event
   */
  processResponseData(data) {
    console.log('UpdateExpiryPasswordScreen - Processing response data');

    // Extract user ID
    if (data.userID) {
      this.state.userID = data.userID;
      const userNameEl = document.getElementById('update-expiry-username');
      const welcomeBanner = document.getElementById('update-expiry-welcome-banner');
      if (userNameEl && welcomeBanner) {
        userNameEl.textContent = data.userID;
        welcomeBanner.style.display = 'block';
      }
    }

    // Extract challenge mode
    if (data.challengeMode !== undefined) {
      this.state.challengeMode = data.challengeMode;
    }

    // Extract attempts left
    if (data.attemptsLeft !== undefined) {
      this.state.attemptsLeft = data.attemptsLeft;
      this.updateAttemptsDisplay();
    }

    // Extract password policy
    this.extractPasswordPolicy(data);

    // Check for API errors FIRST (error.longErrorCode !== 0)
    if (data.error && data.error.longErrorCode !== 0) {
      const errorMessage = data.error.errorString || 'An error occurred';
      console.error('UpdateExpiryPasswordScreen - API error:', errorMessage);
      this.showStatusBanner(errorMessage, 'error');
      this.clearPasswordFields();
      return;
    }

    // THEN check for status codes and display appropriate banners
    if (data.challengeResponse?.status) {
      const statusCode = data.challengeResponse.status.statusCode;
      const statusMessage = data.challengeResponse.status.statusMessage;

      // StatusCode 118 = Password expired (informational banner)
      if (statusCode === 118) {
        console.log('UpdateExpiryPasswordScreen - Password expired (statusCode 118), ready for password update');
        this.showStatusBanner(statusMessage || 'Your password has expired. Please update it to continue.', 'warning');
        return;
      }

      // StatusCode 100 or 0 = Success (no banner needed)
      // Other codes = Errors (e.g., 164 = password reuse)
      if (statusCode !== 100 && statusCode !== 0) {
        console.error('UpdateExpiryPasswordScreen - Status error:', statusCode, statusMessage);
        this.showStatusBanner(statusMessage || `Error: Status code ${statusCode}`, 'error');
        this.clearPasswordFields();
        return;
      }
    }
  },

  /**
   * Extract and display password policy (same as SetPasswordScreen)
   */
  extractPasswordPolicy(responseData) {
    if (!responseData.challengeResponse || !responseData.challengeResponse.challengeInfo) {
      console.log('UpdateExpiryPasswordScreen - No challenge info available');
      return;
    }

    // Find RELID_PASSWORD_POLICY in challengeInfo array
    const policyInfo = responseData.challengeResponse.challengeInfo.find(
      info => info.key === 'RELID_PASSWORD_POLICY'
    );

    if (policyInfo && policyInfo.value) {
      console.log('UpdateExpiryPasswordScreen - Password policy found, parsing...');

      // Parse and generate user-friendly message
      const policyMessage = parseAndGeneratePolicyMessage(policyInfo.value);
      this.state.passwordPolicyMessage = policyMessage;

      // Display policy
      const policyCard = document.getElementById('update-expiry-policy-container');
      const policyText = document.getElementById('update-expiry-policy-text');

      if (policyCard && policyText) {
        policyText.textContent = policyMessage;
        policyCard.style.display = 'block';
      }

      console.log('UpdateExpiryPasswordScreen - Password policy:', policyMessage);
    } else {
      console.log('UpdateExpiryPasswordScreen - No password policy in challenge info');
    }
  },

  /**
   * Update attempts counter display
   */
  updateAttemptsDisplay() {
    const attemptsEl = document.getElementById('update-expiry-attempts-left');
    const attemptsContainer = document.getElementById('update-expiry-attempts-container');

    if (attemptsEl) {
      attemptsEl.textContent = this.state.attemptsLeft.toString();
    }

    // Color code the entire attempts info based on attempts
    if (attemptsContainer) {
      if (this.state.attemptsLeft <= 1) {
        attemptsContainer.style.color = '#e74c3c'; // Red
      } else if (this.state.attemptsLeft <= 2) {
        attemptsContainer.style.color = '#f39c12'; // Orange
      } else {
        attemptsContainer.style.color = '#27ae60'; // Green
      }
    }
  },

  /**
   * Handle update password submission
   */
  async handleUpdatePassword() {
    if (this.state.isSubmitting) return;

    const currentPassword = this.state.currentPassword.trim();
    const newPassword = this.state.newPassword.trim();
    const confirmPassword = this.state.confirmPassword.trim();

    // Validation with field-specific inline errors
    if (!currentPassword) {
      this.showError('Please enter your current password', 'update-expiry-current-password');
      this.focusField('update-expiry-current-password');
      return;
    }

    if (!newPassword) {
      this.showError('Please enter a new password', 'update-expiry-new-password');
      this.focusField('update-expiry-new-password');
      return;
    }

    if (!confirmPassword) {
      this.showError('Please confirm your new password', 'update-expiry-confirm-password');
      this.focusField('update-expiry-confirm-password');
      return;
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      this.showError('New password and confirm password do not match', 'update-expiry-confirm-password');
      this.clearFields(['update-expiry-new-password', 'update-expiry-confirm-password']);
      this.focusField('update-expiry-new-password');
      return;
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      this.showError('New password must be different from current password', 'update-expiry-new-password');
      this.clearFields(['update-expiry-new-password', 'update-expiry-confirm-password']);
      this.focusField('update-expiry-new-password');
      return;
    }

    this.setSubmitting(true);
    this.hideError();

    try {
      console.log('UpdateExpiryPasswordScreen - Updating password with challengeMode:', this.state.challengeMode);

      const syncResponse = await rdnaService.updatePassword(
        currentPassword,
        newPassword,
        this.state.challengeMode
      );

      console.log('UpdateExpiryPasswordScreen - UpdatePassword sync response successful, waiting for async events');
      console.log('UpdateExpiryPasswordScreen - Sync response received:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // Success - wait for onUserLoggedIn event
      // SDKEventProvider will handle navigation to Dashboard
    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('UpdateExpiryPasswordScreen - UpdatePassword sync error:', error);

      const errorMessage = error.error?.errorString || 'Failed to update password';
      this.showStatusBanner(errorMessage, 'error');
      this.clearPasswordFields();
      this.setSubmitting(false);
    }
  },

  /**
   * Handle close button
   */
  async handleClose() {
    try {
      console.log('UpdateExpiryPasswordScreen - Calling resetAuthState');
      await rdnaService.resetAuthState();
      console.log('UpdateExpiryPasswordScreen - ResetAuthState successful');
    } catch (error) {
      console.error('UpdateExpiryPasswordScreen - ResetAuthState error:', error);
    }
  },

  /**
   * Set submitting state
   */
  setSubmitting(isSubmitting) {
    this.state.isSubmitting = isSubmitting;

    const btn = document.getElementById('update-expiry-password-btn');
    const btnText = document.getElementById('update-expiry-password-btn-text');
    const btnLoader = document.getElementById('update-expiry-password-btn-loader');
    const currentPasswordInput = document.getElementById('update-expiry-current-password');
    const newPasswordInput = document.getElementById('update-expiry-new-password');
    const confirmPasswordInput = document.getElementById('update-expiry-confirm-password');

    if (btn) btn.disabled = isSubmitting;
    if (btnText) btnText.style.display = isSubmitting ? 'none' : 'inline';
    if (btnLoader) btnLoader.style.display = isSubmitting ? 'inline-flex' : 'none';
    if (currentPasswordInput) currentPasswordInput.disabled = isSubmitting;
    if (newPasswordInput) newPasswordInput.disabled = isSubmitting;
    if (confirmPasswordInput) confirmPasswordInput.disabled = isSubmitting;
  },

  /**
   * Show inline error message for specific field (validation errors)
   * @param {string} message - Error message to display
   * @param {string} fieldId - Optional field ID to show error for specific field
   */
  showError(message, fieldId = null) {
    // If fieldId provided, show inline error for that specific field
    if (fieldId) {
      let errorDivId;
      switch (fieldId) {
        case 'update-expiry-current-password':
          errorDivId = 'update-expiry-current-error';
          break;
        case 'update-expiry-new-password':
          errorDivId = 'update-expiry-new-error';
          break;
        case 'update-expiry-confirm-password':
          errorDivId = 'update-expiry-confirm-error';
          break;
        default:
          errorDivId = null;
      }

      if (errorDivId) {
        const errorDiv = document.getElementById(errorDivId);
        if (errorDiv) {
          errorDiv.textContent = message;
          errorDiv.style.display = 'block';
        }
      }
    } else {
      // No field specified - show all errors in first error div as fallback
      const errorDiv = document.getElementById('update-expiry-current-error');
      if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
      }
    }
  },

  /**
   * Hide all inline error messages
   */
  hideError() {
    const errorDivs = [
      'update-expiry-current-error',
      'update-expiry-new-error',
      'update-expiry-confirm-error'
    ];

    errorDivs.forEach(id => {
      const errorDiv = document.getElementById(id);
      if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
      }
    });
  },

  /**
   * Show status banner (for API/status errors)
   * @param {string} message - Error message to display
   * @param {string} type - Banner type: 'info', 'error', 'success', 'warning'
   */
  showStatusBanner(message, type = 'error') {
    const banner = document.getElementById('update-expiry-status-banner');
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
    const banner = document.getElementById('update-expiry-status-banner');
    if (banner) {
      banner.style.display = 'none';
      banner.textContent = '';
    }
  },

  /**
   * Clear all password fields
   */
  clearPasswordFields() {
    this.clearFields([
      'update-expiry-current-password',
      'update-expiry-new-password',
      'update-expiry-confirm-password'
    ]);
    this.state.currentPassword = '';
    this.state.newPassword = '';
    this.state.confirmPassword = '';
  },

  /**
   * Clear specific fields
   */
  clearFields(fieldIds) {
    fieldIds.forEach(id => {
      const field = document.getElementById(id);
      if (field) field.value = '';
    });
  },

  /**
   * Focus on first input
   */
  focusFirstInput() {
    const firstInput = document.getElementById('update-expiry-current-password');
    if (firstInput) {
      firstInput.focus();
    }
  },

  /**
   * Focus on specific field
   */
  focusField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) field.focus();
  }
};

// Expose to global scope for NavigationService
window.UpdateExpiryPasswordScreen = UpdateExpiryPasswordScreen;
