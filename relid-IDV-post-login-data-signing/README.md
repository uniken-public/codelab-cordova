# REL-ID Cordova Codelab: Server Biometric Step-Up Authentication for Data Signing

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-Latest-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![IDV Workflow 16](https://img.shields.io/badge/IDV%20Workflow-16-orange.svg)]()
[![Server Biometric](https://img.shields.io/badge/Server%20Biometric-Enabled-green.svg)]()
[![Data Signing](https://img.shields.io/badge/Data%20Signing-Enabled-purple.svg)]()
[![Liveness Detection](https://img.shields.io/badge/Liveness%20Detection-Enabled-green.svg)]()

> **Codelab Advanced:** Master cryptographic data signing with multi-method step-up authentication including server biometric verification with liveness detection using REL-ID SDK in Cordova Single Page Application architecture

This folder contains the source code demonstrating [REL-ID Data Signing](https://developer.uniken.com/docs/data-signing) with **Multi-Method Step-Up Authentication**, featuring **IDV Workflow 16** for high-security data signing operations requiring server biometric verification with liveness detection.

## 🔐 What You'll Learn

In this advanced data signing codelab, you'll master production-ready cryptographic data signing with three authentication methods:

### **🔐 Server Biometric Step-Up Authentication (IDV Workflow 16) - PRIMARY FOCUS**
- ✅ **Data Signing Integration**: Cryptographically sign data payloads with biometric authentication
- ✅ **IDV Workflow 16**: Server biometric step-up specifically for data signing operations
- ✅ **Selfie Capture Flow**: `getIDVSelfieProcessStartConfirmation` event → IDVSelfieProcessStart screen navigation
- ✅ **Selfie Screen Auto-Closure**: Detect and close selfie screen in `onAuthenticateUserAndSignData` handler
- ✅ **SPA Navigation Pattern**: Navigate back to DataSigningInput before showing result alert
- ✅ **Screen Transition Delay**: 300ms delay after closing selfie screen before showing results
- ✅ **Error Handling Priority**: Check error code first, then status code, with user-friendly alerts
- ✅ **Screen-Level Handler**: All IDV logic in DataSigningInputScreen for clean architecture
- ✅ **Liveness Detection**: Real-time face capture with anti-spoofing via Aware FaceCapture library
- ✅ **Server-Side Verification**: Biometric template matching performed on secure server
- ✅ **Result Display**: Navigate to dedicated result screen with signature details
- ✅ **High-Security Signing**: Enhanced authentication for sensitive data signing operations

### **📱 LDA Step-Up Authentication (Biometric/PIN)**
- ✅ **LDA Authentication**: SDK handles biometric authentication internally for standard-security signing
- ✅ **Platform Biometrics**: Native Face ID, Touch ID, Fingerprint authentication
- ✅ **Automatic Fallback**: LDA cancellation triggers password dialog when both methods enrolled
- ✅ **LDA-Only Handling**: Error code 131 when LDA cancelled and password not enrolled
- ✅ **Seamless Experience**: Biometric prompt → Success (or Password fallback)

### **📝 Password Step-Up Authentication**
- ✅ **Password Challenge**: Modal dialog for password-based step-up authentication
- ✅ **Challenge Mode 12**: Data signing step-up authentication (distinct from challenge mode 3)
- ✅ **Attempt Tracking**: Display remaining attempts to user
- ✅ **Error Handling**: Clear feedback on authentication failures

### **🔏 Data Signing Core Features**
- ✅ **Payload Signing**: Cryptographically sign arbitrary data payloads
- ✅ **Authentication Level Selection**: Choose from 5 auth levels (0-4)
- ✅ **Authenticator Type Selection**: Password, LDA, or Server Biometric
- ✅ **Signing Reason**: Provide human-readable reason for audit trails
- ✅ **Signature Verification**: Unique signature ID for independent verification
- ✅ **Result Display**: Complete signature details with copy-to-clipboard
- ✅ **Form Validation**: Client-side validation before submission
- ✅ **Error Recovery**: Keep form data for retry on errors
- ✅ **SPA Architecture**: Single Page Application with template-based screen rendering

## 🎯 Learning Objectives

By completing this Data Signing with Server Biometric Step-Up Authentication codelab, you'll be able to:

### **🔐 Server Biometric Step-Up Authentication (Primary Focus)**
1. **Implement server biometric step-up** for data signing with `authLevel = 4` and `authenticatorType = 1`
2. **Handle IDV selfie events** with `getIDVSelfieProcessStartConfirmation` for workflow 16
3. **Detect and close selfie screen** in screen-level event handler using NavigationService
4. **Implement screen transition delays** (300ms) to ensure smooth UI updates before showing results
5. **Handle result events properly** in `onAuthenticateUserAndSignData` with error priority checking
6. **Navigate to result screen** after selfie closure with transition delay
7. **Debug IDV workflow 16** and distinguish from other IDV workflows (opt-in, KYC, notifications)
8. **Implement complete Cordova UI flow** from form submission through biometric to result display
9. **Test server biometric scenarios** including success, failure, and cancellation
10. **Understand authLevel configuration** and how it determines authentication method
11. **Integrate liveness detection** with Aware FaceCapture library for anti-spoofing

### **🔏 Data Signing Core Implementation**
12. **Implement data signing form** with payload, auth level, authenticator type, and reason inputs
13. **Call authenticateUserAndSignData API** with proper parameters and SDK enums
14. **Handle async signing flow** with event-driven architecture (sync call → async event)
15. **Display signing results** with signature, signature ID, and metadata
16. **Implement error handling** with priority checks (error code → status code)
17. **Show user-friendly alerts** on the input screen for retry capability
18. **Format results for display** excluding internal error/status fields
19. **Implement copy-to-clipboard** for signature values
20. **Validate form inputs** before submission

### **📱 LDA & Password Step-Up Authentication**
21. **Understand LDA behavior** and how SDK handles biometric authentication internally
22. **Implement LDA fallback** when user cancels biometric and password is enrolled
23. **Handle LDA-only scenarios** where password fallback is not available (error 131)
24. **Implement password challenge modal** for password step-up authentication (challenge mode 12)
25. **Handle password attempts** and display remaining attempts

### **Cordova SPA Implementation Skills**
26. **Use NavigationService** for SPA template swapping navigation
27. **Implement screen lifecycle** with onContentLoaded(params) pattern
28. **Handle SDK events** in screen-level handlers for clean architecture
29. **Preserve form state** on errors for better user experience
30. **Debug authentication flows** and troubleshoot integration issues

## 🔑 Step-Up Authentication Logic

**Important**: This codelab focuses on data signing with multi-method step-up authentication. Step-up authentication requires the user to be logged in. The authentication method used depends on the **`authLevel`** and **`authenticatorType`** parameters you provide when calling `authenticateUserAndSignData()`.

### Authentication Method Selection Matrix

| Auth Level | Authenticator Type | Supported Authenticator | When Used |
|------------|-------------------|------------------------|-----------|
| **0** (NONE) | **0** (NONE) | NA | No authentication required |
| **1** (RDNA_AUTH_LEVEL_1) | **0** (NONE) | LDA, Device Passcode, Password, IDVServerBiometric | SDK auto-selects from enrolled methods |
| **2** (RDNA_AUTH_LEVEL_2) | NA | ⚠️ Not Supported | SDK will error out if used |
| **3** (RDNA_AUTH_LEVEL_3) | **2** (RDNA_AUTH_PASS) | REL-ID Manual Password | Standard security with password |
| **3** (RDNA_AUTH_LEVEL_3) | **3** (RDNA_AUTH_LDA) | REL-ID LDA (Local Device Auth) | Standard biometric signing |
| **4** (RDNA_AUTH_LEVEL_4) | **1** (RDNA_IDV_SERVER_BIOMETRIC) | **🔐 IDVServerBiometric** | High-security signing with liveness |

### Key Authentication Behaviors

**🔐 Server Biometric Authentication (authLevel = 4, authenticatorType = 1)**:
- When app calls **`authenticateUserAndSignData(payload, 4, 1, reason)`** → SDK triggers **Server Biometric** flow
- SDK fires `getIDVSelfieProcessStartConfirmation` event with **`idvWorkflow = 16`**
- SDKIDVEventProvider automatically navigates to IDVSelfieProcessStart screen
- User taps "Start Selfie Capture" to initiate biometric verification
- Native SDK captures selfie with **liveness detection** via Aware FaceCapture library
- SDK verifies biometric template on server and triggers `onAuthenticateUserAndSignData` event
- DataSigningInputScreen detects selfie screen, closes it, waits 300ms, then shows result
- Works regardless of login method or enrolled authentication methods
- **Use Case**: High-security data signing like financial transactions, legal documents, sensitive data

**📱 LDA Authentication (authLevel = 3, authenticatorType = 3)**:
- When app calls **`authenticateUserAndSignData(payload, 3, 3, reason)`** → SDK triggers **LDA** flow
- SDK handles biometric prompt internally (no custom UI needed)
- Native platform biometric prompt appears (Face ID, Touch ID, Fingerprint)
- User authenticates with platform biometric → `onAuthenticateUserAndSignData` event with success
- **LDA Cancellation Fallback**:
  - If **Password is enrolled**: SDK automatically falls back to password (seamless, no error)
  - If **Password is NOT enrolled**: Error code 131 in `onAuthenticateUserAndSignData` (user can retry)
- **Use Case**: Standard-security data signing like user preferences, non-critical data

**📝 Password Authentication (authLevel = 3, authenticatorType = 2)**:
- When app calls **`authenticateUserAndSignData(payload, 3, 2, reason)`** → SDK triggers **Password** flow
- SDK triggers `getPassword` event with `challengeMode = 12` (data signing specific)
- PasswordChallengeModal displays for password entry
- User enters password → `setPassword(password, 12)` called
- SDK verifies password and triggers `onAuthenticateUserAndSignData` event
- **Use Case**: Basic re-authentication, fallback when biometric unavailable

## 🆔 Server Biometric Step-Up Flow (IDV Workflow 16)

The server biometric step-up authentication provides an additional layer of security for data signing operations by requiring real-time biometric verification with liveness detection.

### What Makes Workflow 16 Special in Cordova?

| IDV Workflow | Scenario | When Used | Cordova Navigation Pattern |
|--------------|----------|-----------|---------------------------|
| **16** | **Data Signing Step-Up Auth** | **Sensitive data signing requiring biometric** | **Navigate back to DataSigningInput + 300ms delay + alert or result** |
| 9 | Notification Step-Up Auth | Sensitive notification actions | Navigate back + alert pattern |
| 10 | Biometric Opt-In | User enrolling in biometric authentication | Navigate to result screen |
| 6 | Post-Login KYC | Know Your Customer verification after login | Navigate to result screen |

### Server Biometric Event Flow for Data Signing (Cordova SPA Pattern)

```
User Submits Data Signing Form (authLevel=4, authenticatorType=1)
    ↓
authenticateUserAndSignData(payload, 4, 1, reason) API Called
    ↓
SDK Returns: Sync Response (request accepted)
    ↓
SDK Triggers: getIDVSelfieProcessStartConfirmation (idvWorkflow: 16)
    ↓
SDKIDVEventProvider: NavigationService.navigate('IDVSelfieProcessStart', { idvWorkflow: 16 })
    ↓
User on IDVSelfieProcessStart Screen:
  - Reads selfie capture guidelines (workflow 16 specific)
  - Taps "Start Selfie Capture"
  - SDK calls setIDVSelfieProcessStartConfirmation(true, false, 16)
    ↓
SDK Opens Native Camera (Aware FaceCapture):
  - Captures selfie with liveness detection
  - Performs anti-spoofing checks
  - Signs data cryptographically
  - Validates biometric template against server
    ↓
SDK Triggers: onAuthenticateUserAndSignData Event
    ↓
DataSigningInputScreen.handleDataSigningResponse():
  1. Checks: NavigationService.currentRoute === 'IDVSelfieProcessStart'
  2. If true: closeSelfieScreenIfPresent()
       - NavigationService.navigate('DataSigningInput', { userID, sessionID })
       - return true (screen was closed)
  3. setTimeout(() => {
       processDataSigningResult(data);  // Process after 300ms delay
     }, 300);
  4. processDataSigningResult():
       - Check error.longErrorCode !== 0 (priority 1)
       - If error: window.alert('Data Signing Failed: ' + errorMessage)
       - Check status.statusCode !== 100 (priority 2)
       - If status error: window.alert('Data Signing Failed: ' + statusMessage)
       - If success: NavigationService.navigate('DataSigningResult', { resultData })
    ↓
User sees result on DataSigningResultScreen or error alert on DataSigningInput
```

### Key Cordova SPA Patterns for Data Signing

**1. Close Selfie Screen Before Processing (300ms Delay)**
```javascript
// DataSigningInputScreen.js
handleDataSigningResponse(data) {
  // Check if selfie screen is active
  const selfieScreenWasClosed = this.closeSelfieScreenIfPresent();

  if (selfieScreenWasClosed) {
    // Navigate back to input screen
    NavigationService.navigate('DataSigningInput', this.sessionParams);

    // Wait 300ms for smooth transition
    setTimeout(() => {
      this.processDataSigningResult(data);
    }, 300);
    return;
  }

  // Process immediately if no selfie screen
  this.processDataSigningResult(data);
}
```

**2. Error Priority Checking with Alerts**
```javascript
// DataSigningInputScreen.js
processDataSigningResult(data) {
  // PRIORITY 1: Check error code
  if (data.error.longErrorCode !== 0) {
    const errorMessage = DataSigningService.getErrorMessage(data.error.longErrorCode);
    window.alert('Data Signing Failed\n\n' + errorMessage);
    this.showError(errorMessage);  // Also show in error div
    return;
  }

  // PRIORITY 2: Check status code
  if (data.status.statusCode !== 100) {
    const statusMessage = data.status.statusMessage || 'Operation failed';
    window.alert('Data Signing Failed\n\n' + statusMessage);
    this.showError(statusMessage);
    return;
  }

  // SUCCESS: Navigate to result screen
  NavigationService.navigate('DataSigningResult', { resultData: data });
}
```

**3. Selfie Screen Detection**
```javascript
// DataSigningInputScreen.js
closeSelfieScreenIfPresent() {
  // Check if IDVSelfieProcessStart screen is currently active
  if (NavigationService.currentRoute === 'IDVSelfieProcessStart') {
    console.log('IDVSelfieProcessStart detected, closing it');

    // Navigate back to input screen
    NavigationService.navigate('DataSigningInput', {
      userID: this.userID,
      sessionID: this.sessionID
    });

    return true;  // Screen was closed
  }

  return false;  // Screen not present
}
```

## 📊 Data Signing vs Notifications: Key Differences

Understanding the differences between data signing and notification step-up authentication in Cordova:

| Aspect | Notifications (Workflow 9) | Data Signing (Workflow 16) |
|--------|---------------------------|---------------------------|
| **Use Case** | Approve/reject notification actions | Sign arbitrary data payloads |
| **API Call** | `updateNotification(uuid, action)` | `authenticateUserAndSignData(payload, authLevel, type, reason)` |
| **Event Handler** | `onUpdateNotification` | `onAuthenticateUserAndSignData` |
| **IDV Workflow** | 9 | 16 |
| **Challenge Mode** | 3 (notification step-up) | 12 (data signing step-up) |
| **Handler Location** | GetNotificationsScreen | DataSigningInputScreen |
| **Screen Detection** | NavigationService.currentRoute | NavigationService.currentRoute |
| **Selfie Screen Closure** | Navigate back to GetNotifications | Navigate back to DataSigningInput |
| **Result Display** | Alert → Notifications refresh | Navigate to DataSigningResult screen |
| **Result Data** | Notification status update | Signature, signature ID, metadata |
| **Form State** | No form (action selection only) | Full form (payload, auth level, type, reason) |
| **Error Handling** | Status code checks | Error code → Status code priority |

## 🏗️ Prerequisites

Before starting this data signing with server biometric codelab, ensure you've completed:

### **Required Codelabs** (Must Complete First)
- **REL-ID MFA Codelab** - Complete MFA implementation required for login
- **Biometric Template Created** - User must have biometric template stored on server (complete Biometric Opt-In flow first)

### **Knowledge Prerequisites**
- Understanding of Cordova plugin architecture and native bridge patterns
- Experience with Single Page Application (SPA) architecture
- Knowledge of JavaScript ES6+ features and Promise patterns
- Familiarity with REL-ID SDK authentication challenge modes
- Basic understanding of cryptographic signing concepts
- Understanding of biometric authentication and liveness detection concepts
- Experience with event-driven architectures

## 📁 Data Signing Project Structure (Cordova SPA)

```
relid-IDV-post-login-data-signing/
├── 📱 Cordova Single Page Application Architecture
│   ├── platforms/               # Platform-specific builds (iOS, Android)
│   ├── plugins/                 # Cordova plugins
│   │   ├── cordova-plugin-file/            # File system access plugin
│   │   └── cordova-plugin-rdna/            # REL-ID Native Bridge with Aware FaceCapture
│   ├── hooks/                   # Build hooks (IDV asset management)
│   ├── idv-native-resources/    # IDV assets (optional, not needed for data signing)
│   └── www/                     # 🆕 SPA Application Root (see below)

├── 📦 SPA Application Structure (www/)
│   ├── index.html               # ⚠️ SINGLE HTML FILE with all templates
│   ├── css/
│   │   └── index.css            # Styles for all screens
│   ├── js/
│   │   └── app.js               # App initialization (deviceready, AppInitializer)
│   └── src/
│       ├── tutorial/            # Data Signing Implementation
│       │   ├── navigation/      # SPA navigation
│       │   │   └── NavigationService.js    # Template swapping with currentRoute tracking
│       │   ├── screens/         # Screen JavaScript modules
│       │   │   ├── dataSigning/ # 🆕 Data Signing Feature
│       │   │   │   ├── DataSigningInputScreen.js     # Form + event handlers
│       │   │   │   │                                 # - 🆕 closeSelfieScreenIfPresent()
│       │   │   │   │                                 # - 🆕 processDataSigningResult()
│       │   │   │   │                                 # - 🆕 handleDataSigningResponse()
│       │   │   │   │                                 # - Payload input (max 500 chars)
│       │   │   │   │                                 # - Auth level dropdown
│       │   │   │   │                                 # - Authenticator type dropdown
│       │   │   │   │                                 # - Reason input (max 100 chars)
│       │   │   │   │                                 # - Form validation
│       │   │   │   └── DataSigningResultScreen.js    # Display signing results
│       │   │   │                                    # - Payload signature
│       │   │   │                                    # - Data signature ID
│       │   │   │                                    # - Metadata display
│       │   │   │                                    # - Copy to clipboard
│       │   │   ├── idv/         # IDV screens
│       │   │   │   ├── IDVSelfieProcessStartScreen.js     # Selfie capture (workflows 8, 9, 10, 16)
│       │   │   │   ├── biometricOptIn/                    # Biometric opt-in flow
│       │   │   │   ├── biometricOptOut/                   # Biometric opt-out flow
│       │   │   │   └── serverBiometricAuthentication/      # Server biometric auth
│       │   │   └── mfa/         # MFA screens (base authentication)
│       │   │       └── DashboardScreen.js             # Post-login dashboard
│       │   ├── services/        # 🆕 Data Signing Services
│       │   │   ├── DataSigningService.js              # High-level orchestration
│       │   │   │                                     # - signData(payload, authLevel, type, reason)
│       │   │   │                                     # - validateSigningInput()
│       │   │   │                                     # - formatSigningResultForDisplay()
│       │   │   │                                     # - resetState()
│       │   │   │                                     # - getErrorMessage(code)
│       │   │   └── DropdownDataService.js             # Auth level & type options
│       │   │                                         # - getAuthLevelOptions()
│       │   │                                         # - getAuthenticatorTypeOptions()
│       │   │                                         # - convertToNumber()
│       │   └── components/      # Reusable UI components
│       │       └── modals/
│       │           └── PasswordChallengeModal.js      # Password step-up modal
│       └── uniken/              # 🛡️ REL-ID Integration
│           ├── AppInitializer.js                      # One-time SDK initialization
│           ├── components/      # REL-ID UI components
│           │   └── modals/
│           │       └── PasswordChallengeModal.js      # Shared password modal
│           ├── managers/        # State managers
│           │   └── DataSigningSetupAuthManager.js     # Data signing context management
│           ├── providers/       # Event providers
│           │   ├── SDKEventProvider.js                # MFA + Data Signing events
│           │   │                                     # - getPassword handler (challengeMode 12)
│           │   └── SDKIDVEventProvider.js             # IDV event handling
│           │                                         # - getIDVSelfieProcessStartConfirmation
│           ├── services/        # SDK service layer
│           │   ├── rdnaService.js                     # Base SDK APIs
│           │   │                                     # - authenticateUserAndSignData()
│           │   │                                     # - resetAuthenticateUserAndSignDataState()
│           │   │                                     # - setPassword(password, 12)
│           │   ├── rdnaEventManager.js                # Event management
│           │   └── idv/                               # IDV services
│           │       ├── rdnaIDVService.js               # IDV APIs
│           │       └── rdnaIDVEventManager.js          # IDV event management
│           ├── utils/           # Utility functions
│           │   └── connectionProfileParser.js         # File loading with cordova-plugin-file
│           ├── MTDContext/      # MTD threat management
│           └── SessionContext/  # Session management

└── 📚 Production Configuration
    ├── config.xml               # Cordova configuration
    ├── package.json             # Dependencies
    └── README.md                # This comprehensive guide
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-IDV-post-login-data-signing

# Add iOS platform (if not already added)
cordova platform add ios

# Install/update plugins
cordova plugin add cordova-plugin-file
# cordova-plugin-rdna should already be installed

# Prepare platforms (copies www/ files and runs hooks)
cordova prepare ios
```

### IDV Assets Configuration

The project uses an **automated Cordova hook** for IDV asset management, but data signing **does not require document scanning assets**. This flow only needs the Aware FaceCapture library for selfie capture and server biometric verification.

#### What This Project Does NOT Need:

**Document Scanner Assets (Not Required for Data Signing):**

- ❌ `regula.license` - Document reader license (only for document scanning)
- ❌ `db.dat` - 110.5MB Regula document recognition database (only for document scanning)
- ❌ `Certificates.bundle/` - ICAO PKD certificates (only for document scanning)

> **Key Difference**: This codelab demonstrates **server biometric step-up authentication for data signing** which only uses selfie capture with liveness detection. It does NOT scan identity documents, so document scanner assets are not required.

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

> **For This Data Signing Codelab**:
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

### Verify Data Signing with Multi-Method Step-Up Authentication

Once the app launches, verify these data signing capabilities:

**Prerequisites**:

1. ✅ Complete MFA activation flow (user check, activation code, password setup, LDA consent)
2. ✅ User login with activated credentials
3. ✅ Navigate to Dashboard → Open Drawer Menu → Select "🔐 Data Signing"
4. ✅ Data signing form displayed with all inputs

**📝 Form Validation**:

5. ✅ Payload input field accepts up to 500 characters
6. ✅ Character counter shows remaining characters (e.g., "0/500")
7. ✅ Auth level dropdown shows options (RDNA_AUTH_LEVEL_0 through RDNA_AUTH_LEVEL_4)
8. ✅ Authenticator type dropdown shows options (NONE, SERVER_BIOMETRIC, PASSWORD, LDA)
9. ✅ Reason input field accepts up to 100 characters
10. ✅ Character counter shows remaining characters (e.g., "0/100")
11. ✅ Submit button disabled when loading
12. ✅ Validation errors shown for empty/invalid fields

**📝 Password Step-Up Flow (AuthLevel = 3, AuthenticatorType = 2)**:

13. ✅ Fill form with `authLevel = RDNA_AUTH_LEVEL_3` and `authenticatorType = RDNA_AUTH_PASS`
14. ✅ Click "Sign Data" → Loading state activates (button shows "Processing...")
15. ✅ SDK triggers `getPassword` event with `challengeMode = 12`
16. ✅ PasswordChallengeModal appears with data signing context
17. ✅ Enter password → Click Submit
18. ✅ SDK processes signing
19. ✅ DataSigningResultScreen displays with signature details
20. ✅ Copy signature to clipboard works (shows "✓ Copied" feedback)

**📱 LDA Step-Up Flow (AuthLevel = 3, AuthenticatorType = 3)**:

21. ✅ Fill form with `authLevel = RDNA_AUTH_LEVEL_3` and `authenticatorType = RDNA_AUTH_LDA`
22. ✅ Click "Sign Data" → SDK triggers native biometric prompt
23. ✅ Complete Face ID/Touch ID/Fingerprint authentication
24. ✅ DataSigningResultScreen displays with signature details
25. ✅ **LDA Cancellation Test**:
    - User cancels biometric prompt
    - **If password enrolled**: Password modal appears seamlessly ✅
    - **If password NOT enrolled**: Error code 131, alert shown ✅

**🔐 Server Biometric Step-Up Flow (AuthLevel = 4, AuthenticatorType = 1) - PRIMARY FOCUS**:

26. ✅ Fill form with `authLevel = RDNA_AUTH_LEVEL_4` and `authenticatorType = RDNA_IDV_SERVER_BIOMETRIC`
27. ✅ Example payload: "Transfer $10,000 to account 123456"
28. ✅ Example reason: "High-value financial transaction"
29. ✅ Click "Sign Data" → Loading state activates
30. ✅ SDK triggers `getIDVSelfieProcessStartConfirmation` event with `idvWorkflow = 16`
31. ✅ IDVSelfieProcessStart screen appears with data signing specific guidelines:
    - "Data signing requires clear selfie capture for verification."
    - "Position your face clearly for enhanced security."
    - "Face will be verified against your existing biometric profile."
32. ✅ User reviews selfie capture requirements
33. ✅ Camera selection checkbox works (front/back camera toggle)
34. ✅ Tap "Start Selfie Capture" → Native SDK captures selfie with liveness detection
35. ✅ SDK processes server biometric verification
36. ✅ SDK signs data cryptographically
37. ✅ SDK triggers `onAuthenticateUserAndSignData` event
38. ✅ **Screen handler detects selfie screen**:
    - Console shows: "IDVSelfieProcessStart screen detected for data signing, closing it"
39. ✅ **Selfie screen auto-closes**:
    - NavigationService.navigate('DataSigningInput') called
    - Console shows: "Selfie screen closed"
40. ✅ **300ms delay applied**:
    - Console shows: "Delaying result processing for screen transition (300ms)"
41. ✅ **Result processing after delay**:
    - Console shows: "Processing data signing result after screen close"
42. ✅ DataSigningResultScreen displays (not behind selfie screen)
43. ✅ Signature details all present:
    - Payload Signature (long hex string)
    - Data Signature ID (unique identifier)
    - Reason (from form input)
    - Data Payload (original text)
    - Auth Level (RDNA_AUTH_LEVEL_4)
    - Authentication Type (RDNA_IDV_SERVER_BIOMETRIC)
    - Data Payload Length (character count)
44. ✅ Copy to clipboard works for all fields
45. ✅ "Sign Another Document" button works (resets state, returns to input form)

**Error Handling**:

46. ✅ Error code !== 0 shows alert on DataSigningInput screen with error message
47. ✅ Status code !== 100 shows alert with status message
48. ✅ Form data preserved after error for retry (payload, auth level, authenticator type, reason all retained)
49. ✅ Password modal hidden on error
50. ✅ Loading state cleared on error (button returns to "Sign Data")
51. ✅ User can retry from same screen without re-entering data

**Selfie Cancellation Test**:

52. ✅ Fill form with server biometric parameters
53. ✅ Navigate to selfie screen
54. ✅ Click "Cancel" or "Close" button
55. ✅ Selfie screen closes, returns to DataSigningInput
56. ✅ Form data still present
57. ✅ User can retry signing

## 🧪 Testing Scenarios

### Test 1: Server Biometric Step-Up Success (authLevel=4)

**Steps:**
1. Login to app
2. Navigate to "Data Signing"
3. Fill form:
   - Payload: "Test data for signing"
   - Auth Level: RDNA_AUTH_LEVEL_4
   - Authenticator Type: RDNA_IDV_SERVER_BIOMETRIC
   - Reason: "Testing server biometric"
4. Click "Sign Data"
5. Verify navigation to IDVSelfieProcessStart screen
6. Verify workflow 16 guidelines displayed
7. Tap "Start Selfie Capture"
8. Complete selfie capture with liveness detection
9. Verify selfie screen closes automatically
10. Verify 300ms delay
11. Verify DataSigningResult screen appears
12. Verify signature details all present
13. Test copy to clipboard for each field

**Expected Result**: ✅ Smooth flow from form → selfie → result screen

### Test 2: Server Biometric with User Cancellation

**Steps:**
1. Navigate to "Data Signing"
2. Fill form with server biometric parameters
3. Click "Sign Data"
4. IDVSelfieProcessStart screen appears
5. **Click Cancel button**
6. Verify returns to DataSigningInput screen
7. Verify form data preserved
8. Verify can retry signing

**Expected Result**: ✅ Clean cancellation with form data preserved

### Test 3: LDA Step-Up Success (authLevel=3)

**Steps:**
1. Navigate to "Data Signing"
2. Fill form:
   - Auth Level: RDNA_AUTH_LEVEL_3
   - Authenticator Type: RDNA_AUTH_LDA
3. Click "Sign Data"
4. Platform biometric prompt appears
5. Authenticate with Face ID/Touch ID/Fingerprint
6. Verify DataSigningResult screen appears
7. Verify signature details present

**Expected Result**: ✅ Quick biometric authentication with result

### Test 4: LDA Cancellation with Password Fallback

**Steps:**
1. Ensure both password and LDA enrolled
2. Navigate to "Data Signing"
3. Fill form with LDA parameters
4. Click "Sign Data"
5. Platform biometric prompt appears
6. **Cancel the biometric prompt**
7. Verify password modal appears seamlessly (no error shown)
8. Enter password, submit
9. Verify DataSigningResult screen appears

**Expected Result**: ✅ Seamless fallback from LDA to password

### Test 5: Password Step-Up Success (authLevel=3)

**Steps:**
1. Navigate to "Data Signing"
2. Fill form:
   - Auth Level: RDNA_AUTH_LEVEL_3
   - Authenticator Type: RDNA_AUTH_PASS
3. Click "Sign Data"
4. Password modal appears
5. Enter password, click Submit
6. Verify DataSigningResult screen appears
7. Verify signature details present

**Expected Result**: ✅ Password authentication successful

### Test 6: Error Handling - Invalid Password

**Steps:**
1. Navigate to "Data Signing"
2. Fill form with password parameters
3. Click "Sign Data"
4. Password modal appears
5. **Enter wrong password**
6. Click Submit
7. Verify error alert shows
8. Verify form data preserved
9. Verify can retry with correct password

**Expected Result**: ✅ Error handled gracefully with retry capability

## 🐛 Troubleshooting

### Selfie Screen Doesn't Close After Data Signing

**Symptom**: Selfie screen remains visible after signing completes

**Solution**: Verify screen name detection in `closeSelfieScreenIfPresent()`:

```javascript
// ✅ CORRECT - Check for 'IDVSelfieProcessStart'
if (NavigationService.currentRoute === 'IDVSelfieProcessStart') {
  NavigationService.navigate('DataSigningInput', sessionParams);
  return true;
}

// ❌ WRONG - Checking wrong screen name
if (NavigationService.currentRoute === 'IDVSelfieProcessStartConfirmation') {
  // This won't match!
}
```

### Alert Shows Behind Selfie Screen

**Symptom**: Error or success alert appears but selfie screen still visible

**Solution**: Ensure navigation happens BEFORE alert, with 300ms delay:

```javascript
// ✅ CORRECT
const selfieScreenWasClosed = this.closeSelfieScreenIfPresent();

if (selfieScreenWasClosed) {
  setTimeout(() => {
    this.processDataSigningResult(data);  // Alert shown after delay
  }, 300);
  return;
}

// ❌ WRONG - No delay
this.processDataSigningResult(data);
this.closeSelfieScreenIfPresent();  // Too late!
```

### Form Data Lost After Error

**Symptom**: Form fields cleared when error occurs

**Solution**: Ensure form state variables not reset in error handler:

```javascript
// ✅ CORRECT
processDataSigningResult(data) {
  this.setLoading(false);  // Only clear loading state

  if (data.error.longErrorCode !== 0) {
    window.alert('Error: ' + errorMessage);
    this.showError(errorMessage);  // Show error in div
    // Form data (this.payload, this.selectedAuthLevel, etc.) preserved
    return;
  }
  // ...
}

// ❌ WRONG
processDataSigningResult(data) {
  this.clearForm();  // Don't clear form on error!
  // ...
}
```

### Wrong Challenge Mode for Password Dialog

**Symptom**: Password dialog shows but doesn't work for data signing

**Solution**: Use challenge mode 12 (not 3) for data signing:

```javascript
// ✅ CORRECT - Challenge mode 12 for data signing
eventManager.setGetPasswordHandler((data) => {
  if (data.challengeMode === 12) {  // Data signing
    DataSigningSetupAuthManager.showPasswordDialog(data);
  }
});

// When submitting password
rdnaService.setPassword(password, 12);  // Use mode 12

// ❌ WRONG - Challenge mode 3 is for other step-up scenarios
if (data.challengeMode === 3) { ... }
rdnaService.setPassword(password, 3);
```

### IDV Workflow 16 Not Recognized

**Symptom**: Server biometric doesn't trigger for data signing

**Solution**: Verify backend configuration and API parameters:

1. ✅ Ensure user has biometric template (complete Biometric Opt-In first)
2. ✅ Verify `authLevel = 4` and `authenticatorType = 1` passed to API
3. ✅ Check backend configured to return workflow 16 for data signing
4. ✅ Verify SDKIDVEventProvider initialized in AppInitializer
5. ✅ Check console for `getIDVSelfieProcessStartConfirmation` event logs

## 🎓 Summary

Congratulations! You've mastered data signing with server biometric step-up authentication in Cordova:

✅ **Server Biometric Step-Up (authLevel=4)** - High-security data signing with liveness detection and automatic selfie screen closure
✅ **LDA Step-Up (authLevel=3)** - Platform biometric with seamless password fallback
✅ **Password Step-Up (authLevel=3)** - Challenge mode 12 for data signing authentication
✅ **SPA Navigation Patterns** - Navigate back before showing results with 300ms delay
✅ **Data Signing** - Cryptographic signing with signature verification and audit trails
✅ **Production-Ready UX** - Clean error handling, smooth transitions, form preservation

You're now ready to build secure, enterprise-grade data signing workflows with multi-level authentication! 🚀

---

**Built with ❤️ using REL-ID SDK and Cordova**
