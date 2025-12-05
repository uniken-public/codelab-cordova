/**
 * Password Challenge Modal
 * Modal for step-up authentication during data signing
 *
 * Features:
 * - Shows modal when getPassword event triggered during data signing
 * - Password input with visibility toggle
 * - Attempts counter with color coding (green/orange/red)
 * - Submit and Cancel buttons
 * - Loading state during submission
 * - Keyboard handling (Enter to submit, Escape to cancel)
 * - Auto-attaches event listeners when shown
 *
 * The modal HTML is embedded in index.html, this file manages the behavior.
 *
 * Usage:
 * - PasswordChallengeModal.show(challengeMode, attemptsLeft) - Show modal
 * - PasswordChallengeModal.hide() - Hide modal
 */

const PasswordChallengeModal = {
  // Modal state
  password: '',
  challengeMode: 0,
  attemptsLeft: 0,
  isSubmitting: false,
  errorMessage: '',
  context: {
    payload: '',
    authLevel: '',
    authenticatorType: '',
    reason: ''
  },

  /**
   * Attach event listeners to modal elements
   * Called each time the modal is shown to ensure handlers are properly attached
   */
  attachEventListeners() {
    console.log('PasswordChallengeModal - Attaching event listeners');

    // Password input
    const passwordInput = document.getElementById('data-signing-password-input');
    if (passwordInput) {
      passwordInput.oninput = () => {
        this.password = passwordInput.value;
      };

      // Enter key to submit
      passwordInput.onkeypress = (e) => {
        if (e.key === 'Enter' && !this.isSubmitting) {
          this.handleSubmit();
        }
      };
    }

    // Submit button
    const submitBtn = document.getElementById('data-signing-password-submit-btn');
    if (submitBtn) {
      submitBtn.onclick = this.handleSubmit.bind(this);
    }

    // Cancel button
    const cancelBtn = document.getElementById('data-signing-password-cancel-btn');
    if (cancelBtn) {
      cancelBtn.onclick = this.handleCancel.bind(this);
    }

    // Modal overlay click to cancel
    const modalOverlay = document.getElementById('data-signing-password-modal-overlay');
    if (modalOverlay) {
      modalOverlay.onclick = (e) => {
        // Only close if clicking the overlay itself, not the modal content
        if (e.target === modalOverlay) {
          this.handleCancel();
        }
      };
    }

    // Keyboard handlers
    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('data-signing-password-modal');
      if (modal && modal.style.display !== 'none') {
        if (e.key === 'Escape') {
          this.handleCancel();
        }
      }
    });

    console.log('PasswordChallengeModal - Event listeners attached');
  },

  /**
   * Renders the modal content dynamically
   */
  render() {
    const contentElement = document.getElementById('data-signing-modal-content');
    if (!contentElement) {
      console.error('PasswordChallengeModal - Content element not found');
      return;
    }

    // Get attempts color (green → orange → red)
    const attemptsColor = this.getAttemptsColor();

    // Build modal HTML
    contentElement.innerHTML = `
      <!-- Header -->
      <div class="data-signing-modal-header">
        <div class="data-signing-modal-title">🔐 Authentication Required</div>
        <div class="data-signing-modal-subtitle">Please verify your password to complete data signing</div>
      </div>

      <!-- Body -->
      <div class="data-signing-modal-body">
        <!-- Attempts Counter -->
        ${this.attemptsLeft <= 3 ? `
          <div class="data-signing-attempts-container" style="background-color: ${attemptsColor}20;">
            <div class="data-signing-attempts-text" style="color: ${attemptsColor};">
              ${this.attemptsLeft} attempt${this.attemptsLeft !== 1 ? 's' : ''} remaining
            </div>
          </div>
        ` : ''}

        <!-- Error Message -->
        ${this.errorMessage ? `
          <div class="data-signing-error-container">
            <div class="data-signing-error-text">${this.escapeHtml(this.errorMessage)}</div>
          </div>
        ` : ''}

        <!-- Password Input -->
        <div class="data-signing-input-container">
          <label class="data-signing-input-label">Password</label>
          <div class="data-signing-password-wrapper">
            <input
              type="password"
              id="data-signing-password-input"
              class="data-signing-password-input"
              placeholder="Enter your password"
              autocapitalize="none"
              autocorrect="off"
              autocomplete="off"
              ${this.isSubmitting ? 'disabled' : ''}
            />
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="data-signing-modal-footer">
        <button
          id="data-signing-password-submit-btn"
          class="data-signing-authenticate-button"
          ${this.isSubmitting ? 'disabled' : ''}
        >
          ${this.isSubmitting ? `
            <span class="data-signing-button-loading">
              <span class="spinner-small"></span>
              <span>Authenticating...</span>
            </span>
          ` : 'Authenticate'}
        </button>
        <button
          id="data-signing-password-cancel-btn"
          class="data-signing-cancel-button"
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
  },

  /**
   * Show modal with challenge data
   * @param {number} challengeMode - Challenge mode from getPassword event
   * @param {number} attemptsLeft - Number of attempts remaining
   * @param {Object} context - Optional context information
   */
  show(challengeMode, attemptsLeft, context = {}) {
    console.log('PasswordChallengeModal - Showing modal:', JSON.stringify({
      challengeMode,
      attemptsLeft,
      hasContext: !!context.payload
    }, null, 2));

    // Update state
    this.challengeMode = challengeMode;
    this.attemptsLeft = attemptsLeft;
    this.password = '';
    this.isSubmitting = false;
    this.errorMessage = '';
    this.context = context;

    // Show modal overlay
    const modal = document.getElementById('data-signing-password-modal');
    if (modal) {
      modal.style.display = 'flex';
    }

    // Render modal content
    this.render();

    // Focus password input after a short delay
    setTimeout(() => {
      const passwordInput = document.getElementById('data-signing-password-input');
      if (passwordInput) {
        passwordInput.focus();
      }
    }, 100);
  },

  /**
   * Update modal state without hiding/showing
   * Used when SDK re-triggers getPassword with updated attemptsLeft or error
   *
   * @param {Object} updates - State updates
   */
  update(updates) {
    console.log('PasswordChallengeModal - Updating modal state:', JSON.stringify(updates, null, 2));

    if (updates.attemptsLeft !== undefined) {
      this.attemptsLeft = updates.attemptsLeft;
    }

    if (updates.errorMessage !== undefined) {
      this.errorMessage = updates.errorMessage;
    }

    if (updates.isSubmitting !== undefined) {
      this.isSubmitting = updates.isSubmitting;
    }

    // Re-render modal content with updated state
    this.render();

    // Clear and refocus password input
    setTimeout(() => {
      const passwordInput = document.getElementById('data-signing-password-input');
      if (passwordInput && !this.isSubmitting) {
        passwordInput.value = '';
        passwordInput.focus();
      }
    }, 50);
  },

  /**
   * Hide modal
   */
  hide() {
    console.log('PasswordChallengeModal - Hiding modal');

    const modal = document.getElementById('data-signing-password-modal');
    if (modal) {
      modal.style.display = 'none';
    }

    // Clear state
    this.password = '';
    this.errorMessage = '';
    this.context = {
      payload: '',
      authLevel: '',
      authenticatorType: '',
      reason: ''
    };
  },

  /**
   * Handle submit button
   */
  async handleSubmit() {
    console.log('PasswordChallengeModal - Submit button clicked');

    // Get current password value
    const passwordInput = document.getElementById('data-signing-password-input');
    if (passwordInput) {
      this.password = passwordInput.value;
    }

    // Validate
    const validation = DataSigningService.validatePassword(this.password);
    if (!validation.isValid) {
      this.errorMessage = validation.error;
      this.render();
      return;
    }

    // Clear any previous error
    this.errorMessage = '';

    // Set loading state
    this.isSubmitting = true;
    this.render();

    try {
      console.log('PasswordChallengeModal - Submitting password');

      // Use DataSigningSetupAuthManager if challengeMode is 12
      if (this.challengeMode === 12) {
        await DataSigningSetupAuthManager.handlePasswordSubmit(this.password);
      } else {
        // Fallback to DataSigningService for other challenge modes
        await DataSigningService.submitPassword(this.password, this.challengeMode);
      }

      console.log('PasswordChallengeModal - Password submitted successfully');

      // Note: Modal will be hidden by InputScreen when signing completes
      // or re-shown with updated attempts if password was wrong

    } catch (error) {
      console.error('PasswordChallengeModal - Submit error:', error);
      this.isSubmitting = false;

      const errorMessage = error?.error?.errorString || 'Failed to authenticate. Please try again.';
      this.errorMessage = errorMessage;
      this.render();
    }
  },

  /**
   * Handle cancel button
   */
  async handleCancel() {
    console.log('PasswordChallengeModal - Cancel button clicked');

    if (this.isSubmitting) {
      console.log('PasswordChallengeModal - Cannot cancel while submitting');
      return;
    }

    // Use DataSigningSetupAuthManager if challengeMode is 12
    if (this.challengeMode === 12) {
      await DataSigningSetupAuthManager.handleCancel();
    } else {
      // Fallback to manual cleanup for other challenge modes
      try {
        await DataSigningService.resetState();
      } catch (error) {
        console.error('PasswordChallengeModal - Reset state failed:', error);
      }

      // Hide modal
      this.hide();

      // Navigate back to input screen
      NavigationService.navigate('DataSigningInput');
    }
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.PasswordChallengeModal = PasswordChallengeModal;
}
