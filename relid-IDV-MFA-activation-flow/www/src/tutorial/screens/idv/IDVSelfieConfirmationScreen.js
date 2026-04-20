/**
 * IDV Selfie Confirmation Screen
 *
 * This screen displays the biometric match result between document image and captured selfie.
 * It handles the getIDVSelfieConfirmation event and allows users to confirm or reject
 * the selfie biometric results.
 *
 * Key Features:
 * - Side-by-side image comparison (document photo vs selfie)
 * - Biometric match result with icon and scores
 * - Face matching score and liveness score display
 * - Dynamic action buttons based on match result
 * - Close button to reset authentication state
 *
 * Event Flow:
 * 1. Receives getIDVSelfieConfirmation event with biometric analysis data
 * 2. Displays selfie image, document photo, and match results
 * 3. User clicks action button -> calls setIDVSelfieConfirmation(action, challengeMode)
 * 4. User clicks close button -> calls resetAuthState() to cancel IDV flow
 *
 * Usage:
 * NavigationService.navigate('IDVSelfieConfirmation', {
 *   challengeMode: 8,
 *   eventData: data,
 * });
 */

const IDVSelfieConfirmationScreen = {
  // Screen state
  state: {
    challengeMode: null,
    eventData: null,
    responseData: null,
    isProcessing: false,
    error: ''
  },

  /**
   * Called when NavigationService.navigate('IDVSelfieConfirmation', params)
   *
   * @param {Object} params - Navigation parameters
   * @param {number} params.challengeMode - Challenge operation mode
   * @param {Object} params.eventData - Event data with biometric results
   */
  onContentLoaded(params) {
    console.log('IDVSelfieConfirmation - Screen loaded with params:', JSON.stringify(params, null, 2));

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

    // Render all content
    this.renderAllContent();

    // Clear any previous errors
    this.hideError();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Close button
    const closeButton = document.getElementById('idv-selfie-confirm-close-btn');
    if (closeButton) {
      closeButton.onclick = () => this.handleClose();
    }

    // Dynamic action buttons will be set up in renderActionButtons()
  },

  /**
   * Render all content sections
   */
  renderAllContent() {
    this.renderImageComparison();
    this.renderMatchResult();
    this.renderActionButtons();
  },

  /**
   * Render image comparison section (side-by-side)
   */
  renderImageComparison() {
    const responseData = this.state.responseData;
    if (!responseData) return;

    const portraitImage = responseData.response_data?.document_detail?.document_info?.portrait_image;
    const selfieImage = responseData.response_data?.analyze_liveness_response?.video?.autocapture_result?.selfie_image;

    const container = document.getElementById('idv-image-comparison');
    if (!container) return;

    let html = '';

    // Document Photo
    html += '<div class="image-container">';
    html += '<div class="image-label">Document Photo</div>';
    if (portraitImage) {
      html += `<img src="data:image/jpg;base64,${portraitImage}" class="comparison-image" />`;
    } else {
      html += '<div class="placeholder-image">No Image</div>';
    }
    html += '</div>';

    // Selfie Photo
    html += '<div class="image-container">';
    html += '<div class="image-label">Selfie Photo</div>';
    if (selfieImage) {
      html += `<img src="data:image/jpg;base64,${selfieImage}" class="comparison-image" />`;
    } else {
      html += '<div class="placeholder-image">No Image</div>';
    }
    html += '</div>';

    container.innerHTML = html;
  },

  /**
   * Render biometric match result with icon and scores
   */
  renderMatchResult() {
    const responseData = this.state.responseData;
    if (!responseData) return;

    const biometricResult = responseData.response_data?.biometric_result;
    const faceMatchScore = responseData.response_data?.face_matcher_response?.score;
    const livenessScore = responseData.response_data?.analyze_liveness_response?.video?.liveness_result?.score;
    const resultCriteria = biometricResult?.result_criteria;

    const container = document.getElementById('idv-match-result');
    if (!container) return;

    if (!biometricResult) {
      container.style.display = 'none';
      return;
    }

    const isMatched = biometricResult.display_text === 'MATCHED';
    const matchIcon = isMatched ? '✓' : '✗';
    const matchColor = isMatched ? '#27ae60' : '#e74c3c';
    const matchText = isMatched
      ? 'Selfie matches with document image'
      : 'Selfie does not match with document image';

    let html = '<div class="match-header">';
    html += `<span class="match-icon" style="color: ${matchColor}">${matchIcon}</span>`;
    html += '<div class="match-text-container">';
    html += `<div class="match-text" style="color: ${matchColor}">${matchText}</div>`;
    html += `<div class="match-status">Status: ${biometricResult.display_text}</div>`;
    html += '</div>';
    html += '</div>';

    // Scores Display
    html += '<div class="scores-container">';

    if (faceMatchScore !== undefined) {
      html += '<div class="score-row">';
      html += '<span class="score-label">Face Match Score:</span>';
      html += `<span class="score-value">${(faceMatchScore * 100).toFixed(2)}%</span>`;
      html += '</div>';
    }

    if (livenessScore !== undefined) {
      html += '<div class="score-row">';
      html += '<span class="score-label">Liveness Score:</span>';
      html += `<span class="score-value">${livenessScore}%</span>`;
      html += '</div>';
    }

    if (resultCriteria) {
      html += '<div class="score-row">';
      html += '<span class="score-label">Criteria:</span>';
      html += `<span class="score-value">${resultCriteria}</span>`;
      html += '</div>';
    }

    html += '</div>';

    container.innerHTML = html;
    container.style.display = 'block';
  },

  /**
   * Render dynamic action buttons based on match result
   */
  renderActionButtons() {
    const responseData = this.state.responseData;
    if (!responseData) return;

    const actionButtons = responseData.action_buttons;
    const biometricResult = responseData.response_data?.biometric_result;

    const container = document.getElementById('idv-action-buttons');
    if (!container) return;

    // Determine which buttons to show based on match result
    const isMatched = biometricResult?.display_text === 'MATCHED';
    const buttons = isMatched ? actionButtons?.success_button : actionButtons?.failure_button;

    if (!buttons || buttons.length === 0) {
      // Fallback buttons if no action buttons provided
      let html = '<div class="button-group">';
      html += '<button id="idv-action-recapture" class="secondary-button">Recapture Selfie</button>';
      html += '<button id="idv-action-continue" class="primary-button">Continue</button>';
      html += '</div>';
      container.innerHTML = html;

      // Set up event listeners for fallback buttons
      const recaptureBtn = document.getElementById('idv-action-recapture');
      const continueBtn = document.getElementById('idv-action-continue');
      if (recaptureBtn) recaptureBtn.onclick = () => this.handleAction('reinit-idv-selfie');
      if (continueBtn) continueBtn.onclick = () => this.handleAction('continue-flow');

      return;
    }

    // Generate dynamic buttons based on count
    let html = '';

    if (buttons.length === 1) {
      // Single button - full width
      html += '<div class="button-group">';
      html += `<button id="idv-action-btn-0" class="primary-button">${buttons[0].button_text}</button>`;
      html += '</div>';
    } else if (buttons.length === 2) {
      // Two buttons - side by side
      html += '<div class="button-group">';
      buttons.forEach((button, index) => {
        const btnClass = button.button_text.toLowerCase().includes('continue') ? 'primary-button' : 'secondary-button';
        html += `<button id="idv-action-btn-${index}" class="${btnClass}">${button.button_text}</button>`;
      });
      html += '</div>';
    } else if (buttons.length === 3) {
      // Three buttons - 2 in first row, 1 full-width below
      html += '<div class="button-group">';
      for (let i = 0; i < 2; i++) {
        const btnClass = buttons[i].button_text.toLowerCase().includes('continue') ? 'primary-button' : 'secondary-button';
        html += `<button id="idv-action-btn-${i}" class="${btnClass}">${buttons[i].button_text}</button>`;
      }
      const btnClass3 = buttons[2].button_text.toLowerCase().includes('continue') ? 'primary-button' : 'secondary-button';
      html += `<button id="idv-action-btn-2" class="${btnClass3}">${buttons[2].button_text}</button>`;
      html += '</div>';
    } else {
      // More than three buttons - stacked layout
      html += '<div class="button-group">';
      buttons.forEach((button, index) => {
        const btnClass = button.button_text.toLowerCase().includes('continue') ? 'primary-button' : 'secondary-button';
        html += `<button id="idv-action-btn-${index}" class="${btnClass}">${button.button_text}</button>`;
      });
      html += '</div>';
    }

    container.innerHTML = html;

    // Set up event listeners for all generated buttons
    buttons.forEach((button, index) => {
      const btn = document.getElementById(`idv-action-btn-${index}`);
      if (btn) {
        btn.onclick = () => this.handleAction(button.key);
      }
    });
  },

  /**
   * Handle Close Button
   * Calls resetAuthState to cancel entire IDV flow
   */
  async handleClose() {
    this.setProcessing(true);
    this.hideError();

    try {
      console.log('IDVSelfieConfirmation - Calling resetAuthState to cancel IDV flow');
      await rdnaService.resetAuthState();
      console.log('IDVSelfieConfirmation - ResetAuthState successful');
    } catch (error) {
      console.error('IDVSelfieConfirmation - ResetAuthState error:', JSON.stringify(error, null, 2));
      const errorMessage = error?.error?.errorString || 'Failed to cancel. Please try again.';
      this.showError(errorMessage);
    } finally {
      this.setProcessing(false);
    }
  },

  /**
   * Handle Action Button
   * Calls setIDVSelfieConfirmation with selected action key
   *
   * @param {string} actionKey - Action key from button
   */
  async handleAction(actionKey) {
    const challengeMode = this.state.challengeMode;

    if (challengeMode === null && challengeMode !== 0) {
      this.showError('Invalid challenge mode. Unable to process action.');
      return;
    }

    this.setProcessing(true);
    this.hideError();

    try {
      console.log('IDVSelfieConfirmation - Processing action:', actionKey);

      await rdnaIDVService.setIDVSelfieConfirmation(
        actionKey,
        challengeMode
      );

      console.log('IDVSelfieConfirmation - Action processed successfully. actionKey:', actionKey);

      // SDK will handle navigation to next step or previous screen

    } catch (error) {
      console.error('IDVSelfieConfirmation - Failed to process action:', JSON.stringify(error, null, 2));
      const errorMessage = error?.error?.errorString || 'Failed to process action. Please try again.';
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

    // Update all action buttons
    const container = document.getElementById('idv-action-buttons');
    if (container) {
      const buttons = container.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.disabled = isProcessing;
        if (isProcessing && !btn.textContent.includes('Processing')) {
          btn.setAttribute('data-original-text', btn.textContent);
          btn.textContent = 'Processing...';
          btn.classList.add('loading');
        } else if (!isProcessing && btn.hasAttribute('data-original-text')) {
          btn.textContent = btn.getAttribute('data-original-text');
          btn.removeAttribute('data-original-text');
          btn.classList.remove('loading');
        }
      });
    }

    // Update close button
    const closeButton = document.getElementById('idv-selfie-confirm-close-btn');
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

    const errorDiv = document.getElementById('idv-selfie-confirm-error');
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

    const errorDiv = document.getElementById('idv-selfie-confirm-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
  }
};

// Expose to global scope for NavigationService
window.IDVSelfieConfirmationScreen = IDVSelfieConfirmationScreen;
