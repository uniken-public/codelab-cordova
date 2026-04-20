/**
 * SDK IDV Event Provider
 *
 * Centralized singleton for REL-ID IDV (Identity Verification) event handling in Cordova.
 * Manages IDV SDK events, state, and navigation logic.
 * Handles document scanning and validation events.
 *
 * Supported Events:
 * - getIDVDocumentScanProcessStartConfirmation: Document scan start confirmation
 * - getIDVConfirmDocumentDetails: Document details validation
 * - getIDVSelfieProcessStartConfirmation: Selfie capture start confirmation
 * - getIDVSelfieConfirmation: Selfie biometric analysis confirmation
 * - getIDVBiometricOptInConsent: Biometric template storage consent
 *
 * Key Features:
 * - Consolidated IDV event handling
 * - State management for IDV flow data
 * - Navigation logic for IDV screens
 * - Integration with IDV service and event manager
 * - Idempotent initialization
 *
 * Usage:
 * ```javascript
 * // In AppInitializer.js
 * SDKIDVEventProvider.initialize();
 * ```
 *
 * @see https://developer.uniken.com/docs/idv-integration
 */
const SDKIDVEventProvider = {
  // =============================================================================
  // INITIALIZATION STATE
  // =============================================================================

  _initialized: false,

  // =============================================================================
  // IDV STATE
  // =============================================================================

  // Current IDV workflow being executed
  currentIDVWorkflow: null,

  // =============================================================================
  // PUBLIC INITIALIZATION API
  // =============================================================================

  /**
   * Initializes the SDK IDV Event Provider
   *
   * Registers IDV event handlers with the event manager.
   * Safe to call multiple times (idempotent).
   * Should be called once during app initialization in AppInitializer.js
   */
  initialize() {
    if (this._initialized) {
      console.log('SDKIDVEventProvider - Already initialized, skipping');
      return;
    }

    console.log('SDKIDVEventProvider - Initializing IDV event provider');

    try {
      const eventManager = rdnaIDVService.getEventManager();

      // Register document scan event handlers
      eventManager.setGetDocumentScanStartConfirmationHandler(
        this.handleGetDocumentScanStartConfirmation.bind(this)
      );
      eventManager.setGetConfirmDocumentDetailsHandler(
        this.handleGetConfirmDocumentDetails.bind(this)
      );

      // Register selfie capture event handlers
      eventManager.setGetSelfieProcessStartConfirmationHandler(
        this.handleGetSelfieProcessStartConfirmation.bind(this)
      );
      eventManager.setGetSelfieConfirmationHandler(
        this.handleGetSelfieConfirmation.bind(this)
      );

      // Register biometric consent event handlers
      eventManager.setGetBiometricOptInConsentHandler(
        this.handleGetBiometricOptInConsent.bind(this)
      );

      this._initialized = true;
      console.log('SDKIDVEventProvider - IDV event handlers registered successfully');
    } catch (error) {
      console.error('SDKIDVEventProvider - Failed to initialize:', error);
      throw error;
    }
  },

  // =============================================================================
  // DOCUMENT SCAN EVENT HANDLERS
  // =============================================================================

  /**
   * Handles document scan process start confirmation request event
   *
   * Navigates to IDV document scan start screen where user can:
   * - View informative message about document requirements
   * - Start document scan or cancel IDV flow
   *
   * Screen name: IDVDocumentScanStart
   *
   * @param {Object} data - Event data containing idvWorkflow
   */
  handleGetDocumentScanStartConfirmation(data) {
    console.log('SDKIDVEventProvider - Document scan start confirmation requested');
    console.log('SDKIDVEventProvider - IDV Workflow:', data.idvWorkflow);

    // Store current workflow
    this.currentIDVWorkflow = data.idvWorkflow;

    // Navigate to document scan start screen
    NavigationService.navigate('IDVDocumentScanStart', {
      idvWorkflow: data.idvWorkflow,
      eventData: data
    });
  },

  /**
   * Handles document details confirmation request event
   *
   * Navigates to IDV confirm document details screen where user can:
   * - Review OCR-extracted document information
   * - View document validation status (OK, ERROR, WARNING)
   * - Confirm document details or recapture document
   *
   * Screen name: IDVConfirmDocumentDetails
   *
   * @param {Object} data - Event data containing challengeMode and response_data
   */
  handleGetConfirmDocumentDetails(data) {
    console.log('SDKIDVEventProvider - Document details confirmation requested');
    console.log('SDKIDVEventProvider - Challenge Mode:', data.challengeMode);
    console.log('SDKIDVEventProvider - Response Data:', JSON.stringify(data.response_data, null, 2));

    // Navigate to confirm document details screen
    NavigationService.navigate('IDVConfirmDocumentDetails', {
      challengeMode: data.challengeMode,
      eventData: data
    });
  },

  // =============================================================================
  // SELFIE CAPTURE EVENT HANDLERS
  // =============================================================================

  /**
   * Handles selfie process start confirmation request event
   *
   * Navigates to IDV selfie process start screen where user can:
   * - View selfie capture requirements and guidelines
   * - Select camera preference (front/back)
   * - Start selfie capture or cancel IDV flow
   *
   * Screen name: IDVSelfieProcessStart
   *
   * @param {Object} data - Event data containing idvWorkflow
   */
  handleGetSelfieProcessStartConfirmation(data) {
    console.log('SDKIDVEventProvider - Selfie process start confirmation requested');
    console.log('SDKIDVEventProvider - IDV Workflow:', data.idvWorkflow);

    // Navigate to selfie process start screen
    NavigationService.navigate('IDVSelfieProcessStart', {
      idvWorkflow: data.idvWorkflow,
      eventData: data
    });
  },

  /**
   * Handles selfie confirmation request event
   *
   * Navigates to IDV selfie confirmation screen where user can:
   * - View biometric match result between selfie and document photo
   * - Review face matching score and liveness score
   * - Confirm selfie results or recapture selfie
   * - View detailed biometric analysis
   *
   * Screen name: IDVSelfieConfirmation
   *
   * @param {Object} data - Event data containing userID, challengeMode, and biometric results
   */
  handleGetSelfieConfirmation(data) {
    console.log('SDKIDVEventProvider - Selfie confirmation requested');
    console.log('SDKIDVEventProvider - User ID:', data.userID);
    console.log('SDKIDVEventProvider - Challenge Mode:', data.challengeMode);

    // Navigate to selfie confirmation screen
    NavigationService.navigate('IDVSelfieConfirmation', {
      challengeMode: data.challengeMode,
      eventData: data
    });
  },

  // =============================================================================
  // BIOMETRIC CONSENT EVENT HANDLERS
  // =============================================================================

  /**
   * Handles biometric opt-in consent request event
   *
   * Navigates to IDV biometric opt-in consent screen where user can:
   * - View biometric template storage explanation
   * - Review consent information and privacy implications
   * - Accept or reject biometric template storage
   * - Understand the benefits of biometric storage
   *
   * Screen name: IDVBiometricOptInConsent
   *
   * @param {Object} data - Event data containing userID, challengeMode, and consent details
   */
  handleGetBiometricOptInConsent(data) {
    console.log('SDKIDVEventProvider - Biometric opt-in consent requested');
    console.log('SDKIDVEventProvider - User ID:', data.userID);
    console.log('SDKIDVEventProvider - Challenge Mode:', data.challengeMode);
    console.log('SDKIDVEventProvider - Current Workflow:', data.challengeResponse?.additionalInfo?.currentWorkFlow);

    // Navigate to biometric opt-in consent screen
    NavigationService.navigate('IDVBiometricOptInConsent', {
      challengeMode: data.challengeMode,
      eventData: data
    });
  },

  // =============================================================================
  // HELPER FUNCTIONS
  // =============================================================================

  /**
   * Clears all IDV state
   *
   * Resets all IDV-related state to initial values.
   * Call this after completing an IDV workflow or on logout.
   */
  clearIDVState() {
    console.log('SDKIDVEventProvider - Clearing IDV state');
    this.currentIDVWorkflow = null;
  },

  /**
   * Gets the current IDV workflow
   *
   * @returns {number|null} Current IDV workflow enum value or null if no workflow active
   */
  getCurrentIDVWorkflow() {
    return this.currentIDVWorkflow;
  }
};
