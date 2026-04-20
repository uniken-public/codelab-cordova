/**
 * Biometric Opt-In Screen
 *
 * Allows users to create a biometric template on the server for future authentication.
 * This is the Cordova equivalent of React Native's BiometricOptInScreen.
 *
 * Flow (Workflow 10, Challenge Mode 6):
 * 1. Screen loads → checks if template already exists
 * 2. If exists (status 100): Show message, disable button
 * 3. If doesn't exist (status 600): Enable opt-in button
 * 4. User taps "Start Opt-In" → initiateIDVBiometricOptIn() called
 * 5. SDK authenticates user (LDA first, password fallback if needed)
 * 6. If password needed: Show PasswordValidationDialog (challengeMode 6)
 * 7. SDK captures live selfie with liveness detection
 * 8. SDK fires onIDVOptInCapturedFrameConfirmation with base64 image
 * 9. Screen shows modal with image and action buttons (Approve/Recapture/Cancel)
 * 10. User selects action → setIDVBiometricOptInConfirmation() called
 * 11. If Recapture: SDK captures new selfie, repeats from step 8
 * 12. If Approve: SDK sends template to server
 * 13. SDK fires onIDVBiometricOptInStatus with final result
 * 14. Screen shows success/failure modal
 *
 * Key Features:
 * - LDA fallback pattern with password dialog
 * - Template status checking on load
 * - Captured frame modal with image preview
 * - Recapture support (modal stays open)
 * - Flow state management to prevent duplicate API calls
 * - Event handler chaining for getPassword and getSelfieProcessStartConfirmation
 */

