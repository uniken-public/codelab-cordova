/**
 * MTD Threat Manager
 *
 * Singleton manager for Mobile Threat Detection (MTD) functionality.
 * Replaces React Context pattern with direct JavaScript singleton.
 *
 * Features:
 * - Global threat detection and handling
 * - Modal display management
 * - Platform-specific exit strategies (iOS vs Android)
 * - Self-triggered vs genuine threat detection
 * - User action handling (proceed/exit)
 *
 * Architecture:
 * - Singleton pattern for global state
 * - Direct property access (no useState/useRef needed)
 * - Idempotent initialization
 * - Integrates with ThreatDetectionModal and rdnaService
 *
 * @module MTDThreatManager
 */

const MTDThreatManager = {
  /**
   * Singleton instance reference
   */
  _instance: null,

  /**
   * Initialization flag
   */
  _initialized: false,

  /**
   * Current threats array
   */
  threats: [],

  /**
   * Consent mode flag (true = user choice, false = forced exit)
   */
  isConsentMode: false,

  /**
   * Processing flag for button loading states
   */
  isProcessing: false,

  /**
   * Pending exit threat IDs for self-triggered detection
   * When user chooses to exit in consent mode, we track threat IDs
   * to differentiate self-triggered terminateWithThreats from genuine ones
   */
  pendingExitThreats: [],

  /**
   * Get singleton instance
   * @returns {MTDThreatManager} Singleton instance
   */
  getInstance() {
    if (!MTDThreatManager._instance) {
      MTDThreatManager._instance = MTDThreatManager;
    }
    return MTDThreatManager._instance;
  },

  /**
   * Initialize MTD threat manager
   * Idempotent - safe to call multiple times
   * Called ONCE in AppInitializer
   */
  initialize() {
    if (this._initialized) {
      console.log('MTDThreatManager - Already initialized, skipping');
      return;
    }

    console.log('MTDThreatManager - Initializing');

    // Initialize modal controller
    ThreatDetectionModal.initialize();

    // Register threat event handlers with rdnaEventManager
    const eventManager = rdnaService.getEventManager();

    eventManager.setUserConsentThreatsHandler((data) => {
      // Cordova plugin returns threats as direct array (not { threats: [...] })
      const threats = Array.isArray(data) ? data : (data.threats || []);

      console.log('MTDThreatManager - User consent threats received:', JSON.stringify({
        count: threats.length,
        threats: threats.map(t => ({ id: t.threatId, name: t.threatName, severity: t.threatSeverity, category: t.threatCategory }))
      }, null, 2));

      if (threats.length > 0) {
        this.showThreatModal(threats, true);
      } else {
        console.warn('MTDThreatManager - No threats in user consent event, ignoring');
      }
    });

    eventManager.setTerminateWithThreatsHandler((data) => {
      // Cordova plugin returns threats as direct array (not { threats: [...] })
      const threats = Array.isArray(data) ? data : (data.threats || []);

      console.log('MTDThreatManager - Terminate with threats received:', JSON.stringify({
        count: threats.length,
        threats: threats.map(t => ({ id: t.threatId, name: t.threatName, severity: t.threatSeverity, category: t.threatCategory }))
      }, null, 2));

      if (threats.length === 0) {
        console.warn('MTDThreatManager - No threats in terminate event, ignoring');
        return;
      }

      // Check if this is a self-triggered terminate event
      const incomingThreatIds = threats.map(threat => threat.threatId);

      console.log('MTDThreatManager - Threat comparison:', JSON.stringify({
        pendingExitThreats: this.pendingExitThreats,
        incomingThreatIds,
        pendingLength: this.pendingExitThreats.length,
        incomingLength: incomingThreatIds.length
      }, null, 2));

      const isSelfTriggered = this.pendingExitThreats.length > 0 &&
        incomingThreatIds.every(id => this.pendingExitThreats.includes(id)) &&
        incomingThreatIds.length === this.pendingExitThreats.length;

      if (isSelfTriggered) {
        console.log('MTDThreatManager - Self-triggered terminate event - exiting directly without showing dialog');

        // Clear pending state
        this.pendingExitThreats = [];
        this.isProcessing = false;
        this.hideThreatModal();

        // Direct app termination - user already made the decision
        this.handlePlatformSpecificExit('self-triggered');
      } else {
        console.log('MTDThreatManager - Genuine terminate event - showing dialog for user action');

        // Genuine terminate event - show modal
        this.isProcessing = false;
        this.showThreatModal(threats, false);  // Use threats variable, not data.threats
      }
    });

    this._initialized = true;
    console.log('MTDThreatManager - Initialization complete');
  },

  /**
   * Show threat modal with threat data
   * @param {Array} threatList - Array of threat objects
   * @param {boolean} isConsent - Consent mode flag
   */
  showThreatModal(threatList, isConsent) {
    console.log('MTDThreatManager - Showing threat modal:', JSON.stringify({
      threatCount: threatList.length,
      isConsentMode: isConsent,
      threats: threatList.map(t => ({ name: t.threatName, severity: t.threatSeverity }))
    }, null, 2));

    this.threats = threatList;
    this.isConsentMode = isConsent;

    ThreatDetectionModal.show(
      threatList,
      isConsent,
      isConsent ? this.handleProceed.bind(this) : undefined,
      this.handleExit.bind(this)
    );
  },

  /**
   * Hide threat modal
   */
  hideThreatModal() {
    console.log('MTDThreatManager - Hiding threat modal');

    ThreatDetectionModal.hide();
    this.threats = [];
    this.isConsentMode = false;
    this.isProcessing = false;
  },

  /**
   * Handle user choosing to proceed with threats
   * Only available in consent mode
   */
  handleProceed() {
    console.log('MTDThreatManager - User chose to proceed with threats');

    this.isProcessing = true;

    // Modify all threats to proceed with action
    const modifiedThreats = this.threats.map(threat => ({
      ...threat,
      shouldProceedWithThreats: true,
      rememberActionForSession: true,
      // Convert threatReason array to string if needed
      threatReason: Array.isArray(threat.threatReason)
        ? threat.threatReason.join(',')
        : threat.threatReason
    }));

    const threatsJsonString = JSON.stringify(modifiedThreats);
    console.log('MTDThreatManager - Calling takeActionOnThreats with proceed=true');

    // Call rdnaService to take action on threats
    rdnaService.takeActionOnThreats(threatsJsonString)
      .then(() => {
        console.log('MTDThreatManager - takeActionOnThreats succeeded (proceed)');
        // Success will be handled by async events (onInitialized)
        this.hideThreatModal();
      })
      .catch((error) => {
        this.isProcessing = false;
        console.error('MTDThreatManager - takeActionOnThreats failed:', JSON.stringify(error, null, 2));

        alert(
          `Failed to proceed with threats\n\n` +
          `${error.error?.errorString}\n\n` +
          `Error Codes:\n` +
          `Long: ${error.error?.longErrorCode}\n` +
          `Short: ${error.error?.shortErrorCode}`
        );
      });
  },

  /**
   * Handle user choosing to exit application
   * Available in both consent and terminate modes
   */
  handleExit() {
    console.log('MTDThreatManager - User chose to exit application due to threats');

    if (this.isConsentMode) {
      console.log('MTDThreatManager - Consent mode: calling takeAction with shouldProceedWithThreats = false');

      this.isProcessing = true;

      // Track threat IDs for pending exit to identify self-triggered terminateWithThreats
      const threatIds = this.threats.map(threat => threat.threatId);
      this.pendingExitThreats = threatIds;
      console.log('MTDThreatManager - Tracking pending exit for threat IDs:', JSON.stringify(threatIds, null, 2));

      // Modify all threats to NOT proceed with action
      const modifiedThreats = this.threats.map(threat => ({
        ...threat,
        shouldProceedWithThreats: false,
        rememberActionForSession: true,
        // Convert threatReason array to string if needed
        threatReason: Array.isArray(threat.threatReason)
          ? threat.threatReason.join(',')
          : threat.threatReason
      }));

      const threatsJsonString = JSON.stringify(modifiedThreats);
      console.log('MTDThreatManager - Calling takeActionOnThreats with proceed=false');

      // Call rdnaService to take action (will trigger terminateWithThreats event)
      rdnaService.takeActionOnThreats(threatsJsonString)
        .then(() => {
          console.log('MTDThreatManager - takeActionOnThreats succeeded (exit), awaiting terminateWithThreats event');
          // The terminateWithThreats event handler will process the exit
        })
        .catch((error) => {
          // Clear pending state on error
          this.pendingExitThreats = [];
          this.isProcessing = false;

          console.error('MTDThreatManager - takeActionOnThreats failed:', JSON.stringify(error, null, 2));

          alert(
            `Failed to process threat action\n\n` +
            `${error.error?.errorString}\n\n` +
            `Error Codes:\n` +
            `Long: ${error.error?.longErrorCode}\n` +
            `Short: ${error.error?.shortErrorCode}`
          );
        });
    } else {
      console.log('MTDThreatManager - Terminate mode - directly exiting application');

      // Direct exit for terminate mode
      this.hideThreatModal();
      this.handlePlatformSpecificExit('terminate');
    }
  },

  /**
   * Handle platform-specific application exit
   * iOS: Navigate to SecurityExitScreen (HIG compliance)
   * Android: Use navigator.app.exitApp()
   *
   * @param {string} exitType - 'self-triggered' or 'terminate'
   */
  handlePlatformSpecificExit(exitType) {
    const platform = getPlatformId();

    console.log('MTDThreatManager - Platform-specific exit called:', JSON.stringify({
      platform,
      exitType
    }, null, 2));

    if (platform === 'ios') {
      console.log('MTDThreatManager - iOS detected - navigating to SecurityExitScreen');

      // iOS: Navigate to SecurityExitScreen for HIG-compliant exit guidance
      NavigationService.navigate('SecurityExit');
    } else {
      console.log('MTDThreatManager - Non-iOS platform - using exitApp()');

      // Android and other platforms: Use direct app exit
      try {
        exitApp();
        console.log('MTDThreatManager - exitApp() called successfully');
      } catch (error) {
        console.error('MTDThreatManager - Failed to exit app on platform:', platform, error);
      }
    }
  },

  /**
   * Cleanup threat manager
   */
  cleanup() {
    console.log('MTDThreatManager - Cleanup');

    this.pendingExitThreats = [];
    this.threats = [];
    this.isConsentMode = false;
    this.isProcessing = false;

    ThreatDetectionModal.cleanup();
  }
};

// Expose to global scope
window.MTDThreatManager = MTDThreatManager;
