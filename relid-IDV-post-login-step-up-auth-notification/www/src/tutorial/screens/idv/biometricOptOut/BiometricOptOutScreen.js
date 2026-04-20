/**
 * Biometric Opt-Out Screen
 *
 * Allows users to delete their biometric template from the server.
 * This is the Cordova equivalent of React Native's BiometricOptOutScreen.
 *
 * Flow (Workflow 11, Challenge Mode 7):
 * 1. Screen loads → checks if template exists
 * 2. If doesn't exist (status 600): Show message, disable button
 * 3. If exists (status 100): Enable opt-out button
 * 4. User taps "Start Opt-Out" → initiateIDVBiometricOptOut() called
 * 5. SDK authenticates user (LDA first, password fallback if needed)
 * 6. If password needed: Show PasswordValidationDialog (challengeMode 7)
 * 7. SDK sends template deletion request to server
 * 8. SDK fires onIDVBiometricOptOutStatus with final result
 * 9. Screen shows success/failure modal
 *
 * Key Differences from Opt-In:
 * - No selfie capture (simpler flow)
 * - Button enabled when template EXISTS (opposite of opt-in)
 * - Challenge mode 7 instead of 6
 * - Direct deletion after authentication
 *
 * Key Features:
 * - LDA fallback pattern with password dialog
 * - Template status checking on load
 * - Simplified flow compared to opt-in
 */

