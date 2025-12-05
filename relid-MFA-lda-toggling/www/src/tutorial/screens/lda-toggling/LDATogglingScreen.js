/**
 * LDA Toggling Screen (Cordova SPA)
 *
 * Displays authentication capabilities retrieved from the REL-ID SDK with the following features:
 * - Automatically loads authentication details on screen mount
 * - Displays authentication types in a list with toggle switches
 * - Allows users to enable/disable authentication types
 * - Handles both getPassword and getUserConsentForLDA flows
 * - Shows empty state when no LDA is available
 *
 * Key Features:
 * - Automatic getDeviceAuthenticationDetails API call on screen load (returns data in sync callback)
 * - Real-time event handling for onDeviceAuthManagementStatus (only async event for LDA toggling)
 * - Toggle switches for enabling/disabling authentication types
 * - Authentication type name mapping for user-friendly display
 * - Error handling and loading states
 *
 * Callback Pattern:
 * - getDeviceAuthenticationDetails: Sync callback only (no async event)
 * - manageDeviceAuthenticationModes: Async event (onDeviceAuthManagementStatus)
 *
 * SPA Pattern:
 * - Uses onContentLoaded(params) instead of React useEffect
 * - DOM manipulation instead of React state
 * - Manual event listener cleanup when navigating away
 * - Dynamic HTML generation for authentication list
 */

/**
 * Authentication Type Mapping
 * Maps authenticationType number to human-readable name
 * Based on RDNA.RDNALDACapabilities enum mapping
 */
const AUTH_TYPE_NAMES = {
  0: 'None',
  1: 'Biometric Authentication',  // RDNA_LDA_FINGERPRINT
  2: 'Face ID',                    // RDNA_LDA_FACE
  3: 'Pattern Authentication',     // RDNA_LDA_PATTERN
  4: 'Biometric Authentication',  // RDNA_LDA_SSKB_PASSWORD
  9: 'Biometric Authentication',  // RDNA_DEVICE_LDA
};

/**
 * LDA Toggling Screen Object
 */
