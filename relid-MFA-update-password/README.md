# REL-ID Cordova Codelab: Password Update Management

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/)
[![SPA](https://img.shields.io/badge/Architecture-SPA-orange.svg)](https://cordova.apache.org/)
[![Password Update](https://img.shields.io/badge/Password%20Update-Enabled-blue.svg)]()
[![Challenge Mode 2](https://img.shields.io/badge/Challenge%20Mode-2-purple.svg)]()

> **Codelab Advanced:** Master user-initiated Password Update workflows with REL-ID SDK in Cordova SPA architecture

This folder contains the source code for the solution demonstrating [REL-ID Password Update Management](https://codelab.uniken.com/codelabs/cordova-update-password-flow/index.html?index=..%2F..index#0) using secure user-initiated password update flows with credential availability checking, policy validation, and screen-level event handling in Cordova Single Page Application architecture.

## 🔐 What You'll Learn

In this advanced password update codelab, you'll master production-ready user-initiated password update patterns in Cordova:

- ✅ **User-Initiated Updates**: Handle `challengeMode = 2` for dashboard password updates
- ✅ **Credential Availability Check**: `getAllChallenges()` and `initiateUpdateFlowForCredential()` APIs
- ✅ **Drawer Navigation Integration**: Conditional menu item based on credential availability
- ✅ **Screen-Level Event Handling**: `onUpdateCredentialResponse` with proper cleanup
- ✅ **SDK Event Chain**: `onUpdateCredentialResponse` status codes 100/110/153 trigger `onUserLoggedOff` → `getUser` events
- ✅ **Three-Field Password Input**: Current password, new password, and confirm password validation
- ✅ **Password Policy Validation**: Extract and enforce `RELID_PASSWORD_POLICY` requirements
- ✅ **Auto-Field Clearing**: Clear password fields on screen load for security
- ✅ **SPA Architecture**: Single page application with template-based navigation
- ✅ **Critical Error Management**: Handle statusCode 110, 153, 190 with logout flows

## 🎯 Learning Objectives

By completing this Password Update codelab, you'll be able to:

1. **Implement credential availability checking** with `getAllChallenges()` API after login
2. **Initiate update flows** using `initiateUpdateFlowForCredential('Password')` API
3. **Handle screen-level events** with `onUpdateCredentialResponse` and proper cleanup
4. **Build user-initiated update UI** with drawer navigation and conditional menu items
5. **Manage session persistence** without automatic login after password update
6. **Implement security best practices** with auto-field clearing on screen load
7. **Extract password policies** from `RELID_PASSWORD_POLICY` challenge data
8. **Create three-field password forms** with comprehensive validation rules
9. **Handle critical errors** with statusCode 110, 153, 190 logout scenarios
10. **Debug password update flows** and troubleshoot credential availability issues in SPA architecture

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID Cordova MFA Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of Cordova SPA architecture and template-based navigation
- Experience with JavaScript form handling and multi-field validation
- Knowledge of REL-ID SDK event-driven architecture patterns
- Familiarity with password policy parsing and validation
- Basic understanding of authentication state management and error handling
- Understanding of Cordova plugin architecture and native bridges

## 📁 Password Update Project Structure

```
relid-MFA-update-password/
├── 📱 Enhanced Cordova MFA + Password Update App
│   ├── platforms/              # Platform-specific code (iOS, Android)
│   ├── plugins/                # Cordova plugins including REL-ID plugin
│   └── www/                    # Web assets (SPA)
│
├── 📦 Password Update Source Architecture
│   └── www/
│       ├── index.html          # ONE HTML with all screen templates
│       ├── js/
│       │   └── app.js          # deviceready entry point
│       ├── css/
│       │   └── index.css       # Global styles
│       └── src/
│           ├── tutorial/       # Enhanced MFA + Password Update flows
│           │   ├── navigation/ # Enhanced navigation with password update
│           │   │   └── NavigationService.js  # SPA navigation utilities
│           │   └── screens/    # Enhanced screens with password update
│           │       ├── updatePassword/ # 🆕 Password Update Management
│           │       │   └── UpdatePasswordScreen.js  # 🆕 User-initiated update (challengeMode 2)
│           │       └── mfa/    # 🔐 MFA screens
│           │           ├── DashboardScreen.js       # Dashboard
│           │           ├── CheckUserScreen.js       # User validation
│           │           └── ...                      # Other MFA screens
│           └── uniken/         # 🛡️ Enhanced REL-ID Integration
│               ├── providers/  # Enhanced providers
│               │   └── SDKEventProvider.js          # Complete event handling
│               │                                   # - onCredentialsAvailableForUpdate
│               │                                   # - onUpdateCredentialResponse (fallback)
│               ├── services/   # 🆕 Enhanced SDK service layer
│               │   ├── rdnaService.js               # Enhanced password update APIs
│               │   │                               # - updatePassword(current, new, 2)
│               │   │                               # - getAllChallenges(username)
│               │   │                               # - initiateUpdateFlowForCredential(type)
│               │   └── rdnaEventManager.js          # Complete event management
│               │                                   # - getPassword handler (challengeMode 2)
│               │                                   # - onUpdateCredentialResponse handler
│               │                                   # - onCredentialsAvailableForUpdate handler
│               ├── cp/         # Connection Profile
│               │   └── agent_info.json             # REL-ID server configuration
│               └── utils/      # Helper utilities
│                   ├── connectionProfileParser.js  # Profile configuration
│                   └── passwordPolicyUtils.js      # Password validation
│
└── 📚 Production Configuration
    ├── package.json            # Dependencies
    ├── config.xml              # Cordova configuration
    └── cordova-plugin-rdna-client/  # REL-ID Cordova Plugin
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-MFA-update-password

# Install dependencies
npm install

# Add platforms
cordova platform add ios
cordova platform add android

# Verify plugins (REL-ID plugin should be listed)
cordova plugin ls

# Build the application
cordova build ios
# or
cordova build android

# Run the application
cordova run ios
# or
cordova run android
```

### Verify Password Update Features

Once the app launches, verify these password update capabilities:

1. ✅ Complete MFA flow and successful login to dashboard
2. ✅ `getAllChallenges()` called automatically after login
3. ✅ "🔑 Update Password" menu item appears in drawer navigation
4. ✅ Tapping menu item calls `initiateUpdateFlowForCredential('Password')`
5. ✅ UpdatePasswordScreen displays with three password fields (current, new, confirm)
6. ✅ Password policy extracted from `RELID_PASSWORD_POLICY` and displayed
7. ✅ Attempts counter displays remaining attempts
8. ✅ `updatePassword(current, new, 2)` API integration with validation
9. ✅ `onUpdateCredentialResponse` event handled within screen
10. ✅ Success navigates to dashboard (no automatic login)
11. ✅ Password fields auto-clear when screen loads
12. ✅ Error handling with proper status banner display

## 🎓 Learning Checkpoints

### Checkpoint 1: Password Update - Credential Availability
- [ ] I understand how `getAllChallenges()` checks for available credential updates after login
- [ ] I can implement `initiateUpdateFlowForCredential('Password')` to trigger update flow
- [ ] I know how to handle `onCredentialsAvailableForUpdate` event with options array
- [ ] I can create conditional menu items based on credential availability
- [ ] I understand the difference between credential update (mode 2) and password expiry (mode 4)

### Checkpoint 2: Password Update - Screen-Level Event Handling
- [ ] I can implement screen-level `onUpdateCredentialResponse` event handler in Cordova
- [ ] I understand proper cleanup with `onContentUnloaded()` lifecycle method
- [ ] I know how to handle success (statusCode 0/100) vs error responses
- [ ] I can implement critical error handling (statusCode 110, 153, 190)
- [ ] I understand why screen-level handlers are used instead of global handlers

### Checkpoint 3: Password Update - User Experience in SPA
- [ ] I can implement drawer navigation integration for password update in SPA
- [ ] I know how to clear password fields on screen load for security
- [ ] I understand the security benefits of clearing fields in `onContentLoaded()`
- [ ] I can display attempts counter and password policy requirements
- [ ] I know how to maintain user session (no automatic login) after update

### Checkpoint 4: UpdatePassword API Implementation in Cordova
- [ ] I can implement `updatePassword(current, new, 2)` API for challengeMode 2 using Cordova plugin
- [ ] I understand three-field validation (current, new, confirm passwords)
- [ ] I can extract password policy from challenge data (`RELID_PASSWORD_POLICY`)
- [ ] I know how to validate new password differs from current password
- [ ] I can handle loading states during password update operations

### Checkpoint 5: Password Policy Validation in JavaScript
- [ ] I can parse password policy JSON from challenge data using JavaScript
- [ ] I understand password policy fields (minL, maxL, minDg, minUc, minLc, minSc, etc.)
- [ ] I can display user-friendly policy requirements to users
- [ ] I know how to handle UserIDcheck as boolean or string "true"
- [ ] I can debug policy validation issues and policy parsing errors

### Checkpoint 6: Production Password Update in Cordova SPA
- [ ] I understand security best practices for password update implementations in SPA
- [ ] I can implement comprehensive error handling for password update failures
- [ ] I know how to optimize user experience with clear policy messaging
- [ ] I understand user stays logged in after successful password update (no automatic login)
- [ ] I understand compliance and audit requirements for password update workflows

## 🔄 Password Update User Flows

### Scenario 1: Standard Password Update Flow
1. **User logs in successfully** → Reaches dashboard after MFA completion
2. **getAllChallenges() called** → Automatic check for available credential updates
3. **onCredentialsAvailableForUpdate triggered** → Options array includes "Password"
4. **Drawer menu shows "🔑 Update Password"** → Conditional menu item appears
5. **User taps Update Password** → `initiateUpdateFlowForCredential('Password')` called
6. **SDK triggers getPassword** → `challengeMode = 2` (RDNA_OP_UPDATE_CREDENTIALS)
7. **Navigation to UpdatePasswordScreen** → SPA template swap with three password fields
8. **Password policy displayed** → Extracted from `RELID_PASSWORD_POLICY` challenge data
9. **User enters passwords** → Current, new, and confirm password inputs
10. **Validation checks** → New password differs from current, passwords match, policy compliance
11. **Password updated** → `updatePassword(current, new, 2)` API called via Cordova plugin
12. **onUpdateCredentialResponse** → Screen-level handler processes success response (statusCode 100)
13. **SDK event chain triggered** → `onUpdateCredentialResponse` with statusCode 100 causes SDK to trigger `onUserLoggedOff` → `getUser` events
14. **User navigates to dashboard** → Navigate back to dashboard after success alert
15. **Fields auto-cleared** → Password fields cleared when screen loads again

### Scenario 2: Password Update with Critical Error
1. **User in UpdatePasswordScreen** → Three password fields displayed
2. **User enters passwords** → Attempts to update password
3. **Password update attempted** → `updatePassword(current, new, 2)` API called
4. **Critical error occurs** → `onUpdateCredentialResponse` receives statusCode 153 (Attempts exhausted)
5. **onUpdateCredentialResponse handler** → Detects critical error (110, 153, 190)
6. **Error displayed with field clearing** → All password fields reset automatically
7. **SDK event chain triggered** → `onUpdateCredentialResponse` with statusCode 153 causes SDK to trigger `onUserLoggedOff` → `getUser` events
8. **onUserLoggedOff event** → Handled by SDKEventProvider
9. **getUser event** → Handled by SDKEventProvider
10. **Navigation to home** → User returns to login screen via SPA navigation

**Important Note - SDK Event Chain & Status Codes**:

The `onUpdateCredentialResponse` event returns specific status codes that trigger automatic SDK event chains. When this event receives status codes 100, 110, or 153, the SDK automatically triggers `onUserLoggedOff` → `getUser` event chain:

- **statusCode 100**: Password updated successfully - SDK triggers event chain after success
- **statusCode 110**: Password has expired while updating password - SDK triggers event chain leading to logout
- **statusCode 153**: Attempts exhausted - SDK triggers event chain leading to logout

**Important**: These status codes (100, 110, 153) are specific to `onUpdateCredentialResponse` event only and do not apply to other SDK events. This automatic event chain is part of the REL-ID SDK's credential update flow and ensures proper session management after password update operations.

## 📚 Advanced Resources

- **REL-ID Password Update Documentation**: [Update Credentials API Guide](https://developer.uniken.com/docs/update-credentials)
- **REL-ID Challenge Modes**: [Understanding Challenge Modes](https://developer.uniken.com/docs/challenge-modes)
- **Cordova Plugin Development**: [Plugin Development Guide](https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/)
- **Cordova SPA Architecture**: [Single Page Applications](https://cordova.apache.org/docs/en/latest/guide/overview/)

## 💡 Pro Tips

### Password Update Implementation Best Practices
1. **Check credential availability** - Call `getAllChallenges()` after login to check available updates
2. **Conditional menu display** - Show "Update Password" only when `onCredentialsAvailableForUpdate` includes "Password"
3. **Screen-level event handlers** - Use screen-level `onUpdateCredentialResponse` with cleanup in `onContentUnloaded()`
4. **Auto-clear on load** - Implement field clearing in `onContentLoaded()` for security
5. **No automatic login** - User stays logged in after update
6. **Handle critical errors** - Detect statusCode 110, 153, 190 for logout scenarios
7. **Drawer integration** - Place UpdatePasswordScreen accessible from drawer navigation
8. **Loading state management** - Handle loading state for `initiateUpdateFlowForCredential`
9. **SPA lifecycle** - Understand `onContentLoaded()` and `onContentUnloaded()` methods
10. **Test navigation flow** - Ensure proper parameter passing in SPA navigation

### Integration & Development
11. **Preserve existing MFA flows** - Password update should enhance, not disrupt existing authentication
12. **Use JSDoc comments** - Document functions with parameter types and return values
13. **Implement comprehensive logging** - Log flow progress for debugging without exposing passwords
14. **Test with various policies** - Ensure password update works with different password policy configurations
15. **Monitor user experience metrics** - Track password update success rates and policy compliance
16. **Extract password policy** - Always extract `RELID_PASSWORD_POLICY` from `challengeInfo` array
17. **Clear fields on errors** - Implement automatic field clearing for both API and status errors
18. **Validate password differences** - Ensure new password differs from current password
19. **Display policy requirements** - Show parsed policy requirements to users before input
20. **Three-field validation** - Validate current, new, and confirm passwords with proper error messages

### Security & Compliance
21. **Enforce password policies** - Always validate passwords against server-provided policy requirements
22. **Handle password history** - Respect server-configured password history limits
23. **Audit password changes** - Log password update events for security monitoring
24. **Ensure secure transmission** - All password communications should use secure channels via Cordova plugin
25. **Test security scenarios** - Verify password update security under various attack scenarios
26. **Clear sensitive data** - Implement auto-clearing of password fields on screen load
27. **Secure sensitive operations** - Never log or expose passwords in console or error messages
28. **Handle loading states** - Show clear loading indicators during password update operations

## 🔗 Key Implementation Files

### rdnaService.js - Credential Update APIs

```javascript
async getAllChallenges(username) {
  return new Promise((resolve, reject) => {
    com.uniken.rdnaplugin.RdnaClient.getAllChallenges(
      (response) => {
        const result = JSON.parse(response);
        if (result.error && result.error.longErrorCode === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      },
      (error) => reject(JSON.parse(error)),
      [username]
    );
  });
}

async initiateUpdateFlowForCredential(credentialType) {
  return new Promise((resolve, reject) => {
    com.uniken.rdnaplugin.RdnaClient.initiateUpdateFlowForCredential(
      (response) => resolve(JSON.parse(response)),
      (error) => reject(JSON.parse(error)),
      [credentialType]
    );
  });
}
```

### SDKEventProvider.js - Automatic getAllChallenges after login

```javascript
async handleUserLoggedIn(data) {
  console.log('SDKEventProvider - User logged in, calling getAllChallenges');

  // Navigate to Dashboard
  NavigationService.navigate('Dashboard', {
    userID: data.userID,
    sessionID: sessionID,
    // ... other params
  });

  // Call getAllChallenges after login
  try {
    await rdnaService.getAllChallenges(data.userID);
    console.log('getAllChallenges called successfully');
  } catch (error) {
    console.error('getAllChallenges failed:', error);
  }
}

// Handle challengeMode 2 for password update
handleGetPassword(data) {
  if (data.challengeMode === 2) {
    console.log('User-initiated password update, navigating to UpdatePassword screen');
    NavigationService.navigate('UpdatePassword', {
      eventData: data,
      responseData: data,
      title: 'Update Password',
      subtitle: 'Update your account password'
    });
  }
}
```

### index.html - Conditional menu item in drawer

```html
<li id="drawer-update-password-item" style="display: none;">
  <a href="#" id="drawer-update-password-link" class="drawer-link">🔑 Update Password</a>
</li>

<script>
// Update drawer menu based on credential availability
function updateDrawerMenu() {
  const credentials = SDKEventProvider.getAvailableCredentials();
  const updatePasswordItem = document.getElementById('drawer-update-password-item');

  if (credentials.includes('Password')) {
    updatePasswordItem.style.display = 'list-item';
  } else {
    updatePasswordItem.style.display = 'none';
  }
}

// Handle menu item click
document.getElementById('drawer-update-password-link').addEventListener('click', async function(e) {
  e.preventDefault();

  // Close drawer
  NavigationService.closeDrawer();

  try {
    await rdnaService.initiateUpdateFlowForCredential('Password');
    console.log('InitiateUpdateFlowForCredential called successfully');
  } catch (error) {
    alert('Update Password Error: ' + (error.error?.errorString || 'Failed'));
  }
});
</script>
```

### UpdatePasswordScreen.js - Screen-level event handler

```javascript
setupEventHandler() {
  const eventManager = rdnaService.getEventManager();

  this._updateCredentialHandler = (data) => {
    this.isSubmitting = false;
    this.updateSubmitButton();

    const errorCode = data.error.longErrorCode;
    const statusCode = data.status.statusCode;
    const statusMessage = data.status.statusMessage;

    // IMPORTANT: onUpdateCredentialResponse event with statusCode 100, 110, or 153
    // causes the SDK to automatically trigger onUserLoggedOff → getUser event chain
    // These status codes are specific to onUpdateCredentialResponse event only:
    // - 100: Password updated successfully
    // - 110: Password has expired while updating password
    // - 153: Attempts exhausted

    if (errorCode != 0) {
      this.showErrorDialog('Update Failed', errorString, () => {
        NavigationService.navigate('Dashboard');
      });
      return;
    }

    if (statusCode === 100 || statusCode === 0) {
      // statusCode 100 in onUpdateCredentialResponse = Password updated successfully
      this.showSuccessDialog(statusMessage || 'Password updated successfully');
      // SDK will trigger onUserLoggedOff → getUser after this
    } else if (statusCode === 110 || statusCode === 153) {
      // statusCode 110/153 in onUpdateCredentialResponse = Password expired/Attempts exhausted
      this.clearFields();
      this.error = statusMessage;
      this.updateErrorDisplay();
      this.showErrorDialog('Update Failed', statusMessage, () => {
        console.log('Critical error, waiting for onUserLoggedOff and getUser events');
      });
      // SDK will trigger onUserLoggedOff → getUser, leading to logout
    } else {
      this.clearFields();
      this.error = statusMessage;
      this.updateErrorDisplay();
      this.showErrorDialog('Update Failed', statusMessage, () => {
        NavigationService.navigate('Dashboard');
      });
    }
  };

  eventManager.setUpdateCredentialResponseHandler(this._updateCredentialHandler);
}

onContentUnloaded() {
  rdnaService.getEventManager().setUpdateCredentialResponseHandler(undefined);
  this._updateCredentialHandler = null;
}

// Auto-clear fields on screen load
onContentLoaded(params) {
  this.setupEventHandler();
  this.setupEventListeners();
  this.setupPasswordToggles();
  this.setupCloseButton();
  this.initializeData(params);
}
```

---

**🔐 Congratulations! You've mastered Password Update Management with REL-ID SDK in Cordova SPA architecture!**

*You're now equipped to implement user-initiated password update flows with:*

- **Credential Availability Checking**: Automatic checking after login with `getAllChallenges()`
- **Conditional Menu Display**: Show update option only when available
- **Screen-Level Event Handling**: Proper `onUpdateCredentialResponse` handling with cleanup
- **Security Best Practices**: Auto-clearing password fields on screen load
- **Seamless User Experience**: User stays logged in after successful password update
- **SPA Architecture**: Efficient template-based navigation without page reloads

*Use this knowledge to create secure, user-friendly password update experiences in Cordova that empower users to proactively manage their account security!*
