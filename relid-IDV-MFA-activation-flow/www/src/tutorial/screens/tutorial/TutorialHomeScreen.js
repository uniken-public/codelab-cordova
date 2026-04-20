/**
 * Tutorial Home Screen
 *
 * Main screen for REL-ID SDK initialization tutorial.
 * Demonstrates SDK version retrieval and initialization with real-time progress tracking.
 *
 * SPA Pattern:
 * - onContentLoaded(params) called by NavigationService when screen loads
 * - Direct DOM manipulation instead of React state
 * - Event listeners for button clicks
 * - SDK event handlers for progress updates
 *
 * Features:
 * - SDK version display
 * - Initialize button with loading state
 * - Real-time progress tracking
 * - Error handling with user-friendly messages
 */

const TutorialHomeScreen = {
  /**
   * Flag to track initialization state
   */
  isInitializing: false,

  /**
   * Original event handlers (for cleanup)
   */
  originalProgressHandler: null,
  originalErrorHandler: null,

  /**
   * Called when screen content is loaded into DOM (SPA lifecycle)
   * Replaces React's componentDidMount/useEffect
   *
   * @param {Object} params - Navigation parameters (unused for home screen)
   */
  onContentLoaded(params) {
    console.log('TutorialHomeScreen - Content loaded', JSON.stringify(params, null, 2));

    // Reset state
    this.isInitializing = false;

    // Load SDK version
    this.loadSDKVersion();

    // Setup button event listeners
    this.setupEventListeners();

    // Register SDK event handlers for this screen
    this.registerSDKEventHandlers();

    // Initialize language display
    this.updateLanguageDisplay();

    // Listen for language changes
    document.addEventListener('languageChanged', this.handleLanguageChange.bind(this));
  },

  /**
   * Setup DOM event listeners for buttons
   */
  setupEventListeners() {
    const initButton = document.getElementById('initialize-btn');
    if (initButton) {
      initButton.onclick = this.handleInitializePress.bind(this);
    }

    // Language selector button
    const langSelectorBtn = document.getElementById('language-selector-btn');
    if (langSelectorBtn) {
      langSelectorBtn.onclick = this.handleLanguageSelectorPress.bind(this);
    }
  },

  /**
   * Register SDK event handlers for initialize flow
   */
  registerSDKEventHandlers() {
    const eventManager = rdnaService.getEventManager();

    // Preserve original handlers
    this.originalProgressHandler = eventManager.initializeProgressHandler;
    this.originalErrorHandler = eventManager.initializeErrorHandler;

    // Set progress handler
    eventManager.setInitializeProgressHandler((data) => {
      console.log('TutorialHomeScreen - Progress update:', JSON.stringify(data, null, 2));
      const message = getProgressMessage(data);
      this.updateProgress(message);
    });

    // Set error handler for this screen
    eventManager.setInitializeErrorHandler((errorData) => {
      console.log('TutorialHomeScreen - Received initialize error:', JSON.stringify(errorData, null, 2));

      // Update UI state
      this.isInitializing = false;
      this.updateButtonState(false);
      this.hideProgress();

      // Navigate to error screen
      NavigationService.navigate('TutorialError', {
        shortErrorCode: errorData.shortErrorCode,
        longErrorCode: errorData.longErrorCode,
        errorString: errorData.errorString,
      });

      // Restore original handlers
      this.restoreOriginalHandlers();
    });
  },

  /**
   * Restore original event handlers (cleanup)
   */
  restoreOriginalHandlers() {
    const eventManager = rdnaService.getEventManager();
    if (this.originalProgressHandler) {
      eventManager.setInitializeProgressHandler(this.originalProgressHandler);
    }
    if (this.originalErrorHandler) {
      eventManager.setInitializeErrorHandler(this.originalErrorHandler);
    }
  },

  /**
   * Load and display SDK version
   */
  async loadSDKVersion() {
    const versionElement = document.getElementById('sdk-version');
    if (!versionElement) return;

    try {
      versionElement.textContent = 'Loading...';
      const version = await rdnaService.getSDKVersion();
      versionElement.textContent = version;
    } catch (error) {
      console.error('TutorialHomeScreen - Failed to load SDK version:', error);
      versionElement.textContent = 'Unknown';
    }
  },

  /**
   * Handle Initialize button press
   */
  handleInitializePress() {
    if (this.isInitializing) {
      console.log('TutorialHomeScreen - Already initializing, ignoring click');
      return;
    }

    console.log('TutorialHomeScreen - User clicked Initialize button');

    // Update state
    this.isInitializing = true;
    this.updateButtonState(true);
    this.showProgress('Starting RDNA initialization...');

    // ========================================
    // CONFIGURE SDK INITIALIZATION OPTIONS
    // ========================================
    // Get current language from LanguageManager
    const languageManager = window.LanguageManager;
    const currentLanguage = languageManager ? languageManager.getCurrentLanguage() : {
      lang: 'en-US',
      display_text: 'English',
      direction: 0
    };

    console.log('TutorialHomeScreen - Initializing with language:', JSON.stringify({
      locale: currentLanguage.lang,
      display_text: currentLanguage.display_text,
      nativeName: currentLanguage.nativeName,
      direction: currentLanguage.direction,
      isRTL: currentLanguage.isRTL
    }, null, 2));

    // Location permission configuration
    const requireLocationPermission = true;   // Does your app need location for fraud detection?
    const locationIsMandatory = false;        // If false, SDK works with limited functionality without location

    // OpenTelemetry (OTel) configuration
    const enableTelemetry = false;  // Set to true for enterprise monitoring and observability

    // Build the initOptions configuration object
    const initOptions = {
      internationalizationOptions: {
        localeCode: currentLanguage.lang,                      // Full locale: 'en-US', 'hi-IN', 'ar-SA'
        localeName: currentLanguage.display_text,              // Display name: 'English', 'Hindi', 'Arabic'
        languageDirection: currentLanguage.direction           // 0 = LTR, 1 = RTL
      },
      permissionOptions: {
        isLocationPermissionRequired: requireLocationPermission,
        isLocationPermissionMandatory: locationIsMandatory
      },
      otelConfig: {
        otelHTTPEndpointURL: enableTelemetry ? 'https://your-otel-collector.example.com' : '',
        enableEncoding: '',
        disableTrace: enableTelemetry ? 0 : 1,  // 0 = enabled, 1 = disabled
        otelTraceFlushTimeout: 0
      }
    };

    console.log('TutorialHomeScreen - Initializing with custom options:', JSON.stringify(initOptions, null, 2));

    // Call rdnaService.initialize() with custom configuration
    // Pass initOptions to customize SDK behavior
    // Or call without parameters: rdnaService.initialize() to use defaults
    rdnaService.initialize(initOptions)
      .then((syncResponse) => {
        console.log('TutorialHomeScreen - RDNA initialization sync response:', JSON.stringify({
          longErrorCode: syncResponse.error?.longErrorCode,
          shortErrorCode: syncResponse.error?.shortErrorCode,
          errorString: syncResponse.error?.errorString
        }, null, 2));

        // Sync response success - waiting for async events (onInitialized or onInitializeError)
      })
      .catch((error) => {
        console.error('TutorialHomeScreen - RDNA initialization promise rejected:', JSON.stringify(error, null, 2));

        // Update UI
        this.isInitializing = false;
        this.updateButtonState(false);
        this.hideProgress();

        // Show error alert
        const errorMessage = error.error
          ? `${error.error.errorString}\n\nError Codes:\nLong: ${error.error.longErrorCode}\nShort: ${error.error.shortErrorCode}`
          : 'Initialization failed';

        alert(`Initialization Failed\n\n${errorMessage}`);

        // Restore original handlers
        this.restoreOriginalHandlers();
      });
  },

  /**
   * Update button state (loading/ready)
   * @param {boolean} isLoading - Whether button should show loading state
   */
  updateButtonState(isLoading) {
    const button = document.getElementById('initialize-btn');
    if (!button) return;

    if (isLoading) {
      button.disabled = true;
      button.classList.add('loading');
      button.textContent = 'Initializing...';
    } else {
      button.disabled = false;
      button.classList.remove('loading');
      button.textContent = 'Initialize';
    }
  },

  /**
   * Show progress message
   * @param {string} message - Progress message to display
   */
  showProgress(message) {
    const container = document.getElementById('progress-container');
    const textElement = document.getElementById('progress-text');

    if (container && textElement) {
      textElement.textContent = message;
      container.style.display = 'block';
    }
  },

  /**
   * Update progress message
   * @param {string} message - Updated progress message
   */
  updateProgress(message) {
    const textElement = document.getElementById('progress-text');
    if (textElement) {
      textElement.textContent = message;
    }
  },

  /**
   * Hide progress container
   */
  hideProgress() {
    const container = document.getElementById('progress-container');
    if (container) {
      container.style.display = 'none';
    }
  },

  /**
   * Update language display in UI
   */
  updateLanguageDisplay() {
    const languageManager = window.LanguageManager;
    if (!languageManager) {
      console.warn('TutorialHomeScreen - LanguageManager not available');
      return;
    }

    const currentLanguage = languageManager.getCurrentLanguage();
    if (!currentLanguage) {
      console.warn('TutorialHomeScreen - No current language');
      return;
    }

    // Update language display
    const displayEl = document.getElementById('current-language-display');
    if (displayEl) {
      displayEl.textContent = currentLanguage.nativeName;
    }

    // Update RTL badge visibility
    const rtlBadge = document.getElementById('rtl-badge');
    if (rtlBadge) {
      rtlBadge.style.display = currentLanguage.isRTL ? 'block' : 'none';
    }

    console.log('TutorialHomeScreen - Language display updated:', currentLanguage.display_text);
  },

  /**
   * Handle language change event from LanguageManager
   * @param {CustomEvent} event - Language changed event
   */
  handleLanguageChange(event) {
    console.log('TutorialHomeScreen - Language changed event received');
    this.updateLanguageDisplay();
  },

  /**
   * Handle language selector button press
   * Shows language selector modal
   */
  handleLanguageSelectorPress() {
    if (this.isInitializing) {
      console.log('TutorialHomeScreen - Cannot change language during initialization');
      return;
    }

    console.log('TutorialHomeScreen - Language selector button clicked');

    const languageSelector = window.LanguageSelector;
    if (!languageSelector) {
      console.error('TutorialHomeScreen - LanguageSelector not available');
      return;
    }

    // Show language selector modal
    languageSelector.show({
      onSelect: this.handleLanguageSelect.bind(this),
      onClose: () => {
        console.log('TutorialHomeScreen - Language selector closed');
      }
    });
  },

  /**
   * Handle language selection from modal
   * @param {Language} language - Selected language
   */
  async handleLanguageSelect(language) {
    console.log('TutorialHomeScreen - Language selected:', language.display_text);

    const languageManager = window.LanguageManager;
    if (!languageManager) {
      console.error('TutorialHomeScreen - LanguageManager not available');
      return;
    }

    try {
      // Update language in LanguageManager (persists to localStorage)
      await languageManager.changeLanguage(language);

      console.log('TutorialHomeScreen - Language changed successfully to:', language.display_text);

      // Show confirmation alert
      alert(`Language Changed\n\nLanguage changed to ${language.nativeName}. The SDK will use this language when initialized.`);
    } catch (error) {
      console.error('TutorialHomeScreen - Failed to change language:', error);
      alert('Error\n\nFailed to change language. Please try again.');
    }
  }
};

// Expose to global scope for NavigationService
window.TutorialHomeScreen = TutorialHomeScreen;
