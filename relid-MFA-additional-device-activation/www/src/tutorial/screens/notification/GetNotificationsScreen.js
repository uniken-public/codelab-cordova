/**
 * Get Notifications Screen - Server Notification Management
 *
 * This screen displays pending notifications from the REL-ID server and allows users
 * to view and respond to notification actions.
 *
 * Key Features:
 * - Automatic notification loading on screen entry
 * - Chronological sorting (newest first)
 * - Action modal for notification responses
 * - Real-time UI updates after action submission
 * - Pull-to-refresh support
 *
 * User Flow:
 * 1. User opens drawer and taps "🔔 Get Notifications"
 * 2. Screen auto-loads notifications via getNotifications() API
 * 3. Notifications displayed with "View Actions" buttons
 * 4. User taps notification to see available actions
 * 5. Action modal displays with radio button selection
 * 6. User selects action and submits
 * 7. updateNotification() API called with user's selection
 * 8. Real-time UI update on success
 *
 * SPA Lifecycle:
 * - onContentLoaded(params) - Called when template loaded, auto-loads notifications
 * - setupEventListeners() - Attach button handlers
 * - loadNotifications() - Fetch notifications from server
 * - showActionModal() - Display action selection modal
 */

const GetNotificationsScreen = {
  /**
   * Screen state
   */
  notifications: [],
  isLoading: false,
  currentNotification: null,
  selectedAction: null,
  sessionParams: {},

  /**
   * Called when screen content is loaded (SPA lifecycle)
   *
   * @param {Object} params - Navigation parameters
   */
  onContentLoaded(params) {
    console.log('GetNotificationsScreen - Content loaded');

    // Store session params for navigation back to Dashboard
    this.sessionParams = params || {};

    // Setup UI
    this.setupEventListeners();
    this.registerSDKEventHandlers();

    // Auto-load notifications
    this.loadNotifications();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Navigation controls (React Native style - menu + refresh icon)
    const refreshBtn = document.getElementById('notifications-back-btn'); // Using back btn ID for refresh
    const menuBtn = document.getElementById('notifications-menu-btn');

    if (refreshBtn) {
      refreshBtn.onclick = () => {
        console.log('GetNotificationsScreen - Refresh requested');
        this.loadNotifications();
      };
    }

    if (menuBtn) {
      menuBtn.onclick = () => {
        console.log('GetNotificationsScreen - Opening drawer');
        NavigationService.openDrawer();
      };
    }

    // Drawer menu links (same as DashboardScreen)
    const drawerDashboardLink = document.getElementById('drawer-dashboard-link');
    const drawerNotificationsLink = document.getElementById('drawer-notifications-link');
    const drawerLogoutLink = document.getElementById('drawer-logout-link');

    if (drawerDashboardLink) {
      drawerDashboardLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        // Navigate to Dashboard with current session params
        NavigationService.navigate('Dashboard', this.sessionParams);
      };
    }

    if (drawerNotificationsLink) {
      drawerNotificationsLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        // Already on notifications, just close drawer
      };
    }

    if (drawerLogoutLink) {
      drawerLogoutLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        this.handleLogOut();
      };
    }

    // Modal close button
    const modalCloseBtn = document.getElementById('notification-modal-close');
    if (modalCloseBtn) modalCloseBtn.onclick = this.closeActionModal.bind(this);

    console.log('GetNotificationsScreen - Event listeners attached (including drawer links)');
  },

  /**
   * Register SDK event handlers for notifications
   */
  registerSDKEventHandlers() {
    const eventManager = rdnaService.getEventManager();

    // Handle getNotifications response
    eventManager.setGetNotificationsHandler((data) => {
      console.log('GetNotificationsScreen - onGetNotifications event received');
      this.handleGetNotificationsResponse(data);
    });

    // Handle updateNotification response
    eventManager.setUpdateNotificationHandler((data) => {
      console.log('GetNotificationsScreen - onUpdateNotification event received');
      this.handleUpdateNotificationResponse(data);
    });

    console.log('GetNotificationsScreen - SDK event handlers registered');
  },

  /**
   * Load notifications from server (auto-triggered on screen load)
   */
  loadNotifications() {
    if (this.isLoading) {
      console.log('GetNotificationsScreen - Already loading notifications');
      return;
    }

    this.isLoading = true;
    this.showLoading(true);
    console.log('GetNotificationsScreen - Loading notifications from server');

    // Call SDK getNotifications API
    rdnaService.getNotifications(0, 1, '', '')
      .then((syncResponse) => {
        console.log('GetNotificationsScreen - GetNotifications sync response:', JSON.stringify(syncResponse, null, 2));
        // Waiting for onGetNotifications event with notification list
      })
      .catch((error) => {
        console.error('GetNotificationsScreen - GetNotifications error:', JSON.stringify(error, null, 2));
        this.isLoading = false;
        this.showLoading(false);
        this.showError('Failed to load notifications. Please try again.');
      });
  },

  /**
   * Handle getNotifications response event
   */
  handleGetNotificationsResponse(data) {
    console.log('GetNotificationsScreen - Processing notifications response');

    this.isLoading = false;
    this.showLoading(false);

    // Layer 1: Check API-level error (error.longErrorCode)
    if (data.error && data.error.longErrorCode !== 0) {
      const errorMsg = data.error.errorString || 'API error occurred';
      console.error('GetNotificationsScreen - API error:', errorMsg, 'Code:', data.error.longErrorCode);
      this.showError(errorMsg);
      return;
    }

    // Layer 2: Check status code (pArgs.response.StatusCode)
    const statusCode = data.pArgs?.response?.StatusCode;
    if (statusCode !== 100) {
      const statusMsg = data.pArgs?.response?.StatusMsg || 'Failed to retrieve notifications';
      console.error('GetNotificationsScreen - Status error:', statusCode, 'Message:', statusMsg);
      this.showError(statusMsg);
      return;
    }

    // Success: Process notifications data
    this.notifications = data.pArgs?.response?.ResponseData?.notifications || [];
    console.log('GetNotificationsScreen - Received', this.notifications.length, 'notifications');

    // Sort by timestamp (newest first)
    this.notifications.sort((a, b) => {
      const timeA = new Date(a.body?.[0]?.timestamp || a.create_ts || 0);
      const timeB = new Date(b.body?.[0]?.timestamp || b.create_ts || 0);
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });

    // Display notifications
    this.renderNotifications();
  },

  /**
   * Render notifications list
   */
  renderNotifications() {
    const container = document.getElementById('notifications-list');
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    if (this.notifications.length === 0) {
      container.innerHTML = '<div class="empty-state">No notifications available</div>';
      return;
    }

    // Render each notification
    this.notifications.forEach((notification, index) => {
      const notifEl = this.createNotificationElement(notification, index);
      container.appendChild(notifEl);
    });

    console.log('GetNotificationsScreen - Rendered', this.notifications.length, 'notifications');
  },

  /**
   * Create notification element
   */
  createNotificationElement(notification, index) {
    const div = document.createElement('div');
    div.className = 'notification-item';

    // Extract notification data (Cordova plugin structure)
    const title = notification.body?.[0]?.subject || 'Notification';
    const message = notification.body?.[0]?.message || '';
    const timestamp = notification.create_ts || '';
    const expiryTimestamp = notification.expiry_timestamp || '';
    const actions = notification.actions || [];
    const actionCount = actions.length;
    const status = notification.action_performed || 'PENDING';

    div.innerHTML = `
      <div class="notification-header">
        <h3 class="notification-title">${title}</h3>
        <span class="notification-time">${this.formatTimestamp(timestamp)}</span>
      </div>
      <p class="notification-message">${message.replace(/<br\/>/g, ' ')}</p>
      <div class="notification-footer">
        <span class="notification-actions-count">${actionCount} action${actionCount !== 1 ? 's' : ''} available</span>
        <span class="notification-status">${status}</span>
      </div>
      ${expiryTimestamp ? `<p class="notification-expiry">Expires: ${this.formatTimestamp(expiryTimestamp)}</p>` : ''}
    `;

    // Make entire card clickable
    div.onclick = () => this.showActionModal(notification);
    div.style.cursor = 'pointer';

    return div;
  },

  /**
   * Format timestamp for display (matches React Native format)
   */
  formatTimestamp(timestamp) {
    if (!timestamp) return '';
    // Replace 'UTC' suffix with 'Z' for proper ISO 8601 format
    const isoTimestamp = timestamp.replace('UTC', 'Z');
    const date = new Date(isoTimestamp);
    return date.toLocaleString();
  },

  /**
   * Show action modal for notification (matches React Native UI)
   */
  showActionModal(notification) {
    console.log('GetNotificationsScreen - Opening action modal for notification:', notification.notification_uuid);

    this.currentNotification = notification;

    // Update modal content
    const modalTitle = document.getElementById('notification-modal-title');
    const modalBody = document.getElementById('notification-modal-body');

    // Extract notification data (Cordova plugin structure)
    const title = notification.body?.[0]?.subject || 'Notification';
    const message = notification.body?.[0]?.message || '';
    const createdTimestamp = notification.create_ts || '';
    const expiryTimestamp = notification.expiry_timestamp || '';
    const uuid = notification.notification_uuid || '';
    const actions = notification.actions || [];

    // Set modal title
    if (modalTitle) modalTitle.textContent = 'Notification Actions';

    // Build modal body with full details + action buttons (React Native style)
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="notification-details">
          <h3 class="detail-title">${title}</h3>
          <p class="detail-message">${message.replace(/<br\/>/g, '<br>')}</p>
          <p class="detail-time">Created: ${this.formatTimestamp(createdTimestamp)}</p>
          ${expiryTimestamp ? `<p class="detail-time">Expires: ${this.formatTimestamp(expiryTimestamp)}</p>` : ''}
          <p class="detail-uuid">ID: ${uuid}</p>
        </div>
        <div class="action-buttons-container">
          ${actions.map(action => `
            <button class="action-button" data-action="${action.action}">
              ${action.label}
            </button>
          `).join('')}
        </div>
      `;

      // Attach click handlers to action buttons
      const actionButtons = modalBody.querySelectorAll('.action-button');
      actionButtons.forEach(btn => {
        btn.onclick = () => this.handleActionButtonClick(btn.getAttribute('data-action'));
      });
    }

    // Show modal
    const modal = document.getElementById('notification-action-modal');
    if (modal) modal.style.display = 'flex';
  },

  /**
   * Close action modal
   */
  closeActionModal() {
    console.log('GetNotificationsScreen - Closing action modal');

    const modal = document.getElementById('notification-action-modal');
    if (modal) modal.style.display = 'none';

    this.currentNotification = null;
  },

  /**
   * Handle action button click (React Native style - direct action)
   */
  handleActionButtonClick(actionValue) {
    if (!this.currentNotification || !actionValue) {
      console.error('GetNotificationsScreen - Invalid action or notification');
      return;
    }

    // Store UUID BEFORE closing modal (closeActionModal sets currentNotification to null!)
    const notificationUUID = this.currentNotification.notification_uuid;

    console.log('GetNotificationsScreen - Action button clicked:', actionValue);
    console.log('GetNotificationsScreen - Notification UUID:', notificationUUID);

    // Close modal
    this.closeActionModal();

    // Show loading
    this.showLoading(true);

    // Call SDK updateNotification API
    rdnaService.updateNotification(notificationUUID, actionValue)
      .then((syncResponse) => {
        console.log('GetNotificationsScreen - UpdateNotification sync response:', JSON.stringify(syncResponse, null, 2));
        // Waiting for onUpdateNotification event
      })
      .catch((error) => {
        console.error('GetNotificationsScreen - UpdateNotification error:', JSON.stringify(error, null, 2));
        this.showLoading(false);
        this.showError('Failed to update notification. Please try again.');
      });
  },

  /**
   * Handle updateNotification response event (Cordova reference app pattern)
   */
  handleUpdateNotificationResponse(data) {
    console.log('GetNotificationsScreen - Processing update notification response');

    this.showLoading(false);

    // FIRST: Check errCode (API-level error)
    if (data.errCode !== 0) {
      const errorString = `${data.error.errorString}\nError: ${data.error.longErrorCode}`;
      console.error('GetNotificationsScreen - API error:', data.errCode, errorString);
      alert(errorString);
      this.loadNotifications(); // Refresh to get current state
      return;
    }

    // SECOND: Check response?.StatusCode
    const statusCode = data.pArgs?.response?.StatusCode;
    const statusMsg = data.pArgs?.response?.StatusMsg || 'Unknown error';

    if (statusCode === 100) {
      console.log('GetNotificationsScreen - Notification updated successfully:', statusMsg);
      alert('Action submitted successfully!');
      this.loadNotifications();
    } else {
      console.error('GetNotificationsScreen - StatusCode error:', statusCode, statusMsg);
      alert(statusMsg);
      this.loadNotifications();
    }
  },


  /**
   * Handle logout from drawer
   */
  async handleLogOut() {
    console.log('GetNotificationsScreen - Logging out user:', this.sessionParams.userID);

    try {
      const syncResponse = await rdnaService.logOff(this.sessionParams.userID);
      console.log('GetNotificationsScreen - logOff sync response received:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // Sync response successful - SDK will trigger onUserLoggedOff and getUser events
      console.log('GetNotificationsScreen - LogOff successful, waiting for SDK events');
    } catch (error) {
      console.error('GetNotificationsScreen - logOff error:', error);
      const errorMessage = error.error?.errorString || 'Failed to log out';
      alert('Logout Error\n\n' + errorMessage);
    }
  },

  /**
   * Handle refresh button press
   */
  handleRefresh() {
    console.log('GetNotificationsScreen - Refresh requested');
    this.loadNotifications();
  },

  /**
   * Show/hide loading indicator
   */
  showLoading(show) {
    const loader = document.getElementById('notifications-loading');
    if (loader) loader.style.display = show ? 'block' : 'none';
  },

  /**
   * Show error message
   */
  showError(message) {
    const errorEl = document.getElementById('notifications-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';

      // Auto-hide after 5 seconds
      setTimeout(() => {
        errorEl.style.display = 'none';
      }, 5000);
    }
  }
};

// Expose globally for NavigationService
window.GetNotificationsScreen = GetNotificationsScreen;
