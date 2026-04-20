/**
 * IDV Selfie Process Start Confirmation Screen
 *
 * This screen handles the IDV selfie capture process start confirmation event.
 * It provides information about selfie capture requirements and allows users
 * to either start the capture process or cancel.
 *
 * Key Features:
 * - Display selfie capture guidelines and requirements
 * - Camera selection option (front/back camera)
 * - Start selfie capture process
 * - Cancel/close the IDV flow
 * - Loading states during API calls
 * - Error handling with user feedback
 * - Workflow-specific guidelines
 *
 * Event Flow:
 * 1. Receives getIDVSelfieProcessStartConfirmation event
 * 2. Displays capture requirements and guidelines
 * 3. User selects camera preference (front/back)
 * 4. User clicks "Capture Selfie" -> calls setIDVSelfieProcessStartConfirmation(true, useBackCamera, idvWorkflow)
 * 5. User clicks close button -> calls setIDVSelfieProcessStartConfirmation(false, false, idvWorkflow)
 *
 * Usage:
 * NavigationService.navigate('IDVSelfieProcessStart', {
 *   idvWorkflow: 0,
 *   eventData: data,
 * });
 */

const IDVSelfieProcessStartConfirmationScreen = {
  // Screen state
  state: {
    idvWorkflow: null,
    eventData: null,
    isProcessing: false,
    error: '',
    useBackCamera: false
  },

  /**
   * Called when NavigationService.navigate('IDVSelfieProcessStart', params)
   *
   * @param {Object} params - Navigation parameters
   * @param {number} params.idvWorkflow - IDV workflow enum value
   * @param {Object} params.eventData - Event data from SDK
   */
  onContentLoaded(params) {
    console.log('IDVSelfieProcessStart - Screen loaded with params:', JSON.stringify(params, null, 2));

    // Initialize state
    this.state = {
      idvWorkflow: params.idvWorkflow,
      eventData: params.eventData,
      isProcessing: false,
      error: '',
      useBackCamera: false
    };

    // Setup event listeners
    this.setupEventListeners();

    // Update workflow-specific guidelines
    this.updateWorkflowGuidelines();

    // Clear any previous errors
    this.hideError();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Capture Selfie button
    const captureButton = document.getElementById('idv-capture-selfie-btn');
    if (captureButton) {
      captureButton.onclick = () => this.handleCaptureSelfie();
    }

    // Close button
    const closeButton = document.getElementById('idv-selfie-start-close-btn');
    if (closeButton) {
      closeButton.onclick = () => this.handleClose();
    }

    // Camera selection checkbox
    const cameraCheckbox = document.getElementById('idv-use-back-camera');
    if (cameraCheckbox) {
      cameraCheckbox.onchange = (e) => {
        this.state.useBackCamera = e.target.checked;
      };
    }
  },

  /**
   * Get workflow-specific guideline texts
   * Based on the IDV workflow type (16 different workflows)
   *
   * @returns {Object} Object with text1, text2, text3 guideline texts
   */
  getWorkflowGuidelines() {
    const workflow = this.state.idvWorkflow;

    switch (workflow) {
      case 0: // IDV_ACTIVATION
        return {
          text1: 'Ensure good lighting and position your face clearly in the frame for IDV activation process.',
          text2: 'Remove any sunglasses, hats, or face coverings for clear facial recognition.',
          text3: 'Look directly at the camera and follow any on-screen prompts during capture.'
        };
      case 1: // IDV_ACTIVATION_WITH_TEMPLATE
        return {
          text1: 'Position your face clearly for IDV activation with template verification.',
          text2: 'Ensure your face matches the document photo for identity verification.',
          text3: 'Maintain steady position and good lighting throughout the capture process.'
        };
      case 2: // IDV_ADDITIONAL_DEVICE_WITH_TEMPLATE
        return {
          text1: 'Additional device activation requires clear selfie capture for verification.',
          text2: 'Position your face within the frame and ensure good lighting conditions.',
          text3: 'Face will be matched with your existing biometric template for verification.'
        };
      case 3: // IDV_ADDITIONAL_DEVICE_WITHOUT_TEMPLATE
        return {
          text1: 'Additional device without template requires new biometric enrollment.',
          text2: 'Position your face clearly for initial biometric template creation.',
          text3: 'Follow capture guidelines for successful template generation.'
        };
      case 4: // IDV_ACCOUNT_RECOVERY_WITH_TEMPLATE
        return {
          text1: 'Account recovery with template - verify your identity using existing biometric data.',
          text2: 'Position your face clearly for comparison with stored template.',
          text3: 'Ensure good lighting and stable positioning for successful verification.'
        };
      case 5: // IDV_ACCOUNT_RECOVERY_WITHOUT_TEMPLATE
        return {
          text1: 'Account recovery without template - create new biometric profile.',
          text2: 'Position your face clearly for new biometric template creation.',
          text3: 'Follow capture instructions for successful profile establishment.'
        };
      case 6: // IDV_POSTLOGIN_KYC
        return {
          text1: 'Post-login KYC process - capture selfie for identity verification.',
          text2: 'Ensure your face is clearly visible and well-lit for verification.',
          text3: 'Face will be compared with document photo for identity confirmation.'
        };
      case 8: // IDV_POSTLOGIN_SELFIE_BIOMETRIC
        return {
          text1: 'Post-login selfie biometric - capture selfie for biometric authentication.',
          text2: 'Position your face clearly for biometric template verification.',
          text3: 'Ensure stable positioning and good lighting for accurate capture.'
        };
      case 9: // IDV_STEP_UP_AUTHENTICATION
        return {
          text1: 'Step-up authentication - additional verification through selfie capture.',
          text2: 'Position your face clearly for enhanced security verification.',
          text3: 'Face will be verified against your existing biometric profile.'
        };
      case 10: // IDV_BIOMETRIC_OPT_IN
        return {
          text1: 'Biometric opt-in process - capture selfie for biometric enrollment.',
          text2: 'Position your face clearly for initial biometric template creation.',
          text3: 'This will enable biometric authentication for future logins.'
        };
      case 13: // IDV_POSTLOGIN_AGENT_KYC
        return {
          text1: 'Agent KYC process - capture customer selfie for identity verification.',
          text2: 'Ensure customer face is clearly visible and well-positioned.',
          text3: 'Face will be compared with document photo for customer verification.'
        };
      case 15: // IDV_LOGIN_SELFIE_BIOMETRIC
        return {
          text1: 'Login selfie biometric - verify identity through selfie capture.',
          text2: 'Position your face clearly for biometric authentication.',
          text3: 'Face will be matched with your stored biometric template.'
        };
      default:
        return {
          text1: 'Ensure good lighting and position your face clearly in the frame.',
          text2: 'Remove any sunglasses, hats, or face coverings for clear facial recognition.',
          text3: 'Look directly at the camera and follow any on-screen prompts during capture.'
        };
    }
  },

  /**
   * Update workflow-specific guidelines in the UI
   */
  updateWorkflowGuidelines() {
    const guidelines = this.getWorkflowGuidelines();

    const guideline1 = document.getElementById('idv-selfie-guideline-1');
    const guideline2 = document.getElementById('idv-selfie-guideline-2');
    const guideline3 = document.getElementById('idv-selfie-guideline-3');

    if (guideline1) guideline1.textContent = guidelines.text1;
    if (guideline2) guideline2.textContent = guidelines.text2;
    if (guideline3) guideline3.textContent = guidelines.text3;
  },

  /**
   * Handle Capture Selfie Button
   * Calls setIDVSelfieProcessStartConfirmation with isConfirm=true and selected camera
   */
  async handleCaptureSelfie() {
    const workflow = this.state.idvWorkflow;

    if (workflow === null && workflow !== 0) {
      this.showError('Invalid workflow. Unable to start selfie capture.');
      return;
    }

    this.setProcessing(true);
    this.hideError();

    try {
      console.log('IDVSelfieProcessStart - Starting selfie capture process with workflow:', workflow);
      console.log('IDVSelfieProcessStart - Use back camera:', this.state.useBackCamera);

      // Call API to start selfie capture
      const response = await rdnaIDVService.setIDVSelfieProcessStartConfirmation(
        true, // isConfirm = true to start capture
        this.state.useBackCamera, // camera preference
        workflow
      );

      console.log('IDVSelfieProcessStart - Selfie capture started successfully:', JSON.stringify(response, null, 2));

      // SDK will now open native selfie capture UI
      // Async events will be handled by SDKIDVEventProvider

    } catch (error) {
      console.error('IDVSelfieProcessStart - Failed to start selfie capture:', JSON.stringify(error, null, 2));
      const errorMessage = error?.error?.errorString || 'Failed to start selfie capture. Please try again.';
      this.showError(errorMessage);
    } finally {
      this.setProcessing(false);
    }
  },

  /**
   * Handle Close Button
   * Calls setIDVSelfieProcessStartConfirmation with isConfirm=false
   */
  async handleClose() {
    const workflow = this.state.idvWorkflow;

    if (workflow === null && workflow !== 0) {
      console.warn('IDVSelfieProcessStart - No workflow available, skipping cancel API call');
      return;
    }

    this.setProcessing(true);
    this.hideError();

    try {
      console.log('IDVSelfieProcessStart - Cancelling selfie capture process');

      // Call API to cancel selfie capture
      await rdnaIDVService.setIDVSelfieProcessStartConfirmation(
        false, // isConfirm = false to cancel
        false, // camera preference doesn't matter for cancel
        workflow
      );

      console.log('IDVSelfieProcessStart - Selfie capture cancelled successfully');

      // SDK will handle navigation back to previous screen

    } catch (error) {
      console.error('IDVSelfieProcessStart - Failed to cancel selfie capture:', JSON.stringify(error, null, 2));
      const errorMessage = error?.error?.errorString || 'Failed to cancel. Please try again.';
      this.showError(errorMessage);
    } finally {
      this.setProcessing(false);
    }
  },

  /**
   * Set processing state and update UI
   *
   * @param {boolean} isProcessing - Whether operation is in progress
   */
  setProcessing(isProcessing) {
    this.state.isProcessing = isProcessing;

    // Update capture button
    const captureButton = document.getElementById('idv-capture-selfie-btn');
    if (captureButton) {
      captureButton.disabled = isProcessing;
      captureButton.textContent = isProcessing ? 'Starting Capture...' : 'Capture Selfie';
      if (isProcessing) {
        captureButton.classList.add('loading');
      } else {
        captureButton.classList.remove('loading');
      }
    }

    // Update close button
    const closeButton = document.getElementById('idv-selfie-start-close-btn');
    if (closeButton) {
      closeButton.disabled = isProcessing;
    }

    // Update camera checkbox
    const cameraCheckbox = document.getElementById('idv-use-back-camera');
    if (cameraCheckbox) {
      cameraCheckbox.disabled = isProcessing;
    }
  },

  /**
   * Show error message
   *
   * @param {string} message - Error message to display
   */
  showError(message) {
    this.state.error = message;

    const errorDiv = document.getElementById('idv-selfie-start-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  },

  /**
   * Hide error message
   */
  hideError() {
    this.state.error = '';

    const errorDiv = document.getElementById('idv-selfie-start-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
  }
};

// Expose to global scope for NavigationService
window.IDVSelfieProcessStartScreen = IDVSelfieProcessStartConfirmationScreen;
