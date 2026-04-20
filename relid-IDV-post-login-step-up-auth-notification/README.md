# REL-ID Cordova Codelab: Server Biometric Step-Up Authentication with Notifications

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-Latest-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![IDV Workflow 9](https://img.shields.io/badge/IDV%20Workflow-9-orange.svg)]()
[![Server Biometric](https://img.shields.io/badge/Server%20Biometric-Enabled-green.svg)]()
[![LDA Support](https://img.shields.io/badge/LDA-Supported-blue.svg)]()
[![Liveness Detection](https://img.shields.io/badge/Liveness%20Detection-Enabled-green.svg)]()

> **Codelab Advanced:** Master Server Biometric Step-Up Authentication for notification actions with liveness detection and LDA support using REL-ID SDK in Cordova Single Page Application architecture

This folder contains the source code demonstrating [REL-ID Server Biometric Step-Up Authentication for Notifications](https://developer.uniken.com/docs/stepup-authentication-for-actions) using **IDV Workflow 9** for high-security notification actions requiring biometric verification with liveness detection, plus LDA (Local Device Authentication) support.

## 🔐 What You'll Learn

In this advanced server biometric step-up authentication codelab, you'll master production-ready high-security notification action authentication with biometric verification and liveness detection:

### **🔐 Server Biometric Step-Up Authentication (IDV Workflow 9)**
- ✅ **AuthLevel Detection**: Backend configures `authLevel = 4` to trigger server biometric authentication
- ✅ **Automatic Selfie Flow**: SDK automatically handles `getIDVSelfieProcessStartConfirmation` event (workflow 9)
- ✅ **SPA Navigation Pattern**: Navigate back to GetNotifications screen before showing result alert
- ✅ **300ms Delay Pattern**: Wait for smooth screen transition before displaying alert
- ✅ **IDV Workflow 9 Detection**: Identify notification step-up via `idvWorkflow === 9` parameter
- ✅ **Result Processing**: Handle `onUpdateNotification` event after biometric verification completes
- ✅ **Alert-Based UI**: Native alerts for success/error messages (no custom modals)
- ✅ **Liveness Detection**: Real-time face capture with anti-spoofing via Aware FaceCapture library
- ✅ **Server-Side Verification**: Biometric template matching performed on secure server
- ✅ **High-Security Actions**: Enhanced authentication for sensitive notification actions

### **📱 LDA Step-Up Authentication (Biometric/PIN)**
- ✅ **LDA Authentication**: SDK handles biometric authentication internally for standard-security actions
- ✅ **Platform Biometrics**: Native Face ID, Touch ID, Fingerprint authentication
- ✅ **Silent LDA Cancellation**: Error code 131 handled gracefully without showing error to user
- ✅ **Seamless Experience**: Biometric prompt → Success (or silent cancellation)

### **🔑 Password Step-Up Authentication (Challenge Mode 3)**
- ✅ **Password Dialog**: StepUpPasswordDialog with notification context display
- ✅ **Callback Pattern**: `onCancel` and `onSubmit` callbacks for loading indicator management
- ✅ **Loading State Management**: Hide loading when password cancelled, keep visible when submitted
- ✅ **Error Handling**: Attempts counter, error messages, and validation feedback
- ✅ **Context Management**: StepUpAuthManager for centralized step-up auth logic

### **Shared Features**
- ✅ **Notification Actions**: `getNotifications()` and `updateNotification()` APIs with action parameters
- ✅ **AuthLevel Configuration**: Backend determines authentication method (1=Password, 3=LDA, 4=Server Biometric)
- ✅ **Event-Driven Flow**: Asynchronous event handling with proper callback preservation
- ✅ **Success Flow**: Alert confirmation with navigation to notifications and auto-refresh
- ✅ **SPA Architecture**: Single Page Application with template-based screen rendering

## 🎯 Learning Objectives

By completing this Server Biometric Step-Up Authentication codelab, you'll be able to:

### **🔐 Server Biometric Step-Up Authentication (Primary Focus)**
1. **Implement server biometric step-up** for notification actions with `authLevel = 4`
2. **Handle IDV workflow 9 automatically** via SDKIDVEventProvider navigation
3. **Implement SPA navigation pattern** with navigate-back-before-alert for smooth UX
4. **Use 300ms transition delay** before showing alerts after navigation
5. **Handle notification update events** after server biometric verification completes
6. **Implement complete Cordova UI flow** from action selection through biometric to result display
7. **Debug IDV workflow 9** and distinguish from other IDV workflows (opt-in, KYC, etc.)
8. **Test server biometric scenarios** including success, failure, and cancellation
9. **Understand authLevel configuration** and how backend determines authentication method
10. **Integrate liveness detection** with Aware FaceCapture library for anti-spoofing

### **📱 LDA Step-Up Authentication (Secondary Focus)**
11. **Understand LDA behavior** and how SDK handles biometric authentication internally
12. **Implement silent LDA cancellation** (error code 131) without showing error alerts
13. **Handle LDA-only scenarios** where password fallback is not available
14. **Understand authentication method selection** based on authLevel configuration
15. **Test LDA flows** across different enrollment scenarios

### **🔑 Password Step-Up Authentication**
16. **Implement StepUpAuthManager callbacks** for loading state management
17. **Handle password dialog cancellation** with `onCancel` callback to hide loading
18. **Handle password submission** with `onSubmit` callback for state tracking
19. **Manage step-up context** with notification details for modal display
20. **Implement modular state management** separating concerns between screen and manager

### **Shared Implementation Skills**
21. **Implement notification retrieval** with `getNotifications()` API and auto-loading
22. **Handle notification actions** using `updateNotification()` API with action parameters
23. **Use SPA navigation patterns** with NavigationService for screen transitions
24. **Handle critical status codes** and error scenarios
25. **Debug authentication flows** and troubleshoot integration issues

## 🔑 Step-Up Authentication Logic

**Important**: This codelab focuses on advanced authentication methods for notification step-up. Step-up authentication requires the user to be logged in. The authentication method used depends on the **`authLevel`** configured in the backend for each notification action.

### Authentication Method Selection Matrix

| AuthLevel | Step-Up Authentication Method | When Used | Implementation |
|-----------|-------------------------------|-----------|----------------|
| **1** | **Password** | Standard security actions | StepUpPasswordDialog with callback pattern |
| **3** | **LDA (Local Device Auth)** | Standard biometric actions | 📱 SDK handles internally, silent cancellation |
| **4** | **🔐 Server Biometric** | High-security actions requiring liveness | 🆕 Primary focus (IDV Workflow 9 with SPA navigation) |

### Key Authentication Behaviors

**🔐 Server Biometric Authentication (authLevel = 4)**:
- When backend sets **`authLevel = 4`** for notification action → SDK triggers **Server Biometric** flow
- SDK fires `getIDVSelfieProcessStartConfirmation` event with **`idvWorkflow = 9`**
- SDKIDVEventProvider automatically navigates to IDVSelfieProcessStart screen
- User taps "Start Selfie Capture" to initiate biometric verification
- Native SDK captures selfie with **liveness detection** via Aware FaceCapture library
- SDK verifies biometric template on server and triggers `onUpdateNotification` event
- GetNotificationsScreen navigates back and shows alert after 300ms delay
- Works regardless of login method or enrolled authentication methods
- **Use Case**: High-security actions like large transfers, sensitive data access, admin operations

**📱 LDA Authentication (authLevel = 3)**:
- When backend sets **`authLevel = 3`** for notification action → SDK triggers **LDA** flow
- SDK handles biometric prompt internally (no custom UI needed)
- Native platform biometric prompt appears (Face ID, Touch ID, Fingerprint)
- User authenticates with platform biometric → `onUpdateNotification` event with success
- **LDA Cancellation Behavior**:
  - Error code 131 → Silent return (no alert shown to user)
  - User stays on GetNotifications screen
- **Use Case**: Standard-security actions like view details, update preferences

**🔑 Password Authentication (authLevel = 1)**:
- SDK triggers `getPassword` event with `challengeMode = 3`
- StepUpPasswordDialog displays with notification context
- **Callback Pattern**:
  - `onCancel`: Hides loading indicator when user cancels password dialog
  - `onSubmit`: Called when user submits password (loading stays visible)
- **Use Case**: Basic re-authentication, fallback when biometric unavailable

## 🆔 Server Biometric Step-Up Flow (IDV Workflow 9)

The server biometric step-up authentication provides an additional layer of security for high-sensitivity notification actions by requiring real-time biometric verification with liveness detection.

### What Makes Workflow 9 Special in Cordova?

| IDV Workflow | Scenario | Cordova Navigation Pattern |
|--------------|----------|---------------------------|
| **9** | **Notification Step-Up Auth** | **Navigate back to GetNotifications + 300ms delay + alert** |
| 10 | Biometric Opt-In | Navigate back to BiometricOptIn screen + show modal |
| 6 | Post-Login KYC | Navigate to result screen directly |
| 8 | Post-Login Selfie | Navigate to result screen directly |

### Server Biometric Event Flow (Cordova SPA Pattern)

```
User Taps Notification Action (authLevel=4)
    ↓
updateNotification(uuid, action) API Called
    ↓
SDK Detects: authLevel = 4 (Server Biometric Required)
    ↓
SDK Triggers: getIDVSelfieProcessStartConfirmation (idvWorkflow: 9)
    ↓
SDKIDVEventProvider: NavigationService.navigate('IDVSelfieProcessStart', { idvWorkflow: 9 })
    ↓
User on IDVSelfieProcessStart Screen:
  - Reads selfie capture guidelines
  - Taps "Start Selfie Capture"
  - SDK calls setIDVSelfieProcessStartConfirmation(true, false, 9)
    ↓
SDK Opens Native Camera (Aware FaceCapture):
  - Captures selfie with liveness detection
  - Performs anti-spoofing checks
  - Validates biometric template against server
    ↓
SDK Triggers: onUpdateNotification Event
    ↓
GetNotificationsScreen.handleUpdateNotificationResponse():
  1. showLoading(false) - Hide loading indicator
  2. StepUpAuthManager.clearContext() - Clear step-up context
  3. NavigationService.navigate('GetNotifications', params) - Navigate back
  4. setTimeout(() => {
       alert('Success!' or 'Error!');  // Show result alert
       loadNotifications();  // Refresh notifications
     }, 300);  // 300ms delay for smooth transition
    ↓
User sees alert → Clicks OK → Notifications refreshed
```

### Key Cordova SPA Patterns

**1. Navigate Back Before Alert (300ms Delay)**
```javascript
// Navigate back to GetNotifications screen first
NavigationService.navigate('GetNotifications', this.sessionParams);

// Wait 300ms for smooth screen transition
setTimeout(() => {
  alert('Notification action completed successfully');
  this.loadNotifications();  // Refresh after alert
}, 300);
```

**2. Silent LDA Cancellation (Error Code 131)**
```javascript
if (errorCode === 131) {
  console.log('LDA cancelled by user, silent return');
  NavigationService.navigate('GetNotifications', this.sessionParams);
  return;  // No alert shown
}
```

**3. Password Cancel Callback**
```javascript
StepUpAuthManager.setContext({
  // ... notification details ...
  onCancel: () => {
    this.showLoading(false);  // Hide loading when cancelled
  },
  onSubmit: () => {
    // Keep loading visible, wait for onUpdateNotification
  }
});
```

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **REL-ID MFA Codelab** - Complete MFA implementation required
- **User Account Activation** - User must be activated (completed activation code, set password, LDA consent)
- **Biometric Template Created** - User must have biometric template stored on server (complete Biometric Opt-In flow first)
- Understanding of REL-ID SDK event-driven architecture patterns
- Experience with Cordova Single Page Application architecture
- Knowledge of identity verification workflows and biometric authentication concepts
- Familiarity with JavaScript ES6+ features and Promise patterns
- Basic understanding of liveness detection and face matching concepts
- Experience with Cordova plugin integration and native bridge patterns

## 📁 IDV Post-Login Step-Up Authentication Notification Project Structure

```
relid-IDV-post-login-step-up-auth-notification/
├── 📱 Cordova Single Page Application Architecture
│   ├── platforms/               # Platform-specific builds (iOS, Android)
│   ├── plugins/                 # Cordova plugins
│   │   ├── cordova-plugin-file/            # File system access plugin
│   │   └── cordova-plugin-rdna/            # REL-ID Native Bridge with Aware FaceCapture
│   ├── hooks/                   # Build hooks
│   └── www/                     # 🆕 SPA Application Root (see below)

├── 📦 SPA Application Structure (www/)
│   ├── index.html               # ⚠️ SINGLE HTML FILE with all templates
│   ├── css/
│   │   └── index.css            # Styles for all screens
│   ├── js/
│   │   └── app.js               # App initialization (deviceready, AppInitializer)
│   └── src/
│       ├── tutorial/            # Enhanced MFA + Notification + IDV flow
│       │   ├── navigation/      # Enhanced navigation with IDV support
│       │   │   └── NavigationService.js    # SPA navigation (template swapping)
│       │   └── screens/         # Enhanced screens with IDV
│       │       ├── mfa/         # 🔐 MFA screens (base authentication)
│       │       │   ├── CheckUserScreen.js       # User validation
│       │       │   ├── ActivationCodeScreen.js  # OTP verification
│       │       │   ├── SetPasswordScreen.js     # Password creation
│       │       │   ├── VerifyPasswordScreen.js  # Password verification
│       │       │   ├── DashboardScreen.js       # Main dashboard
│       │       │   └── ...                      # Other MFA screens
│       │       ├── notification/                # 🆕 Notification Management
│       │       │   ├── GetNotificationsScreen.js         # Fetch & display notifications
│       │       │   │                                      # - Auto-load on screen entry
│       │       │   │                                      # - Action modal with radio buttons
│       │       │   │                                      # - 🆕 Password cancel callback
│       │       │   │                                      # - 🆕 Navigate back + alert pattern
│       │       │   │                                      # - 🆕 300ms delay before alert
│       │       │   │                                      # - 🆕 Silent LDA cancellation
│       │       │   └── NotificationHistoryScreen.js      # Historical notifications
│       │       └── idv/         # IDV screens
│       │           ├── biometricOptIn/                              # Biometric Opt-In
│       │           │   └── BiometricOptInScreen.js                  # Template creation
│       │           ├── biometricOptOut/                             # Biometric Opt-Out
│       │           │   └── BiometricOptOutScreen.js                 # Template deletion
│       │           ├── serverBiometricAuthentication/               # Server Biometric Auth
│       │           │   └── ServerBiometricAuthenticationScreen.js   # Template verification
│       │           └── IDVSelfieProcessStartConfirmationScreen.js  # Selfie capture (workflows 8, 9, 10)
│       └── uniken/              # 🛡️ Enhanced REL-ID Integration
│           ├── components/      # Reusable UI components
│           │   └── modals/                                          # Modal dialogs
│           │       ├── StepUpPasswordDialog.js                      # 🆕 Password step-up with callbacks
│           │       └── PasswordValidationDialog.js                  # Password validation modal
│           ├── managers/        # 🆕 Managers for modular state
│           │   └── StepUpAuthManager.js                             # 🆕 Password step-up orchestration
│           │                                                        # - Context management
│           │                                                        # - 🆕 onCancel callback support
│           │                                                        # - 🆕 onSubmit callback support
│           ├── providers/       # Enhanced providers
│           │   ├── SDKEventProvider.js          # Complete MFA event handling
│           │   └── idv/                          # IDV event providers
│           │       └── SDKIDVEventProvider.js   # Complete IDV event handling
│           │                                    # - Automatic workflow 9 navigation
│           ├── services/        # Enhanced SDK service layer
│           │   ├── rdnaService.js                # Base MFA service layer
│           │   │                                # - 🆕 getNotifications()
│           │   │                                # - 🆕 updateNotification()
│           │   └── idv/                          # IDV service layer
│           │       ├── rdnaIDVService.js         # Complete IDV API methods
│           │       │                            # - setIDVSelfieProcessStartConfirmation()
│           │       │                            # - initiateIDVServerBiometricAuthentication()
│           │       │                            # - checkIDVUserBiometricTemplateStatus()
│           │       └── rdnaIDVEventManager.js    # Complete IDV event management
│           ├── utils/           # Utility functions
│           │   └── connectionProfileParser.js    # File loading with cordova-plugin-file
│           ├── MTDContext/      # MTD threat management
│           └── SessionContext/  # Session management

└── 📚 Production Configuration
    ├── config.xml               # Cordova configuration
    └── package.json             # Dependencies
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-IDV-post-login-step-up-auth-notification

# Add iOS platform (if not already added)
cordova platform add ios

# Install/update plugins
cordova plugin add cordova-plugin-file
# cordova-plugin-rdna should already be installed

# Prepare platforms (copies www/ files and runs hooks)
cordova prepare ios
```

### IDV Assets Configuration

The project uses an **automated Cordova hook** for IDV asset management, but notification step-up authentication **does not require document scanning assets**. This flow only needs the Aware FaceCapture library for selfie capture and server biometric verification.

#### What This Project Does NOT Need:

**Document Scanner Assets (Not Required):**

- ❌ `regula.license` - Document reader license (only for document scanning)
- ❌ `db.dat` - 110.5MB Regula document recognition database (only for document scanning)
- ❌ `Certificates.bundle/` - ICAO PKD certificates (only for document scanning)
- ❌ `idv-native-resources/` folder - Not needed for notification step-up authentication

> **Key Difference**: This codelab demonstrates **server biometric step-up authentication for notification actions** which only uses selfie capture with liveness detection. It does NOT scan identity documents, so document scanner assets are not required.

#### What This Project DOES Need:

**Biometric Capture Library (Pre-configured):**

- ✅ **Aware FaceCapture Library** - Embedded in `cordova-plugin-rdna` plugin
  - Provides liveness detection and face capture capabilities
  - Automatically configured for iOS and Android platforms
  - No manual asset placement required

#### Optional: Understanding the IDV Asset Hook (For Other Flows)

If you're building a **document scanning flow** (like KYC or Additional Document Scan), you'll need the automated hook structure:

```
your-cordova-project/
├── idv-native-resources/          # Only needed for document scanning flows
│   ├── common/                    # Shared files (regula.license, db.dat)
│   ├── ios/                       # iOS certificates
│   └── android/                   # Android certificates
├── hooks/
│   └── after_prepare/
│       └── copy_idv_native_resources.js   # Automated hook script
```

**Hook Script:** `hooks/after_prepare/copy_idv_native_resources.js`

When you run `cordova prepare` or `cordova build`, this hook automatically copies assets to platform-specific directories.

> **For This Notification Step-Up Codelab**:
> - The `idv-native-resources/` folder is **optional** (can be empty or omitted)
> - The hook will skip copying if assets are not present
> - Only the Aware FaceCapture library (in cordova-plugin-rdna) is required

### Run the Application

```bash
# Build and run on iOS
cordova build ios
cordova run ios

# Or open in Xcode for debugging
open platforms/ios/*.xcworkspace

# For Android
cordova build android
cordova run android
```

### Verify Notification Step-Up Authentication Features

Once the app launches, verify these capabilities:

1. ✅ Complete MFA activation flow available (user check, activation code, password setup, LDA consent)
2. ✅ User login with activated credentials
3. ✅ Navigate to Dashboard → Open Drawer Menu → Select "🔔 Get Notifications"
4. ✅ Notifications loaded automatically on screen entry
5. ✅ Tap notification to view available actions
6. ✅ Action modal displays with action buttons
7. ✅ **Test Password Step-Up (authLevel=1)**:
   - Tap action requiring password authentication
   - Password dialog appears with notification context
   - **Cancel Dialog**: Loading indicator hidden immediately ✅
   - **Submit Password**: Loading stays visible until result ✅
8. ✅ **Test LDA Step-Up (authLevel=3)**:
   - Tap action requiring LDA authentication
   - Platform biometric prompt appears
   - **Success**: Alert shown, notifications refreshed ✅
   - **Cancel (Error 131)**: Silent return, no alert ✅
9. ✅ **Test Server Biometric Step-Up (authLevel=4)**:
   - Tap action requiring server biometric authentication
   - Navigate to IDVSelfieProcessStart screen automatically ✅
   - Tap "Start Selfie Capture"
   - Native camera opens with liveness detection
   - SDK validates biometric template on server
   - Navigate back to GetNotifications screen ✅
   - Wait 300ms, then alert shows result ✅
   - Notifications refreshed after alert dismissed ✅
10. ✅ Menu button (hamburger icon) works correctly throughout flows
11. ✅ All error scenarios handled with proper alerts

## 🧪 Testing Scenarios

### Test 1: Server Biometric Step-Up (authLevel=4)

**Steps:**
1. Login to app
2. Navigate to "Get Notifications"
3. Tap notification with authLevel=4 action
4. Verify navigation to IDVSelfieProcessStart screen
5. Tap "Start Selfie Capture"
6. Complete selfie capture with liveness detection
7. Verify navigation back to GetNotifications screen
8. Verify 300ms delay, then alert shows result
9. Dismiss alert, verify notifications refreshed

**Expected Result**: ✅ Smooth flow from notification → selfie → alert → refresh

### Test 2: LDA Step-Up Success (authLevel=3)

**Steps:**
1. Navigate to "Get Notifications"
2. Tap notification with authLevel=3 action
3. Platform biometric prompt appears
4. Authenticate with Face ID/Touch ID/Fingerprint
5. Verify alert shows success
6. Dismiss alert, verify notifications refreshed

**Expected Result**: ✅ Quick biometric authentication with success alert

### Test 3: LDA Cancellation - Silent (authLevel=3)

**Steps:**
1. Navigate to "Get Notifications"
2. Tap notification with authLevel=3 action
3. Platform biometric prompt appears
4. **Cancel the biometric prompt**
5. Verify **NO error alert shown**
6. Verify still on GetNotifications screen
7. Verify can retry action

**Expected Result**: ✅ Silent cancellation, no error shown

### Test 4: Password Step-Up Cancel (authLevel=1)

**Steps:**
1. Navigate to "Get Notifications"
2. Tap notification with authLevel=1 action
3. Password dialog appears
4. **Click Cancel button**
5. Verify **loading indicator hidden immediately**
6. Verify password dialog closed
7. Verify can retry action

**Expected Result**: ✅ Loading hidden, clean cancellation

### Test 5: Password Step-Up Success (authLevel=1)

**Steps:**
1. Navigate to "Get Notifications"
2. Tap notification with authLevel=1 action
3. Password dialog appears
4. Enter password, click Submit
5. Verify loading stays visible
6. Wait for onUpdateNotification event
7. Verify password dialog hidden
8. Verify alert shows success
9. Verify notifications refreshed

**Expected Result**: ✅ Password authentication successful

## 🐛 Troubleshooting

### Loading Indicator Stuck After Password Cancel

**Symptom**: Loading indicator visible forever after cancelling password dialog

**Solution**: Ensure `onCancel` callback is registered in `StepUpAuthManager.setContext()`:

```javascript
StepUpAuthManager.setContext({
  // ... other properties ...
  onCancel: () => {
    this.showLoading(false);  // ✅ Must hide loading
  }
});
```

### Alert Shows on Wrong Screen

**Symptom**: Alert appears on selfie screen instead of GetNotifications screen

**Solution**: Ensure navigation happens BEFORE showing alert:

```javascript
// ✅ CORRECT
NavigationService.navigate('GetNotifications', params);
setTimeout(() => {
  alert('Success!');
}, 300);

// ❌ WRONG
alert('Success!');
NavigationService.navigate('GetNotifications', params);
```

### LDA Error Alert Shows (Should Be Silent)

**Symptom**: Error alert shown when user cancels LDA biometric prompt

**Solution**: Check for error code 131 and return without showing alert:

```javascript
if (errorCode === 131) {
  NavigationService.navigate('GetNotifications', this.sessionParams);
  return;  // ✅ Silent return, no alert
}
```

### Selfie Screen Not Appearing

**Symptom**: Selfie screen doesn't show when authLevel=4 action selected

**Solution**: Verify:
1. ✅ User has biometric template (complete Biometric Opt-In first)
2. ✅ Backend configured with authLevel=4 for the action
3. ✅ SDKIDVEventProvider is initialized in AppInitializer
4. ✅ Check console for `getIDVSelfieProcessStartConfirmation` event logs

## 🎓 Summary

Congratulations! You've mastered server biometric step-up authentication for notification actions in Cordova:

✅ **Server Biometric Step-Up (authLevel=4)** - High-security actions with liveness detection
✅ **LDA Step-Up (authLevel=3)** - Platform biometric with silent cancellation
✅ **Password Step-Up (authLevel=1)** - Callback pattern for loading state management
✅ **SPA Navigation Patterns** - Navigate back before alert with 300ms delay
✅ **Notification Management** - Get notifications, update with actions, auto-refresh
✅ **Production-Ready UX** - Clean error handling, smooth transitions, intuitive flows

You're now ready to build secure, enterprise-grade notification workflows with multi-level authentication! 🚀

---

**Built with ❤️ using REL-ID SDK and Cordova**
