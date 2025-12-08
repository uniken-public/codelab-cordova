/**
 * Data Signing Result Screen
 * Displays the results of data signing operation
 *
 * Features:
 * - Displays 7 result fields from signing response
 * - Copy-to-clipboard functionality for each field
 * - "Sign Another Document" button to return to input screen
 * - Special highlighting for signature field
 * - Security information display
 * - Handles long values with truncation and expand buttons
 *
 * SPA Lifecycle:
 * - onContentLoaded(params) - Load results from params, render UI
 * - setupEventListeners() - Attach button handlers
 * - renderResults() - Dynamically build results HTML
 */

const DataSigningResultScreen = {
  // Result data
  resultData: null,
  resultDisplay: null,
  copiedField: null,

  /**
   * Called when screen content is loaded (SPA lifecycle)
   * @param {Object} params - Navigation parameters with resultData
   */
  onContentLoaded(params) {
    console.log('DataSigningResultScreen - Content loaded with params:', JSON.stringify({
      hasResultData: !!params?.resultData
    }, null, 2));

    // Get result data from params
    this.resultData = params?.resultData;

    if (!this.resultData) {
      console.error('DataSigningResultScreen - No result data provided');
      this.showError('No signing results available');
      return;
    }

    // Format for display
    this.resultDisplay = DataSigningService.formatSigningResultForDisplay(this.resultData);

    // Setup UI
    this.setupEventListeners();
    this.renderResults();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    console.log('DataSigningResultScreen - Setting up event listeners');

    // "Sign Another Document" button
    const signAnotherBtn = document.getElementById('data-signing-sign-another-btn');
    if (signAnotherBtn) {
      signAnotherBtn.onclick = this.handleSignAnother.bind(this);
    }

    console.log('DataSigningResultScreen - Event listeners attached');
  },

  /**
   * Render results dynamically
   */
  renderResults() {
    console.log('DataSigningResultScreen - Rendering results');

    const resultsContainer = document.getElementById('data-signing-results-container');
    if (!resultsContainer) {
      console.error('DataSigningResultScreen - Results container not found');
      return;
    }

    // Convert to result info items
    const resultItems = DataSigningService.convertToResultInfoItems(this.resultDisplay);

    // Build HTML with simplified card layout
    let html = '';
    resultItems.forEach((item, index) => {
      html += `
        <div class="result-card" data-field="${item.name}">
          <div class="result-card-header">
            <span class="result-card-label">${item.name}</span>
            ${item.value !== 'N/A' ? `
              <button class="copy-btn" data-field="${item.name}" data-value="${this.escapeHtml(item.value)}">
                📋 Copy
              </button>
            ` : ''}
          </div>
          <div class="result-card-value">
            ${this.escapeHtml(item.value)}
          </div>
        </div>
      `;
    });

    resultsContainer.innerHTML = html;

    // Attach handlers to copy buttons
    const copyBtns = resultsContainer.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
      btn.onclick = () => {
        const fieldName = btn.getAttribute('data-field');
        const value = btn.getAttribute('data-value');
        this.handleCopyToClipboard(value, fieldName, btn);
      };
    });

    console.log('DataSigningResultScreen - Results rendered');
  },

  /**
   * Handle copy to clipboard
   * @param {string} value - Value to copy
   * @param {string} fieldName - Field name for feedback
   * @param {HTMLElement} button - Button element to update
   */
  async handleCopyToClipboard(value, fieldName, button) {
    console.log('DataSigningResultScreen - Copying to clipboard:', fieldName);

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = value;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      // Update button to show success
      this.copiedField = fieldName;
      button.textContent = '✓ Copied';
      button.classList.add('copied');

      // Reset after 2 seconds
      setTimeout(() => {
        this.copiedField = null;
        button.textContent = '📋 Copy';
        button.classList.remove('copied');
      }, 2000);

      console.log('DataSigningResultScreen - Copied successfully:', fieldName);

    } catch (error) {
      console.error('DataSigningResultScreen - Copy failed:', error);
      alert('Failed to copy to clipboard. Please copy manually.');
    }
  },

  /**
   * Handle view full value (for long values)
   * @param {string} fieldName - Field name
   * @param {string} value - Full value
   */
  handleViewFullValue(fieldName, value) {
    console.log('DataSigningResultScreen - Viewing full value:', fieldName);

    // Use alert for simplicity (could be a modal in production)
    alert(`${fieldName}\n\n${value}`);
  },

  /**
   * Handle "Sign Another Document" button
   */
  async handleSignAnother() {
    console.log('DataSigningResultScreen - Sign another button clicked');

    try {
      // Reset data signing state
      await DataSigningService.resetState();

      // Navigate back to input screen
      NavigationService.navigate('DataSigningInput');

    } catch (error) {
      console.error('DataSigningResultScreen - Failed to reset state:', error);
      // Navigate anyway - state reset is not critical
      NavigationService.navigate('DataSigningInput');
    }
  },

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    const container = document.getElementById('data-signing-results-container');
    if (container) {
      container.innerHTML = `
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <div class="error-message">${this.escapeHtml(message)}</div>
          <button class="back-btn" onclick="NavigationService.navigate('DataSigningInput')">
            Back to Data Signing
          </button>
        </div>
      `;
    }
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.DataSigningResultScreen = DataSigningResultScreen;
}
