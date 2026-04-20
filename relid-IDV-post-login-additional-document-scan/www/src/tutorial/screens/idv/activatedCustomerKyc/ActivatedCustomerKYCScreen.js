/**
 * Activated Customer KYC Screen - SPA Module
 *
 * Entry point for post-login KYC (Know Your Customer) verification.
 * Allows logged-in users to complete identity verification using the IDV SDK.
 *
 * Features:
 * - KYC information and requirements display
 * - "Start KYC Verification" button to initiate IDV workflow
 * - Success/error status display after KYC completion
 * - Screen-level event handler for KYC completion
 *
 * SDK Integration:
 * - Calls rdnaIDVService.initiateActivatedCustomerKYC(reason)
 * - Registers event handler for onIDVActivatedCustomerKYCResponse
 * - Receives KYC completion status via event
 * - Navigates through standard IDV workflow (document → selfie → consent)
 *
 * IDV Workflow:
 * 1. User clicks "Start KYC Verification"
 * 2. initiateActivatedCustomerKYC('Post Login KYC') called
 * 3. SDK fires onIDVActivatedCustomerKYCResponse (first time - workflow initiated)
 * 4. SDK auto-triggers IDV events: document scan → selfie → consent
 * 5. After IDV completion, SDK fires onIDVActivatedCustomerKYCResponse (second time - final result)
 * 6. Screen handler navigates back to this screen with result
 * 7. Success/error banner displayed
 *
 * SPA Pattern:
 * - onContentLoaded(params) called when navigated to
 * - setupEventListeners() attaches DOM handlers and event handler
 * - handleStartKYC() initiates KYC workflow
 * - handleActivatedCustomerKYCResponse() processes completion event
 * - No page reload, just content swap
 */

