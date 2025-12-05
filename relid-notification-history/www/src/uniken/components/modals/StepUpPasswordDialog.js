/**
 * Step-Up Password Dialog Component
 *
 * Modal dialog for step-up authentication during notification actions.
 * Handles challengeMode = 3 (RDNA_OP_AUTHORIZE_NOTIFICATION) when the SDK
 * requires password verification before allowing a notification action.
 *
 * This is the Cordova equivalent of React Native's StepUpPasswordDialog component.
 *
 * Features:
 * - Password input with visibility toggle
 * - Attempts left counter with color coding (green → orange → red)
 * - Error message display
 * - Loading state during authentication
 * - Notification context display
 * - Auto-focus on password field
 * - Hardware back button handling
 *
 * Usage:
 * ```javascript
 * StepUpPasswordDialog.show({
 *   notificationTitle: "Payment Approval",
 *   notificationMessage: "Approve payment of $500",
 *   userID: "john.doe",
 *   attemptsLeft: 3,
 *   errorMessage: "Incorrect password",
 *   onSubmitPassword: (password) => handlePasswordSubmit(password),
 *   onCancel: () => console.log('Cancelled')
 * });
 * ```
 *
 * The modal is embedded in index.html as a persistent div, shown/hidden via CSS display property.
 */

const StepUpPasswordDialog = {
  // Modal state
  visible: false,
  notificationTitle: '',
  notificationMessage: '',
  userID: '',
  attemptsLeft: 3,
  errorMessage: '',
  isSubmitting: false,

  // Callbacks
  onSubmitPassword: null,
  onCancel: null,

  /**
   * Initializes the modal (sets up event listeners)
   * Called once when app loads
   */
  initialize() {
    console.log('StepUpPasswordDialog - Initializing');

    // Button handlers will be attached when modal is shown
    // This ensures handlers are attached to the correct elements

    console.log('StepUpPasswordDialog - Initialized');
  },

  /**
   * Shows the modal with the specified configuration
   *
   * @param {Object} config
   * @param {string} config.notificationTitle - Notification title to display
   * @param {string} config.notificationMessage - Notification message to display
   * @param {string} config.userID - Current user ID
   * @param {number} config.attemptsLeft - Remaining authentication attempts
   * @param {string} [config.errorMessage] - Error message to display (if any)
   * @param {Function} config.onSubmitPassword - Callback when password is submitted
   * @param {Function} config.onCancel - Callback when user cancels
   */
  show(config) {
    console.log('StepUpPasswordDialog - Showing modal');

    this.visible = true;
    this.notificationTitle = config.notificationTitle || 'Notification Action';
    this.notificationMessage = config.notificationMessage || '';
    this.userID = config.userID || '';
    this.attemptsLeft = config.attemptsLeft || 3;
    this.errorMessage = config.errorMessage || '';
    this.isSubmitting = false;
    this.onSubmitPassword = config.onSubmitPassword;
    this.onCancel = config.onCancel;

    // Render modal content
    this.render();

    // Show modal
    const modalElement = document.getElementById('stepup-password-modal');
    if (modalElement) {
      modalElement.style.display = 'flex';
    }

    // Auto-focus password input after a short delay
    setTimeout(() => {
      const passwordInput = document.getElementById('stepup-password-input');
      if (passwordInput) {
        passwordInput.focus();
      }
    }, 300);
  },

  /**
   * Updates the modal state without hiding/showing
   * Used when SDK re-triggers getPassword with updated attemptsLeft or error
   *
   * @param {Object} updates - State updates
   */
  update(updates) {
    console.log('StepUpPasswordDialog - Updating modal state:', JSON.stringify(updates, null, 2));

    if (updates.attemptsLeft !== undefined) {
      this.attemptsLeft = updates.attemptsLeft;
    }

    if (updates.errorMessage !== undefined) {
      this.errorMessage = updates.errorMessage;
    }

    if (updates.isSubmitting !== undefined) {
      this.isSubmitting = updates.isSubmitting;
    }

    // Re-render with updated state
    this.render();

    // Clear and refocus password input
    const passwordInput = document.getElementById('stepup-password-input');
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.focus();
    }
  },

  /**
   * Hides the modal and cleans up
   */
  hide() {
    console.log('StepUpPasswordDialog - Hiding modal');

    this.visible = false;
    this.notificationTitle = '';
    this.notificationMessage = '';
    this.userID = '';
    this.attemptsLeft = 3;
    this.errorMessage = '';
    this.isSubmitting = false;
    this.onSubmitPassword = null;
    this.onCancel = null;

    // Hide modal
    const modalElement = document.getElementById('stepup-password-modal');
    if (modalElement) {
      modalElement.style.display = 'none';
    }

    // Clear password input
    const passwordInput = document.getElementById('stepup-password-input');
    if (passwordInput) {
      passwordInput.value = '';
    }
  },

  /**
   * Renders the modal content
   */
  render() {
    const contentElement = document.getElementById('stepup-modal-content');
    if (!contentElement) {
      console.error('StepUpPasswordDialog - Content element not found');
      return;
    }

    // Get attempts color (green → orange → red)
    const attemptsColor = this.getAttemptsColor();

    // Build modal HTML
    contentElement.innerHTML = `
      <!-- Header -->
      <div class="stepup-modal-header">
        <div class="stepup-modal-title">🔐 Authentication Required</div>
        <div class="stepup-modal-subtitle">Please verify your password to authorize this action</div>
      </div>

      <!-- Body -->
      <div class="stepup-modal-body">
        <!-- Notification Context -->
        <div class="stepup-notification-context">
          <div class="stepup-notification-title">${this.escapeHtml(this.notificationTitle)}</div>
        </div>

        <!-- Attempts Counter -->
        ${this.attemptsLeft <= 3 ? `
          <div class="stepup-attempts-container" style="background-color: ${attemptsColor}20;">
            <div class="stepup-attempts-text" style="color: ${attemptsColor};">
              ${this.attemptsLeft} attempt${this.attemptsLeft !== 1 ? 's' : ''} remaining
            </div>
          </div>
        ` : ''}

        <!-- Error Message -->
        ${this.errorMessage ? `
          <div class="stepup-error-container">
            <div class="stepup-error-text">${this.escapeHtml(this.errorMessage)}</div>
          </div>
        ` : ''}

        <!-- Password Input -->
        <div class="stepup-input-container">
          <label class="stepup-input-label">Password</label>
          <div class="stepup-password-wrapper">
            <input
              type="password"
              id="stepup-password-input"
              class="stepup-password-input"
              placeholder="Enter your password"
              autocapitalize="none"
              autocorrect="off"
              ${this.isSubmitting ? 'disabled' : ''}
            />
            <button
              id="stepup-toggle-visibility"
              class="stepup-visibility-button"
              type="button"
              ${this.isSubmitting ? 'disabled' : ''}
            >
              <span class="stepup-visibility-icon">🙈</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="stepup-modal-footer">
        <button
          id="stepup-verify-button"
          class="stepup-verify-button"
          ${this.isSubmitting ? 'disabled' : ''}
        >
          ${this.isSubmitting ? `
            <span class="stepup-button-loading">
              <span class="spinner-small"></span>
              <span>Verifying...</span>
            </span>
          ` : 'Verify & Continue'}
        </button>
        <button
          id="stepup-cancel-button"
          class="stepup-cancel-button"
          ${this.isSubmitting ? 'disabled' : ''}
        >
          Cancel
        </button>
      </div>
    `;

    // Attach event listeners
    this.attachEventListeners();
  },

  /**
   * Attaches event listeners to modal elements
   */
  attachEventListeners() {
    // Verify button
    const verifyButton = document.getElementById('stepup-verify-button');
    if (verifyButton) {
      verifyButton.onclick = () => this.handleSubmit();
    }

    // Cancel button
    const cancelButton = document.getElementById('stepup-cancel-button');
    if (cancelButton) {
      cancelButton.onclick = () => this.handleCancel();
    }

    // Visibility toggle button
    const toggleButton = document.getElementById('stepup-toggle-visibility');
    if (toggleButton) {
      toggleButton.onclick = () => this.togglePasswordVisibility();
    }

    // Password input - Enter key submission
    const passwordInput = document.getElementById('stepup-password-input');
    if (passwordInput) {
      passwordInput.onkeypress = (e) => {
        if (e.key === 'Enter' && !this.isSubmitting) {
          this.handleSubmit();
        }
      };
    }

    // Handle hardware back button (Android)
    const backHandler = () => {
      if (this.visible && !this.isSubmitting) {
        this.handleCancel();
        return true; // Prevent default back action
      }
      return false;
    };

    // Register back button handler
    if (typeof window !== 'undefined') {
      document.addEventListener('backbutton', backHandler, false);
    }
  },

  /**
   * Handles password submission
   */
  handleSubmit() {
    if (this.isSubmitting) {
      console.log('StepUpPasswordDialog - Already submitting');
      return;
    }

    const passwordInput = document.getElementById('stepup-password-input');
    if (!passwordInput) {
      console.error('StepUpPasswordDialog - Password input not found');
      return;
    }

    const password = passwordInput.value.trim();

    if (!password) {
      console.log('StepUpPasswordDialog - Empty password');
      return;
    }

    console.log('StepUpPasswordDialog - Submitting password');

    // Update UI to show loading state
    this.isSubmitting = true;
    this.render();

    // Call callback
    if (this.onSubmitPassword) {
      this.onSubmitPassword(password);
    }
  },

  /**
   * Handles cancel action
   */
  handleCancel() {
    console.log('StepUpPasswordDialog - Cancel clicked');

    // Call callback
    if (this.onCancel) {
      this.onCancel();
    }

    // Hide modal
    this.hide();
  },

  /**
   * Toggles password visibility
   */
  togglePasswordVisibility() {
    const passwordInput = document.getElementById('stepup-password-input');
    const visibilityIcon = document.querySelector('.stepup-visibility-icon');

    if (!passwordInput || !visibilityIcon) return;

    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    visibilityIcon.textContent = isPassword ? '👁️' : '🙈';
  },

  /**
   * Gets color for attempts counter based on remaining attempts
   * @returns {string} Color hex code
   */
  getAttemptsColor() {
    if (this.attemptsLeft === 1) return '#dc2626'; // Red
    if (this.attemptsLeft === 2) return '#f59e0b'; // Orange
    return '#10b981'; // Green
  },

  /**
   * Escapes HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