window.LDATogglingScreen = {
  // State management via object properties (replaces React state)
  authCapabilities: [],
  processingAuthType: null,
  userID: '',
  sessionID: '',

  /**
   * Called when screen content is loaded into DOM
   * Replaces React's useEffect/componentDidMount
   *
   * @param {Object} params - Navigation parameters
   */
  onContentLoaded(params) {
    console.log('LDATogglingScreen - Content loaded', JSON.stringify(params, null, 2));

    // Store session info from params for drawer navigation
    this.userID = params.userID || '';
    this.sessionID = params.sessionID || '';

    // Setup refresh button in header
    this.setupEventListeners();

    // Load authentication details immediately
    this.loadAuthenticationDetails();

    // Set up event handler for auth management status (specific to LDA toggling only)
    const eventManager = rdnaService.getEventManager();
    eventManager.setDeviceAuthManagementStatusHandler(this.handleAuthManagementStatusReceived.bind(this));

    console.log('LDATogglingScreen - Event handler registered');
  },

  /**
   * Attach event listeners to DOM elements
   */
  setupEventListeners() {
    // Refresh button in header
    const refreshButton = document.getElementById('lda-refresh-button');
    if (refreshButton) {
      refreshButton.onclick = () => this.loadAuthenticationDetails();
    }

    // Menu button for opening drawer
    const menuButton = document.getElementById('lda-menu-button');
    if (menuButton) {
      menuButton.onclick = () => NavigationService.toggleDrawer();
    }

    // Drawer navigation links (same as DashboardScreen/GetNotificationsScreen)
    const drawerDashboardLink = document.getElementById('drawer-dashboard-link');
    const drawerNotificationsLink = document.getElementById('drawer-notifications-link');
    const drawerLdaTogglingLink = document.getElementById('drawer-lda-toggling-link');
    const drawerLogoutLink = document.getElementById('drawer-logout-link');

    if (drawerDashboardLink) {
      drawerDashboardLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('LDATogglingScreen - Navigating to Dashboard');
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
        console.log('LDATogglingScreen - Navigating to GetNotifications');
        NavigationService.navigate('GetNotifications', {
          userID: this.userID,
          sessionID: this.sessionID
        });
      };
    }

    if (drawerLdaTogglingLink) {
      drawerLdaTogglingLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        // Already on LDA toggling screen, just close drawer
      };
    }

    if (drawerLogoutLink) {
      drawerLogoutLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('LDATogglingScreen - Logging out');
        this.handleLogout();
      };
    }
  },

  /**
   * Handle logout from drawer
   */
  async handleLogout() {
    console.log('LDATogglingScreen - Logging out user:', this.userID);

    try {
      const syncResponse = await rdnaService.logOff(this.userID);
      console.log('LDATogglingScreen - logOff sync response received:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // Sync response successful - SDK will trigger onUserLoggedOff and getUser events
      console.log('LDATogglingScreen - LogOff successful, waiting for SDK events');
    } catch (error) {
      console.error('LDATogglingScreen - logOff error:', error);
      const errorMessage = error.error?.errorString || 'Failed to log out';
      alert('Logout Error\n\n' + errorMessage);
    }
  },

  /**
   * Load authentication details from the SDK
   * Data is returned directly in the sync callback, no async event
   */
  async loadAuthenticationDetails() {
    this.showLoading();
    this.hideError();

    try {
      console.log('LDATogglingScreen - Calling getDeviceAuthenticationDetails API');
      const data = await rdnaService.getDeviceAuthenticationDetails();
      console.log('LDATogglingScreen - getDeviceAuthenticationDetails API call successful');
      console.log('LDATogglingScreen - Full response:', JSON.stringify(data, null, 2));

      // Check for errors
      if (data.error.longErrorCode !== 0) {
        const errorMessage = data.error.errorString || 'Failed to load authentication details';
        console.error('LDATogglingScreen - Authentication details error:', JSON.stringify(data.error, null, 2));
        this.showError(errorMessage);
        return;
      }

      const capabilities = data.response.authenticationCapabilities || [];
      console.log('LDATogglingScreen - Received capabilities:', capabilities.length);

      this.authCapabilities = capabilities;
      this.hideLoading();
      this.renderAuthCapabilities();
    } catch (error) {
      console.error('LDATogglingScreen - getDeviceAuthenticationDetails error:', error);
      const errorMessage = error?.error?.errorString || 'Failed to load authentication details';
      this.showError(errorMessage);
    }
  },

  /**
   * Handle auth management status received from onDeviceAuthManagementStatus event
   */
  handleAuthManagementStatusReceived(data) {
    console.log('LDATogglingScreen - Received auth management status event');
    this.processingAuthType = null;

    // Hide LDA auth dialog if visible
    if (typeof LDAToggleAuthDialog !== 'undefined' && LDAToggleAuthDialog.visible) {
      LDAToggleAuthDialog.hide();
    }

    // Check for errors
    if (data.error.longErrorCode !== 0) {
      const errorMessage = data.error.errorString || 'Failed to update authentication mode';
      console.error('LDATogglingScreen - Auth management status error:', JSON.stringify(data.error, null, 2));

      alert('Update Failed: ' + errorMessage);

      // Refresh to show current state
      this.loadAuthenticationDetails();
      return;
    }

    // Check status
    if (data.status.statusCode === 100) {
      const opMode = data.OpMode === 1 ? 'enabled' : 'disabled';
      const authTypeName = AUTH_TYPE_NAMES[data.ldaType] || `Authentication Type ${data.ldaType}`;

      console.log('LDATogglingScreen - Auth management status success:', data.status.statusMessage);

      alert('Success: ' + authTypeName + ' has been ' + opMode + ' successfully.');

      // Refresh authentication details to get updated status
      this.loadAuthenticationDetails();
    } else {
      const statusMessage = data.status.statusMessage || 'Unknown error occurred';
      console.error('LDATogglingScreen - Auth management status error:', statusMessage);

      alert('Update Failed: ' + statusMessage);

      // Refresh authentication details to get updated status
      this.loadAuthenticationDetails();
    }
  },

  /**
   * Handle toggle switch change
   */
  async handleToggleChange(capability, newValue) {
    const authTypeName = AUTH_TYPE_NAMES[capability.authenticationType] || `Authentication Type ${capability.authenticationType}`;

    console.log('LDATogglingScreen - Toggle change:', JSON.stringify({
      authenticationType: capability.authenticationType,
      authTypeName,
      currentValue: capability.isConfigured,
      newValue
    }, null, 2));

    if (this.processingAuthType !== null) {
      console.log('LDATogglingScreen - Another operation is in progress, ignoring toggle');
      return;
    }

    this.processingAuthType = capability.authenticationType;
    this.showProcessingForAuthType(capability.authenticationType);

    try {
      console.log('LDATogglingScreen - Calling manageDeviceAuthenticationModes API');
      await rdnaService.manageDeviceAuthenticationModes(newValue, capability.authenticationType);
      console.log('LDATogglingScreen - manageDeviceAuthenticationModes API call successful');
      // Response will be handled by handleAuthManagementStatusReceived
    } catch (error) {
      console.error('LDATogglingScreen - manageDeviceAuthenticationModes API error:', error);
      this.processingAuthType = null;
      this.hideProcessingForAuthType(capability.authenticationType);

      alert('Update Failed: Failed to update authentication mode. Please try again.');
    }
  },

  /**
   * Show loading state
   */
  showLoading() {
    const contentContainer = document.getElementById('lda-content-container');
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="lda-loading-container">
          <div class="spinner"></div>
          <p class="lda-loading-text">Loading authentication details...</p>
        </div>
      `;
    }
  },

  /**
   * Hide loading state
   */
  hideLoading() {
    // Loading will be replaced by renderAuthCapabilities() or showError()
  },

  /**
   * Show error state
   */
  showError(message) {
    const contentContainer = document.getElementById('lda-content-container');
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="lda-error-container">
          <p class="lda-error-text">${message}</p>
          <button class="lda-retry-button" id="lda-retry-button">Retry</button>
        </div>
      `;

      // Attach retry button event listener
      const retryButton = document.getElementById('lda-retry-button');
      if (retryButton) {
        retryButton.onclick = () => this.loadAuthenticationDetails();
      }
    }
  },

  /**
   * Hide error state
   */
  hideError() {
    // Error will be replaced by showLoading() or renderAuthCapabilities()
  },

  /**
   * Render authentication capabilities list
   */
  renderAuthCapabilities() {
    const contentContainer = document.getElementById('lda-content-container');
    if (!contentContainer) return;

    if (this.authCapabilities.length === 0) {
      // Empty state
      contentContainer.innerHTML = `
        <div class="lda-empty-container">
          <div class="lda-empty-icon">🔐</div>
          <div class="lda-empty-title">No LDA Available</div>
          <div class="lda-empty-message">
            No Local Device Authentication (LDA) capabilities are available for this device.
          </div>
          <button class="lda-refresh-button" id="lda-empty-refresh-button">🔄 Refresh</button>
        </div>
      `;

      // Attach refresh button event listener
      const refreshButton = document.getElementById('lda-empty-refresh-button');
      if (refreshButton) {
        refreshButton.onclick = () => this.loadAuthenticationDetails();
      }
      return;
    }

    // Generate HTML for each authentication capability
    let capabilitiesHtml = '';
    this.authCapabilities.forEach(capability => {
      const authTypeName = AUTH_TYPE_NAMES[capability.authenticationType] || `Authentication Type ${capability.authenticationType}`;
      const isEnabled = capability.isConfigured === 1;
      const statusClass = isEnabled ? 'lda-status-enabled' : 'lda-status-disabled';
      const statusText = isEnabled ? 'Enabled' : 'Disabled';

      capabilitiesHtml += `
        <div class="lda-auth-item">
          <div class="lda-auth-info">
            <div class="lda-auth-type-name">${authTypeName}</div>
            <div class="lda-auth-type-id">Type ID: ${capability.authenticationType}</div>
            <div class="lda-auth-status ${statusClass}">${statusText}</div>
          </div>
          <div class="lda-toggle-container">
            <div class="lda-toggle-spinner" id="lda-spinner-${capability.authenticationType}" style="display: none;">
              <div class="spinner-small"></div>
            </div>
            <label class="lda-toggle-switch" id="lda-toggle-container-${capability.authenticationType}">
              <input
                type="checkbox"
                id="lda-toggle-${capability.authenticationType}"
                ${isEnabled ? 'checked' : ''}
                data-auth-type="${capability.authenticationType}"
                data-auth-type-name="${authTypeName}"
              >
              <span class="lda-toggle-slider"></span>
            </label>
          </div>
        </div>
      `;
    });

    // Add footer info
    const footerInfoHtml = `
      <div class="lda-footer-info-container">
        <div class="lda-footer-info-text">
          When biometric has been set up, you will be able to login into the application via configured authentication mode.
        </div>
      </div>
    `;

    contentContainer.innerHTML = `
      <div class="lda-list-container">
        ${capabilitiesHtml}
        ${footerInfoHtml}
      </div>
    `;

    // Attach toggle event listeners
    this.authCapabilities.forEach(capability => {
      const toggle = document.getElementById(`lda-toggle-${capability.authenticationType}`);
      if (toggle) {
        toggle.onchange = (e) => {
          const newValue = e.target.checked;
          this.handleToggleChange(capability, newValue);
        };
      }
    });
  },

  /**
   * Show processing spinner for specific auth type
   */
  showProcessingForAuthType(authType) {
    const spinner = document.getElementById(`lda-spinner-${authType}`);
    const toggleContainer = document.getElementById(`lda-toggle-container-${authType}`);
    const toggle = document.getElementById(`lda-toggle-${authType}`);

    if (spinner) spinner.style.display = 'block';
    if (toggleContainer) toggleContainer.style.display = 'none';
    if (toggle) toggle.disabled = true;

    // Disable all toggles
    this.authCapabilities.forEach(cap => {
      const t = document.getElementById(`lda-toggle-${cap.authenticationType}`);
      if (t) t.disabled = true;
    });
  },

  /**
   * Hide processing spinner for specific auth type
   */
  hideProcessingForAuthType(authType) {
    const spinner = document.getElementById(`lda-spinner-${authType}`);
    const toggleContainer = document.getElementById(`lda-toggle-container-${authType}`);
    const toggle = document.getElementById(`lda-toggle-${authType}`);

    if (spinner) spinner.style.display = 'none';
    if (toggleContainer) toggleContainer.style.display = 'block';
    if (toggle) toggle.disabled = false;

    // Re-enable all toggles
    this.authCapabilities.forEach(cap => {
      const t = document.getElementById(`lda-toggle-${cap.authenticationType}`);
      if (t) t.disabled = false;
    });
  },

  /**
   * Reset processing state when operation is cancelled
   * Called when user cancels authentication dialog
   */
  resetProcessingState() {
    console.log('LDATogglingScreen - Resetting processing state');
    this.processingAuthType = null;

    // Hide all processing spinners and re-enable all toggles
    this.authCapabilities.forEach(cap => {
      const spinner = document.getElementById(`lda-spinner-${cap.authenticationType}`);
      const toggleContainer = document.getElementById(`lda-toggle-container-${cap.authenticationType}`);
      const toggle = document.getElementById(`lda-toggle-${cap.authenticationType}`);

      if (spinner) spinner.style.display = 'none';
      if (toggleContainer) toggleContainer.style.display = 'block';
      if (toggle) toggle.disabled = false;
    });
  },

  /**
   * Cleanup when navigating away from screen
   * Called by NavigationService before loading new screen
   */
  cleanup() {
    console.log('LDATogglingScreen - Cleaning up event handlers');

    // Clear event handler (no preservation needed - handler is specific to LDA toggling only)
    const eventManager = rdnaService.getEventManager();
    eventManager.setDeviceAuthManagementStatusHandler(null);

    // Reset state
    this.authCapabilities = [];
    this.processingAuthType = null;

    console.log('LDATogglingScreen - Cleanup completed');
  }
};

// NO .initialize() or deviceready listener needed in SPA!
// Screen is initialized via onContentLoaded() when navigated to
