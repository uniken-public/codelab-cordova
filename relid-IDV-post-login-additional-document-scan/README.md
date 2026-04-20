# REL-ID Cordova Codelab: IDV Post-Login Additional Document Scan Flow

[![Cordova](https://img.shields.io/badge/Cordova-Latest-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-Latest-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/)
[![IDV](https://img.shields.io/badge/IDV-Identity%20Verification-blue.svg)]()
[![Document Scan](https://img.shields.io/badge/Document%20Scan-Additional%20Verification-orange.svg)]()
[![Document Capture](https://img.shields.io/badge/Document%20Capture-Enabled-orange.svg)]()

> **Codelab Advanced:** Master post-login additional document scan workflows for activated customers using REL-ID SDK

This folder contains the source code demonstrating [REL-ID IDV Post-Login Additional Document Scan Flow](https://codelab.uniken.com/codelabs/cordova-idv-postlogin-additional-document-scan-flow/index.html?index=..%2F..index#0) with streamlined document verification for activated customers who need to submit additional identity documents beyond the initial KYC process.

## 🔐 What You'll Learn

In this advanced IDV Post-Login Additional Document Scan Flow codelab, you'll master production-ready additional document verification patterns for activated customers:

- ✅ **Additional Document Scan Initiation**: `initiateIDVAdditionalDocumentScan()` API for post-login additional document verification workflows
- ✅ **Document Scan Validation Event Handling**: Handle `onIDVAdditionalDocumentScan` validation events with comprehensive result display
- ✅ **IDV Document Scan Workflow**: `setIDVDocumentScanProcessStartConfirmation()` API with document scanning specific to workflow 7
- ✅ **Challenge Mode 10 Implementation**: Implement additional document scan specific challenge mode handling
- ✅ **Validation Result Display**: Parse and display extracted document data including identity info, document details, and validation status
- ✅ **Streamlined Document-Only Flow**: Focused workflow without selfie capture or biometric consent requirements
- ✅ **Done Button Navigation**: Proper navigation back to entry screen maintaining drawer menu functionality
- ✅ **SPA Navigation Patterns**: Cordova Single Page Application with template-based content swapping
- ✅ **Screen-Level Event Handlers**: Persistent handlers that remain active across navigation
- ✅ **Dual Validation Pattern**: Two-tier validation checking both SDK sync errors and backend status codes
- ✅ **Native IDV Plugins**: Pre-configured Regula document reader for additional document capture

## 🎯 Learning Objectives

By completing this IDV Post-Login Additional Document Scan Flow codelab, you'll be able to:

1. **Implement post-login additional document scan workflows** for activated customers who need to submit supplementary identity documents
2. **Build streamlined document-only verification workflows** focused on document capture without selfie or consent requirements
3. **Handle document scan validation events** (`onIDVAdditionalDocumentScan`) with comprehensive result parsing
4. **Display extracted document data** including identity information, document details, and validation status
5. **Implement challenge mode 10 workflows** specific to additional document scan operations
6. **Manage workflow 7 (RDNA_IDV_ADDITIONAL_DOCUMENT_SCAN)** configuration and event handling
7. **Navigate properly within SPA architecture** maintaining drawer menu functionality after document scan completion
8. **Handle user cancellation gracefully** with error 241 suppression for better user experience
9. **Integrate native IDV components** with Cordova using pre-configured Regula assets for additional documents
10. **Debug post-login additional document scan flows** and troubleshoot document verification issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- **[REL-ID IDV Post-Login KYC Codelab](https://codelab.uniken.com/codelabs/cordova-idv-postlogin-kyc-flow/index.html?index=..%2F..index#0)** - Understanding of post-login IDV flows recommended (optional but helpful)
- Understanding of REL-ID SDK event-driven architecture patterns
- Experience with Cordova Single Page Application (SPA) architecture
- Knowledge of identity verification workflows and document validation
- Familiarity with JavaScript ES6+ and complex data structures
- Basic understanding of document capture and OCR data extraction concepts

## 📁 IDV Post-Login Additional Document Scan Flow Project Structure

```
relid-IDV-post-login-additional-document-scan/
├── 📱 Cordova SPA App with Enhanced IDV Support
│   ├── platforms/               # Platform-specific builds
│   │   ├── android/             # Android platform
│   │   └── ios/                 # iOS platform
│   ├── plugins/                 # Cordova plugins
│   │   ├── cordova-plugin-rdna/ # REL-ID SDK plugin
│   │   │   ├── src/
│   │   │   │   ├── android/     # Android native implementation
│   │   │   │   └── ios/         # iOS native implementation
│   │   │   │       └── RdnaClient.m  # ✅ initiateIDVAdditionalDocumentScan method added
│   │   │   └── www/
│   │   │       └── RdnaClient.js     # JavaScript plugin interface
│   │   ├── cordova-plugin-file/ # File system access (for loading assets)
│   │   └── ...                  # Other plugins
│   └── hooks/                   # Build automation hooks
│       └── after_prepare/
│           └── 001_copy_idv_resources.js  # Auto-copy IDV native resources
│
├── 📦 IDV Post-Login Additional Document Scan Source Architecture (SPA)
│   └── www/
│       ├── index.html           # ✅ ONE HTML with all templates + shell
│       │                        # - AdditionalDocumentScan-template added
│       │                        # - IDVAdditionalDocumentScanResult-template added
│       │                        # - Drawer menu link added
│       │                        # - All screen templates embedded
│       │                        # - All scripts loaded once
│       ├── css/
│       │   └── index.css        # ✅ Styles for all screens including additional document scan
│       ├── js/
│       │   └── app.js           # App initialization (deviceready)
│       └── src/
│           ├── uniken/          # 🛡️ Enhanced REL-ID Integration
│           │   ├── services/    # 🆕 Enhanced SDK service layer
│           │   │   ├── rdnaService.js                # Base MFA service layer
│           │   │   └── idv/                          # 🆕 IDV service layer
│           │   │       ├── rdnaIDVService.js         # ✅ Complete IDV API methods
│           │   │       │                            # - 🆕 initiateIDVAdditionalDocumentScan()
│           │   │       │                            # - initiateActivatedCustomerKYC()
│           │   │       │                            # - setIDVDocumentScanProcessStartConfirmation()
│           │   │       │                            # - setIDVConfirmDocumentDetails()
│           │   │       │                            # - setIDVSelfieProcessStartConfirmation()
│           │   │       │                            # - setIDVSelfieConfirmation()
│           │   │       │                            # - setIDVBiometricOptInConsent()
│           │   │       └── rdnaIDVEventManager.js    # ✅ Complete IDV event management
│           │   │                                    # - Event listener registration (document.addEventListener)
│           │   │                                    # - Event handler setters
│           │   │                                    # - 🆕 Additional document scan event handling
│           │   │                                    # - Activated customer KYC response event handling
│           │   │                                    # - Event cleanup
│           │   ├── providers/   # Enhanced providers
│           │   │   ├── SDKEventProvider.js          # Complete MFA event handling
│           │   │   └── idv/
│           │   │       └── SDKIDVEventProvider.js   # Complete IDV event handling (global)
│           │   │                                    # - 🆕 getIDVDocumentScanProcessStartConfirmation handler
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
│                   └── idv/     # 🆕 IDV Post-Login screens
│                       ├── additionalDocumentScan/                            # 🆕 Post-Login Additional Document Scan (2 screens)
│                       │   ├── AdditionalDocumentScanScreen.js                # ✅ Document scan initiation screen
│                       │   └── IDVAdditionalDocumentScanResultScreen.js      # ✅ Document scan validation result display
│                       ├── activatedCustomerKyc/                              # Post-Login KYC entry point
│                       │   └── ActivatedCustomerKYCScreen.js                 # KYC initiation screen
│                       ├── IDVDocumentProcessStartConfirmationScreen.js     # Document scan initiation
│                       ├── IDVConfirmDocumentDetailsScreen.js               # Document validation
│                       ├── IDVSelfieProcessStartConfirmationScreen.js       # Selfie capture initiation
│                       ├── IDVSelfieConfirmationScreen.js                  # Selfie verification
│                       └── IDVBiometricOptInConsentScreen.js               # Biometric consent
│
└── 📚 IDV Native Resources
    ├── idv-native-resources/    # IDV assets (auto-copied by hook)
    │   ├── common/              # Shared resources
    │   │   ├── regula.license   # Regula document reader license
    │   │   └── db.dat           # Regula document recognition database (110.5MB)
    │   ├── android/
    │   │   └── assets/
    │   │       └── Regula/
    │   │           └── certificates/    # ICAO PKD certificates for Android
    │   └── ios/
    │       └── Certificates.bundle/  # ICAO PKD certificates bundle for iOS
    ├── config.xml               # Cordova configuration
    └── package.json             # Dependencies

```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-IDV-post-login-additional-document-scan

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

### Verify IDV Post-Login Additional Document Scan Features

Once the app launches, verify these post-login additional document scan capabilities:

1. ✅ Complete MFA login flow available (user check, password verification)
2. ✅ User login with activated credentials
3. ✅ Navigate to Dashboard → Open Drawer Menu → Select "📄 Additional Document Scan"
4. ✅ **2 IDV screens implemented**: AdditionalDocumentScan (entry), Additional document scan result
5. ✅ Post-login additional document scan initiation with `initiateIDVAdditionalDocumentScan()` API
6. ✅ IDV document capture workflow with native camera integration (workflow 7)
7. ✅ Document validation result display with `onIDVAdditionalDocumentScan` event (challenge mode 10)
8. ✅ Extracted document data display including identity information and document details
9. ✅ Done button navigation back to entry screen
10. ✅ Menu button (hamburger icon) works correctly throughout the flow
11. ✅ Streamlined document-only flow (no selfie capture or consent requirements)
12. ✅ Error 241 (user cancellation) silently handled without showing error modal

## 🔑 REL-ID IDV Post-Login Additional Document Scan APIs

### How to Use IDV Post-Login Additional Document Scan APIs

REL-ID IDV Post-Login Additional Document Scan supports two primary identity verification operations:

#### **1. Additional Document Scan** - Initiate Additional Document Verification
```javascript
const reason = "Additional Document Verification"; // Document scan reason
await rdnaIDVService.initiateIDVAdditionalDocumentScan(reason);
// SDK initiates additional document scan workflow
// Wait for getIDVDocumentScanProcessStartConfirmation event
// SDK will automatically trigger subsequent document capture events
```
- **Use Case**: Begin additional document verification for already activated customers who need to submit supplementary identity documents
- **IDV Workflow**: Automatically uses workflow 7 (RDNA_IDV_ADDITIONAL_DOCUMENT_SCAN)
- **Challenge Mode**: 10 (additional document scan)
- **Validation Event**: `onIDVAdditionalDocumentScan` triggered on completion with extracted document data
- **Subsequent Events**: SDK automatically triggers document scan process start confirmation event

#### **2. Document Scan Start** - Initiate Document Capture
```javascript
const idvWorkflow = 7; // Additional document scan workflow (RDNA_IDV_ADDITIONAL_DOCUMENT_SCAN)
const isConfirm = true; // User confirmed to start document scan
await rdnaIDVService.setIDVDocumentScanProcessStartConfirmation(isConfirm, idvWorkflow);
// SDK opens native document capture camera
// Wait for onIDVAdditionalDocumentScan validation event with extracted data
```
- **Use Case**: Begin additional document scanning during post-login verification
- **IDV Workflow**: 7=Additional Document Scan (RDNA_IDV_ADDITIONAL_DOCUMENT_SCAN)
- **Triggers**: Native camera for document capture with Regula document reader
- **Validation Event**: After capture, SDK triggers `onIDVAdditionalDocumentScan` event with challenge mode 10
- **Result**: Extracted document data including identity information, document details, and validation status
- **Cancellation**: When user clicks close button (X), SDK triggers `onIDVAdditionalDocumentScan` event with error 241 (User Cancelled)

## 🎓 Learning Checkpoints

### Checkpoint 1: Post-Login Additional Document Scan Architecture Understanding
- [ ] I understand the difference between post-login KYC (workflow 6) and additional document scan (workflow 7)
- [ ] I know that additional document scan uses workflow 7 (RDNA_IDV_ADDITIONAL_DOCUMENT_SCAN) and challenge mode 10
- [ ] I understand the complete flow: Dashboard → Start Scan → Document Capture → View Results → Done
- [ ] I can implement the `initiateIDVAdditionalDocumentScan(reason)` API with proper parameters
- [ ] I understand the `onIDVAdditionalDocumentScan` validation event and its data structure
- [ ] I know that this is a streamlined document-only flow (no selfie or consent required)

### Checkpoint 2: Validation Event Handling
- [ ] I understand the `onIDVAdditionalDocumentScan` event structure with challenge mode 10
- [ ] I can parse the `idvResponse` containing identity_data, document_info, and document_status
- [ ] I know how to extract and display identity information (name, date of birth, gender, nationality)
- [ ] I can display document details (document type, validation status, confidence scores)
- [ ] I understand how to show validation status and handle validation errors
- [ ] I know that error 241 (User Cancelled) is triggered when user cancels the flow
- [ ] I can handle error 241 and 146 gracefully by silently returning without showing error modal

### Checkpoint 3: SPA Navigation Pattern
- [ ] I understand why AdditionalDocumentScan screen must be in Drawer Navigator
- [ ] I know the correct navigation pattern: `NavigationService.navigate('AdditionalDocumentScan')`
- [ ] I can implement Done button navigation maintaining drawer context
- [ ] I understand SPA template-based content swapping (no page reloads)
- [ ] I know that all templates are embedded in ONE index.html file
- [ ] I can test that navigation works without white flash or page reload

### Checkpoint 4: Document Scan Workflow for Additional Documents
- [ ] I can handle document scan start with workflow 7 (RDNA_IDV_ADDITIONAL_DOCUMENT_SCAN)
- [ ] I understand the getIDVDocumentScanProcessStartConfirmation event for workflow 7
- [ ] I can implement the setIDVDocumentScanProcessStartConfirmation API with correct workflow parameter
- [ ] I know that the validation event comes directly after document capture
- [ ] I understand that the flow ends after displaying results (no subsequent events)

### Checkpoint 5: Screen-Level Event Handler Pattern
- [ ] I understand SPA module pattern with `onContentLoaded(params)` lifecycle method
- [ ] I can implement screen-level event handlers in `setupEventListeners()` method
- [ ] I know that handlers stay active when screen is unfocused (other screens on top)
- [ ] I can manage state with JavaScript object properties
- [ ] I understand dual validation pattern (error.longErrorCode and status.statusCode)

### Checkpoint 6: Result Display Implementation
- [ ] I can create a comprehensive result screen displaying all extracted document data
- [ ] I know how to handle missing or optional fields in the validation response
- [ ] I can implement proper error handling for document scan failures
- [ ] I understand how to provide clear user guidance on the result screen
- [ ] I can implement Done button with proper navigation back to entry screen
- [ ] I understand XSS prevention with HTML escaping for user-displayed data

### Checkpoint 7: Cordova-Specific Patterns
- [ ] I understand `cordova-plugin-file` for loading assets (not fetch())
- [ ] I can use `document.addEventListener()` for SDK events (not NativeEventEmitter)
- [ ] I know how to use `alert()` dialogs instead of React Native Alert.alert()
- [ ] I understand plugin API calls through `com.uniken.rdnaplugin.RdnaClient`
- [ ] I can debug with Safari Web Inspector console logs
- [ ] I know to use JSON.stringify() for logging objects (not [object Object])

## 🔄 IDV Post-Login Additional Document Scan User Flow

### Complete Flow Diagram

```
1. User Login (Activated Customer)
   ↓
2. Dashboard → Open Drawer Menu → Select "📄 Additional Document Scan"
   ↓
3. AdditionalDocumentScanScreen
   ├─ Display document scan information and guidelines
   ├─ User clicks "Start Additional Document Scan"
   ├─ initiateIDVAdditionalDocumentScan("Additional Document Verification") API called
   ├─ Screen-level event handler registered (stays active)
   └─ SDK initiates additional document scan workflow (workflow 7, mode 10)
   ↓
4. Document Scan Process
   ├─ getIDVDocumentScanProcessStartConfirmation event (idvWorkFlow: 7)
   ├─ Navigate to IDVDocumentProcessStartConfirmationScreen (global handler)
   ├─ User clicks "Start Scan" OR Close button (X)
   │  ├─ "Start Scan": setIDVDocumentScanProcessStartConfirmation(true, 7) → Opens camera
   │  └─ Close button: SDK triggers onIDVAdditionalDocumentScan with error 241 (silently handled)
   └─ Native Document Capture (Regula) - only if user clicked "Start Scan"
   ↓
5. Document Validation
   ├─ onIDVAdditionalDocumentScan event triggered (challengeMode: 10)
   ├─ Screen-level handler receives event (even if on different screen)
   ├─ Navigate to IDVAdditionalDocumentScanResultScreen
   ├─ Display extracted document data:
   │  ├─ Personal Info Header (portrait, name, signature)
   │  ├─ Document Metadata (status, type, fields extracted)
   │  ├─ Error List (if any validation errors)
   │  ├─ Warning List (if any validation warnings)
   │  ├─ Identity Data (all OCR-extracted fields)
   │  ├─ Document Images (front/back pages)
   │  └─ Checks Performed (detailed validation checks with status)
   └─ User reviews the extracted data
   ↓
6. Completion
   ├─ User clicks "Done" button (or Close button ✕)
   ├─ Navigate back to AdditionalDocumentScanScreen
   └─ User can perform another document scan or navigate away
```

> **Key Insight**: Post-login additional document scan flow uses **workflow 7** (RDNA_IDV_ADDITIONAL_DOCUMENT_SCAN) and **challenge mode 10**. This is a streamlined document-only flow without selfie capture or consent requirements, ideal for submitting supplementary identity documents.

### Scenario 1: Complete Post-Login Additional Document Scan Flow (Activated Customer)
1. **User already activated** → User logs in with existing credentials
2. **User reaches Dashboard** → Complete login flow already done
3. **User opens drawer menu** → Drawer navigation menu displayed
4. **User selects "📄 Additional Document Scan"** → Navigation to AdditionalDocumentScanScreen
5. **Screen displays document scan information** → Guidelines and "Start Additional Document Scan" button shown
6. **User clicks "Start Additional Document Scan"** → `initiateIDVAdditionalDocumentScan('Additional Document Verification')` called
7. **SDK initiates workflow** → Workflow 7 (RDNA_IDV_ADDITIONAL_DOCUMENT_SCAN) with challenge mode 10
8. **Document scan preparation** → `getIDVDocumentScanProcessStartConfirmation` event received (idvWorkFlow: 7)
9. **User confirms document scan** → Navigation to IDVDocumentProcessStartConfirmationScreen
10. **Document capture initiated** → `setIDVDocumentScanProcessStartConfirmation(true, 7)` called
11. **Native document capture** → SDK opens Regula camera, user scans document
12. **Document validation** → SDK triggers `onIDVAdditionalDocumentScan` event with extracted data (challengeMode: 10)
13. **Navigate to result screen** → Navigation to IDVAdditionalDocumentScanResultScreen
14. **Display extracted data** → Screen shows identity information, document details, and validation status
15. **User reviews results** → Verifies name, date of birth, document type, validation checks, etc.
16. **User clicks "Done"** → `NavigationService.navigate('AdditionalDocumentScan')` called
17. **Back to entry screen** → User returns to AdditionalDocumentScanScreen with menu button working
18. **Can perform another scan** → User can click "Start Additional Document Scan" again

### Scenario 2: User Cancels on Document Scan Start (Error 241 - Silent Handling)
1. **Document scan initiated** → `initiateIDVAdditionalDocumentScan` successfully called
2. **User on confirmation screen** → IDVDocumentProcessStartConfirmationScreen displayed with guidelines
3. **User clicks close button (X)** → SDK cancels workflow
4. **Validation event triggered** → `onIDVAdditionalDocumentScan` event received with error 241 (User Cancelled)
5. **Screen-level handler processes error** → Detects `error.longErrorCode === 241`
6. **Silent return** → Handler calls `NavigationService.navigate('AdditionalDocumentScan')` WITHOUT showing error modal
7. **No error displayed** → User returns to entry screen cleanly
8. **Can retry** → User can click "Start Additional Document Scan" to try again

> **Important**: Error 241 (User Cancelled) is intentionally NOT shown to users. It represents a user-initiated action, not a technical error. The console logs help developers debug, but the UI handles it gracefully by silently returning to the entry screen.

### Scenario 3: Document Scan Failure (Real Error - Modal Shown)
1. **Document capture attempted** → User tries to scan document but gets a real error (network issue, SDK error, etc.)
2. **Validation event triggered** → `onIDVAdditionalDocumentScan` received with error code ≠ 0 (and ≠ 146, ≠ 241)
3. **Screen-level handler detects real error** → Error code check: not 146, not 241 → REAL ERROR
4. **Navigate back** → Handler calls `NavigationService.navigate('AdditionalDocumentScan')`
5. **Error modal shown** → "Document Scan Failed" modal with error message and error code
6. **User sees error** → Clear error message displayed
7. **User clicks OK** → Modal closes
8. **User retries** → Clicks "Start Additional Document Scan" again with better conditions

> **Key Understanding**: The app distinguishes between user cancellations (errors 146, 241 - suppressed) and real errors (all other error codes - shown to user with modal).

### Scenario 4: Backend Validation Error (Status Code ≠ 100)
1. **Document captured successfully** → Camera capture completed
2. **Validation event triggered** → `onIDVAdditionalDocumentScan` received with error.longErrorCode = 0 (sync success)
3. **Backend validation fails** → status.statusCode = 200 (not 100 or 0) → Backend rejected
4. **Screen-level handler detects backend error** → Second validation check fails
5. **Navigate back** → Handler calls `NavigationService.navigate('AdditionalDocumentScan')`
6. **Error modal shown** → "Verification Failed" modal with status message and status code
7. **User sees error** → Clear backend error message displayed
8. **User clicks OK** → Modal closes, can retry

> **Dual Validation Pattern**: Both error.longErrorCode (sync) and status.statusCode (backend) are checked. Only when BOTH pass does the result screen display.

## 💡 Pro Tips

### Post-Login Additional Document Scan Implementation Best Practices
1. **Implement screen-level handlers early** - Call `eventManager.setAdditionalDocumentScanHandler()` in `setupEventListeners()` for persistent handlers
2. **Keep handlers active when unfocused** - Don't unregister in screen blur, handlers persist across navigation
3. **Implement dual validation pattern** - Check error.longErrorCode first (146/241 suppression), then status.statusCode
4. **Handle cancellation gracefully** - Suppress error 146 and 241 modals, silently return to entry screen
5. **Navigate back before checking results** - Ensure user is on AdditionalDocumentScan screen before displaying modals
6. **Provide clear user guidance** - Display helpful instructions for document positioning and capture
7. **Handle validation states properly** - Display different UI for OK, ERROR, and WARNING document states
8. **Test both success and error flows** - Verify both successful document scans and error handling

### Challenge Mode & Workflow Configuration
9. **Understand challenge mode 10** - Additional document scan uses challenge mode 10, different from KYC (mode 9) and activation (mode 8)
10. **Validate workflow types** - Workflow 7 (RDNA_IDV_ADDITIONAL_DOCUMENT_SCAN) for additional documents
11. **Use correct event handler** - `onIDVAdditionalDocumentScan` validation event, not `onActivatedCustomerKYCResponse`
12. **Handle cancellation with error 241** - When user cancels, SDK triggers `onIDVAdditionalDocumentScan` with error 241. Suppress this error to avoid confusing users.
13. **Check error codes properly** - Error 241 and 146 mean user cancelled, handle gracefully by silent return
14. **Parse idvResponse structure** - Handle dynamic structure with version, identity_data, document_info, document_status, checks_performed

### SPA Navigation & User Experience
15. **Use template-based navigation** - NavigationService.navigate() swaps content, no page reload
16. **Manage state with JavaScript objects** - Use screen.state properties instead of React hooks
17. **Show comprehensive results** - Display all extracted document fields in organized sections
18. **Monitor completion rates** - Track successful scans vs cancellations to optimize user experience
19. **Test edge cases** - Camera permissions, network failures, poor lighting, document quality problems
20. **Optimize camera experience** - Request camera permissions before document scan starts to avoid flow interruption

### Cordova-Specific Best Practices
21. **Use cordova-plugin-file for assets** - FileReader API for loading JSON files, not fetch()
22. **Log with JSON.stringify()** - Always stringify objects to avoid [object Object] in console
23. **Use document.addEventListener() for events** - SDK events fire as DOM events, not NativeEventEmitter
24. **Call plugin APIs correctly** - Use `com.uniken.rdnaplugin.RdnaClient.method(success, error, [args])`
25. **Parse all plugin responses** - Plugin returns JSON strings, use JSON.parse()
26. **Use modal for dialogs** - Custom modal HTML instead of React Native Alert.alert()
27. **Debug with Safari Web Inspector** - Connect device → Safari → Develop → Device → App
28. **Test on real devices** - Camera and biometric features require physical hardware

### IDV Assets & Security
29. **Verify asset placement** - Hook auto-copies db.dat and certificates to iOS Resources
30. **Test license validity** - Confirm regula.license is properly configured and not expired
31. **Secure document data** - Never log or expose sensitive document information (document numbers, personal details)
32. **Clean up event listeners** - Reset handlers in cleanup to prevent memory leaks
33. **Implement proper error boundaries** - Catch and handle document scan errors without crashing the app
34. **Escape HTML for display** - Use escapeHtml() function to prevent XSS when showing document data
35. **Handle missing fields gracefully** - Not all document types have all fields, use optional chaining

### Error 241 Handling Best Practices
36. **Understand error 241 trigger** - Occurs when SDK cancels workflow (user closed document scan confirmation screen)
37. **Don't treat as system error** - Error 241 is user-initiated cancellation, not a technical failure
38. **Suppress error modal** - Check `if (errorCode === 146 || errorCode === 241)` and return without modal
39. **Console logs only** - Log error 241 to console for debugging, but don't show to user
40. **Test close button behavior** - Verify that cancellation properly triggers error 241 and is suppressed correctly

## 🔗 Key Implementation Files

### Core Additional Document Scan Initiation API
```javascript
// rdnaIDVService.js - Additional Document Scan API
async initiateIDVAdditionalDocumentScan(reason) {
  return new Promise((resolve, reject) => {
    console.log('RdnaIDVService - Initiating IDV additional document scan:', JSON.stringify({
      reason
    }, null, 2));

    com.uniken.rdnaplugin.RdnaClient.initiateIDVAdditionalDocumentScan(
      (response) => {
        console.log('RdnaIDVService - InitiateIDVAdditionalDocumentScan sync callback received');
        const result = JSON.parse(response);
        console.log('RdnaIDVService - initiateIDVAdditionalDocumentScan sync response:', JSON.stringify({
          longErrorCode: result.error?.longErrorCode,
          shortErrorCode: result.error?.shortErrorCode,
          errorString: result.error?.errorString
        }, null, 2));

        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaIDVService - Additional document scan initiated successfully');
          resolve(result);
        } else {
          console.error('RdnaIDVService - Additional document scan initiation error:', JSON.stringify(result, null, 2));
          reject(result);
        }
      },
      (error) => {
        console.error('RdnaIDVService - initiateIDVAdditionalDocumentScan error callback');
        const result = JSON.parse(error);
        reject(result);
      },
      [reason]
    );
  });
}
```

### Screen-Level Event Handler with Dual Validation and Error Suppression
```javascript
// AdditionalDocumentScanScreen.js - Persistent Event Handler with Dual Validation
const AdditionalDocumentScanScreen = {
  state: {
    isInitiating: false,
    showModal: false,
    modalTitle: '',
    modalMessage: '',
    isSuccess: false
  },

  onContentLoaded(params) {
    console.log('AdditionalDocumentScanScreen - Content loaded with params:', JSON.stringify(params, null, 2));

    // Reset state for fresh start
    this.state = {
      isInitiating: false,
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      isSuccess: false
    };

    // Setup event listeners (button clicks + screen-level SDK event handler)
    this.setupEventListeners();

    // Hide any existing modal
    this.hideModal();
  },

  setupEventListeners() {
    console.log('AdditionalDocumentScanScreen - Setting up event listeners');

    // Menu button click handler (open drawer)
    const menuBtn = document.getElementById('additional-doc-scan-menu-btn');
    if (menuBtn) {
      menuBtn.onclick = () => {
        console.log('AdditionalDocumentScanScreen - Menu button clicked');
        NavigationService.openDrawer();
      };
    }

    // Start button click handler
    const startBtn = document.getElementById('start-additional-document-scan-btn');
    if (startBtn) {
      startBtn.onclick = () => this.handleStartAdditionalDocumentScan();
    }

    // Modal close button handler
    const modalCloseBtn = document.getElementById('additional-document-scan-modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.onclick = () => this.handleModalClose();
    }

    // Register screen-level event handler for onIDVAdditionalDocumentScan
    // This handler persists even when user navigates away from this screen
    console.log('AdditionalDocumentScanScreen - Registering screen-level event handler');
    const eventManager = rdnaIDVService.getEventManager();
    eventManager.setAdditionalDocumentScanHandler(this.handleAdditionalDocumentScanResponse.bind(this));
  },

  /**
   * Handles additional document scan response event
   * Dual Validation Pattern:
   * - SUPPRESSED ERRORS: 146, 241 (user cancellations) → Silent return
   * - SHOWN ERRORS: Other error codes, backend status errors → Modal displayed
   * - SUCCESS: error = 0 AND status = 100 or 0 → Navigate to result screen
   */
  handleAdditionalDocumentScanResponse(data) {
    console.log('AdditionalDocumentScanScreen - Additional document scan response received');
    console.log('AdditionalDocumentScanScreen - User ID:', data.userID);
    console.log('AdditionalDocumentScanScreen - Session ID:', data.sessionID);
    console.log('AdditionalDocumentScanScreen - Reason:', data.reason);
    console.log('AdditionalDocumentScanScreen - Error Code:', data.error?.longErrorCode);
    console.log('AdditionalDocumentScanScreen - Status Code:', data.status?.statusCode);
    console.log('AdditionalDocumentScanScreen - Status Message:', data.status?.statusMessage);

    const errorCode = data.error?.longErrorCode;
    const statusCode = data.status?.statusCode;
    const statusMessage = data.status?.statusMessage || 'Unknown status';
    const errorString = data.error?.errorString || 'Unknown error';

    // Dual Validation Pattern:
    // 1st Check: Sync error (error.longErrorCode !== 0)
    // 2nd Check: Backend status (statusCode !== 100 && statusCode !== 0)

    if (errorCode !== 0) {
      // Check if user canceled (error code 146 or 241)
      if (errorCode === 146 || errorCode === 241) {
        console.log('AdditionalDocumentScanScreen - User canceled document scan (Error Code: ' + errorCode + ')');
        console.log('AdditionalDocumentScanScreen - Silently returning to screen without showing error modal');

        // Navigate back to this screen without showing error modal
        NavigationService.navigate('AdditionalDocumentScan');
        return; // Exit without showing error modal
      }

      // Sync error - API call failed (REAL ERROR - WILL SHOW MODAL)
      console.log('AdditionalDocumentScanScreen - REAL ERROR detected (Error Code: ' + errorCode + ')');
      console.log('AdditionalDocumentScanScreen - Error message:', errorString);
      console.log('AdditionalDocumentScanScreen - WILL SHOW ERROR MODAL to user');

      // Navigate back to this screen
      NavigationService.navigate('AdditionalDocumentScan');

      // Show error modal after navigation
      setTimeout(() => {
        this.state.modalTitle = 'Document Scan Failed';
        this.state.modalMessage = `Unable to complete document scan.\n\n${errorString}\n\n(Error Code: ${errorCode})`;
        this.state.isSuccess = false;
        this.showModal();
        console.log('AdditionalDocumentScanScreen - Error modal displayed to user');
      }, 300);

    } else if (statusCode && statusCode !== 100 && statusCode !== 0) {
      // Backend error - workflow failed (REAL ERROR - WILL SHOW MODAL)
      console.log('AdditionalDocumentScanScreen - BACKEND ERROR detected (Status Code: ' + statusCode + ')');
      console.log('AdditionalDocumentScanScreen - Status message:', statusMessage);
      console.log('AdditionalDocumentScanScreen - WILL SHOW ERROR MODAL to user');

      // Navigate back to this screen
      NavigationService.navigate('AdditionalDocumentScan');

      // Show error modal after navigation
      setTimeout(() => {
        this.state.modalTitle = 'Verification Failed';
        this.state.modalMessage = `The document scan could not be completed.\n\n${statusMessage}\n\n(Status Code: ${statusCode})`;
        this.state.isSuccess = false;
        this.showModal();
        console.log('AdditionalDocumentScanScreen - Error modal displayed to user');
      }, 300);

    } else {
      // Success - navigate to result screen to display document data
      console.log('AdditionalDocumentScanScreen - Document scan successful, navigating to result screen');
      console.log('AdditionalDocumentScanScreen - Document Type:', data.idvResponse?.document_type);
      console.log('AdditionalDocumentScanScreen - Overall Confidence:', data.idvResponse?.confidence_scores?.overall_confidence);

      // Navigate to result screen with document data
      NavigationService.navigate('IDVAdditionalDocumentScanResult', {
        challengeMode: data.challengeMode,
        eventData: data
      });
    }
  },

  async handleStartAdditionalDocumentScan() {
    console.log('AdditionalDocumentScanScreen - Starting additional document scan');
    this.setInitiating(true);

    try {
      const reason = 'Additional Document Verification';
      console.log('AdditionalDocumentScanScreen - Calling initiateIDVAdditionalDocumentScan with reason:', reason);

      const syncResponse = await rdnaIDVService.initiateIDVAdditionalDocumentScan(reason);
      console.log('AdditionalDocumentScanScreen - InitiateIDVAdditionalDocumentScan sync response successful');
      console.log('AdditionalDocumentScanScreen - Sync response:', JSON.stringify({
        longErrorCode: syncResponse.error?.longErrorCode,
        shortErrorCode: syncResponse.error?.shortErrorCode,
        errorString: syncResponse.error?.errorString
      }, null, 2));

      // Sync success means API accepted the request
      // The workflow will continue via SDK events handled by event manager
      console.log('AdditionalDocumentScanScreen - Additional document scan workflow initiated, waiting for SDK events');

    } catch (error) {
      // This catch block handles sync response errors (rejected promises)
      console.error('AdditionalDocumentScanScreen - InitiateIDVAdditionalDocumentScan sync error:', error);

      const errorMessage = error.error?.errorString || 'Failed to initiate additional document scan';

      // Show error alert
      alert(`Additional Document Scan Error\n\n${errorMessage}`);

    } finally {
      this.setInitiating(false);
    }
  }
};

// Expose to global scope for NavigationService
window.AdditionalDocumentScanScreen = AdditionalDocumentScanScreen;
```

### Comprehensive Result Display Screen
```javascript
// IDVAdditionalDocumentScanResultScreen.js - Display All Extracted Document Data
const IDVAdditionalDocumentScanResultScreen = {
  state: {
    challengeMode: null,
    eventData: null,
    idvResponse: null
  },

  onContentLoaded(params) {
    console.log('IDVAdditionalDocumentScanResult - Content loaded with params:', JSON.stringify(params, null, 2));

    // Store params in state
    this.state.challengeMode = params.challengeMode;
    this.state.eventData = params.eventData;
    this.state.idvResponse = params.eventData?.idvResponse;

    // Setup event listeners
    this.setupEventListeners();

    // Render document information
    this.renderDocumentInformation();
  },

  setupEventListeners() {
    // Done button
    const doneBtn = document.getElementById('additional-document-scan-result-done-btn');
    if (doneBtn) {
      doneBtn.onclick = () => this.handleDone();
    }

    // Close button (X) - same behavior as Done
    const closeBtn = document.getElementById('additional-doc-result-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => this.handleDone();
    }
  },

  /**
   * Handle Done Button
   * Navigates back to AdditionalDocumentScan screen
   */
  handleDone() {
    console.log('IDVAdditionalDocumentScanResult - Done button pressed, navigating to AdditionalDocumentScan');
    NavigationService.navigate('AdditionalDocumentScan');
  },

  /**
   * Render all document information
   */
  renderDocumentInformation() {
    // Render each section
    this.renderPersonalInfoHeader();
    this.renderDocumentMetadata();
    this.renderErrorList();
    this.renderWarningList();
    this.renderIdentityData();
    this.renderDocumentImages();
    this.renderChecksPerformed();
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Expose to global scope for NavigationService
window.IDVAdditionalDocumentScanResultScreen = IDVAdditionalDocumentScanResultScreen;
```

### IDV Event Manager with Additional Document Scan Event
```javascript
// rdnaIDVEventManager.js - Additional Document Scan Validation Event
onAdditionalDocumentScan(event) {
  console.log('RdnaIDVEventManager - Additional document scan event received');

  try {
    const response = event.response || event.detail || event;
    const data = typeof response === 'string' ? JSON.parse(response) : response;

    console.log('RdnaIDVEventManager - User ID:', data.userID);
    console.log('RdnaIDVEventManager - Session ID:', data.sessionID);
    console.log('RdnaIDVEventManager - Challenge Mode:', data.challengeMode);
    console.log('RdnaIDVEventManager - Reason:', data.reason);
    console.log('RdnaIDVEventManager - Error Code:', data.error?.longErrorCode);
    console.log('RdnaIDVEventManager - Status Code:', data.status?.statusCode);
    console.log('RdnaIDVEventManager - Document Type:', data.idvResponse?.document_type);

    if (this.additionalDocumentScanHandler) {
      this.additionalDocumentScanHandler(data);
    } else {
      console.warn('RdnaIDVEventManager - No handler registered for additional document scan');
    }
  } catch (error) {
    console.error('RdnaIDVEventManager - Failed to parse additional document scan:', error);
  }
}

// Register event listener in registerEventListeners()
document.addEventListener(
  'onIDVAdditionalDocumentScan',
  this.onAdditionalDocumentScan.bind(this),
  false
);

// Setter for handler
setAdditionalDocumentScanHandler(callback) {
  console.log('RdnaIDVEventManager - Setting additional document scan handler');
  this.additionalDocumentScanHandler = callback;
}
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
- **[IDV Additional Document Scan](https://developer.uniken.com/docs/additional-document-scan)** - Post-login additional document scan API documentation
- **[IDV Post-Login KYC](https://developer.uniken.com/docs/post-login-user-kyc)** - Post-login KYC flow (complementary feature)

### Cordova Resources
- **[Cordova Documentation](https://cordova.apache.org/docs/en/latest/)** - Official Cordova setup and development guides
- **[Cordova Plugin File](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/)** - File system access plugin documentation
- **[JavaScript ES6+ Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** - Modern JavaScript reference

---

**🔐 Congratulations! You've mastered IDV Post-Login Additional Document Scan Flow with REL-ID SDK!**

*You're now equipped to implement streamlined additional document verification for activated customers, combining screen-level event handlers, dual validation patterns with error suppression, comprehensive result display, and SPA architecture. Use this knowledge to create efficient supplementary document submission experiences that enable customers to quickly provide additional identity documents beyond the initial KYC process.*
