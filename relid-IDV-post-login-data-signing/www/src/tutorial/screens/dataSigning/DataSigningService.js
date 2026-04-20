/**
 * Data Signing Service
 * High-level service that orchestrates data signing operations
 *
 * Provides:
 * - Wrapper methods around rdnaService for data signing
 * - Form validation for user input
 * - Response formatting for UI display
 * - Error message generation
 * - Result data conversion for results screen
 *
 * This service combines rdnaService (low-level SDK calls) and
 * DropdownDataService (enum conversions) for complete functionality.
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {string[]} errors - Array of error messages
 */

/**
 * @typedef {Object} ResultInfoItem
 * @property {string} name - Field name for display
 * @property {string} value - Field value
 */

/**
 * High-level service for data signing operations
 * Singleton pattern for consistent access across the application
 */
class DataSigningServiceClass {

  /**
   * Get DropdownDataService instance
   * @returns {Object} DropdownDataService singleton
   */
  get dropdownService() {
    return window.DropdownDataService;
  }

  /**
   * Get rdnaService instance
   * @returns {Object} rdnaService singleton
   */
  get rdnaService() {
    return rdnaService;
  }

  /**
   * Initiates data signing with authentication
   *
   * Converts display values to numeric enums and calls SDK API.
   * This method returns immediately after sync response.
   * The async result comes via onAuthenticateUserAndSignData event.
   *
   * @param {string} payload - Data payload to sign (max 500 characters)
   * @param {string} authLevelDisplay - Display value like "RDNA_AUTH_LEVEL_4 (4)"
   * @param {string} authenticatorTypeDisplay - Display value like "RDNA_AUTH_PASS (2)"
   * @param {string} reason - Reason for signing (max 100 characters)
   * @returns {Promise<Object>} Promise resolving with sync response
   */
  async signData(payload, authLevelDisplay, authenticatorTypeDisplay, reason) {
    console.log('DataSigningService - Starting data signing process');
    console.log('DataSigningService - Input:', JSON.stringify({
      payloadLength: payload.length,
      authLevelDisplay,
      authenticatorTypeDisplay,
      reasonLength: reason.length
    }, null, 2));

    try {
      // Convert display values to numeric enums
      const authLevel = this.dropdownService.convertAuthLevelToNumber(authLevelDisplay);
      const authenticatorType = this.dropdownService.convertAuthenticatorTypeToNumber(authenticatorTypeDisplay);

      console.log('DataSigningService - Converted enums:', JSON.stringify({
        authLevel,
        authenticatorType
      }, null, 2));

      // Call SDK API
      const response = await this.rdnaService.authenticateUserAndSignData(
        payload,
        authLevel,
        authenticatorType,
        reason
      );

      console.log('DataSigningService - Data signing initiated successfully');
      return response;
    } catch (error) {
      console.error('DataSigningService - Data signing failed:', error);
      throw error;
    }
  }

  /**
   * Submits password for step-up authentication during data signing
   *
   * @param {string} password - User's password
   * @param {number} challengeMode - Challenge mode from getPassword callback
   * @returns {Promise<Object>} Promise resolving with sync response
   */
  async submitPassword(password, challengeMode) {
    console.log('DataSigningService - Submitting password for data signing');

    try {
      const response = await this.rdnaService.setPassword(password, challengeMode);
      console.log('DataSigningService - Password submitted successfully');
      return response;
    } catch (error) {
      console.error('DataSigningService - Password submission failed:', error);
      throw error;
    }
  }

  /**
   * Resets data signing state (cleanup)
   *
   * Should be called after:
   * - Successful data signing completion
   * - User cancels data signing
   * - Error during data signing
   * - Navigating away from data signing screens
   *
   * @returns {Promise<Object>} Promise resolving with sync response
   */
  async resetState() {
    console.log('DataSigningService - Resetting data signing state');

    try {
      await this.rdnaService.resetAuthenticateUserAndSignDataState();
      console.log('DataSigningService - State reset successfully');
    } catch (error) {
      console.error('DataSigningService - State reset failed:', error);
      // Don't throw - cleanup should not fail the operation
    }
  }

