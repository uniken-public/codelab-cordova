/**
 * Server Biometric Authentication Screen
 *
 * Entry point screen for initiating server-side biometric authentication workflow.
 * Allows users to authenticate using biometric verification with liveness detection and face matching.
 *
 * This screen:
 * - Checks if user biometric template exists on server using checkIDVUserBiometricTemplateStatus API
 * - Displays template status to inform user about biometric availability
 * - Provides guidelines on biometric authentication process
 * - Initiates the server biometric authentication via initiateIDVServerBiometricAuthentication API
 * - Handles screen-level event listeners for template status and authentication result
 * - Shows success/error modals based on the workflow result
 *
 * Workflow Steps:
 * 1. Screen loads and checks biometric template status
 * 2. Displays whether user has opted in for biometric (template exists or not)
 * 3. User taps "Start Authentication" button
 * 4. initiateIDVServerBiometricAuthentication API is called
 * 5. SDK captures live selfie and performs server-side verification
 * 6. SDK triggers onIDVServerBiometricAuthenticationResult event
 * 7. Screen-level handler displays authentication result modal with audit details
 *
 * Event Handler Strategy:
 * - Screen-level handler for onIDVCheckUserBiometricTemplateStatus displays template status
 * - Screen-level handler for onIDVServerBiometricAuthenticationResult shows result modal
 * - Both handlers registered on screen load and persist for screen lifecycle
 * - Handlers stay active even when other screens are on top (e.g., during selfie capture)
 *
 * SPA Pattern (matches AdditionalDocumentScanScreen):
 * - Uses onContentLoaded() instead of componentDidMount
 * - Registers event handlers when screen is loaded
 * - Handlers persist for the entire session (critical for native UI workflows)
 * - Modal close button navigates to Dashboard
 */