const BiometricOptOutScreen = {
  // Screen state
  state: {
    isCheckingStatus: true, // Loading state for template status check
    templateStatus: {
      exists: false,
      statusCode: null,
      statusMessage: ''
    },
    isOptingOut: false,
    showPasswordDialog: false,
    passwordAttempts: 3,
    passwordError: '',
    currentChallengeMode: null
  },

  // Stored original handler (for chaining)
  originalGetPasswordHandler: null,

  /**
   * Called when screen content is loaded into #app-content
   * This is the ONLY entry point for screen initialization
   *
   * @param {Object} params - Navigation parameters (if any)
   * @param {Object} params.optOutResult - Opt-out completion result (if returning from workflow)
   */
  onContentLoaded(params) {
    console.log('BiometricOptOutScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Reset state
    this.state = {
      isCheckingStatus: true, // Start with loading state
      templateStatus: {
        exists: false,
        statusCode: null,
        statusMessage: ''
      },
      isOptingOut: false,
      showPasswordDialog: false,
      passwordAttempts: 3,
      passwordError: '',
      currentChallengeMode: null,
      optOutResult: params.optOutResult || null
    };

    // Setup event listeners
    this.setupEventListeners();

    // Register IDV event handlers
    this.registerIDVEventHandlers();

    // If returning with opt-out result, display it
    if (this.state.optOutResult) {
      this.displayOptOutResult(this.state.optOutResult);
    } else {
      // Check template status only if not returning with result
      this.checkTemplateStatus();
    }
  },

  /**
   * Setup event listeners for UI interactions
   */
  setupEventListeners() {
    // Menu button
    const menuButton = document.getElementById('optout-menu-btn');
    if (menuButton) {
      menuButton.onclick = () => {
        console.log('BiometricOptOutScreen - Menu button clicked, opening drawer');
        NavigationService.openDrawer();
      };
    }

    // Start Opt-Out button
    const startButton = document.getElementById('optout-start-btn');
    if (startButton) {
      startButton.onclick = () => this.handleStartOptOut();
    }
  },

  /**
   * Register IDV event handlers with chaining
   */
  registerIDVEventHandlers() {
    const eventManager = rdnaIDVService.getEventManager();

    // Template status handler
    eventManager.setCheckUserBiometricTemplateStatusHandler(
      this.handleCheckUserBiometricTemplateStatusResponse.bind(this)
    );

    // Opt-out status handler
    eventManager.setBiometricOptOutStatusHandler(
      this.handleBiometricOptOutStatusResponse.bind(this)
    );

    // Store original getPassword handler and wrap it (for chaining)
    const rdnaEventManager = rdnaService.getEventManager();
    this.originalGetPasswordHandler = rdnaEventManager.getPasswordHandler;

    rdnaEventManager.setGetPasswordHandler(
      this.handleGetPassword.bind(this)
    );
  },

  /**
   * Cleanup event handlers when navigating away
   */
  cleanup() {
    console.log('BiometricOptOutScreen - Cleaning up event handlers');

    const eventManager = rdnaIDVService.getEventManager();

    // Clear IDV event handlers
    eventManager.setCheckUserBiometricTemplateStatusHandler(null);
    eventManager.setBiometricOptOutStatusHandler(null);

    // Restore original getPassword handler
    const rdnaEventManager = rdnaService.getEventManager();
    rdnaEventManager.setGetPasswordHandler(this.originalGetPasswordHandler);

    // Hide password dialog if visible
    if (this.state.showPasswordDialog) {
      PasswordValidationDialog.hide();
    }
  },

  /**
   * Check biometric template status on server
   */
  async checkTemplateStatus() {
    console.log('BiometricOptOutScreen - Checking template status');

    this.state.isCheckingStatus = true;
    this.updateUI();

    try {
      await rdnaIDVService.checkIDVUserBiometricTemplateStatus();
      console.log('BiometricOptOutScreen - Template status check initiated');
    } catch (error) {
      console.error('BiometricOptOutScreen - Template status check failed:', JSON.stringify(error, null, 2));
      this.state.isCheckingStatus = false;
      this.showError('Failed to check template status: ' + (error.error?.errorString || 'Unknown error'));
      this.updateUI();
    }
  },

  /**
   * Handle template status response
   */
  handleCheckUserBiometricTemplateStatusResponse(data) {
    console.log('BiometricOptOutScreen - Template status response:', JSON.stringify(data, null, 2));

    // Clear loading state
    this.state.isCheckingStatus = false;

    const errorCode = data.error?.longErrorCode;
    const errorString = data.error?.errorString || 'Unknown error';

    if (errorCode !== 0) {
      console.error('BiometricOptOutScreen - Template status error:', errorString);
      this.state.templateStatus = {
        exists: false,
        statusCode: null,
        statusMessage: errorString
      };
      this.showError('Error checking template status: ' + errorString);
      this.updateUI();
      return;
    }

    // Parse idvResponse to get status
    let statusCode = null;
    let statusMessage = '';

    if (data.idvResponse) {
      try {
        const idvData = JSON.parse(data.idvResponse);
        statusCode = idvData.status_code;
        statusMessage = idvData.status_message || '';

        console.log('BiometricOptOutScreen - Status code:', statusCode);
        console.log('BiometricOptOutScreen - Status message:', statusMessage);
      } catch (parseError) {
        console.error('BiometricOptOutScreen - Failed to parse idvResponse:', parseError);
      }
    }

    if (statusCode === 100) {
      // Template exists - user can opt out
      this.state.templateStatus = {
        exists: true,
        statusCode,
        statusMessage: statusMessage || 'Biometric template exists. You can delete it.'
      };
    } else if (statusCode === 600) {
      // Template doesn't exist - user cannot opt out
      this.state.templateStatus = {
        exists: false,
        statusCode,
        statusMessage: statusMessage || 'No biometric template found. Nothing to delete.'
      };
    } else {
      // Other status code
      this.state.templateStatus = {
        exists: false,
        statusCode,
        statusMessage: statusMessage || 'Unknown template status'
      };
    }

    this.updateUI();
  },

  /**
   * Handle getPassword event (challengeMode 7 for opt-out)
   * This wraps the original handler to enable chaining
   */
  handleGetPassword(data) {
    console.log('BiometricOptOutScreen - getPassword event:', JSON.stringify(data, null, 2));

    // Only handle challengeMode 7 (biometric opt-out)
    if (data.challengeMode !== 7) {
      console.log('BiometricOptOutScreen - Not challengeMode 7, passing to original handler');
      if (this.originalGetPasswordHandler) {
        this.originalGetPasswordHandler(data);
      }
      return;
    }

    // Check for errors in the getPassword event data
    const errorCode = data.error?.longErrorCode || data.error?.shortErrorCode;
    const errorString = data.error?.errorString;

    let statusCode = null;
    let statusMessage = '';

    // Check challengeResponse.status (this is where status info is nested)
    if (data.challengeResponse?.status) {
      statusCode = data.challengeResponse.status.statusCode;
      statusMessage = data.challengeResponse.status.statusMessage || '';
    }

    // Determine if there's an error to display
    let initialError = '';

    if (errorCode && errorCode !== 0) {
      // SDK error (errorCode != 0)
      initialError = errorString || 'Authentication error';
    } else if (statusCode && statusCode !== 100 && statusCode !== 0) {
      // Backend status error (statusCode != 100 and != 0)
      initialError = statusMessage || 'Authentication error';
    }

    console.log('BiometricOptOutScreen - getPassword validation:', JSON.stringify({
      errorCode,
      errorString,
      statusCode,
      statusMessage,
      initialError
    }, null, 2));

    // Handle password dialog for opt-out
    console.log('BiometricOptOutScreen - Showing password dialog for opt-out');

    this.state.currentChallengeMode = data.challengeMode;
    this.state.passwordAttempts = data.attemptsLeft || 3;
    this.state.passwordError = initialError;
    this.state.showPasswordDialog = true;

    PasswordValidationDialog.show({
      title: 'Password Required',
      message: 'Enter your password to continue with biometric opt-out',
      attemptsLeft: this.state.passwordAttempts,
      errorMessage: this.state.passwordError,
      onSubmit: (password) => this.handlePasswordSubmit(password),
      onCancel: () => this.handlePasswordCancel()
    });
  },

  /**
   * Handle password submission
   */
  async handlePasswordSubmit(password) {
    console.log('BiometricOptOutScreen - Password submitted');

    try {
      const result = await rdnaService.setPassword(password, this.state.currentChallengeMode);
      console.log('BiometricOptOutScreen - Password submitted successfully:', JSON.stringify(result, null, 2));

      // Keep dialog visible with loading state - it will be hidden by status event
    } catch (error) {
      console.error('BiometricOptOutScreen - Password submission failed:', JSON.stringify(error, null, 2));

      // Extract error information
      const errorCode = error.error?.longErrorCode || error.error?.shortErrorCode;
      const errorString = error.error?.errorString;

      // Determine error message to display
      let displayError = '';

      if (errorCode && errorCode !== 0) {
        // SDK error (errorCode != 0)
        displayError = errorString || 'Password verification failed';
      }

      console.log('BiometricOptOutScreen - Password error details:', JSON.stringify({
        errorCode,
        errorString,
        displayError
      }, null, 2));

      this.state.passwordError = displayError;

      PasswordValidationDialog.update({
        errorMessage: this.state.passwordError
      });
    }
  },

  /**
   * Handle password dialog cancel
   */
  handlePasswordCancel() {
    console.log('BiometricOptOutScreen - Password cancelled');

    this.state.showPasswordDialog = false;
    this.state.isOptingOut = false;
    this.updateUI();
  },

  /**
   * Handle biometric opt-out status response
   */
  /**
   * Handle biometric opt-out status response event
   *
   * This event is fired when the opt-out workflow completes (success or failure).
   * Navigate back to BiometricOptOut screen with the result to ensure the modal
   * is displayed on the correct screen (not underneath other screens).
   *
   * @param {Object} data - Opt-out status event data
   */
  handleBiometricOptOutStatusResponse(data) {
    console.log('BiometricOptOutScreen - Opt-out status response:', JSON.stringify(data, null, 2));

    // Hide password dialog immediately if visible (before navigation)
    if (this.state.showPasswordDialog) {
      console.log('BiometricOptOutScreen - Hiding password dialog before navigation');
      PasswordValidationDialog.hide();
      this.state.showPasswordDialog = false;
    }

    // Navigate back to this screen with the result
    // This will trigger onContentLoaded with optOutResult in params
    console.log('BiometricOptOutScreen - Final opt-out result received, navigating back to screen');
    NavigationService.navigate('BiometricOptOut', {
      optOutResult: data
    });
  },

  /**
   * Display opt-out result (success or error) with modal dialog
   *
   * Shows a confirm/alert dialog after navigating back to this screen.
   * 300ms delay ensures navigation completes before showing modal.
   *
   * @param {Object} data - Opt-out result data from event
   */
  displayOptOutResult(data) {
    console.log('BiometricOptOutScreen - Displaying opt-out result');

    // Hide password dialog if visible
    if (this.state.showPasswordDialog) {
      PasswordValidationDialog.hide();
      this.state.showPasswordDialog = false;
    }

    this.state.isOptingOut = false;

    const errorCode = data.error?.longErrorCode;
    const errorString = data.error?.errorString || 'Unknown error';

    // Parse idvResponse to get status
    let statusCode = null;
    let statusMessage = '';

    if (data.idvResponse) {
      try {
        const idvData = JSON.parse(data.idvResponse);
        statusCode = idvData.status_code;
        statusMessage = idvData.status_message || '';

        console.log('BiometricOptOutScreen - Opt-out status code:', statusCode);
        console.log('BiometricOptOutScreen - Opt-out status message:', statusMessage);
      } catch (parseError) {
        console.error('BiometricOptOutScreen - Failed to parse idvResponse:', parseError);
      }
    }

    console.log('BiometricOptOutScreen - Response validation:', JSON.stringify({
      errorCode,
      errorString,
      statusCode,
      statusMessage
    }, null, 2));

    // Small delay to ensure navigation completes before showing modal
    setTimeout(() => {
      // Check for sync error first
      if (errorCode !== 0) {
        console.error('BiometricOptOutScreen - Opt-out error:', errorString);
        alert(
          'Opt-Out Failed\n\n' +
          `${errorString} (${errorCode})\n\n` +
          'Click OK to continue.'
        );
      } else if (statusCode === 100) {
        // Success
        console.log('BiometricOptOutScreen - Opt-out completed successfully');
        alert(
          'Opt-Out Successful\n\n' +
          `${statusMessage || 'Biometric template deleted successfully'}\n\n` +
          'Click OK to continue.'
        );
      } else {
        // Backend error
        console.error('BiometricOptOutScreen - Opt-out backend error:', statusCode);
        alert(
          'Opt-Out Failed\n\n' +
          `${statusMessage || 'Failed to delete biometric template'} (${statusCode})\n\n` +
          'Click OK to continue.'
        );
      }

      // Clear optOutResult from state after displaying
      this.state.optOutResult = null;

      // Recheck template status after modal dismissed
      this.checkTemplateStatus();
      this.updateUI();
    }, 300);
  },

  /**
   * Handle start opt-out button click
   */
  async handleStartOptOut() {
    if (this.state.isOptingOut) {
      console.log('BiometricOptOutScreen - Already opting out, ignoring');
      return;
    }

    console.log('BiometricOptOutScreen - Starting opt-out');

    this.state.isOptingOut = true;
    this.updateUI();

    try {
      await rdnaIDVService.initiateIDVBiometricOptOut();
      console.log('BiometricOptOutScreen - Opt-out initiated');
      // Flow continues via events (getPassword or status)
    } catch (error) {
      console.error('BiometricOptOutScreen - Opt-out initiation failed:', JSON.stringify(error, null, 2));
      this.showError('Failed to start opt-out: ' + (error.error?.errorString || 'Unknown error'));
      this.state.isOptingOut = false;
      this.updateUI();
    }
  },

  /**
   * Update UI based on current state
   */
  updateUI() {
    // Update status message
    const statusMessageElement = document.getElementById('optout-status-message');
    if (statusMessageElement) {
      if (this.state.isCheckingStatus) {
        // Show checking status message
        statusMessageElement.innerHTML = `<p style="color: #3b82f6;">⏳ Checking template status...</p>`;
        statusMessageElement.style.display = 'block';
      } else if (this.state.templateStatus.statusCode !== null) {
        // Show template status
        const color = this.state.templateStatus.exists ? '#10b981' : '#f59e0b';
        statusMessageElement.innerHTML = `<p style="color: ${color};">${this.escapeHtml(this.state.templateStatus.statusMessage)}</p>`;
        statusMessageElement.style.display = 'block';
      } else {
        statusMessageElement.style.display = 'none';
      }
    }

    // Update start button
    const startButton = document.getElementById('optout-start-btn');
    if (startButton) {
      // Disable button if:
      // 1. Still checking status
      // 2. Template doesn't exist (nothing to delete)
      // 3. Currently opting out
      const isDisabled = this.state.isCheckingStatus ||
                         !this.state.templateStatus.exists ||
                         this.state.isOptingOut;

      startButton.disabled = isDisabled;

      // Update button text based on state
      if (this.state.isCheckingStatus) {
        startButton.textContent = 'Checking Status...';
      } else if (this.state.isOptingOut) {
        startButton.textContent = 'Processing...';
      } else {
        startButton.textContent = 'Start Opt-Out';
      }
    }
  },

  /**
   * Show error message
   */
  showError(message) {
    const statusMessageElement = document.getElementById('optout-status-message');
    if (statusMessageElement) {
      statusMessageElement.innerHTML = `<p style="color: #dc2626;">${this.escapeHtml(message)}</p>`;
      statusMessageElement.style.display = 'block';
    }
  },

  /**
   * Escape HTML to prevent XSS
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

// Expose to global window object for NavigationService
window.BiometricOptOutScreen = BiometricOptOutScreen;
