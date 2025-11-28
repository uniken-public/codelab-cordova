# REL-ID Cordova Codelab: Multi-Factor Authentication

[![Cordova](https://img.shields.io/badge/Cordova-14.0.1-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.09.02-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/)
[![MFA](https://img.shields.io/badge/MFA-Enabled-orange.svg)]()
[![SPA](https://img.shields.io/badge/Architecture-SPA-purple.svg)]()

> **Codelab Step 3:** Master Multi-Factor Authentication implementation with REL-ID SDK in Cordova

This folder contains the source code for the solution of the [REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-activation-login-flow/index.html?index=..%2F..index#0)

## 🔐 What You'll Learn

In this advanced codelab, you'll master production-ready Multi-Factor Authentication patterns in **Cordova Single Page Application (SPA)** architecture:

- ✅ **User Enrollment Flow**: Complete user registration and setup process
- ✅ **Password Management**: Secure password creation and verification with policy validation
- ✅ **Activation Codes**: Handle activation code generation and validation
- ✅ **User Consent Management**: Implement privacy and consent workflows for biometric authentication
- ✅ **Dashboard Navigation**: SPA navigation with drawer menu patterns
- ✅ **Authentication Flows**: End-to-end MFA verification processes
- ✅ **SPA Architecture**: Single Page Application with persistent event handlers
- ✅ **Event-Driven Navigation**: Automatic screen routing based on SDK events

## 🎯 Learning Objectives

By completing this MFA codelab, you'll be able to:

1. **Implement complete user enrollment** with secure registration flows
2. **Build password management systems** with policy validation and verification patterns
3. **Handle activation code workflows** for user verification with resend functionality
4. **Create consent management flows** for biometric authentication (LDA) compliance
5. **Implement SPA navigation** for seamless multi-screen MFA applications
6. **Master event-driven architecture** with REL-ID SDK event handling
7. **Debug and troubleshoot MFA flows** effectively in Cordova environment
8. **Build responsive drawer menus** for post-authentication navigation

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID Basic Integration Codelab](https://codelab.uniken.com/codelabs/cordova-relid-initialization-flow/index.html?index=..%2F..index#0** - Foundation concepts required
- Understanding of Cordova application architecture and lifecycle
- Experience with multi-screen application flows
- Knowledge of authentication and security principles
- Familiarity with JavaScript ES6+ features (async/await, Promises)

## 📁 MFA Project Structure

```
relid-MFA/
├── 📱 Complete Cordova MFA App (SPA Architecture)
│   ├── platforms/              # Platform-specific builds (iOS, Android)
│   ├── plugins/                # Cordova plugins
│   │   ├── cordova-plugin-rdna/     # REL-ID SDK plugin
│   │   └── cordova-plugin-file/     # File system access
│   ├── www/                    # Web application (SPA)
│   └── config.xml              # Cordova configuration
│
├── 📦 MFA Source Architecture (SPA Pattern)
│   └── www/
│       ├── index.html          # 🆕 SINGLE HTML FILE (SPA!)
│       │                       # Contains ALL screen templates
│       │                       # All scripts loaded ONCE
│       ├── css/
│       │   └── index.css       # All styles for all screens
│       ├── js/
│       │   └── app.js          # App bootstrap (deviceready)
│       └── src/
│           ├── tutorial/       # MFA tutorial flow
│           │   ├── navigation/
│           │   │   └── NavigationService.js  # 🆕 SPA navigation (template swapping)
│           │   └── screens/
│           │       ├── mfa/    # 🆕 MFA-specific screens (6 screens)
│           │       │   ├── CheckUserScreen.js         # Username input & setUser API
│           │       │   ├── ActivationCodeScreen.js    # OTP input with resend
│           │       │   ├── SetPasswordScreen.js       # Password creation with policy
│           │       │   ├── VerifyPasswordScreen.js    # Password verification
│           │       │   ├── UserLDAConsentScreen.js    # Biometric consent
│           │       │   └── DashboardScreen.js         # Post-login with drawer
│           │       └── tutorial/  # Base tutorial screens (4 screens)
│           │           ├── TutorialHomeScreen.js
│           │           ├── TutorialSuccessScreen.js
│           │           ├── TutorialErrorScreen.js
│           │           └── SecurityExitScreen.js
│           └── uniken/         # REL-ID Integration + MTD
│               ├── AppInitializer.js  # 🆕 One-time SDK initialization
│               ├── MTDContext/        # Threat management
│               │   └── MTDThreatManager.js  # Singleton pattern
│               ├── providers/
│               │   └── SDKEventProvider.js  # Event-driven navigation
│               ├── services/          # SDK service layer
│               │   ├── rdnaService.js       # 10 MFA APIs
│               │   └── rdnaEventManager.js  # 12 SDK events
│               ├── components/
│               │   └── modals/
│               │       └── ThreatDetectionModal.js
│               └── utils/             # Helper utilities
│                   ├── connectionProfileParser.js  # 🆕 Uses cordova-plugin-file
│                   ├── passwordPolicyUtils.js      # Password validation
│                   └── progressHelper.js
│
└── 📚 Configuration
    ├── config.xml              # Cordova app configuration
    └── package.json            # Node dependencies
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-MFA

# Place the cordova-plugin-rdna plugin
# Copy RdnaClient/ folder to project root (refer to Project Structure above)

# Add platforms
cordova platform add ios
cordova platform add android

# Install required plugins
cordova plugin add cordova-plugin-file  # Required for file loading in iOS

# Verify plugins installed
cordova plugin ls
# Should show:
# - cordova-plugin-rdna
# - cordova-plugin-file

# Prepare platforms
cordova prepare

# Run the application
cordova run ios
# or
cordova run android
```

## 🏛️ SPA Architecture Benefits

This codelab uses **Single Page Application (SPA)** architecture for optimal MFA flow handling:

**Why SPA for MFA?**
- ✅ **One-time SDK initialization** - Handlers registered once in deviceready
- ✅ **Event handler persistence** - Handlers survive across all navigation
- ✅ **No re-registration needed** - MTD and SDK events work on any screen
- ✅ **Complex MFA support** - 10+ screens with cyclical validation flows
- ✅ **Faster navigation** - Template swapping vs page reloads (no white flash)
- ✅ **Easier state management** - JavaScript variables persist across screens

**SPA vs Multi-Page Architecture:**

| Aspect | Multi-Page | SPA (This Codelab) |
|--------|-----------|-------------------|
| HTML files | One per screen | ONE index.html only |
| Scripts | Duplicated in each HTML | Loaded once |
| Navigation | window.location.href (reload) | Template swap (no reload) |
| Event handlers | Re-register per screen | Register once at startup |
| SDK initialization | AppInitializer on every screen | AppInitializer ONCE |
| MTD/Session | May lose handlers | Always works |

## 🎓 Learning Checkpoints

### Checkpoint 1: MFA Flow Mastery
- [ ] I understand the complete user enrollment process with cyclical validation
- [ ] I can implement password creation and verification with policy validation
- [ ] I know how to handle activation codes with resend functionality
- [ ] I can create user consent workflows for biometric authentication (LDA)
- [ ] I understand the CheckUserScreen for user input and setUser API integration
- [ ] I can handle error messages with proper precedence (error object first, then status)

### Checkpoint 2: SPA Navigation & Architecture
- [ ] I understand SPA template-based navigation (no page reloads)
- [ ] I can implement NavigationService with content swapping
- [ ] I know how to use onContentLoaded() pattern for screen lifecycle
- [ ] I can create persistent UI elements (drawer menu, modals)
- [ ] I understand one-time SDK initialization in AppInitializer

### Checkpoint 3: Cordova Integration & Best Practices
- [ ] I know how to use cordova-plugin-file for file loading (fetch() doesn't work in iOS)
- [ ] I understand Cordova plugin callback pattern (success vs error callbacks)
- [ ] I can implement event-driven navigation with document.addEventListener
- [ ] I know how to expose screen objects to window for NavigationService
- [ ] I can handle keyboard navigation (Enter key between fields and submission)

### Checkpoint 4: Security & Production
- [ ] I know MFA security best practices
- [ ] I can implement secure password handling with policy validation
- [ ] I understand privacy and consent management for biometrics
- [ ] I can debug complex MFA workflows with proper error handling
- [ ] I can utilize password policy utilities for enhanced security
- [ ] I understand Mobile Threat Detection (MTD) integration

## 🔄 MFA Flow Sequence

This codelab demonstrates the complete MFA authentication flow:

```
1. Home Screen
   ↓ [User clicks Initialize]
2. SDK initialize() API call
   ↓ [onInitialized event]
3. SDK triggers getUser event
   ↓ [SDKEventProvider navigates to CheckUserScreen]
4. CheckUserScreen - Username Input
   ↓ [setUser API call - cyclical validation until valid]
5. SDK triggers getActivationCode OR getPassword
   ↓
6a. ActivationCodeScreen (if activation needed)
    ↓ [setActivationCode API, optional resend]
6b. SetPasswordScreen (if new password needed, challengeMode = 1)
    ↓ [setPassword API with policy validation]
    OR
    VerifyPasswordScreen (if existing password, challengeMode = 0)
    ↓ [setPassword API with attempts counter]
7. UserLDAConsentScreen (if LDA consent needed)
   ↓ [setUserConsentForLDA API]
8. SDK triggers onUserLoggedIn event
   ↓ [SDKEventProvider navigates to Dashboard]
9. DashboardScreen
   ↓ [Drawer menu with logout, session display]
```

## 📚 Key Cordova Patterns

### 1. File Loading with cordova-plugin-file

**Why needed:** Standard `fetch()` and `XMLHttpRequest` don't work with file:// URLs in iOS WKWebView.

```javascript
// ✅ CORRECT - Use cordova-plugin-file
async function loadAgentInfo() {
  return new Promise((resolve, reject) => {
    const basePath = cordova.file.applicationDirectory + 'www/';
    const filePath = basePath + 'src/uniken/cp/agent_info.json';

    window.resolveLocalFileSystemURL(filePath,
      (fileEntry) => {
        fileEntry.file((file) => {
          const reader = new FileReader();
          reader.onloadend = function() {
            const data = JSON.parse(this.result);
            resolve(data);
          };
          reader.readAsText(file);
        });
      }
    );
  });
}
```

### 2. Event Handling with document.addEventListener

```javascript
// Cordova: Use document.addEventListener
document.addEventListener('getUser', (event) => {
  const data = JSON.parse(event.response);
  if (this.getUserHandler) {
    this.getUserHandler(data);
  }
}, false);
```

### 3. SPA Screen Pattern

**Each screen is a JavaScript object with onContentLoaded():**

```javascript
const CheckUserScreen = {
  state: { username: '', error: '', isValidating: false },

  onContentLoaded(params) {
    // Called by NavigationService when screen loads
    this.setupEventListeners();
    this.processResponseData(params.responseData);
  },

  setupEventListeners() {
    // Attach DOM event handlers
    document.getElementById('set-user-btn').onclick =
      () => this.handleSetUser();
  },

  async handleSetUser() {
    await rdnaService.setUser(this.state.username);
  }
};

// Expose to window for NavigationService
window.CheckUserScreen = CheckUserScreen;
```

### 4. Cordova Plugin Callback Pattern

**Success callback always has errorCode 0:**

```javascript
// ✅ CORRECT - No error checking in success callback
com.uniken.rdnaplugin.RdnaClient.setUser(
  (response) => {
    // Success callback - always errorCode 0
    const result = JSON.parse(response);
    resolve(result);
  },
  (error) => {
    // Error callback - called on failure
    const result = JSON.parse(error);
    reject(result);
  },
  [username]
);
```

### 5. Error Handling Precedence

**Check error object FIRST, then status object:**

```javascript
// 1. Check API errors first
if (responseData.error && responseData.error.longErrorCode !== 0) {
  this.showError(responseData.error.errorString);
  return;
}

// 2. Then check status errors
if (responseData.challengeResponse.status.statusCode !== 100) {
  this.showError(responseData.challengeResponse.status.statusMessage);
  return;
}
```

## 🔧 Cordova-Specific Considerations

### Plugin API Usage
- All plugin methods return JSON strings - must use `JSON.parse()`
- Use 8-parameter initialize() (position 7 = logLevel as NUMBER, not string)
- Success callbacks always have errorCode 0 (errors go to error callback)

### Event System
- Replace `NativeEventEmitter` with `document.addEventListener`
- Event names match native code exactly
- Parse `event.response` with JSON.parse()

### Navigation
- Use template-based content swapping (NavigationService)
- NO window.location.href (causes page reload and handler loss)
- Call screen.onContentLoaded(params) for initialization

### State Management
- Use `this.state` object instead of React useState
- JavaScript variables persist in SPA (no need for localStorage)
- Drawer menu and modals are persistent DOM elements

## 🧪 Testing Guide

### Running Tests

```bash
# iOS Simulator
cordova run ios

# Android Emulator
cordova run android

# iOS Device (requires provisioning)
cordova run ios --device

# Android Device (USB debugging enabled)
cordova run android --device
```

### Debugging

**Safari Web Inspector (iOS):**
```
Safari → Develop → [Your Device] → relidCodelab
```

**Chrome DevTools (Android):**
```
chrome://inspect → Select your device
```

### Verification Checklist

- [ ] App launches without JavaScript errors
- [ ] Console shows "AppInitializer - SDK handlers successfully initialized"
- [ ] SDK version displays on home screen
- [ ] Initialize button starts SDK initialization
- [ ] Username validation works (cyclical getUser/setUser)
- [ ] Activation code accepts valid codes, shows errors for invalid codes
- [ ] Password creation validates policy requirements
- [ ] Password verification counts down attempts
- [ ] LDA consent screen shows appropriate biometric type
- [ ] Dashboard displays session information
- [ ] Drawer menu opens with menu button (☰)
- [ ] Logout works and returns to username input
- [ ] Second login works correctly (drawer logout enabled)
- [ ] All error messages display properly
- [ ] No auto-capitalization on inputs
- [ ] Enter key navigates between fields/submits

## 📚 Advanced Resources

- **REL-ID MFA Documentation**: [Multi-Factor Authentication Guide](https://developer.uniken.com/docs/mfa)
- **Cordova Documentation**: [Apache Cordova Docs](https://cordova.apache.org/docs/en/latest/)
- **cordova-plugin-file**: [File Plugin Documentation](https://github.com/apache/cordova-plugin-file)
- **SPA Patterns**: [Single Page Application Best Practices](https://developer.mozilla.org/en-US/docs/Glossary/SPA)

## 💡 Pro Tips

1. **Use SPA architecture for complex flows** - Event handlers persist, no re-initialization needed
2. **Always use cordova-plugin-file** - fetch() doesn't work reliably in iOS WKWebView
3. **Expose screens to window** - NavigationService needs `window.ScreenNameScreen = ScreenNameScreen`
4. **Initialize handlers once** - AppInitializer.initialize() called only in app.js deviceready
5. **Check error precedence** - Always check error object before status object
6. **Use JSON.stringify() for logging** - Avoid `[object Object]` in console logs
7. **Disable auto-capitalization** - Add `autocapitalize="off"` to all text inputs
8. **Test on real devices** - Touch ID, Face ID, and biometric features require physical devices
9. **Use keyboard navigation** - Enter key should move between fields or submit forms
10. **Clean callback pattern** - Success callback always has errorCode 0, no checking needed

---

**🔐 Congratulations! You've mastered Multi-Factor Authentication with REL-ID SDK in Cordova SPA architecture!**

*You're now equipped to integrate REL-ID MFA into Cordova applications with comprehensive authentication flows, persistent event handling, and seamless user experiences. Use this knowledge to build secure, user-friendly authentication systems.*
