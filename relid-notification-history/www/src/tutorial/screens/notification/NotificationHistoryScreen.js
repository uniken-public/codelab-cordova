/**
 * Notification History Screen
 *
 * Displays historical notifications with status badges and detail modal.
 *
 * Features:
 * - Auto-loads notification history on screen mount
 * - Displays notifications sorted by timestamp (newest first)
 * - Color-coded status indicators (UPDATED, EXPIRED, DISCARDED, etc.)
 * - Pull-to-refresh functionality (manual refresh button)
 * - Detail modal for viewing full notification information
 * - UTC timestamp conversion to local time
 * - Handles response from getNotificationHistory API
 *
 * API Used:
 * - getNotificationHistory(recordCount, startIndex, enterpriseId, startDate, endDate, notificationStatus, actionPerformed, keywordSearch, deviceId)
 *
 * Event Handled:
 * - onGetNotificationHistory - History data response
 */

const NotificationHistoryScreen = {
  /**
   * Screen state
   */
  state: {
    loading: false,
    historyItems: [],
    selectedItem: null,
    showDetailModal: false
  },

  /**
   * Called when screen content is loaded into #app-content
   * Replaces React's componentDidMount / useEffect
   *
   * @param {Object} params - Navigation parameters (userParams from Dashboard)
   */
  onContentLoaded(params) {
    console.log('NotificationHistoryScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Cleanup any existing handlers from previous visits to prevent accumulation
    this.cleanup();

    // Store user params
    this.userParams = params;

    // Setup event listeners
    this.setupEventListeners();

    // Setup event handler for notification history response
    this.setupEventHandlers();

    // Load notification history automatically
    this.loadNotificationHistory();
  },

  /**
   * Setup DOM event listeners
   */
  setupEventListeners() {
    // Menu button
    const menuButton = document.getElementById('notification-history-menu-button');
    if (menuButton) {
      menuButton.onclick = () => {
        NavigationService.toggleDrawer();
      };
    }

    // Refresh button
    const refreshButton = document.getElementById('notification-history-refresh-button');
    if (refreshButton) {
      refreshButton.onclick = () => {
        this.loadNotificationHistory();
      };
    }

    // Retry button (for error state)
    const retryButton = document.getElementById('notification-history-retry-button');
    if (retryButton) {
      retryButton.onclick = () => {
        this.loadNotificationHistory();
      };
    }

    // Detail modal cancel button
    const cancelButton = document.getElementById('notification-history-detail-cancel');
    if (cancelButton) {
      cancelButton.onclick = () => {
        this.closeDetailModal();
      };
    }

    // Detail modal overlay (click to close)
    const modalOverlay = document.getElementById('notification-history-detail-modal-overlay');
    if (modalOverlay) {
      modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) {
          this.closeDetailModal();
        }
      };
    }

    // Setup drawer menu link handlers to pass session params
    this.setupDrawerLinks();
  },

  /**
   * Setup drawer menu link handlers
   */
  setupDrawerLinks() {
    const drawerDashboardLink = document.getElementById('drawer-dashboard-link');
    const drawerNotificationsLink = document.getElementById('drawer-notifications-link');
    const drawerNotificationHistoryLink = document.getElementById('drawer-notification-history-link');
    const drawerLdaTogglingLink = document.getElementById('drawer-lda-toggling-link');
    const drawerDataSigningLink = document.getElementById('drawer-data-signing-link');

    if (drawerDashboardLink) {
      drawerDashboardLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('NotificationHistoryScreen - Navigating to Dashboard');
        NavigationService.navigate('Dashboard', this.userParams);
      };
    }

    if (drawerNotificationsLink) {
      drawerNotificationsLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('NotificationHistoryScreen - Navigating to GetNotifications');
        NavigationService.navigate('GetNotifications', this.userParams);
      };
    }

    if (drawerNotificationHistoryLink) {
      drawerNotificationHistoryLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        // Already on NotificationHistory, just close drawer
      };
    }

    // Note: drawer-update-password-link has its own global handler in index.html
    // that calls initiateUpdateFlowForCredential - don't override it here

    if (drawerLdaTogglingLink) {
      drawerLdaTogglingLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('NotificationHistoryScreen - Navigating to LDAToggling');
        NavigationService.navigate('LDAToggling', this.userParams);
      };
    }

    if (drawerDataSigningLink) {
      drawerDataSigningLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        console.log('NotificationHistoryScreen - Navigating to DataSigningInput');
        NavigationService.navigate('DataSigningInput', this.userParams);
      };
    }
  },

  /**
   * Setup SDK event handlers
   */
  setupEventHandlers() {
    const eventManager = rdnaService.getEventManager();

    // Set our handler directly (no preservation needed - only NotificationHistoryScreen uses this event)
    eventManager.setGetNotificationHistoryHandler((data) => {
      this.handleNotificationHistoryResponse(data);
    });
  },

  /**
   * Cleanup event handlers when leaving screen
   */
  cleanup() {
    const eventManager = rdnaService.getEventManager();

    // Clear the handler
    eventManager.setGetNotificationHistoryHandler(undefined);
  },

  /**
   * Load notification history from the server
   */
  async loadNotificationHistory() {
    this.state.loading = true;
    this.showLoadingState();

    try {
      console.log('NotificationHistoryScreen - Loading notification history');

      // Call getNotificationHistory API
      await rdnaService.getNotificationHistory(
        10,    // recordCount
        1,     // startIndex
        '',    // enterpriseId
        '',    // startDate
        '',    // endDate
        '',    // notificationStatus
        '',    // actionPerformed
        '',    // keywordSearch
        ''     // deviceId
      );

      console.log('NotificationHistoryScreen - getNotificationHistory API call successful');
    } catch (error) {
      console.error('NotificationHistoryScreen - Error loading notification history:', error);
      this.state.loading = false;
      this.showErrorState(error.errorMessage);
    }
  },

  /**
   * Handle notification history response from SDK event
   *
   * @param {Object} data - Response data from onGetNotificationHistory event
   */
  handleNotificationHistoryResponse(data) {
    console.log('NotificationHistoryScreen - Received notification history response');
    this.state.loading = false;

    // Layer 1: Check API-level error (error.longErrorCode)
    if (data.error && data.error.longErrorCode !== 0) {
      const errorMsg = data.error.errorString || 'API error occurred';
      console.error('NotificationHistoryScreen - API error:', errorMsg, 'Code:', data.error.longErrorCode);
      this.showErrorState(errorMsg);
      return;
    }

    // Layer 2: Check status code (pArgs.response.StatusCode)
    const statusCode = data.pArgs?.response?.StatusCode;
    if (statusCode !== 100) {
      const statusMsg = data.pArgs?.response?.StatusMsg || 'Failed to retrieve notification history';
      console.error('NotificationHistoryScreen - Status error:', statusCode, 'Message:', statusMsg);
      this.showErrorState(statusMsg);
      return;
    }

    // Success: Process history data
    try {
      const history = data.pArgs?.response?.ResponseData?.history || [];
      console.log(`NotificationHistoryScreen - Loaded ${history.length} history items`);

      // Sort by update timestamp (most recent first)
      const sortedHistory = history.sort((a, b) =>
        new Date(b.update_ts || b.create_ts).getTime() - new Date(a.update_ts || a.create_ts).getTime()
      );

      this.state.historyItems = sortedHistory;
      this.renderHistoryList();
    } catch (error) {
      console.error('NotificationHistoryScreen - Error parsing response:', error);
      this.showErrorState('Failed to parse notification history response');
    }
  },

  /**
   * Show loading state
   */
  showLoadingState() {
    const contentDiv = document.getElementById('notification-history-content');
    if (contentDiv) {
      contentDiv.innerHTML = `
        <div class="notification-history-loading-container">
          <div class="spinner"></div>
          <p class="notification-history-loading-text">Loading notification history...</p>
        </div>
      `;
    }
  },

  /**
   * Show error state
   *
   * @param {string} errorMessage - Error message to display
   */
  showErrorState(errorMessage) {
    const contentDiv = document.getElementById('notification-history-content');
    if (contentDiv) {
      contentDiv.innerHTML = `
        <div class="notification-history-empty-container">
          <p class="notification-history-error-text">${errorMessage}</p>
          <button id="notification-history-retry-button" class="notification-history-retry-button">
            Retry
          </button>
        </div>
      `;

      // Re-attach retry button listener
      const retryButton = document.getElementById('notification-history-retry-button');
      if (retryButton) {
        retryButton.onclick = () => {
          this.loadNotificationHistory();
        };
      }
    }
  },

  /**
   * Render the history list
   */
  renderHistoryList() {
    const contentDiv = document.getElementById('notification-history-content');

    if (!contentDiv) {
      console.error('NotificationHistoryScreen - Content container not found');
      return;
    }

    if (this.state.historyItems.length === 0) {
      // Empty state
      contentDiv.innerHTML = `
        <div class="notification-history-empty-container">
          <p class="notification-history-empty-text">No notification history found</p>
          <button id="notification-history-retry-button" class="notification-history-retry-button">
            Retry
          </button>
        </div>
      `;

      // Re-attach retry button listener
      const retryButton = document.getElementById('notification-history-retry-button');
      if (retryButton) {
        retryButton.onclick = () => {
          this.loadNotificationHistory();
        };
      }
      return;
    }

    // Render history items
    let html = '<div class="notification-history-list">';

    this.state.historyItems.forEach((item, index) => {
      const body = item.body?.[0] || {};
      const subject = body.subject || 'No Subject';
      const message = (body.message || 'No message available').replace(/\\n/g, ' ');
      const statusColor = this.getStatusColor(item.status);
      const actionColor = this.getActionColor(item.action_performed);
      const timestamp = this.formatTimestamp(item.update_ts || item.create_ts);

      html += `
        <div class="notification-history-item" data-index="${index}" onclick="NotificationHistoryScreen.handleItemPress(${index})">
          <div class="notification-history-item-header">
            <span class="notification-history-item-subject">${subject}</span>
            <span class="notification-history-item-time">${timestamp}</span>
          </div>
          <p class="notification-history-item-message">${message}</p>
          <div class="notification-history-item-footer">
            <span class="notification-history-status-badge" style="background-color: ${statusColor}">
              ${item.status}
            </span>
            <div class="notification-history-action-container">
              <span class="notification-history-action-label">Action: </span>
              <span class="notification-history-action-value" style="color: ${actionColor}">
                ${item.action_performed || 'NONE'}
              </span>
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    contentDiv.innerHTML = html;
  },

  /**
   * Handle history item press
   *
   * @param {number} index - Index of the item in historyItems array
   */
  handleItemPress(index) {
    const item = this.state.historyItems[index];
    if (!item) return;

    this.state.selectedItem = item;
    this.state.showDetailModal = true;
    this.showDetailModal();
  },

  /**
   * Show detail modal
   */
  showDetailModal() {
    const modal = document.getElementById('notification-history-detail-modal');
    if (!modal) return;

    const item = this.state.selectedItem;
    if (!item) return;

    const body = item.body?.[0] || {};
    const subject = body.subject || 'No Subject';
    const message = (body.message || 'No message available').replace(/\\n/g, '<br>');
    const statusColor = this.getStatusColor(item.status);
    const actionColor = this.getActionColor(item.action_performed);

    // Populate modal content
    const modalBody = document.getElementById('notification-history-detail-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <p class="notification-history-detail-subject">${subject}</p>
        <p class="notification-history-detail-message">${message}</p>
        <div class="notification-history-detail-row">
          <span class="notification-history-detail-label">Status:</span>
          <span class="notification-history-detail-value" style="color: ${statusColor}">${item.status}</span>
        </div>
        <div class="notification-history-detail-row">
          <span class="notification-history-detail-label">Action Performed:</span>
          <span class="notification-history-detail-value" style="color: ${actionColor}">${item.action_performed || 'NONE'}</span>
        </div>
        <div class="notification-history-detail-row">
          <span class="notification-history-detail-label">Created:</span>
          <span class="notification-history-detail-value">${this.convertUTCToLocal(item.create_ts)}</span>
        </div>
        ${item.update_ts ? `
          <div class="notification-history-detail-row">
            <span class="notification-history-detail-label">Updated:</span>
            <span class="notification-history-detail-value">${this.convertUTCToLocal(item.update_ts)}</span>
          </div>
        ` : ''}
        <div class="notification-history-detail-row">
          <span class="notification-history-detail-label">Expiry:</span>
          <span class="notification-history-detail-value">${this.convertUTCToLocal(item.expiry_timestamp)}</span>
        </div>
        ${item.signing_status ? `
          <div class="notification-history-detail-row">
            <span class="notification-history-detail-label">Signing Status:</span>
            <span class="notification-history-detail-value">${item.signing_status}</span>
          </div>
        ` : ''}
      `;
    }

    // Show modal
    modal.style.display = 'flex';
  },

  /**
   * Close detail modal
   */
  closeDetailModal() {
    const modal = document.getElementById('notification-history-detail-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    this.state.showDetailModal = false;
    this.state.selectedItem = null;
  },

  /**
   * Format timestamp to user-friendly format
   *
   * @param {string} timestamp - Timestamp string
   * @returns {string} Formatted timestamp
   */
  formatTimestamp(timestamp) {
    try {
      if (!timestamp) return 'Unknown';

      // Handle UTC timestamp format (e.g., "2025-12-03T10:30:00UTC")
      let cleanTimestamp = timestamp;
      if (timestamp.endsWith('UTC')) {
        cleanTimestamp = timestamp.replace('UTC', 'Z');
      }

      const date = new Date(cleanTimestamp);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.log('formatTimestamp - Invalid date for timestamp:', timestamp);
        return timestamp;
      }

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays <= 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.log('formatTimestamp - Error:', error);
      return timestamp;
    }
  },

  /**
   * Convert UTC timestamp to local time
   *
   * @param {string} utcTimestamp - UTC timestamp string
   * @returns {string} Local time string
   */
  convertUTCToLocal(utcTimestamp) {
    try {
      if (!utcTimestamp) return 'Not available';

      // Handle different UTC timestamp formats
      let cleanTimestamp = utcTimestamp;

      // If timestamp ends with 'UTC', replace with 'Z' for proper parsing
      if (utcTimestamp.endsWith('UTC')) {
        cleanTimestamp = utcTimestamp.replace('UTC', 'Z');
      }

      // Create date object from cleaned UTC timestamp
      const utcDate = new Date(cleanTimestamp);

      // Check if date is valid
      if (isNaN(utcDate.getTime())) {
        console.log('convertUTCToLocal - Invalid date for timestamp:', utcTimestamp);
        return utcTimestamp; // Return original if can't parse
      }

      // Convert to local time string
      const localTime = utcDate.toLocaleString();
      return localTime;
    } catch (error) {
      console.log('convertUTCToLocal - Error:', error);
      return utcTimestamp; // Return original on error
    }
  },

  /**
   * Get color for status
   *
   * @param {string} status - Notification status
   * @returns {string} Color hex code
   */
  getStatusColor(status) {
    switch (status.toUpperCase()) {
      case 'UPDATED':
      case 'ACCEPTED':
        return '#4CAF50'; // Green
      case 'REJECTED':
      case 'DISCARDED':
        return '#F44336'; // Red
      case 'EXPIRED':
        return '#FF9800'; // Orange
      case 'DISMISSED':
        return '#9E9E9E'; // Gray
      default:
        return '#2196F3'; // Blue
    }
  },

  /**
   * Get color for action performed
   *
   * @param {string} action - Action performed
   * @returns {string} Color hex code
   */
  getActionColor(action) {
    if (!action || action === 'NONE') return '#9E9E9E'; // Gray
    if (action.toLowerCase().includes('accept') || action.toLowerCase().includes('approve')) {
      return '#4CAF50'; // Green
    }
    if (action.toLowerCase().includes('reject') || action.toLowerCase().includes('deny')) {
      return '#F44336'; // Red
    }
    return '#2196F3'; // Blue
  }
};

// Expose globally for NavigationService
window.NotificationHistoryScreen = NotificationHistoryScreen;
