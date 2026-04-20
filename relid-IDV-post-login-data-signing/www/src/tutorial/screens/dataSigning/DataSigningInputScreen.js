/**
 * Data Signing Input Screen
 * Screen for collecting data signing parameters from user
 *
 * User Flow:
 * 1. User fills form: payload, auth level, authenticator type, reason
 * 2. User clicks "Sign Data" button
 * 3. Form validation runs
 * 4. DataSigningService.signData() called
 * 5. SDK may trigger getPassword event (step-up authentication)
 * 6. Password modal appears if authentication needed
 * 7. After authentication, SDK triggers onAuthenticateUserAndSignData event
 * 8. Screen receives signing results
 * 9. Navigate to DataSigningResultScreen with results
 *
 * SPA Lifecycle:
 * - onContentLoaded(params) - Called when template loaded
 * - setupEventListeners() - Attach form handlers
 * - registerSDKEventHandlers() - Register data signing response handler
 * - cleanup() - Clean up when navigating away
 */

const DataSigningInputScreen = {
  // Form state
  payload: '',
  selectedAuthLevel: '',
  selectedAuthenticatorType: '',
  reason: '',
  isLoading: false,
  errorMessage: '',

  // Session info (for drawer navigation)
  userID: '',
  sessionID: '',

  // Signing response data
  signingResponse: null,

  // Original handlers (for preservation pattern)
  originalGetPasswordHandler: null,
  originalDataSigningHandler: null,

  /**
   * Called when screen content is loaded (SPA lifecycle)
   * @param {Object} params - Navigation parameters
   */
  onContentLoaded(params) {
    console.log('DataSigningInputScreen - Content loaded', JSON.stringify(params, null, 2));

    // Store session info from params for drawer navigation
    this.userID = params.userID || '';
    this.sessionID = params.sessionID || '';

    // Store session params globally for use across screens (e.g., UpdatePassword)
    if (typeof SDKEventProvider !== 'undefined') {
      SDKEventProvider.setSessionParams(params || {});
    }

    // Reset form state
    this.payload = '';
    this.selectedAuthLevel = '';
    this.selectedAuthenticatorType = '';
    this.reason = '';
    this.isLoading = false;
    this.errorMessage = '';
    this.signingResponse = null;

    // Setup UI
    this.setupEventListeners();
    this.registerSDKEventHandlers();
    this.populateDropdowns();
    this.clearForm();
    this.hideError();
    this.updateCharCounts();
  },

  /**
   * Setup event listeners for form elements
   */
  setupEventListeners() {
    console.log('DataSigningInputScreen - Setting up event listeners');

    // Menu button for opening drawer
    const menuButton = document.getElementById('data-signing-menu-button');
    if (menuButton) {
      menuButton.onclick = () => {
        console.log('DataSigningInputScreen - Opening drawer');
        NavigationService.openDrawer();
      };
    }

    // Drawer navigation links (set up with session params)
    const drawerDashboardLink = document.getElementById('drawer-dashboard-link');
    const drawerNotificationsLink = document.getElementById('drawer-notifications-link');
    const drawerNotificationHistoryLink = document.getElementById('drawer-notification-history-link');
    const drawerDeviceMgmtLink = document.getElementById('drawer-device-mgmt-link');
    const drawerLdaTogglingLink = document.getElementById('drawer-lda-toggling-link');
    const drawerDataSigningLink = document.getElementById('drawer-data-signing-link');
    const drawerUpdatePasswordLink = document.getElementById('drawer-update-password-link');
    const drawerLogoutLink = document.getElementById('drawer-logout-link');

    if (drawerDashboardLink) {
      drawerDashboardLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('DataSigningInputScreen - Navigating to Dashboard');
        NavigationService.navigate('Dashboard', {
          userID: this.userID,
          sessionID: this.sessionID
        });
      };
    }

    if (drawerNotificationsLink) {
      drawerNotificationsLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('DataSigningInputScreen - Navigating to GetNotifications');
        NavigationService.navigate('GetNotifications', {
          userID: this.userID,
          sessionID: this.sessionID
        });
      };
    }

    if (drawerNotificationHistoryLink) {
      drawerNotificationHistoryLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('DataSigningInputScreen - Navigating to NotificationHistory');
        NavigationService.navigate('NotificationHistory', {
          userID: this.userID,
          sessionID: this.sessionID
        });
      };
    }

    if (drawerDeviceMgmtLink) {
      drawerDeviceMgmtLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('DataSigningInputScreen - Navigating to DeviceManagement');
        NavigationService.navigate('DeviceManagement', {
          userID: this.userID,
          sessionID: this.sessionID
        });
      };
    }

    if (drawerLdaTogglingLink) {
      drawerLdaTogglingLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('DataSigningInputScreen - Navigating to LDAToggling');
        NavigationService.navigate('LDAToggling', {
          userID: this.userID,
          sessionID: this.sessionID
        });
      };
    }

    if (drawerDataSigningLink) {
      drawerDataSigningLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        // Already on Data Signing screen, just close drawer
      };
    }

    if (drawerUpdatePasswordLink) {
      drawerUpdatePasswordLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('DataSigningInputScreen - Navigating to UpdatePassword');
        NavigationService.navigate('UpdatePassword', {
          userID: this.userID,
          sessionID: this.sessionID
        });
      };
    }

    if (drawerLogoutLink) {
      drawerLogoutLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('DataSigningInputScreen - Logging out');
        this.handleLogout();
      };
    }

    // Form submit button
    const submitBtn = document.getElementById('data-signing-submit-btn');
    if (submitBtn) {
      submitBtn.onclick = this.handleSubmit.bind(this);
    }

    // Payload input with character count
    const payloadInput = document.getElementById('data-signing-payload');
    if (payloadInput) {
      payloadInput.oninput = () => {
        this.payload = payloadInput.value;
        this.updateCharCounts();
      };
    }

    // Auth level dropdown
    const authLevelSelect = document.getElementById('data-signing-auth-level');
    if (authLevelSelect) {
      authLevelSelect.onchange = () => {
        this.selectedAuthLevel = authLevelSelect.value;
        console.log('DataSigningInputScreen - Auth level selected:', this.selectedAuthLevel);
      };
    }

    // Authenticator type dropdown
    const authenticatorTypeSelect = document.getElementById('data-signing-authenticator-type');
    if (authenticatorTypeSelect) {
      authenticatorTypeSelect.onchange = () => {
        this.selectedAuthenticatorType = authenticatorTypeSelect.value;
        console.log('DataSigningInputScreen - Authenticator type selected:', this.selectedAuthenticatorType);
      };
    }

    // Reason input with character count
    const reasonInput = document.getElementById('data-signing-reason');
    if (reasonInput) {
      reasonInput.oninput = () => {
        this.reason = reasonInput.value;
        this.updateCharCounts();
      };
    }

    console.log('DataSigningInputScreen - Event listeners attached');
  },

  /**
   * Register SDK event handlers for data signing
   */
  registerSDKEventHandlers() {
    console.log('DataSigningInputScreen - Registering SDK event handlers');

    const eventManager = rdnaService.getEventManager();

    // Preserve original data signing handler
    this.originalDataSigningHandler = eventManager.dataSigningResponseHandler;

    // Register data signing response handler
    eventManager.setDataSigningResponseHandler((data) => {
      console.log('DataSigningInputScreen - onAuthenticateUserAndSignData event received');
      this.handleDataSigningResponse(data);
    });

    console.log('DataSigningInputScreen - SDK event handlers registered');
  },

  /**
   * Populate dropdowns with options from DropdownDataService
   */
  populateDropdowns() {
    // Populate auth level dropdown
    const authLevelSelect = document.getElementById('data-signing-auth-level');
    if (authLevelSelect && DropdownDataService) {
      const authLevelOptions = DropdownDataService.getAuthLevelOptions();
      authLevelSelect.innerHTML = '<option value="">Select Authentication Level</option>';
      authLevelOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        authLevelSelect.appendChild(optionElement);
      });
    }

    // Populate authenticator type dropdown
    const authenticatorTypeSelect = document.getElementById('data-signing-authenticator-type');
    if (authenticatorTypeSelect && DropdownDataService) {
      const authenticatorTypeOptions = DropdownDataService.getAuthenticatorTypeOptions();
      authenticatorTypeSelect.innerHTML = '<option value="">Select Authenticator Type</option>';
      authenticatorTypeOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        authenticatorTypeSelect.appendChild(optionElement);
      });
    }
  },

  /**
   * Handle form submission
   */
  async handleSubmit() {
    console.log('DataSigningInputScreen - Submit button clicked');

    // Get current form values
    const payloadInput = document.getElementById('data-signing-payload');
    const authLevelSelect = document.getElementById('data-signing-auth-level');
    const authenticatorTypeSelect = document.getElementById('data-signing-authenticator-type');
    const reasonInput = document.getElementById('data-signing-reason');

    if (payloadInput) this.payload = payloadInput.value;
    if (authLevelSelect) this.selectedAuthLevel = authLevelSelect.value;
    if (authenticatorTypeSelect) this.selectedAuthenticatorType = authenticatorTypeSelect.value;
    if (reasonInput) this.reason = reasonInput.value;

    // Validate form
    const validation = DataSigningService.validateSigningInput(
      this.payload,
      this.selectedAuthLevel,
      this.selectedAuthenticatorType,
      this.reason
    );

    if (!validation.isValid) {
      const errorMessage = validation.errors.join(', ');
      console.log('DataSigningInputScreen - Validation failed:', errorMessage);
      this.showError(errorMessage);
      return;
    }

    // Hide error and show loading
    this.hideError();
    this.setLoading(true);

    try {
      console.log('DataSigningInputScreen - Calling signData()');

      // Convert display values to numeric enums for context
      const authLevel = DropdownDataService.convertAuthLevelToNumber(this.selectedAuthLevel);
      const authenticatorType = DropdownDataService.convertAuthenticatorTypeToNumber(this.selectedAuthenticatorType);

      // Set context in DataSigningSetupAuthManager for challengeMode 14 handling
      DataSigningSetupAuthManager.setContext({
        payload: this.payload,
        authLevel: authLevel,
        authenticatorType: authenticatorType,
        reason: this.reason,
        userID: '' // Will be set by SDK in getPassword event
      });

      // Call DataSigningService to initiate signing
      await DataSigningService.signData(
        this.payload,
        this.selectedAuthLevel,
        this.selectedAuthenticatorType,
        this.reason
      );

      console.log('DataSigningInputScreen - SignData API call successful, waiting for authentication and signing');
      // Note: Result will come via onAuthenticateUserAndSignData event

    } catch (error) {
      console.error('DataSigningInputScreen - Submit error:', error);
      this.setLoading(false);

      const errorMessage = error?.error?.errorString || 'Failed to submit data signing request. Please try again.';
      this.showError(errorMessage);

      // Clear manager context on error
      DataSigningSetupAuthManager.clearContext();
    }
  },

  /**
   * Check if IDV selfie screen is active and close it if present
   * For IDV server biometric step-up (workflow 16), the selfie screen may still be
   * visible when data signing response arrives. This function detects and closes it.
   *
   * @returns {boolean} True if selfie screen was closed, false otherwise
   */
  closeSelfieScreenIfPresent() {
    console.log('DataSigningInputScreen - Checking if selfie screen needs to be closed for data signing');

    try {
      // Check if IDVSelfieProcessStart screen is currently active
      if (NavigationService.currentRoute === 'IDVSelfieProcessStart') {
        console.log('DataSigningInputScreen - IDVSelfieProcessStart screen detected for data signing, closing it');

        // Get session params to pass when navigating back
        const sessionParams = {
          userID: this.userID,
          sessionID: this.sessionID
        };

        // Navigate back to DataSigningInput screen
        NavigationService.navigate('DataSigningInput', sessionParams);

        console.log('DataSigningInputScreen - Selfie screen closed');
        return true; // Screen was present and closed
      } else {
        console.log('DataSigningInputScreen - No IDVSelfieProcessStart screen on top, current route:', NavigationService.currentRoute);
      }
    } catch (error) {
      console.error('DataSigningInputScreen - Error checking/closing selfie screen:', error);
    }

    return false; // Screen not present or couldn't close
  },

  /**
   * Process data signing result and update state
   * Extracted as separate function to support delayed processing after selfie screen closure
   *
   * @param {Object} data - Signing response data from SDK
   */
  processDataSigningResult(data) {
    console.log('DataSigningInputScreen - Processing data signing result');

    this.setLoading(false);

    // Hide password modal (do this for all cases)
    if (window.PasswordChallengeModal) {
      PasswordChallengeModal.hide();
    }

    // PRIORITY 1: Check error code first
    if (data.error && data.error.longErrorCode !== 0) {
      const errorMessage = DataSigningService.getErrorMessage(data.error.longErrorCode);

      console.error('DataSigningInputScreen - Data signing error:', JSON.stringify({
        errorCode: data.error.longErrorCode,
        errorMessage: errorMessage
      }, null, 2));

      // Show error alert on DataSigningInputScreen
      window.alert('Data Signing Failed\n\n' + errorMessage);

      // Also show in error div for visibility
      this.showError(errorMessage);

      // Notify manager of error
      DataSigningSetupAuthManager.handleError(data.error);
      return; // Stop processing
    }

    // PRIORITY 2: Check status code
    if (data.status && data.status.statusCode !== 100) {
      const statusMessage = data.status.statusMessage || 'Operation failed with an unknown error';

      console.error('DataSigningInputScreen - Data signing status error:', JSON.stringify({
        statusCode: data.status.statusCode,
        statusMessage: statusMessage
      }, null, 2));

      // Show status error alert on DataSigningInputScreen
      window.alert('Data Signing Failed\n\n' + statusMessage);

      // Also show in error div
      this.showError(`Signing failed: ${statusMessage}`);

      // Notify manager of error
      DataSigningSetupAuthManager.handleError(data);
      return; // Stop processing
    }

    // SUCCESS: Both error and status checks passed
    console.log('DataSigningInputScreen - Data signing completed successfully');

    // Store response
    this.signingResponse = data;

    // Notify manager of success
    DataSigningSetupAuthManager.handleSuccess(data);

    // Navigate to result screen with data
    NavigationService.navigate('DataSigningResult', {
      resultData: data
    });
  },

  /**
   * Handle data signing response event
   *
   * For IDV server biometric step-up (workflow 16), this handler checks if the
   * selfie screen is currently active and closes it before processing the result.
   * This ensures smooth UI transitions and prevents alerts from appearing behind
   * the selfie screen.
   *
   * @param {Object} data - Signing response data from SDK
   */
  handleDataSigningResponse(data) {
    console.log('DataSigningInputScreen - Data signing response received:', JSON.stringify({
      statusCode: data.status?.statusCode,
      errorCode: data.error?.longErrorCode,
      signatureLength: data.payloadSignature?.length
    }, null, 2));

    // Check and close selfie screen if present
    const selfieScreenWasClosed = this.closeSelfieScreenIfPresent();

    if (selfieScreenWasClosed) {
      // Add 300ms delay for screen transition
      console.log('DataSigningInputScreen - Delaying result processing for screen transition (300ms)');

      setTimeout(() => {
        console.log('DataSigningInputScreen - Processing data signing result after screen close');
        this.processDataSigningResult(data);
      }, 300);

      return; // Exit early, let setTimeout handle the rest
    }

    // Selfie screen not present (password/LDA step-up), process immediately
    console.log('DataSigningInputScreen - Processing data signing result immediately');
    this.processDataSigningResult(data);
  },

  /**
   * Clear form fields
   */
  clearForm() {
    const payloadInput = document.getElementById('data-signing-payload');
    const authLevelSelect = document.getElementById('data-signing-auth-level');
    const authenticatorTypeSelect = document.getElementById('data-signing-authenticator-type');
    const reasonInput = document.getElementById('data-signing-reason');

    if (payloadInput) payloadInput.value = '';
    if (authLevelSelect) authLevelSelect.value = '';
    if (authenticatorTypeSelect) authenticatorTypeSelect.value = '';
    if (reasonInput) reasonInput.value = '';

    this.payload = '';
    this.selectedAuthLevel = '';
    this.selectedAuthenticatorType = '';
    this.reason = '';

    this.updateCharCounts();
  },

  /**
   * Update character count displays
   */
  updateCharCounts() {
    const payloadCount = document.getElementById('data-signing-payload-count');
    const reasonCount = document.getElementById('data-signing-reason-count');

    if (payloadCount) {
      payloadCount.textContent = `${this.payload.length}/500`;
    }

    if (reasonCount) {
      reasonCount.textContent = `${this.reason.length}/100`;
    }
  },

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    const errorDiv = document.getElementById('data-signing-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
    this.errorMessage = message;
  },

  /**
   * Hide error message
   */
  hideError() {
    const errorDiv = document.getElementById('data-signing-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
    this.errorMessage = '';
  },

  /**
   * Set loading state
   * @param {boolean} loading - Whether to show loading state
   */
  setLoading(loading) {
    this.isLoading = loading;

    const submitBtn = document.getElementById('data-signing-submit-btn');
    const payloadInput = document.getElementById('data-signing-payload');
    const authLevelSelect = document.getElementById('data-signing-auth-level');
    const authenticatorTypeSelect = document.getElementById('data-signing-authenticator-type');
    const reasonInput = document.getElementById('data-signing-reason');

    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? 'Processing...' : 'Sign Data';
      submitBtn.classList.toggle('loading', loading);
    }

    // Disable form inputs during loading
    if (payloadInput) payloadInput.disabled = loading;
    if (authLevelSelect) authLevelSelect.disabled = loading;
    if (authenticatorTypeSelect) authenticatorTypeSelect.disabled = loading;
    if (reasonInput) reasonInput.disabled = loading;
  },

  /**
   * Handle logout from drawer
   */
  async handleLogout() {
    console.log('DataSigningInputScreen - Logging out user:', this.userID);

    try {
      // Call rdnaService.logOff
      const syncResponse = await rdnaService.logOff(this.userID);
      console.log('DataSigningInputScreen - LogOff sync response:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // Note: SDK will trigger onUserLoggedOff event, which SDKEventProvider handles
      // SDKEventProvider will navigate to CheckUserScreen
      console.log('DataSigningInputScreen - Waiting for onUserLoggedOff event from SDK');
    } catch (error) {
      console.error('DataSigningInputScreen - LogOff error:', error);
      alert('Failed to log out. Please try again.');
    }
  },

  /**
   * Cleanup when navigating away from screen
   */
  cleanup() {
    console.log('DataSigningInputScreen - Cleaning up');

    // Restore original handlers
    const eventManager = rdnaService.getEventManager();

    if (this.originalGetPasswordHandler) {
      eventManager.setGetPasswordHandler(this.originalGetPasswordHandler);
    }

    if (this.originalDataSigningHandler) {
      eventManager.setDataSigningResponseHandler(this.originalDataSigningHandler);
    }
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.DataSigningInputScreen = DataSigningInputScreen;
}