const ActivatedCustomerKYCScreen = {
  /**
   * Current state (replaces React useState)
   */
  state: {
    userID: '',
    sessionID: '',
    isProcessing: false,
    kycResult: null
  },

  /**
   * Called when screen content is loaded into #app-content
   *
   * @param {Object} params - Navigation parameters
   * @param {string} params.userID - User identifier
   * @param {string} params.sessionID - Session ID from SDK
   * @param {Object} params.kycResult - KYC completion result (if returning from workflow)
   */
  onContentLoaded(params) {
    console.log('ActivatedCustomerKYCScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Store state from params
    this.state = {
      userID: params.userID || '',
      sessionID: params.sessionID || '',
      isProcessing: false,
      kycResult: params.kycResult || null
    };

    // Setup DOM event listeners and SDK event handler
    this.setupEventListeners();

    // If returning with KYC result, display it
    if (this.state.kycResult) {
      this.displayKYCResult(this.state.kycResult);
    }
  },

  /**
   * Attach event listeners to DOM elements and register SDK event handler
   */
  setupEventListeners() {
    const menuBtn = document.getElementById('kyc-menu-btn');
    const startKYCBtn = document.getElementById('start-kyc-btn');

    if (menuBtn) {
      menuBtn.onclick = () => {
        console.log('ActivatedCustomerKYCScreen - Menu button clicked, opening drawer');
        NavigationService.openDrawer();
      };
    }

    if (startKYCBtn) {
      startKYCBtn.onclick = () => {
        this.handleStartKYC();
      };
    }

    // CRITICAL: Register screen-level event handler for KYC completion
    // This handler persists across the entire IDV workflow and receives the final result
    const eventManager = rdnaIDVService.getEventManager();
    eventManager.setActivatedCustomerKYCResponseHandler(
      this.handleActivatedCustomerKYCResponse.bind(this)
    );

    console.log('ActivatedCustomerKYCScreen - Event handler registered for onIDVActivatedCustomerKYCResponse');
  },

  /**
   * Handle "Start KYC Verification" button click
   *
   * Initiates the post-login KYC workflow by calling initiateActivatedCustomerKYC.
   * This triggers the IDV flow: document scan → selfie → biometric consent.
   */
  async handleStartKYC() {
    if (this.state.isProcessing) {
      console.log('ActivatedCustomerKYCScreen - KYC already in progress, ignoring button click');
      return;
    }

    console.log('ActivatedCustomerKYCScreen - Starting KYC verification');
    this.setProcessing(true);
    this.hideStatusBanner();

    try {
      const syncResponse = await rdnaIDVService.initiateActivatedCustomerKYC('Post Login KYC');
      console.log('ActivatedCustomerKYCScreen - initiateActivatedCustomerKYC sync response:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // Sync response successful - SDK will trigger IDV events
      console.log('ActivatedCustomerKYCScreen - KYC initiated, IDV workflow will begin automatically');

      // Note: The actual result will come via onIDVActivatedCustomerKYCResponse event
      // after the entire IDV workflow (document + selfie + consent) completes

    } catch (error) {
      console.error('ActivatedCustomerKYCScreen - initiateActivatedCustomerKYC error:', error);
      this.setProcessing(false);

      const errorMessage = error.error?.errorString || 'Failed to initiate KYC verification';
      this.showStatusBanner(errorMessage, 'error');
    }
  },

  /**
   * Handle onIDVActivatedCustomerKYCResponse event
   *
   * This event is fired TWICE during the flow:
   * 1. First fire: After initiateActivatedCustomerKYC is called (workflow initiated)
   * 2. Second fire: After the complete IDV workflow finishes (final result)
   *
   * We only navigate back and display results on the SECOND fire (when we have final status).
   *
   * @param {Object} data - KYC response event data
   * @param {string} data.userID - User identifier
   * @param {string} data.sessionID - Session ID
   * @param {string} data.reason - KYC reason
   * @param {Object} data.status - Status object with statusCode and statusMessage
   * @param {Object} data.error - Error object with longErrorCode and errorString
   */
  handleActivatedCustomerKYCResponse(data) {
    console.log('ActivatedCustomerKYCScreen - onIDVActivatedCustomerKYCResponse event received:', JSON.stringify(data, null, 2));

    // First fire: Workflow initiated (no status object yet, just error code validation)
    // We log this but don't navigate or display anything
    if (!data.status || (!data.status.statusCode && data.error?.longErrorCode === 0)) {
      console.log('ActivatedCustomerKYCScreen - KYC workflow initiated (first event), IDV flow will continue');
      return;
    }

    // Second fire: Final result (has status object with statusCode)
    console.log('ActivatedCustomerKYCScreen - Final KYC result received, navigating back to screen');

    // Navigate back to this screen with the result
    // This will trigger onContentLoaded with kycResult in params
    NavigationService.navigate('ActivatedCustomerKYC', {
      userID: this.state.userID,
      sessionID: this.state.sessionID,
      kycResult: data
    });
  },

  /**
   * Display KYC result (success or error) with modal dialog
   *
   * Shows a confirm/alert dialog matching React Native's Alert.alert() pattern:
   * - Error checking priority:
   *   1. First check error.longErrorCode - if not 0, it's a sync error
   *   2. Then check status.statusCode - if exists and NOT 100 or 0, it's a backend error
   *   3. Otherwise it's success
   *
   * @param {Object} data - KYC result data from event
   */
  displayKYCResult(data) {
    console.log('ActivatedCustomerKYCScreen - Displaying KYC result');
    this.setProcessing(false);

    const errorCode = data.error?.longErrorCode;
    const errorString = data.error?.errorString;
    const statusCode = data.status?.statusCode;
    const statusMessage = data.status?.statusMessage;

    console.log('ActivatedCustomerKYCScreen - Response validation:', JSON.stringify({
      errorCode,
      errorString,
      statusCode,
      statusMessage
    }, null, 2));

    // Small delay to ensure navigation completes before showing modal
    setTimeout(() => {
      // Check for sync error first
      if (errorCode !== 0) {
        // Sync error case
        console.error('ActivatedCustomerKYCScreen - Sync error detected:', errorCode);

        alert(
          'Error\n\n' +
          `KYC initiation failed: ${errorString || 'Failed to initiate KYC verification'} (${errorCode})\n\n` +
          'Click OK to go to Dashboard.'
        );

        console.log('ActivatedCustomerKYCScreen - Navigating to Dashboard after sync error');
        NavigationService.navigate('Dashboard', this.state);
      } else if (statusCode && statusCode !== 100 && statusCode !== 0) {
        // Backend error case (status code exists and is not 100 or 0)
        console.error('ActivatedCustomerKYCScreen - Backend error detected:', statusCode);

        alert(
          'Error\n\n' +
          `KYC initiation failed: ${statusMessage || 'Failed to initiate KYC verification'} (${statusCode})\n\n` +
          'Click OK to go to Dashboard.'
        );

        console.log('ActivatedCustomerKYCScreen - Navigating to Dashboard after backend error');
        NavigationService.navigate('Dashboard', this.state);
      } else {
        // Success case
        console.log('ActivatedCustomerKYCScreen - The KYC process has been completed successfully');

        alert(
          'Success\n\n' +
          `The KYC process has been completed successfully. ${statusMessage || ''}\n\n` +
          'Click OK to go to Dashboard.'
        );

        console.log('ActivatedCustomerKYCScreen - Navigating to Dashboard');
        NavigationService.navigate('Dashboard', this.state);
      }
    }, 300);

    // Clear kycResult from state after displaying
    this.state.kycResult = null;
  },

  /**
   * Show status banner with message
   *
   * @param {string} message - Message to display
   * @param {string} type - Banner type ('success' or 'error')
   */
  showStatusBanner(message, type) {
    const statusBanner = document.getElementById('kyc-status-banner');
    const statusMessage = document.getElementById('kyc-status-message');

    if (statusBanner && statusMessage) {
      statusMessage.textContent = message;

      // Remove existing type classes
      statusBanner.classList.remove('status-banner-success', 'status-banner-error');

      // Add appropriate type class
      if (type === 'success') {
        statusBanner.classList.add('status-banner-success');
      } else if (type === 'error') {
        statusBanner.classList.add('status-banner-error');
      }

      statusBanner.style.display = 'block';
    }
  },

  /**
   * Hide status banner
   */
  hideStatusBanner() {
    const statusBanner = document.getElementById('kyc-status-banner');
    if (statusBanner) {
      statusBanner.style.display = 'none';
    }
  },

  /**
   * Set processing state
   *
   * @param {boolean} isProcessing - Whether KYC is processing
   */
  setProcessing(isProcessing) {
    this.state.isProcessing = isProcessing;

    // Disable/enable start button during processing
    const startKYCBtn = document.getElementById('start-kyc-btn');
    if (startKYCBtn) {
      startKYCBtn.disabled = isProcessing;
      startKYCBtn.textContent = isProcessing ? 'Processing...' : 'Start KYC Verification';
      startKYCBtn.style.opacity = isProcessing ? '0.6' : '1';
    }
  }
};

// Expose to global scope for NavigationService
window.ActivatedCustomerKYCScreen = ActivatedCustomerKYCScreen;
