/**
 * Device Detail Screen - Device Information and Management
 *
 * This screen displays complete device information and provides rename and delete operations.
 *
 * Key Features:
 * - Complete device metadata display (UUID, status, timestamps, app UUID)
 * - Rename device with inline modal
 * - Delete device with confirmation dialog
 * - Current device protection (cannot delete current device)
 * - Cooling period enforcement (all operations disabled during cooling period)
 * - Three-layer error handling (API errors, status codes, Promise rejections)
 * - Success/error feedback with alerts
 *
 * User Flow:
 * 1. User taps device card in Device Management screen
 * 2. Navigation to Device Detail screen with device params
 * 3. View complete device information
 * 4. Tap "Rename Device" → Modal opens → Enter new name → Submit
 * 5. OR tap "Remove Device" → Confirmation alert → Confirm/Cancel
 * 6. Success → Alert → Navigate back to device list
 * 7. Error → Alert with error message → Stay on screen
 *
 * SPA Lifecycle:
 * - onContentLoaded(params) - Called when template loaded, displays device info
 * - setupEventListeners() - Attach rename/delete button handlers
 * - handleRename() - Process rename operation
 * - handleDelete() - Process delete operation
 * - handleUpdateDeviceResponse() - Handle SDK event response
 */

const DeviceDetailScreen = {
  /**
   * Screen state
   */
  device: null,
  isCoolingPeriodActive: false,
  coolingPeriodEndTimestamp: null,
  coolingPeriodMessage: '',
  sessionParams: {},
  isSubmitting: false,

  /**
   * Called when screen content is loaded (SPA lifecycle)
   *
   * @param {Object} params - Navigation parameters (must include device, userID, cooling period info)
   */
  onContentLoaded(params) {
    console.log('DeviceDetailScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Store all params
    this.sessionParams = params || {};
    this.device = params.device || null;
    this.isCoolingPeriodActive = params.isCoolingPeriodActive || false;
    this.coolingPeriodEndTimestamp = params.coolingPeriodEndTimestamp || null;
    this.coolingPeriodMessage = params.coolingPeriodMessage || '';

    // Validate required device parameter
    if (!this.device) {
      console.error('DeviceDetailScreen - device is required in params');
      this.showError('Device information not available');
      setTimeout(() => {
        this.navigateBack();
      }, 2000);
      return;
    }

    // Validate required userID parameter
    if (!this.sessionParams.userID) {
      console.error('DeviceDetailScreen - userID is required in params');
      this.showError('Session expired. Please log in again.');
      return;
    }

    // Store session params globally
    if (typeof SDKEventProvider !== 'undefined') {
      SDKEventProvider.setSessionParams(this.sessionParams);
    }

    // Setup UI
    this.setupEventListeners();
    this.registerSDKEventHandlers();

    // Display device information
    this.displayDeviceInfo();

    // Show cooling period warning if active
    if (this.isCoolingPeriodActive) {
      this.showCoolingPeriodWarning();
    }
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Back button
    const backBtn = document.getElementById('device-detail-back-btn');
    if (backBtn) {
      backBtn.onclick = () => {
        console.log('DeviceDetailScreen - Back button tapped');
        this.navigateBack();
      };
    }

    // Rename button
    const renameBtn = document.getElementById('rename-device-btn');
    if (renameBtn) {
      renameBtn.onclick = () => {
        console.log('DeviceDetailScreen - Rename button tapped');
        if (!this.isCoolingPeriodActive) {
          this.showRenameModal();
        }
      };
    }

    // Delete button
    const deleteBtn = document.getElementById('delete-device-btn');
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        console.log('DeviceDetailScreen - Delete button tapped');
        if (!this.isCoolingPeriodActive && !this.device.currentDevice) {
          this.showDeleteConfirmation();
        }
      };
    }

    // Rename modal controls
    const renameModalClose = document.getElementById('rename-modal-close');
    const renameModalCancel = document.getElementById('rename-modal-cancel');
    const renameModalSubmit = document.getElementById('rename-modal-submit');
    const renameInput = document.getElementById('rename-device-input');

    if (renameModalClose) {
      renameModalClose.onclick = () => this.hideRenameModal();
    }

    if (renameModalCancel) {
      renameModalCancel.onclick = () => this.hideRenameModal();
    }

    if (renameModalSubmit) {
      renameModalSubmit.onclick = () => this.handleRenameSubmit();
    }

    if (renameInput) {
      // Clear error on input
      renameInput.oninput = () => {
        const errorElement = document.getElementById('rename-error');
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      };

      // Submit on Enter key
      renameInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
          this.handleRenameSubmit();
        }
      };
    }

    console.log('DeviceDetailScreen - Event listeners setup complete');
  },

  /**
   * Register SDK event handlers
   */
  registerSDKEventHandlers() {
    const eventManager = rdnaService.getEventManager();

    // Handle updateDeviceDetails response
    eventManager.setUpdateDeviceDetailsHandler((data) => {
      console.log('DeviceDetailScreen - onUpdateDeviceDetails event received');
      this.handleUpdateDeviceResponse(data);
    });

    console.log('DeviceDetailScreen - SDK event handlers registered');
  },

  /**
   * Display device information
   */
  displayDeviceInfo() {
    // Device name
    const nameElement = document.getElementById('device-detail-name');
    if (nameElement) {
      nameElement.textContent = this.device.devName || 'Unnamed Device';
    }

    // Current device banner
    const currentBanner = document.getElementById('current-device-banner');
    if (currentBanner) {
      currentBanner.style.display = this.device.currentDevice ? 'block' : 'none';
    }

    // Status
    const statusElement = document.getElementById('device-detail-status');
    const statusRow = statusElement?.parentElement;
    const statusDot = statusRow?.querySelector('.status-dot');

    if (statusElement) {
      statusElement.textContent = this.device.status || 'Unknown';
      statusElement.className = 'status-text';

      if (this.device.status === 'ACTIVE') {
        statusElement.classList.add('status-active');
        if (statusDot) {
          statusDot.style.backgroundColor = '#34C759';
        }
      } else {
        statusElement.classList.add('status-inactive');
        if (statusDot) {
          statusDot.style.backgroundColor = '#FF3B30';
        }
      }
    }

    // UUID
    const uuidElement = document.getElementById('device-detail-uuid');
    if (uuidElement) {
      uuidElement.textContent = this.device.devUUID || 'N/A';
    }

    // App UUID
    const appUuidElement = document.getElementById('device-detail-app-uuid');
    if (appUuidElement) {
      appUuidElement.textContent = this.device.appUuid || 'N/A';
    }

    // Last Accessed
    const lastAccessedElement = document.getElementById('device-detail-last-accessed');
    const lastAccessedRelativeElement = document.getElementById('device-detail-last-accessed-relative');
    if (lastAccessedElement) {
      lastAccessedElement.textContent = this.formatTimestamp(this.device.lastAccessedTsEpoch);
    }
    if (lastAccessedRelativeElement) {
      const relativeTime = this.getRelativeTime(this.device.lastAccessedTsEpoch);
      if (relativeTime) {
        lastAccessedRelativeElement.textContent = relativeTime;
        lastAccessedRelativeElement.style.display = 'block';
      } else {
        lastAccessedRelativeElement.style.display = 'none';
      }
    }

    // Created
    const createdElement = document.getElementById('device-detail-created');
    const createdRelativeElement = document.getElementById('device-detail-created-relative');
    if (createdElement) {
      createdElement.textContent = this.formatTimestamp(this.device.createdTsEpoch);
    }
    if (createdRelativeElement) {
      const relativeTime = this.getRelativeTime(this.device.createdTsEpoch);
      if (relativeTime) {
        createdRelativeElement.textContent = relativeTime;
        createdRelativeElement.style.display = 'block';
      } else {
        createdRelativeElement.style.display = 'none';
      }
    }

    // Device Bind
    const bindElement = document.getElementById('device-detail-bind');
    if (bindElement) {
      bindElement.textContent = this.device.devBind !== undefined ? this.device.devBind : 'N/A';
    }

    // Control buttons based on cooling period and current device
    this.updateButtonStates();
  },

  /**
   * Update button states based on cooling period and current device
   */
  updateButtonStates() {
    const renameBtn = document.getElementById('rename-device-btn');
    const deleteBtn = document.getElementById('delete-device-btn');

    // Disable buttons during cooling period
    if (renameBtn) {
      renameBtn.disabled = this.isCoolingPeriodActive;
      if (this.isCoolingPeriodActive) {
        renameBtn.classList.add('button-disabled');
      } else {
        renameBtn.classList.remove('button-disabled');
      }
    }

    if (deleteBtn) {
      // Hide delete button if current device, disable if cooling period
      if (this.device.currentDevice) {
        deleteBtn.style.display = 'none';
      } else {
        deleteBtn.style.display = 'block';
        deleteBtn.disabled = this.isCoolingPeriodActive;
        if (this.isCoolingPeriodActive) {
          deleteBtn.classList.add('button-disabled');
        } else {
          deleteBtn.classList.remove('button-disabled');
        }
      }
    }
  },

  /**
   * Format timestamp for display (matches mockup format)
   * @param {number} timestamp - Epoch timestamp in milliseconds
   */
  formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown';

    try {
      const date = new Date(timestamp);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('DeviceDetailScreen - Invalid timestamp:', timestamp);
        return 'Invalid Date';
      }
      // Format: "Thu, October 16, 2025 at 12:40:44 PM"
      return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).replace(',', '').replace(',', ' at');
    } catch (error) {
      console.error('DeviceDetailScreen - Error formatting timestamp:', error);
      return 'Unknown';
    }
  },

  /**
   * Get relative time string (e.g., "Just now", "2 minutes ago")
   * @param {number} timestamp - Epoch timestamp in milliseconds
   */
  getRelativeTime(timestamp) {
    if (!timestamp) return '';

    try {
      const date = new Date(timestamp);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('DeviceDetailScreen - Invalid timestamp for relative time:', timestamp);
        return '';
      }

      const now = Date.now();
      const diffMs = now - timestamp;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) {
        return 'Just now';
      } else if (diffMins < 60) {
        return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
      } else if (diffHours < 24) {
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
      } else if (diffDays < 7) {
        return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
      } else {
        return '';
      }
    } catch (error) {
      console.error('DeviceDetailScreen - Error calculating relative time:', error);
      return '';
    }
  },

  /**
   * Show rename modal
   */
  showRenameModal() {
    const modal = document.getElementById('rename-device-modal');
    const currentNameElement = document.getElementById('rename-current-name');
    const input = document.getElementById('rename-device-input');
    const errorElement = document.getElementById('rename-error');

    if (modal) {
      modal.style.display = 'flex';
    }

    // Display current device name
    if (currentNameElement) {
      currentNameElement.textContent = this.device.devName || 'Unnamed Device';
    }

    // Clear input and focus
    if (input) {
      input.value = '';
      input.focus();
    }

    if (errorElement) {
      errorElement.style.display = 'none';
    }
  },

  /**
   * Hide rename modal
   */
  hideRenameModal() {
    const modal = document.getElementById('rename-device-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  },

  /**
   * Handle rename submit
   */
  handleRenameSubmit() {
    const input = document.getElementById('rename-device-input');
    const errorElement = document.getElementById('rename-error');

    if (!input) return;

    const newName = input.value.trim();

    // Validation
    if (!newName) {
      this.showRenameError('Device name cannot be empty');
      return;
    }

    if (newName === this.device.devName) {
      this.showRenameError('Please enter a different name');
      return;
    }

    if (newName.length < 3) {
      this.showRenameError('Device name must be at least 3 characters');
      return;
    }

    if (newName.length > 50) {
      this.showRenameError('Device name must be less than 50 characters');
      return;
    }

    // Clear error
    if (errorElement) {
      errorElement.style.display = 'none';
    }

    // Perform rename
    this.performRename(newName);
  },

  /**
   * Show rename error
   */
  showRenameError(message) {
    const errorElement = document.getElementById('rename-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  },

  /**
   * Perform rename operation
   */
  performRename(newName) {
    if (this.isSubmitting) {
      console.log('DeviceDetailScreen - Already submitting');
      return;
    }

    this.isSubmitting = true;
    console.log('DeviceDetailScreen - Renaming device to:', newName);

    // Show loading in submit button
    const submitBtn = document.getElementById('rename-modal-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Renaming...';
    }

    // Build device payload for rename operation
    const devicePayload = {
      device: [{
        devUUID: this.device.devUUID,
        devName: newName,
        status: "Update", // Rename operation
        lastAccessedTs: this.device.lastAccessedTs,
        lastAccessedTsEpoch: this.device.lastAccessedTsEpoch,
        createdTs: this.device.createdTs,
        createdTsEpoch: this.device.createdTsEpoch,
        appUuid: this.device.appUuid,
        currentDevice: this.device.currentDevice,
        devBind: this.device.devBind
      }]
    };

    // Call SDK updateDeviceDetails API
    rdnaService.updateDeviceDetails(this.sessionParams.userID, JSON.stringify(devicePayload))
      .then((syncResponse) => {
        console.log('DeviceDetailScreen - UpdateDeviceDetails sync response:', JSON.stringify(syncResponse, null, 2));
        // Waiting for onUpdateDeviceDetails event
      })
      .catch((error) => {
        console.error('DeviceDetailScreen - UpdateDeviceDetails error:', JSON.stringify(error, null, 2));
        this.isSubmitting = false;

        // Reset submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Rename';
        }

        this.hideRenameModal();
        this.showError('Failed to rename device. Please try again.');
      });
  },

  /**
   * Show delete confirmation
   */
  showDeleteConfirmation() {
    const confirmed = confirm(`Are you sure you want to remove "${this.device.devName || 'this device'}"?\n\nThis action cannot be undone.`);

    if (confirmed) {
      this.performDelete();
    }
  },

  /**
   * Perform delete operation
   */
  performDelete() {
    if (this.isSubmitting) {
      console.log('DeviceDetailScreen - Already submitting');
      return;
    }

    this.isSubmitting = true;
    console.log('DeviceDetailScreen - Deleting device:', this.device.devUUID);

    // Disable buttons
    const renameBtn = document.getElementById('rename-device-btn');
    const deleteBtn = document.getElementById('delete-device-btn');
    if (renameBtn) renameBtn.disabled = true;
    if (deleteBtn) {
      deleteBtn.disabled = true;
      deleteBtn.textContent = 'Removing...';
    }

    // Build device payload for delete operation
    const devicePayload = {
      device: [{
        devUUID: this.device.devUUID,
        devName: "", // Empty for delete
        status: "Delete", // Delete operation
        lastAccessedTs: this.device.lastAccessedTs,
        lastAccessedTsEpoch: this.device.lastAccessedTsEpoch,
        createdTs: this.device.createdTs,
        createdTsEpoch: this.device.createdTsEpoch,
        appUuid: this.device.appUuid,
        currentDevice: this.device.currentDevice,
        devBind: this.device.devBind
      }]
    };

    // Call SDK updateDeviceDetails API
    rdnaService.updateDeviceDetails(this.sessionParams.userID, JSON.stringify(devicePayload))
      .then((syncResponse) => {
        console.log('DeviceDetailScreen - UpdateDeviceDetails (delete) sync response:', JSON.stringify(syncResponse, null, 2));
        // Waiting for onUpdateDeviceDetails event
      })
      .catch((error) => {
        console.error('DeviceDetailScreen - UpdateDeviceDetails (delete) error:', JSON.stringify(error, null, 2));
        this.isSubmitting = false;

        // Reset buttons
        if (renameBtn) renameBtn.disabled = false;
        if (deleteBtn) {
          deleteBtn.disabled = false;
          deleteBtn.textContent = 'Remove Device';
        }

        this.showError('Failed to delete device. Please try again.');
      });
  },

  /**
   * Handle updateDeviceDetails response event
   */
  handleUpdateDeviceResponse(data) {
    console.log('DeviceDetailScreen - Processing update device response');

    this.isSubmitting = false;

    // Reset buttons
    const submitBtn = document.getElementById('rename-modal-submit');
    const deleteBtn = document.getElementById('delete-device-btn');
    const renameBtn = document.getElementById('rename-device-btn');

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Rename';
    }
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.textContent = 'Remove Device';
    }
    if (renameBtn) {
      renameBtn.disabled = false;
    }

    // Layer 1: Check API-level error (error.longErrorCode)
    if (data.error && data.error.longErrorCode !== 0) {
      const errorMsg = data.error.errorString || 'API error occurred';
      console.error('DeviceDetailScreen - API error:', errorMsg, 'Code:', data.error.longErrorCode);
      this.hideRenameModal();
      this.showError(errorMsg);
      return;
    }

    // Layer 2: Check status code (pArgs.response.StatusCode)
    const statusCode = data.pArgs?.response?.StatusCode;
    if (statusCode === 146) {
      // Cooling period active
      console.log('DeviceDetailScreen - Cooling period detected');
      this.hideRenameModal();
      this.showError('Device management operations are temporarily disabled. Please try again later.');
      return;
    } else if (statusCode !== 100) {
      const statusMsg = data.pArgs?.response?.StatusMsg || 'Operation failed';
      console.error('DeviceDetailScreen - Status error:', statusCode, 'Message:', statusMsg);
      this.hideRenameModal();
      this.showError(statusMsg);
      return;
    }

    // Success
    const message = data.pArgs?.response?.StatusMsg || 'Device updated successfully';
    console.log('DeviceDetailScreen - Operation successful:', message);

    this.hideRenameModal();
    alert(message);

    // Navigate back to device list
    setTimeout(() => {
      this.navigateBack();
    }, 500);
  },

  /**
   * Navigate back to device management screen
   */
  navigateBack() {
    NavigationService.navigate('DeviceManagement', this.sessionParams);
  },

  /**
   * Show error message
   */
  showError(message) {
    const errorElement = document.getElementById('device-detail-error');
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
   * Show cooling period warning
   */
  showCoolingPeriodWarning() {
    const warningCard = document.getElementById('device-detail-cooling-warning');
    const warningMessage = document.getElementById('device-detail-cooling-message');
    const warningEnd = document.getElementById('device-detail-cooling-end');

    if (warningCard) {
      warningCard.style.display = 'block';
    }

    if (warningMessage) {
      warningMessage.textContent = this.coolingPeriodMessage || 'All device management operations are temporarily disabled.';
    }

    if (warningEnd && this.coolingPeriodEndTimestamp) {
      const endDate = new Date(this.coolingPeriodEndTimestamp);
      warningEnd.textContent = `Available after: ${endDate.toLocaleString()}`;
      warningEnd.style.display = 'block';
    } else if (warningEnd) {
      warningEnd.style.display = 'none';
    }
  }
};

// Expose globally for NavigationService
window.DeviceDetailScreen = DeviceDetailScreen;
