# REL-ID Cordova Codelab: Step-Up Authentication with Notifications

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/)
[![SPA](https://img.shields.io/badge/Architecture-SPA-orange.svg)](https://cordova.apache.org/)
[![Step-Up Auth](https://img.shields.io/badge/Step--Up%20Auth-Enabled-blue.svg)]()
[![Challenge Mode 3](https://img.shields.io/badge/Challenge%20Mode-3-purple.svg)]()

> **Codelab Advanced:** Master Step-Up Authentication for notification actions with REL-ID SDK in Cordova SPA architecture

This folder contains the source code for the solution demonstrating [REL-ID Step-Up Authentication](https://codelab.uniken.com/codelabs/cordova-stepup-authentication-notification-flow/index.html?index=..%2F..index#12) using secure re-authentication flows for sensitive notification actions with password and LDA verification in Cordova Single Page Application architecture.

## 🔐 What You'll Learn

In this advanced step-up authentication codelab, you'll master production-ready notification action authentication patterns in Cordova:

- ✅ **Step-Up Authentication Flow**: `updateNotification()` → SDK checks if action requires authentication → User authenticates via password or LDA
- ✅ **Password Authentication**: SDK triggers `getPassword` event with `challengeMode = 3` (RDNA_OP_AUTHORIZE_NOTIFICATION)
- ✅ **LDA Authentication**: SDK handles biometric authentication internally, no `getPassword` event
- ✅ **Notification Actions**: `getNotifications()` and `updateNotification()` APIs
- ✅ **Password Dialog UI**: Modal component with attempts counter and error handling
- ✅ **Event-Driven Flow**: `updateNotification()` → `getPassword` (if password required) → `onUpdateNotification` event
- ✅ **Error Handling**: Critical status codes (110, 153) and error code (131) with alerts before logout
- ✅ **Modular Architecture**: StepUpAuthManager for centralized state management
- ✅ **SPA Architecture**: Centralized event handling via SDKEventProvider
- ✅ **Success Flow**: Alert confirmation while staying on GetNotifications screen

## 🎯 Learning Objectives

By completing this Step-Up Authentication codelab, you'll be able to:

1. **Implement notification retrieval** with `getNotifications()` API and auto-loading
2. **Handle notification actions** using `updateNotification()` API with action parameters
3. **Manage step-up authentication** for password (challengeMode 3) and LDA verification
4. **Build modular managers** with StepUpAuthManager for centralized logic
5. **Implement centralized event handling** in SDKEventProvider for all challenge modes
6. **Create password dialog UI** with modal, attempts counter, and error display
7. **Handle context preservation** with StepUpAuthManager.setContext() pattern
8. **Clear password fields** automatically when authentication fails and retry triggers
9. **Handle critical status codes** with statusCode 110, 153 alerts before SDK logout
10. **Debug step-up auth flows** and troubleshoot modular architecture in SPA

## 🔑 Step-Up Authentication Logic

**Important**: Step-up authentication requires the user to be logged in. The authentication method used for step-up depends on how the user logged in and what authentication methods are enrolled for the app.

### Authentication Enrollment During Activation

During initial activation, users can enroll using:
- **Password only**
- **LDA (Local Device Authentication)** only - Biometric authentication (Face ID, Touch ID, Fingerprint, etc.)
- **Both Password and LDA**

Once enrolled, users can log in using either LDA or password, depending on what has been set up.

### Step-Up Authentication Flow Logic

The SDK automatically determines which authentication method to use for step-up authentication based on:
1. **How the user logged in** (Password or LDA)
2. **What authentication methods are enrolled** for the app

| Login Method | Enrolled Methods | Step-Up Authentication Method | Notes |
|--------------|------------------|-------------------------------|-------|
| Password | Password only | **Password** | SDK triggers `getPassword` with challengeMode 3 |
| LDA | LDA only | **LDA** | SDK handles biometric internally, no `getPassword` event |
| Password | Both Password & LDA | **Password** | SDK triggers `getPassword` with challengeMode 3 |
| LDA | Both Password & LDA | **LDA** (with Password fallback) | SDK attempts LDA first. If user cancels LDA, SDK directly triggers `getPassword` (no error) |

**Key Behaviors**:

- When user logs in with **Password** → Step-up uses **Password** (even if LDA is enrolled)
- When user logs in with **LDA** → Step-up uses **LDA** (with automatic Password fallback on cancellation)
- **LDA Cancellation Fallback**:
  - If **Password is enrolled**: SDK directly triggers `getPassword` event (no error, seamless fallback)
  - If **Password is NOT enrolled**: Error code 131 returned in `onUpdateNotification` event (user can retry LDA)

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID Cordova MFA Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- **[REL-ID Cordova Additional Device Activation Flow With Notifications Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-additional-device-activation-flow/index.html?index=..%2F..index#0)** - Notification retrieval and display
- Understanding of Cordova SPA architecture and template-based navigation
- Experience with JavaScript modular design patterns and singleton managers
- Knowledge of REL-ID SDK authentication challenge modes
- Familiarity with biometric authentication and LDA concepts
- Basic understanding of security best practices for re-authentication flows
- Understanding of Cordova plugin architecture and event-driven patterns

## 📁 Step-Up Authentication Project Structure

```
relid-step-up-auth-notification/
├── 📱 Enhanced Cordova Notification + Step-Up Auth App
│   ├── platforms/              # Platform-specific code (iOS, Android)
│   ├── plugins/                # Cordova plugins including REL-ID plugin
│   ├── config.xml              # Cordova configuration
│   └── www/                    # Web assets (SPA)
│
├── 📦 Step-Up Authentication Source Architecture (SPA)
│   └── www/
│       ├── index.html          # ONE HTML with all screen templates + step-up modal
│       ├── js/
│       │   └── app.js          # deviceready entry point (calls AppInitializer ONCE)
│       ├── css/
│       │   └── index.css       # Global styles + step-up modal styles
│       └── src/
│           ├── tutorial/       # Enhanced Notification + Step-Up Auth flows
│           │   ├── navigation/ # Enhanced navigation
│           │   │   └── NavigationService.js  # SPA navigation utilities
│           │   └── screens/    # Enhanced screens with step-up auth
│           │       ├── notification/ # 🆕 Notification + Step-Up Auth Management
│           │       │   ├── GetNotificationsScreen.js  # 🆕 Notification actions with step-up auth
│           │       │   └── index.js                   # Notification exports
│           │       └── mfa/    # 🔐 MFA screens
│           │           ├── DashboardScreen.js         # Dashboard
│           │           ├── CheckUserScreen.js         # User validation
│           │           └── ...                        # Other MFA screens
│           └── uniken/         # 🛡️ Enhanced REL-ID Integration
│               ├── components/ # 🆕 Enhanced UI components
│               │   └── modals/ # 🆕 Modal components
│               │       ├── StepUpPasswordDialog.js    # 🆕 Password dialog for step-up auth
│               │       ├── SessionModal.js            # Session timeout modal
│               │       └── ThreatDetectionModal.js    # MTD modal
│               ├── managers/   # 🆕 Business logic managers
│               │   ├── StepUpAuthManager.js           # 🆕 Centralized step-up auth logic
│               │   ├── SessionManager.js              # Session timeout management
│               │   └── MTDThreatManager.js            # Threat detection management
│               ├── providers/  # Enhanced providers
│               │   └── SDKEventProvider.js            # Complete event handling
│               │                                     # - getPassword (challengeMode 0-4)
│               │                                     # - onGetNotifications
│               │                                     # - onUpdateNotification
│               ├── services/   # 🆕 Enhanced SDK service layer
│               │   ├── rdnaService.js                 # Enhanced notification APIs
│               │   │                                 # - getNotifications(params)
│               │   │                                 # - updateNotification(uuid, action)
│               │   │                                 # - setPassword(password, 3)
│               │   └── rdnaEventManager.js            # Complete event management
│               │                                     # - getPassword handler (challengeMode 3)
│               │                                     # - onGetNotifications handler
│               │                                     # - onUpdateNotification handler
│               ├── cp/         # Connection Profile
│               │   └── agent_info.json                # REL-ID server configuration
│               └── utils/      # Helper utilities
│                   ├── connectionProfileParser.js     # Profile configuration
│                   └── platformHelper.js              # Platform detection
│
└── 📚 Production Configuration
    ├── package.json             # Dependencies
    ├── config.xml               # Cordova configuration
    └── README.md                # This comprehensive guide
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-step-up-auth-notification

# Install Cordova globally (if not already installed)
npm install -g cordova

# Install dependencies
npm install

# Add platforms
cordova platform add ios
cordova platform add android

# Install REL-ID plugin (replace with actual plugin path/URL)
cordova plugin add path/to/cordova-plugin-rdna

# Prepare platforms
cordova prepare

# Run the application
cordova run ios
# or
cordova run android
```

### Verify Step-Up Authentication Features

Once the app launches, verify these step-up authentication capabilities:

**Basic Step-Up Authentication Flow (Password Login)**:

1. ✅ Complete MFA flow with password and successful login to dashboard
2. ✅ Navigate to "🔔 Get Notifications" from drawer menu
3. ✅ `getNotifications()` called automatically on screen load
4. ✅ Notifications displayed with action buttons
5. ✅ Tap action button to trigger `updateNotification()` API
6. ✅ SDK triggers `getPassword` event with `challengeMode = 3` (step-up auth)
7. ✅ StepUpPasswordDialog displays with notification title, attempts counter
8. ✅ Enter incorrect password → error displays, password field clears, attempts decrease
9. ✅ Enter correct password → `onUpdateNotification` event with success
10. ✅ Success alert displayed → Stay on GetNotifications screen, refresh notification list

**Step-Up Authentication Flow (LDA Login)**:

11. ✅ Login with LDA (biometric) → Navigate to notifications screen
12. ✅ Tap action button → SDK triggers LDA prompt (no `getPassword` event)
13. ✅ Complete LDA → `onUpdateNotification` with success
14. ✅ Cancel LDA (if both Password & LDA enrolled) → SDK falls back to password dialog

**Error Handling**:

15. ✅ Critical status codes (110, 153) show alert before SDK logout
16. ✅ LDA cancellation triggers password fallback when both methods enrolled
17. ✅ Password field clears when `getPassword` triggers again after error
18. ✅ User stays on GetNotifications screen after success (no redirect to Dashboard)

## 🎓 Learning Checkpoints

### Checkpoint 1: Step-Up Authentication - Notification Actions
- [ ] I understand how `getNotifications()` retrieves notifications from REL-ID server
- [ ] I can implement `updateNotification(uuid, action)` to process user actions
- [ ] I know when SDK triggers `getPassword` with `challengeMode = 3` for step-up auth
- [ ] I can differentiate between LDA (biometric) and password step-up auth
- [ ] I understand the difference between initial authentication and step-up re-authentication
- [ ] I understand how login method (Password vs LDA) determines step-up authentication method
- [ ] I know the LDA cancellation fallback behavior (Password via `getPassword`)

### Checkpoint 2: Step-Up Authentication - Modular Architecture
- [ ] I can implement StepUpAuthManager for centralized step-up auth logic
- [ ] I understand how to separate UI (StepUpPasswordDialog) from business logic (Manager)
- [ ] I know how to use SDKEventProvider.setStepUpContext() before API calls
- [ ] I can delegate challengeMode 3 handling from SDKEventProvider to StepUpAuthManager
- [ ] I understand the benefits of modular design in SPA architecture

### Checkpoint 3: Step-Up Authentication - Password Dialog UI
- [ ] I can implement modal dialog with password input and visibility toggle
- [ ] I understand how to display attempts counter with color-coding (green→orange→red)
- [ ] I know how to show notification title/context in the dialog
- [ ] I can implement loading states during password verification
- [ ] I understand how to build persistent modals in SPA architecture

### Checkpoint 4: Step-Up Authentication - Centralized Event Handling
- [ ] I understand why SDKEventProvider handles all challenge modes (0-4) centrally
- [ ] I know how to avoid screen-level event handler complexity in SPA
- [ ] I can use StepUpAuthManager for context preservation across navigation
- [ ] I understand the difference between SPA (centralized) and multi-page (screen-level) patterns
- [ ] I know when to use managers vs screen-level state in SPA

### Checkpoint 5: Step-Up Authentication - Error Handling
- [ ] I can handle critical status codes (statusCode 110, 153) with alerts before logout
- [ ] I understand LDA cancellation (error code 131) and retry flow
- [ ] I know how to automatically clear password fields on retry via modal update
- [ ] I can display user-friendly error messages from SDK responses
- [ ] I understand when to show error vs when to trigger logout

### Checkpoint 6: Production Step-Up Authentication in SPA
- [ ] I understand security best practices for step-up authentication
- [ ] I can implement comprehensive error handling for authentication failures
- [ ] I know how to optimize user experience with modular managers
- [ ] I understand the benefits of centralized state management in SPA
- [ ] I can debug step-up auth issues with StepUpAuthManager logging

## 🔄 Step-Up Authentication User Flows

### Scenario 1: Standard Step-Up Authentication Flow (Password)
1. **User in GetNotificationsScreen** → Notifications loaded from server
2. **User selects notification action** → Tap action button
3. **Context set in StepUpAuthManager** → `StepUpAuthManager.setContext({ notification details })`
4. **User selects action** → `updateNotification(uuid, action)` called
5. **SDK requires step-up auth** → `getPassword` event triggered with `challengeMode = 3`
6. **SDKEventProvider delegates** → Calls `StepUpAuthManager.showPasswordDialog(data)`
7. **StepUpPasswordDialog displays** → Password input with notification title, attempts counter
8. **User enters password** → `StepUpAuthManager.handlePasswordSubmit(password)` called
9. **SDK verifies password** → `setPassword(password, 3)` → `onUpdateNotification` event triggered with success
10. **Success alert displayed** → User sees confirmation message
11. **Stay on GetNotifications** → Screen refreshes notification list (no navigation)
12. **Context cleared** → `StepUpAuthManager.clearContext()` called

### Scenario 2: Step-Up Authentication with Wrong Password
1. **StepUpPasswordDialog displayed** → User sees password input with attempts counter
2. **User enters wrong password** → `setPassword(wrongPassword, 3)` called
3. **SDK verification fails** → `getPassword` event triggered again with error
4. **SDKEventProvider delegates** → `StepUpAuthManager.showPasswordDialog(data)` with error
5. **Error message displayed** → Error shown in dialog (red background)
6. **Password field cleared** → `StepUpPasswordDialog.update()` clears field automatically
7. **Attempts decremented** → Attempts counter updates (e.g., "2 attempts remaining")
8. **User retries** → Repeat steps 2-7 until correct password or attempts exhausted

### Scenario 3: Step-Up Authentication - Attempts Exhausted (Critical Error)
1. **User in StepUpPasswordDialog** → Final attempt remaining
2. **User enters wrong password** → Last attempt used
3. **SDK returns critical error** → `onUpdateNotification` with statusCode 153 (attempts exhausted)
4. **Context cleared and modal hidden** → `StepUpAuthManager.clearContext()` and `hidePasswordDialog()` called
5. **Alert displayed BEFORE logout** → "Authentication Failed" alert with status message
6. **User acknowledges alert** → Tap "OK" button
7. **SDK triggers logout** → `onUserLoggedOff` event handled by SDKEventProvider
8. **Navigation to home** → User returns to login screen

### Scenario 4: Step-Up Authentication with LDA (Biometric)
1. **User logged in with LDA** → User previously authenticated using biometric
2. **Context set** → `StepUpAuthManager.setContext({ notification details })`
3. **User selects notification action** → `updateNotification(uuid, action)` called
4. **SDK triggers LDA prompt** → Biometric authentication prompt (e.g., Face ID, Fingerprint)
5. **User authenticates with biometric** → SDK verifies internally
6. **Success** → `onUpdateNotification` event with success, stay on GetNotifications screen

### Scenario 4a: Step-Up Authentication - LDA Cancelled with Password Fallback (Both Enrolled)
1. **User logged in with LDA** → User previously authenticated using biometric (both Password & LDA enrolled)
2. **Context set** → `StepUpAuthManager.setContext({ notification details })`
3. **User selects notification action** → `updateNotification(uuid, action)` called
4. **SDK triggers LDA prompt** → Biometric authentication prompt displayed
5. **User cancels LDA** → User dismisses biometric prompt
6. **SDK falls back to password** → SDK directly triggers `getPassword` event with `challengeMode = 3` (no error, no `onUpdateNotification`)
7. **SDKEventProvider delegates** → `StepUpAuthManager.showPasswordDialog(data)` called
8. **StepUpPasswordDialog displays** → Password input shown as fallback
9. **User enters password** → `setPassword(password, 3)` called
10. **Success** → `onUpdateNotification` event with success, stay on GetNotifications screen

### Scenario 4b: Step-Up Authentication - LDA Cancelled without Password Fallback (LDA Only)
1. **User logged in with LDA** → User previously authenticated using biometric (LDA only enrolled, no Password)
2. **Context set** → `StepUpAuthManager.setContext({ notification details })`
3. **User selects notification action** → `updateNotification(uuid, action)` called
4. **SDK triggers LDA prompt** → Biometric authentication prompt displayed
5. **User cancels LDA** → User dismisses biometric prompt
6. **SDK returns error** → `onUpdateNotification` event with error code 131
7. **Error alert displayed** → "Authentication Cancelled" alert shown
8. **User can retry** → User remains on GetNotifications screen, can retry action

### Scenario 5: Step-Up Authentication - Password Expired During Action
1. **User in StepUpPasswordDialog** → Password input displayed
2. **User enters password** → `setPassword(password, 3)` called
3. **SDK detects expired password** → `onUpdateNotification` with statusCode 110
4. **Alert displayed BEFORE logout** → "Authentication Failed - Password Expired" alert
5. **User acknowledges alert** → Tap "OK" button
6. **SDK triggers logout** → `onUserLoggedOff` event, navigation to home

**Important Notes - Step-Up Authentication Event Chain**:

- **challengeMode = 3**: Indicates `RDNA_OP_AUTHORIZE_NOTIFICATION` - password required for notification action
- **Authentication Method Selection**: SDK automatically chooses password or LDA based on login method and enrolled credentials
- **LDA Fallback**: When user logs in with LDA and cancels biometric, SDK automatically falls back to password via `getPassword`
- **Centralized Handling**: SDKEventProvider handles all challenge modes, delegates mode 3 to StepUpAuthManager
- **Modular Architecture**: StepUpAuthManager keeps SDKEventProvider clean and focused
- **Error Codes**:
  - `statusCode 100`: Success - action completed
  - `statusCode 110`: Password expired - show alert BEFORE SDK logout
  - `statusCode 153`: Attempts exhausted - show alert BEFORE SDK logout
  - `error code 131`: LDA cancelled and Password NOT enrolled - Allow user to retry LDA
- **Auto-Clear Password**: Modal updates with cleared password field on retry
- **Stay on Screen**: After success, user stays on GetNotifications screen (no redirect to Dashboard)

## 🏗️ Architecture Deep Dive: Modular Step-Up Authentication in SPA

### Design Decision: StepUpAuthManager vs Screen-Level Logic

The implementation uses a **modular manager pattern** (StepUpAuthManager) rather than screen-level logic. This is a deliberate architectural choice optimized for SPA:

#### ✅ Modular Manager Approach (Current Implementation)

```javascript
// StepUpAuthManager.js - Centralized business logic
const StepUpAuthManager = {
  _context: { notificationUUID, notificationTitle, ... },

  setContext(context) { /* Store notification details */ },
  showPasswordDialog(data) { /* Display modal with context */ },
  handlePasswordSubmit(password) { /* Call setPassword(password, 3) */ },
  clearContext() { /* Clean up */ }
};

// SDKEventProvider.js - Delegates to manager
handleGetPassword(data) {
  if (data.challengeMode === 3) {
    StepUpAuthManager.showPasswordDialog(data); // Delegate!
  }
  // ... other challenge modes
}

// GetNotificationsScreen.js - Just sets context
handleActionButtonClick(action) {
  StepUpAuthManager.setContext({ notification details });
  rdnaService.updateNotification(uuid, action);
}
```

**Advantages**:
1. **Single Responsibility**: Each module has one clear purpose
2. **Centralized State**: Context managed in one place, survives navigation
3. **Clean SDKEventProvider**: Just routes events, doesn't handle business logic
4. **Reusability**: StepUpAuthManager can be used by any screen needing step-up auth
5. **Testability**: Easy to unit test manager independently
6. **SPA-Friendly**: No lifecycle complexity, state persists in singleton manager
7. **Maintainability**: All step-up logic in one file (~220 lines)
8. **Scalability**: Easy to add more managers for other features

#### ❌ Screen-Level Logic Approach (Not Recommended for SPA)

```javascript
// GetNotificationsScreen.js - Complex screen-level logic
const GetNotificationsScreen = {
  stepUpContext: { ... },
  originalGetPasswordHandler: null,
  isActive: false,

  registerHandler() {
    // Preserve original handler
    this.originalGetPasswordHandler = eventManager.getPasswordHandler;

    eventManager.setGetPasswordHandler((data) => {
      if (data.challengeMode === 3 && this.isActive && this.stepUpContext) {
        this.handleStepUp(data);
      } else {
        this.originalGetPasswordHandler(data);
      }
    });
  },

  onScreenExit() { /* Complex cleanup */ }
};
```

**Disadvantages**:
1. **Lifecycle Complexity**: Need `isActive` flags and `onScreenExit()` methods
2. **Handler Conflicts**: Complex conditional logic to avoid intercepting other modes
3. **State Duplication**: Each screen would need similar step-up state
4. **Hard to Maintain**: Logic scattered, conditional routing complex
5. **Not Reusable**: Can't easily use in other screens
6. **Fights SPA**: Trying to add React-like lifecycle to SPA architecture

### Architecture Comparison Table

| Aspect | Modular Manager (✅ Current) | Screen-Level Logic (❌ Alternative) |
|--------|------------------------------|-------------------------------------|
| **State Management** | Centralized in manager | Duplicated per screen |
| **Event Handling** | Centralized in SDKEventProvider | Complex conditional in screen |
| **Lifecycle** | No lifecycle needed | Need `isActive`, `onScreenExit()` |
| **Code Lines** | Manager: 220, Screen: Clean | Screen: 300+, Complex |
| **Reusability** | Use in any screen | Copy logic to each screen |
| **Testability** | Easy to test manager | Hard to test screen logic |
| **Maintainability** | All logic in one place | Scattered across files |
| **SPA Pattern** | Embraces SPA (singletons) | Fights SPA (lifecycle) |

### Key Takeaway

**Modular managers are the recommended pattern in SPA when:**
- Logic needs to survive navigation
- Multiple screens may need the same functionality
- Centralized state management is beneficial
- You want clean separation of concerns
- Testing and maintenance are priorities

**Screen-level logic is appropriate when:**
- Logic is truly screen-specific and won't be reused
- No need for state to survive navigation
- Simple, one-off functionality

For step-up authentication in SPA, the modular manager approach is superior because it embraces SPA architecture, maintains centralized state, and keeps code clean and maintainable.

## 📚 Advanced Resources

- **REL-ID Step-Up Authentication Documentation**: [Step-Up Authentication Guide](https://developer.uniken.com/docs/stepup-authentication-for-actions)
- **REL-ID Notifications API**: [Notifications API Guide](https://developer.uniken.com/docs/notification-management)
- **REL-ID Challenge Modes**: [Understanding Challenge Modes](https://developer.uniken.com/docs/challenge-modes)
- **Cordova Documentation**: [Cordova Guides](https://cordova.apache.org/docs/en/latest/)
- **SPA Architecture**: [Single Page Application Patterns](https://developer.mozilla.org/en-US/docs/Glossary/SPA)

## 💡 Pro Tips

### Step-Up Authentication Implementation Best Practices
1. **Use modular managers** - Separate business logic from UI components
2. **Centralize event handling** - Handle all challenge modes in SDKEventProvider
3. **Set context before API calls** - Call `StepUpAuthManager.setContext()` before `updateNotification()`
4. **Clear context after completion** - Call `StepUpAuthManager.clearContext()` in response handler
5. **Show critical alerts** - Display alert BEFORE SDK triggers logout (110, 153)
6. **Handle LDA cancellation** - Allow retry when user cancels biometric (131)
7. **Display notification context** - Show notification title in password dialog
8. **Color-code attempts** - Visual feedback for remaining attempts (green→orange→red)
9. **Disable during submission** - Prevent double-submit with loading states
10. **Stay on screen after success** - Don't navigate to Dashboard, just refresh notifications

### Integration & Development in SPA
11. **Auto-load notifications** - Call `getNotifications()` in `onContentLoaded()`
12. **Use JSDoc comments** - Document parameters and return types clearly
13. **Implement comprehensive logging** - Use `JSON.stringify(data, null, 2)` for objects
14. **Test with various actions** - Ensure step-up auth works with different notification actions
15. **Monitor authentication metrics** - Track step-up auth success rates
16. **Auto-focus password field** - Focus password input when dialog appears
17. **Test LDA and password** - Verify both authentication methods work
18. **Validate action selection** - Ensure action is selected before submission
19. **Refresh notifications** - Reload notifications after successful action
20. **Embrace SPA patterns** - Use persistent singletons, avoid lifecycle complexity

### Security & Compliance
21. **Enforce step-up auth** - Never bypass step-up authentication requirements
22. **Secure password handling** - Never log or expose passwords
23. **Audit notification actions** - Log notification actions for security monitoring
24. **Handle session timeouts** - Ensure step-up auth respects session timeouts
25. **Test security scenarios** - Verify step-up auth under various attack scenarios
26. **Clear sensitive data** - Clear password field on error and cancellation
27. **Respect attempts limits** - Honor server-configured attempt limits
28. **Handle LDA fallback** - Implement password fallback when user cancels biometric (both enrolled)
29. **Test all enrollment scenarios** - Verify password-only, LDA-only, and both enrolled scenarios
30. **Respect user login method** - Step-up auth should match how user logged in (password or LDA)

## 🔗 Key Implementation Files

```javascript
// rdnaService.js - Notification APIs
async getNotifications(startIndex, maxRecords, fromDate, toDate) {
  return new Promise((resolve, reject) => {
    com.uniken.rdnaplugin.RdnaClient.getNotifications(
      (response) => {
        const parsed = JSON.parse(response);
        if (parsed.error && parsed.error.longErrorCode === 0) {
          resolve(parsed);
        } else {
          reject(parsed);
        }
      },
      (error) => reject(error),
      [startIndex, maxRecords, fromDate, toDate]
    );
  });
}

async updateNotification(notificationUuid, action) {
  return new Promise((resolve, reject) => {
    com.uniken.rdnaplugin.RdnaClient.updateNotification(
      (response) => {
        const parsed = JSON.parse(response);
        if (parsed.error && parsed.error.longErrorCode === 0) {
          resolve(parsed);
        } else {
          reject(parsed);
        }
      },
      (error) => reject(error),
      [notificationUuid, action]
    );
  });
}

async setPassword(password, challengeMode) {
  return new Promise((resolve, reject) => {
    com.uniken.rdnaplugin.RdnaClient.setPassword(
      (response) => {
        const parsed = JSON.parse(response);
        if (parsed.error && parsed.error.longErrorCode === 0) {
          resolve(parsed);
        } else {
          reject(parsed);
        }
      },
      (error) => reject(error),
      [password, challengeMode]
    );
  });
}
```

```javascript
// StepUpAuthManager.js - Modular Manager Pattern
const StepUpAuthManager = {
  _context: {
    notificationUUID: null,
    notificationTitle: '',
    notificationMessage: '',
    action: null,
    userID: '',
    sessionParams: {}
  },

  setContext(context) {
    console.log('StepUpAuthManager - Setting context:', JSON.stringify(context, null, 2));
    this._context = context;
  },

  showPasswordDialog(data) {
    // Extract error message
    const statusCode = data.challengeResponse?.status?.statusCode;
    const statusMessage = data.challengeResponse?.status?.statusMessage || '';
    const errorMessage = statusCode !== 100 ? statusMessage : '';

    // Show dialog with context
    StepUpPasswordDialog.show({
      notificationTitle: this._context.notificationTitle || 'Notification Action',
      notificationMessage: this._context.notificationMessage || '',
      userID: this._context.userID || data.userID || '',
      attemptsLeft: data.attemptsLeft,
      errorMessage: errorMessage,
      onSubmitPassword: (password) => this.handlePasswordSubmit(password),
      onCancel: () => this.handleCancel()
    });
  },

  handlePasswordSubmit(password) {
    StepUpPasswordDialog.update({ isSubmitting: true });
    rdnaService.setPassword(password, 3);
  },

  clearContext() {
    this._context = { /* reset */ };
  }
};
```

```javascript
// SDKEventProvider.js - Centralized Event Routing
const SDKEventProvider = {
  handleGetPassword(data) {
    console.log('SDKEventProvider - Get password event received, challengeMode:', data.challengeMode);

    if (data.challengeMode === 0) {
      // Verify existing password
      NavigationService.navigate('VerifyPassword', { ... });
    } else if (data.challengeMode === 1) {
      // Set new password
      NavigationService.navigate('SetPassword', { ... });
    } else if (data.challengeMode === 2) {
      // Update password (user-initiated)
      NavigationService.navigate('UpdatePassword', { ... });
    } else if (data.challengeMode === 3) {
      // Step-up authentication - Delegate to manager
      if (typeof StepUpAuthManager !== 'undefined') {
        StepUpAuthManager.showPasswordDialog(data);
      }
    } else if (data.challengeMode === 4) {
      // Update expired password
      NavigationService.navigate('UpdateExpiryPassword', { ... });
    }
  }
};
```

```javascript
// GetNotificationsScreen.js - Simple Context Setting
const GetNotificationsScreen = {
  handleActionButtonClick(actionValue) {
    const notificationUUID = this.currentNotification.notification_uuid;
    const title = this.currentNotification.body?.[0]?.subject || 'Notification Action';
    const message = this.currentNotification.body?.[0]?.message || '';

    // Set context in StepUpAuthManager (centralized state)
    if (typeof StepUpAuthManager !== 'undefined') {
      StepUpAuthManager.setContext({
        notificationUUID: notificationUUID,
        notificationTitle: title,
        notificationMessage: message,
        action: actionValue,
        userID: this.sessionParams.userID || '',
        sessionParams: this.sessionParams
      });
    }

    // Close modal and call API
    this.closeActionModal();
    this.showLoading(true);
    rdnaService.updateNotification(notificationUUID, actionValue);
  },

  handleUpdateNotificationResponse(data) {
    this.showLoading(false);

    // Clear context and hide modal via StepUpAuthManager
    if (typeof StepUpAuthManager !== 'undefined') {
      StepUpAuthManager.clearContext();
      StepUpAuthManager.hidePasswordDialog();
    }

    // Handle response (success/error)
    if (statusCode === 100) {
      alert('Success\n\n' + statusMsg);
      this.loadNotifications(); // Stay on screen, just refresh
    }
  }
};
```

```javascript
// StepUpPasswordDialog.js - UI Component
const StepUpPasswordDialog = {
  show(config) {
    this.render(); // Build modal HTML
    document.getElementById('stepup-password-modal').style.display = 'flex';
    // Auto-focus password input
    setTimeout(() => {
      document.getElementById('stepup-password-input').focus();
    }, 300);
  },

  update(updates) {
    // Update state (attemptsLeft, errorMessage, isSubmitting)
    this.render(); // Re-render with new state
    // Clear and refocus password input
    const input = document.getElementById('stepup-password-input');
    input.value = '';
    input.focus();
  },

  hide() {
    document.getElementById('stepup-password-modal').style.display = 'none';
    // Clear password input
  }
};
```

### Modular Architecture Benefits

```
┌─────────────────────────────────────────────────────────────┐
│                    SPA Architecture                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐         ┌───────────────────┐    │
│  │  SDKEventProvider    │         │ StepUpAuthManager │    │
│  │  (Event Router)      │────────>│ (Business Logic)  │    │
│  │                      │         │                   │    │
│  │ - challengeMode 0-4  │         │ - setContext()    │    │
│  │ - Delegates mode 3   │         │ - showDialog()    │    │
│  │ - Clean & focused    │         │ - handleSubmit()  │    │
│  └──────────────────────┘         │ - clearContext()  │    │
│                                   └───────────────────┘    │
│                                            │                │
│                                            v                │
│                                   ┌───────────────────┐    │
│                                   │ StepUpPassword    │    │
│                                   │ Dialog            │    │
│                                   │ (UI Component)    │    │
│                                   └───────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GetNotificationsScreen (Consumer)                   │  │
│  │                                                       │  │
│  │  handleAction() {                                    │  │
│  │    StepUpAuthManager.setContext({ details });       │  │
│  │    rdnaService.updateNotification();                │  │
│  │  }                                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**🔐 Congratulations! You've mastered Step-Up Authentication in Cordova SPA!**

*You're now equipped to implement secure step-up authentication flows with:*

- **Notification Action Security**: Re-authentication for sensitive notification actions
- **Password and LDA Support**: Both password and biometric authentication methods
- **Modular Architecture**: Clean separation with StepUpAuthManager
- **Centralized Event Handling**: SDKEventProvider delegates to appropriate managers
- **Error Handling**: Critical error alerts before SDK logout
- **User Experience**: Auto-clear password fields, attempts counter, stay on screen after success

*Use this knowledge to create secure, maintainable step-up authentication experiences that protect sensitive operations while maintaining clean SPA architecture!*
