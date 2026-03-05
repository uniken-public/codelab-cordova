/**
 * REL-ID Service
 *
 * Centralized service for REL-ID SDK operations.
 * Provides a singleton pattern for consistent SDK access across the application.
 *
 * @typedef {Object} RDNASyncResponse
 * @property {Object} error
 * @property {number} error.longErrorCode
 * @property {number} error.shortErrorCode
 * @property {string} error.errorString
 *
 * @typedef {Object} InitOptions
 * @property {Object} internationalizationOptions - Language configuration
 * @property {string} internationalizationOptions.localeCode - ISO 639-1 language code (e.g., 'en', 'ar', 'es'). Empty string defaults to 'en'
 * @property {string} internationalizationOptions.localeName - Display name for the locale
 * @property {number} internationalizationOptions.languageDirection - 0 = LTR (Left-to-Right), 1 = RTL (Right-to-Left)
 * @property {Object} permissionOptions - Permission configuration
 * @property {boolean} permissionOptions.isLocationPermissionRequired - Whether location permission is needed
 * @property {boolean} permissionOptions.isLocationPermissionMandatory - If true, SDK fails without permission; if false, works with limited functionality
 * @property {Object} otelConfig - OpenTelemetry configuration
 * @property {string} otelConfig.otelHTTPEndpointURL - OpenTelemetry HTTP endpoint URL (empty = disabled)
 * @property {string} otelConfig.enableEncoding - Encoding format for OTel data
 * @property {number} otelConfig.disableTrace - 0 = enable tracing, 1 = disable tracing
 * @property {number} otelConfig.otelTraceFlushTimeout - Timeout in milliseconds for flushing traces
 */

class RdnaService {
  constructor() {
    if (RdnaService.instance) {
      return RdnaService.instance;
    }

    this.eventManager = null;
    RdnaService.instance = this;
  }

  /**
   * Gets the singleton instance of RdnaService
   * @returns {RdnaService}
   */
  static getInstance() {
    if (!RdnaService.instance) {
      RdnaService.instance = new RdnaService();
    }
    return RdnaService.instance;
  }

  /**
   * Cleans up the service and event manager
   */
  cleanup() {
    console.log('RdnaService - Cleaning up service');
    if (this.eventManager) {
      this.eventManager.cleanup();
    }
  }

  /**
   * Gets the event manager instance for external callback setup
   * @returns {RdnaEventManager}
   */
  getEventManager() {
    if (!this.eventManager) {
      // Lazy load to avoid circular dependency
      this.eventManager = RdnaEventManager.getInstance();
    }
    return this.eventManager;
  }

