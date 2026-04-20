/**
 * Additional Document Scan Screen
 *
 * Entry point screen for initiating additional document scan workflow.
 * Allows users to provide supplementary identity verification documents after initial verification.
 *
 * This screen:
 * - Displays information about additional document scan requirements
 * - Provides guidelines on acceptable document types
 * - Initiates the additional document scan process via initiateIDVAdditionalDocumentScan API
 * - Handles screen-level event listener for onIDVAdditionalDocumentScan
 * - Shows success/error modals based on the workflow result
 *
 * Workflow Steps:
 * 1. User taps "Start Additional Document Scan" button
 * 2. initiateIDVAdditionalDocumentScan API is called
 * 3. SDK triggers getIDVDocumentScanProcessStartConfirmation event (handled by global provider)
 * 4. User scans document using native SDK UI
 * 5. SDK triggers onIDVAdditionalDocumentScan event (handled by this screen's event handler)
 * 6. Screen-level handler navigates to IDVAdditionalDocumentScanResult screen
 * 7. Success/error modal is displayed with navigation back to Dashboard
 *
 * Event Handler Strategy:
 * - Global provider (SDKIDVEventProvider) handles document scan start navigation
 * - Screen-level handler (this screen) handles final result and displays modals
 * - Both handlers coexist to provide complete flow handling
 *
 * SPA Lifecycle:
 * - onContentLoaded(params): Called when screen content is loaded into #app-content
 * - setupEventListeners(): Registers screen-level event handler (persists across navigation)
 * - Event handler remains active even when user navigates to other screens
 */

