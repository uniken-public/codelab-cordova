/**
 * Password Validation Dialog Component
 *
 * Reusable modal dialog for password authentication during biometric opt-in/opt-out flows.
 * Handles password collection when LDA (Local Device Authentication) is unavailable or cancelled.
 *
 * This is the Cordova equivalent of React Native's PasswordValidationDialog component.
 *
 * Features:
 * - Password input with visibility toggle
 * - Attempts left counter with color coding (green → orange → red)
 * - Error message display
 * - Loading state during authentication
 * - Auto-focus on password field
 * - Generic title and message (reusable across different flows)
 * - Auto-clear password field on error
 *
 * Usage:
 * ```javascript
 * PasswordValidationDialog.show({
 *   title: "Password Required",
 *   message: "Enter your password to continue with biometric opt-in",
 *   attemptsLeft: 3,
 *   errorMessage: "",
 *   onSubmit: (password) => handlePasswordSubmit(password),
 *   onCancel: () => handleCancel()
 * });
 * ```
 *
 * The modal is embedded in index.html as a persistent div, shown/hidden via CSS display property.
 */

const PasswordValidationDialog = {
  // Modal state
  visible: false,
  title: 'Password Required',
  message: '',
  attemptsLeft: 3,
  errorMessage: '',
  isSubmitting: false,
  showPassword: false,

  // Callbacks
  onSubmit: null,
  onCancel: null,

  /**
   * Initializes the modal (sets up event listeners)
   * Called once when app loads
   */
  initialize() {
    console.log('PasswordValidationDialog - Initializing');

    // Button handlers will be attached when modal is shown
    // This ensures handlers are attached to the correct elements

    console.log('PasswordValidationDialog - Initialized');
  },

  /**
   * Shows the modal with the specified configuration
   *
   * @param {Object} config
   * @param {string} [config.title] - Modal title (default: "Password Required")
   * @param {string} [config.message] - Instruction message to display
   * @param {number} [config.attemptsLeft] - Remaining authentication attempts (default: 3)
   * @param {string} [config.errorMessage] - Error message to display (if any)
   * @param {Function} config.onSubmit - Callback when password is submitted
   * @param {Function} config.onCancel - Callback when user cancels
   */
  show(config) {
    console.log('PasswordValidationDialog - Showing modal with config:', JSON.stringify({
      title: config.title,
      hasMessage: !!config.message,
      attemptsLeft: config.attemptsLeft,
      hasError: !!config.errorMessage
    }, null, 2));

    this.visible = true;
    this.title = config.title || 'Password Required';
    this.message = config.message || '';
    this.attemptsLeft = config.attemptsLeft !== undefined ? config.attemptsLeft : 3;
    this.errorMessage = config.errorMessage || '';
    this.isSubmitting = false;
    this.showPassword = false;
    this.onSubmit = config.onSubmit;
    this.onCancel = config.onCancel;

    // Render modal content
    this.render();

    // Show modal
    const modalElement = document.getElementById('password-validation-modal');
    if (modalElement) {
      modalElement.style.display = 'flex';
    }

    // Auto-focus password input after a short delay
    setTimeout(() => {
      const passwordInput = document.getElementById('password-validation-input');
      if (passwordInput) {
        passwordInput.value = ''; // Clear field
        passwordInput.focus();
      }
    }, 300);
  },

  /**
   * Updates the modal state (useful for showing errors after submission)
   *
   * @param {Object} updates
   * @param {string} [updates.errorMessage] - New error message
   * @param {number} [updates.attemptsLeft] - Updated attempts left
   */
  update(updates) {
    console.log('PasswordValidationDialog - Updating modal:', JSON.stringify(updates, null, 2));

    if (updates.errorMessage !== undefined) {
      this.errorMessage = updates.errorMessage;
    }

    if (updates.attemptsLeft !== undefined) {
      this.attemptsLeft = updates.attemptsLeft;
    }

    this.isSubmitting = false;

    // Re-render to reflect updates
    this.render();

    // Clear password field on error
    if (this.errorMessage) {
      const passwordInput = document.getElementById('password-validation-input');
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
    }
  },

  /**
   * Hides the modal
   */
  hide() {
    console.log('PasswordValidationDialog - Hiding modal');

    this.visible = false;
    this.isSubmitting = false;
    this.errorMessage = '';
    this.showPassword = false;

    const modalElement = document.getElementById('password-validation-modal');
    if (modalElement) {
      modalElement.style.display = 'none';
    }

    // Clear password field
    const passwordInput = document.getElementById('password-validation-input');
    if (passwordInput) {
      passwordInput.value = '';
    }
  },

  /**
   * Renders the modal content
   * Updates the DOM with current state
   */
  render() {
    const contentElement = document.getElementById('password-validation-modal-content');
    if (!contentElement) {
      console.error('PasswordValidationDialog - Modal content element not found');
      return;
    }

    const attemptsColor = this.getAttemptsColor();

    contentElement.innerHTML = `
      <!-- Header -->
      <div class="stepup-modal-header">
        <div class="stepup-modal-title">${this.escapeHtml(this.title)}</div>
        ${this.message ? `<div class="stepup-modal-subtitle">${this.escapeHtml(this.message)}</div>` : ''}
      </div>

      <!-- Body -->
      <div class="stepup-modal-body">
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
              type="${this.showPassword ? 'text' : 'password'}"
              id="password-validation-input"
              class="stepup-password-input"
              placeholder="Enter your password"
              autocapitalize="none"
              autocorrect="off"
              ${this.isSubmitting ? 'disabled' : ''}
            />
            <button
              id="password-validation-toggle-visibility"
              class="stepup-visibility-button"
              type="button"
              ${this.isSubmitting ? 'disabled' : ''}
            >
              <span class="stepup-visibility-icon">${this.showPassword ? '🙈' : '👁️'}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="stepup-modal-footer">
        <button
          id="password-validation-submit-btn"
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
          id="password-validation-cancel-btn"
          class="stepup-cancel-button"
          ${this.isSubmitting ? 'disabled' : ''}
        >
          Cancel
        </button>
      </div>
    `;

    // Attach event listeners after rendering
    this.attachEventListeners();
  },

  /**
   * Attaches event listeners to interactive elements
   * Called after each render
   */
  attachEventListeners() {
    // Submit button
    const submitBtn = document.getElementById('password-validation-submit-btn');
    if (submitBtn) {
      submitBtn.onclick = () => this.handleSubmit();
    }

    // Cancel button
    const cancelBtn = document.getElementById('password-validation-cancel-btn');
    if (cancelBtn) {
      cancelBtn.onclick = () => this.handleCancel();
    }

    // Password visibility toggle
    const toggleBtn = document.getElementById('password-validation-toggle-visibility');
    if (toggleBtn) {
      toggleBtn.onclick = () => this.togglePasswordVisibility();
    }

    // Password input - Enter key to submit
    const passwordInput = document.getElementById('password-validation-input');
    if (passwordInput) {
      passwordInput.onkeypress = (e) => {
        if (e.key === 'Enter' && !this.isSubmitting) {
          this.handleSubmit();
        }
      };
    }

    // Modal overlay click to cancel
    const modalElement = document.getElementById('password-validation-modal');
    if (modalElement) {
      modalElement.onclick = (e) => {
        // Only close if clicking directly on modal background
        if (e.target === modalElement) {
          this.handleCancel();
        }
      };
    }
  },

  /**
   * Handles password submission
   */
  handleSubmit() {
    if (this.isSubmitting) {
      return;
    }

    const passwordInput = document.getElementById('password-validation-input');
    if (!passwordInput) {
      console.error('PasswordValidationDialog - Password input not found');
      return;
    }

    const password = passwordInput.value.trim();

    if (!password) {
      console.log('PasswordValidationDialog - Password is empty');
      this.errorMessage = 'Password cannot be empty';
      this.render();
      return;
    }

    console.log('PasswordValidationDialog - Submitting password');

    this.isSubmitting = true;
    this.errorMessage = '';
    this.render();

    if (this.onSubmit) {
      this.onSubmit(password);
    }
  },

  /**
   * Handles cancel action
   */
  handleCancel() {
    if (this.isSubmitting) {
      return;
    }

    console.log('PasswordValidationDialog - User cancelled');

    this.hide();

    if (this.onCancel) {
      this.onCancel();
    }
  },

  /**
   * Toggles password visibility
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.render();

    // Re-focus input
    setTimeout(() => {
      const passwordInput = document.getElementById('password-validation-input');
      if (passwordInput) {
        passwordInput.focus();
      }
    }, 0);
  },

  /**
   * Gets color for attempts left counter based on remaining attempts
   *
   * @returns {string} CSS color value
   */
  getAttemptsColor() {
    if (this.attemptsLeft === 1) {
      return '#dc2626'; // Red
    } else if (this.attemptsLeft === 2) {
      return '#f59e0b'; // Orange
    } else {
      return '#10b981'; // Green
    }
  },

  /**
   * Escapes HTML to prevent XSS
   *
   * @param {string} unsafe - Unsafe string
   * @returns {string} Escaped string
   */
  escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
