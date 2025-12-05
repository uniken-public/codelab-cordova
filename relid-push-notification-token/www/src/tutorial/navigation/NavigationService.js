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

    console.log('NavigationService - Drawer initialized');
  }
};
