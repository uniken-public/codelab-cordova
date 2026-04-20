/**
 * REL-ID IDV SDK Event Manager
 *
 * Manages Identity Verification (IDV) related SDK events in a centralized manner.
 * Provides a singleton pattern for consistent IDV event handling across the application.
 * Handles document scanning and validation events.
 *
 * **IMPORTANT:** This manager auto-initializes when the module loads to ensure native
 * event listeners are registered immediately, preventing race conditions.
 *
 * Supported IDV Events:
 *
 * **Document Scan Events:**
 * - getIDVDocumentScanProcessStartConfirmation: Pre-scan consent request
 * - getIDVConfirmDocumentDetails: Post-scan OCR data validation
 *
 * **Selfie Capture Events:**
 * - getIDVSelfieProcessStartConfirmation: Pre-selfie capture consent request
 * - getIDVSelfieConfirmation: Post-selfie biometric analysis validation
 *
 * **Biometric Consent Events:**
 * - getIDVBiometricOptInConsent: User consent for biometric template storage
 *
 * Key Features:
 * - Singleton pattern for global IDV event management
 * - Automatic event listener registration and cleanup
 * - Single event handler per type for simplicity
 * - Comprehensive error handling and logging
 *
 * @see https://developer.uniken.com/docs/idv-integration
 */
class RdnaIDVEventManager {
  constructor() {
    if (RdnaIDVEventManager.instance) {
      return RdnaIDVEventManager.instance;
    }

    console.log('RdnaIDVEventManager - Initializing event manager (auto-initialization on module load)');

    this._initialized = false;
    this.listeners = [];

    // Document Scan Event Handlers
    this.getDocumentScanStartConfirmationHandler = null;
    this.getConfirmDocumentDetailsHandler = null;

    // Selfie Capture Event Handlers
    this.getSelfieProcessStartConfirmationHandler = null;
    this.getSelfieConfirmationHandler = null;

    // Biometric Consent Event Handlers
    this.getBiometricOptInConsentHandler = null;

    RdnaIDVEventManager.instance = this;

    // Auto-register listeners on construction
    this.registerEventListeners();
  }

  static getInstance() {
    if (!RdnaIDVEventManager.instance) {
      RdnaIDVEventManager.instance = new RdnaIDVEventManager();
    }
    return RdnaIDVEventManager.instance;
  }

  /**
   * Registers native event listeners for IDV events
   *
   * Events are registered using document.addEventListener for Cordova.
   */
  registerEventListeners() {
    if (this._initialized) {
      console.log('RdnaIDVEventManager - Already initialized, skipping event listener registration');
      return;
    }

    console.log('RdnaIDVEventManager - Registering native IDV event listeners');

    // Document Scan Start Confirmation Event
    document.addEventListener(
      'getIDVDocumentScanProcessStartConfirmation',
      this.onGetDocumentScanStartConfirmation.bind(this),
      false
    );

    // Document Details Validation Event
    document.addEventListener(
      'getIDVConfirmDocumentDetails',
      this.onGetConfirmDocumentDetails.bind(this),
      false
    );

    // Selfie Process Start Confirmation Event
    document.addEventListener(
      'getIDVSelfieProcessStartConfirmation',
      this.onGetSelfieProcessStartConfirmation.bind(this),
      false
    );

    // Selfie Confirmation Event
    document.addEventListener(
      'getIDVSelfieConfirmation',
      this.onGetSelfieConfirmation.bind(this),
      false
    );

    // Biometric Opt-In Consent Event
    document.addEventListener(
      'getIDVBiometricOptInConsent',
      this.onGetBiometricOptInConsent.bind(this),
      false
    );

    this._initialized = true;
    console.log('RdnaIDVEventManager - Native IDV event listeners registered');
  }

  // ================================================================================================
  // DOCUMENT SCAN EVENT HANDLERS
  // ================================================================================================

  /**
   * Handles document scan process start confirmation request event
   *
   * This event is triggered before the SDK initiates document scanning.
   * Application should display informative message about requirements and get user consent.
   *
   * @param event Event object containing response data from native SDK
   */
  onGetDocumentScanStartConfirmation(event) {
    console.log('RdnaIDVEventManager - Get document scan start confirmation event received');

    try {
      const response = event.response || event.detail || event;
      console.log('RdnaIDVEventManager - onGetDocumentScanStartConfirmation response:', JSON.stringify(response, null, 2));

      const data = typeof response === 'string' ? JSON.parse(response) : response;
      console.log('RdnaIDVEventManager - IDV Workflow:', data.idvWorkflow);

      if (this.getDocumentScanStartConfirmationHandler) {
        this.getDocumentScanStartConfirmationHandler(data);
      }
    } catch (error) {
      console.error('RdnaIDVEventManager - Failed to parse document scan start confirmation:', error);
    }
  }

