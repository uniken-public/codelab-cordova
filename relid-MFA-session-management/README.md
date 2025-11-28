# REL-ID Cordova Codelab: Multi-Factor Authentication & Session Management

[![Cordova](https://img.shields.io/badge/Cordova-14.0.1-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.09.02-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/)
[![MFA](https://img.shields.io/badge/MFA-Enabled-orange.svg)]()
[![Session Management](https://img.shields.io/badge/Session-Management-blue.svg)]()
[![SPA](https://img.shields.io/badge/Architecture-SPA-purple.svg)]()

> **Codelab Step 3:** Master Multi-Factor Authentication and Session Management with REL-ID SDK in Cordova

This folder contains the source code for the complete solution demonstrating [REL-ID MFA and Session Management](https://codelab.uniken.com/codelabs/cordova-session-management-flow/index.html?index=..%2F..index#0)

## 🔐 What You'll Learn

In this comprehensive codelab, you'll master production-ready authentication and session management patterns with **Cordova Single Page Application (SPA)** architecture:

### Multi-Factor Authentication (MFA)
- ✅ **User Enrollment Flow**: Complete user registration with cyclical validation
- ✅ **Password Management**: Policy-based password creation and verification
- ✅ **Activation Codes**: Handle activation code generation and validation
- ✅ **Local Device Authentication (LDA)**: Biometric and device consent management

### Session Management
- ✅ **Session Timeout Handling**: Hard timeouts and idle timeout warnings with modal UI
- ✅ **Session Extension**: User-initiated session extension capabilities with API integration
- ✅ **Background/Foreground Tracking**: Accurate timer management across app states using visibilitychange
- ✅ **Modal UI Components**: Session timeout modals with countdown timers and user controls
- ✅ **Session State Management**: Global session context with Singleton patterns
- ✅ **Automatic Navigation**: Seamless navigation to home screen on session expiration

### SPA Architecture Patterns
- ✅ **One-Time SDK Initialization**: Event handlers registered once, persist forever
- ✅ **Template-Based Navigation**: Content swapping without page reloads
- ✅ **Persistent UI Elements**: Modals and drawer menus stay in DOM across navigation
- ✅ **Event-Driven Architecture**: SDK callback management with centralized event handling

## 🎯 Learning Objectives

By completing this comprehensive authentication and session management codelab, you'll be able to:

### Multi-Factor Authentication
1. **Implement cyclical user validation** with getUser/setUser event patterns
2. **Build password management systems** with dynamic policy validation
3. **Handle activation code workflows** with retry logic and verification
4. **Create LDA consent flows** with platform-specific biometric detection

### Session Management
5. **Implement session timeout systems** with hard and idle timeout handling
6. **Build session extension capabilities** with user-friendly modal interfaces and API integration
7. **Handle background/foreground transitions** with accurate timer management using visibilitychange
8. **Create session timeout modals** with countdown timers and extension controls
9. **Manage session state globally** using Singleton patterns (SessionManager)
10. **Implement automatic navigation** on session expiration with proper cleanup

### SPA Architecture & Best Practices
11. **Design SPA architecture** with one-time initialization and persistent event handlers
12. **Create template-based navigation** for seamless multi-screen flows
13. **Debug async flows** with Promise + Event callback patterns in Cordova
14. **Build production-ready applications** with comprehensive session handling and error management

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID Basic Integration Codelab](https://codelab.uniken.com/codelabs/cordova-relid-initialization-flow/index.html?index=..%2F..index#0)** - Foundation concepts required
- Understanding of Cordova application architecture and lifecycle
- Experience with multi-screen application flows and modal components
- Knowledge of authentication and session management principles
- Familiarity with JavaScript ES6+ features (async/await, Promises, singleton patterns)
- Understanding of Single Page Application (SPA) architecture

## 📁 MFA & Session Management Application Structure

```
relid-MFA-session-management/
├── 📱 Complete Cordova MFA & Session Management App (SPA Architecture)
│   ├── platforms/              # Platform-specific builds (iOS, Android)
│   ├── plugins/                # Cordova plugins
│   │   ├── cordova-plugin-rdna/     # REL-ID SDK plugin
│   │   └── cordova-plugin-file/     # File system access (required for iOS)
│   ├── www/                    # Web application (SPA)
│   └── config.xml              # Cordova configuration
│
├── 📦 MFA & Session Architecture (SPA Pattern)
│   └── www/
│       ├── index.html          # 🆕 SINGLE HTML FILE (SPA!)
│       │                       # Contains ALL screen templates
│       │                       # All scripts loaded ONCE
│       │                       # Persistent shell (drawer, modals)
│       ├── css/
│       │   └── index.css       # All styles for all screens
│       ├── js/
│       │   └── app.js          # App bootstrap (deviceready → AppInitializer)
│       └── src/
│           ├── tutorial/       # MFA tutorial flow
│           │   ├── navigation/
│           │   │   └── NavigationService.js  # 🆕 SPA navigation (template swapping)
│           │   └── screens/
│           │       ├── mfa/    # 🔐 MFA-specific screens (6 screens)
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
│           └── uniken/         # 🛡️ REL-ID Integration
│               ├── AppInitializer.js  # 🆕 One-time SDK initialization
│               ├── SessionContext/    # ⏱️ Session Management (KEY FEATURE)
│               │   └── SessionManager.js  # Global session timeout handling
│               │                      # - Hard timeout management
│               │                      # - Idle timeout warnings
│               │                      # - Session extension API
│               │                      # - Background/foreground tracking
│               ├── components/        # Session UI components
│               │   └── modals/
│               │       ├── SessionModal.js     # Session timeout modal with countdown
│               │       │                   # - Countdown timer display
│               │       │                   # - Session extension controls
│               │       │                   # - Auto-navigation on expiry
│               │       └── ThreatDetectionModal.js
│               ├── MTDContext/        # Threat management
│               │   └── MTDThreatManager.js  # Singleton pattern
│               ├── providers/
│               │   └── SDKEventProvider.js  # Event-driven navigation
│               ├── services/          # 🔧 Core SDK services
│               │   ├── rdnaService.js       # REL-ID SDK API integration
│               │   │                    # - extendSessionIdleTimeout() API
│               │   └── rdnaEventManager.js  # Centralized event management
│               │                        # - onSessionTimeout events
│               │                        # - onSessionTimeOutNotification
│               │                        # - onSessionExtensionResponse
│               └── utils/             # Helper utilities
│                   ├── connectionProfileParser.js  # 🆕 Uses cordova-plugin-file
│                   ├── passwordPolicyUtils.js      # Password validation
│                   └── progressHelper.js
│
└── 📚 Configuration
    ├── config.xml              # Cordova app configuration
    └── src/uniken/cp/
        └── agent_info.json     # Connection profile configuration
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-MFA-session-management

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

## 🎓 Learning Checkpoints

### Checkpoint 1: Multi-Factor Authentication Mastery
- [ ] I understand cyclical user validation with getUser/setUser event flow
- [ ] I can implement password creation with dynamic policy parsing and validation
- [ ] I can handle activation code workflows with retry logic
- [ ] I can create LDA consent flows with platform-specific biometric detection
- [ ] I understand the Promise + Event callback pattern for Cordova plugin integration

### Checkpoint 2: Session Management Implementation (KEY FOCUS)
- [ ] I can implement hard session timeout handling with mandatory navigation to home for SDK re-initialization
- [ ] I can create idle session timeout warnings with extension capabilities
- [ ] I can build SessionManager singleton for global session state management
- [ ] I can implement SessionModal with countdown timers and extension controls
- [ ] I understand background/foreground timer accuracy with visibilitychange event
- [ ] I can integrate `extendSessionIdleTimeout()` API with proper error handling
- [ ] I can handle session extension responses with success/failure feedback
- [ ] I can implement automatic navigation cleanup on session expiration
- [ ] I can create persistent modal divs in SPA that work across all screens

### Checkpoint 3: SPA Architecture (Cordova-Specific)
- [ ] I understand why SPA architecture is essential for session management (handlers persist)
- [ ] I can implement one-time SDK initialization in AppInitializer (called once in deviceready)
- [ ] I can create template-based navigation with NavigationService (no page reloads)
- [ ] I can implement onContentLoaded() pattern for screen lifecycle
- [ ] I can use cordova-plugin-file for file loading (fetch() doesn't work in iOS)
- [ ] I understand how persistent UI elements (modals, drawer) work in SPA

### Checkpoint 4: Production MFA & Session Applications
- [ ] I can integrate MFA and Session Management features cohesively in SPA
- [ ] I can implement proper error handling for all session events and responses
- [ ] I can create reusable session UI components and patterns
- [ ] I can build production-ready applications with comprehensive session handling
- [ ] I can debug Cordova plugin integration and event flows effectively

## Event-Driven SPA Architecture with Session Management Focus

This application demonstrates advanced REL-ID SDK integration with **Single Page Application (SPA)** architecture, emphasizing Session Management:

### Core Architecture Components

#### 🛠️ Service Layer
- **`rdnaService.js`**: Singleton service managing REL-ID SDK APIs
  - MFA APIs: `setUser()`, `setPassword()`, `setUserConsentForLDA()`, `resetAuthState()`
  - **Session API**: `extendSessionIdleTimeout()` for session extension with API response handling
  - Uses Cordova plugin API: `com.uniken.rdnaplugin.RdnaClient`
  - Returns JSON strings that must be parsed

- **`rdnaEventManager.js`**: Centralized event management with JSDoc documentation
  - Handles all SDK callbacks using `document.addEventListener`
  - **Session Event Handlers**: `onSessionTimeout`, `onSessionTimeOutNotification`, `onSessionExtensionResponse`
  - Implements idempotent initialization (safe to call multiple times)
  - Provides centralized error handling and event coordination

#### 🏗️ SPA Session Management (KEY COMPONENTS)

- **`AppInitializer.js`**: One-time SDK initialization orchestrator
  - Called ONCE in `app.js` deviceready handler
  - Initializes RdnaEventManager, SDKEventProvider, MTDThreatManager, **SessionManager**
  - Idempotent pattern (safe to call multiple times)
  - Ensures handlers persist for entire app lifecycle

- **`SessionManager.js`**: Global session timeout management (Singleton Pattern)
  - **Hard session timeouts** with mandatory navigation to home screen
  - **Idle timeout warnings** with user-friendly modal interfaces
  - **Session extension capabilities** with API integration and success/failure handling
  - **Background/foreground timer accuracy** with visibilitychange event
  - **Modal state management** with countdown timers and user controls
  - **Automatic cleanup** on session expiration with navigation coordination

- **`SessionModal.js`**: Session timeout modal UI component
  - Manages persistent div in DOM (not a template)
  - Displays countdown timer with `setInterval` (updates every second)
  - Handles background/foreground tracking with visibilitychange
  - Dynamic content rendering based on session type (hard vs idle)
  - Loading states for "Extending..." during API call

#### 🔄 Key Session Management Patterns

**Session Extension API Integration (Cordova)**
```javascript
// Session extension with proper error handling
async handleExtendSession() {
  if (this.currentOperation !== 'none') return;

  this.isProcessing = true;
  this.currentOperation = 'extend';
  SessionModal.setProcessing(true);

  try {
    await rdnaService.extendSessionIdleTimeout();
    // Success handled via onSessionExtensionResponse event
  } catch (error) {
    this.isProcessing = false;
    this.currentOperation = 'none';
    SessionModal.setProcessing(false);
    alert(`Extension Failed: ${error.error.errorString}`);
  }
}
```

**Session Event Management (Cordova)**
```javascript
// Handle session timeout events
initialize() {
  const eventManager = rdnaService.getEventManager();

  eventManager.setSessionTimeoutHandler((data) => {
    // Hard timeout - navigate to home immediately
    this.showSessionTimeout(data);
  });

  eventManager.setSessionTimeoutNotificationHandler((data) => {
    // Idle timeout warning - show extension option
    this.showSessionTimeoutNotification(data);
  });

  eventManager.setSessionExtensionResponseHandler((data) => {
    // Handle extension success/failure
    const isSuccess = data.error.longErrorCode === 0 &&
                      data.status.statusCode === 100;
    if (isSuccess) {
      this.hideSessionModal();
    } else {
      alert(`Extension Failed: ${data.error.errorString}`);
    }
  });
}
```

**SPA Navigation Pattern (Template Swapping)**
```javascript
// NavigationService - NO window.location.href!
navigate(routeName, params) {
  // Get template
  const template = document.getElementById(`${routeName}-template`);

  // Swap content
  const container = document.getElementById('app-content');
  container.innerHTML = template.content.cloneNode(true);

  // Initialize screen with params
  const screenObj = window[`${routeName}Screen`];
  if (screenObj && screenObj.onContentLoaded) {
    screenObj.onContentLoaded(params);
  }
}
```

## 🏛️ Why SPA Architecture for Session Management?

This codelab uses **Single Page Application (SPA)** architecture for optimal session management:

**SPA Benefits:**
- ✅ **One-time SDK initialization** - Handlers registered once in deviceready
- ✅ **Event handler persistence** - Session handlers work forever across all navigation
- ✅ **No re-registration needed** - SessionManager.initialize() called ONCE
- ✅ **Persistent modals** - Session modal stays in DOM, works on any screen
- ✅ **Complex session flows** - Background/foreground tracking works seamlessly
- ✅ **Faster navigation** - Template swapping vs page reloads (no white flash)
- ✅ **Global state management** - SessionManager singleton accessible anywhere

**SPA vs Multi-Page:**

| Aspect | Multi-Page | SPA (This Codelab) |
|--------|-----------|-------------------|
| HTML files | One per screen | ONE index.html only |
| Scripts | Duplicated in each HTML | Loaded once |
| Navigation | window.location.href (reload) | Template swap (no reload) |
| Event handlers | Re-register per screen | Register once at startup |
| SDK initialization | AppInitializer on every screen | AppInitializer ONCE |
| Session Management | May lose handlers/state | Always works, state persists |

## 📚 Advanced Resources

- **REL-ID MFA Documentation**: [Multi-Factor Authentication Guide](https://developer.uniken.com/docs/challenges)
- **REL-ID Session Management**: [Session Timeout Implementation Guide](https://developer.uniken.com/docs/creating-a-new-session)
- **Cordova Plugin Development**: [Plugin API Reference](https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/)
- **cordova-plugin-file**: [File System Access for iOS](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/)
- **Single Page Applications**: [SPA Architecture Patterns](https://en.wikipedia.org/wiki/Single-page_application)
- **Visibility API**: [Background/Foreground Detection](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)

## 💡 Pro Tips

### Multi-Factor Authentication
1. **Test cyclical validation flows** - Users may need multiple attempts for username/password validation
2. **Parse password policies dynamically** - Extract `RELID_PASSWORD_POLICY` from SDK challenge data
3. **Handle platform-specific biometrics** - Map authentication types correctly (Touch ID, Face ID, Fingerprint)
4. **Use cordova-plugin-file for file loading** - Standard fetch() doesn't work with file:// URLs in iOS WKWebView

### Session Management (KEY FOCUS)
5. **Distinguish session timeout types** - Hard timeouts vs idle timeout warnings require different UI patterns and user actions
6. **Implement accurate background timers** - Use visibilitychange event to track time when app goes to background/foreground
7. **Handle session extension gracefully** - Provide clear feedback for `extendSessionIdleTimeout()` success/failure with user-friendly messages
8. **Create persistent modal divs** - SessionModal is a persistent div in index.html, not a template (shown/hidden via CSS)
9. **Manage session state globally** - Use SessionManager singleton to coordinate session state across the entire app
10. **Implement countdown timers accurately** - Use setInterval with proper cleanup and background time adjustment
11. **Handle session extension API properly** - Include loading states, error handling, and operation tracking (currentOperation)
12. **Navigate automatically on timeout** - Use NavigationService.reset('TutorialHome') for clean navigation
13. **Test session scenarios thoroughly** - Test hard timeouts, idle warnings, extensions, and background/foreground transitions

### SPA Architecture (Cordova-Specific)
14. **Initialize handlers once only** - AppInitializer.initialize() called ONCE in app.js deviceready
15. **Use template-based navigation** - NavigationService swaps content, never use window.location.href
16. **Leverage idempotent patterns** - All managers (SessionManager, MTDThreatManager) safe to call multiple times
17. **Keep modals in persistent shell** - Session modal and MTD modal are permanent divs, not templates
18. **Use JSON.stringify for logging** - Objects log as [object Object] without stringify
19. **Preserve existing callbacks** - When adding new handlers, preserve original callbacks for multiple consumers
20. **Test on real devices** - Session timing and app state transitions behave differently on physical devices vs simulators

---

**🔐 Congratulations! You've mastered Multi-Factor Authentication and Session Management with REL-ID SDK in Cordova SPA architecture!**

*You're now equipped to build production-ready Cordova applications with comprehensive MFA flows and sophisticated session management. Use this knowledge to create secure, user-friendly applications that provide excellent authentication experiences while maintaining user sessions intelligently in a Single Page Application architecture.*