  /**
   * Validates form input before submission
   *
   * Checks:
   * - Payload is not empty and <= 500 characters
   * - Auth level is selected and valid
   * - Authenticator type is selected and valid
   * - Reason is not empty and <= 100 characters
   *
   * @param {string} payload - Data payload to validate
   * @param {string} authLevel - Selected auth level display value
   * @param {string} authenticatorType - Selected authenticator type display value
   * @param {string} reason - Signing reason
   * @returns {ValidationResult} Validation result with errors if any
   */
  validateSigningInput(payload, authLevel, authenticatorType, reason) {
    const errors = [];

    // Validate payload
    if (!payload || payload.trim().length === 0) {
      errors.push('Payload is required');
    } else if (payload.length > 500) {
      errors.push('Payload must be less than 500 characters');
    }

    // Validate auth level
    if (!authLevel || authLevel === '') {
      errors.push('Please select an authentication level');
    } else if (!this.dropdownService.isValidAuthLevel(authLevel)) {
      errors.push('Please select a valid authentication level');
    }

    // Validate authenticator type
    if (!authenticatorType || authenticatorType === '') {
      errors.push('Please select an authenticator type');
    } else if (!this.dropdownService.isValidAuthenticatorType(authenticatorType)) {
      errors.push('Please select a valid authenticator type');
    }

    // Validate reason
    if (!reason || reason.trim().length === 0) {
      errors.push('Reason is required');
    } else if (reason.length > 100) {
      errors.push('Reason must be less than 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Converts raw data signing response to display format
   * Formats all fields as strings for UI display
   *
   * @param {Object} response - Raw response from onAuthenticateUserAndSignData event
   * @returns {Object} Formatted data for UI display with all string values
   */
  formatSigningResultForDisplay(response) {
    return {
      authLevel: response.authLevel?.toString() || 'N/A',
      authenticationType: response.authenticationType?.toString() || 'N/A',
      dataPayloadLength: response.dataPayloadLength?.toString() || 'N/A',
      dataPayload: response.dataPayload || 'N/A',
      payloadSignature: response.payloadSignature || 'N/A',
      dataSignatureID: response.dataSignatureID || 'N/A',
      reason: response.reason || 'N/A'
    };
  }

  /**
   * Converts display format to info items for results screen
   * Creates array of {name, value} objects for rendering
   *
   * @param {Object} displayData - Formatted display data
   * @returns {ResultInfoItem[]} Array of info items for UI rendering
   */
  convertToResultInfoItems(displayData) {
    return [
      {
        name: 'Payload Signature',
        value: displayData.payloadSignature
      },
      {
        name: 'Data Signature ID',
        value: displayData.dataSignatureID
      },
      {
        name: 'Reason',
        value: displayData.reason
      },
      {
        name: 'Data Payload',
        value: displayData.dataPayload
      },
      {
        name: 'Auth Level',
        value: displayData.authLevel
      },
      {
        name: 'Authentication Type',
        value: displayData.authenticationType
      },
      {
        name: 'Data Payload Length',
        value: displayData.dataPayloadLength
      }
    ];
  }

  /**
   * Validates password input
   *
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with error if invalid
   */
  validatePassword(password) {
    if (!password || password.trim().length === 0) {
      return {
        isValid: false,
        error: 'Password is required'
      };
    }

    return {
      isValid: true
    };
  }

  /**
   * Gets user-friendly error message for error codes
   *
   * @param {number} errorCode - Error code from SDK
   * @returns {string} Human-readable error message
   */
  getErrorMessage(errorCode) {
    switch (errorCode) {
      case 0:
        return 'Success';
      case 214:
        return 'Authentication method not supported. Please try a different authentication type.';
      case 102:
        return 'Authentication failed. Please check your credentials and try again.';
      case 153:
        return 'Operation cancelled by user.';
      default:
        return `Operation failed with error code: ${errorCode}`;
    }
  }
}

// Export singleton instance
const DataSigningService = new DataSigningServiceClass();

// Make available globally for screens
if (typeof window !== 'undefined') {
  window.DataSigningService = DataSigningService;
}
