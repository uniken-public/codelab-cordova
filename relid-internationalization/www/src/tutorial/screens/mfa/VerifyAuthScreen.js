/**
 * Verify Auth Screen - Device Activation with REL-ID Verify
 *
 * This screen handles additional device activation using REL-ID Verify push notifications.
 * When a user attempts to authenticate on an unregistered device, this screen is automatically
 * triggered by the SDK's addNewDeviceOptions event.
 *
 * Key Features:
 * - Automatic activation on screen load with performVerifyAuth(true)
 * - REL-ID Verify push notification to registered devices
 * - Fallback activation method support
 * - Real-time processing status updates
 *
 * User Flow:
 * 1. User enters username/password on unregistered device
 * 2. SDK triggers addNewDeviceOptions event
 * 3. SDKEventProvider auto-navigates to this screen
 * 4. Screen auto-calls performVerifyAuth(true)
 * 5. REL-ID server sends push notifications to user's registered devices
 * 6. User approves on registered device
 * 7. SDK continues to LDA consent or password flow
 * 8. OR user can tap "Use Alternative Method" for fallback activation
 *
 * SPA Lifecycle:
 * - onContentLoaded(params) - Called when template loaded into #app-content
 * - setupEventListeners() - Attach button handlers
 * - startDeviceActivation() - Auto-trigger REL-ID Verify
 */

