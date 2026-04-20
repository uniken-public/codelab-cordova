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
 * **Post-Login KYC Events:**
 * - onIDVActivatedCustomerKYCResponse: Post-login KYC workflow completion status
 * - onIDVAdditionalDocumentScan: Additional document scan workflow completion with OCR data
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

    // Post-Login KYC Event Handlers
    this.activatedCustomerKYCResponseHandler = null;
    this.additionalDocumentScanHandler = null;

    // Server Biometric Authentication Event Handlers
    this.checkUserBiometricTemplateStatusHandler = null;
    this.serverBiometricAuthenticationResultHandler = null;

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

    // Activated Customer KYC Response Event
    document.addEventListener(
      'onIDVActivatedCustomerKYCResponse',
      this.onActivatedCustomerKYCResponse.bind(this),
      false
    );

    // Additional Document Scan Event
    document.addEventListener(
      'onIDVAdditionalDocumentScan',
      this.onAdditionalDocumentScan.bind(this),
      false
    );

    // Check User Biometric Template Status Event
    document.addEventListener(
      'onIDVCheckUserBiometricTemplateStatus',
      this.onCheckUserBiometricTemplateStatus.bind(this),
      false
    );

    // Server Biometric Authentication Result Event
    document.addEventListener(
      'onIDVServerBiometricAuthenticationResult',
      this.onServerBiometricAuthenticationResult.bind(this),
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
  // POST-LOGIN KYC EVENT HANDLERS
  // ================================================================================================

  /**
   * Handles activated customer KYC response event
   *
   * This event is triggered TWICE during the post-login KYC flow:
   * 1. FIRST FIRE: Immediately after initiateActivatedCustomerKYC is called (workflow initiated)
   * 2. SECOND FIRE: After the complete IDV workflow finishes (final result)
   *
   * The event data includes:
   * - userID: User identifier
   * - sessionID: Current session identifier
   * - reason: KYC initiation reason provided by the app
   * - status: Status object with statusCode and statusMessage
   *   - statusCode 100: KYC completed successfully
   *   - Other codes: Various error/incomplete states
   * - error: Error information with codes and message
   *   - longErrorCode 0: Success
   *   - > 0: Error occurred
   *
   * Application should:
   * - First fire: Log the event (workflow has started, IDV events will follow)
   * - Second fire: Navigate back to ActivatedCustomerKYC screen with result
   * - Display success/error message based on status and error codes
   *
   * @param event Event object containing KYC completion status from native SDK
   */
  onActivatedCustomerKYCResponse(event) {
    console.log('RdnaIDVEventManager - Activated customer KYC response event received');

    try {
      const response = event.response || event.detail || event;
      console.log('RdnaIDVEventManager - onActivatedCustomerKYCResponse response:', JSON.stringify(response, null, 2));

      const data = typeof response === 'string' ? JSON.parse(response) : response;
      console.log('RdnaIDVEventManager - User ID:', data.userID);
      console.log('RdnaIDVEventManager - Session ID:', data.sessionID);
      console.log('RdnaIDVEventManager - Reason:', data.reason);
      console.log('RdnaIDVEventManager - Status Code:', data.status?.statusCode);
      console.log('RdnaIDVEventManager - Status Message:', data.status?.statusMessage);
      console.log('RdnaIDVEventManager - Error Code:', data.error?.longErrorCode);
      console.log('RdnaIDVEventManager - Error Message:', data.error?.errorString);

      if (this.activatedCustomerKYCResponseHandler) {
        this.activatedCustomerKYCResponseHandler(data);
      }
    } catch (error) {
      console.error('RdnaIDVEventManager - Failed to parse activated customer KYC response:', error);
    }
  }

  /**
   * Handles additional document scan response event
   *
   * This event is triggered after the additional document scan workflow completes.
   * It provides the extracted OCR data, validation results, and confidence scores
   * for the scanned supplementary document.
   *
   * The event data includes:
   * - userID: User identifier
   * - sessionID: Current session identifier
   * - reason: Additional document scan reason provided by the app
   * - status: Status object with statusCode and statusMessage
   *   - statusCode 100: Document scan successful
   *   - Other codes: Various error/validation states
   * - error: Error information with codes and message
   *   - longErrorCode 0: Success
   *   - > 0: Error occurred
   * - idvResponse: Document scan results (optional, only on success)
   *   - document_type: Type of document scanned
   *   - confidence_scores: Overall confidence, authenticity score, OCR quality
   *   - validation_results: Document authenticity, data consistency, expiry validation
   *   - identity_data: Extracted personal information fields
   *   - document_info: Document metadata and images (front/back pages, portrait, signature)
   *
   * Application should:
   * - Check error.longErrorCode and status.statusCode for success/failure
   * - On success: Navigate to result screen to display extracted document data
   * - On error: Show error message and allow retry or navigate back
   *
   * @param event Event object containing additional document scan result from native SDK
   */
  onAdditionalDocumentScan(event) {
    console.log('RdnaIDVEventManager - Additional document scan event received');

    try {
      const response = event.response || event.detail || event;
      console.log('RdnaIDVEventManager - onAdditionalDocumentScan response:', JSON.stringify(response, null, 2));

      const data = typeof response === 'string' ? JSON.parse(response) : response;
      console.log('RdnaIDVEventManager - User ID:', data.userID);
      console.log('RdnaIDVEventManager - Session ID:', data.sessionID);
      console.log('RdnaIDVEventManager - Reason:', data.reason);
      console.log('RdnaIDVEventManager - Status Code:', data.status?.statusCode);
      console.log('RdnaIDVEventManager - Status Message:', data.status?.statusMessage);
      console.log('RdnaIDVEventManager - Error Code:', data.error?.longErrorCode);
      console.log('RdnaIDVEventManager - Error Message:', data.error?.errorString);
      console.log('RdnaIDVEventManager - Document Type:', data.idvResponse?.document_type);
      console.log('RdnaIDVEventManager - Overall Confidence:', data.idvResponse?.confidence_scores?.overall_confidence);

      if (this.additionalDocumentScanHandler) {
        this.additionalDocumentScanHandler(data);
      }
    } catch (error) {
      console.error('RdnaIDVEventManager - Failed to parse additional document scan:', error);
    }
  }

  // ================================================================================================
  // SERVER BIOMETRIC AUTHENTICATION EVENT HANDLERS
  // ================================================================================================

  /**
   * Handles check user biometric template status response event
   *
   * This event is triggered after checkIDVUserBiometricTemplateStatus API call.
   * It provides the status of whether a biometric template exists on the server
   * for the current user.
   *
   * The event data includes:
   * - userID: User identifier
   * - attemptsLeft: Number of attempts remaining
   * - challengeMode: Challenge operation mode (typically 25 for server biometric)
   * - idvResponse: JSON string containing template status result
   *   - status_code: 100 (exists), 600 (not exist), 400/500 (error)
   *   - status_message: Human-readable status message
   *   - result: boolean (true = template exists, false = does not exist)
   *   - attempts_left: Remaining attempts
   *   - user_id, for_user_id: User identifiers
   *   - orchestration_use_case: Use case identifier
   * - status: Status object with statusCode and statusMessage
   * - error: Error information with codes and message
   *
   * Application should:
   * - Check error.longErrorCode for API errors
   * - Parse idvResponse JSON string for template status
   * - Check status_code: 100 = exists, 600 = not exist
   * - Update UI to show appropriate opt-in/opt-out options
   * - Enable/disable biometric authentication button based on result
   *
   * @param event Event object containing template status from native SDK
   */
  onCheckUserBiometricTemplateStatus(event) {
    console.log('RdnaIDVEventManager - Check user biometric template status event received');

    try {
      const response = event.response || event.detail || event;
      console.log('RdnaIDVEventManager - onCheckUserBiometricTemplateStatus response:', JSON.stringify(response, null, 2));

      const data = typeof response === 'string' ? JSON.parse(response) : response;
      console.log('RdnaIDVEventManager - User ID:', data.userID);
      console.log('RdnaIDVEventManager - Challenge Mode:', data.challengeMode);
      console.log('RdnaIDVEventManager - Attempts Left:', data.attemptsLeft);
      console.log('RdnaIDVEventManager - Error Code:', data.error?.longErrorCode);

      // Parse idvResponse JSON string
      if (data.idvResponse) {
        try {
          const idvData = JSON.parse(data.idvResponse);
          console.log('RdnaIDVEventManager - Template Status Code:', idvData.status_code);
          console.log('RdnaIDVEventManager - Template Status Message:', idvData.status_message);
          console.log('RdnaIDVEventManager - Template Exists:', idvData.result);
          console.log('RdnaIDVEventManager - Orchestration Use Case:', idvData.orchestration_use_case);
        } catch (parseError) {
          console.error('RdnaIDVEventManager - Failed to parse idvResponse JSON:', parseError);
        }
      }

      if (this.checkUserBiometricTemplateStatusHandler) {
        this.checkUserBiometricTemplateStatusHandler(data);
      }
    } catch (error) {
      console.error('RdnaIDVEventManager - Failed to parse check user biometric template status:', error);
    }
  }

  /**
   * Handles server biometric authentication result event
   *
   * This event is triggered after initiateIDVServerBiometricAuthentication API call
   * completes the biometric verification process. It provides comprehensive audit
   * information about the authentication result.
   *
   * The event data includes:
   * - userID: User identifier
   * - attemptsLeft: Remaining authentication attempts
   * - challengeMode: Challenge operation mode (typically 25 for server biometric)
   * - idvResponse: JSON string containing full authentication result
   *   - video: Workflow data with frames, rotation, meta_data (device info)
   *   - idv_audit_info: Comprehensive audit information
   *     - reason: Authentication reason provided by app
   *     - audit_metrics: Timestamps and processing metrics
   *     - status: "SUCCESS" or "FAILURE"
   *     - scanned_document_type: Type of document (selfie)
   *     - idv_audit_transaction_id: Unique transaction identifier
   *     - orchestration_use_case: Use case (e.g., RDNA_IDV_POSTLOGIN_IDV_SELFIE_BIOMETRIC)
   *     - idv_json_version: IDV response version
   *   - purpose: Authentication purpose
   *   - attempts, attempts_left: Attempt counters
   *   - user_id, app_id, device_uuid, session_id: Identifiers
   * - status: Status object with statusCode (0 = success)
   * - error: Error information with codes and message
   *
   * Application should:
   * - Check error.longErrorCode for API errors
   * - Check status.statusCode (0 = success)
   * - Parse idvResponse JSON string for audit details
   * - Check idv_audit_info.status: "SUCCESS" or "FAILURE"
   * - Display transaction ID for user reference
   * - Show attempts remaining
   * - Navigate appropriately based on result
   *
   * @param event Event object containing authentication result from native SDK
   */
  onServerBiometricAuthenticationResult(event) {
    console.log('RdnaIDVEventManager - Server biometric authentication result event received');

    try {
      const response = event.response || event.detail || event;
      console.log('RdnaIDVEventManager - onServerBiometricAuthenticationResult response:', JSON.stringify(response, null, 2));

      const data = typeof response === 'string' ? JSON.parse(response) : response;
      console.log('RdnaIDVEventManager - User ID:', data.userID);
      console.log('RdnaIDVEventManager - Challenge Mode:', data.challengeMode);
      console.log('RdnaIDVEventManager - Attempts Left:', data.attemptsLeft);
      console.log('RdnaIDVEventManager - Status Code:', data.status?.statusCode);
      console.log('RdnaIDVEventManager - Error Code:', data.error?.longErrorCode);

      // Parse idvResponse JSON string
      if (data.idvResponse) {
        try {
          const idvData = JSON.parse(data.idvResponse);
          console.log('RdnaIDVEventManager - Audit Status:', idvData.idv_audit_info?.status);
          console.log('RdnaIDVEventManager - Transaction ID:', idvData.idv_audit_info?.idv_audit_transaction_id);
          console.log('RdnaIDVEventManager - Orchestration Use Case:', idvData.idv_audit_info?.orchestration_use_case);
          console.log('RdnaIDVEventManager - Reason:', idvData.idv_audit_info?.reason);
          console.log('RdnaIDVEventManager - Attempts Left:', idvData.attempts_left);
        } catch (parseError) {
          console.error('RdnaIDVEventManager - Failed to parse idvResponse JSON:', parseError);
        }
      }

      if (this.serverBiometricAuthenticationResultHandler) {
        this.serverBiometricAuthenticationResultHandler(data);
      }
    } catch (error) {
      console.error('RdnaIDVEventManager - Failed to parse server biometric authentication result:', error);
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
   * Post-Login KYC Event Handler Setters
   */

  setActivatedCustomerKYCResponseHandler(callback) {
    this.activatedCustomerKYCResponseHandler = callback;
  }

  setAdditionalDocumentScanHandler(callback) {
    this.additionalDocumentScanHandler = callback;
  }

  /**
   * Server Biometric Authentication Event Handler Setters
   */

  setCheckUserBiometricTemplateStatusHandler(callback) {
    this.checkUserBiometricTemplateStatusHandler = callback;
  }

  setServerBiometricAuthenticationResultHandler(callback) {
    this.serverBiometricAuthenticationResultHandler = callback;
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
    document.removeEventListener('onIDVActivatedCustomerKYCResponse', this.onActivatedCustomerKYCResponse.bind(this), false);
    document.removeEventListener('onIDVAdditionalDocumentScan', this.onAdditionalDocumentScan.bind(this), false);
    document.removeEventListener('onIDVCheckUserBiometricTemplateStatus', this.onCheckUserBiometricTemplateStatus.bind(this), false);
    document.removeEventListener('onIDVServerBiometricAuthenticationResult', this.onServerBiometricAuthenticationResult.bind(this), false);

    // Clear document scan handlers
    this.getDocumentScanStartConfirmationHandler = null;
    this.getConfirmDocumentDetailsHandler = null;

    // Clear selfie capture handlers
    this.getSelfieProcessStartConfirmationHandler = null;
    this.getSelfieConfirmationHandler = null;

    // Clear biometric consent handlers
    this.getBiometricOptInConsentHandler = null;

    // Clear post-login KYC handlers
    this.activatedCustomerKYCResponseHandler = null;
    this.additionalDocumentScanHandler = null;

    // Clear server biometric authentication handlers
    this.checkUserBiometricTemplateStatusHandler = null;
    this.serverBiometricAuthenticationResultHandler = null;

    this._initialized = false;

    console.log('RdnaIDVEventManager - Cleanup completed');
  }
}

// Auto-instantiate singleton
const rdnaIDVEventManager = RdnaIDVEventManager.getInstance();
