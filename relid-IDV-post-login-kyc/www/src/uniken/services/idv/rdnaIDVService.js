/**
 * REL-ID IDV SDK Service
 *
 * Provides a singleton service for Identity Verification (IDV) related SDK operations.
 * Wraps the native RdnaClient IDV API with Promise-based interface.
 * Handles document scanning and validation operations.
 *
 * **IMPORTANT:** This service auto-initializes when the module loads to ensure event
 * listeners are registered BEFORE any native SDK events can fire. This prevents race
 * conditions where events fire before JavaScript event handlers are registered.
 *
 * IDV APIs (matches React Native reference app):
 *
 * **Document Scan APIs:**
 * - setIDVDocumentScanProcessStartConfirmation: Start/cancel document scan
 * - setIDVConfirmDocumentDetails: Confirm/reject scanned document OCR data
 *
 * **Selfie Capture APIs:**
 * - setIDVSelfieProcessStartConfirmation: Start/cancel selfie capture
 * - setIDVSelfieConfirmation: Confirm/reject selfie biometric results
 *
 * **Biometric Consent APIs:**
 * - setIDVBiometricOptInConsent: User consent for biometric template storage
 *
 * **Post-Login KYC APIs:**
 * - initiateActivatedCustomerKYC: Initiate KYC verification for logged-in users
 *
 * All methods follow the sync+async callback pattern:
 * 1. Success callback always resolves (SDK decides which callback to invoke)
 * 2. Error callback always rejects
 * 3. Asynchronous events deliver actual results through event handlers
 *
 * @see https://developer.uniken.com/docs/idv-integration
 */
class RdnaIDVService {
  constructor() {
    if (RdnaIDVService.instance) {
      return RdnaIDVService.instance;
    }

    console.log('RdnaIDVService - Initializing service (auto-initialization on module load)');
    this.eventManager = rdnaIDVEventManager;
    console.log('RdnaIDVService - Service initialized, event listeners are ready');

    RdnaIDVService.instance = this;
  }

  static getInstance() {
    if (!RdnaIDVService.instance) {
      RdnaIDVService.instance = new RdnaIDVService();
    }
    return RdnaIDVService.instance;
  }

  /**
   * Gets the IDV event manager instance for external callback setup
   *
   * @returns {RdnaIDVEventManager} Event manager instance for registering event handlers
   */
  getEventManager() {
    return this.eventManager;
  }

  /**
   * Cleans up the service and event manager
   *
   * Should be called when IDV functionality is no longer needed or during app cleanup.
   */
  cleanup() {
    console.log('RdnaIDVService - Cleaning up service');
    this.eventManager.cleanup();
  }

  // ================================================================================================
  // DOCUMENT SCAN APIs
  // ================================================================================================

