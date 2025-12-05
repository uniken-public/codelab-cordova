/**
 * Tutorial Error Screen
 *
 * Displays SDK initialization error details with error codes and descriptions.
 * Provides clear error information for troubleshooting.
 *
 * SPA Pattern:
 * - onContentLoaded(params) receives navigation parameters directly
 * - No deviceready listener (called by NavigationService)
 * - Direct DOM manipulation to populate error details
 *
 * Navigation Parameters:
 * @param {number} params.shortErrorCode - Short error code from SDK
 * @param {number} params.longErrorCode - Long error code from SDK
 * @param {string} params.errorString - Error description message
 */

const TutorialErrorScreen = {
  /**
   * Called when screen content is loaded into DOM (SPA lifecycle)
   * Replaces deviceready + loadErrorDetails
   *
   * @param {Object} params - Navigation parameters with error details
   */
  onContentLoaded(params) {
    console.log('TutorialErrorScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Populate screen with error details
    this.populateErrorDetails(params);
  },

  /**
   * Populate screen with error details from params
   * @param {Object} params - Error details
   */
  populateErrorDetails(params) {
    const { shortErrorCode, longErrorCode, errorString } = params;

    // Update error description
    const errorDescElement = document.getElementById('error-description');
    if (errorDescElement) {
      errorDescElement.textContent = errorString || 'Unknown error occurred';
    }

    // Update short error code
    const shortCodeElement = document.getElementById('short-error-code');
    if (shortCodeElement) {
      shortCodeElement.textContent = shortErrorCode !== undefined ? shortErrorCode : 'N/A';
    }

    // Update long error code
    const longCodeElement = document.getElementById('long-error-code');
    if (longCodeElement) {
      longCodeElement.textContent = longErrorCode !== undefined ? longErrorCode : 'N/A';
    }

    console.log('TutorialErrorScreen - Error details populated');
  }
};

// Expose to global scope for NavigationService
window.TutorialErrorScreen = TutorialErrorScreen;
