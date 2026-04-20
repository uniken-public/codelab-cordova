/**
 * IDV Confirm Document Details Screen
 *
 * This screen displays OCR-extracted document information for user validation.
 * It handles the getIDVConfirmDocumentDetails event and allows users to confirm
 * or reject the scanned document data.
 *
 * Key Features:
 * - Display all document details
 * - Portrait and signature images
 * - Document images (front/back pages)
 * - Extracted identity data with validation status
 * - Detailed checks performed with results
 * - Error and warning lists
 * - NFC scan status information
 * - Overall document validation status
 * - Allow user to confirm or recapture document
 * - Close button with challengeMode-based behavior
 *
 * Event Flow:
 * 1. Receives getIDVConfirmDocumentDetails event with OCR data
 * 2. Displays ALL extracted information for user review
 * 3. User clicks "Confirm" -> calls setIDVConfirmDocumentDetails(true, challengeMode)
 * 4. User clicks "Recapture" -> calls setIDVConfirmDocumentDetails(false, challengeMode)
 * 5. User clicks close button:
 *    - Pre-login flow (challengeMode === 8): calls resetAuthState() to cancel IDV flow
 *    - Post-login flow (challengeMode !== 8): navigates directly to ActivatedCustomerKYC screen
 *
 * Usage:
 * NavigationService.navigate('IDVConfirmDocumentDetails', {
 *   challengeMode: 8,
 *   eventData: data,
 * });
 */