  /**
   * Handles document details validation event
   *
   * This event is triggered after the SDK completes document scanning and OCR processing.
   * Application should display extracted document information for user validation.
   *
   * The response_data structure is dynamic and depends on document type.
   * Common fields include:
   * - identity_data: Extracted user information
   * - document_status: Validation results with overall_document_status
   * - document_info: Document metadata and images
   *
   * Application should allow user to confirm or reject the displayed information.
   *
   * @param event Event object containing OCR data and challengeMode from native SDK
   */
  onGetConfirmDocumentDetails(event) {
    console.log('RdnaIDVEventManager - Get confirm document details event received');

    try {
      const response = event.response || event.detail || event;
      console.log('RdnaIDVEventManager - onGetConfirmDocumentDetails response:', JSON.stringify(response, null, 2));

      const data = typeof response === 'string' ? JSON.parse(response) : response;
      console.log('RdnaIDVEventManager - Challenge Mode:', data.challengeMode);
      console.log('RdnaIDVEventManager - Document OCR Data:', JSON.stringify(data.response_data, null, 2));

      if (this.getConfirmDocumentDetailsHandler) {
        this.getConfirmDocumentDetailsHandler(data);
      }
    } catch (error) {
      console.error('RdnaIDVEventManager - Failed to parse confirm document details:', error);
    }
  }

  // ================================================================================================
  // SELFIE CAPTURE EVENT HANDLERS
  // ================================================================================================

  /**
   * Handles selfie process start confirmation request event
   *
   * This event is triggered before the SDK initiates selfie capture.
   * Application should display informative message about requirements and get user consent.
   *
   * @param event Event object containing workflow type from native SDK
   */
  onGetSelfieProcessStartConfirmation(event) {
    console.log('RdnaIDVEventManager - Get selfie process start confirmation event received');

    try {
      const response = event.response || event.detail || event;
      console.log('RdnaIDVEventManager - onGetSelfieProcessStartConfirmation response:', JSON.stringify(response, null, 2));

      const data = typeof response === 'string' ? JSON.parse(response) : response;
      console.log('RdnaIDVEventManager - IDV Workflow:', data.idvWorkflow);

      if (this.getSelfieProcessStartConfirmationHandler) {
        this.getSelfieProcessStartConfirmationHandler(data);
      }
    } catch (error) {
      console.error('RdnaIDVEventManager - Failed to parse selfie process start confirmation:', error);
    }
  }

  /**
   * Handles selfie confirmation request event
   *
   * This event is triggered after the SDK completes selfie capture and biometric analysis.
   * Application should display captured selfie, document photo, biometric scores for user validation.
   *
   * The response_data structure includes:
   * - Face matching score comparing selfie with document photo
   * - Liveness detection results and score
   * - Biometric result with display text and criteria
   * - Captured selfie image (base64)
   * - Original document photo for comparison
   * - Action buttons for user decision (success/failure)
   *
   * Application should allow user to confirm or reject the selfie results.
   *
   * @param event Event object containing biometric analysis results from native SDK
   */
  onGetSelfieConfirmation(event) {
    console.log('RdnaIDVEventManager - Get selfie confirmation event received');

    try {
      const response = event.response || event.detail || event;
      console.log('RdnaIDVEventManager - onGetSelfieConfirmation response:', JSON.stringify(response, null, 2));

      const data = typeof response === 'string' ? JSON.parse(response) : response;
      console.log('RdnaIDVEventManager - User ID:', data.userID);
      console.log('RdnaIDVEventManager - Challenge Mode:', data.challengeMode);
      console.log('RdnaIDVEventManager - Face Match Score:', data.response_data?.response_data?.face_matcher_response?.score);
      console.log('RdnaIDVEventManager - Liveness Score:', data.response_data?.response_data?.analyze_liveness_response?.video?.liveness_result?.score);

      if (this.getSelfieConfirmationHandler) {
        this.getSelfieConfirmationHandler(data);
      }
    } catch (error) {
      console.error('RdnaIDVEventManager - Failed to parse selfie confirmation:', error);
    }
  }

  // ================================================================================================
  // BIOMETRIC CONSENT EVENT HANDLERS
  // ================================================================================================

