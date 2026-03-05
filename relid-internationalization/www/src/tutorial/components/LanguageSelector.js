/**
 * Language Selector Component
 *
 * Modal component for selecting language from supported languages list.
 * Displays language options with native names and RTL badges.
 *
 * @fileoverview Language selection modal component
 */

const LanguageSelector = {
  /**
   * Current visible state
   * @type {boolean}
   */
  isVisible: false,

  /**
   * Callback for language selection
   * @type {Function|null}
   */
  onSelectCallback: null,

  /**
   * Callback for modal close
   * @type {Function|null}
   */
  onCloseCallback: null,

  /**
   * Show language selector modal
   *
   * @param {Object} options - Configuration options
   * @param {Function} options.onSelect - Callback when language is selected
   * @param {Function} options.onClose - Callback when modal is closed
   */
  show(options = {}) {
    console.log('LanguageSelector - Showing modal');

    this.onSelectCallback = options.onSelect || null;
    this.onCloseCallback = options.onClose || null;
    this.isVisible = true;

    // Get modal elements
    const modal = document.getElementById('language-selector-modal');
    const overlay = document.getElementById('language-selector-overlay');

    if (!modal || !overlay) {
      console.error('LanguageSelector - Modal elements not found');
      return;
    }

    // Render language options
    this.renderLanguageOptions();

    // Show modal with animation
    overlay.style.display = 'block';
    modal.style.display = 'block';

    // Trigger reflow for animation
    setTimeout(() => {
      overlay.classList.add('visible');
      modal.classList.add('visible');
    }, 10);

    // Setup event listeners
    this.setupEventListeners();
  },

  /**
   * Hide language selector modal
   */
  hide() {
    console.log('LanguageSelector - Hiding modal');

    const modal = document.getElementById('language-selector-modal');
    const overlay = document.getElementById('language-selector-overlay');

    if (!modal || !overlay) {
      return;
    }

    // Hide with animation
    overlay.classList.remove('visible');
    modal.classList.remove('visible');

    setTimeout(() => {
      overlay.style.display = 'none';
      modal.style.display = 'none';
      this.isVisible = false;

      // Call close callback
      if (this.onCloseCallback) {
        this.onCloseCallback();
      }

      // Cleanup
      this.onSelectCallback = null;
      this.onCloseCallback = null;
    }, 300); // Match CSS transition duration
  },

  /**
   * Render language options in the modal
   * @private
   */
  renderLanguageOptions() {
    const languageManager = window.LanguageManager;
    if (!languageManager) {
      console.error('LanguageSelector - LanguageManager not available');
      return;
    }

    const currentLanguage = languageManager.getCurrentLanguage();
    const supportedLanguages = languageManager.getSupportedLanguages();

    const listContainer = document.getElementById('language-selector-list');
    if (!listContainer) {
      console.error('LanguageSelector - List container not found');
      return;
    }

    // Clear existing options
    listContainer.innerHTML = '';

    // Render each language option
    supportedLanguages.forEach((language) => {
      const isSelected = currentLanguage.lang === language.lang;

      const optionEl = document.createElement('button');
      optionEl.className = 'language-option' + (isSelected ? ' selected' : '');
      optionEl.setAttribute('data-lang-code', language.lang);

      optionEl.innerHTML = `
        <div class="language-option-content">
          <div class="language-icon">🌐</div>
          <div class="language-text">
            <div class="language-name">${language.nativeName}</div>
            <div class="language-display">${language.display_text}</div>
          </div>
          ${language.isRTL ? '<div class="rtl-badge">RTL</div>' : ''}
          ${isSelected ? '<div class="selected-badge">✓</div>' : ''}
        </div>
      `;

      // Click handler
      optionEl.onclick = () => {
        this.handleLanguageSelect(language);
      };

      listContainer.appendChild(optionEl);
    });
  },

  /**
   * Handle language selection
   * @private
   * @param {Language} language - Selected language
   */
  handleLanguageSelect(language) {
    console.log('LanguageSelector - Language selected:', language.display_text);

    // Call selection callback
    if (this.onSelectCallback) {
      this.onSelectCallback(language);
    }

    // Hide modal
    this.hide();
  },

  /**
   * Setup event listeners for modal
   * @private
   */
  setupEventListeners() {
    // Close button
    const closeBtn = document.getElementById('language-selector-close');
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.hide();
      };
    }

    // Overlay click (close on outside click)
    const overlay = document.getElementById('language-selector-overlay');
    if (overlay) {
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          this.hide();
        }
      };
    }

    // Cancel button
    const cancelBtn = document.getElementById('language-selector-cancel');
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        this.hide();
      };
    }
  }
};

// Export for global access
if (typeof window !== 'undefined') {
  window.LanguageSelector = LanguageSelector;
}
