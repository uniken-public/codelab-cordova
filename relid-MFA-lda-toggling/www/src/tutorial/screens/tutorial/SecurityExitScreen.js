/**
 * Security Exit Screen
 *
 * iOS-specific HIG-compliant security exit screen.
 * Provides persistent, accessible exit guidance following Apple's Human Interface Guidelines.
 *
 * SPA Pattern:
 * - onContentLoaded(params) called by NavigationService when screen loads
 * - Static content (no dynamic data)
 * - Platform-specific instructions displayed
 *
 * Platform Behavior:
 * - iOS: Full-screen persistent guidance (HIG-compliant - apps cannot programmatically exit)
 * - Android: May also use this screen, but exitApp() is preferred
 *
 * This screen is reached when MTDThreatManager.handlePlatformSpecificExit() detects iOS
 * and navigates here instead of calling exitApp().
 *
 * Features:
 * - Security lock icon
 * - Clear explanation of security protection
 * - Platform-specific exit instructions
 * - Warning about not reopening the app
 */

const SecurityExitScreen = {
  /**
   * Called when screen content is loaded into DOM (SPA lifecycle)
   * @param {Object} params - Navigation parameters (unused for this screen)
   */
  onContentLoaded(params) {
    console.log('SecurityExitScreen - Content loaded', JSON.stringify(params || {}, null, 2));
    console.log('SecurityExitScreen - Platform:', getPlatformId());
    console.log('SecurityExitScreen - This is the iOS-specific HIG-compliant exit screen');

    // Update platform-specific content if needed
    this.updatePlatformInstructions();
  },

  /**
   * Update instructions based on platform
   */
  updatePlatformInstructions() {
    const platform = getPlatformId();
    const instructionsContainer = document.getElementById('exit-instructions');

    if (!instructionsContainer) {
      console.warn('SecurityExitScreen - Instructions container not found');
      return;
    }

    // Platform-specific instructions are in the HTML template
    // This method can be used for dynamic platform detection if needed
    console.log('SecurityExitScreen - Platform instructions displayed for:', platform);
  }
};

// Expose to global scope for NavigationService
window.SecurityExitScreen = SecurityExitScreen;