  /**
   * Handles biometric opt-in consent request event
   *
   * This event is triggered when the SDK needs user permission to store biometric templates.
   * Application should display informative message explaining biometric data storage and
   * privacy implications, then get user consent decision.
   *
   * The event data includes:
   * - userID: User identifier
   * - challengeMode: Challenge operation mode
   * - attemptsLeft: Number of attempts remaining
   * - challengeResponse: Session, status, and additional info (workflow, audit, etc.)
   * - error: Error information with codes and message
   * - biometricTemplate: Optional template data and type information
   *
   * Application should allow user to opt-in or opt-out of biometric template storage.
   *
   * @param event Event object containing consent request from native SDK
   */
  onGetBiometricOptInConsent(event) {
    console.log('RdnaIDVEventManager - Get biometric opt-in consent event received');

    try {
      const response = event.response || event.detail || event;
      console.log('RdnaIDVEventManager - onGetBiometricOptInConsent response:', JSON.stringify(response, null, 2));

      const data = typeof response === 'string' ? JSON.parse(response) : response;
      console.log('RdnaIDVEventManager - User ID:', data.userID);
      console.log('RdnaIDVEventManager - Challenge Mode:', data.challengeMode);
      console.log('RdnaIDVEventManager - Attempts Left:', data.attemptsLeft);
      console.log('RdnaIDVEventManager - Status Code:', data.challengeResponse?.status?.statusCode);
      console.log('RdnaIDVEventManager - Status Message:', data.challengeResponse?.status?.statusMessage);
      console.log('RdnaIDVEventManager - Session ID:', data.challengeResponse?.session?.sessionID);
      console.log('RdnaIDVEventManager - Current Workflow:', data.challengeResponse?.additionalInfo?.currentWorkFlow);
      console.log('RdnaIDVEventManager - IDV User Role:', data.challengeResponse?.additionalInfo?.idvUserRole);

      if (this.getBiometricOptInConsentHandler) {
        this.getBiometricOptInConsentHandler(data);
      }
    } catch (error) {
      console.error('RdnaIDVEventManager - Failed to parse biometric opt-in consent:', error);
    }
  }

  // ================================================================================================
  // PUBLIC API - EVENT HANDLER SETTERS
  // ================================================================================================

  /**
   * Document Scan Event Handler Setters
   */

  setGetDocumentScanStartConfirmationHandler(callback) {
    this.getDocumentScanStartConfirmationHandler = callback;
  }

  setGetConfirmDocumentDetailsHandler(callback) {
    this.getConfirmDocumentDetailsHandler = callback;
  }

  /**
   * Selfie Capture Event Handler Setters
   */

  setGetSelfieProcessStartConfirmationHandler(callback) {
    this.getSelfieProcessStartConfirmationHandler = callback;
  }

  setGetSelfieConfirmationHandler(callback) {
    this.getSelfieConfirmationHandler = callback;
  }

  /**
   * Biometric Consent Event Handler Setters
   */

  setGetBiometricOptInConsentHandler(callback) {
    this.getBiometricOptInConsentHandler = callback;
  }

  /**
   * Cleans up all event listeners and handlers
   *
   * Removes all native event listeners and clears callback references.
   * Should be called when IDV functionality is no longer needed or during app cleanup.
   */
  cleanup() {
    console.log('RdnaIDVEventManager - Cleaning up event listeners and handlers');

    // Remove native event listeners
    document.removeEventListener('getIDVDocumentScanProcessStartConfirmation', this.onGetDocumentScanStartConfirmation.bind(this), false);
    document.removeEventListener('getIDVConfirmDocumentDetails', this.onGetConfirmDocumentDetails.bind(this), false);
    document.removeEventListener('getIDVSelfieProcessStartConfirmation', this.onGetSelfieProcessStartConfirmation.bind(this), false);
    document.removeEventListener('getIDVSelfieConfirmation', this.onGetSelfieConfirmation.bind(this), false);
    document.removeEventListener('getIDVBiometricOptInConsent', this.onGetBiometricOptInConsent.bind(this), false);

    // Clear document scan handlers
    this.getDocumentScanStartConfirmationHandler = null;
    this.getConfirmDocumentDetailsHandler = null;

    // Clear selfie capture handlers
    this.getSelfieProcessStartConfirmationHandler = null;
    this.getSelfieConfirmationHandler = null;

    // Clear biometric consent handlers
    this.getBiometricOptInConsentHandler = null;

    this._initialized = false;

    console.log('RdnaIDVEventManager - Cleanup completed');
  }
}

// Auto-instantiate singleton
const rdnaIDVEventManager = RdnaIDVEventManager.getInstance();