const AdditionalDocumentScanScreen = {
  // Local state (replaces React useState)
  state: {
    isInitiating: false,
    showModal: false,
    modalTitle: '',
    modalMessage: '',
    isSuccess: false
  },

  /**
   * Lifecycle hook called when screen content is loaded
   * Replaces React's componentDidMount / useEffect
   *
   * @param {Object} params - Navigation parameters
   */
  onContentLoaded(params) {
    console.log('AdditionalDocumentScanScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Reset state for fresh start
    this.state = {
      isInitiating: false,
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      isSuccess: false
    };

    // Setup event listeners (button clicks + screen-level SDK event handler)
    this.setupEventListeners();

    // Hide any existing modal
    this.hideModal();
  },

  /**
   * Setup event listeners
   * - Button click handlers
   * - Screen-level SDK event handler for onIDVAdditionalDocumentScan
   *
   * IMPORTANT: Screen-level event handler persists across navigation.
   * It will receive events even when user navigates to other screens during the workflow.
   */
  setupEventListeners() {
    console.log('AdditionalDocumentScanScreen - Setting up event listeners');

    // Menu button click handler (open drawer)
    const menuBtn = document.getElementById('additional-doc-scan-menu-btn');
    if (menuBtn) {
      menuBtn.onclick = () => {
        console.log('AdditionalDocumentScanScreen - Menu button clicked');
        NavigationService.openDrawer();
      };
    }

    // Start button click handler
    const startBtn = document.getElementById('start-additional-document-scan-btn');
    if (startBtn) {
      startBtn.onclick = () => this.handleStartAdditionalDocumentScan();
    }

    // Modal close button handler
    const modalCloseBtn = document.getElementById('additional-document-scan-modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.onclick = () => this.handleModalClose();
    }

    // Register screen-level event handler for onIDVAdditionalDocumentScan
    // This handler persists even when user navigates away from this screen
    console.log('AdditionalDocumentScanScreen - Registering screen-level event handler');
    const eventManager = rdnaIDVService.getEventManager();
    eventManager.setAdditionalDocumentScanHandler(this.handleAdditionalDocumentScanResponse.bind(this));
  },

  /**
   * Handles additional document scan response event
   *
   * This is a screen-level event handler that:
   * - Navigates to IDVAdditionalDocumentScanResult screen to display extracted document data
   * - Passes the event data containing OCR results, validation results, and confidence scores
   * - On errors, navigates back to this screen and displays error modal
   *
   * Error Handling Strategy (Dual Validation):
   *
   * SUPPRESSED ERRORS (No modal shown):
   * - Error code 146: User canceled IDV flow → Silent return
   * - Error code 241: User canceled document scan → Silent return
   *
   * SHOWN ERRORS (Modal displayed to user):
   * - Error code ≠ 0 (except 146, 241): SDK/API errors → "Document Scan Failed" modal
   * - Status code ≠ 100 and ≠ 0: Backend validation errors → "Verification Failed" modal
   *
   * SUCCESS:
   * - Error code = 0 AND Status code = 100 or 0 → Navigate to result screen
   *
   * @param {Object} data - Additional document scan event data
   */
  handleAdditionalDocumentScanResponse(data) {
    console.log('AdditionalDocumentScanScreen - Additional document scan response received');
    console.log('AdditionalDocumentScanScreen - User ID:', data.userID);
    console.log('AdditionalDocumentScanScreen - Session ID:', data.sessionID);
    console.log('AdditionalDocumentScanScreen - Reason:', data.reason);
    console.log('AdditionalDocumentScanScreen - Error Code:', data.error?.longErrorCode);
    console.log('AdditionalDocumentScanScreen - Status Code:', data.status?.statusCode);
    console.log('AdditionalDocumentScanScreen - Status Message:', data.status?.statusMessage);

    const errorCode = data.error?.longErrorCode;
    const statusCode = data.status?.statusCode;
    const statusMessage = data.status?.statusMessage || 'Unknown status';
    const errorString = data.error?.errorString || 'Unknown error';

    // Dual Validation Pattern:
    // 1st Check: Sync error (error.longErrorCode !== 0)
    // 2nd Check: Backend status (statusCode !== 100 && statusCode !== 0)

    if (errorCode !== 0) {
  
      // Sync error - API call failed (REAL ERROR - WILL SHOW MODAL)
      console.log('AdditionalDocumentScanScreen - REAL ERROR detected (Error Code: ' + errorCode + ')');
      console.log('AdditionalDocumentScanScreen - Error message:', errorString);
      console.log('AdditionalDocumentScanScreen - WILL SHOW ERROR MODAL to user');

      // Navigate back to this screen
      NavigationService.navigate('AdditionalDocumentScan');

      // Show error modal after navigation
      setTimeout(() => {
        this.state.modalTitle = 'Document Scan Failed';
        this.state.modalMessage = `Unable to complete document scan.\n\n${errorString}\n\n(Error Code: ${errorCode})`;
        this.state.isSuccess = false;
        this.showModal();
        console.log('AdditionalDocumentScanScreen - Error modal displayed to user');
      }, 300);

    } else if (statusCode && statusCode !== 100 && statusCode !== 0) {
      // Backend error - workflow failed (REAL ERROR - WILL SHOW MODAL)
      console.log('AdditionalDocumentScanScreen - BACKEND ERROR detected (Status Code: ' + statusCode + ')');
      console.log('AdditionalDocumentScanScreen - Status message:', statusMessage);
      console.log('AdditionalDocumentScanScreen - WILL SHOW ERROR MODAL to user');

      // Navigate back to this screen
      NavigationService.navigate('AdditionalDocumentScan');

      // Show error modal after navigation
      setTimeout(() => {
        this.state.modalTitle = 'Verification Failed';
        this.state.modalMessage = `The document scan could not be completed.\n\n${statusMessage}\n\n(Status Code: ${statusCode})`;
        this.state.isSuccess = false;
        this.showModal();
        console.log('AdditionalDocumentScanScreen - Error modal displayed to user');
      }, 300);

    } else {
      // Success - navigate to result screen to display document data
      console.log('AdditionalDocumentScanScreen - Document scan successful, navigating to result screen');
      console.log('AdditionalDocumentScanScreen - Document Type:', data.idvResponse?.document_type);
      console.log('AdditionalDocumentScanScreen - Overall Confidence:', data.idvResponse?.confidence_scores?.overall_confidence);

      // Navigate to result screen with document data
      NavigationService.navigate('IDVAdditionalDocumentScanResult', {
        challengeMode: data.challengeMode,
        eventData: data
      });
    }
  },

  /**
   * Initiates additional document scan workflow
   *
   * Calls initiateIDVAdditionalDocumentScan API with reason "Additional Document Verification".
   * On success, the SDK will automatically trigger the document scan workflow:
   * 1. getIDVDocumentScanProcessStartConfirmation (handled by global provider)
   * 2. Native document capture UI
   * 3. onIDVAdditionalDocumentScan event (handled by screen-level handler)
   */
  async handleStartAdditionalDocumentScan() {
    console.log('AdditionalDocumentScanScreen - Starting additional document scan');
    this.setInitiating(true);

    try {
      const reason = 'Additional Document Verification';
      console.log('AdditionalDocumentScanScreen - Calling initiateIDVAdditionalDocumentScan with reason:', reason);

      const syncResponse = await rdnaIDVService.initiateIDVAdditionalDocumentScan(reason);
      console.log('AdditionalDocumentScanScreen - InitiateIDVAdditionalDocumentScan sync response successful');
      console.log('AdditionalDocumentScanScreen - Sync response:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // Sync success means API accepted the request
      // The workflow will continue via SDK events handled by event manager
      console.log('AdditionalDocumentScanScreen - Additional document scan workflow initiated, waiting for SDK events');

    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('AdditionalDocumentScanScreen - InitiateIDVAdditionalDocumentScan sync error:', error);

      const errorMessage = error.error?.errorString || 'Failed to initiate additional document scan';

      // Show error alert
      alert(`Additional Document Scan Error\n\n${errorMessage}`);

    } finally {
      this.setInitiating(false);
    }
  },

  /**
   * Sets initiating state and updates button UI
   *
   * @param {boolean} isInitiating - Whether the API call is in progress
   */
  setInitiating(isInitiating) {
    this.state.isInitiating = isInitiating;

    const btn = document.getElementById('start-additional-document-scan-btn');
    const btnText = document.getElementById('start-additional-document-scan-btn-text');
    const btnLoader = document.getElementById('start-additional-document-scan-btn-loader');

    if (btn) {
      btn.disabled = isInitiating;
      btn.classList.toggle('loading', isInitiating);
    }

    if (btnText) {
      btnText.style.display = isInitiating ? 'none' : 'inline';
    }

    if (btnLoader) {
      btnLoader.style.display = isInitiating ? 'inline' : 'none';
    }
  },

  /**
   * Shows the modal with current state values
   */
  showModal() {
    this.state.showModal = true;

    const modal = document.getElementById('additional-document-scan-modal');
    const title = document.getElementById('additional-document-scan-modal-title');
    const message = document.getElementById('additional-document-scan-modal-message');

    if (modal) modal.style.display = 'flex';
    if (title) title.textContent = this.state.modalTitle;
    if (message) message.textContent = this.state.modalMessage;
  },

  /**
   * Hides the modal
   */
  hideModal() {
    this.state.showModal = false;

    const modal = document.getElementById('additional-document-scan-modal');
    if (modal) modal.style.display = 'none';
  },

  /**
   * Handles modal close button press
   * Navigates back to Dashboard after workflow completion
   */
  handleModalClose() {
    console.log('AdditionalDocumentScanScreen - Modal closed, navigating to Dashboard');
    this.hideModal();
    NavigationService.navigate('Dashboard');
  }
};

// Expose to global scope for NavigationService
window.AdditionalDocumentScanScreen = AdditionalDocumentScanScreen;
