# REL-ID Cordova Codelab: IDV Post-Login KYC Flow

[![Cordova](https://img.shields.io/badge/Cordova-Latest-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-Latest-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/)
[![IDV](https://img.shields.io/badge/IDV-Identity%20Verification-blue.svg)]()
[![KYC](https://img.shields.io/badge/KYC-Post--Login%20Compliance-orange.svg)]()
[![Document Capture](https://img.shields.io/badge/Document%20Capture-Enabled-orange.svg)]()
[![Biometric](https://img.shields.io/badge/Biometric-Selfie%20Verification-purple.svg)]()

> **Codelab Advanced:** Master post-login KYC identity verification workflows for activated customers using REL-ID SDK

This folder contains the source code demonstrating REL-ID IDV Post-Login KYC Flow with comprehensive identity verification for activated customers, including document capture, selfie verification, biometric analysis, and consent management.

## 🔐 What You'll Learn

In this advanced IDV Post-Login KYC Flow codelab, you'll master production-ready identity verification patterns for activated customers:

- ✅ **Activated Customer KYC Initiation**: `initiateActivatedCustomerKYC()` API for post-login KYC workflows
- ✅ **KYC Response Event Handling**: Handle `onActivatedCustomerKYCResponse` events with persistent screen-level handlers
- ✅ **IDV Document Scan Workflow**: `setIDVDocumentScanProcessStartConfirmation()` API with document scanning and validation
- ✅ **Document Details Confirmation**: Handle `getIDVConfirmDocumentDetails` events with OCR-extracted data validation
- ✅ **Selfie Capture Process**: `setIDVSelfieProcessStartConfirmation()` API with biometric selfie capture
- ✅ **Selfie Biometric Verification**: Handle `getIDVSelfieConfirmation` events with face matching and liveness detection results
- ✅ **Biometric Template Consent**: Navigate `getIDVBiometricOptInConsent` events for secure template storage consent
- ✅ **Challenge Mode Based Navigation**: Different close button behavior for pre-login (mode 8) vs post-login (mode 9) flows
- ✅ **Dual Validation Pattern**: Two-tier validation checking both SDK sync errors and backend status codes
- ✅ **SPA Navigation Patterns**: Cordova Single Page Application with template-based content swapping
- ✅ **Native IDV Plugins**: Pre-configured Regula document reader and biometric capture components

## 🎯 Learning Objectives

By completing this IDV Post-Login KYC Flow codelab, you'll be able to:

1. **Implement post-login KYC workflows** for activated customers who need additional identity verification
2. **Handle screen-level persistent event handlers** that remain active even when other screens are on top
3. **Build document verification workflows** with OCR data extraction and user confirmation
4. **Create biometric verification processes** with selfie capture, face matching, and liveness detection
5. **Design consent management screens** for biometric template storage with privacy controls
6. **Implement challenge mode based navigation** with different behaviors for pre-login and post-login flows
7. **Handle dual validation patterns** checking both sync errors and backend status codes
8. **Implement SPA navigation patterns** for seamless screen transitions without page reloads
9. **Debug post-login IDV flows** and troubleshoot identity verification issues
10. **Integrate native IDV components** with Cordova using pre-configured Regula assets

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Cordova Codelab]** - Complete MFA implementation required
- **[REL-ID IDV MFA Activation Cordova Codelab]** - Understanding of pre-login IDV flow recommended
- Understanding of REL-ID SDK event-driven architecture patterns
- Experience with Cordova Single Page Application (SPA) architecture
- Knowledge of identity verification workflows and KYC compliance
- Familiarity with JavaScript ES6+ and complex data structures
- Basic understanding of biometric verification and document validation concepts


## 📁 IDV Post-Login KYC Flow Project Structure

```
relid-IDV-post-login-kyc/
├── 📱 Cordova SPA App with Enhanced IDV Support
│   ├── platforms/               # Platform-specific builds
│   │   ├── android/             # Android platform
│   │   └── ios/                 # iOS platform
│   ├── plugins/                 # Cordova plugins
│   │   ├── cordova-plugin-rdna/ # REL-ID SDK plugin
│   │   │   ├── src/
│   │   │   │   ├── android/     # Android native implementation
│   │   │   │   └── ios/         # iOS native implementation
│   │   │   │       └── RdnaClient.m  # ✅ initiateActivatedCustomerKYC method added
│   │   │   └── www/
│   │   │       └── RdnaClient.js     # JavaScript plugin interface
│   │   ├── cordova-plugin-file/ # File system access (for loading assets)
│   │   └── ...                  # Other plugins
│   └── hooks/                   # Build automation hooks
│       └── after_prepare/
│           └── 001_copy_idv_resources.js  # Auto-copy IDV native resources
│
├── 📦 IDV Post-Login KYC Source Architecture (SPA)
│   └── www/
│       ├── index.html           # ✅ ONE HTML with all templates + shell
│       │                        # - ActivatedCustomerKYC-template added
│       │                        # - Drawer menu link added
│       │                        # - All screen templates embedded
│       │                        # - All scripts loaded once
│       ├── css/
│       │   └── index.css        # Styles for all screens
│       ├── js/
│       │   └── app.js           # App initialization (deviceready)
│       └── src/
│           ├── uniken/          # 🛡️ Enhanced REL-ID Integration
│           │   ├── services/    # 🆕 Enhanced SDK service layer
│           │   │   ├── rdnaService.js                # Base MFA service layer
│           │   │   └── idv/                          # 🆕 IDV service layer
│           │   │       ├── rdnaIDVService.js         # ✅ Complete IDV API methods
│           │   │       │                            # - 🆕 initiateActivatedCustomerKYC()
│           │   │       │                            # - setIDVDocumentScanProcessStartConfirmation()
│           │   │       │                            # - setIDVConfirmDocumentDetails()
│           │   │       │                            # - setIDVSelfieProcessStartConfirmation()
│           │   │       │                            # - setIDVSelfieConfirmation()
│           │   │       │                            # - setIDVBiometricOptInConsent()
│           │   │       └── rdnaIDVEventManager.js    # ✅ Complete IDV event management
│           │   │                                    # - Event listener registration (document.addEventListener)
│           │   │                                    # - Event handler setters
│           │   │                                    # - 🆕 Activated customer KYC response event handling
│           │   │                                    # - Event cleanup
│           │   ├── providers/   # Enhanced providers
│           │   │   ├── SDKEventProvider.js          # Complete MFA event handling
│           │   │   └── SDKIDVEventProvider.js       # Complete IDV event handling (global)
│           │   └── utils/       # Utility functions
│           │       └── connectionProfileParser.js   # ✅ Uses cordova-plugin-file (FileReader)
│           └── tutorial/        # Enhanced MFA + IDV flow
│               ├── navigation/  # SPA navigation
│               │   └── NavigationService.js         # ✅ Template-based content swapping
│               └── screens/     # Screen modules (JavaScript objects)
│                   ├── mfa/     # 🔐 MFA screens (base authentication)
│                   │   ├── CheckUserScreen.js       # User validation
│                   │   ├── SetPasswordScreen.js     # Password creation
│                   │   ├── DashboardScreen.js       # ✅ Main dashboard with drawer
│                   │   └── ...                      # Other MFA screens
│                   └── idv/     # 🆕 IDV Post-Login KYC screens (6 screens)
│                       ├── activatedCustomerKyc/                              # 🆕 Post-Login KYC entry point
│                       │   └── ActivatedCustomerKYCScreen.js                 # ✅ KYC initiation screen
│                       ├── IDVDocumentProcessStartConfirmationScreen.js     # Document scan initiation
│                       ├── IDVConfirmDocumentDetailsScreen.js               # ✅ Document validation (challengeMode check)
│                       ├── IDVSelfieProcessStartConfirmationScreen.js       # Selfie capture initiation
│                       ├── IDVSelfieConfirmationScreen.js                  # ✅ Selfie verification (challengeMode check)
│                       └── IDVBiometricOptInConsentScreen.js               # ✅ Biometric consent (challengeMode check)
│
└── 📚 IDV Native Resources
    ├── native-resources/        # IDV assets (auto-copied by hook)
    │   ├── common/              # Shared resources
    │   │   ├── regula.license   # Regula document reader license
    │   │   └── db.dat           # Regula document recognition database (110.5MB)
    │   ├── android/
    │   │   └── certificates/    # ICAO PKD certificates for Android
    │   └── ios/
    │       └── Certificates.bundle/  # ICAO PKD certificates bundle for iOS
    ├── config.xml               # Cordova configuration
    └── package.json             # Dependencies

```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-IDV-post-login-kyc

# Add iOS platform (if not already added)
cordova platform add ios

# Install/update plugins
cordova plugin add cordova-plugin-file
# cordova-plugin-rdna should already be installed

# Prepare platforms (copies www/ files and runs hooks)
cordova prepare ios

# The hook automatically copies IDV native resources:
# - regula.license → iOS Resources
# - db.dat → iOS Resources
# - Certificates.bundle → iOS Resources
```

### IDV Assets Configuration

The project uses an **automated Cordova hook** to configure IDV assets for document verification and biometric capture. Unlike React Native which requires manual asset placement, Cordova handles this automatically during the build process.

#### Required Project Structure:

To use this automated hook in your own Cordova projects, you need the following structure at your **project root**:

```
your-cordova-project/
├── idv-native-resources/          # ⚠️ Required folder at project root
│   ├── common/                    # Shared files (copied to both platforms)
│   │   ├── regula.license         # License file (shared)
│   │   └── db.dat                 # 110.5MB document database (shared)
│   ├── ios/                       # iOS-only files
│   │   └── Certificates.bundle/
│   │       └── icaopkd-002-complete-000325.ldif
│   └── android/                   # Android-only files
│       └── assets/
│           └── Regula/
│               └── certificates/
│                   └── icaopkd-002-complete-000325.ldif
├── hooks/
│   └── after_prepare/
│       └── copy_idv_native_resources.js   # ⚠️ Automated hook script
├── platforms/
├── www/
└── config.xml
```

> **Key Design**: The `common/` folder holds shared resources (db.dat, regula.license) used by both platforms, while `ios/` and `android/` folders contain only platform-specific files.

#### How the Hook Works:

**Hook Script:** `hooks/after_prepare/copy_idv_native_resources.js`

When you run `cordova prepare` or `cordova build`, this hook automatically copies assets from `idv-native-resources/` to platform-specific directories:

**iOS Destinations (Automated by Hook):**

- `common/regula.license` → `platforms/ios/<AppName>/Resources/regula.license`
- `common/db.dat` → `platforms/ios/<AppName>/Resources/db.dat`
- `ios/Certificates.bundle/` → `platforms/ios/<AppName>/Resources/Certificates.bundle/`

**Android Destinations (Automated by Hook):**

- `common/regula.license` → `platforms/android/app/src/main/res/raw/regula.license`
- `common/db.dat` → `platforms/android/app/src/main/assets/Regula/db.dat`
- `android/assets/Regula/certificates/` → `platforms/android/app/src/main/assets/Regula/certificates/`

> **Important**:
> 
> - The `idv-native-resources/` folder must exist at your **project root** with the exact structure shown above
> - The hook `copy_idv_native_resources.js` must be in `hooks/after_prepare/` directory
> - Shared resources (db.dat, regula.license) go in `common/` folder
> - Platform-specific files go in `ios/` or `android/` folders
> - Assets are automatically copied during `cordova prepare` - no manual setup needed
> - If assets are missing, the hook will log warnings but won't fail the build
> - The hook also registers resources in Xcode project for iOS automatically

### Run the Application

```bash
# Build and run on iOS
cordova build ios
cordova run ios

# Or open in Xcode for debugging
open platforms/ios/*.xcworkspace
```

### Verify IDV Post-Login KYC Features

Once the app launches, verify these post-login KYC capabilities:

1. ✅ Complete MFA login flow available (user check, password verification)
2. ✅ User login with activated credentials
3. ✅ Navigate to Dashboard → Open Drawer Menu → Select "🆔 Activated Customer KYC"
4. ✅ **6 IDV screens available**: ActivatedCustomerKYC (entry), Document scan start, document confirmation, selfie start, selfie confirmation, biometric consent
5. ✅ Post-login KYC initiation with `initiateActivatedCustomerKYC()` API
6. ✅ IDV document capture workflow with native camera integration
7. ✅ Document OCR data extraction and user validation
8. ✅ IDV selfie capture process with biometric verification
9. ✅ Face matching and liveness detection result display
10. ✅ Biometric template storage consent management
11. ✅ Persistent event handler stays active when IDV screens are on top
12. ✅ Dual validation (SDK sync error + backend status code)
13. ✅ Challenge mode based navigation (different close button behaviors)
14. ✅ Alert dialogs with single OK button (matching native behavior)
15. ✅ Proper navigation back to Dashboard after completion


## 🔑 REL-ID IDV Post-Login KYC APIs

### How to Use IDV Post-Login KYC APIs

REL-ID IDV Post-Login KYC supports six primary identity verification operations:

#### **1. Activated Customer KYC** - Initiate Post-Login KYC
```javascript
const reason = "Post Login KYC"; // KYC reason
await rdnaIDVService.initiateActivatedCustomerKYC(reason);
// SDK initiates post-login KYC workflow
// Wait for onActivatedCustomerKYCResponse event on completion
// SDK will automatically trigger subsequent IDV workflow events
```
- **Use Case**: Begin identity verification for already activated customers who need KYC compliance
- **IDV Workflow**: Automatically uses workflow 6 (RDNA_IDV_POSTLOGIN_KYC)
- **Challenge Mode**: 9 (post-login)
- **Response Event**: `onActivatedCustomerKYCResponse` triggered on completion or cancellation
- **Subsequent Events**: SDK automatically triggers document scan, selfie capture, and consent events

#### **2. Document Scan Start** - Initiate Document Capture
```javascript
const idvWorkflow = 6; // Post-login KYC workflow (RDNA_IDV_POSTLOGIN_KYC)
const isConfirm = true; // User confirmed to start document scan
await rdnaIDVService.setIDVDocumentScanProcessStartConfirmation(isConfirm, idvWorkflow);
// SDK opens native document capture camera
// Wait for getIDVConfirmDocumentDetails event with extracted data
```
- **Use Case**: Begin identity document scanning during post-login KYC
- **IDV Workflow**: 6=Post-Login KYC (RDNA_IDV_POSTLOGIN_KYC)
- **Triggers**: Native camera for document capture with Regula document reader
- **Cancellation**: For post-login flow (workflow 6), triggers `onActivatedCustomerKYCResponse` event with error 240

#### **3. Document Details Confirmation** - Validate Extracted Data
```javascript
const isConfirm = true; // User confirms document details are correct
const challengeMode = 9; // Post-login challenge operation mode
await rdnaIDVService.setIDVConfirmDocumentDetails(isConfirm, challengeMode);
// Wait for getIDVSelfieProcessStartConfirmation event
```
- **Use Case**: User reviews and confirms OCR-extracted document information
- **Challenge Mode**: 9 (post-login), different from 8 (pre-login)
- **Validation States**: OK (valid), ERROR (failed), WARNING (review needed)
- **User Actions**: Confirm details or request document recapture
- **Close Button**: For post-login (mode 9), canceling triggers `onActivatedCustomerKYCResponse` event

#### **4. Selfie Capture Start** - Initiate Biometric Selfie
```javascript
const isConfirm = true; // User confirmed to start selfie capture
const useBackCamera = false; // Use front camera (default for selfies)
const idvWorkflow = 6; // Post-login KYC workflow
await rdnaIDVService.setIDVSelfieProcessStartConfirmation(isConfirm, useBackCamera, idvWorkflow);
// SDK opens native selfie capture camera
// Wait for getIDVSelfieConfirmation event with biometric results
```
- **Use Case**: Begin selfie capture for biometric verification
- **Camera Selection**: Front camera (selfies) or back camera (agent-assisted)
- **Liveness Detection**: SDK performs real-time liveness checks during capture
- **Cancellation**: For post-login flow (workflow 6), triggers `onActivatedCustomerKYCResponse` event with error 240

#### **5. Selfie Confirmation** - Validate Biometric Results
```javascript
const confirmAction = "true"; // User confirms selfie results
const challengeMode = 9; // Post-login challenge operation mode
await rdnaIDVService.setIDVSelfieConfirmation(confirmAction, challengeMode);
// Wait for getIDVBiometricOptInConsent event
```
- **Use Case**: User reviews biometric match results and liveness score
- **Challenge Mode**: 9 (post-login)
- **Verification Metrics**: Face matching score, liveness detection score, overall match
- **User Actions**: Confirm results or request selfie recapture
- **Close Button**: For post-login (mode 9), navigate directly to ActivatedCustomerKYC

#### **6. Biometric Consent** - Template Storage Permission
```javascript
const isOptIn = true; // User consents to biometric template storage
const challengeMode = 9; // Post-login challenge operation mode
await rdnaIDVService.setIDVBiometricOptInConsent(isOptIn, challengeMode);
// IDV biometric capture completes, SDK triggers onActivatedCustomerKYCResponse event
```
- **Use Case**: Request user permission for biometric template storage
- **Challenge Mode**: 9 (post-login)
- **Privacy Consideration**: Template storage enables faster future authentication
- **User Choice**: Accept (faster auth) or reject (complete current auth only)
- **Flow Completion**: After consent, SDK triggers `onActivatedCustomerKYCResponse` event with completion status
- **Close Button**: For post-login (mode 9), navigate directly to ActivatedCustomerKYC


## 🎓 Learning Checkpoints

### Checkpoint 1: Post-Login KYC Architecture Understanding
- [ ] I understand the difference between pre-login activation IDV and post-login KYC IDV
- [ ] I know that post-login KYC uses workflow 6 (RDNA_IDV_POSTLOGIN_KYC) and challenge mode 9
- [ ] I understand the complete flow: Dashboard → Start KYC → Document → Selfie → Consent → Completion
- [ ] I can implement the `initiateActivatedCustomerKYC()` API with proper reason parameter
- [ ] I understand the `onActivatedCustomerKYCResponse` event and its dual validation pattern
- [ ] I know that both global (SDKIDVEventProvider) and screen-level handlers coexist

### Checkpoint 2: Persistent Event Handler Pattern
- [ ] I understand SPA module pattern with `onContentLoaded(params)` lifecycle method
- [ ] I can implement persistent event handlers in `setupEventListeners()` method
- [ ] I know when to use screen-level handlers vs global provider handlers
- [ ] I understand that handlers stay active when screen is unfocused (IDV screens on top)
- [ ] I can manage state with JavaScript object properties instead of React hooks

### Checkpoint 3: Dual Validation Pattern
- [ ] I understand the two-tier validation: sync error first, then backend status code
- [ ] I know that `error.longErrorCode !== 0` indicates SDK sync error
- [ ] I know that `status.statusCode` exists and NOT 100 or 0 indicates backend error
- [ ] I can implement proper error messages showing either error string or status message
- [ ] I understand only showing success when BOTH checks pass

### Checkpoint 4: Challenge Mode Based Navigation
- [ ] I understand the difference between challenge mode 8 (pre-login) and 9 (post-login)
- [ ] I know when to call `resetAuthState()` (only for mode 8)
- [ ] I know when to call cancel APIs (document/selfie confirm) vs direct navigation
- [ ] I can implement challenge mode checks: `if (challengeMode === 8) {...} else {...}`
- [ ] I understand that post-login cancellations trigger `onActivatedCustomerKYCResponse` event

### Checkpoint 5: Document & Selfie Workflow for Post-Login
- [ ] I can handle document scan start with workflow 6 (RDNA_IDV_POSTLOGIN_KYC)
- [ ] I understand document validation with challenge mode 9
- [ ] I can implement document close button: mode 8 → resetAuthState, mode 9 → cancel API
- [ ] I can handle selfie capture with workflow 6
- [ ] I understand selfie close button: mode 8 → resetAuthState, mode 9 → navigate to ActivatedCustomerKYC

### Checkpoint 6: Biometric Consent for Post-Login
- [ ] I understand biometric consent with challenge mode 9
- [ ] I know that post-login consent has different response structure
- [ ] I can implement optional chaining for response structure differences
- [ ] I understand consent close button: mode 8 → resetAuthState, mode 9 → navigate to ActivatedCustomerKYC
- [ ] I know that completion triggers `onActivatedCustomerKYCResponse` event

### Checkpoint 7: SPA Navigation Pattern
- [ ] I understand SPA template-based content swapping (no page reloads)
- [ ] I can use `NavigationService.navigate(screenName, params)` correctly
- [ ] I know that all templates are embedded in ONE index.html file
- [ ] I understand drawer menu integration with SPA navigation
- [ ] I can test that navigation works without white flash or page reload

### Checkpoint 8: Cordova-Specific Patterns
- [ ] I understand `cordova-plugin-file` for loading assets (not fetch())
- [ ] I can use `document.addEventListener()` for SDK events (not NativeEventEmitter)
- [ ] I know how to use `alert()` dialogs instead of React Native Alert.alert()
- [ ] I understand plugin API calls through `com.uniken.rdnaplugin.RdnaClient`
- [ ] I can debug with Safari Web Inspector console logs

## 🔄 IDV Post-Login KYC User Flow

### Complete Flow Diagram

```
1. User Login (Activated Customer)
   ↓
2. Dashboard → Open Drawer Menu → Select "🆔 Activated Customer KYC"
   ↓
3. ActivatedCustomerKYCScreen
   ├─ Display KYC information and guidelines
   ├─ User clicks "Start KYC Verification"
   ├─ initiateActivatedCustomerKYC API called
   ├─ Screen-level event handler registered (stays active)
   └─ SDK initiates post-login KYC workflow (workflow 6, mode 9)
   ↓
4. Document Scan Process
   ├─ getIDVDocumentScanProcessStartConfirmation event
   ├─ setIDVDocumentScanProcessStartConfirmation API (workflow 6)
   ├─ Native Document Capture (Regula)
   ├─ getIDVConfirmDocumentDetails event (mode 9)
   └─ setIDVConfirmDocumentDetails API (mode 9)
   ↓
5. Selfie Capture Process
   ├─ getIDVSelfieProcessStartConfirmation event
   ├─ setIDVSelfieProcessStartConfirmation API (workflow 6)
   ├─ Native Selfie Capture (Liveness Detection)
   ├─ getIDVSelfieConfirmation event (mode 9)
   └─ setIDVSelfieConfirmation API (mode 9)
   ↓
6. Biometric Consent
   ├─ getIDVBiometricOptInConsent event (mode 9)
   └─ setIDVBiometricOptInConsent API (mode 9)
   ↓
7. KYC Completion
   ├─ onActivatedCustomerKYCResponse event triggered
   ├─ Screen-level handler receives event (even if on different screen)
   ├─ Handler navigates back to ActivatedCustomerKYCScreen
   ├─ Dual validation (error.longErrorCode + status.statusCode)
   ├─ alert() dialog shown (Success/Error with single OK button)
   └─ User clicks OK → Navigate to Dashboard
```

> **Key Insight**: Post-login KYC flow uses **workflow 6** (RDNA_IDV_POSTLOGIN_KYC) and **challenge mode 9**, enabling different close button behaviors and validation patterns compared to pre-login activation flow.


## 💡 Pro Tips

### Post-Login KYC Implementation Best Practices
1. **Register screen-level handlers early** - Call in `setupEventListeners()` for persistent handlers
2. **Keep handlers active when unfocused** - Don't unregister in screen blur, only on destroy
3. **Implement dual validation pattern** - Check error.longErrorCode first, then status.statusCode
4. **Handle challenge mode differences** - Different close button behavior for mode 8 vs mode 9
5. **Navigate back before showing alerts** - Ensure user is on correct screen before displaying dialogs
6. **Preserve global handlers** - Screen-level and global (SDKIDVEventProvider) handlers coexist
7. **Test both pre-login and post-login** - Ensure same IDV screens work correctly for both flows
8. **Provide clear user guidance** - Display helpful instructions for document positioning and selfie capture
9. **Handle validation states properly** - Display different UI for OK, ERROR, and WARNING document states
10. **Implement retry mechanisms** - Allow users to recapture documents and selfies when validation fails

### Challenge Mode & Response Structure
11. **Understand response structure differences** - Mode 8 has challengeResponse, mode 9 has status at root
12. **Use optional chaining safely** - `challengeResponse?.status || status` for both structures
13. **Validate workflow types** - Workflow 6 (RDNA_IDV_POSTLOGIN_KYC) for post-login
14. **Handle cancellation errors** - Error 240 (User Cancelled) is expected when user closes screens
15. **Check statusCode values** - Only 100 and 0 are success, all other values are errors

### SPA Navigation & User Experience
16. **Use template-based navigation** - NavigationService.navigate() swaps content, no page reload
17. **Manage state with JavaScript objects** - Use screen.state properties instead of React hooks
18. **Show progress indicators** - Display clear progress through the multi-step KYC flow
19. **Handle consent transparently** - Clearly explain biometric template storage benefits and privacy
20. **Monitor completion rates** - Track where users drop off in KYC flow and optimize those steps
21. **Test edge cases** - Camera permissions, network failures, poor lighting, document quality problems
22. **Optimize camera experience** - Request camera permissions before KYC starts to avoid interruption

### Cordova-Specific Best Practices
23. **Use cordova-plugin-file for assets** - FileReader API for loading JSON files, not fetch()
24. **Log with JSON.stringify()** - Always stringify objects to avoid [object Object] in console
25. **Use document.addEventListener() for events** - SDK events fire as DOM events, not NativeEventEmitter
26. **Call plugin APIs correctly** - Use `com.uniken.rdnaplugin.RdnaClient.method(success, error, [args])`
27. **Parse all plugin responses** - Plugin returns JSON strings, use JSON.parse()
28. **Use alert() for dialogs** - Single OK button matches React Native Alert.alert({ cancelable: false })
29. **Debug with Safari Web Inspector** - Connect device → Safari → Develop → Device → App
30. **Test on real devices** - Camera and biometric features require physical hardware

### IDV Assets & Security
31. **Verify asset placement** - Hook auto-copies db.dat and certificates to iOS Resources
32. **Test license validity** - Confirm regula.license is properly configured and not expired
33. **Secure biometric data** - Never log or expose biometric template data or sensitive document info
34. **Clean up event listeners** - Remove handlers in cleanup to prevent memory leaks
35. **Implement proper error boundaries** - Catch and handle KYC errors without crashing the app

## 🔗 Key Implementation Files

### Core KYC Initiation API
```javascript
// rdnaIDVService.js - Activated Customer KYC API
async initiateActivatedCustomerKYC(reason) {
  return new Promise((resolve, reject) => {
    console.log('RdnaIDVService - Initiating activated customer KYC:', JSON.stringify({ reason }, null, 2));

    com.uniken.rdnaplugin.RdnaClient.initiateActivatedCustomerKYC(
      (response) => {
        console.log('RdnaIDVService - initiateActivatedCustomerKYC sync callback received');
        const result = JSON.parse(response);
        console.log('RdnaIDVService - initiateActivatedCustomerKYC sync response:', JSON.stringify({
          longErrorCode: result.error?.longErrorCode,
          shortErrorCode: result.error?.shortErrorCode,
          errorString: result.error?.errorString
        }, null, 2));

        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaIDVService - Activated customer KYC initiated successfully');
          resolve(result);
        } else {
          console.error('RdnaIDVService - Activated customer KYC initiation error:', JSON.stringify(result, null, 2));
          reject(result);
        }
      },
      (error) => {
        console.error('RdnaIDVService - initiateActivatedCustomerKYC error callback');
        const result = JSON.parse(error);
        reject(result);
      },
      [reason]
    );
  });
}
```

### Screen-Level Event Handler with Dual Validation
```javascript
// ActivatedCustomerKYCScreen.js - Persistent Event Handler with Dual Validation
const ActivatedCustomerKYCScreen = {
  state: {
    userID: '',
    sessionID: '',
    isProcessing: false,
    kycResult: null
  },

  onContentLoaded(params) {
    console.log('ActivatedCustomerKYCScreen - Content loaded with params:', JSON.stringify(params, null, 2));
    this.state = {
      userID: params.userID || '',
      sessionID: params.sessionID || '',
      isProcessing: false,
      kycResult: params.kycResult || null
    };
    this.setupEventListeners();
    if (this.state.kycResult) {
      this.displayKYCResult(this.state.kycResult);
    }
  },

  setupEventListeners() {
    // ... DOM event listeners ...

    // CRITICAL: Register screen-level event handler
    const eventManager = rdnaIDVService.getEventManager();
    eventManager.setActivatedCustomerKYCResponseHandler(
      this.handleActivatedCustomerKYCResponse.bind(this)
    );
    console.log('ActivatedCustomerKYCScreen - Event handler registered for onIDVActivatedCustomerKYCResponse');
  },

  handleActivatedCustomerKYCResponse(data) {
    console.log('ActivatedCustomerKYCScreen - onIDVActivatedCustomerKYCResponse event received:', JSON.stringify(data, null, 2));

    // First fire: Workflow initiated (no status yet)
    if (!data.status || (!data.status.statusCode && data.error?.longErrorCode === 0)) {
      console.log('ActivatedCustomerKYCScreen - KYC workflow initiated (first event), IDV flow will continue');
      return;
    }

    // Second fire: Final result
    console.log('ActivatedCustomerKYCScreen - Final KYC result received, navigating back to screen');
    NavigationService.navigate('ActivatedCustomerKYC', {
      userID: this.state.userID,
      sessionID: this.state.sessionID,
      kycResult: data
    });
  },

  displayKYCResult(data) {
    console.log('ActivatedCustomerKYCScreen - Displaying KYC result');
    this.setProcessing(false);

    const errorCode = data.error?.longErrorCode;
    const errorString = data.error?.errorString;
    const statusCode = data.status?.statusCode;
    const statusMessage = data.status?.statusMessage;

    // Small delay to ensure navigation completes
    setTimeout(() => {
      // Dual validation pattern:
      // 1. Check sync error first
      if (errorCode !== 0) {
        alert('Error\n\n' +
          `KYC initiation failed: ${errorString || 'Failed to initiate KYC verification'} (${errorCode})\n\n` +
          'Click OK to go to Dashboard.');
        NavigationService.navigate('Dashboard', this.state);
      }
      // 2. Check backend status code
      else if (statusCode && statusCode !== 100 && statusCode !== 0) {
        alert('Error\n\n' +
          `KYC initiation failed: ${statusMessage || 'Failed to initiate KYC verification'} (${statusCode})\n\n` +
          'Click OK to go to Dashboard.');
        NavigationService.navigate('Dashboard', this.state);
      }
      // 3. Success case
      else {
        alert('Success\n\n' +
          `The KYC process has been completed successfully. ${statusMessage || ''}\n\n` +
          'Click OK to go to Dashboard.');
        NavigationService.navigate('Dashboard', this.state);
      }
    }, 300);

    this.state.kycResult = null;
  }
};

// Expose to global scope for NavigationService
window.ActivatedCustomerKYCScreen = ActivatedCustomerKYCScreen;
```

### Challenge Mode Based Close Button
```javascript
// IDVConfirmDocumentDetailsScreen.js - Challenge Mode Based Navigation
async handleClose() {
  if (this.state.challengeMode === null || this.state.challengeMode === undefined) {
    this.showError('Invalid challenge mode. Unable to close.');
    return;
  }

  this.setProcessing(true);
  this.hideError();

  try {
    if (this.state.challengeMode === 8) {
      // Pre-login flow: Call resetAuthState
      console.log('IDVConfirmDocumentDetails - Pre-login flow detected, calling resetAuthState to cancel IDV flow');
      await rdnaService.resetAuthState();
      console.log('IDVConfirmDocumentDetails - ResetAuthState successful');
    } else {
      // Post-login flow: Navigate to ActivatedCustomerKYC screen
      console.log('IDVConfirmDocumentDetails - Post-login flow detected, navigating to ActivatedCustomerKYC screen');
      NavigationService.navigate('ActivatedCustomerKYC', {
        userID: this.state.eventData?.userID || '',
        sessionID: this.state.eventData?.sessionID || ''
      });
      console.log('IDVConfirmDocumentDetails - Navigated to ActivatedCustomerKYC, button will be auto-enabled');
    }
  } catch (error) {
    console.error('IDVConfirmDocumentDetails - Close button error:', JSON.stringify(error, null, 2));
    const errorMessage = error?.error?.errorString || 'Failed to cancel. Please try again.';
    this.showError(errorMessage);
  } finally {
    this.setProcessing(false);
  }
}
```

### IDV Event Manager with Activated Customer KYC Response
```javascript
// rdnaIDVEventManager.js - Activated Customer KYC Response Event
onActivatedCustomerKYCResponse(event) {
  console.log('RdnaIDVEventManager - Activated customer KYC response event received');

  try {
    const response = event.response || event.detail || event;
    console.log('RdnaIDVEventManager - onActivatedCustomerKYCResponse response:', JSON.stringify(response, null, 2));
    const data = typeof response === 'string' ? JSON.parse(response) : response;

    console.log('RdnaIDVEventManager - User ID:', data.userID);
    console.log('RdnaIDVEventManager - Session ID:', data.sessionID);
    console.log('RdnaIDVEventManager - Reason:', data.reason);
    console.log('RdnaIDVEventManager - Error Code:', data.error?.longErrorCode);
    console.log('RdnaIDVEventManager - Status Code:', data.status?.statusCode);
    console.log('RdnaIDVEventManager - Status Message:', data.status?.statusMessage);

    if (this.activatedCustomerKYCResponseHandler) {
      this.activatedCustomerKYCResponseHandler(data);
    } else {
      console.warn('RdnaIDVEventManager - No handler registered for activated customer KYC response');
    }
  } catch (error) {
    console.error('RdnaIDVEventManager - Failed to parse activated customer KYC response:', error);
  }
}

// Register event listener in constructor
document.addEventListener(
  'onActivatedCustomerKYCResponse',
  this.onActivatedCustomerKYCResponse.bind(this),
  false
);
```

### File Loading with cordova-plugin-file
```javascript
// connectionProfileParser.js - Load JSON files with cordova-plugin-file
async function loadAgentInfo() {
  return new Promise((resolve, reject) => {
    // Get the app's www directory
    const basePath = cordova.file.applicationDirectory + 'www/';
    const filePath = basePath + 'src/uniken/cp/agent_info.json';

    // Use FileReader to read the file
    window.resolveLocalFileSystemURL(filePath,
      (fileEntry) => {
        fileEntry.file(
          (file) => {
            const reader = new FileReader();
            reader.onloadend = function() {
              try {
                const data = JSON.parse(this.result);
                resolve(data);
              } catch (error) {
                reject(new Error(`Failed to parse JSON: ${error.message}`));
              }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
          },
          (error) => reject(error)
        );
      },
      (error) => reject(error)
    );
  });
}
```

## 📚 Related Documentation

### REL-ID Developer Resources
- **[REL-ID Developer Portal](https://developer.uniken.com/)** - Main developer documentation hub
- **[IDV Activated Customer KYC](https://developer.uniken.com/docs/post-login-user-kyc)** - Post-login KYC API documentation

### Cordova Resources
- **[Cordova Documentation](https://cordova.apache.org/docs/en/latest/)** - Official Cordova setup and development guides
- **[Cordova Plugin File](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/)** - File system access plugin documentation
- **[JavaScript ES6+ Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** - Modern JavaScript reference

---

**🔐 Congratulations! You've mastered IDV Post-Login KYC Flow with REL-ID SDK!**

*You're now equipped to implement comprehensive post-login identity verification for activated customers, combining persistent event handlers, dual validation patterns, challenge mode based navigation, and SPA architecture. Use this knowledge to create seamless KYC compliance experiences that enhance security while maintaining excellent user experience for already activated customers who need additional identity verification.*

