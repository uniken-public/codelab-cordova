/**
 * Device Management Screen - Device List and Management
 *
 * This screen displays all registered devices for the authenticated user and allows
 * device management operations (view details, rename, delete).
 *
 * Key Features:
 * - Automatic device list loading on screen entry
 * - Pull-to-refresh support
 * - Cooling period detection and warning display
 * - Current device highlighting
 * - Device status indicators (ACTIVE/INACTIVE)
 * - Navigation to device detail screen
 *
 * User Flow:
 * 1. User opens drawer and taps "📱 Device Management"
 * 2. Screen auto-loads devices via getRegisteredDeviceDetails() API
 * 3. Devices displayed with status indicators and tap-to-view-details
 * 4. Current device highlighted with green border and badge
 * 5. Cooling period warning banner shown if StatusCode 146
 * 6. User taps device card to navigate to DeviceDetailScreen
 *
 * SPA Lifecycle:
 * - onContentLoaded(params) - Called when template loaded, auto-loads devices
 * - setupEventListeners() - Attach button and navigation handlers
 * - loadDevices() - Fetch devices from server
 * - renderDeviceList() - Display devices with formatting
 */

const DeviceManagementScreen = {
  /**
   * Screen state
   */
  devices: [],
  isLoading: false,
  isCoolingPeriodActive: false,
  coolingPeriodEndTimestamp: null,
  coolingPeriodMessage: '',
  sessionParams: {},

  /**
   * Called when screen content is loaded (SPA lifecycle)
   *
   * @param {Object} params - Navigation parameters (must include userID)
   */
  onContentLoaded(params) {
    console.log('DeviceManagementScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Store session params for API calls and navigation
    this.sessionParams = params || {};

    // Validate required userID parameter
    if (!this.sessionParams.userID) {
      console.error('DeviceManagementScreen - userID is required in params');
      this.showError('Session expired. Please log in again.');
      return;
    }

    // Store session params globally for use across screens
    if (typeof SDKEventProvider !== 'undefined') {
      SDKEventProvider.setSessionParams(this.sessionParams);
    }

    // Setup UI
    this.setupEventListeners();
    this.registerSDKEventHandlers();

    // Auto-load devices
    this.loadDevices();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Menu button
    const menuButton = document.getElementById('device-management-menu-button');
    if (menuButton) {
      menuButton.onclick = () => {
        NavigationService.toggleDrawer();
      };
    }

    // Refresh button
    const refreshButton = document.getElementById('device-management-refresh-button');
    if (refreshButton) {
      refreshButton.onclick = () => {
        this.loadDevices();
      };
    }

    // Setup drawer menu link handlers to pass session params
    this.setupDrawerLinks();

    console.log('DeviceManagementScreen - Event listeners setup complete');
  },

  /**
   * Setup drawer menu link handlers
   */
  setupDrawerLinks() {
    const drawerDashboardLink = document.getElementById('drawer-dashboard-link');
    const drawerNotificationsLink = document.getElementById('drawer-notifications-link');
    const drawerNotificationHistoryLink = document.getElementById('drawer-notification-history-link');
    const drawerDeviceMgmtLink = document.getElementById('drawer-device-mgmt-link');
    const drawerLdaTogglingLink = document.getElementById('drawer-lda-toggling-link');
    const drawerDataSigningLink = document.getElementById('drawer-data-signing-link');

    if (drawerDashboardLink) {
      drawerDashboardLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('DeviceManagementScreen - Navigating to Dashboard');
        NavigationService.navigate('Dashboard', this.sessionParams);
      };
    }

    if (drawerNotificationsLink) {
      drawerNotificationsLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('DeviceManagementScreen - Navigating to GetNotifications');
        NavigationService.navigate('GetNotifications', this.sessionParams);
      };
    }

    if (drawerNotificationHistoryLink) {
      drawerNotificationHistoryLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('DeviceManagementScreen - Navigating to NotificationHistory');
        NavigationService.navigate('NotificationHistory', this.sessionParams);
      };
    }

    if (drawerDeviceMgmtLink) {
      drawerDeviceMgmtLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        // Already on Device Management screen, just reload
        this.loadDevices();
      };
    }

    if (drawerLdaTogglingLink) {
      drawerLdaTogglingLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('DeviceManagementScreen - Navigating to LDAToggling');
        NavigationService.navigate('LDAToggling', this.sessionParams);
      };
    }

    if (drawerDataSigningLink) {
      drawerDataSigningLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('DeviceManagementScreen - Navigating to DataSigningInput');
        NavigationService.navigate('DataSigningInput', this.sessionParams);
      };
    }
  },

  /**
   * Register SDK event handlers
   */
  registerSDKEventHandlers() {
    const eventManager = rdnaService.getEventManager();

    // Handle getRegisteredDeviceDetails response
    eventManager.setGetRegisteredDeviceDetailsHandler((data) => {
      console.log('DeviceManagementScreen - onGetRegistredDeviceDetails event received');
      this.handleGetDevicesResponse(data);
    });

    console.log('DeviceManagementScreen - SDK event handlers registered');
  },

  /**
   * Load devices from server (auto-triggered on screen load)
   */
  loadDevices() {
    if (this.isLoading) {
      console.log('DeviceManagementScreen - Already loading devices');
      return;
    }

    if (!this.sessionParams.userID) {
      console.error('DeviceManagementScreen - userID not available');
      this.showError('Session expired. Please log in again.');
      return;
    }

    this.isLoading = true;
    this.showLoading(true);
    console.log('DeviceManagementScreen - Loading devices for userID:', this.sessionParams.userID);

    // Call SDK getRegisteredDeviceDetails API
    rdnaService.getRegisteredDeviceDetails(this.sessionParams.userID)
      .then((syncResponse) => {
        console.log('DeviceManagementScreen - GetRegisteredDeviceDetails sync response:', JSON.stringify(syncResponse, null, 2));
        // Waiting for onGetRegistredDeviceDetails event with device list
      })
      .catch((error) => {
        console.error('DeviceManagementScreen - GetRegisteredDeviceDetails error:', JSON.stringify(error, null, 2));
        this.isLoading = false;
        this.showLoading(false);
        this.showError('Failed to load devices. Please try again.');
      });
  },

  /**
   * Handle getRegisteredDeviceDetails response event
   */
  handleGetDevicesResponse(data) {
    console.log('DeviceManagementScreen - Processing device details response');

    this.isLoading = false;
    this.showLoading(false);

    // Layer 1: Check API-level error (error.longErrorCode)
    if (data.error && data.error.longErrorCode !== 0) {
      const errorMsg = data.error.errorString || 'API error occurred';
      console.error('DeviceManagementScreen - API error:', errorMsg, 'Code:', data.error.longErrorCode);
      this.showError(errorMsg);
      return;
    }

    // Layer 2: Check status code (pArgs.response.StatusCode)
    const statusCode = data.pArgs?.response?.StatusCode;
    if (statusCode === 146) {
      // Cooling period active
      this.isCoolingPeriodActive = true;
      this.coolingPeriodEndTimestamp = data.pArgs?.response?.ResponseData?.deviceManagementCoolingPeriodEndTimestamp;
      this.coolingPeriodMessage = data.pArgs?.response?.StatusMsg || 'Device management operations are temporarily disabled. Please try again later.';
      console.log('DeviceManagementScreen - Cooling period detected. End timestamp:', this.coolingPeriodEndTimestamp);
      this.showCoolingPeriodWarning();
    } else if (statusCode !== 100) {
      const statusMsg = data.pArgs?.response?.StatusMsg || 'Failed to retrieve devices';
      console.error('DeviceManagementScreen - Status error:', statusCode, 'Message:', statusMsg);
      this.showError(statusMsg);
      return;
    } else {
      // Success - clear cooling period state
      this.isCoolingPeriodActive = false;
      this.coolingPeriodEndTimestamp = null;
      this.coolingPeriodMessage = '';
      this.hideCoolingPeriodWarning();
    }

    // Process devices data
    this.devices = data.pArgs?.response?.ResponseData?.device || [];
    console.log('DeviceManagementScreen - Received', this.devices.length, 'devices');

    // Display devices
    this.renderDeviceList();
  },

  /**
   * Render device list
   */
  renderDeviceList() {
    const container = document.getElementById('device-list');
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    if (this.devices.length === 0) {
      // Empty state
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <p class="empty-state-text">📱</p>
        <p class="empty-state-message">No devices found</p>
      `;
      container.appendChild(emptyState);
      return;
    }

    // Render each device
    this.devices.forEach((device) => {
      const deviceCard = this.createDeviceCard(device);
      container.appendChild(deviceCard);
    });
  },

  /**
   * Create device card element
   */
  createDeviceCard(device) {
    const card = document.createElement('div');
    card.className = 'device-card';

    // Add current device styling
    if (device.currentDevice) {
      card.classList.add('current-device');
    }

    // Add click handler to navigate to detail screen
    card.onclick = () => {
      console.log('DeviceManagementScreen - Device tapped:', device.devUUID);
      this.navigateToDeviceDetail(device);
    };

    // Status indicator color
    const statusClass = device.status === 'ACTIVE' ? 'status-active' : 'status-inactive';

    // Format timestamps using epoch values
    const lastAccessedDate = this.formatTimestamp(device.lastAccessedTsEpoch);
    const createdDate = this.formatTimestamp(device.createdTsEpoch);

    card.innerHTML = `
      ${device.currentDevice ? '<div class="current-device-badge">Current Device</div>' : ''}
      <h3 class="device-name">${device.devName || 'Unnamed Device'}</h3>
      <div class="device-status-inline ${statusClass}">
        <span class="status-dot"></span>
        <span class="status-text">${device.status}</span>
      </div>
      <div class="device-timestamps">
        <div class="timestamp-row">
          <span class="timestamp-label">Last Accessed:</span>
          <span class="timestamp-value">${lastAccessedDate}</span>
        </div>
        <div class="timestamp-row">
          <span class="timestamp-label">Created:</span>
          <span class="timestamp-value">${createdDate}</span>
        </div>
      </div>
      <div class="device-card-footer">
        <span class="tap-hint">Tap for details →</span>
      </div>
    `;

    return card;
  },

  /**
   * Format timestamp for display
   * @param {number} timestamp - Epoch timestamp in milliseconds
   */
  formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown';

    try {
      const date = new Date(timestamp);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('DeviceManagementScreen - Error formatting timestamp:', error);
      return 'Unknown';
    }
  },

  /**
   * Navigate to device detail screen
   */
  navigateToDeviceDetail(device) {
    const params = {
      ...this.sessionParams,
      device: device,
      isCoolingPeriodActive: this.isCoolingPeriodActive,
      coolingPeriodEndTimestamp: this.coolingPeriodEndTimestamp,
      coolingPeriodMessage: this.coolingPeriodMessage
    };

    NavigationService.navigate('DeviceDetail', params);
  },

  /**
   * Show loading indicator
   */
  showLoading(show) {
    const spinner = document.getElementById('device-mgmt-loading-spinner');
    if (spinner) {
      spinner.style.display = show ? 'flex' : 'none';
    }
  },

  /**
   * Show error message
   */
  showError(message) {
    const errorElement = document.getElementById('device-mgmt-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';

      // Auto-hide after 5 seconds
      setTimeout(() => {
        errorElement.style.display = 'none';
      }, 5000);
    } else {
      alert(message);
    }
  },

  /**
   * Show cooling period warning banner
   */
  showCoolingPeriodWarning() {
    const warningBanner = document.getElementById('cooling-period-warning');
    const warningMessage = document.getElementById('cooling-period-message');
    const warningEnd = document.getElementById('cooling-period-end');

    if (warningBanner) {
      warningBanner.style.display = 'block';
    }

    if (warningMessage) {
      warningMessage.textContent = this.coolingPeriodMessage || 'Device management operations are temporarily disabled.';
    }

    if (warningEnd && this.coolingPeriodEndTimestamp) {
      const endDate = new Date(this.coolingPeriodEndTimestamp);
      warningEnd.textContent = `Cooling period ends: ${endDate.toLocaleString()}`;
      warningEnd.style.display = 'block';
    } else if (warningEnd) {
      warningEnd.style.display = 'none';
    }
  },

  /**
   * Hide cooling period warning banner
   */
  hideCoolingPeriodWarning() {
    const warningBanner = document.getElementById('cooling-period-warning');
    if (warningBanner) {
      warningBanner.style.display = 'none';
    }
  }
};

// Expose globally for NavigationService
window.DeviceManagementScreen = DeviceManagementScreen;
