# REL-ID Cordova Codelab: LDA Toggling Management

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/)
[![LDA Toggling](https://img.shields.io/badge/LDA%20Toggling-Enabled-orange.svg)]()
[![Authentication Modes](https://img.shields.io/badge/Authentication%20Modes-Password%2FLDA-purple.svg)]()
[![SPA Architecture](https://img.shields.io/badge/Architecture-SPA-brightgreen.svg)]()

> **Codelab Advanced:** Master LDA Toggling workflows with REL-ID SDK for seamless authentication mode switching in Cordova Single Page Application

This folder contains the source code demonstrating [REL-ID LDA Toggling Management](https://codelab.uniken.com/codelabs/cordova-lda-toggling/index.html?index=..%2F..index#0) using secure authentication mode switching between password and Local Device Authentication (LDA) in Cordova SPA architecture with unified dialog-based UX.

## 🔐 What You'll Learn

In this advanced LDA toggling codelab, you'll master production-ready authentication mode switching patterns for Cordova:

- ✅ **Device Authentication Detection**: `getDeviceAuthenticationDetails()` Cordova plugin API to retrieve supported LDA types
- ✅ **Interactive Toggle Interface**: HTML checkbox-based toggle switches with CSS styling
- ✅ **Authentication Mode Management**: `manageDeviceAuthenticationModes()` API for toggling LDA
- ✅ **Event-Driven Status Updates**: Handle `onDeviceAuthManagementStatus` with document.addEventListener
- ✅ **Unified Dialog for All Challenges**: Single LDAToggleAuthDialog handles password (modes 5, 14, 15) and consent (mode 16) - **no screen navigation!**
- ✅ **Two-Way Switching**: Enable Password → LDA and LDA → Password with seamless dialog UX
- ✅ **Cordova SPA Architecture**: Template-based navigation, one-time event handler registration, persistent modals

## 🎯 Learning Objectives

By completing this LDA Toggling Management codelab, you'll be able to:

1. **Implement LDA toggling workflows** with device authentication capability detection using Cordova plugin APIs
2. **Build interactive toggle interfaces** with vanilla JavaScript, HTML checkboxes, and CSS without React
3. **Handle authentication mode switching** from password to LDA using unified dialog approach
4. **Create dialog-based authentication UX** with single component handling all challengeModes (5, 14, 15, 16)
5. **Design event-driven LDA management** with document.addEventListener and Cordova plugin event system
6. **Integrate LDA toggling functionality** with existing MFA authentication in SPA architecture
7. **Debug LDA toggling flows** and troubleshoot Cordova-specific issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab (Cordova)](https://codelab.uniken.com/codelabs/cordova-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- **[REL-ID Forgot Password Codelab (Cordova)](https://codelab.uniken.com/codelabs/cordova-forgot-password-flow/index.html?index=..%2F..index#0)** - Understanding of challenge modes
- Understanding of password verification and LDA consent flows in Cordova
- Experience with Cordova plugin APIs (`com.uniken.rdnaplugin.RdnaClient`)
- Knowledge of document.addEventListener for event handling
- Familiarity with biometric authentication on mobile devices
- Basic understanding of SPA (Single Page Application) architecture
- Experience with JavaScript DOM manipulation

## 📁 LDA Toggling Management Project Structure (Cordova SPA)

```
relid-MFA-lda-toggling/
├── 📱 Cordova MFA + LDA Toggling App
│   ├── platforms/               # Platform-specific builds (iOS, Android)
│   ├── plugins/                 # Cordova plugins
│   │   └── cordova-plugin-rdna/ # REL-ID Cordova Plugin
│   ├── config.xml               # Cordova configuration
│   └── package.json             # Dependencies
│
├── 📦 LDA Toggling SPA Architecture (Single Page Application)
│   └── www/                     # ← ONE index.html with templates
│       ├── index.html           # Main HTML (persistent shell + templates)
│       ├── css/
│       │   └── index.css        # All styles (3000+ lines with LDA styles)
│       ├── js/
│       │   └── app.js           # App bootstrap (deviceready, AppInitializer.initialize() ONCE)
│       └── src/
│           ├── tutorial/        # Enhanced MFA + LDA Toggling flow
│           │   ├── navigation/
│           │   │   └── NavigationService.js      # SPA template-based navigation
│           │   └── screens/
│           │       ├── lda-toggling/ # 🆕 LDA Toggling (Dialog Style - Post-Login Feature)
│           │       │   ├── LDATogglingScreen.js       # 🆕 Interactive toggle interface
│           │       │   └── LDAToggleAuthDialog.js     # 🆕 Unified auth dialog (modes 5,14,15,16)
│           │       ├── mfa/          # MFA screens
│           │       ├── notification/ # Notifications
│           │       ├── updatePassword/ # Password Update
│           │       └── tutorial/     # Base tutorial
│           └── uniken/           # 🛡️ REL-ID Integration
│               ├── providers/
│               │   └── SDKEventProvider.js           # 🆕 Enhanced routing (modes 5,14,15,16)
│               ├── services/     # 🆕 Enhanced SDK service layer
│               │   ├── rdnaService.js                # Added 2 LDA APIs:
│               │   │                                 # - getDeviceAuthenticationDetails()
│               │   │                                 # - manageDeviceAuthenticationModes()
│               │   └── rdnaEventManager.js           # Added 1 LDA event handler:
│               │                                     # - setDeviceAuthManagementStatusHandler()
│               │                                     # - onDeviceAuthManagementStatus listener
│               ├── MTDContext/
│               │   └── MTDThreatManager.js
│               ├── SessionContext/
│               │   └── SessionManager.js
│               ├── components/modals/
│               │   ├── ThreatDetectionModal.js
│               │   ├── SessionModal.js
│               │   └── StepUpPasswordDialog.js
│               ├── managers/
│               │   └── StepUpAuthManager.js
│               ├── utils/
│               │   ├── connectionProfileParser.js
│               │   └── passwordPolicyUtils.js
│               ├── AppInitializer.js                 # Centralized SDK init
│               └── cp/
│                   └── agent_info.json
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-MFA-lda-toggling

# Install Cordova dependencies
npm install

# Add platforms
cordova platform add ios
cordova platform add android

# Install cordova-plugin-rdna (ensure RdnaClient/ folder exists with plugin)
cordova plugin add RdnaClient/

# Prepare platforms
cordova prepare

# Run the application
cordova run ios
# or
cordova run android
```

### Verify LDA Toggling Features

Once the app launches, verify these LDA toggling capabilities:

1. ✅ Complete MFA flow available
2. ✅ LDA Toggling screen accessible from drawer menu (🔐 LDA Toggling)
3. ✅ `getDeviceAuthenticationDetails()` retrieves available LDA types automatically
4. ✅ Interactive toggle switches display with correct enabled/disabled states
5. ✅ `manageDeviceAuthenticationModes()` API triggered on toggle
6. ✅ **Unified auth dialog** displays for all challengeModes (5, 14, 15, 16)
7. ✅ Password verification (modes 5, 15) and Set Password (mode 14) shown in dialog (no navigation)
8. ✅ LDA consent (mode 16) shown in dialog with biometric info
9. ✅ Real-time status updates via `onDeviceAuthManagementStatus` event
10. ✅ Dialog auto-closes on success, screen refreshes with updated toggle states

## 🎓 Learning Checkpoints

### Checkpoint 1: Device Authentication Detection (Cordova)
- [ ] I understand how to call `com.uniken.rdnaplugin.RdnaClient.getDeviceAuthenticationDetails()` in Cordova
- [ ] I can parse authentication capability data using `JSON.parse(response)`
- [ ] I know the different authentication type mappings (1=Biometric, 2=Face ID, 9=LDA)
- [ ] I can handle devices with no LDA capabilities (empty state)
- [ ] I can implement auto-loading in `onContentLoaded()` method (SPA pattern)

### Checkpoint 2: Authentication Mode Management
- [ ] I can call `manageDeviceAuthenticationModes(isEnabled, authType)` with Cordova plugin API
- [ ] I understand sync callback + async event pattern in Cordova
- [ ] I can show/hide loading spinners using DOM manipulation (`element.style.display`)
- [ ] I can implement HTML toggle switches with `<input type="checkbox">` + CSS `.lda-toggle-slider`
- [ ] I understand error handling for Cordova plugin errors

### Checkpoint 3: Unified Dialog for All Challenge Modes
- [ ] I understand why unified dialog is better than separate screens for LDA toggling
- [ ] I can implement dialog with two modes: 'password' (5, 14, 15) and 'consent' (16)
- [ ] I know how to show dialog with `LDAToggleAuthDialog.show(data)` from SDKEventProvider
- [ ] I can implement dialog update pattern for wrong password retries
- [ ] I can auto-hide dialog on success from LDATogglingScreen event handler

### Checkpoint 4: Event-Driven Status Updates (Cordova)
- [ ] I can register event listener: `document.addEventListener('onDeviceAuthManagementStatus', handler)`
- [ ] I understand the status data structure (userID, OpMode, ldaType, statusCode)
- [ ] I know how to differentiate between enable (OpMode=1) and disable (OpMode=0)
- [ ] I can display alerts using `alert()` for success/error messages
- [ ] I can refresh authentication details by calling `this.loadAuthenticationDetails()` after success

### Checkpoint 5: Complete LDA Toggling Flow (Dialog-Based)
- [ ] I can implement Password → LDA flow with unified dialog (mode 5 → mode 16)
- [ ] I can implement LDA → Password flow with unified dialog (mode 15 or 14)
- [ ] I understand edge cases (network failures, user cancel, device changes)
- [ ] I can implement comprehensive error handling in dialog and screen
- [ ] I can test LDA toggling with iOS and Android devices

### Checkpoint 6: Cordova SPA Architecture for LDA Toggling
- [ ] I understand why SPA is better for multi-step flows (event handlers persist)
- [ ] I can implement onContentLoaded() pattern instead of React useEffect
- [ ] I know how to preserve event handlers using callback preservation pattern
- [ ] I can implement dialog lifecycle (show → update → hide) in SPA
- [ ] I understand AppInitializer.initialize() called ONCE at app startup

## 🔄 LDA Toggling User Flow (Cordova Dialog-Based UX)

### Scenario 1: Enable Biometric Authentication (Password → LDA)
1. **User opens LDA Toggling screen** → `getDeviceAuthenticationDetails()` API called
2. **Available LDA types displayed** → List shows authentication capabilities with HTML toggle switches
3. **User toggles authentication ON** → `manageDeviceAuthenticationModes(true, authType)` API called
4. **Password verification initiated** → SDK triggers `getPassword` event with `challengeMode = 5`
5. **Unified auth dialog shown** → **LDAToggleAuthDialog displays password input (modal overlay)**
6. **User enters current password** → `setPassword(password, 5)` called from dialog
7. **Password verified** → Dialog waits for next event (doesn't hide yet)
8. **LDA consent required** → SDK triggers `getUserConsentForLDA` event with `challengeMode = 16`
9. **Dialog switches to consent mode** → **Same dialog now shows biometric consent UI**
10. **User approves biometric** → `setUserConsentForLDA(true, authType, 16)` called
11. **Status update received** → SDK triggers `onDeviceAuthManagementStatus` event (`OpMode = 1`)
12. **Dialog auto-closes** → LDATogglingScreen.handleStatus() hides dialog
13. **Success alert** → "Biometric Authentication has been enabled successfully"
14. **Toggle switch updates** → Screen refreshes, switch shows ON state
15. **User can now login with biometric** → LDA enabled!

### Scenario 2: Disable Biometric Authentication (LDA → Password)
1. **User opens LDA Toggling screen** → Authentication details loaded automatically
2. **Enabled LDA displayed** → Toggle switch shows ON state
3. **User toggles authentication OFF** → `manageDeviceAuthenticationModes(false, authType)` API called
4. **Password verification initiated** → SDK triggers `getPassword` with `challengeMode = 15` or `14`
5. **Unified auth dialog shown** → **LDAToggleAuthDialog displays password input**
6. **User enters password** → `setPassword(password, challengeMode)` called
7. **Password verified** → Dialog may switch to password creation mode if needed (mode 14)
8. **Status update received** → SDK triggers `onDeviceAuthManagementStatus` (`OpMode = 0`)
9. **Dialog auto-closes** → LDATogglingScreen.handleStatus() hides dialog
10. **Success alert** → "Biometric Authentication has been disabled successfully"
11. **Toggle switch updates** → Screen refreshes, switch shows OFF state
12. **User can now login with password** → LDA disabled!

### Scenario 3: No LDA Available
1. **User opens LDA Toggling screen** → `getDeviceAuthenticationDetails()` API called
2. **No capabilities returned** → Empty array from SDK
3. **Empty state rendered** → 🔐 icon + "No LDA Available" message
4. **Refresh button available** → User can retry
5. **Guidance provided** → Message suggests enrolling biometric in device settings

### Scenario 4: Error Handling
1. **User toggles authentication** → API called
2. **Error occurs** → Network failure or server error
3. **Error displayed** → Alert with error message
4. **Toggle returns to previous state** → No changes made
5. **User can retry** → Try again when ready

### Scenario 5: Wrong Password Retry
1. **User enters wrong password** → `setPassword()` called
2. **SDK re-triggers getPassword** → Same challengeMode, decremented attempts
3. **Dialog updates (doesn't close)** → Shows error message, updated attempts counter
4. **User can retry** → Enter password again
5. **Success or attempts exhausted** → Dialog closes or shows critical error

## 📚 Advanced Resources

- **REL-ID LDA Toggling**: [Documentation](https://developer.uniken.com/docs/lda-toggling)
- **Cordova Plugin API**: [Plugin Guide](https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/)
- **SPA Architecture**: [Single Page Apps](https://developer.mozilla.org/en-US/docs/Glossary/SPA)
- **Dialog UX Patterns**: [Modal Best Practices](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role)

## 💡 Pro Tips

### LDA Toggling Implementation (Cordova)
1. **Use unified dialog approach** - Single LDAToggleAuthDialog for all modes (simpler than 4 separate components)
2. **Place in lda-toggling folder** - Keep related files together for maintainability
3. **Parse plugin responses** - Always `JSON.parse(response)` for Cordova plugin callbacks
4. **Handle authentication type mappings** - Map numbers to names (1=Biometric, 2=Face ID, etc.)
5. **Test all challenge modes** - Verify 5, 14, 15 (password) and 16 (consent) work correctly
6. **Prevent simultaneous toggles** - Use `this.processingAuthType` flag
7. **Auto-hide dialog on success** - LDATogglingScreen should hide dialog in status handler
8. **Refresh after status update** - Call `loadAuthenticationDetails()` to get updated toggle states
9. **Handle dialog cancellation** - User can cancel, no authentication changes made
10. **Test on real devices** - Biometric features don't work in browser simulators

### Cordova SPA Architecture
11. **Event handlers registered ONCE** - AppInitializer.initialize() called in app.js deviceready
12. **Dialog persists in DOM** - Modal HTML in index.html, shown/hidden with CSS `display` property
13. **No page reloads** - NavigationService swaps templates, dialog stays in DOM
14. **Use document.addEventListener** - Not NativeEventEmitter (React Native pattern)
15. **Event handler management** - deviceAuthManagementStatusHandler specific to LDA toggling only (no preservation needed)
16. **onContentLoaded() pattern** - Screens use this instead of React's useEffect
17. **DOM state management** - Use object properties + innerHTML instead of React state
18. **Script loading order** - LDAToggleAuthDialog must load before SDKEventProvider uses it
19. **Auto-focus inputs** - Use `setTimeout(() => input.focus(), 300)` for dialog inputs
20. **Cleanup on navigation** - Call screen.cleanup() before leaving (clear event handlers and reset state)

### Security & Best Practices
21. **Validate on server** - Authentication mode changes verified server-side
22. **Secure revalidation** - Always require password or consent before mode changes
23. **Audit logging** - Log LDA toggling events for security monitoring
24. **Handle all challenge modes** - Proper routing for 5, 14, 15 (password) and 16 (consent)
25. **Test security scenarios** - Unauthorized access, session hijacking, etc.
26. **Follow platform guidelines** - iOS/Android biometric best practices
27. **Privacy compliance** - Never log biometric data
28. **Timeout handling** - Handle abandoned flows gracefully
29. **Device integrity checks** - Ensure changes on trusted devices
30. **Graceful degradation** - Support cancel without breaking user experience

## 🔗 Key Implementation Files

### Core LDA Toggling APIs (Cordova)

```javascript
// www/src/uniken/services/rdnaService.js
async getDeviceAuthenticationDetails() {
  return new Promise((resolve, reject) => {
    com.uniken.rdnaplugin.RdnaClient.getDeviceAuthenticationDetails(
      (response) => {
        const result = JSON.parse(response);
        console.log('Capabilities count:', result.authenticationCapabilities?.length);
        resolve(result);
      },
      (error) => {
        const result = JSON.parse(error);
        reject(result);
      },
      [] // No parameters
    );
  });
}

async manageDeviceAuthenticationModes(isEnabled, authType) {
  return new Promise((resolve, reject) => {
    com.uniken.rdnaplugin.RdnaClient.manageDeviceAuthenticationModes(
      (response) => {
        const result = JSON.parse(response);
        console.log('Management API called, waiting for onDeviceAuthManagementStatus event');
        resolve(result);
      },
      (error) => {
        const result = JSON.parse(error);
        reject(result);
      },
      [isEnabled, authType]
    );
  });
}
```

### Event Handler Registration (Cordova)

```javascript
// www/src/uniken/services/rdnaEventManager.js
class RdnaEventManager {
  constructor() {
    // ... other handlers
    this.deviceAuthManagementStatusHandler = null;
  }

  registerEventListeners() {
    // Register event listener
    const deviceAuthManagementStatusListener = this.onDeviceAuthManagementStatus.bind(this);
    document.addEventListener('onDeviceAuthManagementStatus', deviceAuthManagementStatusListener, false);

    // Store for cleanup
    this.listeners.push({
      name: 'onDeviceAuthManagementStatus',
      handler: deviceAuthManagementStatusListener
    });
  }

  onDeviceAuthManagementStatus(event) {
    let statusData;
    if (typeof event.response === 'string') {
      statusData = JSON.parse(event.response);
    } else {
      statusData = event.response;
    }

    console.log("Status:", JSON.stringify({
      authMode: statusData.authMode,
      statusCode: statusData.statusCode,
      OpMode: statusData.OpMode,
      ldaType: statusData.ldaType
    }, null, 2));

    if (this.deviceAuthManagementStatusHandler) {
      this.deviceAuthManagementStatusHandler(statusData);
    }
  }

  setDeviceAuthManagementStatusHandler(callback) {
    this.deviceAuthManagementStatusHandler = callback;
  }
}
```

### LDA Toggling Screen (SPA onContentLoaded Pattern)

```javascript
// www/src/tutorial/screens/lda-toggling/LDATogglingScreen.js
const LDATogglingScreen = {
  authCapabilities: [],
  processingAuthType: null,

  // Called when template loaded into DOM
  onContentLoaded(params) {
    console.log('LDATogglingScreen - Content loaded');

    // Store session info from params for drawer navigation
    this.userID = params.userID || '';
    this.sessionID = params.sessionID || '';

    this.setupEventListeners();
    this.loadAuthenticationDetails();

    // Set up event handler for auth management status (specific to LDA toggling only)
    const eventManager = rdnaService.getEventManager();
    eventManager.setDeviceAuthManagementStatusHandler(this.handleAuthManagementStatusReceived.bind(this));
  },

  async loadAuthenticationDetails() {
    this.showLoading();

    try {
      const data = await rdnaService.getDeviceAuthenticationDetails();

      if (data.error.longErrorCode !== 0) {
        this.showError(data.error.errorString);
        return;
      }

      this.authCapabilities = data.authenticationCapabilities || [];
      this.hideLoading();
      this.renderAuthCapabilities();
    } catch (error) {
      this.showError('Failed to load authentication details');
    }
  },

  async handleToggleChange(capability, newValue) {
    if (this.processingAuthType !== null) {
      return; // Prevent multiple operations
    }

    this.processingAuthType = capability.authenticationType;
    this.showProcessingForAuthType(capability.authenticationType);

    try {
      await rdnaService.manageDeviceAuthenticationModes(newValue, capability.authenticationType);
      // SDK will trigger getPassword (mode 5,14,15) or getUserConsentForLDA (mode 16)
      // SDKEventProvider will show LDAToggleAuthDialog
    } catch (error) {
      this.processingAuthType = null;
      this.hideProcessingForAuthType(capability.authenticationType);
      alert('Failed to update authentication mode');
    }
  },

  handleAuthManagementStatusReceived(data) {
    this.processingAuthType = null;

    // Hide dialog if visible
    if (LDAToggleAuthDialog.visible) {
      LDAToggleAuthDialog.hide();
    }

    if (data.statusCode === 100) {
      const opMode = data.OpMode === 1 ? 'enabled' : 'disabled';
      alert('Success: Authentication has been ' + opMode);
      this.loadAuthenticationDetails(); // Refresh
    } else {
      alert('Update Failed: ' + data.statusMessage);
      this.loadAuthenticationDetails();
    }
  },

  cleanup() {
    console.log('LDATogglingScreen - Cleaning up event handlers');

    // Clear event handler (no preservation needed - handler is specific to LDA toggling only)
    const eventManager = rdnaService.getEventManager();
    eventManager.setDeviceAuthManagementStatusHandler(null);

    // Reset state
    this.authCapabilities = [];
    this.processingAuthType = null;

    console.log('LDATogglingScreen - Cleanup completed');
  }
};
```

### Unified Auth Dialog (Handles All ChallengeModes)

```javascript
// www/src/tutorial/screens/lda-toggling/LDAToggleAuthDialog.js
const LDAToggleAuthDialog = {
  visible: false,
  mode: 'password', // 'password' or 'consent'
  challengeMode: null,

  show(data) {
    this.visible = true;
    this.challengeMode = data.challengeMode;

    // Determine mode
    if (data.challengeMode === 16) {
      this.mode = 'consent';
      this.renderConsentMode(data);
    } else {
      // Modes 5, 14, 15
      this.mode = 'password';
      this.renderPasswordMode(data);
    }

    // Show modal
    document.getElementById('lda-toggle-auth-modal').style.display = 'flex';
  },

  update(updates) {
    // Update attempts, error message, etc.
    this.attemptsLeft = updates.attemptsLeft;
    this.errorMessage = updates.errorMessage;
    this.render(); // Re-render with updated state
  },

  hide() {
    this.visible = false;
    document.getElementById('lda-toggle-auth-modal').style.display = 'none';
  },

  handleSubmit() {
    if (this.mode === 'password') {
      const password = document.getElementById('lda-auth-password-input').value;
      rdnaService.setPassword(password, this.challengeMode);
    } else {
      rdnaService.setUserConsentForLDA(true, this.ldaAuthType, this.challengeMode);
    }
  }
};
```

### SDKEventProvider Routing (Cordova Unified Dialog)

```javascript
// www/src/uniken/providers/SDKEventProvider.js
const SDKEventProvider = {
  handleGetPassword(data) {
    if (data.challengeMode === 5 || data.challengeMode === 14 || data.challengeMode === 15) {
      // LDA toggling password verification - show dialog
      if (LDAToggleAuthDialog.visible && LDAToggleAuthDialog.challengeMode === data.challengeMode) {
        // Update existing dialog (wrong password retry)
        LDAToggleAuthDialog.update({
          attemptsLeft: data.attemptsLeft,
          errorMessage: 'Incorrect password'
        });
      } else {
        // Show new dialog
        LDAToggleAuthDialog.show(data);
      }
    } else if (data.challengeMode === 0) {
      // Login verification
      NavigationService.navigate('VerifyPassword', data);
    } else if (data.challengeMode === 1) {
      // Password creation
      NavigationService.navigate('SetPassword', data);
    }
    // ... other modes
  },

  handleGetUserConsentForLDA(data) {
    if (data.challengeMode === 16) {
      // LDA toggling consent - show dialog
      LDAToggleAuthDialog.show(data);
    } else {
      // Normal LDA consent - full screen
      NavigationService.navigate('UserLDAConsent', data);
    }
  }
};
```

## 🏛️ Cordova SPA Architecture Benefits for LDA Toggling

### Why SPA + Unified Dialog?

**Multi-Page Issues:**
- ❌ Navigating to VerifyPasswordScreen loses LDA Toggling screen context
- ❌ User confused by navigation away from toggle screen
- ❌ Event handlers lost on page reload
- ❌ Need 4 separate screens for 4 challenge modes
- ❌ Hard to maintain state across navigations

**SPA + Unified Dialog Benefits:**
- ✅ **Dialog overlays LDA Toggling screen** - User never loses context
- ✅ **One component handles 4 challenge modes** - Easier to maintain
- ✅ **Event handlers persist** - Registered once at startup
- ✅ **Seamless mode switching** - Password (mode 5) → Consent (mode 16) in same dialog
- ✅ **Better UX** - No navigation, no white flash, stays on toggle screen
- ✅ **Simpler code** - LDAToggleAuthDialog replaces 4 potential components

### Architecture Comparison

| Aspect | Multi-Page | SPA with Unified Dialog |
|--------|-----------|--------------------------|
| Challenge mode 5 | Navigate to VerifyPasswordScreen | Show dialog (password mode) |
| Challenge mode 14 | Navigate to SetPasswordScreen | Show dialog (password mode) |
| Challenge mode 15 | Navigate to VerifyPasswordScreen | Show dialog (password mode) |
| Challenge mode 16 | Navigate to UserLDAConsentScreen | Show dialog (consent mode) |
| User experience | Navigate away, lose context | Stay on toggle screen, dialog overlay |
| Code complexity | 4 separate screens | 1 unified dialog |
| Event handlers | Re-register per navigation | Registered once, persist |
| State management | localStorage across pages | JavaScript object properties |
| Maintainability | Hard (scattered code) | Easy (centralized in dialog) |


## 🧪 Testing Guide

### Pre-Testing Setup

1. **Verify Plugin Installation**
```bash
cordova plugin ls
# Should show: cordova-plugin-rdna
```

2. **Check Console Logs**
```bash
# iOS
cordova run ios --device
# Check Safari Web Inspector

# Android
cordova run android --device
# Check Chrome DevTools (chrome://inspect)
```

### Testing Scenarios

#### Test 1: Device Capability Detection
```
1. Open app → Login → Open drawer
2. Click "🔐 LDA Toggling"
3. Verify console: "Getting device authentication details"
4. Verify UI: List of authentication types displayed
5. Verify toggle switches render correctly
```

#### Test 2: Enable LDA (Dialog Flow)
```
1. Find disabled authentication type
2. Toggle switch ON
3. Verify dialog appears with password input
4. Enter password
5. Verify dialog switches to consent mode (or closes if no consent needed)
6. Approve consent
7. Verify success alert
8. Verify toggle switch now ON
9. Verify no navigation occurred (stayed on LDA Toggling screen)
```

#### Test 3: Disable LDA (Dialog Flow)
```
1. Find enabled authentication type
2. Toggle switch OFF
3. Verify dialog appears with password input
4. Enter password
5. Verify success alert
6. Verify toggle switch now OFF
7. Verify stayed on LDA Toggling screen
```

#### Test 4: Wrong Password Retry
```
1. Toggle authentication
2. Enter WRONG password in dialog
3. Verify dialog updates (doesn't close)
4. Verify error message shown
5. Verify attempts counter decremented
6. Enter CORRECT password
7. Verify success
```

#### Test 5: Cancel Dialog
```
1. Toggle authentication
2. Dialog appears
3. Click Cancel button
4. Verify dialog closes
5. Verify alert: "Operation cancelled"
6. Verify toggle switch returns to original state
```

### Console Log Verification

Look for these log messages in order:

```
LDATogglingScreen - Content loaded
RdnaService - Getting device authentication details
LDATogglingScreen - Received capabilities: 2
User toggles switch...
RdnaService - Managing device authentication modes: {"isEnabled":true,"authType":1}
SDKEventProvider - LDA toggling password verification, showing dialog
LDAToggleAuthDialog - Showing dialog for challengeMode: 5
User enters password...
RdnaService - Setting password with challengeMode: 5
Password accepted...
SDKEventProvider - LDA toggling consent, showing dialog
LDAToggleAuthDialog - Showing dialog for challengeMode: 16
User approves consent...
RdnaService - Setting user consent for LDA
RdnaEventManager - Device auth management status event received
LDATogglingScreen - Auth management status success
LDAToggleAuthDialog - Hiding dialog
Success alert shown...
LDATogglingScreen - Refreshing authentication details
```

## 🐛 Debugging Common Issues

### Issue 1: Dialog Not Showing
**Symptoms**: Challenge triggered but dialog doesn't appear

**Debug Steps**:
1. Check console for "LDAToggleAuthDialog not found"
2. Verify script loaded: `<script src="src/tutorial/screens/lda-toggling/LDAToggleAuthDialog.js"></script>`
3. Verify modal HTML exists with id `lda-toggle-auth-modal`
4. Check script loading order (must load before SDKEventProvider uses it)

### Issue 2: Wrong Challenge Mode Routing
**Symptoms**: Mode 5 navigates to VerifyPasswordScreen instead of showing dialog

**Debug Steps**:
1. Check SDKEventProvider.handleGetPassword has cases for 5, 14, 15
2. Verify it calls `LDAToggleAuthDialog.show()` not `NavigationService.navigate()`
3. Check console logs for actual challengeMode value
4. Verify no other code intercepting getPassword events

### Issue 3: Toggle Not Updating After Success
**Symptoms**: Success message shown but toggle doesn't change

**Debug Steps**:
1. Verify `loadAuthenticationDetails()` called in success handler
2. Check `renderAuthCapabilities()` reads `isConfigured` correctly
3. Verify checkbox checked attribute set based on `isConfigured === 1`
4. Check no JavaScript errors preventing re-render

### Issue 4: Event Not Firing
**Symptoms**: No status event after password/consent

**Debug Steps**:
1. Check `document.addEventListener('onDeviceAuthManagementStatus', ...)` in rdnaEventManager
2. Verify event handler set in LDATogglingScreen.onContentLoaded
3. Check AppInitializer.initialize() called in app.js
4. Verify no errors in plugin initialization

### Issue 5: Dialog Doesn't Switch Modes
**Symptoms**: Password dialog (mode 5) doesn't switch to consent (mode 16)

**Debug Steps**:
1. Verify SDKEventProvider.handleGetUserConsentForLDA checks challengeMode === 16
2. Check dialog's show() method determines mode correctly
3. Verify renderConsentMode() called for mode 16
4. Check console for mode switching logs

## 🔬 Advanced Implementation Topics

### Dynamic Mode Switching in Dialog

```javascript
// Dialog can switch modes mid-flow
show(data) {
  const newMode = (data.challengeMode === 16) ? 'consent' : 'password';

  if (this.visible && this.mode !== newMode) {
    console.log('Switching dialog mode:', this.mode, '→', newMode);
  }

  this.mode = newMode;
  this.challengeMode = data.challengeMode;
  this.render();
}
```

### Event Handler Management for LDA Toggling

```javascript
// LDATogglingScreen: No callback preservation needed
// deviceAuthManagementStatusHandler is specific to LDA toggling only
onContentLoaded(params) {
  const eventManager = rdnaService.getEventManager();

  // Set handler directly (no preservation needed)
  eventManager.setDeviceAuthManagementStatusHandler(this.handleStatus.bind(this));
}

cleanup() {
  // Clear handler when leaving screen
  const eventManager = rdnaService.getEventManager();
  eventManager.setDeviceAuthManagementStatusHandler(null);

  // Reset state
  this.authCapabilities = [];
  this.processingAuthType = null;
}

// Note: Callback preservation is only needed for multi-consumer handlers like getPassword
// Since deviceAuthManagementStatusHandler is exclusive to LDA toggling, simply clear it
```

---

**🔐 Congratulations! You've mastered LDA Toggling Management with REL-ID SDK in Cordova SPA!**

*You're now equipped to implement secure, user-friendly authentication mode switching with unified dialog UX. The SPA architecture with centralized event handling provides optimal performance and maintainability for complex authentication flows.*