const VerifyAuthScreen = {
  /**
   * Screen state
   */
  isProcessing: false,
  deviceOptions: [],

  /**
   * Called when screen content is loaded (SPA lifecycle)
   * Replaces React's componentDidMount
   *
   * @param {Object} params - Navigation parameters from SDKEventProvider
   */
  onContentLoaded(params) {
    console.log('VerifyAuthScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Store device options from SDK event
    this.deviceOptions = params.deviceOptions || [];

    // Setup UI
    this.setupEventListeners();
    this.updateUI(params);

    // Auto-start device activation with REL-ID Verify
    this.startDeviceActivation();
  },

  /**
   * Setup event listeners for buttons
   */
  setupEventListeners() {
    const closeBtn = document.getElementById('verify-auth-close-btn');
    const fallbackBtn = document.getElementById('fallback-activation-btn');

    if (closeBtn) {
      closeBtn.onclick = this.handleClose.bind(this);
    }

    if (fallbackBtn) {
      fallbackBtn.onclick = this.handleFallbackPress.bind(this);
    }

    console.log('VerifyAuthScreen - Event listeners attached');
  },

  /**
   * Handle close button - resets auth state
   */
  handleClose() {
    console.log('VerifyAuthScreen - Close button pressed, calling resetAuthState');

    rdnaService.resetAuthState()
      .then(() => {
        console.log('VerifyAuthScreen - ResetAuthState successful');
      })
      .catch((error) => {
        console.error('VerifyAuthScreen - ResetAuthState error:', error);
      });
  },

  /**
   * Update UI with parameters
   */
  updateUI(params) {
    // Update title if provided
    const titleEl = document.getElementById('verify-auth-title');
    if (titleEl && params.title) {
      titleEl.textContent = params.title;
    }

    // Update subtitle if provided
    const subtitleEl = document.getElementById('verify-auth-subtitle');
    if (subtitleEl && params.subtitle) {
      subtitleEl.textContent = params.subtitle;
    }

    // Show device count if available
    if (this.deviceOptions.length > 0) {
      this.showStatus(`Found ${this.deviceOptions.length} registered device(s) for verification`);
    }
  },

  /**
   * Start device activation with REL-ID Verify (auto-triggered)
   */
  startDeviceActivation() {
    if (this.isProcessing) {
      console.log('VerifyAuthScreen - Already processing, skipping');
      return;
    }

    this.isProcessing = true;
    this.showProcessing(true);
    this.updateButtonState(true);
    this.updateCloseButtonState(true);
    console.log('VerifyAuthScreen - Starting REL-ID Verify activation (automatic)');

    // Call SDK performVerifyAuth API with true (send notifications)
    rdnaService.performVerifyAuth(true)
      .then((syncResponse) => {
        console.log('VerifyAuthScreen - PerformVerifyAuth sync response:', JSON.stringify(syncResponse, null, 2));

        // Success - reset processing state
        this.isProcessing = false;
        this.showProcessing(false);
        this.updateButtonState(false);
        this.updateCloseButtonState(false);

        console.log('VerifyAuthScreen - Verification notification sent successfully');
        console.log('VerifyAuthScreen - Waiting for user approval on registered device');
        console.log('VerifyAuthScreen - Fallback button now enabled if needed');

        // SDK will trigger subsequent events (getPassword, getUserConsentForLDA, etc.) after approval
        // SDKEventProvider will handle automatic navigation
      })
      .catch((error) => {
        console.error('VerifyAuthScreen - PerformVerifyAuth error:', JSON.stringify(error, null, 2));

        this.isProcessing = false;
        this.showProcessing(false);
        this.updateButtonState(false);
        this.updateCloseButtonState(false);

        const errorMessage = error.error?.errorString || 'Device activation failed';
        this.showError(errorMessage);
      });
  },

  /**
   * Handle fallback activation button press
   */
  handleFallbackPress() {
    if (this.isProcessing) {
      console.log('VerifyAuthScreen - Already processing, ignoring fallback press');
      return;
    }

    console.log('VerifyAuthScreen - Fallback activation requested');

    this.isProcessing = true;
    this.updateButtonState(true);
    this.showStatus('Starting alternative activation method...');

    // Call SDK fallback API
    rdnaService.fallbackNewDeviceActivationFlow()
      .then((syncResponse) => {
        console.log('VerifyAuthScreen - Fallback activation sync response:', JSON.stringify(syncResponse, null, 2));

        // Reset processing state (SDK will handle the rest via events)
        this.isProcessing = false;
        this.updateButtonState(false);
        this.showProcessing(false);

        // Success - SDK will trigger getActivationCode or other challenge events
        this.showStatus('Alternative activation initiated. Please complete the verification.');
        console.log('VerifyAuthScreen - Waiting for SDK to trigger fallback challenge event');
      })
      .catch((error) => {
        console.error('VerifyAuthScreen - Fallback activation error:', JSON.stringify(error, null, 2));

        this.isProcessing = false;
        this.updateButtonState(false);
        this.showProcessing(false);

        const errorMessage = error.error?.errorString || 'Fallback activation failed';
        this.showError(errorMessage);
        alert(`Fallback Activation Error\n\n${errorMessage}\n\nPlease try again.`);
      });
  },

  /**
   * Update button states (loading/enabled)
   */
  updateButtonState(isLoading) {
    const fallbackBtn = document.getElementById('fallback-activation-btn');

    if (fallbackBtn) {
      fallbackBtn.disabled = isLoading;
      fallbackBtn.textContent = isLoading ? 'Processing...' : 'Activate using fallback method';
    }
  },

  /**
   * Update close button state
   */
  updateCloseButtonState(isDisabled) {
    const closeBtn = document.getElementById('verify-auth-close-btn');
    if (closeBtn) {
      closeBtn.disabled = isDisabled;
      closeBtn.style.opacity = isDisabled ? '0.5' : '1';
    }
  },

  /**
   * Show/hide processing status banner
   */
  showProcessing(show) {
    const processingEl = document.getElementById('verify-auth-processing');
    if (processingEl) {
      processingEl.style.display = show ? 'block' : 'none';
    }
  },

  /**
   * Show status message (info banner)
   */
  showStatus(message) {
    const statusEl = document.getElementById('verify-auth-processing');
    const bannerText = statusEl?.querySelector('.banner-text');

    if (statusEl && bannerText) {
      bannerText.textContent = message;
      statusEl.style.display = 'block';
    }
    console.log('VerifyAuthScreen - Status:', message);
  },

  /**
   * Show error message
   */
  showError(message) {
    const errorEl = document.getElementById('verify-auth-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
    console.error('VerifyAuthScreen - Error:', message);
  }
};

// Expose globally for NavigationService
window.VerifyAuthScreen = VerifyAuthScreen;