  /**
   * Sets document scan process start confirmation
   *
   * This API must be invoked in response to getIDVDocumentScanProcessStartConfirmation event.
   * Initiates or cancels the document scan process during IDV workflows.
   *
   * @see https://developer.uniken.com/docs/idv-document-scan
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. If isConfirm=true: SDK starts document capture UI
   * 3. If isConfirm=false: IDV flow terminates, redirects to getUser (pre-login) or appropriate workflow event (post-login)
   * 4. Error code 146 = "IDV identity verification canceled by user"
   *
   * @param {boolean} isConfirm - true to start document scan, false to cancel IDV flow
   * @param {number} idvWorkflow - IDV workflow enum value from the event
   * @returns {Promise<Object>} Promise that resolves with sync response structure
   */
  async setIDVDocumentScanProcessStartConfirmation(isConfirm, idvWorkflow) {
    return new Promise((resolve, reject) => {
      console.log('RdnaIDVService - Setting document scan start confirmation:', JSON.stringify({
        isConfirm,
        idvWorkflow
      }, null, 2));

      com.uniken.rdnaplugin.RdnaClient.setIDVDocumentScanProcessStartConfirmation(
        (response) => {
          console.log('RdnaIDVService - SetIDVDocumentScanProcessStartConfirmation sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaIDVService - setIDVDocumentScanProcessStartConfirmation sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          resolve(result);
        },
        (error) => {
          console.error('RdnaIDVService - setIDVDocumentScanProcessStartConfirmation error callback');
          const result = JSON.parse(error);
          reject(result);
        },
        [isConfirm, idvWorkflow]
      );
    });
  }

  /**
   * Sets document details confirmation
   *
   * This API must be invoked in response to getIDVConfirmDocumentDetails event.
   * Confirms or rejects the OCR-extracted document information displayed to the user.
   *
   * @see https://developer.uniken.com/docs/idv-document-validation
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. If isConfirm=true: SDK proceeds with validated document data to next step in IDV workflow
   * 3. If isConfirm=false: SDK may allow document rescan or terminate based on workflow configuration
   * 4. challengeMode determines the operation context (biometric, document scan, etc.)
   *
   * @param {boolean} isConfirm - true to confirm document details, false to reject and possibly rescan
   * @param {number} challengeMode - Challenge operation mode enum value indicating the IDV operation context
   * @returns {Promise<Object>} Promise that resolves with sync response structure
   */
  async setIDVConfirmDocumentDetails(isConfirm, challengeMode) {
    return new Promise((resolve, reject) => {
      console.log('RdnaIDVService - Setting confirm document details:', JSON.stringify({
        isConfirm,
        challengeMode
      }, null, 2));

      com.uniken.rdnaplugin.RdnaClient.setIDVConfirmDocumentDetails(
        (response) => {
          console.log('RdnaIDVService - SetIDVConfirmDocumentDetails sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaIDVService - setIDVConfirmDocumentDetails sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          resolve(result);
        },
        (error) => {
          console.error('RdnaIDVService - setIDVConfirmDocumentDetails error callback');
          const result = JSON.parse(error);
          reject(result);
        },
        [isConfirm, challengeMode]
      );
    });
  }

  // ================================================================================================
  // SELFIE CAPTURE APIs
  // ================================================================================================

  /**
   * Sets selfie process start confirmation
   *
   * This API must be invoked in response to getIDVSelfieProcessStartConfirmation event.
   * Initiates or cancels the selfie capture process during IDV workflows.
   *
   * @see https://developer.uniken.com/docs/idv-selfie-capture
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. If isConfirm=true: SDK starts selfie capture UI with specified camera
   * 3. If isConfirm=false: IDV flow terminates, redirects to appropriate workflow event
   * 4. useDeviceBackCamera determines which camera to use (default: front camera)
   *
   * @param {boolean} isConfirm - true to start selfie capture, false to cancel IDV flow
   * @param {boolean} useDeviceBackCamera - true to use back camera, false to use front camera (default: false)
   * @param {number} idvWorkflow - IDV workflow enum value from the event
   * @returns {Promise<Object>} Promise that resolves with sync response structure
   */
  async setIDVSelfieProcessStartConfirmation(isConfirm, useDeviceBackCamera, idvWorkflow) {
    return new Promise((resolve, reject) => {
      console.log('RdnaIDVService - Setting selfie process start confirmation:', JSON.stringify({
        isConfirm,
        useDeviceBackCamera,
        idvWorkflow
      }, null, 2));

      com.uniken.rdnaplugin.RdnaClient.setIDVSelfieProcessStartConfirmation(
        (response) => {
          console.log('RdnaIDVService - SetIDVSelfieProcessStartConfirmation sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaIDVService - setIDVSelfieProcessStartConfirmation sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          resolve(result);
        },
        (error) => {
          console.error('RdnaIDVService - setIDVSelfieProcessStartConfirmation error callback');
          const result = JSON.parse(error);
          reject(result);
        },
        [isConfirm, useDeviceBackCamera, idvWorkflow]
      );
    });
  }

  /**
   * Sets selfie confirmation
   *
   * This API must be invoked in response to getIDVSelfieConfirmation event.
   * Confirms or rejects the captured selfie and biometric analysis results.
   *
   * @see https://developer.uniken.com/docs/idv-selfie-confirmation
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. If action=true/"true": SDK proceeds with validated selfie data to next step in IDV workflow
   * 3. If action=false/"false": SDK may allow selfie recapture or terminate based on workflow configuration
   * 4. challengeMode determines the operation context (biometric matching, liveness detection, etc.)
   *
   * @param {string} action - User confirmation action (typically "true" for accept, "false" for reject)
   * @param {number} challengeMode - Challenge operation mode enum value from the getIDVSelfieConfirmation event
   * @returns {Promise<Object>} Promise that resolves with sync response structure
   */
  async setIDVSelfieConfirmation(action, challengeMode) {
    return new Promise((resolve, reject) => {
      console.log('RdnaIDVService - Setting selfie confirmation:', JSON.stringify({
        action,
        challengeMode
      }, null, 2));

      com.uniken.rdnaplugin.RdnaClient.setIDVSelfieConfirmation(
        (response) => {
          console.log('RdnaIDVService - SetIDVSelfieConfirmation sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaIDVService - setIDVSelfieConfirmation sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          resolve(result);
        },
        (error) => {
          console.error('RdnaIDVService - setIDVSelfieConfirmation error callback');
          const result = JSON.parse(error);
          reject(result);
        },
        [action, challengeMode]
      );
    });
  }

  // ================================================================================================
  // BIOMETRIC CONSENT APIs
  // ================================================================================================

  /**
   * Sets biometric opt-in consent
   *
   * This API must be invoked in response to getIDVBiometricOptInConsent event.
   * Submits user's consent decision for biometric template storage during IDV workflows.
   *
   * @see https://developer.uniken.com/docs/idv-biometric-consent
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. If isOptIn=true: User consents to biometric template storage, SDK proceeds with IDV flow
   * 3. If isOptIn=false: User declines biometric storage, SDK may continue without storing template
   * 4. The IDV flow will continue to the next step
   * 5. Async events will be handled by event listeners
   *
   * @param {boolean} isOptIn - User consent decision (true = allow biometric storage, false = deny)
   * @param {number} challengeMode - Challenge mode from the getIDVBiometricOptInConsent event
   * @returns {Promise<Object>} Promise that resolves with sync response structure
   */
  async setIDVBiometricOptInConsent(isOptIn, challengeMode) {
    return new Promise((resolve, reject) => {
      console.log('RdnaIDVService - Setting biometric opt-in consent:', JSON.stringify({
        isOptIn,
        challengeMode
      }, null, 2));

      com.uniken.rdnaplugin.RdnaClient.setIDVBiometricOptInConsent(
        (response) => {
          console.log('RdnaIDVService - SetIDVBiometricOptInConsent sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaIDVService - setIDVBiometricOptInConsent sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          resolve(result);
        },
        (error) => {
          console.error('RdnaIDVService - setIDVBiometricOptInConsent error callback');
          const result = JSON.parse(error);
          reject(result);
        },
        [isOptIn, challengeMode]
      );
    });
  }

  // ================================================================================================
  // POST-LOGIN KYC APIs
  // ================================================================================================

  /**
   * Initiates post-login KYC (Know Your Customer) verification
   *
   * This API initiates an IDV workflow for an already logged-in user to complete
   * identity verification. Used for post-login KYC compliance scenarios.
   *
   * @see https://developer.uniken.com/docs/idv-post-login-kyc
   *
   * Response Flow:
   * 1. This method returns sync validation response immediately
   * 2. SDK fires onIDVActivatedCustomerKYCResponse event (first time - workflow initiated)
   * 3. SDK auto-triggers standard IDV events (document scan, selfie, consent)
   * 4. After IDV completion, SDK fires onIDVActivatedCustomerKYCResponse event (second time - final result)
   * 5. Screen-level handler processes final result and displays success/error
   *
   * Response Validation Logic:
   * 1. Check error.longErrorCode: 0 = success, > 0 = error
   * 2. Sync response only validates parameters, doesn't indicate KYC completion
   * 3. Actual KYC result delivered via onIDVActivatedCustomerKYCResponse event
   * 4. Event contains: userID, sessionID, reason, status, error
   *
   * @param {string} reason - Reason for KYC verification (e.g., "Post Login KYC", "Compliance Verification")
   * @returns {Promise<Object>} Promise that resolves with sync response structure
   */
  async initiateActivatedCustomerKYC(reason) {
    return new Promise((resolve, reject) => {
      console.log('RdnaIDVService - Initiating activated customer KYC:', JSON.stringify({
        reason
      }, null, 2));

      com.uniken.rdnaplugin.RdnaClient.initiateActivatedCustomerKYC(
        (response) => {
          console.log('RdnaIDVService - InitiateActivatedCustomerKYC sync callback received');

          const result = JSON.parse(response);
          console.log('RdnaIDVService - initiateActivatedCustomerKYC sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          resolve(result);
        },
        (error) => {
          console.error('RdnaIDVService - initiateActivatedCustomerKYC error callback');
          const result = JSON.parse(error);
          reject(result);
        },
        [reason]
      );
    });
  }
}

// Auto-instantiate singleton
const rdnaIDVService = RdnaIDVService.getInstance();
