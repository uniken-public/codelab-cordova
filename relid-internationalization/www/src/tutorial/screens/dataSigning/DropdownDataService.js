/**
 * Dropdown Data Service
 * Handles dropdown data and enum conversion for Data Signing feature
 *
 * Provides:
 * - Authentication level options (0-4)
 * - Authenticator type options (0-3)
 * - Conversion between display values and numeric enums
 * - Validation for dropdown selections
 *
 * In Cordova, we use numeric values directly instead of TypeScript enums.
 * The SDK plugin expects numbers for authLevel and authenticatorType parameters.
 */

/**
 * @typedef {Object} DropdownOption
 * @property {string} value - Display value with enum name and number
 * @property {string} description - Human-readable description
 */

/**
 * Authentication Level Options
 * Used by Data Signing to specify the security level required
 */
const AUTH_LEVEL_OPTIONS = [
  {
    value: "NONE (0)",
    description: "No authentication required"
  },
  {
    value: "RDNA_AUTH_LEVEL_1 (1)",
    description: "Basic authentication"
  },
  {
    value: "RDNA_AUTH_LEVEL_2 (2)",
    description: "Standard authentication"
  },
  {
    value: "RDNA_AUTH_LEVEL_3 (3)",
    description: "Enhanced authentication"
  },
  {
    value: "RDNA_AUTH_LEVEL_4 (4)",
    description: "Maximum security (Recommended)"
  }
];

/**
 * Authenticator Type Options
 * Used by Data Signing to specify which authentication method to use
 */
const AUTHENTICATOR_TYPE_OPTIONS = [
  {
    value: "NONE (0)",
    description: "No authenticator"
  },
  {
    value: "RDNA_IDV_SERVER_BIOMETRIC (1)",
    description: "Server-based biometric verification"
  },
  {
    value: "RDNA_AUTH_PASS (2)",
    description: "Password authentication"
  },
  {
    value: "RDNA_AUTH_LDA (3)",
    description: "Local device authentication (biometric)"
  }
];

/**
 * Service class for managing dropdown data and enum conversions
 * Provides a clean interface for UI components to work with SDK numeric values
 */
class DropdownDataServiceClass {

  /**
   * Get all available authentication level options for dropdown
   * @returns {DropdownOption[]} Array of dropdown options for auth levels
   */
  getAuthLevelOptions() {
    return AUTH_LEVEL_OPTIONS;
  }

  /**
   * Get all available authenticator type options for dropdown
   * @returns {DropdownOption[]} Array of dropdown options for authenticator types
   */
  getAuthenticatorTypeOptions() {
    return AUTHENTICATOR_TYPE_OPTIONS;
  }

  /**
   * Convert human-readable auth level string to numeric value for SDK
   * Maps dropdown display values to numeric enum constants
   *
   * @param {string} displayValue - The string value from dropdown (e.g., "RDNA_AUTH_LEVEL_4 (4)")
   * @returns {number} Corresponding numeric value (0-4)
   */
  convertAuthLevelToNumber(displayValue) {
    switch (displayValue) {
      case "NONE (0)":
        return 0;
      case "RDNA_AUTH_LEVEL_1 (1)":
        return 1;
      case "RDNA_AUTH_LEVEL_2 (2)":
        return 2;
      case "RDNA_AUTH_LEVEL_3 (3)":
        return 3;
      case "RDNA_AUTH_LEVEL_4 (4)":
        return 4;
      default:
        console.warn('DropdownDataService - Unknown auth level:', displayValue, ', defaulting to 0');
        return 0;
    }
  }

  /**
   * Convert human-readable authenticator type string to numeric value for SDK
   * Maps dropdown display values to numeric enum constants
   *
   * @param {string} displayValue - The string value from dropdown (e.g., "RDNA_IDV_SERVER_BIOMETRIC (1)")
   * @returns {number} Corresponding numeric value (0-3)
   */
  convertAuthenticatorTypeToNumber(displayValue) {
    switch (displayValue) {
      case "NONE (0)":
        return 0;
      case "RDNA_IDV_SERVER_BIOMETRIC (1)":
        return 1;
      case "RDNA_AUTH_PASS (2)":
        return 2;
      case "RDNA_AUTH_LDA (3)":
        return 3;
      default:
        console.warn('DropdownDataService - Unknown authenticator type:', displayValue, ', defaulting to 0');
        return 0;
    }
  }

  /**
   * Convert numeric value back to display string (for reverse lookup)
   * Useful for displaying current selections or debugging
   *
   * @param {number} numericValue - Auth level numeric value (0-4)
   * @returns {string} Human-readable string for display
   */
  convertAuthLevelNumberToDisplay(numericValue) {
    switch (numericValue) {
      case 0:
        return "NONE (0)";
      case 1:
        return "RDNA_AUTH_LEVEL_1 (1)";
      case 2:
        return "RDNA_AUTH_LEVEL_2 (2)";
      case 3:
        return "RDNA_AUTH_LEVEL_3 (3)";
      case 4:
        return "RDNA_AUTH_LEVEL_4 (4)";
      default:
        return "NONE (0)";
    }
  }

  /**
   * Convert numeric value back to display string (for reverse lookup)
   * Useful for displaying current selections or debugging
   *
   * @param {number} numericValue - Authenticator type numeric value (0-3)
   * @returns {string} Human-readable string for display
   */
  convertAuthenticatorTypeNumberToDisplay(numericValue) {
    switch (numericValue) {
      case 0:
        return "NONE (0)";
      case 1:
        return "RDNA_IDV_SERVER_BIOMETRIC (1)";
      case 2:
        return "RDNA_AUTH_PASS (2)";
      case 3:
        return "RDNA_AUTH_LDA (3)";
      default:
        return "NONE (0)";
    }
  }

  /**
   * Validate if a display value is a valid auth level option
   * @param {string} displayValue - String to validate
   * @returns {boolean} true if valid, false otherwise
   */
  isValidAuthLevel(displayValue) {
    return AUTH_LEVEL_OPTIONS.some(option => option.value === displayValue);
  }

  /**
   * Validate if a display value is a valid authenticator type option
   * @param {string} displayValue - String to validate
   * @returns {boolean} true if valid, false otherwise
   */
  isValidAuthenticatorType(displayValue) {
    return AUTHENTICATOR_TYPE_OPTIONS.some(option => option.value === displayValue);
  }
}

// Export singleton instance
const DropdownDataService = new DropdownDataServiceClass();

// Make available globally for screens
if (typeof window !== 'undefined') {
  window.DropdownDataService = DropdownDataService;
}
