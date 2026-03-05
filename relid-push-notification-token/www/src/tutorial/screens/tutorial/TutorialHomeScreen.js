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
  },

  /**
   * Setup DOM event listeners for buttons
   */
  setupEventListeners() {
    const initButton = document.getElementById('initialize-btn');
    if (initButton) {
      initButton.onclick = this.handleInitializePress.bind(this);
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
    // Customers: Customize this section based on your application requirements
    // If you don't provide initOptions, the SDK will use default values

    // OPTION 1: Use default configuration (recommended for most apps)
    // Simply call: rdnaService.initialize()
    // This uses: localeCode='en', languageDirection=LTR, location required but not mandatory, telemetry disabled

    // OPTION 2: Customize configuration for your app needs
    // Example scenarios:

    // Scenario A: Arabic/RTL language support
    // const language = 'ar';  // Get from your i18n library (e.g., i18next.language, localStorage, device settings)
    // const languageDirection = ['ar', 'he', 'fa', 'ur'].includes(language) ? 1 : 0;

    // Scenario B: English/LTR language support (default)
    const language = 'en';  // TODO: Replace with dynamic language from your app's i18n system
    const languageDirection = 0;  // 0 = LTR (Left-to-Right), 1 = RTL (Right-to-Left)

    // Scenario C: Location permission configuration
    // Set based on your app's requirements for location-based risk analysis
    const requireLocationPermission = true;   // Does your app need location for fraud detection?
    const locationIsMandatory = false;        // If false, SDK works with limited functionality without location

    // Scenario D: OpenTelemetry (OTel) configuration
    // Enable only if your organization uses OpenTelemetry for distributed tracing
    const enableTelemetry = false;  // Set to true for enterprise monitoring and observability

    // Build the initOptions configuration object
    const initOptions = {
      internationalizationOptions: {
        localeCode: language,               // ISO 639-1 code: 'en', 'ar', 'es', 'fr', etc. (empty string defaults to 'en')
        localeName: language,                // Display name for the locale
        languageDirection: languageDirection // 0 = LTR, 1 = RTL
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
  }
};

// Expose to global scope for NavigationService
window.TutorialHomeScreen = TutorialHomeScreen;
