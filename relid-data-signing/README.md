# REL-ID Cordova Codelab: Cryptographic Data Signing

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-Latest-green.svg)](https://developer.uniken.com/)
[![Data Signing](https://img.shields.io/badge/Data%20Signing-Enabled-orange.svg)]()
[![Biometric Auth](https://img.shields.io/badge/Biometric%20Auth-Level%204-purple.svg)]()
[![Step-up Authentication](https://img.shields.io/badge/Step--up%20Auth-Password%20Challenge-red.svg)]()
[![SPA Architecture](https://img.shields.io/badge/Architecture-Single%20Page%20Application-teal.svg)]()

> **Codelab Advanced:** Master cryptographic data signing with REL-ID SDK authentication levels using Single Page Application architecture

This folder contains the source code for the solution demonstrating [REL-ID Data Signing](https://codelab.uniken.com/codelabs/cordova-data-signing-flow/index.html?index=..%252F..index) using secure cryptographic authentication with multi-level biometric and password verification in a Cordova Single Page Application.

## 🔐 What You'll Learn

In this advanced data signing codelab, you'll master production-ready cryptographic signing patterns:

- ✅ **Data Signing API Integration**: `authenticateUserAndSignData()` API with authentication level handling
- ✅ **Authentication Level Mastery**: Understanding supported levels (0, 1, 4) and their security implications
- ✅ **Authenticator Type Selection**: NONE and IDV Server Biometric type implementations
- ✅ **Step-Up Authentication Flow**: Password challenges for Level 4 biometric verification
- ✅ **State Management**: `resetAuthenticateUserAndSignDataState()` for proper cleanup
- ✅ **Event-Driven Architecture**: Handle `onAuthenticateUserAndSignData` document events
- ✅ **Cryptographic Result Handling**: Signature verification and display patterns
- ✅ **SPA Architecture**: Template-based navigation without page reloads

## 🎯 Learning Objectives

By completing this Data Signing codelab, you'll be able to:

1. **Implement secure data signing workflows** with proper authentication level selection
2. **Handle multi-level authentication** from basic re-auth to step-up biometric verification
3. **Build cryptographic signing interfaces** with real-time validation and user feedback
4. **Create seamless authentication flows** with password challenges and biometric prompts
5. **Design secure state management** with proper cleanup and reset patterns
6. **Integrate data signing functionality** with existing MFA authentication workflows
7. **Debug authentication flows** and troubleshoot signing-related security issues
8. **Build Single Page Applications** with Cordova template-based navigation

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Cordova Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of authentication levels and biometric verification
- Experience with HTML5 form handling and secure input management
- Knowledge of REL-ID SDK event-driven architecture patterns
- Familiarity with cryptographic concepts and digital signatures
- Basic understanding of authentication state management and cleanup
- Understanding of Single Page Application (SPA) architecture

## 📁 Data Signing Project Structure

```
relid-data-signing/
├── 📱 Enhanced Cordova MFA + Data Signing App (SPA)
│   ├── platforms/                # Platform-specific builds
│   │   ├── android/              # Android platform
│   │   └── ios/                  # iOS platform
│   ├── plugins/                  # Cordova plugins
│   │   └── cordova-plugin-rdna/  # REL-ID Native Plugin
│
├── 📦 Data Signing Source Architecture
│   └── www/                      # Web application root (SPA)
│       ├── index.html            # Single HTML file with all templates
│       │                        # - Data signing input template
│       │                        # - Data signing result template
│       │                        # - Password challenge modal (persistent in DOM)
│       ├── css/
│       │   └── index.css         # Complete application styles
│       │                        # - Data signing form styles
│       │                        # - Password modal styles with color-coded attempts
│       ├── js/
│       │   └── app.js            # Application bootstrap (deviceready)
│       └── src/                  # Source code
│           ├── tutorial/         # Data Signing Implementation
│           │   ├── navigation/   # SPA Navigation
│           │   │   └── NavigationService.js        # Template-based navigation
│           │   │                                  # - loadTemplate() for screen loading
│           │   │                                  # - navigate() for screen transitions
│           │   ├── screens/      # Screen JavaScript modules
│           │   │   └── dataSigning/  # 🔐 Data Signing Flow
│           │   │       ├── DataSigningInputScreen.js      # 🆕 Main signing interface
│           │   │       │                                 # - Form validation and submission
│           │   │       │                                 # - Event handler registration
│           │   │       │                                 # - onAuthenticateUserAndSignData handler
│           │   │       ├── DataSigningResultScreen.js     # 🆕 Signature results display
│           │   │       │                                 # - Cryptographic signature display
│           │   │       │                                 # - Copy-to-clipboard functionality
│           │   │       │                                 # - State reset on navigation
│           │   │       └── PasswordChallengeModal.js      # 🆕 Step-up auth modal (challengeMode 12)
│           │   │                                         # - Dynamic HTML rendering with render()
│           │   │                                         # - Error and attempts display
│           │   │                                         # - Password submission handling
│           │   └── services/     # 🆕 Data Signing Service Layer
│           │       ├── DataSigningService.js              # High-level signing operations
│           │       │                                     # - signData() wrapper
│           │       │                                     # - validatePassword() validation
│           │       │                                     # - validateSigningInput() validation
│           │       │                                     # - resetState() cleanup
│           │       └── DropdownDataService.js            # Dropdown data management
│           │                                            # - getAuthLevelOptions()
│           │                                            # - getAuthenticatorTypeOptions()
│           │                                            # - convertAuthLevelToNumber()
│           │                                            # - convertAuthenticatorTypeToNumber()
│           └── uniken/           # 🛡️ Enhanced REL-ID Integration
│               ├── managers/     # 🆕 Authentication Flow Managers (SPA Pattern)
│               │   └── DataSigningSetupAuthManager.js    # ChallengeMode 12 coordinator
│               │                                        # - Context management (payload, auth params)
│               │                                        # - Modal display orchestration
│               │                                        # - Error handling from challengeResponse.status
│               │                                        # - Password submission coordination
│               ├── providers/    # Enhanced providers
│               │   └── SDKEventProvider.js           # Global event routing
│               │                                    # - Routes challengeMode 12 to manager
│               │                                    # - Handles onAuthenticateUserAndSignData
│               ├── services/     # 🆕 Enhanced SDK service layer
│               │   ├── rdnaService.js                # Added data signing APIs
│               │   │                                # - authenticateUserAndSignData()
│               │   │                                # - resetAuthenticateUserAndSignDataState()
│               │   │                                # - setPassword() for challengeMode 12
│               │   └── rdnaEventManager.js           # Complete event management
│               │                                    # - onAuthenticateUserAndSignData handler
│               │                                    # - Event listener registration
│               ├── utils/        # Helper utilities
│               │   ├── connectionProfileParser.js  # Profile configuration
│               │   └── passwordPolicyUtils.js      # Password policy helpers
│               ├── AppInitializer.js               # Centralized SDK initialization
│               └── cp/
│                   └── agent_info.json             # Connection profile configuration
│
└── 📚 Production Configuration
    ├── config.xml                # Cordova configuration
    ├── package.json              # Dependencies and Cordova platforms
    └── .gitignore
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-data-signing

# Install Cordova globally (if not already installed)
npm install -g cordova

# Add platforms
cordova platform add ios
cordova platform add android

# Install cordova-plugin-rdna (REL-ID native plugin)
# Follow your organization's plugin installation instructions

# Install cordova-plugin-file (required for loading agent_info.json)
cordova plugin add cordova-plugin-file

# Install dependencies
npm install

# Prepare platforms
cordova prepare

# Run the application
cordova run android
# or
cordova run ios
```

### Verify Data Signing Features

Once the app launches, verify these data signing capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ Data Signing input screen accessible from drawer menu
3. ✅ `authenticateUserAndSignData()` API integration with proper error handling
4. ✅ Step-up authentication flow with password challenge modal
5. ✅ Cryptographic signature generation and result display
6. ✅ Copy-to-clipboard functionality for signature fields
7. ✅ State cleanup via `resetAuthenticateUserAndSignDataState()` API
8. ✅ SPA navigation (no page reloads between screens)

## 🔑 REL-ID Authentication Level & Type Mapping

### Official REL-ID Data Signing Authentication Mapping

> **⚠️ Critical**: Not all authentication level and type combinations are supported for data signing. Only the combinations listed below are valid - all others will cause SDK errors.

| RDNAAuthLevel | RDNAAuthenticatorType | Supported Authentication | Description |
|---------------|----------------------|-------------------------|-------------|
| `NONE` (0) | `NONE` (0) | No Authentication | No authentication required - **NOT RECOMMENDED for production** |
| `RDNA_AUTH_LEVEL_1` (1) | `NONE` (0) | LDA, Device Passcode, Password | SDK auto-selects from enrolled methods |
| `RDNA_AUTH_LEVEL_2` (2) | **NOT SUPPORTED** | ❌ **SDK will error out** | Level 2 is not supported for data signing |
| `RDNA_AUTH_LEVEL_3` (3) | `RDNA_AUTH_PASS` (2) | REL-ID Manual Password | Standard security with password |
| `RDNA_AUTH_LEVEL_3` (3) | `RDNA_AUTH_LDA` (3) | REL-ID LDA (Local Device Auth) | Standard biometric signing |

> **🎯 Production Recommendation**: Use `RDNA_AUTH_LEVEL_3` (numeric value 3) with `RDNA_AUTH_LDA` (numeric value 3) or `RDNA_AUTH_PASS` (numeric value 2) for production data signing operations requiring user authentication.

### How to Use AuthLevel and AuthenticatorType

REL-ID data signing supports multiple authentication modes:

#### **1. No Authentication (Level 0)** - Testing Only
```javascript
authLevel: 0,        // NONE
authenticatorType: 0 // NONE
```
- **Use Case**: Testing environments only
- **Security**: No authentication required
- **⚠️ Warning**: Never use in production applications

#### **2. Re-Authentication (Level 1)** - Standard Documents
```javascript
authLevel: 1,        // RDNA_AUTH_LEVEL_1
authenticatorType: 0 // NONE
```
- **Use Case**: Standard document signing with flexible authentication
- **Security**: User logs in the same way they logged into the app
- **Authenticator Priority**: LDA → Device passcode → Password
- **Behavior**: REL-ID automatically selects best available authenticator

#### **3. Password Authentication (Level 3)** - Explicit Password
```javascript
authLevel: 3,        // RDNA_AUTH_LEVEL_3
authenticatorType: 2 // RDNA_AUTH_PASS
```
- **Use Case**: Document signing requiring explicit password verification
- **Security**: User must enter their REL-ID password
- **Behavior**: Always prompts for password regardless of other enrolled methods

#### **4. LDA Authentication (Level 3)** - Local Device Authentication
```javascript
authLevel: 3,        // RDNA_AUTH_LEVEL_3
authenticatorType: 3 // RDNA_AUTH_LDA
```
- **Use Case**: Biometric signing with device biometric sensors
- **Security**: Uses device Face ID, Touch ID, or Fingerprint
- **Behavior**: Prompts for device biometric authentication

## 🎓 Learning Checkpoints

### Checkpoint 1: Authentication Level & Type Understanding
- [ ] I understand the 3 supported authentication levels for data signing (0, 1, 4)
- [ ] I know why levels 2 and 3 are NOT SUPPORTED and will cause SDK errors
- [ ] I can correctly pair authentication levels with their required authenticator types
- [ ] I understand the security implications of each authentication level
- [ ] I can choose appropriate levels based on document sensitivity and compliance needs

### Checkpoint 2: Data Signing API Integration
- [ ] I can implement `authenticateUserAndSignData()` API with proper parameter handling
- [ ] I understand the sync response pattern and error handling requirements
- [ ] I know how to handle the `onAuthenticateUserAndSignData` document event
- [ ] I can implement proper input validation for payload, reason, and authentication parameters
- [ ] I understand the cryptographic signature response format and data structure

### Checkpoint 3: Step-Up Authentication Flow
- [ ] I can handle `getPassword` events triggered during Level 4 signing
- [ ] I understand when and why password challenges are presented to users
- [ ] I can implement password challenge modals with proper security considerations
- [ ] I know how to handle authentication failures and retry logic during step-up flows
- [ ] I can debug step-up authentication issues and identify failure points

### Checkpoint 4: State Management & Reset Patterns
- [ ] I can implement `resetAuthenticateUserAndSignDataState()` API for proper cleanup
- [ ] I understand when to call reset API (cancellation, errors, completion)
- [ ] I know how to manage form state and modal visibility during signing flows
- [ ] I can handle state transitions between input, authentication, and result screens
- [ ] I can implement proper error recovery with state cleanup and user guidance

### Checkpoint 5: SPA Architecture & Cordova Patterns
- [ ] I understand Single Page Application architecture with template-based navigation
- [ ] I can implement screen lifecycle with `onContentLoaded()` pattern
- [ ] I know how to use `document.addEventListener()` for SDK events
- [ ] I can manage persistent modals in the DOM with show/hide patterns
- [ ] I understand cordova-plugin-file for loading configuration files

### Checkpoint 6: Production Security & Error Handling
- [ ] I understand security best practices for data signing implementations
- [ ] I can implement comprehensive error handling for authentication and signing failures
- [ ] I know how to handle unsupported authentication combinations gracefully
- [ ] I can optimize user experience with clear status messaging and loading indicators
- [ ] I understand compliance and audit requirements for cryptographic data signing

## 🔄 Data Signing User Flow

### Scenario 1: Standard Data Signing with Level 1 (Re-Authentication)
1. **User opens drawer menu** → Taps "🔏 Data Signing" link
2. **DataSigningInputScreen loads** → Template rendered via NavigationService
3. **User fills payload and reason** → Enters document data and signing purpose
4. **User selects Level 1** → Chooses flexible authentication from dropdown
5. **User taps "Sign Data"** → `authenticateUserAndSignData()` API called with Level 1
6. **Authentication prompt appears** → Device biometric/passcode/password (automatic selection)
7. **User completes authentication** → SDK processes biometric/credential verification
8. **Signing completed** → SDK triggers `onAuthenticateUserAndSignData` document event
9. **Results displayed** → Navigation to DataSigningResultScreen with signature
10. **User reviews signature** → Cryptographic signature, ID, and metadata displayed
11. **User taps "Sign Another Document"** → `resetAuthenticateUserAndSignDataState()` called
12. **Clean state achieved** → Return to input screen for new signing operation

### Scenario 2: High-Security Signing with Level 4 (Step-up Biometric)
1. **User opens Data Signing screen** → From drawer menu navigation
2. **User fills high-value payload** → Enters sensitive document data and compliance reason
3. **User selects Level 4 + IDV Server Biometric** → Maximum security configuration
4. **User taps "Sign Data"** → `authenticateUserAndSignData()` API called
5. **Step-up authentication initiated** → SDK triggers `getPassword` document event
6. **Password challenge modal appears** → PasswordChallengeModal.show() called
7. **User enters password** → `setPassword()` API called for step-up verification
8. **Biometric prompt triggered** → Server-side biometric authentication required
9. **User completes biometric** → Fingerprint/Face ID verification with maximum security
10. **Signing completed** → SDK triggers `onAuthenticateUserAndSignData` document event
11. **Secure results displayed** → High-security signature with audit trail information

### Scenario 3: Error Handling (Unsupported Combinations, Network Issues)
1. **User selects invalid combination** → e.g., Level 2 or Level 4 with wrong authenticator type
2. **Validation error displayed** → Clear message about unsupported authentication combination
3. **User corrects selection** → Guided to valid Level 1 or Level 4 + IDV Server Biometric
4. **Network error during signing** → Connection failure during authentication or signing
5. **Error dialog with retry option** → User informed of failure with option to retry
6. **State cleanup on error** → `resetAuthenticateUserAndSignDataState()` called automatically
7. **User retry or cancel** → Option to retry with same parameters or cancel operation
8. **Graceful recovery** → Return to clean input state for new attempt

## 💡 Pro Tips

### Data Signing Implementation Best Practices
1. **Validate authentication combinations** - Always check Level + Authenticator Type compatibility before API calls
2. **Handle step-up authentication gracefully** - Provide clear user guidance during password challenges
3. **Implement proper state cleanup** - Always call `resetAuthenticateUserAndSignDataState()` on errors/cancellation
4. **Secure sensitive data display** - Never log or expose signing payloads or passwords
5. **Optimize for user experience** - Provide loading states and clear progress indicators
6. **Test all authentication paths** - Verify Level 1 flexible auth and Level 4 step-up flows
7. **Handle network failures** - Implement retry logic and graceful degradation
8. **Follow security guidelines** - Use Level 4 for high-value transactions and compliance scenarios

### Cordova-Specific Best Practices
9. **Use cordova-plugin-file for file loading** - Don't use fetch() for local files (doesn't work in iOS WKWebView)
10. **Implement SPA architecture correctly** - Scripts loaded once, event handlers registered once in AppInitializer
11. **Use JSON.stringify() for logging** - Avoid `[object Object]` in console logs
12. **Handle modal persistence** - Modals in DOM (show/hide), not dynamically created
13. **Preserve callback handlers** - Use callback preservation pattern when intercepting events
14. **Test on both platforms** - iOS and Android may behave differently with file access and biometrics

### Security & Compliance
15. **Audit signing operations** - Log signing attempts and results for security monitoring
16. **Enforce document classification** - Match authentication levels to document sensitivity
17. **Validate signature integrity** - Verify cryptographic signatures before displaying results
18. **Implement rate limiting awareness** - Handle authentication attempt limits gracefully

## 🔗 Key Implementation Files

### Core Data Signing API Implementation
```javascript
// rdnaService.js - Data Signing API
async authenticateUserAndSignData(payload, authLevel, authenticatorType, reason) {
  return new Promise((resolve, reject) => {
    console.log('RdnaService - Authenticating user and signing data:', JSON.stringify({
      payloadLength: payload?.length,
      authLevel,
      authenticatorType,
      reasonLength: reason?.length
    }, null, 2));

    com.uniken.rdnaplugin.RdnaClient.authenticateUserAndSignData(
      (response) => {
        console.log('RdnaService - AuthenticateUserAndSignData sync callback received');
        const result = JSON.parse(response);
        if (result.error && result.error.longErrorCode === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      },
      (error) => reject(JSON.parse(error)),
      [payload, authLevel, authenticatorType, reason]
    );
  });
}

async resetAuthenticateUserAndSignDataState() {
  return new Promise((resolve, reject) => {
    console.log('RdnaService - Resetting data signing authentication state');
    com.uniken.rdnaplugin.RdnaClient.resetAuthenticateUserAndSignDataState(
      (response) => {
        const result = JSON.parse(response);
        if (result.error && result.error.longErrorCode === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      },
      (error) => reject(JSON.parse(error)),
      []
    );
  });
}
```

### Event Handler Registration (SPA Pattern)
```javascript
// rdnaEventManager.js - Data Signing Event Handler
onAuthenticateUserAndSignData(event) {
  console.log("RdnaEventManager - Data signing response event received");
  try {
    let signingData;
    if (typeof event.response === 'string') {
      signingData = JSON.parse(event.response);
    } else {
      signingData = event.response;
    }
    if (this.dataSigningResponseHandler) {
      this.dataSigningResponseHandler(signingData);
    }
  } catch (error) {
    console.error("RdnaEventManager - Failed to parse data signing response:", error);
  }
}

// Register event listener in initialize() method
document.addEventListener('onAuthenticateUserAndSignData',
  this.onAuthenticateUserAndSignData.bind(this), false);
```

### SPA Screen Lifecycle Pattern
```javascript
// DataSigningInputScreen.js - SPA Lifecycle
const DataSigningInputScreen = {
  payload: '',
  selectedAuthLevel: '',
  selectedAuthenticatorType: '',
  reason: '',

  onContentLoaded(params) {
    console.log('DataSigningInputScreen - Content loaded');
    this.setupEventListeners();
    this.registerSDKEventHandlers();
    this.populateDropdowns();
  },

  setupEventListeners() {
    const submitBtn = document.getElementById('data-signing-submit-btn');
    if (submitBtn) {
      submitBtn.onclick = this.handleSubmit.bind(this);
    }
  },

  registerSDKEventHandlers() {
    const eventManager = rdnaService.getEventManager();
    eventManager.setDataSigningResponseHandler((data) => {
      this.handleDataSigningResponse(data);
    });
  }
};
```

### Authentication Level Validation Logic
```javascript
// DataSigningService.js - Authentication Combination Validation
validateSigningInput(payload, authLevel, authenticatorType, reason) {
  const errors = [];

  // Validate payload
  if (!payload || payload.trim().length === 0) {
    errors.push('Payload is required');
  } else if (payload.length > 500) {
    errors.push('Payload must be 500 characters or less');
  }

  // Validate authentication combination
  const validCombinations = [
    { level: '0', type: '0' },  // NONE + NONE
    { level: '1', type: '0' },  // LEVEL_1 + NONE
    { level: '4', type: '1' }   // LEVEL_4 + IDV_SERVER_BIOMETRIC
  ];

  const isValidCombo = validCombinations.some(combo =>
    combo.level === authLevel && combo.type === authenticatorType
  );

  if (!isValidCombo) {
    errors.push('Invalid authentication level and type combination');
  }

  // Validate reason
  if (!reason || reason.trim().length === 0) {
    errors.push('Reason is required');
  } else if (reason.length > 100) {
    errors.push('Reason must be 100 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}
```

### Manager Pattern - Error Handling from challengeResponse
```javascript
// DataSigningSetupAuthManager.js - Error Detection & Modal Update
showPasswordDialog(data) {
  console.log('DataSigningSetupAuthManager - Showing password dialog');

  if (typeof PasswordChallengeModal === 'undefined') {
    console.error('DataSigningSetupAuthManager - PasswordChallengeModal not found');
    return;
  }

  // Check for error status codes (e.g., wrong password)
  const statusCode = data.challengeResponse?.status?.statusCode;
  const statusMessage = data.challengeResponse?.status?.statusMessage || '';
  const errorMessage = statusCode !== 100 ? (statusMessage || 'Incorrect password. Please try again.') : '';

  // Check if modal is already visible (re-triggered after wrong password)
  const modal = document.getElementById('data-signing-password-modal');
  const isModalVisible = modal && modal.style.display !== 'none';

  if (isModalVisible && errorMessage) {
    // Modal already visible, update with error and new attempts count
    console.log('DataSigningSetupAuthManager - Updating modal with error:', errorMessage);
    PasswordChallengeModal.update({
      attemptsLeft: data.attemptsLeft,
      errorMessage: errorMessage,
      isSubmitting: false
    });
  } else {
    // First time showing modal
    console.log('DataSigningSetupAuthManager - Showing modal for first time');
    PasswordChallengeModal.show(data.challengeMode, data.attemptsLeft, {
      payload: this._context.payload,
      authLevel: this._context.authLevel,
      authenticatorType: this._context.authenticatorType,
      reason: this._context.reason
    });
  }
}
```

### Dynamic Rendering Pattern - Modal with Conditional Display
```javascript
// PasswordChallengeModal.js - Dynamic HTML Rendering
render() {
  const contentElement = document.getElementById('data-signing-modal-content');
  if (!contentElement) {
    console.error('PasswordChallengeModal - Content element not found');
    return;
  }

  // Get attempts color (green → orange → red)
  const attemptsColor = this.getAttemptsColor();

  // Build modal HTML with conditional rendering
  contentElement.innerHTML = `
    <!-- Header -->
    <div class="data-signing-modal-header">
      <div class="data-signing-modal-title">🔐 Authentication Required</div>
      <div class="data-signing-modal-subtitle">Please verify your password to complete data signing</div>
    </div>

    <!-- Body -->
    <div class="data-signing-modal-body">
      <!-- Attempts Counter (only show if <= 3) -->
      ${this.attemptsLeft <= 3 ? `
        <div class="data-signing-attempts-container" style="background-color: ${attemptsColor}20;">
          <div class="data-signing-attempts-text" style="color: ${attemptsColor};">
            ${this.attemptsLeft} attempt${this.attemptsLeft !== 1 ? 's' : ''} remaining
          </div>
        </div>
      ` : ''}

      <!-- Error Message (conditional) -->
      ${this.errorMessage ? `
        <div class="data-signing-error-container">
          <div class="data-signing-error-text">${this.escapeHtml(this.errorMessage)}</div>
        </div>
      ` : ''}

      <!-- Password Input -->
      <div class="data-signing-input-container">
        <label class="data-signing-input-label">Password</label>
        <input
          type="password"
          id="data-signing-password-input"
          class="data-signing-password-input"
          placeholder="Enter your password"
          ${this.isSubmitting ? 'disabled' : ''}
        />
      </div>
    </div>

    <!-- Footer Buttons -->
    <div class="data-signing-modal-footer">
      <button
        id="data-signing-password-submit-btn"
        class="data-signing-authenticate-button"
        ${this.isSubmitting ? 'disabled' : ''}
      >
        ${this.isSubmitting ? 'Authenticating...' : 'Authenticate'}
      </button>
      <button
        id="data-signing-password-cancel-btn"
        class="data-signing-cancel-button"
        ${this.isSubmitting ? 'disabled' : ''}
      >
        Cancel
      </button>
    </div>
  `;

  // Re-attach event listeners after rendering
  this.attachEventListeners();
}

getAttemptsColor() {
  if (this.attemptsLeft === 1) return '#dc2626'; // Red
  if (this.attemptsLeft === 2) return '#f59e0b'; // Orange
  return '#10b981'; // Green
}
```

### Event Flow Implementation - Complete Chain
```javascript
// Event flow: authenticateUserAndSignData() → getPassword (challengeMode 12) → onAuthenticateUserAndSignData

// 1. Initial data signing call (DataSigningInputScreen.js)
async handleSubmit() {
  console.log('DataSigningInputScreen - Submit button clicked');

  // Validate form
  const validation = DataSigningService.validateSigningInput(
    this.payload,
    this.selectedAuthLevel,
    this.selectedAuthenticatorType,
    this.reason
  );

  if (!validation.isValid) {
    const errorMessage = validation.errors.join(', ');
    this.showError(errorMessage);
    return;
  }

  // Set context in manager for challengeMode 12 handling
  DataSigningSetupAuthManager.setContext({
    payload: this.payload,
    authLevel: DropdownDataService.convertAuthLevelToNumber(this.selectedAuthLevel),
    authenticatorType: DropdownDataService.convertAuthenticatorTypeToNumber(this.selectedAuthenticatorType),
    reason: this.reason,
    userID: ''
  });

  // Call data signing API
  await DataSigningService.signData(
    this.payload,
    this.selectedAuthLevel,
    this.selectedAuthenticatorType,
    this.reason
  );
  // SDK may trigger getPassword event with challengeMode 12 for Level 4
}

// 2. Handle password challenge (SDKEventProvider.js routes to manager)
// SDKEventProvider detects challengeMode 12 and calls:
DataSigningSetupAuthManager.showPasswordDialog(data);

// 3. Manager shows modal and handles password submission
async handlePasswordSubmit(password) {
  console.log('DataSigningSetupAuthManager - Password submitted');

  try {
    // Call setPassword with challengeMode 12
    const syncResponse = await rdnaService.setPassword(password, 12);

    // If wrong password, SDK will trigger getPassword again with error status
    // If correct, SDK will process signing and trigger onAuthenticateUserAndSignData

    return syncResponse;
  } catch (error) {
    console.error('DataSigningSetupAuthManager - setPassword error:', error);
    throw error;
  }
}

// 4. Handle final signing result (DataSigningInputScreen.js)
handleDataSigningResponse(data) {
  console.log('DataSigningInputScreen - Processing data signing response');

  this.setLoading(false);

  // Hide password modal
  if (window.PasswordChallengeModal) {
    PasswordChallengeModal.hide();
  }

  // Check for errors
  if (data.error && data.error.longErrorCode !== 0) {
    const errorMessage = DataSigningService.getErrorMessage(data.error.longErrorCode);
    this.showError(errorMessage);
    DataSigningSetupAuthManager.handleError(data.error);
    return;
  }

  // Success: Navigate to result screen
  console.log('DataSigningInputScreen - Data signing successful');
  this.signingResponse = data;
  DataSigningSetupAuthManager.handleSuccess(data);

  NavigationService.navigate('DataSigningResult', {
    resultData: data
  });
}
```

---

**🔐 Congratulations! You've mastered Cryptographic Data Signing with REL-ID SDK in Cordova!**

*You're now equipped to implement secure, production-ready data signing workflows with multi-level authentication using Single Page Application architecture. Use this knowledge to create robust signing experiences that provide maximum security while maintaining excellent user experience during document authorization and high-value transaction scenarios.*