const IDVConfirmDocumentDetailsScreen = {
  // Screen state
  state: {
    challengeMode: null,
    eventData: null,
    responseData: null,
    isProcessing: false,
    error: ''
  },

  /**
   * Called when NavigationService.navigate('IDVConfirmDocumentDetails', params)
   *
   * @param {Object} params - Navigation parameters
   * @param {number} params.challengeMode - Challenge operation mode
   * @param {Object} params.eventData - Event data with response_data
   */
  onContentLoaded(params) {
    console.log('IDVConfirmDocumentDetails - Screen loaded with params:', JSON.stringify(params, null, 2));

    // Initialize state
    this.state = {
      challengeMode: params.challengeMode,
      eventData: params.eventData,
      responseData: params.eventData?.response_data,
      isProcessing: false,
      error: ''
    };

    // Setup event listeners
    this.setupEventListeners();

    // Render all document data
    this.renderAllContent();

    // Clear any previous errors
    this.hideError();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Confirm button
    const confirmButton = document.getElementById('idv-confirm-btn');
    if (confirmButton) {
      confirmButton.onclick = () => this.handleConfirm();
    }

    // Recapture button
    const recaptureButton = document.getElementById('idv-recapture-btn');
    if (recaptureButton) {
      recaptureButton.onclick = () => this.handleRecapture();
    }

    // Close button
    const closeButton = document.getElementById('idv-confirm-close-btn');
    if (closeButton) {
      closeButton.onclick = () => this.handleClose();
    }
  },

  /**
   * Render all content sections
   */
  renderAllContent() {
    this.renderPersonalInfoHeader();
    this.renderDocumentImages();
    this.renderDocumentStatus();
    this.renderIdentityData();
    this.renderChecksPerformed();
    this.renderErrorList();
    this.renderWarningList();
    this.renderNFCStatus();
  },

  /**
   * Get status color based on status value
   *
   * @param {string} status - Status value
   * @returns {string} Color hex code
   */
  getStatusColor(status) {
    switch (status) {
      case 'OK': return '#27ae60';
      case 'ERROR': return '#e74c3c';
      case 'WARNING': return '#f39c12';
      case 'NOT DONE': return '#f39c12';
      default: return '#7f8c8d';
    }
  },

  /**
   * Render personal info header with portrait and signature
   */
  renderPersonalInfoHeader() {
    const responseData = this.state.responseData;
    if (!responseData) return;

    const fullName = responseData.identity_data?.['Surname and given names'] ||
                     `${responseData.identity_data?.['Given name'] || ''} ${responseData.identity_data?.Surname || ''}`.trim();
    const portraitImage = responseData.document_info?.document_images?.portrait_image;
    const signatureImage = responseData.document_info?.document_images?.signature_image;

    const container = document.getElementById('idv-personal-info-header');
    if (!container) return;

    if (!fullName && !portraitImage && !signatureImage) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="personal-info-content">';

    // Text and signature column
    html += '<div class="personal-info-text">';
    if (fullName) {
      html += `<div class="name-text">${fullName}</div>`;
    }
    if (signatureImage) {
      html += '<div class="signature-container">';
      html += '<div class="image-label">Signature</div>';
      html += `<img src="data:image/jpg;base64,${signatureImage}" class="signature-image" />`;
      html += '</div>';
    }
    html += '</div>';

    // Portrait column
    if (portraitImage) {
      html += '<div class="portrait-container">';
      html += `<img src="data:image/jpg;base64,${portraitImage}" class="portrait-image" />`;
      html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Render document images (front and back pages)
   */
  renderDocumentImages() {
    const responseData = this.state.responseData;
    if (!responseData) return;

    const frontPage = responseData.document_info?.document_images?.front_page;
    const backPage = responseData.document_info?.document_images?.back_page;

    const container = document.getElementById('idv-document-images');
    if (!container) return;

    if (!frontPage && !backPage) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="section-title">Document Images</div>';

    if (frontPage) {
      html += '<div class="document-image-container">';
      html += '<div class="image-label">Front Page</div>';
      html += `<img src="data:image/jpg;base64,${frontPage}" class="document-image" />`;
      html += '</div>';
    }

    if (backPage) {
      html += '<div class="document-image-container">';
      html += '<div class="image-label">Back Page</div>';
      html += `<img src="data:image/jpg;base64,${backPage}" class="document-image" />`;
      html += '</div>';
    }

    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Render overall document status
   */
  renderDocumentStatus() {
    const responseData = this.state.responseData;
    if (!responseData) return;

    const overallStatus = responseData.document_status?.overall_document_status;
    const container = document.getElementById('idv-document-status');
    if (!container) return;

    if (!overallStatus) {
      container.style.display = 'none';
      return;
    }

    const statusColor = this.getStatusColor(overallStatus);

    let html = '<div class="status-header">';
    html += '<span class="status-label">Document Status</span>';
    html += `<span class="status-value" style="color: ${statusColor}">${overallStatus}</span>`;
    html += '</div>';

    if (overallStatus === 'ERROR') {
      html += '<div class="status-hint">Document validation failed. You can recapture or proceed anyway.</div>';
    } else if (overallStatus === 'WARNING') {
      html += '<div class="status-hint">Document has warnings. Review details below.</div>';
    }

    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Render identity data fields
   */
  renderIdentityData() {
    const responseData = this.state.responseData;
    if (!responseData) return;

    const identityData = responseData.identity_data;
    const container = document.getElementById('idv-identity-data');
    if (!container) return;

    if (!identityData || Object.keys(identityData).length === 0) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="section-title">Extracted Information</div>';
    html += '<div class="data-container">';

    Object.entries(identityData).forEach(([key, value]) => {
      html += '<div class="data-row">';
      html += `<span class="data-label">${key}</span>`;
      html += `<span class="data-value">${String(value)}</span>`;
      html += '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Render detailed checks performed
   * Shows ALL validation details without truncation
   */
  renderChecksPerformed() {
    const responseData = this.state.responseData;
    if (!responseData) return;

    const checksPerformed = responseData.document_status?.checks_performed;
    const container = document.getElementById('idv-checks-performed');
    if (!container) return;

    if (!checksPerformed || checksPerformed.length === 0) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="section-title">Validation Checks</div>';
    html += '<div class="checks-container">';

    checksPerformed.forEach((check, index) => {
      const checkStatusColor = this.getStatusColor(check.check_status);

      html += '<div class="check-group">';
      html += '<div class="check-header">';
      html += `<span class="check-name">${check.check_name}</span>`;
      html += `<span class="check-status" style="color: ${checkStatusColor}">${check.check_status}</span>`;
      html += '</div>';
      html += `<div class="check-category">Category: ${check.check_category}</div>`;

      if (check.check_detail && check.check_detail.length > 0) {
        html += '<div class="check-details-container">';
        check.check_detail.forEach((detail, detailIndex) => {
          const detailStatusColor = this.getStatusColor(detail.status);
          html += '<div class="check-detail">';
          html += `<span class="check-detail-element">${detail.element || 'Check'}</span>`;
          html += `<span class="check-detail-status" style="color: ${detailStatusColor}">${detail.status}</span>`;
          html += '</div>';
        });
        html += '</div>';
      }

      html += '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Render error list
   */
  renderErrorList() {
    const responseData = this.state.responseData;
    if (!responseData) return;

    const errorList = responseData.document_status?.error_list;
    const container = document.getElementById('idv-error-list');
    if (!container) return;

    if (!errorList || errorList.length === 0) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="section-title" style="color: #e74c3c">Validation Errors</div>';
    html += '<div class="list-container" style="border-left-color: #e74c3c">';

    errorList.forEach((error, index) => {
      html += '<div class="list-item">';
      html += '<span class="list-bullet">•</span>';
      html += `<span class="list-text">${error}</span>`;
      html += '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Render warning list
   */
  renderWarningList() {
    const responseData = this.state.responseData;
    if (!responseData) return;

    const warningList = responseData.document_status?.warning_list;
    const container = document.getElementById('idv-warning-list');
    if (!container) return;

    if (!warningList || warningList.length === 0) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="section-title" style="color: #f39c12">Warnings</div>';
    html += '<div class="list-container" style="border-left-color: #f39c12">';

    warningList.forEach((warning, index) => {
      html += '<div class="list-item">';
      html += '<span class="list-bullet">•</span>';
      html += `<span class="list-text">${warning}</span>`;
      html += '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Render NFC scan status
   */
  renderNFCStatus() {
    const responseData = this.state.responseData;
    if (!responseData) return;

    const documentStatus = responseData.document_status;
    const container = document.getElementById('idv-nfc-status');
    if (!container) return;

    if (!documentStatus) {
      container.style.display = 'none';
      return;
    }

    const hasNFCInfo = documentStatus.is_nfc_document !== undefined ||
                       documentStatus.nfc_scan_status ||
                       documentStatus.nfc_scan_status_reason;

    if (!hasNFCInfo) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="section-title">NFC Scan Information</div>';
    html += '<div class="data-container">';

    if (documentStatus.is_nfc_document !== undefined) {
      html += '<div class="data-row">';
      html += '<span class="data-label">Is NFC Document</span>';
      html += `<span class="data-value">${documentStatus.is_nfc_document ? 'Yes' : 'No'}</span>`;
      html += '</div>';
    }

    if (documentStatus.nfc_scan_status) {
      html += '<div class="data-row">';
      html += '<span class="data-label">NFC Scan Status</span>';
      html += `<span class="data-value">${documentStatus.nfc_scan_status}</span>`;
      html += '</div>';
    }

    if (documentStatus.nfc_scan_status_reason) {
      html += '<div class="data-row">';
      html += '<span class="data-label">Reason</span>';
      html += `<span class="data-value">${documentStatus.nfc_scan_status_reason}</span>`;
      html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Handle Close Button
   * Calls resetAuthState to cancel entire IDV flow
   */
  /**
   * Handle Close Button
   * - Pre-login flow (challengeMode === 8): Calls resetAuthState to cancel IDV flow
   * - Post-login flow (challengeMode !== 8): Navigates directly to ActivatedCustomerKYC screen
   */
  async handleClose() {
    if (this.state.challengeMode === null || this.state.challengeMode === undefined) {
      this.showError('Invalid challenge mode. Unable to close.');
      return;
    }

    this.setProcessing(true);
    this.hideError();

    try {
      if (this.state.challengeMode === 8) {
        // Pre-login flow: Call resetAuthState
        console.log('IDVConfirmDocumentDetails - Pre-login flow detected, calling resetAuthState to cancel IDV flow');
        await rdnaService.resetAuthState();
        console.log('IDVConfirmDocumentDetails - ResetAuthState successful');
      } else {
        // Post-login flow: Navigate to ActivatedCustomerKYC screen
        console.log('IDVConfirmDocumentDetails - Post-login flow detected, navigating to ActivatedCustomerKYC screen');
        NavigationService.navigate('ActivatedCustomerKYC', {
          userID: this.state.eventData?.userID || '',
          sessionID: this.state.eventData?.sessionID || ''
        });
        console.log('IDVConfirmDocumentDetails - Navigated to ActivatedCustomerKYC, button will be auto-enabled');
      }
    } catch (error) {
      console.error('IDVConfirmDocumentDetails - Close button error:', JSON.stringify(error, null, 2));
      const errorMessage = error?.error?.errorString || 'Failed to cancel. Please try again.';
      this.showError(errorMessage);
    } finally {
      this.setProcessing(false);
    }
  },

  /**
   * Handle Recapture Button
   * Calls setIDVConfirmDocumentDetails with isConfirm=false to reject and rescan
   */
  async handleRecapture() {
    const challengeMode = this.state.challengeMode;

    if (challengeMode === null && challengeMode !== 0) {
      this.showError('Invalid challenge mode. Unable to recapture document.');
      return;
    }

    this.setProcessing(true);
    this.hideError();

    try {
      console.log('IDVConfirmDocumentDetails - Rejecting document details for recapture');

      await rdnaIDVService.setIDVConfirmDocumentDetails(
        false, // isConfirm = false to reject and rescan
        challengeMode
      );

      console.log('IDVConfirmDocumentDetails - Document recapture requested successfully');

      // SDK will handle navigation back to document scan or appropriate screen

    } catch (error) {
      console.error('IDVConfirmDocumentDetails - Failed to request recapture:', JSON.stringify(error, null, 2));
      const errorMessage = error?.error?.errorString || 'Failed to request recapture. Please try again.';
      this.showError(errorMessage);
    } finally {
      this.setProcessing(false);
    }
  },

  /**
   * Handle Confirm Button
   * Calls setIDVConfirmDocumentDetails with isConfirm=true to proceed
   */
  async handleConfirm() {
    const challengeMode = this.state.challengeMode;

    if (challengeMode === null && challengeMode !== 0) {
      this.showError('Invalid challenge mode. Unable to confirm document.');
      return;
    }

    this.setProcessing(true);
    this.hideError();

    try {
      console.log('IDVConfirmDocumentDetails - Confirming document details');

      await rdnaIDVService.setIDVConfirmDocumentDetails(
        true, // isConfirm = true to proceed
        challengeMode
      );

      console.log('IDVConfirmDocumentDetails - Document details confirmed successfully');

      // SDK will proceed to next step in IDV workflow

    } catch (error) {
      console.error('IDVConfirmDocumentDetails - Failed to confirm document:', JSON.stringify(error, null, 2));
      const errorMessage = error?.error?.errorString || 'Failed to confirm document. Please try again.';
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

    // Update confirm button
    const confirmButton = document.getElementById('idv-confirm-btn');
    if (confirmButton) {
      confirmButton.disabled = isProcessing;
      confirmButton.textContent = isProcessing ? 'Confirming...' : 'Confirm';
      if (isProcessing) {
        confirmButton.classList.add('loading');
      } else {
        confirmButton.classList.remove('loading');
      }
    }

    // Update recapture button
    const recaptureButton = document.getElementById('idv-recapture-btn');
    if (recaptureButton) {
      recaptureButton.disabled = isProcessing;
      recaptureButton.textContent = isProcessing ? 'Processing...' : 'Recapture';
      if (isProcessing) {
        recaptureButton.classList.add('loading');
      } else {
        recaptureButton.classList.remove('loading');
      }
    }

    // Update close button
    const closeButton = document.getElementById('idv-confirm-close-btn');
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

    const errorDiv = document.getElementById('idv-confirm-error');
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

    const errorDiv = document.getElementById('idv-confirm-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
  }
};

// Expose to global scope for NavigationService
window.IDVConfirmDocumentDetailsScreen = IDVConfirmDocumentDetailsScreen;
