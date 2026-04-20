/**
 * IDV Additional Document Scan Result Screen
 *
 * This screen displays OCR-extracted document information from additional document scan.
 * It shows the extracted data, validation results, and confidence scores for user review.
 *
 * Key Features:
 * - Display all extracted document details
 * - Portrait image (if available)
 * - Document images (front/back pages)
 * - Extracted identity data
 * - Confidence scores (overall, authenticity, OCR quality)
 * - Validation results (authenticity, consistency, expiry, MRZ)
 * - Document metadata (type, issuing country)
 * - Done button to navigate back to AdditionalDocumentScan screen
 *
 * Event Flow:
 * 1. Receives onIDVAdditionalDocumentScan event with extracted document data
 * 2. Displays ALL extracted information for user review
 * 3. User clicks "Done" -> navigates back to AdditionalDocumentScan screen
 *
 * Usage:
 * NavigationService.navigate('IDVAdditionalDocumentScanResult', {
 *   challengeMode: 9,
 *   eventData: data,
 * });
 *
 * SPA Lifecycle:
 * - onContentLoaded(params): Called when screen content is loaded
 * - Renders all document information dynamically
 */

const IDVAdditionalDocumentScanResultScreen = {
  // Local state
  state: {
    challengeMode: null,
    eventData: null,
    idvResponse: null
  },

  /**
   * Lifecycle hook called when screen content is loaded
   *
   * @param {Object} params - Navigation parameters
   * @param {number} params.challengeMode - Challenge operation mode
   * @param {Object} params.eventData - Full event data from onIDVAdditionalDocumentScan
   */
  onContentLoaded(params) {
    console.log('IDVAdditionalDocumentScanResult - Content loaded with params:', JSON.stringify(params, null, 2));

    // Store params in state
    this.state.challengeMode = params.challengeMode;
    this.state.eventData = params.eventData;
    this.state.idvResponse = params.eventData?.idvResponse;

    // Setup event listeners
    this.setupEventListeners();

    // Render document information
    this.renderDocumentInformation();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Done button
    const doneBtn = document.getElementById('additional-document-scan-result-done-btn');
    if (doneBtn) {
      doneBtn.onclick = () => this.handleDone();
    }

    // Close button (X) - same behavior as Done
    const closeBtn = document.getElementById('additional-doc-result-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => this.handleDone();
    }
  },

  /**
   * Handle Done Button
   * Navigates back to AdditionalDocumentScan screen
   */
  handleDone() {
    console.log('IDVAdditionalDocumentScanResult - Done button pressed, navigating to AdditionalDocumentScan');
    NavigationService.navigate('AdditionalDocumentScan');
  },

  /**
   * Get status color based on status value
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
   * Render all document information
   */
  renderDocumentInformation() {
    // Render each section
    this.renderPersonalInfoHeader();
    this.renderDocumentMetadata();
    this.renderErrorList();
    this.renderWarningList();
    this.renderIdentityData();
    this.renderDocumentImages();
    this.renderChecksPerformed();
  },

  /**
   * Render personal info header with portrait and signature
   */
  renderPersonalInfoHeader() {
    const container = document.getElementById('personal-info-container');
    if (!container) return;

    const idvResponse = this.state.idvResponse;
    if (!idvResponse) return;

    const fullName = idvResponse.identity_data?.['Surname and given names'] ||
                     `${idvResponse.identity_data?.['Given name'] || ''} ${idvResponse.identity_data?.Surname || ''}`.trim();
    const portraitImage = idvResponse.document_info?.document_images?.portrait_image;
    const signatureImage = idvResponse.document_info?.document_images?.signature_image;

    if (!fullName && !portraitImage && !signatureImage) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="personal-info-content">';
    html += '<div class="personal-info-text">';

    if (fullName) {
      html += `<div class="name-text">${this.escapeHtml(fullName)}</div>`;
    }

    if (signatureImage) {
      html += '<div class="signature-container">';
      html += '<div class="image-label">Signature</div>';
      html += `<img src="data:image/jpg;base64,${signatureImage}" class="signature-image" />`;
      html += '</div>';
    }

    html += '</div>';

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
   * Render document metadata and overall status
   */
  renderDocumentMetadata() {
    const container = document.getElementById('document-metadata-container');
    if (!container) return;

    const idvResponse = this.state.idvResponse;
    if (!idvResponse) return;

    const documentInfo = idvResponse.document_info;
    const documentStatus = idvResponse.document_status;
    const version = idvResponse.version;

    const hasMetadata = documentInfo || documentStatus || version;
    if (!hasMetadata) {
      container.style.display = 'none';
      return;
    }

    const overallStatus = documentStatus?.overall_document_status;
    const statusColor = this.getStatusColor(overallStatus || '');

    let html = '<div class="data-container">';

    if (overallStatus) {
      html += '<div class="data-row">';
      html += '<div class="data-label">Document Status</div>';
      html += `<div class="data-value" style="color: ${statusColor}; font-weight: bold;">${this.escapeHtml(overallStatus)}</div>`;
      html += '</div>';
    }

    if (documentInfo?.document_names && documentInfo.document_names[0]) {
      html += '<div class="data-row">';
      html += '<div class="data-label">Document Name</div>';
      html += `<div class="data-value">${this.escapeHtml(documentInfo.document_names[0])}</div>`;
      html += '</div>';
    }

    if (documentInfo?.document_type && documentInfo.document_type[0]) {
      html += '<div class="data-row">';
      html += '<div class="data-label">Document Type</div>';
      html += `<div class="data-value">${this.escapeHtml(documentInfo.document_type[0])}</div>`;
      html += '</div>';
    }

    if (documentInfo?.field_count !== undefined) {
      html += '<div class="data-row">';
      html += '<div class="data-label">Fields Extracted</div>';
      html += `<div class="data-value">${documentInfo.field_count}</div>`;
      html += '</div>';
    }

    if (version) {
      html += '<div class="data-row">';
      html += '<div class="data-label">Schema Version</div>';
      html += `<div class="data-value">${this.escapeHtml(version)}</div>`;
      html += '</div>';
    }

    if (documentStatus?.is_nfc_document !== undefined) {
      html += '<div class="data-row">';
      html += '<div class="data-label">NFC Document</div>';
      html += `<div class="data-value">${documentStatus.is_nfc_document ? 'Yes' : 'No'}</div>`;
      html += '</div>';
    }

    if (documentStatus?.nfc_scan_status) {
      html += '<div class="data-row">';
      html += '<div class="data-label">NFC Scan Status</div>';
      html += `<div class="data-value">${this.escapeHtml(documentStatus.nfc_scan_status)}</div>`;
      html += '</div>';
    }

    if (documentStatus?.nfc_scan_status_reason) {
      html += '<div class="data-row">';
      html += '<div class="data-label">NFC Reason</div>';
      html += `<div class="data-value">${this.escapeHtml(documentStatus.nfc_scan_status_reason)}</div>`;
      html += '</div>';
    }

    html += '</div>';

    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Render error list
   */
  renderErrorList() {
    const container = document.getElementById('error-list-container');
    if (!container) return;

    const errorList = this.state.idvResponse?.document_status?.error_list;
    if (!errorList || errorList.length === 0) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="list-container" style="border-left-color: #e74c3c;">';
    errorList.forEach(error => {
      html += '<div class="list-item">';
      html += '<span class="list-bullet">•</span>';
      html += `<span class="list-text">${this.escapeHtml(error)}</span>`;
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
    const container = document.getElementById('warning-list-container');
    if (!container) return;

    const warningList = this.state.idvResponse?.document_status?.warning_list;
    if (!warningList || warningList.length === 0) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="list-container" style="border-left-color: #f39c12;">';
    warningList.forEach(warning => {
      html += '<div class="list-item">';
      html += '<span class="list-bullet">•</span>';
      html += `<span class="list-text">${this.escapeHtml(warning)}</span>`;
      html += '</div>';
    });
    html += '</div>';

    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Render identity data fields
   */
  renderIdentityData() {
    const container = document.getElementById('identity-data-container');
    if (!container) return;

    const identityData = this.state.idvResponse?.identity_data;
    if (!identityData || Object.keys(identityData).length === 0) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="data-container">';
    Object.entries(identityData).forEach(([key, value]) => {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      html += '<div class="data-row">';
      html += `<div class="data-label">${this.escapeHtml(label)}</div>`;
      html += `<div class="data-value">${this.escapeHtml(String(value))}</div>`;
      html += '</div>';
    });
    html += '</div>';

    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Render document images (front and back pages)
   */
  renderDocumentImages() {
    const container = document.getElementById('document-images-container');
    if (!container) return;

    const frontPage = this.state.idvResponse?.document_info?.document_images?.front_page;
    const backPage = this.state.idvResponse?.document_info?.document_images?.back_page;

    if (!frontPage && !backPage) {
      container.style.display = 'none';
      return;
    }

    let html = '';

    if (frontPage) {
      html += '<div class="document-image-wrapper">';
      html += '<div class="image-label">Front Page</div>';
      html += `<img src="data:image/jpg;base64,${frontPage}" class="document-image" />`;
      html += '</div>';
    }

    if (backPage) {
      html += '<div class="document-image-wrapper">';
      html += '<div class="image-label">Back Page</div>';
      html += `<img src="data:image/jpg;base64,${backPage}" class="document-image" />`;
      html += '</div>';
    }

    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Render detailed checks performed
   */
  renderChecksPerformed() {
    const container = document.getElementById('checks-performed-container');
    if (!container) return;

    const checksPerformed = this.state.idvResponse?.document_status?.checks_performed;
    if (!checksPerformed || checksPerformed.length === 0) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="checks-container">';

    checksPerformed.forEach(check => {
      const checkStatusColor = this.getStatusColor(check.check_status);

      html += '<div class="check-group">';
      html += '<div class="check-header">';
      html += `<div class="check-name">${this.escapeHtml(check.check_name)}</div>`;
      html += `<div class="check-status" style="color: ${checkStatusColor};">${this.escapeHtml(check.check_status)}</div>`;
      html += '</div>';
      html += `<div class="check-category">Category: ${this.escapeHtml(check.check_category)}</div>`;

      if (check.check_detail && check.check_detail.length > 0) {
        html += '<div class="check-details-container">';
        check.check_detail.forEach(detail => {
          const detailStatusColor = this.getStatusColor(detail.status);
          html += '<div class="check-detail">';
          html += `<div class="check-detail-element">${this.escapeHtml(detail.element || 'Check')}</div>`;
          html += `<div class="check-detail-status" style="color: ${detailStatusColor};">${this.escapeHtml(detail.status)}</div>`;
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
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Expose to global scope for NavigationService
window.IDVAdditionalDocumentScanResultScreen = IDVAdditionalDocumentScanResultScreen;
