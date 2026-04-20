/**
 * LDA Toggle Auth Dialog - Unified Component
 *
 * Single modal dialog handling ALL authentication challenges during LDA toggling:
 * - ChallengeMode 5: Password verification (single field - to disable LDA)
 * - ChallengeMode 14: Password creation (two fields + policy - to enable LDA)
 * - ChallengeMode 15: Password verification (single field - to disable LDA)
 * - ChallengeMode 16: LDA consent (to enable LDA with biometric)
 *
 * This unified approach keeps all LDA toggling authentication in one place,
 * making it simpler to understand and maintain.
 *
 * Features:
 * - Dynamic UI based on challengeMode
 * - Password verification with single input (modes 5, 15)
 * - Password creation with two inputs and policy display (mode 14)
 * - LDA consent interface (mode 16)
 * - Attempts counter with color coding (modes 5, 15)
 * - Error message display
 * - Loading states
 * - Auto-focus and keyboard handling
 * - Password policy parsing using parseAndGeneratePolicyMessage utility
 * - Two-layer error handling (SetPasswordScreen/VerifyPasswordScreen pattern):
 *   1. FIRST: Check API errors (error.longErrorCode !== 0)
 *   2. THEN: Check status errors (statusCode !== 100 and !== 0)
 *
 * Location: In lda-toggling folder (post-login feature)
 * Style: Dialog/Modal (not full screen navigation)
 *
 * Usage:
 * ```javascript
 * // For password verification (challengeMode 5, 15)
 * LDAToggleAuthDialog.show(passwordEventData);
 *
 * // For password creation (challengeMode 14)
 * LDAToggleAuthDialog.show(passwordCreateEventData);
 *
 * // For LDA consent (challengeMode 16)
 * LDAToggleAuthDialog.show(consentEventData);
 * ```
 */