const ServerBiometricAuthenticationScreen = {
  // Local state (replaces React useState)
  state: {
    isCheckingStatus: false,
    isAuthenticating: false,
    templateStatus: {
      checked: false,
      exists: false,
      statusCode: 0,
      statusMessage: ''
    },
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
    console.log('ServerBiometricAuthenticationScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Reset state for fresh start
    this.state = {
      isCheckingStatus: false,
      isAuthenticating: false,
      templateStatus: {
        checked: false,
        exists: false,
        statusCode: 0,
        statusMessage: ''
      },
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      isSuccess: false
    };

    // Setup event listeners (button clicks + screen-level SDK event handler)
    this.setupEventListeners();

    // Hide any existing modal
    this.hideModal();

    // Check template status on load
    this.checkTemplateStatus();
  },

  /**
   * Setup event listeners
   * - Button click handlers
   * - Modal button handlers
   * - Screen-level SDK event handlers
   *
   * IMPORTANT: Screen-level event handlers persist across navigation.
   * They will receive events even when user navigates to other screens during the workflow.
   */
  setupEventListeners() {
    console.log('ServerBiometricAuthenticationScreen - Setting up event listeners');

    // Menu button click handler (open drawer)
    const menuBtn = document.getElementById('server-biometric-menu-button');
    if (menuBtn) {
      menuBtn.onclick = () => {
        console.log('ServerBiometricAuthenticationScreen - Menu button clicked');
        NavigationService.openDrawer();
      };
    }

    // Start button click handler
    const startBtn = document.getElementById('start-authentication-button');
    if (startBtn) {
      startBtn.onclick = () => this.handleStartAuthentication();
    }

    // Modal OK button handler
    const modalOkBtn = document.getElementById('server-biometric-modal-ok-btn');
    if (modalOkBtn) {
      modalOkBtn.onclick = () => this.handleModalClose();
    }

    // Modal Dashboard button handler
    const modalDashboardBtn = document.getElementById('server-biometric-modal-dashboard-btn');
    if (modalDashboardBtn) {
      modalDashboardBtn.onclick = () => this.handleModalDashboard();
    }

    // Register screen-level event handlers
    // These handlers persist even when user navigates away from this screen
    console.log('ServerBiometricAuthenticationScreen - Registering screen-level event handlers');
    const eventManager = rdnaIDVService.getEventManager();
    eventManager.setCheckUserBiometricTemplateStatusHandler(this.handleCheckUserBiometricTemplateStatusResponse.bind(this));
    eventManager.setServerBiometricAuthenticationResultHandler(this.handleServerBiometricAuthenticationResultResponse.bind(this));
  },

  /**
   * Handles check user biometric template status response event
   *
   * Status Codes:
   * - 100 = Template present
   * - 600 = Template does not exist
   * - 400/500 = Error
   *
   * @param {Object} data - Event data containing template status
   */
  handleCheckUserBiometricTemplateStatusResponse(data) {
    console.log('ServerBiometricAuthenticationScreen - Check user biometric template status response received');
    console.log('ServerBiometricAuthenticationScreen - User ID:', data.userID);
    console.log('ServerBiometricAuthenticationScreen - Status Code:', data.status?.statusCode);
    console.log('ServerBiometricAuthenticationScreen - Status Message:', data.status?.statusMessage);
    console.log('ServerBiometricAuthenticationScreen - Error Code:', data.error?.longErrorCode);

    const errorCode = data.error?.longErrorCode;
    const statusCode = data.status?.statusCode;
    const statusMessage = data.status?.statusMessage || 'Unknown status';

    // First check: error code
    if (errorCode !== 0) {
      console.log('ServerBiometricAuthenticationScreen - Error checking template status:', errorCode);
      this.state.templateStatus = {
        checked: true,
        exists: false,
        statusCode: statusCode || 0,
        statusMessage: `Error: ${data.error?.errorString}`
      };
      this.updateTemplateStatusUI();
      this.setCheckingStatus(false);
      return;
    }

    // Second check: status code
    if (statusCode === 100) {
      // Template present
      console.log('ServerBiometricAuthenticationScreen - Template exists');
      this.state.templateStatus = {
        checked: true,
        exists: true,
        statusCode: statusCode,
        statusMessage: statusMessage
      };
    } else if (statusCode === 600) {
      // Template does not exist
      console.log('ServerBiometricAuthenticationScreen - Template does not exist');
      this.state.templateStatus = {
        checked: true,
        exists: false,
        statusCode: statusCode,
        statusMessage: statusMessage
      };
    } else {
      // Other status codes (400/500 = error)
      console.log('ServerBiometricAuthenticationScreen - Status error:', statusCode);
      this.state.templateStatus = {
        checked: true,
        exists: false,
        statusCode: statusCode || 0,
        statusMessage: statusMessage
      };
    }

    this.updateTemplateStatusUI();
    this.setCheckingStatus(false);
  },

  /**
   * Handles server biometric authentication result event
   *
   * This is a screen-level event handler that:
   * - Navigates back to ServerBiometricAuthentication screen
   * - Checks error first
   * - Then checks status code (0 = success)
   * - Parses idvResponse to check idv_audit_info.status
   * - Displays result modal after navigation completes
   *
   * Status Codes:
   * - 0 = Success
   * - Other = Error
   *
   * @param {Object} data - Event data containing authentication result
   */
  handleServerBiometricAuthenticationResultResponse(data) {
    console.log('ServerBiometricAuthenticationScreen - Server biometric authentication result received');
    console.log('ServerBiometricAuthenticationScreen - User ID:', data.userID);
    console.log('ServerBiometricAuthenticationScreen - Attempts Left:', data.attemptsLeft);
    console.log('ServerBiometricAuthenticationScreen - Challenge Mode:', data.challengeMode);
    console.log('ServerBiometricAuthenticationScreen - Status Code:', data.status?.statusCode);
    console.log('ServerBiometricAuthenticationScreen - Status Message:', data.status?.statusMessage);
    console.log('ServerBiometricAuthenticationScreen - Error Code:', data.error?.longErrorCode);

    const errorCode = data.error?.longErrorCode;
    const statusCode = data.status?.statusCode;

    // Reset button state
    this.setAuthenticating(false);

    // Navigate back to ServerBiometricAuthentication screen
    console.log('ServerBiometricAuthenticationScreen - Navigating back to ServerBiometricAuthentication screen');
    NavigationService.navigate('ServerBiometricAuthentication');

    // Small delay to ensure navigation completes before showing modal
    setTimeout(() => {
      // First check: error code
      if (errorCode !== 0) {
        console.log('ServerBiometricAuthenticationScreen - Error in authentication:', errorCode);
        this.state.modalTitle = 'Authentication Error';
        this.state.modalMessage = `${data.error?.errorString}\n\n(Error Code: ${errorCode})`;
        this.state.isSuccess = false;
        this.showModal();
        console.log('ServerBiometricAuthenticationScreen - Error modal displayed to user');
        return;
      }

      // Second check: status code (0 = success or 100 = success)
      if (statusCode && statusCode !== 100 && statusCode !== 0) {
        console.log('ServerBiometricAuthenticationScreen - Status error:', statusCode);
        this.state.modalTitle = 'Authentication Failed';
        this.state.modalMessage = `Status Code: ${statusCode}`;
        this.state.isSuccess = false;
        this.showModal();
        console.log('ServerBiometricAuthenticationScreen - Status error modal displayed to user');
        return;
      }

      // Success - parse idvResponse to check audit status
      try {
        const idvResponseObj = JSON.parse(data.idvResponse);
        console.log('ServerBiometricAuthenticationScreen - Parsed authentication result:', JSON.stringify(idvResponseObj, null, 2));

        const auditStatus = idvResponseObj.idv_audit_info?.status;
        const orchestrationUseCase = idvResponseObj.idv_audit_info?.orchestration_use_case;
        const transactionId = idvResponseObj.idv_audit_info?.idv_audit_transaction_id;
        const attemptsLeft = idvResponseObj.attempts_left;

        if (auditStatus === 'SUCCESS') {
          this.state.modalTitle = '✅ Authentication Success';
          this.state.modalMessage = `Audit Status: ${auditStatus}\n\nUse Case: ${orchestrationUseCase || 'N/A'}\nTransaction ID: ${transactionId || 'N/A'}\nAttempts Left: ${attemptsLeft}`;
          this.state.isSuccess = true;
          this.showModal();
          console.log('ServerBiometricAuthenticationScreen - Success modal displayed to user');
        } else {
          this.state.modalTitle = '❌ Authentication Failed';
          this.state.modalMessage = `Audit Status: ${auditStatus || 'Unknown'}\n\nUse Case: ${orchestrationUseCase || 'N/A'}\nTransaction ID: ${transactionId || 'N/A'}\nAttempts Left: ${attemptsLeft}`;
          this.state.isSuccess = false;
          this.showModal();
          console.log('ServerBiometricAuthenticationScreen - Failure modal displayed to user');
        }
      } catch (error) {
        console.error('ServerBiometricAuthenticationScreen - Failed to parse authentication result:', error);
        this.state.modalTitle = 'Authentication Complete';
        this.state.modalMessage = 'Authentication completed successfully';
        this.state.isSuccess = true;
        this.showModal();
        console.log('ServerBiometricAuthenticationScreen - Default success modal displayed');
      }
    }, 300);
  },

  /**
   * Checks if user biometric template exists on server
   */
  async checkTemplateStatus() {
    console.log('ServerBiometricAuthenticationScreen - Checking biometric template status');
    this.setCheckingStatus(true);

    try {
      const syncResponse = await rdnaIDVService.checkIDVUserBiometricTemplateStatus();
      console.log('ServerBiometricAuthenticationScreen - CheckIDVUserBiometricTemplateStatus sync response successful');
      console.log('ServerBiometricAuthenticationScreen - Sync response:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // The actual result will come via onIDVCheckUserBiometricTemplateStatus event
      console.log('ServerBiometricAuthenticationScreen - Waiting for onIDVCheckUserBiometricTemplateStatus event');

    } catch (error) {
      console.error('ServerBiometricAuthenticationScreen - CheckIDVUserBiometricTemplateStatus sync error:', error);

      const errorMessage = error.error?.errorString || 'Unknown error';

      this.state.templateStatus = {
        checked: true,
        exists: false,
        statusCode: 0,
        statusMessage: `Error: ${errorMessage}`
      };
      this.updateTemplateStatusUI();
      this.setCheckingStatus(false);

      // Show error modal
      this.state.modalTitle = 'Template Status Check Error';
      this.state.modalMessage = `Failed to check template status.\n\n${errorMessage}`;
      this.state.isSuccess = false;
      this.showModal();
    }
  },

  /**
   * Initiates server biometric authentication workflow
   */
  async handleStartAuthentication() {
    console.log('ServerBiometricAuthenticationScreen - Starting server biometric authentication');
    this.setAuthenticating(true);

    try {
      const reason = 'Server Biometric Authentication';
      console.log('ServerBiometricAuthenticationScreen - Calling initiateIDVServerBiometricAuthentication with reason:', reason);

      const syncResponse = await rdnaIDVService.initiateIDVServerBiometricAuthentication(reason);
      console.log('ServerBiometricAuthenticationScreen - InitiateIDVServerBiometricAuthentication sync response successful');
      console.log('ServerBiometricAuthenticationScreen - Sync response:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // Sync success means API accepted the request
      // The authentication result will come via onIDVServerBiometricAuthenticationResult event
      console.log('ServerBiometricAuthenticationScreen - Server biometric authentication initiated, waiting for result event');

    } catch (error) {
      console.error('ServerBiometricAuthenticationScreen - InitiateIDVServerBiometricAuthentication sync error:', error);

      const errorMessage = error.error?.errorString || 'Unknown error';

      // Show error modal
      this.state.modalTitle = 'Authentication Error';
      this.state.modalMessage = `Failed to initiate authentication.\n\n${errorMessage}`;
      this.state.isSuccess = false;
      this.showModal();
      this.setAuthenticating(false);
    }
  },

  /**
   * Sets checking status and updates button UI
   *
   * @param {boolean} isChecking - Whether the status check is in progress
   */
  setCheckingStatus(isChecking) {
    this.state.isCheckingStatus = isChecking;

    const btn = document.getElementById('start-authentication-button');
    if (btn) {
      if (isChecking) {
        btn.textContent = 'Checking Template Status...';
        btn.disabled = true;
      } else {
        btn.textContent = 'Start Authentication';
        btn.disabled = this.state.isAuthenticating || !this.state.templateStatus.exists;
      }
    }
  },

  /**
   * Sets authenticating state and updates button UI
   *
   * @param {boolean} isAuth - Whether authentication is in progress
   */
  setAuthenticating(isAuth) {
    this.state.isAuthenticating = isAuth;

    const btn = document.getElementById('start-authentication-button');
    if (btn) {
      if (isAuth) {
        btn.textContent = 'Authenticating...';
        btn.disabled = true;
      } else {
        btn.textContent = 'Start Authentication';
        btn.disabled = this.state.isCheckingStatus || !this.state.templateStatus.exists;
      }
    }
  },

  /**
   * Updates template status UI section
   */
  updateTemplateStatusUI() {
    const statusSection = document.getElementById('template-status-section');
    if (!statusSection) return;

    if (this.state.templateStatus.checked) {
      statusSection.style.display = 'block';

      const statusTitle = document.getElementById('template-status-title');
      const statusText = document.getElementById('template-status-text');
      const statusCode = document.getElementById('template-status-code');
      const disabledNote = document.getElementById('disabled-note');

      if (statusTitle) {
        statusTitle.textContent = this.state.templateStatus.exists
          ? '✅ Biometric Template Status'
          : '⚠️ Biometric Template Status';
      }

      if (statusText) {
        statusText.textContent = this.state.templateStatus.exists
          ? 'Your biometric template is stored on the server. You can proceed with authentication.'
          : 'No biometric template found on the server. Please complete biometric opt-in first.';
      }

      if (statusCode) {
        statusCode.textContent = `Status: ${this.state.templateStatus.statusMessage} (Code: ${this.state.templateStatus.statusCode})`;
      }

      // Show/hide disabled note
      if (disabledNote) {
        disabledNote.style.display = !this.state.templateStatus.exists ? 'block' : 'none';
      }

      // Update button state
      const startButton = document.getElementById('start-authentication-button');
      if (startButton) {
        startButton.disabled = this.state.isAuthenticating || this.state.isCheckingStatus || !this.state.templateStatus.exists;
      }
    } else {
      statusSection.style.display = 'none';
    }
  },

  /**
   * Shows the modal with current state values
   */
  showModal() {
    this.state.showModal = true;

    const modal = document.getElementById('server-biometric-modal');
    const title = document.getElementById('server-biometric-modal-title');
    const message = document.getElementById('server-biometric-modal-message');
    const okBtn = document.getElementById('server-biometric-modal-ok-btn');
    const dashboardBtn = document.getElementById('server-biometric-modal-dashboard-btn');

    if (modal) modal.style.display = 'flex';
    if (title) title.textContent = this.state.modalTitle;
    if (message) message.textContent = this.state.modalMessage;

    // Show appropriate button based on success state
    if (this.state.isSuccess) {
      // Show Dashboard button, hide OK button
      if (okBtn) okBtn.style.display = 'none';
      if (dashboardBtn) dashboardBtn.style.display = 'inline-block';
    } else {
      // Show OK button, hide Dashboard button
      if (okBtn) okBtn.style.display = 'inline-block';
      if (dashboardBtn) dashboardBtn.style.display = 'none';
    }
  },

  /**
   * Hides the modal
   */
  hideModal() {
    this.state.showModal = false;

    const modal = document.getElementById('server-biometric-modal');
    if (modal) modal.style.display = 'none';
  },

  /**
   * Handles modal OK button press
   * Closes modal and stays on current screen
   */
  handleModalClose() {
    console.log('ServerBiometricAuthenticationScreen - Modal OK button clicked');
    this.hideModal();
  },

  /**
   * Handles modal Dashboard button press
   * Navigates to Dashboard after successful authentication
   */
  handleModalDashboard() {
    console.log('ServerBiometricAuthenticationScreen - Modal Dashboard button clicked, navigating to Dashboard');
    this.hideModal();
    NavigationService.navigate('Dashboard');
  }
};

// Expose to global scope for NavigationService
window.ServerBiometricAuthenticationScreen = ServerBiometricAuthenticationScreen;
