/**
 * Update Password Screen (Password Update Credentials Flow)
 *
 * This screen handles user-initiated password updates via credential update flow.
 * It handles challengeMode = 2 (RDNA_OP_UPDATE_CREDENTIALS) where users can update
 * their password by providing current and new passwords.
 *
 * Key Features:
 * - Current password, new password, and confirm password inputs with validation
 * - Password policy parsing and validation
 * - Real-time error handling and loading states
 * - Attempts left counter display
 * - Success/error feedback
 * - Screen-level event handler for onUpdateCredentialResponse
 * - Auto-clear fields on screen focus for security
 *
 * Usage:
 * NavigationService.navigate('UpdatePassword', {
 *   eventData: data,
 *   responseData: data,
 *   title: 'Update Password',
 *   subtitle: 'Update your account password'
 * });
 */

const UpdatePasswordScreen = {
  // State variables
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  error: '',
  isSubmitting: false,
  challengeMode: 2,
  userName: '',
  passwordPolicyMessage: '',
  attemptsLeft: 3,
  _updateCredentialHandler: null,

  /**
   * Called when screen content is loaded into #app-content
   * Replaces React's componentDidMount / useEffect + useFocusEffect
   *
   * @param {Object} params - Navigation parameters
   */
  onContentLoaded(params) {
    console.log('UpdatePasswordScreen - Content loaded, params:', JSON.stringify(params, null, 2));

    // Store user params for navigation back to Dashboard
    this.userParams = params || {};

    // Set up screen-level event handler for onUpdateCredentialResponse
    this.setupEventHandler();

    // Setup UI event listeners
    this.setupEventListeners();

    // Setup password visibility toggles
    this.setupPasswordToggles();

    // Setup close button
    this.setupCloseButton();

    // Initialize screen data from params (will handle field clearing based on status)
    this.initializeData(params);
  },

  /**
   * Set up screen-level event handler for onUpdateCredentialResponse
   * This handler is specific to this screen and is cleaned up when screen is unloaded
   */
  setupEventHandler() {
    const eventManager = rdnaService.getEventManager();

    // Create bound handler function
    this._updateCredentialHandler = (data) => {
      console.log('UpdatePasswordScreen - Update credential response received:', JSON.stringify({
        userID: data.userID,
        credType: data.credType,
        statusCode: data.status.statusCode,
        statusMessage: data.status.statusMessage
      }, null, 2));

      this.isSubmitting = false;
      this.updateSubmitButton();

       const errorCode = data.error.longErrorCode;
      const errorString = data.error.errorString;
      const statusCode = data.status.statusCode;
      const statusMessage = data.status.statusMessage;


      if(errorCode != 0){
        this.showErrorDialog('Update Failed', errorString, () => {
          console.log('UpdatePasswordScreen - Critical error:'+errorCode);
          NavigationService.navigate('Dashboard', this.userParams);
        });
        return;
      }

      if (statusCode === 100 || statusCode === 0) {
        // Success case - password updated successfully
        this.showSuccessDialog(statusMessage || 'Password updated successfully');
      } else if (statusCode === 110 || statusCode === 153) {
        // Critical error cases that trigger logout
        // statusCode 110: Password has expired
        // statusCode 153: Attempts exhausted, user/device blocked
        

        // Clear all password fields
        this.clearFields();
        this.error = statusMessage || 'Update failed';
        this.updateErrorDisplay();

        this.showErrorDialog('Update Failed', statusMessage, () => {
          // User will be logged off automatically by SDK
          // getUser event will be triggered and handled
          console.log('UpdatePasswordScreen - Critical error, waiting for onUserLoggedOff and getUser events');
        });
      } else {
        // Other status cases
        // statusCode 190: Password does not meet policy standards
        this.clearFields();
        this.error = statusMessage || 'Failed to update password';
        this.updateErrorDisplay();
        console.error('UpdatePasswordScreen - Update credential statusMessage:', statusMessage);
        this.showErrorDialog('Update Failed', statusMessage, () => {
          NavigationService.navigate('Dashboard', this.userParams);
        });
        
      }
    };

    // Register the handler
    eventManager.setUpdateCredentialResponseHandler(this._updateCredentialHandler);
    console.log('UpdatePasswordScreen - Screen-level event handler registered');
  },

  /**
   * Clean up event handler when screen is unloaded
   */
  onContentUnloaded() {
    console.log('UpdatePasswordScreen - Content unloaded, cleaning up event handler');
    const eventManager = rdnaService.getEventManager();
    eventManager.setUpdateCredentialResponseHandler(undefined);
    this._updateCredentialHandler = null;
  },

  /**
   * Attach event listeners to DOM elements
   */
  setupEventListeners() {
    const submitButton = document.getElementById('update-password-submit-btn');
    if (submitButton) {
      submitButton.onclick = this.handleSubmit.bind(this);
    }

    // Enter key handlers for password fields
    const currentPasswordInput = document.getElementById('current-password-input');
    const newPasswordInput = document.getElementById('new-password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');

    if (currentPasswordInput) {
      currentPasswordInput.oninput = () => {
        this.currentPassword = currentPasswordInput.value;
        // Clear field-specific error when user types
        const errorElement = document.getElementById('update-password-current-error');
        if (errorElement) errorElement.style.display = 'none';
      };
      currentPasswordInput.onkeypress = (e) => {
        if (e.key === 'Enter') newPasswordInput?.focus();
      };
    }

    if (newPasswordInput) {
      newPasswordInput.oninput = () => {
        this.newPassword = newPasswordInput.value;
        // Clear field-specific error when user types
        const errorElement = document.getElementById('update-password-new-error');
        if (errorElement) errorElement.style.display = 'none';
      };
      newPasswordInput.onkeypress = (e) => {
        if (e.key === 'Enter') confirmPasswordInput?.focus();
      };
    }

    if (confirmPasswordInput) {
      confirmPasswordInput.oninput = () => {
        this.confirmPassword = confirmPasswordInput.value;
        // Clear field-specific error when user types
        const errorElement = document.getElementById('update-password-confirm-error');
        if (errorElement) errorElement.style.display = 'none';
      };
      confirmPasswordInput.onkeypress = (e) => {
        if (e.key === 'Enter') this.handleSubmit();
      };
    }
  },

  /**
   * Setup password visibility toggles
   */
  setupPasswordToggles() {
    const toggleButtons = [
      { btnId: 'toggle-current-password-btn', inputId: 'current-password-input' },
      { btnId: 'toggle-new-password-btn', inputId: 'new-password-input' },
      { btnId: 'toggle-confirm-password-btn', inputId: 'confirm-password-input' }
    ];

    toggleButtons.forEach(({ btnId, inputId }) => {
      const btn = document.getElementById(btnId);
      const input = document.getElementById(inputId);

      if (btn && input) {
        btn.onclick = () => {
          if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = '🙈';
          } else {
            input.type = 'password';
            btn.textContent = '👁';
          }
        };
      }
    });
  },

  /**
   * Setup close button to navigate to dashboard
   */
  setupCloseButton() {
    const closeBtn = document.getElementById('update-password-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        NavigationService.navigate('Dashboard', this.userParams);
      };
    }
  },

  /**
   * Initialize screen data from navigation params
   */
  initializeData(params) {
    const responseData = params?.responseData;
    if (!responseData) {
      console.warn('UpdatePasswordScreen - No response data provided');
      return;
    }

    console.log('UpdatePasswordScreen - Processing response data');

    // Extract challenge data
    this.userName = responseData.userID || '';
    this.challengeMode = responseData.challengeMode || 2;
    this.attemptsLeft = responseData.attemptsLeft || 3;

    // Update UI with user info
    const userNameEl = document.getElementById('update-password-username');
    if (userNameEl) {
      userNameEl.textContent = this.userName;
    }

    // Update attempts display
    this.updateAttemptsDisplay();

    // Extract and process password policy
    const policyJsonString = this.getChallengeValue(responseData, 'RELID_PASSWORD_POLICY');
    if (policyJsonString) {
      this.passwordPolicyMessage = parseAndGeneratePolicyMessage(policyJsonString);
      console.log('UpdatePasswordScreen - Password policy extracted:', this.passwordPolicyMessage);
      this.updatePolicyDisplay();
    }

    console.log('UpdatePasswordScreen - Processed password data:', JSON.stringify({
      userID: responseData.userID,
      challengeMode: responseData.challengeMode,
      attemptsLeft: responseData.attemptsLeft,
      passwordPolicy: policyJsonString ? 'Found' : 'Not found'
    }, null, 2));

    // Check for API errors (error.longErrorCode !== 0)
    if (responseData.error && responseData.error.longErrorCode !== 0) {
      const errorMessage = responseData.error.errorString || 'An error occurred';
      console.log('UpdatePasswordScreen - API error:', errorMessage);
      this.error = errorMessage;
      this.updateErrorDisplay();
      // Clear all password fields on error
      this.clearFields();
      // Reset submitting state
      this.isSubmitting = false;
      this.updateSubmitButton();
      return;
    }

    // Check for status errors (statusCode !== 100)
    const statusCode = responseData.challengeResponse?.status?.statusCode;
    const statusMessage = responseData.challengeResponse?.status?.statusMessage;

    if (statusCode && statusCode !== 100 && statusCode !== 0) {
      console.log('UpdatePasswordScreen - Status error:', statusCode, statusMessage);
      this.error = statusMessage || 'An error occurred';
      this.updateErrorDisplay();
      // Clear all password fields on error
      this.clearFields();
      // Reset submitting state
      this.isSubmitting = false;
      this.updateSubmitButton();
      return;
    }

    // Success case - ready for input
    this.isSubmitting = false;
    this.updateSubmitButton();

    // Clear all password fields and error (security best practice - always start with empty fields)
    this.clearFieldsAndError();

    // Focus on first input
    const currentPasswordInput = document.getElementById('current-password-input');
    if (currentPasswordInput) {
      setTimeout(() => currentPasswordInput.focus(), 100);
    }
  },

  /**
   * Extract challenge value from response data
   * Helper method to get specific challenge values
   */
  getChallengeValue(responseData, key) {
    // Try challengeInfo first (Cordova structure)
    if (responseData.challengeResponse?.challengeInfo) {
      const challenges = responseData.challengeResponse.challengeInfo;
      for (let challenge of challenges) {
        if (challenge.key === key) {
          return challenge.value;
        }
      }
    }

    // Fallback to challenge (if structure differs)
    if (responseData.challengeResponse?.challenge) {
      const challenges = responseData.challengeResponse.challenge;
      for (let challenge of challenges) {
        if (challenge.Key === key || challenge.key === key) {
          return challenge.Value || challenge.value;
        }
      }
    }

    return null;
  },

  /**
   * Handle form submission with field-specific validation
   */
  async handleSubmit() {
    if (this.isSubmitting) {
      console.log('UpdatePasswordScreen - Already submitting, ignoring');
      return;
    }

    // Clear all previous errors
    this.clearAllErrors();

    // Validate current password
    if (!this.currentPassword) {
      this.showFieldError('current', 'Current password is required');
      return;
    }

    // Validate new password
    if (!this.newPassword) {
      this.showFieldError('new', 'New password is required');
      return;
    }

    // Validate confirm password
    if (!this.confirmPassword) {
      this.showFieldError('confirm', 'Please confirm your new password');
      return;
    }

    // Validate password match
    if (this.newPassword !== this.confirmPassword) {
      this.showFieldError('confirm', 'New password and confirm password do not match');
      return;
    }

    // Validate password is different
    if (this.currentPassword === this.newPassword) {
      this.showFieldError('new', 'New password must be different from current password');
      return;
    }

    // Start submission
    this.isSubmitting = true;
    this.updateSubmitButton();

    try {
      console.log('UpdatePasswordScreen - Calling updatePassword API with challengeMode 2');
      await rdnaService.updatePassword(this.currentPassword, this.newPassword, 2);
      console.log('UpdatePasswordScreen - updatePassword sync response success, waiting for onUpdateCredentialResponse event');
    } catch (error) {
      console.error('UpdatePasswordScreen - updatePassword sync error:', error);
      this.isSubmitting = false;
      this.updateSubmitButton();

      // Clear password fields on error
      this.clearFields();

      // Show error in status banner
      this.error = error.error?.errorString || 'Failed to update password';
      this.updateErrorDisplay();
    }
  },

  /**
   * Clear all password input fields (preserves error state)
   */
  clearFields() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';

    const currentPasswordInput = document.getElementById('current-password-input');
    const newPasswordInput = document.getElementById('new-password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');

    if (currentPasswordInput) currentPasswordInput.value = '';
    if (newPasswordInput) newPasswordInput.value = '';
    if (confirmPasswordInput) confirmPasswordInput.value = '';
  },

  /**
   * Clear all fields including error state
   */
  clearFieldsAndError() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.error = '';

    const currentPasswordInput = document.getElementById('current-password-input');
    const newPasswordInput = document.getElementById('new-password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');

    if (currentPasswordInput) currentPasswordInput.value = '';
    if (newPasswordInput) newPasswordInput.value = '';
    if (confirmPasswordInput) confirmPasswordInput.value = '';

    this.updateErrorDisplay();
  },

  /**
   * Update error display in UI (status banner for general errors)
   */
  updateErrorDisplay() {
    const statusBanner = document.getElementById('update-password-status-banner');
    if (statusBanner) {
      if (this.error) {
        statusBanner.textContent = this.error;
        statusBanner.className = 'status-banner status-error';
        statusBanner.style.display = 'block';
      } else {
        statusBanner.textContent = '';
        statusBanner.style.display = 'none';
      }
    }
  },

  /**
   * Show field-specific error message
   * @param {string} field - 'current', 'new', or 'confirm'
   * @param {string} message - Error message to display
   */
  showFieldError(field, message) {
    const errorId = `update-password-${field}-error`;
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  },

  /**
   * Clear all field-specific errors
   */
  clearAllErrors() {
    this.error = '';
    this.updateErrorDisplay();

    const errorFields = ['current', 'new', 'confirm'];
    errorFields.forEach(field => {
      const errorId = `update-password-${field}-error`;
      const errorElement = document.getElementById(errorId);
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    });
  },

  /**
   * Update submit button state
   */
  updateSubmitButton() {
    const submitButton = document.getElementById('update-password-submit-btn');
    const buttonText = document.getElementById('update-password-btn-text');
    const buttonLoader = document.getElementById('update-password-btn-loader');

    if (submitButton) {
      if (this.isSubmitting) {
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        if (buttonText) buttonText.style.display = 'none';
        if (buttonLoader) buttonLoader.style.display = 'inline-block';
      } else {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        if (buttonText) buttonText.style.display = 'inline';
        if (buttonLoader) buttonLoader.style.display = 'none';
      }
    }
  },

  /**
   * Update attempts counter display (matches expiry screen style)
   */
  updateAttemptsDisplay() {
    const attemptsElement = document.getElementById('update-password-attempts-left');
    if (attemptsElement) {
      attemptsElement.textContent = this.attemptsLeft;
    }
  },

  /**
   * Update password policy display
   */
  updatePolicyDisplay() {
    const policyContainer = document.getElementById('update-password-policy-container');
    const policyText = document.getElementById('update-password-policy-text');

    if (policyContainer && policyText && this.passwordPolicyMessage) {
      policyText.textContent = this.passwordPolicyMessage;
      policyContainer.style.display = 'block';
    }
  },

  /**
   * Show success dialog
   */
  showSuccessDialog(message) {
    if (confirm(`Success: ${message}\n\nClick OK to return to dashboard`)) {
      NavigationService.navigate('Dashboard', this.userParams);
    }
  },

  /**
   * Show error dialog
   */
  showErrorDialog(title, message, callback) {
    alert(`${title}: ${message}`);
    if (callback) callback();
  }
};

// Expose to global scope for NavigationService
window.UpdatePasswordScreen = UpdatePasswordScreen;
