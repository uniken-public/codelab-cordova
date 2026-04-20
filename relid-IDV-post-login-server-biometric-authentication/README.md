# REL-ID Cordova Codelab: IDV Post-Login Server Biometric Authentication Flow

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-Latest-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![IDV](https://img.shields.io/badge/IDV-Identity%20Verification-blue.svg)]()
[![Biometric Auth](https://img.shields.io/badge/Biometric%20Auth-Server%20Side-orange.svg)]()
[![Liveness Detection](https://img.shields.io/badge/Liveness%20Detection-Enabled-orange.svg)]()

> **Codelab Advanced:** Master post-login server biometric authentication workflows with liveness detection using REL-ID SDK in Cordova Single Page Application architecture

This folder contains the source code for the solution demonstrating REL-ID IDV Post-Login Server Biometric Authentication Flow with server-side biometric verification and liveness detection for activated customers.

## 🔐 What You'll Learn

In this advanced IDV Post-Login Server Biometric Authentication Flow codelab, you'll master production-ready server-side biometric authentication patterns for activated customers:

- ✅ **Biometric Template Status Check**: `checkIDVUserBiometricTemplateStatus()` API to verify if user has biometric template stored on server
- ✅ **Server Biometric Authentication Initiation**: `initiateIDVServerBiometricAuthentication()` API for post-login biometric verification workflows
- ✅ **Template Status Event Handling**: Handle `onIDVCheckUserBiometricTemplateStatus` event with status code validation
- ✅ **Authentication Result Event Handling**: Handle `onIDVServerBiometricAuthenticationResult` event with comprehensive audit data
- ✅ **IDV Selfie Capture Workflow**: `setIDVSelfieProcessStartConfirmation()` API with liveness detection specific to workflow 8
- ✅ **Challenge Mode 25 Implementation**: Implement server biometric authentication specific challenge mode handling
- ✅ **Status Code Validation**: Parse status codes (100=Template Exists, 600=No Template) for template availability
- ✅ **Audit Data Display**: Parse and display authentication audit info including status, use case, transaction ID, and attempts left
- ✅ **Liveness Detection Integration**: Native selfie capture with anti-spoofing and face matching against server template
- ✅ **Navigate Back Before Modal Pattern**: Proper navigation back to screen before showing result modal (Cordova SPA pattern)
- ✅ **Screen-Level Event Handlers**: Persistent event handlers registered in setupEventListeners() for native UI workflows
- ✅ **Native IDV Plugins**: Pre-configured Aware FaceCapture library for biometric authentication

## 🎯 Learning Objectives

By completing this IDV Post-Login Server Biometric Authentication Flow codelab, you'll be able to:

1. **Implement post-login server biometric authentication workflows** for activated customers with stored biometric templates
2. **Check biometric template availability** before allowing authentication using template status API
3. **Build server-side biometric verification workflows** with liveness detection and face matching
4. **Handle template status check events** (`onIDVCheckUserBiometricTemplateStatus`) with status code validation
5. **Handle authentication result events** (`onIDVServerBiometricAuthenticationResult`) with comprehensive audit data parsing
6. **Display authentication audit information** including status, orchestration use case, transaction ID, and remaining attempts
7. **Implement challenge mode 25 workflows** specific to server biometric authentication operations
8. **Manage workflow 8 (selfie capture)** configuration and event handling for biometric verification
9. **Navigate properly with result modals** using navigate-back-before-modal pattern maintaining drawer context
10. **Manage screen-level event handlers** persisting during native UI workflows (selfie capture)
11. **Integrate native biometric components** with Cordova using pre-configured Aware FaceCapture library
12. **Debug post-login biometric authentication flows** and troubleshoot template status and verification issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **REL-ID MFA Codelab** - Complete MFA implementation required
- **Biometric Template Setup** - User must have biometric template stored on server (from KYC flow or other biometric opt-in process)
- Understanding of REL-ID SDK event-driven architecture patterns
- Experience with Cordova Single Page Application architecture
- Knowledge of identity verification workflows and biometric authentication concepts
- Familiarity with JavaScript ES6+ features and Promise patterns
- Basic understanding of liveness detection and face matching concepts
- Experience with Cordova plugin integration and native bridge patterns

## 📁 IDV Post-Login Server Biometric Authentication Flow Project Structure

```
relid-IDV-post-login-server-biometric-authentication/
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
│       ├── tutorial/            # Enhanced MFA + IDV flow
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
│       │       └── idv/         # 🆕 IDV Post-Login Server Biometric Authentication screens
│       │           ├── serverBiometricAuthentication/                     # 🆕 Post-Login Server Biometric Auth
│       │           │   └── ServerBiometricAuthenticationScreen.js        # Template check + authentication
│       │           └── IDVSelfieProcessStartConfirmationScreen.js       # Selfie capture initiation (workflow 8)
│       └── uniken/              # 🛡️ Enhanced REL-ID Integration
│           ├── providers/       # Enhanced providers
│           │   ├── SDKEventProvider.js          # Complete MFA event handling
│           │   └── idv/                          # 🆕 IDV event providers
│           │       └── SDKIDVEventProvider.js   # Complete IDV event handling
│           ├── services/        # 🆕 Enhanced SDK service layer
│           │   ├── rdnaService.js                # Base MFA service layer
│           │   └── idv/                          # 🆕 IDV service layer
│           │       ├── rdnaIDVService.js         # Complete IDV API methods
│           │       │                            # - 🆕 checkIDVUserBiometricTemplateStatus()
│           │       │                            # - 🆕 initiateIDVServerBiometricAuthentication(reason)
│           │       │                            # - setIDVSelfieProcessStartConfirmation()
│           │       └── rdnaIDVEventManager.js    # Complete IDV event management
│           │                                    # - Event listener registration
│           │                                    # - Event handler setters
│           │                                    # - 🆕 Template status check event handling
│           │                                    # - 🆕 Server biometric auth result event handling
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
cd relid-IDV-post-login-server-biometric-authentication

# Add iOS platform (if not already added)
cordova platform add ios

# Install/update plugins
cordova plugin add cordova-plugin-file
# cordova-plugin-rdna should already be installed

# Prepare platforms (copies www/ files and runs hooks)
cordova prepare ios

# Note: For server biometric authentication, no additional IDV assets are copied
# The automated hook (if present) will skip document scanner assets
```

### IDV Assets Configuration

The project uses an **automated Cordova hook** for IDV asset management, but server biometric authentication **does not require document scanning assets**. Unlike document scanning flows (Additional Document Scan, KYC), this flow only needs the Aware FaceCapture library for biometric verification.

#### What This Project Does NOT Need:

**Document Scanner Assets (Not Required):**
- ❌ `regula.license` - Document reader license (only for document scanning)
- ❌ `db.dat` - 110.5MB Regula document recognition database (only for document scanning)
- ❌ `Certificates.bundle/` - ICAO PKD certificates (only for document scanning)
- ❌ `idv-native-resources/` folder - Not needed for biometric authentication

> **Key Difference**: This codelab demonstrates **post-login server biometric authentication** which only uses selfie capture with liveness detection. It does NOT scan identity documents, so document scanner assets are not required.

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

> **For This Server Biometric Authentication Codelab**:
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

### Verify IDV Post-Login Server Biometric Authentication Features

Once the app launches, verify these post-login server biometric authentication capabilities:

1. ✅ Complete MFA activation flow available (user check, activation code, password setup, LDA consent)
2. ✅ User login with activated credentials
3. ✅ Navigate to Dashboard → Open Drawer Menu → Select "Biometric Authentication"
4. ✅ **2 IDV screens implemented**: ServerBiometricAuthentication (entry with template check), Selfie process start
5. ✅ Automatic template status check on screen focus with `checkIDVUserBiometricTemplateStatus()` API
6. ✅ Button enabled only if template exists (status code 100)
7. ✅ Post-login biometric authentication initiation with `initiateIDVServerBiometricAuthentication(reason)` API
8. ✅ IDV selfie capture workflow with native camera integration (workflow 8)
9. ✅ Authentication result display with `onIDVServerBiometricAuthenticationResult` event (challenge mode 25)
10. ✅ Audit data display including status, use case, transaction ID, and attempts left
11. ✅ Navigate back before showing result modal pattern (SPA pattern)
12. ✅ Menu button (hamburger icon) works correctly throughout the flow
13. ✅ Event handlers persist during native UI selfie capture workflow

## 🔑 REL-ID IDV Post-Login Server Biometric Authentication APIs

### How to Use IDV Post-Login Server Biometric Authentication APIs

REL-ID IDV Post-Login Server Biometric Authentication supports three primary identity verification operations:

#### **1. Template Status Check** - Verify Biometric Template Exists on Server
```javascript
await rdnaIDVService.checkIDVUserBiometricTemplateStatus();
// SDK checks if user has biometric template stored on server
// Wait for onIDVCheckUserBiometricTemplateStatus event
// Event returns status code: 100=Template Exists, 600=No Template
```
- **Use Case**: Verify user has completed biometric opt-in before allowing authentication
- **Status Codes**:
  - **100**: Template present on server (user can authenticate)
  - **600**: Template does not exist (user must complete biometric opt-in first)
  - **400/500**: Error codes
- **Response Event**: `onIDVCheckUserBiometricTemplateStatus` with status and error codes
- **Best Practice**: Call this API automatically when screen is focused to ensure button is enabled/disabled correctly

#### **2. Server Biometric Authentication** - Initiate Biometric Verification with Liveness
```javascript
const reason = "Server Biometric Authentication"; // Authentication reason
await rdnaIDVService.initiateIDVServerBiometricAuthentication(reason);
// SDK initiates server biometric authentication workflow
// Wait for getIDVSelfieProcessStartConfirmation event
// SDK will automatically trigger subsequent selfie capture events
```
- **Use Case**: Begin server-side biometric verification for already activated customers with stored biometric templates
- **IDV Workflow**: Automatically uses workflow 8 (selfie capture)
- **Challenge Mode**: 25 (server biometric authentication)
- **Reason Parameter**: Use "Server Biometric Authentication" as standard reason
- **Liveness Detection**: Native selfie capture includes anti-spoofing and liveness verification
- **Result Event**: `onIDVServerBiometricAuthenticationResult` triggered on completion with audit data
- **Subsequent Events**: SDK automatically triggers selfie process start confirmation event

#### **3. Selfie Capture Start** - Initiate Liveness Detection
```javascript
const idvWorkflow = 8; // Server biometric authentication workflow
const isConfirm = true; // User confirmed to start selfie capture
const useBackCamera = false; // Use front camera for selfie
await rdnaIDVService.setIDVSelfieProcessStartConfirmation(isConfirm, idvWorkflow, useBackCamera);
// SDK opens native selfie capture camera with liveness detection
// Wait for onIDVServerBiometricAuthenticationResult event with audit data
```
- **Use Case**: Begin selfie capture with liveness detection during server biometric authentication
- **IDV Workflow**: 8=Server Biometric Authentication (selfie capture)
- **Triggers**: Native camera for selfie capture with Aware FaceCapture library (liveness detection)
- **Result Event**: After capture, SDK triggers `onIDVServerBiometricAuthenticationResult` event with challenge mode 25
- **Result Data**: Authentication audit info including status (SUCCESS/FAILURE), orchestration use case, transaction ID, attempts left
- **Cancellation**: When user clicks close button (X), passing `false` triggers `onIDVServerBiometricAuthenticationResult` event with error 240 (User Cancelled)

```javascript
// Cancelling selfie capture on close button
const isConfirm = false; // User cancelled selfie capture
await rdnaIDVService.setIDVSelfieProcessStartConfirmation(isConfirm, idvWorkflow, useBackCamera);
// SDK triggers onIDVServerBiometricAuthenticationResult event with error 240
```

## 💡 Pro Tips

### Post-Login Server Biometric Authentication Implementation Best Practices
1. **Implement automatic template check** - Call `checkIDVUserBiometricTemplateStatus()` automatically in onContentLoaded(), not on button press
2. **Handle template status correctly** - Status code 100 = enable button, 600 = disable button with helpful message
3. **Use standard reason parameter** - Always use "Server Biometric Authentication" as the reason string
4. **Display audit data comprehensively** - Show status, use case, transaction ID, and attempts left in result modal
5. **Implement navigate-back-before-modal** - Always navigate back to screen before showing result modal (300ms delay)
6. **Register handlers in setupEventListeners()** - Ensures handlers persist during native UI workflows
7. **Parse idvResponse structure carefully** - idv_audit_info.status determines SUCCESS/FAILURE, not error codes
8. **Handle missing template gracefully** - Show clear message "Please complete biometric opt-in first" when status code is 600
9. **Enable button only when template exists** - Check `templateStatus.exists && !isCheckingStatus && !isAuthenticating`
10. **Reset UI state on screen load** - Reset `isAuthenticating` and `isCheckingStatus` to false in onContentLoaded()

### Challenge Mode & Workflow Configuration
11. **Understand challenge mode 25** - Server biometric authentication uses challenge mode 25, different from KYC (mode 9) and template check
12. **Validate workflow types** - Workflow 8 (selfie capture) for server biometric authentication
13. **Use correct event handlers** - `onIDVCheckUserBiometricTemplateStatus` for template check, `onIDVServerBiometricAuthenticationResult` for auth result
14. **Handle cancellation with error 240** - When user clicks close button on selfie confirmation screen, error 240 is triggered (expected behavior)
15. **Check error codes properly** - Error 240 means user cancelled, handle it gracefully by showing retry option
16. **Parse status codes correctly** - Status code 100 = template exists, 600 = no template, not error codes

### Navigation & User Experience
17. **Maintain drawer context** - Always use `NavigationService.navigate('ServerBiometricAuthentication')` from result handler
18. **Show template status prominently** - Display clear message whether template exists or not with visual indicators
19. **Handle result modal timing** - Use 300ms delay after navigation before showing modal to ensure smooth transition
20. **Monitor authentication success rates** - Track successful authentications vs failures to optimize liveness detection settings
21. **Test edge cases** - Camera permissions, network failures, server timeouts, template expiration

### Screen-Level Event Handler Management
22. **Register handlers in setupEventListeners()** - Ensures handlers persist during native UI workflows (selfie capture)
23. **Bind handler methods correctly** - Use `.bind(this)` when registering handlers to maintain screen context
24. **Call setupEventListeners in onContentLoaded()** - Ensures handlers are registered when screen is loaded
25. **Use state object for screen data** - Store screen state in `this.state` object for easy access
26. **Clean up on navigation** - Although not always needed in SPA, consider cleanup if screen is destroyed

### Security & Error Handling
27. **Secure biometric data** - Never log or expose sensitive biometric information (video frames, face data)
28. **Implement proper error boundaries** - Catch and handle authentication errors without crashing the app
29. **Validate attempts left** - Show user how many authentication attempts remain before lockout
30. **Handle server errors gracefully** - Network failures, timeout errors, server unavailability

---

## 📚 Related Documentation

### REL-ID Developer Resources
- **[REL-ID Developer Portal](https://developer.uniken.com/)** - Main developer documentation hub
- **[IDV Server Biometric Authentication](https://developer.uniken.com/docs/selfie-biometric-authentication)** - Post-login server biometric authentication API documentation

### Cordova Resources
- **[Cordova Documentation](https://cordova.apache.org/docs/en/latest/)** - Official Cordova setup and development guides
- **[Cordova Plugin Development](https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/)** - Plugin development and integration guide
- **[JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** - Understanding asynchronous JavaScript patterns

---

**🔐 Congratulations! You've mastered IDV Post-Login Server Biometric Authentication Flow with REL-ID SDK in Cordova!**

*You're now equipped to implement production-ready server-side biometric verification for activated customers, combining template status validation, liveness detection, face matching, and comprehensive audit data display with proper navigation patterns and screen-level event handler management in Cordova Single Page Application architecture. Use this knowledge to create secure, user-friendly biometric authentication experiences that verify customer identity with server-stored biometric templates and advanced anti-spoofing protection.*
