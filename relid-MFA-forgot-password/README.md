# REL-ID Cordova Codelab: Forgot Password Management

[![Cordova](https://img.shields.io/badge/Cordova-13.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-blue.svg)](https://www.javascript.com/)
[![Forgot Password](https://img.shields.io/badge/Forgot%20Password-Enabled-orange.svg)]()
[![Verification Challenge](https://img.shields.io/badge/Verification%20Challenge-OTP%2FEmail-purple.svg)]()
[![SPA](https://img.shields.io/badge/Architecture-SPA-purple.svg)]()

> **Codelab Advanced:** Master Forgot Password workflows with REL-ID SDK verification challenges in Cordova

This folder contains the source code for the solution demonstrating [REL-ID Forgot Password Management](https://codelab.uniken.com/codelabs/cordova-forgot-password-flow/index.html?index=..%2F..index#9) using secure verification challenge-based password reset flows with **Cordova Single Page Application (SPA)** architecture.

## 🔐 What You'll Learn

In this advanced forgot password codelab, you'll master production-ready password reset patterns with **Cordova SPA architecture**:

- ✅ **Forgot Password API Integration**: `forgotPassword()` API implementation with verification challenges
- ✅ **Conditional UI Display**: Show "Forgot Password?" link only when `challengeMode = 0` and `ENABLE_FORGOT_PASSWORD = true`
- ✅ **Verification Challenge Flow**: Handle `getActivationCode` events for OTP/email verification
- ✅ **Dynamic Password Reset**: Navigate through `getUserConsentForLDA` or `getPassword` events post-verification
- ✅ **Automatic Login**: Seamless `onUserLoggedIn` event handling after successful password reset
- ✅ **Configuration-Driven**: Respect server-side forgot password feature enablement
- ✅ **Event-Driven Architecture**: Handle complete forgot password event chain in SPA

## 🎯 Learning Objectives

By completing this Forgot Password Management codelab, you'll be able to:

1. **Implement forgot password workflows** with secure verification challenge integration in Cordova
2. **Handle conditional forgot password display** based on challenge mode and server configuration
3. **Build complete password reset flows** from verification to automatic login using SPA patterns
4. **Create seamless user experiences** with loading states and error handling in template-based navigation
5. **Design event-driven password reset** with proper SDK event chain management across templates
6. **Integrate forgot password functionality** with existing MFA authentication workflows in SPA
7. **Debug forgot password flows** and troubleshoot verification-related issues in Cordova

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of password verification flows and challenge modes
- Experience with Cordova SPA architecture and template-based navigation
- Knowledge of REL-ID SDK event-driven architecture patterns
- Familiarity with activation code and OTP verification workflows
- Basic understanding of authentication state management

## 📁 Forgot Password Management Project Structure

```
relid-MFA-forgot-password/
├── 📱 Enhanced Cordova MFA + Forgot Password App (SPA Architecture)
│   ├── platforms/               # Platform-specific builds (Android/iOS)
│   ├── plugins/                 # Cordova plugins
│   │   └── cordova-plugin-rdna/ # REL-ID Cordova Plugin
│   ├── www/                     # Web application (SPA)
│   └── config.xml               # Cordova configuration
│
├── 📦 Forgot Password Source Architecture (SPA Pattern)
│   └── www/
│       ├── index.html           # 🎯 SINGLE HTML FILE (SPA Entry Point)
│       │                        # - All screens as hidden templates
│       │                        # - One-time initialization
│       │                        # - Persistent event handlers
│       │                        # Contains ALL screen templates including:
│       │                        # - VerifyPassword template (with forgot password link)
│       │                        # - SetPassword template (for password reset)
│       │                        # - ActivationCode template (for OTP verification)
│       │                        # - UserLDAConsent template (for post-reset LDA)
│       │                        # - All other MFA screen templates
│       │
│       ├── css/                 # Styling
│       │   ├── app.css          # Global application styles
│       │   ├── mfa.css          # MFA screen styles
│       │   └── components.css   # Reusable component styles
│       │
│       ├── js/                  # 🔐 Enhanced MFA + Forgot Password Logic
│       │   ├── app.js           # 🎯 SPA ORCHESTRATOR
│       │   │                    # - One-time initialization
│       │   │                    # - Template-based navigation
│       │   │                    # - Persistent state management
│       │   │
│       │   ├── init/            # Application initialization
│       │   │   └── AppInitializer.js    # SDK initialization with forgot password support
│       │   │
│       │   ├── navigation/      # SPA navigation system
│       │   │   └── NavigationService.js # Template-based navigation
│       │   │                            # - show(screenId) for template display
│       │   │                            # - back() for navigation stack
│       │   │                            # - reset() for authentication resets
│       │   │
│       │   ├── services/        # 🆕 Enhanced SDK service layer
│       │   │   ├── RdnaService.js               # Added forgot password API
│       │   │   │                                # - forgotPassword(userId)
│       │   │   │                                # - setPassword() for reset
│       │   │   │                                # - setActivationCode() for verification
│       │   │   │                                # - setUserConsentForLDA() for post-reset
│       │   │   └── RdnaEventManager.js          # Complete event management
│       │   │                                    # - getActivationCode handler
│       │   │                                    # - getPassword handler
│       │   │                                    # - getUserConsentForLDA handler
│       │   │                                    # - onUserLoggedIn handler
│       │   │
│       │   ├── screens/         # 🔐 Enhanced MFA screens + Forgot Password
│       │   │   ├── mfa/         # MFA screen controllers
│       │   │   │   ├── VerifyPasswordScreen.js  # 🆕 Password verification with forgot password link
│       │   │   │   │                            # - Conditional "Forgot Password?" display
│       │   │   │   │                            # - challengeMode = 0 detection
│       │   │   │   │                            # - ENABLE_FORGOT_PASSWORD check
│       │   │   │   │                            # - forgotPassword() API integration
│       │   │   │   ├── SetPasswordScreen.js     # Password creation for reset flow
│       │   │   │   ├── ActivationCodeScreen.js  # OTP verification for forgot password
│       │   │   │   ├── UserLDAConsentScreen.js  # LDA consent post password reset
│       │   │   │   ├── CheckUserScreen.js       # Enhanced user validation
│       │   │   │   ├── DashboardScreen.js       # Enhanced dashboard
│       │   │   │   └── ...                      # Other MFA screens
│       │   │   ├── notification/ # Notification Management System
│       │   │   │   └── GetNotificationsScreen.js # Server notification management
│       │   │   └── tutorial/    # Base tutorial screens
│       │   │
│       │   ├── utils/           # Helper utilities
│       │   │   ├── ConnectionProfileParser.js  # Profile configuration
│       │   │   ├── PasswordPolicyUtils.js      # Password validation
│       │   │   └── RdnaEventUtils.js           # Event handling utilities
│       │   │
│       │   └── providers/       # Event coordination
│       │       └── SDKEventProvider.js         # Complete event handling
│       │
│       └── agent_info.json      # Connection profile configuration
│
└── 📚 Production Configuration
    ├── package.json             # Dependencies and scripts
    └── config.xml              # Cordova platform configuration
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-MFA-forgot-password

# Install Cordova globally (if not already installed)
npm install -g cordova

# Add platforms
cordova platform add android
cordova platform add ios

# Install the REL-ID Cordova plugin
# Place cordova-plugin-rdna folder at project root, then:
cordova plugin add cordova-plugin-rdna

# Build the application
cordova build

# Run on device/emulator
cordova run android
# or
cordova run ios
```

### Verify Forgot Password Features

Once the app launches, verify these forgot password capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ VerifyPasswordScreen displays "Forgot Password?" link when `challengeMode = 0`
3. ✅ `forgotPassword()` API integration with proper error handling
4. ✅ Verification challenge flow with `getActivationCode` event handling
5. ✅ Dynamic post-verification flow (`getUserConsentForLDA` or `getPassword`)
6. ✅ Automatic login via `onUserLoggedIn` event after successful password reset

## 🎓 Learning Checkpoints

### Checkpoint 1: Forgot Password API Integration
- [ ] I understand when "Forgot Password?" link should be displayed (`challengeMode = 0` + `ENABLE_FORGOT_PASSWORD = true`)
- [ ] I can implement `forgotPassword()` API with proper sync response handling in Cordova
- [ ] I know how to check `ENABLE_FORGOT_PASSWORD` configuration from challenge info
- [ ] I can handle loading states and error scenarios during forgot password initiation
- [ ] I understand the security implications of forgot password workflows

### Checkpoint 2: Verification Challenge Flow
- [ ] I can handle `getActivationCode` events triggered after `forgotPassword()` call
- [ ] I understand OTP/email verification challenge implementation in SPA
- [ ] I can implement ActivationCodeScreen for forgot password verification
- [ ] I know how to handle verification attempts and retry logic
- [ ] I can debug verification challenge flow issues in Cordova

### Checkpoint 3: Dynamic Post-Verification Flow
- [ ] I understand the dual path after verification: `getUserConsentForLDA` OR `getPassword`
- [ ] I can handle LDA consent flow when biometric setup is required
- [ ] I can implement password reset flow when direct password change is needed
- [ ] I know how to preserve existing event handlers while adding forgot password flow
- [ ] I can manage state transitions between different post-verification scenarios in SPA

### Checkpoint 4: Complete Event Chain Management
- [ ] I can implement the complete forgot password event chain:
  - `forgotPassword()` → `getActivationCode` → verification → `getUserConsentForLDA`/`getPassword` → `onUserLoggedIn`
- [ ] I understand event callback preservation patterns for multiple flow support
- [ ] I can debug complex event chain issues and identify failure points in Cordova
- [ ] I know how to handle edge cases and error recovery in multi-step flows
- [ ] I can test forgot password flow with various server configurations

### Checkpoint 5: Production Forgot Password Management
- [ ] I understand security best practices for forgot password implementations
- [ ] I can implement comprehensive error handling for verification and reset failures
- [ ] I know how to optimize user experience with clear status messaging and guidance
- [ ] I can handle production deployment considerations for forgot password features in Cordova
- [ ] I understand compliance and audit requirements for password reset workflows

## 🔄 Forgot Password User Flow

### Scenario 1: Standard Forgot Password Flow with LDA Setup
1. **User enters VerifyPasswordScreen** → `challengeMode = 0` (password verification)
2. **"Forgot Password?" link displayed** → `ENABLE_FORGOT_PASSWORD = true` configuration active
3. **User taps "Forgot Password?"** → `forgotPassword(userId)` API called via Cordova plugin
4. **Verification challenge initiated** → SDK triggers `getActivationCode` event
5. **User receives OTP/Email** → Navigation to ActivationCodeScreen (template swap)
6. **User enters verification code** → `setActivationCode()` API called
7. **LDA consent required** → SDK triggers `getUserConsentForLDA` event
8. **User approves biometric setup** → Navigation to UserLDAConsentScreen
9. **LDA setup completed** → `setUserConsentForLDA()` API called
10. **Automatic login** → SDK triggers `onUserLoggedIn` event
11. **User reaches dashboard** → Forgot password flow completed successfully

### Scenario 2: Direct Password Reset Flow
1. **User enters VerifyPasswordScreen** → `challengeMode = 0` (password verification)
2. **"Forgot Password?" link displayed** → `ENABLE_FORGOT_PASSWORD = true` configuration active
3. **User taps "Forgot Password?"** → `forgotPassword(userId)` API called via Cordova plugin
4. **Verification challenge initiated** → SDK triggers `getActivationCode` event
5. **User receives OTP/Email** → Navigation to ActivationCodeScreen (template swap)
6. **User enters verification code** → `setActivationCode()` API called
7. **Password reset required** → SDK triggers `getPassword` event with `challengeMode = 1`
8. **User creates new password** → Navigation to SetPasswordScreen
9. **Password policy validation** → User enters password meeting policy requirements
10. **New password set** → `setPassword()` API called
11. **Automatic login** → SDK triggers `onUserLoggedIn` event
12. **User reaches dashboard** → Forgot password flow completed successfully

### Scenario 3: Forgot Password Feature Disabled
1. **User enters VerifyPasswordScreen** → `challengeMode = 0` (password verification)
2. **"Forgot Password?" link NOT displayed** → `ENABLE_FORGOT_PASSWORD = false` or not configured
3. **User must use regular password** → Standard password verification flow
4. **Alternative support channels** → User contacts support for password reset assistance

### Scenario 4: Forgot Password Error Handling
1. **User taps "Forgot Password?"** → `forgotPassword(userId)` API called via Cordova plugin
2. **Feature not supported error** → Error code 170 returned from server
3. **Error displayed to user** → "Forgot password feature is not available"
4. **Fallback to standard flow** → User must use regular password verification
5. **Support guidance provided** → Clear messaging about alternative options

## 📚 Advanced Resources

- **REL-ID Forgot Password Documentation**: [Forgot Password API Guide](https://developer.uniken.com/docs/forgot-password)
- **REL-ID Challenge Modes**: [Understanding Challenge Modes](https://developer.uniken.com/docs/challenge-modes)
- **Cordova Plugin Development**: [Cordova Plugin API](https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/)
- **Single Page Applications**: [SPA Architecture Patterns](https://en.wikipedia.org/wiki/Single-page_application)

## 💡 Pro Tips

### Forgot Password Implementation Best Practices
1. **Check configuration dynamically** - Always verify `ENABLE_FORGOT_PASSWORD` from server configuration
2. **Handle challengeMode correctly** - Only show forgot password when `challengeMode = 0` (manual password entry)
3. **Provide clear user feedback** - Display loading states and error messages during verification
4. **Implement proper error handling** - Handle Error Code 170 (feature not supported) gracefully
5. **Test verification challenges thoroughly** - Ensure OTP/email delivery and validation works correctly
6. **Design for both flow paths** - Support both LDA consent and direct password reset scenarios
7. **Preserve existing event handlers** - Use callback preservation patterns for multiple flow support
8. **Optimize user experience** - Minimize steps and provide clear guidance throughout the flow
9. **Secure sensitive operations** - Never log or expose user credentials or verification codes
10. **Test edge cases** - Network failures, invalid codes, expired sessions, server errors

### Integration & Development
11. **Preserve existing MFA flows** - Forgot password should enhance, not disrupt existing functionality
12. **Use proper JSDoc types** - Document function parameters and return types for better IDE support
13. **Implement comprehensive logging** - Log flow progress for debugging without exposing sensitive data
14. **Test with various server configurations** - Ensure forgot password works across different server setups
15. **Monitor user experience metrics** - Track forgot password success rates and identify pain points

### Security & Compliance
16. **Follow password policy guidelines** - Enforce strong password requirements during reset
17. **Implement rate limiting awareness** - Handle verification attempt limits gracefully
18. **Audit forgot password usage** - Log forgot password attempts for security monitoring
19. **Ensure secure transmission** - All forgot password communications should use secure channels
20. **Test breach scenarios** - Verify forgot password security under various attack scenarios

### SPA Architecture Best Practices (Cordova-Specific)
21. **Initialize SDK only once** - SDK initialization should happen once on deviceready event
22. **Set up persistent event handlers** - Event handlers should persist across template navigation
23. **Use template-based navigation** - Show/hide templates instead of page reloads
24. **Maintain state across templates** - Store state in JavaScript closures or global objects
25. **Clean up screen state on navigation** - Clear form inputs and error states when leaving screens
26. **Leverage Cordova callback patterns** - Success callback always has errorCode 0 in response object
27. **Use document.addEventListener for SDK events** - Cordova plugin dispatches custom events to document
28. **Test on actual devices** - Some Cordova features behave differently on emulators vs real devices

## 🔗 Key Implementation Files

### Core Forgot Password Implementation
```javascript
/**
 * RdnaService.js - Forgot Password API
 * @param {string} [userId] - Optional user ID
 * @returns {Promise<Object>} Sync response from SDK
 */
forgotPassword(userId) {
  return new Promise((resolve, reject) => {
    cordova.plugins.Rdna.forgotPassword(
      userId || '',
      (response) => {
        // Cordova callback pattern: success callback has errorCode 0
        if (response.error && response.error.longErrorCode === 0) {
          console.log('Forgot password initiated successfully:', response);
          resolve(response);
        } else {
          console.error('Forgot password error:', response);
          reject(response);
        }
      },
      (error) => {
        console.error('Forgot password plugin error:', error);
        reject(error);
      }
    );
  });
}
```

```javascript
// VerifyPasswordScreen.js - Conditional Forgot Password Link Display
const isForgotPasswordEnabled = () => {
  // Only show for challengeMode 0 (password verification)
  if (challengeMode !== 0) return false;

  // Check server configuration
  if (responseData && RdnaEventUtils.getChallengeValue) {
    const enableForgotPassword = RdnaEventUtils.getChallengeValue(
      responseData,
      'ENABLE_FORGOT_PASSWORD'
    );
    return enableForgotPassword === 'true';
  }

  // Default to true for challengeMode 0
  return true;
};

// Update UI to show/hide forgot password link
const updateForgotPasswordLinkVisibility = () => {
  const forgotPasswordButton = document.getElementById('forgotPasswordButton');
  if (isForgotPasswordEnabled()) {
    forgotPasswordButton.classList.remove('hidden');
  } else {
    forgotPasswordButton.classList.add('hidden');
  }
};

// Handle forgot password button click
const handleForgotPassword = async () => {
  try {
    // Show loading state
    showProcessing('Initiating password reset...');

    // Call forgot password API
    await RdnaService.forgotPassword(userID);

    // SDK will trigger getActivationCode event
    // Event handler will navigate to ActivationCodeScreen
  } catch (error) {
    console.error('Forgot password error:', error);

    // Handle error code 170 (feature not supported)
    if (error.error && error.error.longErrorCode === 170) {
      showError('Forgot password feature is not available');
    } else {
      showError('Failed to initiate password reset. Please try again.');
    }
  } finally {
    hideProcessing();
  }
};
```

### Event Chain Flow Implementation
```javascript
// Event flow: forgotPassword() → getActivationCode → getUserConsentForLDA/getPassword → onUserLoggedIn

// 1. Initial forgot password call (VerifyPasswordScreen.js)
const handleForgotPassword = async () => {
  try {
    await RdnaService.forgotPassword(userID);
    // SDK will trigger getActivationCode event
  } catch (error) {
    console.error('Forgot password error:', error);
  }
};

// 2. Handle verification code (ActivationCodeScreen.js)
const handleActivationCode = async (code) => {
  try {
    await RdnaService.setActivationCode(code);
    // SDK will trigger getUserConsentForLDA OR getPassword event
  } catch (error) {
    console.error('Activation code error:', error);
  }
};

// 3a. Handle LDA consent (UserLDAConsentScreen.js) - if required
const handleLDAConsent = async (consent) => {
  try {
    await RdnaService.setUserConsentForLDA(consent, challengeMode, authenticationType);
    // SDK will trigger onUserLoggedIn event
  } catch (error) {
    console.error('LDA consent error:', error);
  }
};

// 3b. Handle password reset (SetPasswordScreen.js) - if direct reset
const handlePasswordReset = async (newPassword) => {
  try {
    await RdnaService.setPassword(newPassword, 1);
    // SDK will trigger onUserLoggedIn event
  } catch (error) {
    console.error('Password reset error:', error);
  }
};
```

### SPA Event Handler Setup (Persistent Across Navigation)
```javascript
// SDKEventProvider.js - Persistent event handlers for forgot password flow
const setupForgotPasswordEventHandlers = () => {
  // Handler for verification challenge (persists across all templates)
  RdnaEventManager.setGetActivationCodeCallback((data) => {
    console.log('Verification challenge triggered:', data);
    // Navigate to ActivationCodeScreen template
    NavigationService.show('activationCodeScreen', data);
  });

  // Handler for password input (challenge mode determines flow)
  RdnaEventManager.setGetPasswordCallback((data) => {
    console.log('Password input requested:', data);

    // challengeMode 0 = password verification (show forgot password link)
    if (data.challengeMode === 0) {
      NavigationService.show('verifyPasswordScreen', data);
    }
    // challengeMode 1 = password creation (for forgot password reset)
    else if (data.challengeMode === 1) {
      NavigationService.show('setPasswordScreen', data);
    }
  });

  // Handler for LDA consent (may be triggered after forgot password verification)
  RdnaEventManager.setGetUserConsentForLDACallback((data) => {
    console.log('LDA consent requested:', data);
    NavigationService.show('userLDAConsentScreen', data);
  });

  // Handler for successful login (completes forgot password flow)
  RdnaEventManager.setUserLoggedInCallback((data) => {
    console.log('User logged in successfully:', data);
    // Navigate to dashboard, forgot password flow complete
    NavigationService.show('dashboardScreen', data);
  });
};

// Initialize event handlers ONCE on deviceready
document.addEventListener('deviceready', () => {
  AppInitializer.initialize();
  setupForgotPasswordEventHandlers();
  NavigationService.show('checkUserScreen');
});
```

### Cordova Plugin Integration Pattern
```javascript
// Cordova event listener pattern for SDK callbacks
document.addEventListener('deviceready', () => {
  // SDK is ready after deviceready event
  cordova.plugins.Rdna.initialize(config,
    (response) => {
      console.log('SDK initialized:', response);
      setupForgotPasswordEventHandlers();
    },
    (error) => {
      console.error('SDK initialization error:', error);
    }
  );
});

// Document event listeners for SDK callbacks (persist across template navigation)
document.addEventListener('rdna.getActivationCode', (event) => {
  const data = event.detail;
  console.log('getActivationCode event:', data);
  RdnaEventManager.handleGetActivationCode(data);
});

document.addEventListener('rdna.getPassword', (event) => {
  const data = event.detail;
  console.log('getPassword event:', data);
  RdnaEventManager.handleGetPassword(data);
});

document.addEventListener('rdna.getUserConsentForLDA', (event) => {
  const data = event.detail;
  console.log('getUserConsentForLDA event:', data);
  RdnaEventManager.handleGetUserConsentForLDA(data);
});

document.addEventListener('rdna.onUserLoggedIn', (event) => {
  const data = event.detail;
  console.log('onUserLoggedIn event:', data);
  RdnaEventManager.handleUserLoggedIn(data);
});
```

### Callback Preservation Pattern for Forgot Password
```javascript
// RdnaEventManager.js - Preserve existing callbacks when adding forgot password flow
const setGetPasswordCallback = (callback) => {
  // Store the new callback
  getPasswordCallback = callback;

  // Also preserve any existing handlers from other features
  // This allows forgot password to coexist with other password flows
};

const setGetActivationCodeCallback = (callback) => {
  // Store the new callback
  getActivationCodeCallback = callback;

  // Forgot password flow shares activation code handler with other features
};

// When event is received from plugin
const handleGetPassword = (data) => {
  if (getPasswordCallback) {
    getPasswordCallback(data);
  } else {
    console.warn('getPassword callback not set');
  }
};

const handleGetActivationCode = (data) => {
  if (getActivationCodeCallback) {
    getActivationCodeCallback(data);
  } else {
    console.warn('getActivationCode callback not set');
  }
};
```

---

**🔐 Congratulations! You've mastered Forgot Password Management with REL-ID SDK in Cordova SPA architecture!**

*You're now equipped to implement secure, user-friendly password reset workflows with verification challenges using Cordova's Single Page Application architecture. Use this knowledge to create seamless forgot password experiences that enhance security while providing excellent user convenience during password recovery scenarios. The persistent event handler pattern ensures your forgot password flows work seamlessly across template-based navigation, and the callback preservation pattern allows multiple authentication flows to coexist harmoniously.*
