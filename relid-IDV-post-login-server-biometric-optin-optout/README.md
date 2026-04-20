# REL-ID Cordova Codelab: IDV Post-Login Server Biometric Opt-In/Opt-Out Flow

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-Latest-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![IDV](https://img.shields.io/badge/IDV-Identity%20Verification-blue.svg)]()
[![Biometric Management](https://img.shields.io/badge/Biometric%20Management-Opt--In%2FOpt--Out-orange.svg)]()
[![Liveness Detection](https://img.shields.io/badge/Liveness%20Detection-Enabled-orange.svg)]()

> **Codelab Advanced:** Master post-login biometric template management with opt-in/opt-out workflows using REL-ID SDK in Cordova Single Page Application architecture

This folder contains the source code demonstrating [REL-ID IDV Post-Login Server Biometric Opt-In/Opt-Out Flow] (https://codelab.uniken.com/codelabs/cordova-idv-postlogin-server-biometric-optin-optout-flow/index.html?index=..%2F..index#0) with biometric template creation, deletion, and LDA fallback patterns for activated customers.

## 🔐 What You'll Learn

In this advanced IDV Post-Login Biometric Opt-In/Opt-Out Flow codelab, you'll master production-ready biometric template management patterns for activated customers:

- ✅ **Biometric Template Status Check**: `checkIDVUserBiometricTemplateStatus()` API to verify if user has biometric template stored on server
- ✅ **Biometric Opt-In Initiation**: `initiateIDVBiometricOptIn()` API for creating biometric templates with selfie capture
- ✅ **Biometric Opt-Out Initiation**: `initiateIDVBiometricOptOut()` API for deleting biometric templates from server
- ✅ **Template Status Event Handling**: Handle `onIDVCheckUserBiometricTemplateStatus` event with status code validation
- ✅ **Opt-In Status Event Handling**: Handle `onIDVBiometricOptInStatus` event with template creation confirmation
- ✅ **Opt-Out Status Event Handling**: Handle `onIDVBiometricOptOutStatus` event with deletion confirmation
- ✅ **Captured Frame Confirmation**: Handle `onIDVOptInCapturedFrameConfirmation` event for image review before submission
- ✅ **IDV Selfie Capture Workflow**: `setIDVSelfieProcessStartConfirmation()` API with liveness detection specific to workflow 10
- ✅ **Challenge Mode 6 Implementation**: Implement biometric opt-in specific challenge mode with password fallback
- ✅ **Challenge Mode 7 Implementation**: Implement biometric opt-out specific challenge mode with password fallback
- ✅ **LDA Fallback Pattern**: Handle `getPassword` event when LDA unavailable with password validation dialog
- ✅ **Status Code Validation**: Parse status codes (100=Success/Template Exists, 600=No Template/Not Found)
- ✅ **Captured Frame Modal**: Review captured selfie with approve/recapture/cancel options
- ✅ **Liveness Detection Integration**: Native selfie capture with anti-spoofing and face matching
- ✅ **Navigate Back Before Modal Pattern**: Proper navigation back to screen before showing result modal (Cordova SPA pattern)
- ✅ **Password Validation Dialog**: Reusable modal for password authentication with attempts counter and error handling
- ✅ **Native IDV Plugins**: Pre-configured Aware FaceCapture library for biometric template creation

## 🎯 Learning Objectives

By completing this IDV Post-Login Biometric Opt-In/Opt-Out Flow codelab, you'll be able to:

1. **Implement biometric template management workflows** for activated customers with opt-in and opt-out capabilities
2. **Check biometric template availability** before allowing opt-in/opt-out operations using template status API
3. **Build biometric opt-in workflows** with selfie capture, liveness detection, and server template storage
4. **Build biometric opt-out workflows** with secure template deletion from server
5. **Handle template status check events** (`onIDVCheckUserBiometricTemplateStatus`) with status code validation
6. **Handle opt-in status events** (`onIDVBiometricOptInStatus`) with template creation confirmation
7. **Handle opt-out status events** (`onIDVBiometricOptOutStatus`) with deletion confirmation
8. **Review captured selfie frames** using `onIDVOptInCapturedFrameConfirmation` event with approve/recapture/cancel actions
9. **Implement LDA fallback pattern** with password validation dialog for challenge modes 6 and 7
10. **Implement challenge mode 6 workflows** specific to biometric opt-in operations with password fallback
11. **Implement challenge mode 7 workflows** specific to biometric opt-out operations with password fallback
12. **Manage workflow 10 (opt-in selfie capture)** configuration and event handling for template creation
13. **Manage workflow 11 (opt-out authentication)** configuration for template deletion
14. **Display comprehensive error messages** from both SDK error codes and backend status codes
15. **Navigate properly with result modals** using navigate-back-before-modal pattern maintaining drawer context
16. **Build reusable password validation dialogs** with attempts counter, error display, and loading states
17. **Integrate native biometric components** with Cordova using pre-configured Aware FaceCapture library
18. **Debug biometric template management flows** and troubleshoot opt-in/opt-out issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **REL-ID MFA Codelab** - Complete MFA implementation required
- **User Account Activation** - User must be activated (completed activation code, set password, LDA consent)
- Understanding of REL-ID SDK event-driven architecture patterns
- Experience with Cordova Single Page Application architecture
- Knowledge of identity verification workflows and biometric authentication concepts
- Familiarity with JavaScript ES6+ features and Promise patterns
- Basic understanding of liveness detection and face matching concepts
- Experience with Cordova plugin integration and native bridge patterns
- Knowledge of LDA (Local Device Authentication) and password fallback patterns

## 📁 IDV Post-Login Biometric Opt-In/Opt-Out Flow Project Structure

```
relid-IDV-post-login-server-biometric-optin-optout/
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
│       │       └── idv/         # 🆕 IDV Biometric Management screens
│       │           ├── biometricOptIn/                              # 🆕 Biometric Opt-In
│       │           │   └── BiometricOptInScreen.js                  # Template creation + selfie
│       │           ├── biometricOptOut/                             # 🆕 Biometric Opt-Out
│       │           │   └── BiometricOptOutScreen.js                 # Template deletion
│       │           ├── serverBiometricAuthentication/               # Server Biometric Auth
│       │           │   └── ServerBiometricAuthenticationScreen.js   # Template check + authentication
│       │           └── IDVSelfieProcessStartConfirmationScreen.js  # Selfie capture initiation (workflows 8, 10)
│       └── uniken/              # 🛡️ Enhanced REL-ID Integration
│           ├── components/      # 🆕 Reusable UI components
│           │   └── modals/                                          # Modal dialogs
│           │       ├── PasswordValidationDialog.js                  # 🆕 Password fallback modal
│           │       └── StepUpPasswordDialog.js                      # Step-up authentication modal
│           ├── providers/       # Enhanced providers
│           │   ├── SDKEventProvider.js          # Complete MFA event handling
│           │   └── idv/                          # 🆕 IDV event providers
│           │       └── SDKIDVEventProvider.js   # Complete IDV event handling
│           ├── services/        # 🆕 Enhanced SDK service layer
│           │   ├── rdnaService.js                # Base MFA service layer
│           │   └── idv/                          # 🆕 IDV service layer
│           │       ├── rdnaIDVService.js         # Complete IDV API methods
│           │       │                            # - 🆕 checkIDVUserBiometricTemplateStatus()
│           │       │                            # - 🆕 initiateIDVBiometricOptIn()
│           │       │                            # - 🆕 initiateIDVBiometricOptOut()
│           │       │                            # - setIDVSelfieProcessStartConfirmation()
│           │       │                            # - initiateIDVServerBiometricAuthentication()
│           │       └── rdnaIDVEventManager.js    # Complete IDV event management
│           │                                    # - Event listener registration
│           │                                    # - Event handler setters
│           │                                    # - 🆕 Opt-in status event handling
│           │                                    # - 🆕 Opt-out status event handling
│           │                                    # - 🆕 Captured frame confirmation event handling
│           │                                    # - Template status check event handling
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
cd relid-IDV-post-login-server-biometric-optin-optout

# Add iOS platform (if not already added)
cordova platform add ios

# Install/update plugins
cordova plugin add cordova-plugin-file
# cordova-plugin-rdna should already be installed

# Prepare platforms (copies www/ files and runs hooks)
cordova prepare ios

# Note: For biometric opt-in/opt-out, no additional IDV assets are copied
# The automated hook (if present) will skip document scanner assets
```

### IDV Assets Configuration

The project uses an **automated Cordova hook** for IDV asset management, but biometric opt-in/opt-out **does not require document scanning assets**. Unlike document scanning flows (Additional Document Scan, KYC), this flow only needs the Aware FaceCapture library for selfie capture and biometric template management.

#### What This Project Does NOT Need:

**Document Scanner Assets (Not Required):**

- ❌ `regula.license` - Document reader license (only for document scanning)
- ❌ `db.dat` - 110.5MB Regula document recognition database (only for document scanning)
- ❌ `Certificates.bundle/` - ICAO PKD certificates (only for document scanning)
- ❌ `idv-native-resources/` folder - Not needed for biometric opt-in/opt-out

> **Key Difference**: This codelab demonstrates **biometric template management (opt-in/opt-out)** which only uses selfie capture with liveness detection. It does NOT scan identity documents, so document scanner assets are not required.

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

> **For This Biometric Opt-In/Opt-Out Codelab**:
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

### Verify IDV Biometric Opt-In/Opt-Out Features

Once the app launches, verify these biometric management capabilities:

1. ✅ Complete MFA activation flow available (user check, activation code, password setup, LDA consent)
2. ✅ User login with activated credentials
3. ✅ Navigate to Dashboard → Open Drawer Menu → Select "Biometric Opt-In" or "Biometric Opt-Out"
4. ✅ **3 IDV screens implemented**: BiometricOptIn (template creation), BiometricOptOut (template deletion), ServerBiometricAuthentication (template verification)
5. ✅ Automatic template status check on screen focus with `checkIDVUserBiometricTemplateStatus()` API
6. ✅ Opt-in button enabled only if template doesn't exist (status code 600)
7. ✅ Opt-out button enabled only if template exists (status code 100)
8. ✅ Biometric opt-in initiation with `initiateIDVBiometricOptIn()` API
9. ✅ Biometric opt-out initiation with `initiateIDVBiometricOptOut()` API
10. ✅ IDV selfie capture workflow with native camera integration (workflow 10 for opt-in)
11. ✅ Captured frame review modal with approve/recapture/cancel actions
12. ✅ LDA fallback with password validation dialog (challenge modes 6 and 7)
13. ✅ Password dialog with attempts counter and error messages
14. ✅ Opt-in result display with `onIDVBiometricOptInStatus` event
15. ✅ Opt-out result display with `onIDVBiometricOptOutStatus` event
16. ✅ Navigate back before showing result modal pattern (SPA pattern)
17. ✅ Menu button (hamburger icon) works correctly throughout the flows
18. ✅ Password dialog hides immediately when status response arrives

## 🔑 REL-ID IDV Biometric Opt-In/Opt-Out APIs

### How to Use IDV Biometric Management APIs

REL-ID IDV Biometric Management supports three primary operations for template lifecycle:

#### **1. Template Status Check** - Verify Biometric Template Exists on Server
```javascript
await rdnaIDVService.checkIDVUserBiometricTemplateStatus();
// SDK checks if user has biometric template stored on server
// Wait for onIDVCheckUserBiometricTemplateStatus event
// Event returns status code: 100=Template Exists, 600=No Template
```
- **Use Case**: Verify user template status before allowing opt-in or opt-out
- **Status Codes**:
  - **100**: Template present on server (user can opt-out or authenticate)
  - **600**: Template does not exist (user can opt-in)
  - **400/500**: Error codes
- **Response Event**: `onIDVCheckUserBiometricTemplateStatus` with status and error codes
- **Best Practice**: Call this API automatically when screen is focused to ensure button is enabled/disabled correctly

#### **2. Biometric Opt-In** - Create Biometric Template on Server
```javascript
await rdnaIDVService.initiateIDVBiometricOptIn();
// SDK initiates biometric opt-in workflow with selfie capture
// Wait for getIDVSelfieProcessStartConfirmation event
// SDK will automatically trigger subsequent selfie capture events
// Wait for onIDVOptInCapturedFrameConfirmation event for image review
// Wait for onIDVBiometricOptInStatus event for final result
```
- **Use Case**: Create and store user's biometric template on server for future authentication
- **IDV Workflow**: Automatically uses workflow 10 (biometric opt-in selfie capture)
- **Challenge Mode**: 6 (biometric opt-in with password fallback)
- **Liveness Detection**: Native selfie capture includes anti-spoofing and liveness verification
- **LDA Fallback**: If LDA unavailable, SDK triggers `getPassword` event (challenge mode 6) for password authentication
- **Captured Frame Event**: After selfie capture, SDK triggers `onIDVOptInCapturedFrameConfirmation` with base64 image for review
- **Result Event**: `onIDVBiometricOptInStatus` triggered on completion with status code (100=Success)
- **Subsequent Events**:
  1. `getIDVSelfieProcessStartConfirmation` → Navigate to confirmation screen
  2. User confirms → SDK opens camera
  3. `onIDVOptInCapturedFrameConfirmation` → Show approve/recapture/cancel modal
  4. User approves → `onIDVBiometricOptInStatus` → Show success/error modal

#### **3. Biometric Opt-Out** - Delete Biometric Template from Server
```javascript
await rdnaIDVService.initiateIDVBiometricOptOut();
// SDK initiates biometric opt-out workflow
// SDK authenticates user with LDA first (or password fallback)
// Wait for onIDVBiometricOptOutStatus event for final result
```
- **Use Case**: Delete user's biometric template from server (privacy, security, user request)
- **IDV Workflow**: Uses workflow 11 (biometric opt-out)
- **Challenge Mode**: 7 (biometric opt-out with password fallback)
- **Authentication Required**: SDK authenticates user with LDA or password before deleting template
- **LDA Fallback**: If LDA unavailable, SDK triggers `getPassword` event (challenge mode 7) for password authentication
- **No Selfie Capture**: Opt-out only requires authentication, not selfie capture
- **Result Event**: `onIDVBiometricOptOutStatus` triggered on completion with status code (100=Success)
- **Flow**:
  1. SDK attempts LDA authentication
  2. If LDA unavailable → `getPassword` event (challenge mode 7) → Show password dialog
  3. User enters password → SDK deletes template
  4. `onIDVBiometricOptOutStatus` → Show success/error modal

#### **4. Selfie Capture Start** - Initiate Liveness Detection for Opt-In
```javascript
const idvWorkflow = 10; // Biometric opt-in workflow
const isConfirm = true; // User confirmed to start selfie capture
const useBackCamera = false; // Use front camera for selfie
await rdnaIDVService.setIDVSelfieProcessStartConfirmation(isConfirm, idvWorkflow, useBackCamera);
// SDK opens native selfie capture camera with liveness detection
// Wait for onIDVOptInCapturedFrameConfirmation event with captured image
```
- **Use Case**: Begin selfie capture with liveness detection during biometric opt-in
- **IDV Workflow**: 10=Biometric Opt-In (selfie capture)
- **Triggers**: Native camera for selfie capture with Aware FaceCapture library (liveness detection)
- **Result Event**: After capture, SDK triggers `onIDVOptInCapturedFrameConfirmation` event with base64 image
- **Image Review**: Show captured frame modal with approve/recapture/cancel options
- **Cancellation**: When user clicks close button (X), passing `false` triggers `onIDVBiometricOptInStatus` event with error 240 (User Cancelled)

```javascript
// Cancelling selfie capture on close button
const isConfirm = false; // User cancelled selfie capture
await rdnaIDVService.setIDVSelfieProcessStartConfirmation(isConfirm, idvWorkflow, useBackCamera);
// SDK triggers onIDVBiometricOptInStatus event with error 240
```

#### **5. Captured Frame Actions** - Approve, Recapture, or Cancel
```javascript
// Approve captured frame - submit to server
const isApproved = true;
await rdnaIDVService.setIDVOptInCapturedFrameConfirmation(isApproved);
// SDK submits image to server for template creation
// Wait for onIDVBiometricOptInStatus event with final result

// Recapture - retake selfie
const isApproved = false;
await rdnaIDVService.setIDVOptInCapturedFrameConfirmation(isApproved);
// SDK reopens camera for new selfie capture
// Wait for new onIDVOptInCapturedFrameConfirmation event

// Cancel opt-in flow
// Navigate back to BiometricOptIn screen without calling API
// User can restart flow by clicking "Start Opt-In" again
```
- **Use Case**: Allow user to review and approve/recapture selfie before server submission
- **Approve**: Submits image to server, creates biometric template
- **Recapture**: Opens camera again for new selfie
- **Cancel**: Abandons opt-in flow, returns to BiometricOptIn screen

## 💡 Pro Tips

### Biometric Template Management Best Practices
1. **Implement automatic template check** - Call `checkIDVUserBiometricTemplateStatus()` automatically in onContentLoaded(), not on button press
2. **Handle template status correctly** - Status code 100 = enable opt-out/disable opt-in, 600 = enable opt-in/disable opt-out
3. **Display status messages prominently** - Show clear message whether template exists or not with visual indicators
4. **Enable/disable buttons based on status** - Opt-in enabled when template doesn't exist, opt-out enabled when template exists
5. **Reset UI state on screen load** - Reset `isOptingIn/isOptingOut` and `isCheckingStatus` to false in onContentLoaded()

### LDA Fallback & Password Validation
6. **Implement password fallback gracefully** - Show PasswordValidationDialog when `getPassword` event fires with challenge mode 6 or 7
7. **Filter events by challenge mode** - Only handle challenge mode 6 in opt-in screen, challenge mode 7 in opt-out screen
8. **Chain event handlers properly** - Store original `getPassword` handler and call it for other challenge modes
9. **Display attempts left prominently** - Show remaining password attempts with color coding (green → orange → red)
10. **Handle password errors comprehensively** - Check both errorCode and statusCode from getPassword event and setPassword response

### Captured Frame Review
11. **Show captured image for review** - Display base64 image in modal with approve/recapture/cancel actions
12. **Handle recapture properly** - Calling `setIDVOptInCapturedFrameConfirmation(false)` triggers new selfie capture
13. **Allow cancellation** - Provide cancel button to abandon opt-in flow without API call
14. **Navigate back before modal** - Always navigate to BiometricOptIn before showing captured frame modal (300ms delay)
15. **Clear captured image state** - Reset captured image data after modal dismissed

### Event Handling & Navigation
16. **Hide dialogs before navigation** - Hide password dialog and captured frame modal in status event handlers BEFORE navigation
17. **Navigate back before result modal** - Always navigate to originating screen before showing result modal (SPA pattern)
18. **Use 300ms delay for modals** - Ensures navigation completes before showing modal for smooth UX
19. **Maintain drawer context** - Always use `NavigationService.navigate()` from result handlers to keep drawer accessible
20. **Register handlers in setupEventListeners()** - Ensures handlers persist during native UI workflows (selfie capture)

### Error Handling & Validation
21. **Check errorCode !== 0** - Primary error check from SDK responses
22. **Check statusCode !== 100 && statusCode !== 0** - Secondary error check from backend status
23. **Display specific error messages** - Show errorString for SDK errors, statusMessage for backend errors
24. **Handle error 240 gracefully** - User cancellation error, not a failure - allow retry
25. **Parse challengeResponse.status** - Status codes nested in `data.challengeResponse.status`, not `data.status`

### UI/UX Best Practices
26. **Use menu buttons in drawer screens** - BiometricOptIn and BiometricOptOut use menu button (☰), not back button
27. **Show loading states** - Display "Checking Status...", "Processing...", "Verifying..." during async operations
28. **Provide visual feedback** - Color-coded status messages (blue=checking, green=success, orange=warning, red=error)
29. **Make buttons accessible** - Full-width buttons with large padding (16px) and white text on colored backgrounds
30. **Add horizontal spacing to modals** - 16px padding on left/right for captured frame modal buttons

### Security & Data Privacy
31. **Never log sensitive biometric data** - Don't log base64 images, face data, or biometric templates
32. **Clear sensitive data after use** - Clear captured frame image and password from state after processing
33. **Implement proper authentication** - Require LDA or password before allowing opt-out (prevents unauthorized deletion)
34. **Validate user consent** - Ensure user understands opt-in creates template, opt-out deletes template
35. **Handle template lifecycle properly** - Template creation (opt-in), usage (authentication), deletion (opt-out)

### Testing & Debugging
36. **Test complete flows end-to-end** - Opt-in with selfie + approve, opt-in with recapture, opt-out with LDA, opt-out with password
37. **Test LDA fallback** - Disable LDA to test password dialog appearance
38. **Test error scenarios** - Network failures, invalid passwords, camera permissions, cancellations
39. **Verify status code handling** - Template exists (100), no template (600), error codes (400/500)
40. **Monitor console logs** - Use JSON.stringify() for all object logging to see readable data

---

## 📚 Related Documentation

### REL-ID Developer Resources
- **[REL-ID Developer Portal](https://developer.uniken.com/)** - Main developer documentation hub
- **[IDV Biometric Opt-In](https://developer.uniken.com/docs/opt-in-opt-out-of-selfie-registration)** - Biometric template creation API documentation
- **[IDV Biometric Opt-Out](https://developer.uniken.com/docs/biometric-opt-out)** - Biometric template deletion API documentation

### Cordova Resources
- **[Cordova Documentation](https://cordova.apache.org/docs/en/latest/)** - Official Cordova setup and development guides
- **[Cordova Plugin Development](https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/)** - Plugin development and integration guide
- **[JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** - Understanding asynchronous JavaScript patterns

---

**🔐 Congratulations! You've mastered IDV Post-Login Biometric Opt-In/Opt-Out Flow with REL-ID SDK in Cordova!**

*You're now equipped to implement production-ready biometric template management for activated customers, combining template status validation, selfie capture with liveness detection, LDA fallback patterns, captured frame review, password validation dialogs, and comprehensive error handling with proper navigation patterns in Cordova Single Page Application architecture. Use this knowledge to create secure, user-friendly biometric management experiences that give users complete control over their biometric data lifecycle.*
