/**
 * Threat Detection Modal Controller
 *
 * Manages the MTD threat detection modal UI with direct DOM manipulation.
 * Displays security threats and provides user action buttons (Proceed/Exit).
 *
 * Features:
 * - Dynamic threat list rendering
 * - Consent mode vs Terminate mode handling
 * - Loading states for button actions
 * - Hardware back button blocking when visible
 * - Severity-based color coding
 * - Category-based icons
 *
 * @module ThreatDetectionModal
 */

const ThreatDetectionModal = {
  /**
   * Initialize modal functionality
   * Sets up back button handler
   */
  initialize() {
    console.log('ThreatDetectionModal - Initializing');

    // Block hardware back button when modal is visible
    this.backButtonHandler = (e) => {
      const modal = document.getElementById('mtd-modal-overlay');
      if (modal && modal.style.display !== 'none') {
        e.preventDefault();
        console.log('ThreatDetectionModal - Back button blocked while modal visible');
        return false;
      }
    };

    document.addEventListener('backbutton', this.backButtonHandler, false);

    // Prevent backdrop dismissal
    const overlay = document.getElementById('mtd-modal-overlay');
    if (overlay) {
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          e.preventDefault();
          console.log('ThreatDetectionModal - Backdrop click prevented');
          return false;
        }
      };
    }
  },

  /**
   * Show modal with threat data
   * @param {Array} threats - Array of threat objects
   * @param {boolean} isConsentMode - true for consent (user choice), false for terminate (forced exit)
   * @param {Function} onProceed - Callback for proceed button (consent mode only)
   * @param {Function} onExit - Callback for exit button
   */
  show(threats, isConsentMode, onProceed, onExit) {
    console.log('ThreatDetectionModal - Showing modal:', JSON.stringify({
      threatCount: threats.length,
      isConsentMode,
      threats: threats.map(t => ({ id: t.threatId, name: t.threatName, severity: t.threatSeverity }))
    }, null, 2));

    // Update modal title and subtitle
    const title = document.getElementById('modal-title');
    const subtitle = document.getElementById('modal-subtitle');

    if (title) {
      title.textContent = isConsentMode
        ? '⚠️ Security Threats Detected'
        : '🚫 Security Threat - Action Required';
    }

    if (subtitle) {
      subtitle.textContent = isConsentMode
        ? 'Review the detected threats and choose how to proceed'
        : 'Critical security threats detected. Application must exit for safety.';
    }

    // Update threats header
    const threatsHeader = document.getElementById('threats-header');
    if (threatsHeader) {
      threatsHeader.textContent = `Detected Threats (${threats.length})`;
    }

    // Populate threat list
    this.populateThreatList(threats);

    // Setup action buttons
    this.setupButtons(isConsentMode, onProceed, onExit);

    // Show modal
    const overlay = document.getElementById('mtd-modal-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }
  },

  /**
   * Hide modal
   */
  hide() {
    console.log('ThreatDetectionModal - Hiding modal');

    const overlay = document.getElementById('mtd-modal-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }

    // Clear content
    const threatsList = document.getElementById('threats-list');
    if (threatsList) {
      threatsList.innerHTML = '';
    }

    const buttonsContainer = document.getElementById('modal-buttons');
    if (buttonsContainer) {
      buttonsContainer.innerHTML = '';
    }
  },

  /**
   * Populate threat list with threat items
   * @param {Array} threats - Array of threat objects
   */
  populateThreatList(threats) {
    const threatsList = document.getElementById('threats-list');
    if (!threatsList) return;

    threatsList.innerHTML = '';

    threats.forEach((threat, index) => {
      const threatItem = this.createThreatItem(threat, index);
      threatsList.appendChild(threatItem);
    });
  },

  /**
   * Create a single threat item element
   * @param {Object} threat - Threat object
   * @param {number} index - Threat index
   * @returns {HTMLElement} Threat item element
   */
  createThreatItem(threat, index) {
    const item = document.createElement('div');
    item.className = 'threat-item';

    // Threat header with icon, name, and severity badge
    const header = document.createElement('div');
    header.className = 'threat-header';

    const titleRow = document.createElement('div');
    titleRow.className = 'threat-title-row';

    // Icon
    const icon = document.createElement('span');
    icon.className = 'threat-icon';
    icon.textContent = this.getThreatCategoryIcon(threat.threatCategory);

    // Title container
    const titleContainer = document.createElement('div');
    titleContainer.className = 'threat-title-container';

    const name = document.createElement('div');
    name.className = 'threat-name';
    name.textContent = threat.threatName;

    const category = document.createElement('div');
    category.className = 'threat-category';
    category.textContent = threat.threatCategory;

    titleContainer.appendChild(name);
    titleContainer.appendChild(category);

    // Severity badge
    const severityBadge = document.createElement('div');
    severityBadge.className = 'severity-badge';
    severityBadge.style.backgroundColor = this.getThreatSeverityColor(threat.threatSeverity);
    severityBadge.textContent = threat.threatSeverity;

    titleRow.appendChild(icon);
    titleRow.appendChild(titleContainer);
    titleRow.appendChild(severityBadge);
    header.appendChild(titleRow);

    // Threat content
    const content = document.createElement('div');
    content.className = 'threat-content';

    const message = document.createElement('div');
    message.className = 'threat-message';
    message.textContent = threat.threatMsg;
    content.appendChild(message);

    // Threat details (if reasons available)
    if (threat.threatReason && Array.isArray(threat.threatReason) && threat.threatReason.length > 0) {
      const details = document.createElement('div');
      details.className = 'threat-details';

      const detailsLabel = document.createElement('div');
      detailsLabel.className = 'details-label';
      detailsLabel.textContent = 'Technical Details:';
      details.appendChild(detailsLabel);

      // Show first 2 reasons
      threat.threatReason.slice(0, 2).forEach(reason => {
        const detailText = document.createElement('div');
        detailText.className = 'details-text';
        detailText.textContent = `• ${reason}`;
        details.appendChild(detailText);
      });

      // Show count if more than 2
      if (threat.threatReason.length > 2) {
        const moreText = document.createElement('div');
        moreText.className = 'details-text';
        moreText.textContent = `• ... and ${threat.threatReason.length - 2} more details`;
        details.appendChild(moreText);
      }

      content.appendChild(details);
    }

    item.appendChild(header);
    item.appendChild(content);

    return item;
  },

  /**
   * Setup action buttons based on mode
   * @param {boolean} isConsentMode - Consent vs terminate mode
   * @param {Function} onProceed - Proceed callback (consent only)
   * @param {Function} onExit - Exit callback
   */
  setupButtons(isConsentMode, onProceed, onExit) {
    const buttonsContainer = document.getElementById('modal-buttons');
    if (!buttonsContainer) return;

    buttonsContainer.innerHTML = '';

    if (isConsentMode && onProceed) {
      // Consent mode: show both Proceed and Exit buttons
      const proceedButton = document.createElement('button');
      proceedButton.id = 'modal-proceed-btn';
      proceedButton.className = 'modal-button proceed-button';
      proceedButton.textContent = 'Proceed Anyway';
      proceedButton.onclick = () => {
        this.setButtonLoading('modal-proceed-btn', true, 'Processing...');
        onProceed();
      };
      buttonsContainer.appendChild(proceedButton);
    }

    // Exit button (always present)
    const exitButton = document.createElement('button');
    exitButton.id = 'modal-exit-btn';
    exitButton.className = isConsentMode ? 'modal-button exit-button' : 'modal-button exit-button-full';
    exitButton.textContent = 'Exit Application';
    exitButton.onclick = () => {
      // Show confirmation for exit
      if (confirm('This will close the application due to security threats. Are you sure?')) {
        this.setButtonLoading('modal-exit-btn', true, 'Processing Exit...');
        onExit();
      }
    };
    buttonsContainer.appendChild(exitButton);
  },

  /**
   * Set button loading state
   * @param {string} buttonId - Button element ID
   * @param {boolean} isLoading - Loading state
   * @param {string} loadingText - Text to show when loading
   */
  setButtonLoading(buttonId, isLoading, loadingText) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    if (isLoading) {
      button.disabled = true;
      button.classList.add('button-loading');
      button.textContent = loadingText || 'Processing...';
    } else {
      button.disabled = false;
      button.classList.remove('button-loading');
      // Restore original text (would need to be tracked)
    }
  },

  /**
   * Get color for threat severity
   * @param {string} severity - Threat severity level
   * @returns {string} Color hex code
   */
  getThreatSeverityColor(severity) {
    const severityUpper = (severity || '').toUpperCase();
    switch (severityUpper) {
      case 'HIGH':
        return '#dc2626'; // Red
      case 'MEDIUM':
        return '#f59e0b'; // Orange
      case 'LOW':
        return '#10b981'; // Green
      default:
        return '#6b7280'; // Gray
    }
  },

  /**
   * Get icon for threat category
   * @param {string} category - Threat category
   * @returns {string} Emoji icon
   */
  getThreatCategoryIcon(category) {
    const categoryUpper = (category || '').toUpperCase();
    switch (categoryUpper) {
      case 'SYSTEM':
        return '🛡️';
      case 'NETWORK':
        return '🌐';
      case 'APPLICATION':
      case 'APP':
        return '📱';
      default:
        return '⚠️';
    }
  },

  /**
   * Cleanup modal functionality
   */
  cleanup() {
    console.log('ThreatDetectionModal - Cleanup');

    if (this.backButtonHandler) {
      document.removeEventListener('backbutton', this.backButtonHandler, false);
    }
  }
};

// Expose to global scope
window.ThreatDetectionModal = ThreatDetectionModal;