window.LDAToggleAuthDialog = {
  // Modal state
  visible: false,
  mode: 'password', // 'password', 'password-create', or 'consent'
  challengeMode: null,
  userID: '',
  attemptsLeft: 3,
  errorMessage: '',
  isSubmitting: false,

  // Password creation specific data (challengeMode 14)
  passwordPolicy: null,
  passwordPolicyMessage: '',

  // LDA consent specific data
  ldaAuthType: null,
  ldaAuthTypeName: '',
  customMessage: '',

  /**
   * Shows the dialog with appropriate UI based on challengeMode
   *
   * @param {Object} data - Event data from SDK
   */
  show(data) {
    console.log('LDAToggleAuthDialog - Showing dialog for challengeMode:', data.challengeMode);
    console.log('LDAToggleAuthDialog - Full event data:', JSON.stringify(data, null, 2));

    this.visible = true;
    this.challengeMode = data.challengeMode;
    this.userID = data.userID || '';
    this.errorMessage = '';
    this.isSubmitting = false;

    // Process response data for errors (same pattern as SetPasswordScreen)
    const errorResult = this.processResponseData(data);
    if (errorResult.hasError) {
      this.errorMessage = errorResult.errorMessage;
      console.log('LDAToggleAuthDialog - Error detected on show:', errorResult.errorMessage);
    }

    // Determine mode based on challengeMode
    if (data.challengeMode === 16) {
      // LDA Consent mode
      this.mode = 'consent';
      // Use authenticationType directly (not ldaAuthType which may contain wrong value)
      this.ldaAuthType = data.authenticationType || 1;
      this.ldaAuthTypeName = this.getAuthTypeName(this.ldaAuthType);
      this.customMessage = data.customMessage || '';
      this.attemptsLeft = 1; // Consent doesn't have multiple attempts

      console.log('LDAToggleAuthDialog - Consent mode initialized:', JSON.stringify({
        challengeMode: this.challengeMode,
        ldaAuthType: this.ldaAuthType,
        ldaAuthTypeName: this.ldaAuthTypeName
      }, null, 2));
    } else if (data.challengeMode === 14) {
      // Password creation mode (challengeMode 14)
      this.mode = 'password-create';
      this.attemptsLeft = data.attemptsLeft || 3;

      // Parse password policy from challengeResponse
      this.parsePasswordPolicy(data);

      console.log('LDAToggleAuthDialog - Password creation mode initialized:', JSON.stringify({
        challengeMode: this.challengeMode,
        passwordPolicy: this.passwordPolicy,
        passwordPolicyMessage: this.passwordPolicyMessage
      }, null, 2));
    } else {
      // Password verification mode (5, 15)
      this.mode = 'password';
      this.attemptsLeft = data.attemptsLeft || 3;
    }

    // Render appropriate UI
    this.render();

    // Show modal
    const modalElement = document.getElementById('lda-toggle-auth-modal');
    if (modalElement) {
      modalElement.style.display = 'flex';
    }

    // Auto-focus appropriate input
    setTimeout(() => {
      if (this.mode === 'password' || this.mode === 'password-create') {
        const passwordInput = document.getElementById('lda-auth-password-input');
        if (passwordInput) {
          passwordInput.value = '';
          passwordInput.focus();
        }

        // Also clear confirm password if in password-create mode
        if (this.mode === 'password-create') {
          const confirmPasswordInput = document.getElementById('lda-auth-confirm-password-input');
          if (confirmPasswordInput) {
            confirmPasswordInput.value = '';
          }
        }
      }
    }, 300);
  },

  /**
   * Updates dialog state (used when SDK re-triggers with error)
   *
   * @param {Object} updates - State updates
   */
  update(updates) {
    console.log('LDAToggleAuthDialog - Updating state:', JSON.stringify(updates, null, 2));

    if (updates.attemptsLeft !== undefined) {
      this.attemptsLeft = updates.attemptsLeft;
    }

    if (updates.errorMessage !== undefined) {
      this.errorMessage = updates.errorMessage;
      // Reset loading state when error message is set
      this.isSubmitting = false;
    }

    if (updates.isSubmitting !== undefined) {
      this.isSubmitting = updates.isSubmitting;
    }

    // Re-render
    this.render();

    // Clear and refocus password input if in password mode
    if (this.mode === 'password') {
      const passwordInput = document.getElementById('lda-auth-password-input');
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
    }

    // Clear and refocus both password inputs if in password-create mode
    if (this.mode === 'password-create') {
      const passwordInput = document.getElementById('lda-auth-password-input');
      const confirmPasswordInput = document.getElementById('lda-auth-confirm-password-input');
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
      if (confirmPasswordInput) {
        confirmPasswordInput.value = '';
      }
    }
  },

  /**
   * Hides the dialog and cleans up
   */
  hide() {
    console.log('LDAToggleAuthDialog - Hiding dialog');

    this.visible = false;
    this.mode = 'password';
    this.challengeMode = null;
    this.userID = '';
    this.attemptsLeft = 3;
    this.errorMessage = '';
    this.isSubmitting = false;
    this.passwordPolicy = null;
    this.passwordPolicyMessage = '';
    this.ldaAuthType = null;
    this.ldaAuthTypeName = '';
    this.customMessage = '';

    // Hide modal
    const modalElement = document.getElementById('lda-toggle-auth-modal');
    if (modalElement) {
      modalElement.style.display = 'none';
    }
  },

  /**
   * Renders modal content dynamically based on mode
   */
  render() {
    const container = document.getElementById('lda-toggle-auth-content');
    if (!container) {
      console.error('LDAToggleAuthDialog - Modal content container not found');
      return;
    }

    if (this.mode === 'password') {
      this.renderPasswordMode(container);
    } else if (this.mode === 'password-create') {
      this.renderPasswordCreateMode(container);
    } else {
      this.renderConsentMode(container);
    }

    // Attach event listeners
    this.attachEventListeners();
  },

  /**
   * Renders password verification UI (challengeMode 5, 15)
   */
  renderPasswordMode(container) {
    // Determine attempts color
    let attemptsColor = '#27ae60'; // green
    if (this.attemptsLeft <= 2) attemptsColor = '#f39c12'; // orange
    if (this.attemptsLeft <= 1) attemptsColor = '#e74c3c'; // red

    container.innerHTML = `
      <!-- Header -->
      <div class="lda-auth-header">
        <h2 class="lda-auth-title">Verify Your Password</h2>
        <p class="lda-auth-subtitle">Enter your password to disable LDA authentication</p>
      </div>

      <!-- User Info -->
      <div class="lda-auth-user-info">
        <span class="lda-auth-label">User:</span>
        <span class="lda-auth-value">${this.userID}</span>
      </div>

      <!-- Attempts Counter -->
      <div class="lda-auth-attempts">
        <span class="lda-auth-label">Attempts remaining:</span>
        <strong class="lda-auth-attempts-count" style="color: ${attemptsColor};">${this.attemptsLeft}</strong>
      </div>

      <!-- Error Message -->
      ${this.errorMessage ? `
        <div class="lda-auth-error">
          <p class="lda-auth-error-text">${this.errorMessage}</p>
        </div>
      ` : ''}

      <!-- Password Input -->
      <div class="lda-auth-input-group">
        <label class="lda-auth-input-label">Password</label>
        <div class="lda-auth-password-wrapper">
          <input
            id="lda-auth-password-input"
            type="password"
            class="lda-auth-input"
            placeholder="Enter your password"
            autocomplete="current-password"
            ${this.isSubmitting ? 'disabled' : ''}
          />
          <button id="lda-auth-toggle-btn" class="lda-auth-toggle-btn" type="button" ${this.isSubmitting ? 'disabled' : ''}>
            👁
          </button>
        </div>
      </div>

      <!-- Buttons -->
      <div class="lda-auth-buttons">
        <button id="lda-auth-cancel-btn" class="lda-auth-btn lda-auth-btn-cancel" ${this.isSubmitting ? 'disabled' : ''}>
          Cancel
        </button>
        <button id="lda-auth-submit-btn" class="lda-auth-btn lda-auth-btn-primary" ${this.isSubmitting ? 'disabled' : ''}>
          ${this.isSubmitting ? '<span class="spinner-tiny"></span> Verifying...' : 'Verify'}
        </button>
      </div>
    `;
  },

  /**
   * Renders LDA consent UI (challengeMode 16)
   */
  renderConsentMode(container) {
    container.innerHTML = `
      <!-- Header -->
      <div class="lda-auth-header">
        <h2 class="lda-auth-title">Enable LDA Authentication</h2>
        <p class="lda-auth-subtitle">Use biometric authentication for faster and more secure login</p>
      </div>

      <!-- Auth Type Info -->
      <div class="lda-auth-type-card">
        <div class="lda-auth-type-icon">🔐</div>
        <div class="lda-auth-type-info">
          <h3 class="lda-auth-type-name">${this.ldaAuthTypeName}</h3>
          <p class="lda-auth-type-desc">Device authentication method</p>
        </div>
      </div>

      <!-- Custom Message -->
      ${this.customMessage ? `
        <div class="lda-auth-info-box">
          <div class="lda-auth-info-icon">ℹ️</div>
          <p class="lda-auth-info-text">${this.customMessage}</p>
        </div>
      ` : ''}

      <!-- Error Message -->
      ${this.errorMessage ? `
        <div class="lda-auth-error">
          <p class="lda-auth-error-text">${this.errorMessage}</p>
        </div>
      ` : ''}

      <!-- Info Message -->
      <div class="lda-auth-info-box">
        <div class="lda-auth-info-icon">💡</div>
        <p class="lda-auth-info-text">
          Once enabled, you'll be able to use ${this.ldaAuthTypeName.toLowerCase()} to authenticate instead of your password.
        </p>
      </div>

      <!-- Buttons -->
      <div class="lda-auth-buttons">
        <button id="lda-auth-cancel-btn" class="lda-auth-btn lda-auth-btn-cancel" ${this.isSubmitting ? 'disabled' : ''}>
          Cancel
        </button>
        <button id="lda-auth-submit-btn" class="lda-auth-btn lda-auth-btn-primary" ${this.isSubmitting ? 'disabled' : ''}>
          ${this.isSubmitting ? '<span class="spinner-tiny"></span> Enabling...' : 'Enable LDA'}
        </button>
      </div>
    `;
  },

  /**
   * Renders password creation UI (challengeMode 14)
   */
  renderPasswordCreateMode(container) {
    container.innerHTML = `
      <!-- Header -->
      <div class="lda-auth-header">
        <h2 class="lda-auth-title">Create Password</h2>
        <p class="lda-auth-subtitle">Set a password to enable LDA authentication</p>
      </div>

      <!-- User Info -->
      <div class="lda-auth-user-info">
        <span class="lda-auth-label">User:</span>
        <span class="lda-auth-value">${this.userID}</span>
      </div>

      <!-- Password Policy -->
      ${this.passwordPolicyMessage ? `
        <div class="lda-auth-info-box">
          <div class="lda-auth-info-icon">ℹ️</div>
          <p class="lda-auth-info-text">${this.passwordPolicyMessage}</p>
        </div>
      ` : ''}

      <!-- Error Message -->
      ${this.errorMessage ? `
        <div class="lda-auth-error">
          <p class="lda-auth-error-text">${this.errorMessage}</p>
        </div>
      ` : ''}

      <!-- Password Input -->
      <div class="lda-auth-input-group">
        <label class="lda-auth-input-label">Password</label>
        <div class="lda-auth-password-wrapper">
          <input
            id="lda-auth-password-input"
            type="password"
            class="lda-auth-input"
            placeholder="Enter password"
            autocomplete="new-password"
            ${this.isSubmitting ? 'disabled' : ''}
          />
          <button id="lda-auth-toggle-btn" class="lda-auth-toggle-btn" type="button" ${this.isSubmitting ? 'disabled' : ''}>
            👁
          </button>
        </div>
      </div>

      <!-- Confirm Password Input -->
      <div class="lda-auth-input-group">
        <label class="lda-auth-input-label">Confirm Password</label>
        <div class="lda-auth-password-wrapper">
          <input
            id="lda-auth-confirm-password-input"
            type="password"
            class="lda-auth-input"
            placeholder="Re-enter password"
            autocomplete="new-password"
            ${this.isSubmitting ? 'disabled' : ''}
          />
          <button id="lda-auth-confirm-toggle-btn" class="lda-auth-toggle-btn" type="button" ${this.isSubmitting ? 'disabled' : ''}>
            👁
          </button>
        </div>
      </div>

      <!-- Buttons -->
      <div class="lda-auth-buttons">
        <button id="lda-auth-cancel-btn" class="lda-auth-btn lda-auth-btn-cancel" ${this.isSubmitting ? 'disabled' : ''}>
          Cancel
        </button>
        <button id="lda-auth-submit-btn" class="lda-auth-btn lda-auth-btn-primary" ${this.isSubmitting ? 'disabled' : ''}>
          ${this.isSubmitting ? '<span class="spinner-tiny"></span> Creating...' : 'Create Password'}
        </button>
      </div>
    `;
  },

  /**
   * Parses password policy from challenge data
   * Uses parseAndGeneratePolicyMessage utility for consistent parsing
   */
  parsePasswordPolicy(data) {
    try {
      // Extract RELID_PASSWORD_POLICY from challengeResponse.challengeInfo
      if (data.challengeResponse && data.challengeResponse.challengeInfo) {
        const policyItem = data.challengeResponse.challengeInfo.find(
          item => item.key === 'RELID_PASSWORD_POLICY'
        );

        if (policyItem && policyItem.value) {
          // Use parseAndGeneratePolicyMessage utility (same as SetPasswordScreen)
          this.passwordPolicyMessage = parseAndGeneratePolicyMessage(policyItem.value);
          this.passwordPolicy = JSON.parse(policyItem.value);

          console.log('LDAToggleAuthDialog - Password policy parsed:', this.passwordPolicyMessage);
        } else {
          console.warn('LDAToggleAuthDialog - RELID_PASSWORD_POLICY not found in challengeInfo');
          this.passwordPolicy = null;
          this.passwordPolicyMessage = 'Please create a strong password';
        }
      } else {
        console.warn('LDAToggleAuthDialog - challengeResponse or challengeInfo not found');
        this.passwordPolicy = null;
        this.passwordPolicyMessage = 'Please create a strong password';
      }
    } catch (error) {
      console.error('LDAToggleAuthDialog - Error parsing password policy:', error);
      this.passwordPolicy = null;
      this.passwordPolicyMessage = 'Please create a strong password';
    }
  },

  /**
   * Process SDK response data and extract errors if any
   * Follows same pattern as SetPasswordScreen and VerifyPasswordScreen:
   * 1. Check API errors FIRST (error.longErrorCode !== 0)
   * 2. THEN check status errors (statusCode !== 100 and !== 0)
   *
   * @param {Object} data - SDK response data
   * @returns {Object} { hasError: boolean, errorMessage: string }
   */
  processResponseData(data) {
    // Check for API errors FIRST (error.longErrorCode !== 0)
    if (data.error && data.error.longErrorCode !== 0) {
      const errorMessage = data.error.errorString || 'An error occurred';
      console.log('LDAToggleAuthDialog - API error detected:', errorMessage);
      return { hasError: true, errorMessage };
    }

    // THEN check for status errors (statusCode !== 100 and !== 0)
    if (data.challengeResponse &&
        data.challengeResponse.status &&
        data.challengeResponse.status.statusCode !== 100 &&
        data.challengeResponse.status.statusCode !== 0) {
      const errorMessage = data.challengeResponse.status.statusMessage || 'Verification failed';
      console.log('LDAToggleAuthDialog - Status error detected:', errorMessage);
      return { hasError: true, errorMessage };
    }

    return { hasError: false, errorMessage: '' };
  },

  /**
   * Attaches event listeners to modal elements
   */
  attachEventListeners() {
    // Submit button
    const submitBtn = document.getElementById('lda-auth-submit-btn');
    if (submitBtn) {
      submitBtn.onclick = () => this.handleSubmit();
    }

    // Cancel button
    const cancelBtn = document.getElementById('lda-auth-cancel-btn');
    if (cancelBtn) {
      cancelBtn.onclick = () => this.handleCancel();
    }

    // Password mode specific
    if (this.mode === 'password') {
      // Toggle password visibility
      const toggleBtn = document.getElementById('lda-auth-toggle-btn');
      if (toggleBtn) {
        toggleBtn.onclick = () => this.togglePasswordVisibility();
      }

      // Enter key to submit
      const passwordInput = document.getElementById('lda-auth-password-input');
      if (passwordInput) {
        passwordInput.onkeypress = (e) => {
          if (e.key === 'Enter' && !this.isSubmitting) {
            this.handleSubmit();
          }
        };
      }
    }

    // Password creation mode specific
    if (this.mode === 'password-create') {
      // Toggle password visibility for password field
      const toggleBtn = document.getElementById('lda-auth-toggle-btn');
      if (toggleBtn) {
        toggleBtn.onclick = () => this.togglePasswordVisibility();
      }

      // Toggle password visibility for confirm password field
      const confirmToggleBtn = document.getElementById('lda-auth-confirm-toggle-btn');
      if (confirmToggleBtn) {
        confirmToggleBtn.onclick = () => this.toggleConfirmPasswordVisibility();
      }

      // Enter key to submit on password input
      const passwordInput = document.getElementById('lda-auth-password-input');
      if (passwordInput) {
        passwordInput.onkeypress = (e) => {
          if (e.key === 'Enter' && !this.isSubmitting) {
            this.handleSubmit();
          }
        };
      }

      // Enter key to submit on confirm password input
      const confirmPasswordInput = document.getElementById('lda-auth-confirm-password-input');
      if (confirmPasswordInput) {
        confirmPasswordInput.onkeypress = (e) => {
          if (e.key === 'Enter' && !this.isSubmitting) {
            this.handleSubmit();
          }
        };
      }
    }

    // Click outside to close
    const modalOverlay = document.getElementById('lda-toggle-auth-modal');
    if (modalOverlay) {
      modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) {
          this.handleCancel();
        }
      };
    }
  },

  /**
   * Handles form submission (password, password-create, or consent)
   */
  async handleSubmit() {
    if (this.mode === 'password') {
      await this.handlePasswordSubmit();
    } else if (this.mode === 'password-create') {
      await this.handlePasswordCreateSubmit();
    } else {
      await this.handleConsentSubmit();
    }
  },

  /**
   * Handles password verification submission (challengeMode 5, 15)
   */
  async handlePasswordSubmit() {
    const passwordInput = document.getElementById('lda-auth-password-input');
    const password = passwordInput ? passwordInput.value : '';

    if (!password) {
      this.errorMessage = 'Please enter your password';
      this.render();
      return;
    }

    console.log('LDAToggleAuthDialog - Submitting password for challengeMode:', this.challengeMode);

    this.isSubmitting = true;
    this.errorMessage = '';
    this.render();

    try {
      await rdnaService.setPassword(password, this.challengeMode);
      console.log('LDAToggleAuthDialog - Password submitted successfully');

      // SDK will trigger response:
      // - Success → onDeviceAuthManagementStatus
      // - Wrong password → re-trigger getPassword with decremented attempts
      // - Exhausted → critical error
    } catch (error) {
      console.error('LDAToggleAuthDialog - Password submission error:', error);
      this.isSubmitting = false;
      this.errorMessage = error?.error?.errorString || 'Failed to verify password';
      this.render();
    }
  },

  /**
   * Handles password creation submission (challengeMode 14)
   */
  async handlePasswordCreateSubmit() {
    const passwordInput = document.getElementById('lda-auth-password-input');
    const confirmPasswordInput = document.getElementById('lda-auth-confirm-password-input');
    const password = passwordInput ? passwordInput.value : '';
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

    // Validate password is not empty
    if (!password) {
      this.errorMessage = 'Please enter a password';
      this.render();
      return;
    }

    // Validate confirm password is not empty
    if (!confirmPassword) {
      this.errorMessage = 'Please confirm your password';
      this.render();
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.render();
      return;
    }

    console.log('LDAToggleAuthDialog - Submitting new password for challengeMode:', this.challengeMode);

    this.isSubmitting = true;
    this.errorMessage = '';
    this.render();

    try {
      await rdnaService.setPassword(password, this.challengeMode);
      console.log('LDAToggleAuthDialog - Password created successfully');

      // SDK will trigger response:
      // - Success → onDeviceAuthManagementStatus or next step (e.g., LDA consent)
      // - Policy violation → re-trigger getPassword with error message
      // - Exhausted → critical error
    } catch (error) {
      console.error('LDAToggleAuthDialog - Password creation error:', error);
      this.isSubmitting = false;
      this.errorMessage = error?.error?.errorString || 'Failed to create password';
      this.render();
    }
  },

  /**
   * Handles LDA consent submission (challengeMode 16)
   */
  async handleConsentSubmit() {
    console.log('LDAToggleAuthDialog - Submitting LDA consent for challengeMode:', this.challengeMode);

    this.isSubmitting = true;
    this.errorMessage = '';
    this.render();

    try {
      // User clicked "Enable LDA" - consent is true
      await rdnaService.setUserConsentForLDA(true, this.challengeMode, this.ldaAuthType);
      console.log('LDAToggleAuthDialog - LDA consent submitted successfully');

      // SDK will trigger onDeviceAuthManagementStatus with result
    } catch (error) {
      console.error('LDAToggleAuthDialog - LDA consent submission error:', error);
      this.isSubmitting = false;
      this.errorMessage = error?.error?.errorString || 'Failed to enable LDA';
      this.render();
    }
  },

  /**
   * Handles cancel button click
   */
  async handleCancel() {
    console.log('LDAToggleAuthDialog - User cancelled');

    // For LDA consent mode, send rejection to SDK
    if (this.mode === 'consent') {
      console.log('LDAToggleAuthDialog - Sending LDA consent rejection to SDK');
      try {
        await rdnaService.setUserConsentForLDA(false, this.challengeMode, this.ldaAuthType);
        console.log('LDAToggleAuthDialog - LDA consent rejection sent successfully');
      } catch (error) {
        console.error('LDAToggleAuthDialog - LDA consent rejection error:', error);
      }
    }

    this.hide();

    // Reset processing state and reload authentication details
    if (typeof window.LDATogglingScreen !== 'undefined') {
      // Reset processing state first (clears processingAuthType flag and hides spinners)
      if (window.LDATogglingScreen.resetProcessingState) {
        console.log('LDAToggleAuthDialog - Resetting processing state after cancel');
        window.LDATogglingScreen.resetProcessingState();
      }

      // Then reload authentication details to reset toggle switches
      if (window.LDATogglingScreen.loadAuthenticationDetails) {
        console.log('LDAToggleAuthDialog - Reloading authentication details after cancel');
        window.LDATogglingScreen.loadAuthenticationDetails();
      }
    }

    //const action = this.mode === 'password' ? 'LDA was not disabled' : 'LDA was not enabled';
    //alert('Operation cancelled. ' + action + '.');
  },

  /**
   * Toggles password visibility
   */
  togglePasswordVisibility() {
    const passwordInput = document.getElementById('lda-auth-password-input');
    const toggleBtn = document.getElementById('lda-auth-toggle-btn');

    if (passwordInput && toggleBtn) {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
      } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁';
      }
    }
  },

  /**
   * Toggles confirm password visibility (for password creation mode)
   */
  toggleConfirmPasswordVisibility() {
    const confirmPasswordInput = document.getElementById('lda-auth-confirm-password-input');
    const confirmToggleBtn = document.getElementById('lda-auth-confirm-toggle-btn');

    if (confirmPasswordInput && confirmToggleBtn) {
      if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        confirmToggleBtn.textContent = '🙈';
      } else {
        confirmPasswordInput.type = 'password';
        confirmToggleBtn.textContent = '👁';
      }
    }
  },

  /**
   * Maps authentication type number to human-readable name
   */
  getAuthTypeName(authType) {
    const names = {
      0: 'None',
      1: 'Biometric Authentication',
      2: 'Face ID',
      3: 'Pattern Authentication',
      4: 'Biometric Authentication',
      9: 'Device Biometric'
    };
    return names[authType] || 'Biometric Authentication';
  }
};

// No initialization needed - dialog is shown on demand
