/**
 * Dashboard Screen - SPA Module
 *
 * Main dashboard displayed after successful MFA authentication.
 * Shows session information and provides logout functionality.
 *
 * Features:
 * - Welcome message with user information
 * - Session details display (ID, type, login time)
 * - JWT token information parsing and display
 * - Logout functionality with confirmation
 * - Menu button for drawer (future enhancement)
 *
 * SDK Integration:
 * - Receives session data from onUserLoggedIn event
 * - Calls rdnaService.logOff(userID) for logout
 * - Displays JWT token details
 *
 * SPA Pattern:
 * - onContentLoaded(params) called when navigated to
 * - setupEventListeners() attaches DOM handlers
 * - populateSessionData() fills UI with session info
 * - No page reload, just content swap
 */

const DashboardScreen = {
  /**
   * Current state (replaces React useState)
   */
  state: {
    userID: '',
    sessionID: '',
    sessionType: '',
    jwtToken: '',
    loginTime: '',
    isLoggingOut: false
  },

  /**
   * Called when screen content is loaded into #app-content
   *
   * @param {Object} params - Navigation parameters
   * @param {string} params.userID - User identifier
   * @param {string} params.sessionID - Session ID from SDK
   * @param {number} params.sessionType - Session type
   * @param {string} params.jwtToken - JWT token JSON string
   * @param {string} params.loginTime - Login timestamp
   */
  onContentLoaded(params) {
    console.log('DashboardScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Store state from params
    this.state = {
      userID: params.userID || '',
      sessionID: params.sessionID || '',
      sessionType: params.sessionType || '',
      jwtToken: params.jwtToken || '',
      loginTime: params.loginTime || new Date().toLocaleString(),
      isLoggingOut: false
    };

    // Setup DOM event listeners
    this.setupEventListeners();

    // Populate session data in UI
    this.populateSessionData();
  },

  /**
   * Attach event listeners to DOM elements
   */
  setupEventListeners() {
    const menuBtn = document.getElementById('dashboard-menu-btn');
    const drawerLogoutLink = document.getElementById('drawer-logout-link');
    const drawerDashboardLink = document.getElementById('drawer-dashboard-link');

    if (menuBtn) {
      menuBtn.onclick = () => {
        console.log('DashboardScreen - Menu button clicked, opening drawer');
        NavigationService.openDrawer();
      };
    }

    // Drawer menu links
    if (drawerLogoutLink) {
      // Reset logout link state (in case it was disabled from previous session)
      drawerLogoutLink.style.opacity = '1';
      drawerLogoutLink.style.pointerEvents = 'auto';

      drawerLogoutLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        this.handleLogOut();
      };
    }

    if (drawerDashboardLink) {
      drawerDashboardLink.onclick = (e) => {
        e.preventDefault();
        NavigationService.closeDrawer();
        // Already on dashboard, just close drawer
      };
    }

    // Populate drawer with user info
    this.updateDrawerUserInfo();
  },

  /**
   * Populate session data in UI
   */
  populateSessionData() {
    // Set username
    const usernameEl = document.getElementById('dashboard-username');
    if (usernameEl) {
      usernameEl.textContent = this.state.userID;
    }

    // Set session ID
    const sessionIdEl = document.getElementById('dashboard-session-id');
    if (sessionIdEl) {
      sessionIdEl.textContent = this.state.sessionID || 'N/A';
    }

    // Set session type
    const sessionTypeEl = document.getElementById('dashboard-session-type');
    if (sessionTypeEl) {
      sessionTypeEl.textContent = this.state.sessionType || 'N/A';
    }

    // Set login time
    const loginTimeEl = document.getElementById('dashboard-login-time');
    if (loginTimeEl) {
      loginTimeEl.textContent = this.state.loginTime;
    }

    // Parse and display JWT info if available
    if (this.state.jwtToken) {
      this.displayJWTInfo();
    }
  },

  /**
   * Parse and display JWT token information
   */
  displayJWTInfo() {
    try {
      const tokenData = JSON.parse(this.state.jwtToken);

      const jwtCard = document.getElementById('jwt-info-card');
      if (jwtCard) {
        jwtCard.style.display = 'block';
      }

      // Access Token
      const accessTokenEl = document.getElementById('jwt-access-token');
      if (accessTokenEl) {
        accessTokenEl.textContent = tokenData.access_token ? 'Present' : 'Not available';
      }

      // Token Type
      const tokenTypeEl = document.getElementById('jwt-token-type');
      if (tokenTypeEl) {
        tokenTypeEl.textContent = tokenData.token_type || 'Unknown';
      }

      // Expires In
      const expiresInEl = document.getElementById('jwt-expires-in');
      if (expiresInEl) {
        const expiresIn = tokenData.expires_in || 'Unknown';
        expiresInEl.textContent = expiresIn !== 'Unknown' ? `${expiresIn} seconds` : expiresIn;
      }

      console.log('DashboardScreen - JWT info displayed successfully');
    } catch (error) {
      console.error('DashboardScreen - Failed to parse JWT token:', error);
    }
  },

  /**
   * Handle logout button click
   */
  handleLogOut() {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to log out from the application?');

    if (confirmed) {
      this.performLogOut();
    }
  },

  /**
   * Perform the actual logout operation
   */
  async performLogOut() {
    if (this.state.isLoggingOut) return;

    console.log('DashboardScreen - Initiating logOff for user:', this.state.userID);
    this.setLoggingOut(true);

    try {
      const syncResponse = await rdnaService.logOff(this.state.userID);
      console.log('DashboardScreen - logOff sync response received:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // Sync response successful - SDK will trigger onUserLoggedOff and getUser events
      console.log('DashboardScreen - LogOff successful, waiting for SDK events');

    } catch (error) {
      console.error('DashboardScreen - logOff error:', error);
      this.setLoggingOut(false);

      const errorMessage = error.error?.errorString || 'Failed to log out';
      alert('Logout Error\n\n' + errorMessage);
    }
  },

  /**
   * Set logging out state
   */
  setLoggingOut(isLoggingOut) {
    this.state.isLoggingOut = isLoggingOut;

    // Disable drawer logout link during logout
    const drawerLogoutLink = document.getElementById('drawer-logout-link');
    if (drawerLogoutLink) {
      drawerLogoutLink.style.opacity = isLoggingOut ? '0.5' : '1';
      drawerLogoutLink.style.pointerEvents = isLoggingOut ? 'none' : 'auto';
    }
  },

  /**
   * Show error message
   */
  showError(message) {
    alert('Error\n\n' + message);
  },

  /**
   * Hide error message
   */
  hideError() {
    // No-op for dashboard (uses alerts)
  },

  /**
   * Update drawer with user information
   */
  updateDrawerUserInfo() {
    const drawerUserInfo = document.getElementById('drawer-user-info');
    const drawerUsername = document.getElementById('drawer-username');

    if (drawerUserInfo && drawerUsername && this.state.userID) {
      drawerUsername.textContent = this.state.userID;
      drawerUserInfo.style.display = 'block';
    }
  }
};

// Expose to global scope for NavigationService
window.DashboardScreen = DashboardScreen;