  /**
   * Gets the version of the REL-ID SDK
   * @returns {Promise<string>} SDK version string
   */
  async getSDKVersion() {
    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.getSDKVersion(
        (response) => {
          console.log('RdnaService - SDK version response received');

          try {
            // Plugin returns JSON string - must parse
            const parsed = JSON.parse(response);
            const version = parsed?.response || 'Unknown';
            console.log('RdnaService - SDK Version:', version);
            resolve(version);
          } catch (error) {
            console.error('RdnaService - Failed to parse SDK version:', error);
            reject(new Error('Failed to parse SDK version response'));
          }
        },
        (error) => {
          console.error('RdnaService - getSDKVersion error:', error);
          reject(error);
        },
        [] // No parameters for getSDKVersion
      );
    });
  }

  /**
   * Initializes the REL-ID SDK with optional advanced configuration
   *
   * @param {InitOptions} [initOptions] - Optional configuration for language, permissions, and telemetry
   *                                       If not provided, uses default values suitable for most applications
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   *
   * Example usage:
   * ```javascript
   * // Basic initialization (uses defaults)
   * await rdnaService.initialize();
   *
   * // Advanced initialization with custom configuration
   * await rdnaService.initialize({
   *   internationalizationOptions: {
   *     localeCode: 'ar',
   *     localeName: 'Arabic',
   *     languageDirection: 1  // RTL
   *   },
   *   permissionOptions: {
   *     isLocationPermissionRequired: true,
   *     isLocationPermissionMandatory: false
   *   },
   *   otelConfig: {
   *     otelHTTPEndpointURL: '',
   *     enableEncoding: '',
   *     disableTrace: 1,
   *     otelTraceFlushTimeout: 0
   *   }
   * });
   * ```
   */
  async initialize(initOptions) {
    // Load connection profile
    const profile = await loadAgentInfo();
    console.log('RdnaService - Loaded connection profile:', JSON.stringify({
      host: profile.host,
      port: profile.port,
      relId: profile.relId.substring(0, 10) + '...',
    }, null, 2));

    // If no initOptions provided, use default values
    // Default configuration:
    // - Language: Empty (SDK defaults to 'en'), LTR direction
    // - Permissions: Location required but not mandatory
    // - Telemetry: Disabled (disableTrace: 1)
    const defaultInitOptions = {
      internationalizationOptions: {
        localeCode: '',           // Empty string - SDK will default to 'en'
        localeName: '',
        languageDirection: 0      // 0 = LTR (Left-to-Right)
      },
      permissionOptions: {
        isLocationPermissionRequired: true,    // Location permission is requested
        isLocationPermissionMandatory: false   // But SDK can work without it
      },
      otelConfig: {
        otelHTTPEndpointURL: '',
        enableEncoding: '',
        disableTrace: 1,                       // Tracing disabled by default
        otelTraceFlushTimeout: 0
      }
    };

    // Use provided options or defaults
    const finalInitOptions = initOptions || defaultInitOptions;

    // Convert to JSON string as required by the SDK
    const initOptionsString = JSON.stringify(finalInitOptions);

    console.log('RdnaService - Starting initialization');
    console.log('RdnaService - InitOptions:', initOptionsString);

    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.initialize(
        (response) => {
          console.log('RdnaService - Initialize sync callback received');

            // Plugin returns JSON string - must parse
          const result = JSON.parse(response);
          console.log('RdnaService - Initialize sync response:', JSON.stringify({
              longErrorCode: result.error?.longErrorCode,
              shortErrorCode: result.error?.shortErrorCode,
              errorString: result.error?.errorString
            }, null, 2));
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - Initialize sync error callback:');
          const result = JSON.parse(error);
          console.log('RdnaService - Initialize sync error response:', JSON.stringify({
              longErrorCode: result.error?.longErrorCode,
              shortErrorCode: result.error?.shortErrorCode,
              errorString: result.error?.errorString
            }, null, 2));
          reject(result);
        },
        [
          profile.relId,                                              // 0: agentInfo - The REL-ID encrypted string
          profile.host,                                               // 1: gatewayHost - Hostname or IP of the gateway server
          profile.port,                                               // 2: gatewayPort - Port number for gateway server
          '',                                                         // 3: cipherSpecs - Encryption format string
          '',                                                         // 4: cipherSalt - Cryptographic salt
          '',                                                         // 5: proxySettings - Proxy configuration (JSON string, optional)
          '',                                                         // 6: sslCertificate - SSL certificate configuration (optional)
          com.uniken.rdnaplugin.RdnaClient.RDNALoggingLevel.RDNA_NO_LOGS,  // 7: logLevel - Logging level
          initOptionsString                                           // 8: initOptions - Advanced SDK configuration (JSON string)
        ]
      );
    });
  }

  /**
   * Takes action on detected security threats
   *
   * @param {string} modifiedThreatsJson - JSON string containing threat action decisions
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   *
   * @example
   * const modifiedThreats = threats.map(threat => ({
   *   ...threat,
   *   shouldProceedWithThreats: true,
   *   rememberActionForSession: true
   * }));
   * await rdnaService.takeActionOnThreats(JSON.stringify(modifiedThreats));
   */
  async takeActionOnThreats(modifiedThreatsJson) {
    console.log('RdnaService - Taking action on threats');

    return new Promise((resolve, reject) => {
      com.uniken.rdnaplugin.RdnaClient.takeActionOnThreats(
        (response) => {
          console.log('RdnaService - Take action on threats sync callback received');

            // Plugin returns JSON string - must parse
          const result = JSON.parse(response);
          console.log('RdnaService - takeActionOnThreats sync response:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          resolve(result);
        },
        (error) => {
          console.error('RdnaService - takeActionOnThreats error callback');
          const result = JSON.parse(error);
          console.error('RdnaService - takeActionOnThreats error:', JSON.stringify({
            longErrorCode: result.error?.longErrorCode,
            shortErrorCode: result.error?.shortErrorCode,
            errorString: result.error?.errorString
          }, null, 2));
          reject(result);
        
        },
        [modifiedThreatsJson] // ← CRITICAL: Must be array with stringified JSON
      );
    });
  }
}

// Export singleton instance
const rdnaService = RdnaService.getInstance();