const BiometricOptInScreen = {
  // Screen state
  state: {
    isCheckingStatus: true, // Loading state for template status check
    templateStatus: {
      exists: false,
      statusCode: null,
      statusMessage: ''
    },
    isOptingIn: false,
    isOptInFlowActive: false, // Prevents duplicate status checks during flow
    capturedImageModal: {
      visible: false,
      imageData: ''
    },
    showPasswordDialog: false,
    passwordAttempts: 3,
    passwordError: '',
    currentChallengeMode: null
  },

  // Stored original handlers (for chaining)
  originalGetPasswordHandler: null,
  originalGetSelfieProcessStartConfirmationHandler: null,

  /**
   * Called when screen content is loaded into #app-content
   * This is the ONLY entry point for screen initialization
   *
   * @param {Object} params - Navigation parameters (if any)
   * @param {Object} params.optInResult - Opt-in completion result (if returning from workflow)
   * @param {string} params.capturedFrame - Captured frame image data (if returning from selfie capture)
   */
  onContentLoaded(params) {
    console.log('BiometricOptInScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Reset state
    this.state = {
      isCheckingStatus: !params.optInResult && !params.capturedFrame, // Don't check status if returning with result or captured frame
      templateStatus: {
        exists: false,
        statusCode: null,
        statusMessage: ''
      },
      isOptingIn: !!params.capturedFrame, // Keep opt-in active if showing captured frame
      isOptInFlowActive: !!params.capturedFrame, // Keep flow active if showing captured frame
      capturedImageModal: {
        visible: false,
        imageData: params.capturedFrame || ''
      },
      showPasswordDialog: false,
      passwordAttempts: 3,
      passwordError: '',
      currentChallengeMode: null,
      optInResult: params.optInResult || null
    };

    // Setup event listeners
    this.setupEventListeners();

    // Register IDV event handlers
    this.registerIDVEventHandlers();

    // Hide password dialog if visible
    if (this.state.showPasswordDialog) {
      PasswordValidationDialog.hide();
      this.state.showPasswordDialog = false;
    }

    // Handle different navigation scenarios
    if (this.state.optInResult) {
      // Returning with opt-in completion result
      this.displayOptInResult(this.state.optInResult);
    } else if (params.capturedFrame) {
      // Returning with captured frame - show modal
      console.log('BiometricOptInScreen - Showing captured frame modal');
      this.showCapturedFrameModal();
    } else {
      // Normal screen load - check template status
      this.checkTemplateStatus();
    }
  },

  /**
   * Setup event listeners for UI interactions
   */
  setupEventListeners() {
    // Menu button
    const menuButton = document.getElementById('optin-menu-btn');
    if (menuButton) {
      menuButton.onclick = () => {
        console.log('BiometricOptInScreen - Menu button clicked, opening drawer');
        NavigationService.openDrawer();
      };
    }

    // Start Opt-In button
    const startButton = document.getElementById('optin-start-btn');
    if (startButton) {
      startButton.onclick = () => this.handleStartOptIn();
    }

    // Captured frame modal actions
    const approveBtn = document.getElementById('frame-approve-btn');
    if (approveBtn) {
      approveBtn.onclick = () => this.handleCapturedFrameAction(0); // APPROVE
    }

    const recaptureBtn = document.getElementById('frame-recapture-btn');
    if (recaptureBtn) {
      recaptureBtn.onclick = () => this.handleCapturedFrameAction(1); // RECAPTURE
    }

    const cancelBtn = document.getElementById('frame-cancel-btn');
    if (cancelBtn) {
      cancelBtn.onclick = () => this.handleCapturedFrameAction(2); // CANCEL
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

    // Opt-in captured frame handler
    eventManager.setOptInCapturedFrameConfirmationHandler(
      this.handleOptInCapturedFrameConfirmation.bind(this)
    );

    // Opt-in status handler
    eventManager.setBiometricOptInStatusHandler(
      this.handleBiometricOptInStatusResponse.bind(this)
    );

    // Store original getPassword handler and wrap it (for chaining)
    const rdnaEventManager = rdnaService.getEventManager();
    this.originalGetPasswordHandler = rdnaEventManager.getPasswordHandler;

    rdnaEventManager.setGetPasswordHandler(
      this.handleGetPassword.bind(this)
    );

    // Store original getSelfieProcessStartConfirmation handler and wrap it
    this.originalGetSelfieProcessStartConfirmationHandler = eventManager.getSelfieProcessStartConfirmationHandler;

    eventManager.setGetSelfieProcessStartConfirmationHandler(
      this.handleGetSelfieProcessStartConfirmation.bind(this)
    );
  },

  /**
   * Cleanup event handlers when navigating away
   */
  cleanup() {
    console.log('BiometricOptInScreen - Cleaning up event handlers');

    const eventManager = rdnaIDVService.getEventManager();

    // Clear IDV event handlers
    eventManager.setCheckUserBiometricTemplateStatusHandler(null);
    eventManager.setOptInCapturedFrameConfirmationHandler(null);
    eventManager.setBiometricOptInStatusHandler(null);
    eventManager.setGetSelfieProcessStartConfirmationHandler(this.originalGetSelfieProcessStartConfirmationHandler);

    // Restore original getPassword handler
    const rdnaEventManager = rdnaService.getEventManager();
    rdnaEventManager.setGetPasswordHandler(this.originalGetPasswordHandler);

    // Hide password dialog if visible
    if (this.state.showPasswordDialog) {
      PasswordValidationDialog.hide();
    }

    // Hide captured frame modal if visible
    if (this.state.capturedImageModal.visible) {
      this.hideCapturedFrameModal();
    }
  },

  /**
   * Check biometric template status on server
   */
  async checkTemplateStatus() {
    console.log('BiometricOptInScreen - Checking template status');

    this.state.isCheckingStatus = true;
    this.updateUI();

    try {
      await rdnaIDVService.checkIDVUserBiometricTemplateStatus();
      console.log('BiometricOptInScreen - Template status check initiated');
    } catch (error) {
      console.error('BiometricOptInScreen - Template status check failed:', JSON.stringify(error, null, 2));
      this.state.isCheckingStatus = false;
      this.showError('Failed to check template status: ' + (error.error?.errorString || 'Unknown error'));
      this.updateUI();
    }
  },

  /**
   * Handle template status response
   */
  handleCheckUserBiometricTemplateStatusResponse(data) {
    console.log('BiometricOptInScreen - Template status response:', JSON.stringify(data, null, 2));

    // Clear loading state
    this.state.isCheckingStatus = false;

    const errorCode = data.error?.longErrorCode;
    const errorString = data.error?.errorString || 'Unknown error';

    if (errorCode !== 0) {
      console.error('BiometricOptInScreen - Template status error:', errorString);
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

        console.log('BiometricOptInScreen - Status code:', statusCode);
        console.log('BiometricOptInScreen - Status message:', statusMessage);
      } catch (parseError) {
        console.error('BiometricOptInScreen - Failed to parse idvResponse:', parseError);
      }
    }

    if (statusCode === 100) {
      // Template exists - user already opted in
      this.state.templateStatus = {
        exists: true,
        statusCode,
        statusMessage: statusMessage || 'You have already created a biometric template'
      };
    } else if (statusCode === 600) {
      // Template doesn't exist - user can opt in
      this.state.templateStatus = {
        exists: false,
        statusCode,
        statusMessage: statusMessage || 'No biometric template found. You can create one.'
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
   * Handle getPassword event (challengeMode 6 for opt-in)
   * This wraps the original handler to enable chaining
   */
  handleGetPassword(data) {
    console.log('BiometricOptInScreen - getPassword event:', JSON.stringify(data, null, 2));

    // Only handle challengeMode 6 (biometric opt-in)
    if (data.challengeMode !== 6) {
      console.log('BiometricOptInScreen - Not challengeMode 6, passing to original handler');
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

    console.log('BiometricOptInScreen - getPassword validation:', JSON.stringify({
      errorCode,
      errorString,
      statusCode,
      statusMessage,
      initialError
    }, null, 2));

    // Handle password dialog for opt-in
    console.log('BiometricOptInScreen - Showing password dialog for opt-in');

    this.state.currentChallengeMode = data.challengeMode;
    this.state.passwordAttempts = data.attemptsLeft || 3;
    this.state.passwordError = initialError;
    this.state.showPasswordDialog = true;

    PasswordValidationDialog.show({
      title: 'Password Required',
      message: 'Enter your password to continue with biometric opt-in',
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
    console.log('BiometricOptInScreen - Password submitted');

    try {
      const result = await rdnaService.setPassword(password, this.state.currentChallengeMode);
      console.log('BiometricOptInScreen - Password submitted successfully:', JSON.stringify(result, null, 2));

      // Keep dialog visible with loading state - it will be hidden by status event
    } catch (error) {
      console.error('BiometricOptInScreen - Password submission failed:', JSON.stringify(error, null, 2));

      // Extract error information
      const errorCode = error.error?.longErrorCode || error.error?.shortErrorCode;
      const errorString = error.error?.errorString;

      // Determine error message to display
      let displayError = '';

      if (errorCode && errorCode !== 0) {
        // SDK error (errorCode != 0)
        displayError = errorString || 'Password verification failed';
      } 

      console.log('BiometricOptInScreen - Password error details:', JSON.stringify({
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
    console.log('BiometricOptInScreen - Password cancelled');

    this.state.showPasswordDialog = false;
    this.state.isOptingIn = false;
    this.state.isOptInFlowActive = false;
    this.updateUI();
  },

  /**
   * Handle getSelfieProcessStartConfirmation event (workflow 10)
   * This wraps the original handler to enable chaining
   */
  handleGetSelfieProcessStartConfirmation(data) {
    console.log('BiometricOptInScreen - getSelfieProcessStartConfirmation event:', JSON.stringify(data, null, 2));

    // Only handle workflow 10 (biometric opt-in)
    if (data.idvWorkflow !== 10) {
      console.log('BiometricOptInScreen - Not workflow 10, passing to original handler');
      if (this.originalGetSelfieProcessStartConfirmationHandler) {
        this.originalGetSelfieProcessStartConfirmationHandler(data);
      }
      return;
    }

    // Hide password dialog if visible (user just authenticated with password)
    if (this.state.showPasswordDialog) {
      console.log('BiometricOptInScreen - Hiding password dialog before navigating to selfie start screen');
      PasswordValidationDialog.hide();
      this.state.showPasswordDialog = false;
    }

    // Navigate to IDVSelfieProcessStartConfirmationScreen
    console.log('BiometricOptInScreen - Navigating to IDVSelfieProcessStart screen for workflow 10');
    NavigationService.navigate('IDVSelfieProcessStart', {
      idvWorkflow: data.idvWorkflow,
      eventData: data
    });
  },

  /**
   * Handle opt-in captured frame confirmation event
   *
   * This event is fired when selfie capture completes and SDK has a captured frame.
   * Navigate back to BiometricOptIn screen with the captured image data to ensure
   * the modal is displayed on the correct screen.
   *
   * @param {Object} data - Captured frame data
   * @param {string} data.capturedImage - Base64 encoded image
   */
  handleOptInCapturedFrameConfirmation(data) {
    console.log('BiometricOptInScreen - Captured frame received, navigating back to screen');

    // Navigate back to this screen with the captured image
    NavigationService.navigate('BiometricOptIn', {
      capturedFrame: data.capturedImage
    });
  },

  /**
   * Show captured frame modal
   */
  showCapturedFrameModal() {
    const modal = document.getElementById('captured-frame-modal');
    if (!modal) {
      console.error('BiometricOptInScreen - Captured frame modal not found');
      return;
    }

    // Set image data
    const imageElement = document.getElementById('captured-frame-image');
    if (imageElement && this.state.capturedImageModal.imageData) {
      imageElement.src = 'data:image/jpeg;base64,' + this.state.capturedImageModal.imageData;
    }

    modal.style.display = 'flex';
  },

  /**
   * Hide captured frame modal
   */
  hideCapturedFrameModal() {
    const modal = document.getElementById('captured-frame-modal');
    if (modal) {
      modal.style.display = 'none';
    }

    this.state.capturedImageModal = {
      visible: false,
      imageData: ''
    };
  },

  /**
   * Handle captured frame action (Approve/Recapture/Cancel)
   */
  async handleCapturedFrameAction(action) {
    console.log('BiometricOptInScreen - Captured frame action:', action === 0 ? 'APPROVE' : action === 1 ? 'RECAPTURE' : 'CANCEL');

    try {
      await rdnaIDVService.setIDVBiometricOptInConfirmation(action);
      console.log('BiometricOptInScreen - Captured frame action submitted');

      // If action is Recapture (1), keep modal open for new image
      // If action is Approve (0) or Cancel (2), modal will be closed by status event
      if (action === 1) {
        // Keep modal open - new image will arrive via handleOptInCapturedFrameConfirmation
        console.log('BiometricOptInScreen - Keeping modal open for recapture');
      } else {
        // Close modal for approve or cancel
        this.hideCapturedFrameModal();
      }
    } catch (error) {
      console.error('BiometricOptInScreen - Captured frame action failed:', JSON.stringify(error, null, 2));
      this.hideCapturedFrameModal();
      this.showError('Failed to process action: ' + (error.error?.errorString || 'Unknown error'));
      this.state.isOptingIn = false;
      this.state.isOptInFlowActive = false;
      this.updateUI();
    }
  },

  /**
   * Handle biometric opt-in status response
   */
  /**
   * Handle biometric opt-in status response event
   *
   * This event is fired when the opt-in workflow completes (success or failure).
   * Navigate back to BiometricOptIn screen with the result to ensure the modal
   * is displayed on the correct screen (not underneath other screens).
   *
   * @param {Object} data - Opt-in status event data
   */
  handleBiometricOptInStatusResponse(data) {
    console.log('BiometricOptInScreen - Opt-in status response:', JSON.stringify(data, null, 2));

    // Hide any visible modals/dialogs immediately (before navigation)
    if (this.state.showPasswordDialog) {
      console.log('BiometricOptInScreen - Hiding password dialog before navigation');
      PasswordValidationDialog.hide();
      this.state.showPasswordDialog = false;
    }
    if (this.state.capturedImageModal.visible) {
      console.log('BiometricOptInScreen - Hiding captured frame modal before navigation');
      this.hideCapturedFrameModal();
    }

    // Navigate back to this screen with the result
    // This will trigger onContentLoaded with optInResult in params
    console.log('BiometricOptInScreen - Final opt-in result received, navigating back to screen');
    NavigationService.navigate('BiometricOptIn', {
      optInResult: data
    });
  },

  /**
   * Display opt-in result (success or error) with modal dialog
   *
   * Shows a confirm/alert dialog after navigating back to this screen.
   * 300ms delay ensures navigation completes before showing modal.
   *
   * @param {Object} data - Opt-in result data from event
   */
  displayOptInResult(data) {
    console.log('BiometricOptInScreen - Displaying opt-in result');

    // Hide any visible modals/dialogs
    if (this.state.showPasswordDialog) {
      PasswordValidationDialog.hide();
      this.state.showPasswordDialog = false;
    }
    if (this.state.capturedImageModal.visible) {
      this.hideCapturedFrameModal();
    }

    this.state.isOptingIn = false;
    this.state.isOptInFlowActive = false;

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

        console.log('BiometricOptInScreen - Opt-in status code:', statusCode);
        console.log('BiometricOptInScreen - Opt-in status message:', statusMessage);
      } catch (parseError) {
        console.error('BiometricOptInScreen - Failed to parse idvResponse:', parseError);
      }
    }

    console.log('BiometricOptInScreen - Response validation:', JSON.stringify({
      errorCode,
      errorString,
      statusCode,
      statusMessage
    }, null, 2));

    // Small delay to ensure navigation completes before showing modal
    setTimeout(() => {
      // Check for sync error first
      if (errorCode !== 0) {
        console.error('BiometricOptInScreen - Opt-in error:', errorString);
        alert(
          'Opt-In Failed\n\n' +
          `${errorString} (${errorCode})\n\n` +
          'Click OK to continue.'
        );
      } else if (statusCode === 100) {
        // Success
        console.log('BiometricOptInScreen - Opt-in completed successfully');
        alert(
          'Opt-In Successful\n\n' +
          `${statusMessage || 'Biometric template created successfully'}\n\n` +
          'Click OK to continue.'
        );
      } else {
        // Backend error
        console.error('BiometricOptInScreen - Opt-in backend error:', statusCode);
        alert(
          'Opt-In Failed\n\n' +
          `${statusMessage || 'Failed to create biometric template'} (${statusCode})\n\n` +
          'Click OK to continue.'
        );
      }

      // Clear optInResult from state after displaying
      this.state.optInResult = null;

      // Recheck template status after modal dismissed
      this.checkTemplateStatus();
      this.updateUI();
    }, 300);
  },

  /**
   * Handle start opt-in button click
   */
  async handleStartOptIn() {
    if (this.state.isOptingIn) {
      console.log('BiometricOptInScreen - Already opting in, ignoring');
      return;
    }

    console.log('BiometricOptInScreen - Starting opt-in');

    this.state.isOptingIn = true;
    this.state.isOptInFlowActive = true;
    this.updateUI();

    try {
      await rdnaIDVService.initiateIDVBiometricOptIn();
      console.log('BiometricOptInScreen - Opt-in initiated');
      // Flow continues via events (getPassword or captured frame)
    } catch (error) {
      console.error('BiometricOptInScreen - Opt-in initiation failed:', JSON.stringify(error, null, 2));
      this.showError('Failed to start opt-in: ' + (error.error?.errorString || 'Unknown error'));
      this.state.isOptingIn = false;
      this.state.isOptInFlowActive = false;
      this.updateUI();
    }
  },

  /**
   * Update UI based on current state
   */
  updateUI() {
    // Update status message
    const statusMessageElement = document.getElementById('optin-status-message');
    if (statusMessageElement) {
      if (this.state.isCheckingStatus) {
        // Show checking status message
        statusMessageElement.innerHTML = `<p style="color: #3b82f6;">⏳ Checking template status...</p>`;
        statusMessageElement.style.display = 'block';
      } else if (this.state.templateStatus.statusCode !== null) {
        // Show template status
        const color = this.state.templateStatus.exists ? '#f59e0b' : '#10b981';
        statusMessageElement.innerHTML = `<p style="color: ${color};">${this.escapeHtml(this.state.templateStatus.statusMessage)}</p>`;
        statusMessageElement.style.display = 'block';
      } else {
        statusMessageElement.style.display = 'none';
      }
    }

    // Update start button
    const startButton = document.getElementById('optin-start-btn');
    if (startButton) {
      // Disable button if:
      // 1. Still checking status
      // 2. Template already exists
      // 3. Currently opting in
      const isDisabled = this.state.isCheckingStatus ||
                         this.state.templateStatus.exists ||
                         this.state.isOptingIn;

      startButton.disabled = isDisabled;

      // Update button text based on state
      if (this.state.isCheckingStatus) {
        startButton.textContent = 'Checking Status...';
      } else if (this.state.isOptingIn) {
        startButton.textContent = 'Processing...';
      } else {
        startButton.textContent = 'Start Opt-In';
      }
    }
  },

  /**
   * Show error message
   */
  showError(message) {
    const statusMessageElement = document.getElementById('optin-status-message');
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
window.BiometricOptInScreen = BiometricOptInScreen;
