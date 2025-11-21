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
   * Initializes the REL-ID SDK
   * @returns {Promise<RDNASyncResponse>} Promise that resolves with sync response structure
   */
  async initialize() {
    // Load connection profile
    const profile = await loadAgentInfo();
    console.log('RdnaService - Loaded connection profile:', JSON.stringify({
      host: profile.host,
      port: profile.port,
      relId: profile.relId.substring(0, 10) + '...',
    }, null, 2));

    console.log('RdnaService - Starting initialization');

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
          com.uniken.rdnaplugin.RdnaClient.RDNALoggingLevel.RDNA_NO_LOGS  // 7: logLevel - Logging level 
        ]
      );
    });
  }
}

// Export singleton instance
const rdnaService = RdnaService.getInstance();
