/**
 * Navigation Service - SPA Architecture
 *
 * Centralized navigation management for Cordova Single Page Application.
 * Uses template-based content swapping instead of page reloads for better UX.
 *
 * SPA Architecture Features:
 * - Template-based content swapping (no page reloads)
 * - Parameter passing to screen modules
 * - Current route tracking
 * - Screen lifecycle management (onContentLoaded)
 * - Persistent event handlers across navigation
 *
 * Key Difference from Multi-Page:
 * - Uses template.content.cloneNode() instead of window.location.href
 * - Calls screenObj.onContentLoaded(params) instead of page load
 * - No white flash between screens
 * - Event handlers registered once, persist forever
 */

const NavigationService = {
  /**
   * Current route name
   * @type {string|null}
   */
  currentRoute: null,

  /**
   * Navigate to a screen with optional parameters (SPA template swapping)
   * @param {string} routeName - Name of the route (e.g., 'TutorialHome', 'TutorialSuccess')
   * @param {Object} [params] - Optional parameters to pass to the screen
   */
  navigate(routeName, params) {
    console.log('NavigationService - Navigating to:', routeName, 'with params:', JSON.stringify(params || {}, null, 2));

    // Update current route
    this.currentRoute = routeName;

    // Load screen content via template swapping
    this.loadScreenContent(routeName, params || {});
  },

  /**
   * Reset navigation stack and navigate to a route
   * @param {string} routeName - Route name to navigate to
   * @param {Object} [params] - Optional parameters
   */
  reset(routeName, params) {
    console.log('NavigationService - Resetting to:', routeName);

    // Clear navigation history
    this.currentRoute = null;

    // Navigate to new route
    this.navigate(routeName, params);
  },

  /**
   * Load screen content from template (SPA pattern)
   * @param {string} routeName - Route name matching template ID
   * @param {Object} params - Parameters to pass to screen
   */
  loadScreenContent(routeName, params) {
    console.log('NavigationService - Loading screen content for:', routeName);

    // Get template element (ID format: "TutorialHome-template")
    const templateId = `${routeName}-template`;
    const template = document.getElementById(templateId);

    if (!template) {
      console.error('NavigationService - Template not found:', templateId);
      console.error('Available templates:', this.getAvailableTemplates());
      return;
    }

    // Clone template content
    const content = template.content.cloneNode(true);

    // Get app content container
    const container = document.getElementById('app-content');
    if (!container) {
      console.error('NavigationService - App content container not found');
      return;
    }

    // Replace container content (SPA magic - no page reload!)
    container.innerHTML = '';
    container.appendChild(content);

    console.log('NavigationService - Content loaded, initializing screen');

    // Initialize screen with params (calls screen's onContentLoaded method)
    const screenObjName = `${routeName}Screen`;
    const screenObj = window[screenObjName];

    if (screenObj && typeof screenObj.onContentLoaded === 'function') {
      console.log(`NavigationService - Calling ${screenObjName}.onContentLoaded()`);
      screenObj.onContentLoaded(params);
    } else {
      console.warn(`NavigationService - Screen object not found or missing onContentLoaded(): ${screenObjName}`);
    }
  },

  /**
   * Get current route name
   * @returns {string|null}
   */
  getCurrentRoute() {
    return this.currentRoute;
  },

  /**
   * Get list of available templates for debugging
   * @returns {string[]} Array of template IDs
   */
  getAvailableTemplates() {
    const templates = document.querySelectorAll('template[id$="-template"]');
    return Array.from(templates).map(t => t.id);
  },

  /**
   * Open drawer menu
   */
  openDrawer() {
    console.log('NavigationService - Opening drawer');
    const drawer = document.getElementById('drawer-menu');
    const overlay = document.getElementById('drawer-overlay');

    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.style.display = 'block';
  },

  /**
   * Close drawer menu
   */
  closeDrawer() {
    console.log('NavigationService - Closing drawer');
    const drawer = document.getElementById('drawer-menu');
    const overlay = document.getElementById('drawer-overlay');

    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.style.display = 'none';
  },

  /**
   * Toggle drawer menu
   */
  toggleDrawer() {
    const drawer = document.getElementById('drawer-menu');
    if (drawer && drawer.classList.contains('open')) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  },

  /**
   * Set up global drawer event listeners (called once in app.js)
   */
  initializeDrawer() {
    const overlay = document.getElementById('drawer-overlay');
    const closeBtn = document.getElementById('drawer-close-btn');

    if (overlay) {
      overlay.onclick = () => this.closeDrawer();
    }

    if (closeBtn) {
      closeBtn.onclick = () => this.closeDrawer();
    }

    // Initialize drawer language link
    this.initializeDrawerLanguageLink();

    // Listen for language changes to update drawer display
    document.addEventListener('languageChanged', this.updateDrawerLanguageDisplay.bind(this));

    console.log('NavigationService - Drawer initialized with language support');
  },

  /**
   * Initialize drawer language link event handler
   */
  initializeDrawerLanguageLink() {
    const languageLink = document.getElementById('drawer-language-link');
    if (languageLink) {
      languageLink.onclick = (e) => {
        e.preventDefault();
        this.handleDrawerLanguageClick();
      };
      console.log('NavigationService - Drawer language link initialized');
    }

    // Update initial display
    this.updateDrawerLanguageDisplay();
  },

  /**
   * Handle drawer language link click
   * Shows language selector modal and calls setSDKLanguage API
   */
  handleDrawerLanguageClick() {
    console.log('NavigationService - Drawer language link clicked');

    const languageSelector = window.LanguageSelector;
    if (!languageSelector) {
      console.error('NavigationService - LanguageSelector not available');
      return;
    }

    const languageLink = document.getElementById('drawer-language-link');

    // Show language selector modal
    languageSelector.show({
      onSelect: async (language) => {
        console.log('NavigationService - Language selected from drawer:', language.display_text);

        // Close drawer
        this.closeDrawer();

        // Check if the selected language is the same as current
        const languageManager = window.LanguageManager;
        if (!languageManager) {
          console.error('NavigationService - LanguageManager not available');
          return;
        }

        const currentLanguage = languageManager.getCurrentLanguage();
        if (language.lang === currentLanguage.lang) {
          console.log('NavigationService - Selected language is same as current, skipping API call');
          return;
        }

        // Show loading state
        if (languageLink) {
          languageLink.classList.add('loading');
        }

        try {
          console.log('NavigationService - Calling setSDKLanguage API:', JSON.stringify({
            localeCode: language.lang,
            languageDirection: language.direction
          }, null, 2));

          // Call setSDKLanguage API
          const syncResponse = await rdnaService.setSDKLanguage(
            language.lang,
            language.direction
          );

          console.log('NavigationService - SetSDKLanguage sync response received:', JSON.stringify({
            longErrorCode: syncResponse.error.longErrorCode,
            shortErrorCode: syncResponse.error.shortErrorCode,
            errorString: syncResponse.error.errorString
          }, null, 2));

          // Sync response successful means API accepted the request
          // The actual language change result will come via onSetLanguageResponse event
          // SDKEventProvider's handleSetLanguageResponse will:
          // - Update the LanguageManager if successful
          // - Show success/error alert to the user

          console.log('NavigationService - Language change request submitted, waiting for onSetLanguageResponse event');

        } catch (error) {
          console.error('NavigationService - SetSDKLanguage sync error:', error);

          const errorMessage = error.error
            ? `${error.error.errorString} (${error.error.longErrorCode})`
            : 'Failed to change language';

          alert(`Language Change Error\n\nFailed to change language: ${errorMessage}`);
        } finally {
          // Remove loading state
          if (languageLink) {
            languageLink.classList.remove('loading');
          }
        }
      },
      onClose: () => {
        console.log('NavigationService - Language selector closed from drawer');
      }
    });
  },

  /**
   * Update drawer language display with current language
   */
  updateDrawerLanguageDisplay() {
    const languageManager = window.LanguageManager;
    if (!languageManager) {
      return;
    }

    const currentLanguage = languageManager.getCurrentLanguage();
    if (!currentLanguage) {
      return;
    }

    const displayEl = document.getElementById('drawer-current-language');
    if (displayEl) {
      displayEl.textContent = currentLanguage.nativeName;
      console.log('NavigationService - Drawer language display updated:', currentLanguage.display_text);
    }
  }
};
