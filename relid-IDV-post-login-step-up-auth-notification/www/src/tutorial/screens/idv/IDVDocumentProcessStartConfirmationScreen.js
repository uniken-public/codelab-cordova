/**
 * IDV Document Scan Start Screen
 *
 * This screen handles the IDV document scan process start confirmation event.
 * It provides information about document scanning requirements and allows users
 * to either start the scan process or cancel.
 *
 * Key Features:
 * - Display document scan guidelines and requirements
 * - Start document scanning process
 * - Cancel/close the IDV flow
 * - Loading states during API calls
 * - Error handling with user feedback
 *
 * Event Flow:
 * 1. Receives getIDVDocumentScanProcessStartConfirmation event
 * 2. Displays scan requirements and guidelines
 * 3. User clicks "Scan Document" -> calls setIDVDocumentScanProcessStartConfirmation(true, idvWorkflow)
 * 4. User clicks close button -> calls setIDVDocumentScanProcessStartConfirmation(false, idvWorkflow)
 *
 * Usage:
 * NavigationService.navigate('IDVDocumentScanStart', {
 *   idvWorkflow: 0,
 *   eventData: data,
 * });
 */

const IDVDocumentProcessStartConfirmationScreen = {
  // Screen state
  state: {
    idvWorkflow: null,
    eventData: null,
    isProcessing: false,
    error: ''
  },

  /**
   * Called when NavigationService.navigate('IDVDocumentScanStart', params)
   * Replaces React componentDidMount / useEffect
   *
   * @param {Object} params - Navigation parameters
   * @param {number} params.idvWorkflow - IDV workflow enum value
   * @param {Object} params.eventData - Event data from SDK
   */
  onContentLoaded(params) {
    console.log('IDVDocumentScanStart - Screen loaded with params:', JSON.stringify(params, null, 2));

    // Initialize state
    this.state = {
      idvWorkflow: params.idvWorkflow,
      eventData: params.eventData,
      isProcessing: false,
      error: ''
    };

    // Setup event listeners
    this.setupEventListeners();

    // Update workflow-specific content
    this.updateWorkflowGuideline();

    // Clear any previous errors
    this.hideError();
  },

  /**
   * Setup event listeners (DOM + keyboard)
   */
  setupEventListeners() {
    // Scan Document button
    const scanButton = document.getElementById('idv-scan-document-btn');
    if (scanButton) {
      scanButton.onclick = () => this.handleScanDocument();
    }

    // Close button
    const closeButton = document.getElementById('idv-doc-scan-close-btn');
    if (closeButton) {
      closeButton.onclick = () => this.handleClose();
    }
  },

  /**
   * Get workflow-specific guideline text
   * Based on the IDV workflow type
   *
   * @returns {string} Workflow-specific guideline text
   */
  getWorkflowGuideline() {
    const workflow = this.state.idvWorkflow;

    switch (workflow) {
      case 0: // IDV_ACTIVATION
        return 'Activation process requires clear document scan. Ensure good lighting and hold your document steady.';
      case 1: // IDV_ACTIVATION_WITH_TEMPLATE
        return 'Activation with biometric template. Position document within frame for verification.';
      case 2: // IDV_ADDITIONAL_DEVICE_WITH_TEMPLATE
        return 'Additional device activation requires clear document scan. Position document within frame.';
      case 3: // IDV_ADDITIONAL_DEVICE_WITHOUT_TEMPLATE
        return 'Additional device setup. Scan your identity document clearly for verification.';
      case 4: // IDV_ACCOUNT_RECOVERY_WITH_TEMPLATE
        return 'Account recovery process. Scan your identity document clearly for verification.';
      case 5: // IDV_ACCOUNT_RECOVERY_WITHOUT_TEMPLATE
        return 'Account recovery requires document verification. Ensure all text is visible and document is flat.';
      case 6: // IDV_POSTLOGIN_KYC
        return 'KYC verification process. Hold document steady and avoid glare for best results.';
      case 13: // IDV_POSTLOGIN_AGENT_KYC
        return 'Agent-assisted KYC process. Scan customer document clearly with proper lighting.';
      default:
        return 'Ensure you have good lighting and hold your document steady for the verification process.';
    }
  },

  /**
   * Update workflow-specific guideline in the UI
   */
  updateWorkflowGuideline() {
    const guidelineEl = document.getElementById('idv-workflow-guideline');
    if (guidelineEl) {
      guidelineEl.textContent = this.getWorkflowGuideline();
    }
  },

  /**
   * Handle Scan Document Button
   * Calls setIDVDocumentScanProcessStartConfirmation with isConfirm=true
   */
  async handleScanDocument() {
    const workflow = this.state.idvWorkflow;

    if (workflow === null && workflow !== 0) {
      this.showError('Invalid workflow. Unable to start document scan.');
      return;
    }

    this.setProcessing(true);
    this.hideError();

    try {
      console.log('IDVDocumentScanStart - Starting document scan process with workflow:', workflow);

      // Call API to start document scan
      const response = await rdnaIDVService.setIDVDocumentScanProcessStartConfirmation(
        true, // isConfirm = true to start scan
        workflow
      );

      console.log('IDVDocumentScanStart - Document scan started successfully:', JSON.stringify(response, null, 2));

      // SDK will now open native document scanner UI
      // Async events will be handled by SDKIDVEventProvider

    } catch (error) {
      console.error('IDVDocumentScanStart - Failed to start document scan:', JSON.stringify(error, null, 2));
      const errorMessage = error?.error?.errorString || 'Failed to start document scan. Please try again.';
      this.showError(errorMessage);
    } finally {
      this.setProcessing(false);
    }
  },

  /**
   * Handle Close Button
   * Calls setIDVDocumentScanProcessStartConfirmation with isConfirm=false
   */
  async handleClose() {
    const workflow = this.state.idvWorkflow;

    if (workflow === null && workflow !== 0) {
      console.warn('IDVDocumentScanStart - No workflow available, skipping cancel API call');
      return;
    }

    this.setProcessing(true);
    this.hideError();

    try {
      console.log('IDVDocumentScanStart - Cancelling document scan process');

      // Call API to cancel document scan
      await rdnaIDVService.setIDVDocumentScanProcessStartConfirmation(
        false, // isConfirm = false to cancel
        workflow
      );

      console.log('IDVDocumentScanStart - Document scan cancelled successfully');

      // SDK will handle navigation back to getUser or previous screen

    } catch (error) {
      console.error('IDVDocumentScanStart - Failed to cancel document scan:', JSON.stringify(error, null, 2));
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

    // Update button state
    const scanButton = document.getElementById('idv-scan-document-btn');
    if (scanButton) {
      scanButton.disabled = isProcessing;
      scanButton.textContent = isProcessing ? 'Starting Scan...' : 'Scan Document';
      if (isProcessing) {
        scanButton.classList.add('loading');
      } else {
        scanButton.classList.remove('loading');
      }
    }

    // Update close button state
    const closeButton = document.getElementById('idv-doc-scan-close-btn');
    if (closeButton) {
      closeButton.disabled = isProcessing;
    }
  },

  /**
   * Show error message
   *
   * @param {string} message - Error message to display
   */
  showError(message) {
    this.state.error = message;

    const errorDiv = document.getElementById('idv-doc-scan-error');
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

    const errorDiv = document.getElementById('idv-doc-scan-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
  }
};

// Expose to global scope for NavigationService
window.IDVDocumentScanStartScreen = IDVDocumentProcessStartConfirmationScreen;
