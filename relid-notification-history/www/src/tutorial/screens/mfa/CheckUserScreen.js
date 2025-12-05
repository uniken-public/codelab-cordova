/**
 * Check User Screen - SPA Module
 *
 * Username input screen for MFA authentication flow.
 * Handles username validation with cyclical getUser/setUser pattern.
 *
 * Features:
 * - Username input with validation
 * - Real-time error handling from SDK events
 * - Loading states during API call
 * - Success/error feedback via status banner
 * - Clear and retry functionality
 *
 * SDK Integration:
 * - Receives getUser event data via params
 * - Calls rdnaService.setUser(username)
 * - Handles cyclical validation (SDK may trigger getUser again if validation fails)
 *
 * SPA Pattern:
 * - onContentLoaded(params) called when navigated to
 * - setupEventListeners() attaches DOM handlers
 * - processResponseData() handles SDK event data
 * - No page reload, just content swap
 */

const CheckUserScreen = {
  /**
   * Current state (replaces React useState)
   */
  state: {
    username: '',
    error: '',
    isValidating: false,
    validationResult: null
  },

  /**
   * Called when screen content is loaded into #app-content
   * Replaces React's componentDidMount / useEffect
   *
   * @param {Object} params - Navigation parameters
   * @param {Object} params.responseData - SDK event data from getUser
   */
  onContentLoaded(params) {
    console.log('CheckUserScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Reset state
    this.state = {
      username: '',
      error: '',
      isValidating: false,
      validationResult: null
    };

    // Setup DOM event listeners
    this.setupEventListeners();

    // Process response data if available
    if (params.responseData) {
      this.processResponseData(params.responseData);
    }
  },

  /**
   * Attach event listeners to DOM elements
   */
  setupEventListeners() {
    const usernameInput = document.getElementById('username-input');
    const setUserBtn = document.getElementById('set-user-btn');

    if (usernameInput) {
      // Clear error on input change
      usernameInput.oninput = () => {
        this.state.username = usernameInput.value;
        this.hideError();
        this.hideStatusBanner();
      };

      // Submit on Enter key
      usernameInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
          this.handleSetUser();
        }
      };

      // Auto-focus
      usernameInput.focus();
    }

    if (setUserBtn) {
      setUserBtn.onclick = () => this.handleSetUser();
    }
  },

  /**
   * Process SDK response data (from getUser event)
   * @param {Object} responseData - Event data from SDK
   */
  processResponseData(responseData) {
    console.log('CheckUserScreen - Processing response data');

    // Check for API errors
    if (responseData.error && responseData.error.longErrorCode !== 0) {
      const errorMessage = responseData.error.errorString;
      console.log('CheckUserScreen - API error:', errorMessage);
      this.showError(errorMessage);
      this.showStatusBanner(errorMessage, 'error');
      return;
    }

    // Check for status errors
    if (responseData.challengeResponse &&
        responseData.challengeResponse.status.statusCode !== 100 &&
        responseData.challengeResponse.status.statusCode !== 0) {
      const errorMessage = responseData.challengeResponse.status.statusMessage;
      console.log('CheckUserScreen - Status error:', errorMessage);
      this.showError(errorMessage);
      this.showStatusBanner(errorMessage, 'error');
      return;
    }

    // Success case
    console.log('CheckUserScreen - Ready for username input');
  },

  /**
   * Handle setUser button click
   */
  async handleSetUser() {
    const username = this.state.username.trim();

    if (!username) {
      this.showError('Please enter a username');
      return;
    }

    console.log('CheckUserScreen - Setting user:', username);
    this.setValidating(true);
    this.hideError();
    this.hideStatusBanner();

    try {
      const syncResponse = await rdnaService.setUser(username);
      console.log('CheckUserScreen - setUser sync response received:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // Sync response successful - waiting for async events
      console.log('CheckUserScreen - Waiting for SDK async events (getUser, getActivationCode, or getPassword)');

    } catch (error) {
      console.error('CheckUserScreen - setUser error:', error);
      this.setValidating(false);

      const errorMessage = error.error?.errorString || 'Failed to set user';
      this.showError(errorMessage);
      this.showStatusBanner(errorMessage, 'error');
    }
  },

  /**
   * Set validating state
   */
  setValidating(isValidating) {
    this.state.isValidating = isValidating;

    const btn = document.getElementById('set-user-btn');
    const btnText = document.getElementById('set-user-btn-text');
    const btnLoader = document.getElementById('set-user-btn-loader');

    if (btn) btn.disabled = isValidating;
    if (btnText) btnText.style.display = isValidating ? 'none' : 'inline';
    if (btnLoader) btnLoader.style.display = isValidating ? 'inline-flex' : 'none';
  },

  /**
   * Show error message
   */
  showError(message) {
    const errorDiv = document.getElementById('checkuser-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  },

  /**
   * Hide error message
   */
  hideError() {
    const errorDiv = document.getElementById('checkuser-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
    }
  },

  /**
   * Show status banner
   */
  showStatusBanner(message, type = 'info') {
    const banner = document.getElementById('checkuser-status-banner');
    if (banner) {
      banner.textContent = message;
      banner.className = `status-banner status-${type}`;
      banner.style.display = 'block';
    }
  },

  /**
   * Hide status banner
   */
  hideStatusBanner() {
    const banner = document.getElementById('checkuser-status-banner');
    if (banner) {
      banner.style.display = 'none';
    }
  }
};

// Expose to global scope for NavigationService
window.CheckUserScreen = CheckUserScreen;
