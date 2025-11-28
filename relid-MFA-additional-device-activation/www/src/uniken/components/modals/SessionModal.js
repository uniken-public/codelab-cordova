/**
 * Session Modal Component
 *
 * Manages session timeout modal UI in Cordova.
 * This is the Cordova equivalent of React Native's SessionModal component.
 *
 * Features:
 * - Hard Timeout Mode: Red header, "Close" button only, no countdown
 * - Idle Timeout Mode: Orange header, countdown timer, "Extend Session" + "Close" buttons
 * - Countdown Timer: Counts down from timeLeftInSeconds with setInterval
 * - Background/Foreground Tracking: Adjusts countdown when app returns from background
 * - Loading State: Shows "Extending..." during API call
 * - Dynamic Content: Updates modal based on session data
 *
 * The modal is a persistent div in index.html (not a template), shown/hidden via CSS display property.
 */

const SessionModal = {
  // Modal state
  visible: false,
  type: null, // 'hard-timeout' | 'idle-timeout'
  data: null,
  isProcessing: false,

  // Countdown state
  countdown: 0,
  countdownTimer: null,

  // Background tracking
  backgroundTime: null,

  // Callbacks
  onExtendSession: null,
  onDismiss: null,

  /**
   * Initializes the modal (sets up event listeners)
   * Called once when app loads
   */
  initialize() {
    console.log('SessionModal - Initializing');

    // Set up visibility change listener for background/foreground tracking
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });

    // Set up button click handlers (will be attached when modal is shown)
    console.log('SessionModal - Initialized');
  },

  /**
   * Shows the modal with the specified configuration
   *
   * @param {Object} config
   * @param {'hard-timeout' | 'idle-timeout'} config.type - Type of session timeout
   * @param {Object} config.data - Session data from SDK event
   * @param {Function} [config.onExtendSession] - Callback for extend button (idle timeout only)
   * @param {Function} config.onDismiss - Callback for dismiss/close button
   */
  show(config) {
    console.log('SessionModal - Showing modal:', config.type);

    this.visible = true;
    this.type = config.type;
    this.data = config.data;
    this.onExtendSession = config.onExtendSession || null;
    this.onDismiss = config.onDismiss;
    this.isProcessing = false;

    // Initialize countdown for idle timeout
    if (this.type === 'idle-timeout' && config.data.timeLeftInSeconds) {
      this.countdown = config.data.timeLeftInSeconds;
      this.startCountdown();
    }

    // Render modal content
    this.render();

    // Show modal
    const modalElement = document.getElementById('session-modal');
    if (modalElement) {
      modalElement.style.display = 'flex';
    }
  },

  /**
   * Hides the modal and cleans up
   */
  hide() {
    console.log('SessionModal - Hiding modal');

    this.visible = false;
    this.type = null;
    this.data = null;
    this.isProcessing = false;
    this.onExtendSession = null;
    this.onDismiss = null;

    // Stop countdown
    this.stopCountdown();

    // Hide modal
    const modalElement = document.getElementById('session-modal');
    if (modalElement) {
      modalElement.style.display = 'none';
    }
  },

  /**
   * Sets processing state (for extend session button)
   *
   * @param {boolean} processing
   */
  setProcessing(processing) {
    console.log('SessionModal - Set processing:', processing);
    this.isProcessing = processing;

    // Update button UI
    const extendButton = document.getElementById('session-modal-extend-btn');
    if (extendButton) {
      extendButton.disabled = processing;
      extendButton.innerHTML = processing
        ? '<span class="spinner"></span> Extending...'
        : 'Extend Session';
    }

    const closeButton = document.getElementById('session-modal-close-btn');
    if (closeButton) {
      closeButton.disabled = processing;
    }
  },

  /**
   * Renders the modal content based on current state
   */
  render() {
    const modalContent = document.getElementById('session-modal-content');
    if (!modalContent) {
      console.error('SessionModal - Modal content element not found');
      return;
    }

    const config = this.getModalConfig();

    modalContent.innerHTML = `
      <div class="session-modal-container">
        <!-- Header -->
        <div class="session-modal-header" style="background-color: ${config.headerColor};">
          <h2 class="session-modal-title">${config.title}</h2>
          <p class="session-modal-subtitle">${config.subtitle}</p>
        </div>

        <!-- Content -->
        <div class="session-modal-body">
          <div class="session-modal-message">
            <div class="session-modal-icon">${config.icon}</div>
            <p class="session-modal-text">${this.getMessage()}</p>
          </div>

          ${this.type === 'idle-timeout' && this.countdown > 0 ? `
            <div class="session-modal-countdown">
              <p class="session-modal-countdown-label">Time Remaining:</p>
              <p class="session-modal-countdown-text" id="session-modal-countdown">${this.formatCountdown()}</p>
            </div>
          ` : ''}
        </div>

        <!-- Action Buttons -->
        <div class="session-modal-buttons">
          ${this.type === 'hard-timeout' ? `
            <button
              id="session-modal-close-btn"
              class="session-modal-btn session-modal-btn-secondary"
              onclick="SessionModal.handleCloseClick()"
            >
              Close
            </button>
          ` : ''}

          ${this.type === 'idle-timeout' ? `
            ${this.data.sessionCanBeExtended === 1 ? `
              <button
                id="session-modal-extend-btn"
                class="session-modal-btn session-modal-btn-primary"
                onclick="SessionModal.handleExtendClick()"
                ${this.isProcessing ? 'disabled' : ''}
              >
                ${this.isProcessing ? '<span class="spinner"></span> Extending...' : 'Extend Session'}
              </button>
            ` : ''}
            <button
              id="session-modal-close-btn"
              class="session-modal-btn session-modal-btn-secondary"
              onclick="SessionModal.handleCloseClick()"
              ${this.isProcessing ? 'disabled' : ''}
            >
              Close
            </button>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Gets modal configuration based on type
   */
  getModalConfig() {
    if (this.type === 'hard-timeout') {
      return {
        title: '🔐 Session Expired',
        subtitle: 'Your session has expired. You will be redirected to the home screen.',
        headerColor: '#dc2626', // Red
        icon: '🔐',
      };
    }

    if (this.type === 'idle-timeout') {
      return {
        title: '⚠️ Session Timeout Warning',
        subtitle: this.data.sessionCanBeExtended === 1
          ? 'Your session will expire soon. You can extend it or let it timeout.'
          : 'Your session will expire soon.',
        headerColor: '#f59e0b', // Orange
        icon: '⏱️',
      };
    }

    return {
      title: '⏰ Session Management',
      subtitle: 'Session timeout notification',
      headerColor: '#6b7280', // Gray
      icon: '🔐',
    };
  },

  /**
   * Gets display message from data
   */
  getMessage() {
    if (!this.data) {
      return 'Session timeout occurred.';
    }
    return this.data.message || 'Session timeout occurred.';
  },

  /**
   * Formats countdown as MM:SS
   */
  formatCountdown() {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  /**
   * Starts countdown timer
   */
  startCountdown() {
    // Clear any existing timer
    this.stopCountdown();

    console.log('SessionModal - Starting countdown:', this.countdown);

    this.countdownTimer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
        this.updateCountdownDisplay();
      } else {
        this.stopCountdown();
      }
    }, 1000);
  },

  /**
   * Stops countdown timer
   */
  stopCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  },

  /**
   * Updates countdown display in DOM
   */
  updateCountdownDisplay() {
    const countdownElement = document.getElementById('session-modal-countdown');
    if (countdownElement) {
      countdownElement.textContent = this.formatCountdown();
    }
  },

  /**
   * Handles visibility change for background/foreground tracking
   */
  handleVisibilityChange() {
    if (!this.visible) {
      return;
    }

    if (document.hidden) {
      // App going to background - record time
      this.backgroundTime = Date.now();
      console.log('SessionModal - App going to background, recording time');
    } else {
      // App returning to foreground - calculate elapsed time
      if (this.backgroundTime) {
        const elapsedSeconds = Math.floor((Date.now() - this.backgroundTime) / 1000);
        console.log(`SessionModal - App returning to foreground, elapsed: ${elapsedSeconds}s`);

        // Update countdown based on actual elapsed time
        this.countdown = Math.max(0, this.countdown - elapsedSeconds);
        console.log(`SessionModal - Countdown updated to: ${this.countdown}s`);

        this.updateCountdownDisplay();
        this.backgroundTime = null;
      }
    }
  },

  /**
   * Handles extend button click
   */
  handleExtendClick() {
    console.log('SessionModal - Extend button clicked');
    if (this.onExtendSession && !this.isProcessing) {
      this.onExtendSession();
    }
  },

  /**
   * Handles close button click
   */
  handleCloseClick() {
    console.log('SessionModal - Close button clicked');
    if (this.onDismiss && !this.isProcessing) {
      this.onDismiss();
    }
  },
};

// Initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    SessionModal.initialize();
  });
} else {
  SessionModal.initialize();
}
