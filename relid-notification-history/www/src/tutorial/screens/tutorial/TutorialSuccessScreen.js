/**
 * Tutorial Success Screen
 *
 * Displays successful SDK initialization results with session details.
 * Shows status code, session type, and session ID in a user-friendly format.
 *
 * SPA Pattern:
 * - onContentLoaded(params) receives navigation parameters directly
 * - No deviceready listener (called by NavigationService)
 * - Direct DOM manipulation to populate session details
 * - Helper functions for formatting session data
 *
 * Navigation Parameters:
 * @param {number} params.statusCode - Initialization status code (100 = success)
 * @param {string} params.statusMessage - Status message
 * @param {string} params.sessionId - Session ID from SDK
 * @param {number} params.sessionType - Session type (0 = App, 1 = User)
 */

const TutorialSuccessScreen = {
  /**
   * Called when screen content is loaded into DOM (SPA lifecycle)
   * Replaces deviceready + loadSuccessDetails
   *
   * @param {Object} params - Navigation parameters with session details
   */
  onContentLoaded(params) {
    console.log('TutorialSuccessScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Populate screen with session details
    this.populateSessionDetails(params);
  },

  /**
   * Populate screen with session details from params
   * @param {Object} params - Session details
   */
  populateSessionDetails(params) {
    const { statusCode, statusMessage, sessionId, sessionType } = params;

    // Update status code
    const statusCodeElement = document.getElementById('status-code');
    if (statusCodeElement) {
      statusCodeElement.textContent = statusCode || 'Unknown';
    }

    // Update session type
    const sessionTypeElement = document.getElementById('session-type');
    if (sessionTypeElement) {
      const sessionTypeDescription = this.getSessionTypeDescription(sessionType);
      sessionTypeElement.textContent = sessionTypeDescription;
    }

    // Update session ID (formatted)
    const sessionIdElement = document.getElementById('session-id');
    if (sessionIdElement) {
      const formattedSessionId = this.formatSessionId(sessionId);
      sessionIdElement.textContent = formattedSessionId;
    }

    console.log('TutorialSuccessScreen - Session details populated');
  },

  /**
   * Get user-friendly session type description
   * @param {number} sessionType - Session type code
   * @returns {string} Description of session type
   */
  getSessionTypeDescription(sessionType) {
    const sessionTypes = {
      0: 'App Session',
      1: 'User Session',
    };

    return sessionTypes[sessionType] || `Session Type ${sessionType}`;
  },

  /**
   * Format session ID for better readability
   * @param {string} sessionId - Raw session ID
   * @returns {string} Formatted session ID
   */
  formatSessionId(sessionId) {
    if (!sessionId) return 'Unknown';

    // Format: XXXXXXXX-XXXXXXXX-XXXXXXXX...
    if (sessionId.length > 16) {
      return `${sessionId.substring(0, 8)}-${sessionId.substring(8, 16)}-${sessionId.substring(16, 24)}...`;
    }

    return sessionId;
  }
};

// Expose to global scope for NavigationService
window.TutorialSuccessScreen = TutorialSuccessScreen;
