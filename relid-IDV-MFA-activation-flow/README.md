# REL-ID Cordova Codelab: IDV MFA Activation Flow

[![Cordova](https://img.shields.io/badge/Cordova-Latest-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-Latest-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/)
[![IDV](https://img.shields.io/badge/IDV-Identity%20Verification-blue.svg)]()
[![MFA](https://img.shields.io/badge/MFA-Multi--Factor%20Auth-green.svg)]()
[![Document Capture](https://img.shields.io/badge/Document%20Capture-Enabled-orange.svg)]()
[![Biometric](https://img.shields.io/badge/Biometric-Selfie%20Verification-purple.svg)]()

> **Codelab Advanced:** Master IDV (Identity Verification) integration within MFA activation workflows using REL-ID SDK

This folder contains the source code for the solution demonstrating REL-ID IDV MFA Activation Flow with comprehensive identity verification during user activation, including document capture, selfie verification, biometric analysis, and consent management.

## 🔐 What You'll Learn

In this advanced IDV MFA Activation Flow codelab, you'll master production-ready identity verification patterns integrated with multi-factor authentication:

- ✅ **IDV Document Scan Workflow**: `setIDVDocumentScanProcessStartConfirmation()` API with document scanning and validation
- ✅ **Document Details Confirmation**: Handle `getIDVConfirmDocumentDetails` events with OCR-extracted data validation
- ✅ **Selfie Capture Process**: `setIDVSelfieProcessStartConfirmation()` API with biometric selfie capture
- ✅ **Selfie Biometric Verification**: Handle `getIDVSelfieConfirmation` events with face matching and liveness detection results
- ✅ **Biometric Template Consent**: Navigate `getIDVBiometricOptInConsent` events for secure template storage consent
- ✅ **Event-Driven IDV Architecture**: Complete IDV event chain from document scan to biometric enrollment
- ✅ **MFA + IDV Integration**: Seamless identity verification during user activation workflows
- ✅ **Native IDV Plugins**: Pre-configured Regula document reader and biometric capture components

## 🎯 Learning Objectives

By completing this IDV MFA Activation Flow codelab, you'll be able to:

1. **Implement IDV within MFA activation flows** with seamless integration between authentication and identity verification
2. **Handle complete IDV event chains** from document scan through biometric consent
3. **Build document verification workflows** with OCR data extraction and user confirmation
4. **Create biometric verification processes** with selfie capture, face matching, and liveness detection
5. **Design consent management screens** for biometric template storage with privacy controls
6. **Integrate native IDV components** with Cordova using pre-configured Regula assets
7. **Handle IDV error scenarios** with proper user feedback and retry mechanisms
8. **Debug IDV flows** and troubleshoot identity verification issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **REL-ID MFA Codelab (Cordova)** - Complete MFA implementation required
- Understanding of REL-ID SDK event-driven architecture patterns
- Experience with Cordova Single Page Application (SPA) architecture
- Knowledge of identity verification workflows and KYC compliance
- Familiarity with JavaScript ES6+ and complex data structures
- Basic understanding of biometric verification and document validation concepts

## 📁 IDV MFA Activation Flow Project Structure

```
relid-IDV-MFA-activation-flow/
├── 📱 Cordova MFA + IDV App (SPA Architecture)
│   ├── platforms/              # Platform-specific builds
│   │   ├── android/
│   │   │   └── app/src/main/
│   │   │       ├── assets/Regula/            # IDV assets directory
│   │   │       │   ├── db.dat                # Regula document recognition database (110.5MB)
│   │   │       │   └── certificates/         # ICAO PKD certificates
│   │   │       │       └── icaopkd-002-complete-000325.ldif
│   │   │       └── res/raw/                  # Android resources directory
│   │   │           └── regula.license        # Regula document reader license for Android
│   │   └── ios/
│   │       └── idv-artifacts/                # IDV assets directory
│   │           ├── db.dat                    # Document recognition database (110.5MB)
│   │           ├── regula.license            # Regula document reader license
│   │           └── Certificates.bundle/      # Document verification certificates
│   │               └── icaopkd-002-complete-000325.ldif
│   ├── plugins/                # Cordova plugins
│   │   └── cordova-plugin-rdna/              # REL-ID Native Bridge
│   └── www/                    # 🆕 Single Page Application Architecture
│
├── 📦 IDV MFA Activation SPA Source Architecture
│   └── www/
│       ├── index.html          # 🆕 SINGLE HTML FILE (SPA Shell)
│       │                       # - All screen templates embedded
│       │                       # - Persistent drawer menu
│       │                       # - Dynamic content area
│       │                       # - All scripts loaded once
│       ├── css/
│       │   └── index.css       # Unified styles for all screens
│       ├── js/
│       │   └── app.js          # App initialization (deviceready handler)
│       └── src/
│           ├── tutorial/       # Enhanced MFA + IDV flow
│           │   ├── navigation/
│           │   │   └── NavigationService.js  # 🆕 SPA navigation (template loading)
│           │   └── screens/    # 🆕 Screen modules (JavaScript only, no HTML files)
│           │       ├── mfa/    # 🔐 MFA screen modules
│           │       │   ├── CheckUserScreen.js        # User validation module
│           │       │   ├── ActivationCodeScreen.js   # OTP verification module
│           │       │   ├── SetPasswordScreen.js      # Password creation module
│           │       │   ├── VerifyPasswordScreen.js   # Password verification module
│           │       │   ├── UserLDAConsentScreen.js   # LDA consent module
│           │       │   ├── VerifyAuthScreen.js       # Verify authentication module
│           │       │   ├── DashboardScreen.js        # Main dashboard module
│           │       │   └── ...                       # Other MFA screen modules
│           │       └── idv/    # 🆕 IDV MFA Activation screen modules (5 modules)
│           │           ├── IDVDocumentScanStartScreen.js           # Document scan initiation
│           │           ├── IDVConfirmDocumentDetailsScreen.js      # Document validation
│           │           ├── IDVSelfieProcessStartScreen.js          # Selfie capture initiation
│           │           ├── IDVSelfieConfirmationScreen.js         # Selfie verification
│           │           └── IDVBiometricOptInConsentScreen.js      # Biometric consent
│           └── uniken/         # 🛡️ Enhanced REL-ID Integration
│               ├── AppInitializer.js     # 🆕 Centralized SDK initialization (called ONCE)
│               ├── providers/   # Enhanced providers
│               │   ├── SDKEventProvider.js           # Complete MFA event handling
│               │   └── idv/                          # 🆕 IDV event providers
│               │       └── SDKIDVEventProvider.js    # Complete IDV event handling
│               │                                     # - getIDVDocumentScanProcessStartConfirmation handler
│               │                                     # - getIDVConfirmDocumentDetails handler
│               │                                     # - getIDVSelfieProcessStartConfirmation handler
│               │                                     # - getIDVSelfieConfirmation handler
│               │                                     # - getIDVBiometricOptInConsent handler
│               ├── services/    # 🆕 Enhanced SDK service layer
│               │   ├── rdnaService.js                # Base MFA service layer
│               │   └── idv/                          # 🆕 IDV service layer
│               │       ├── rdnaIDVService.js         # Complete IDV API methods
│               │       │                            # - setIDVDocumentScanProcessStartConfirmation()
│               │       │                            # - setIDVConfirmDocumentDetails()
│               │       │                            # - setIDVSelfieProcessStartConfirmation()
│               │       │                            # - setIDVSelfieConfirmation()
│               │       │                            # - setIDVBiometricOptInConsent()
│               │       └── rdnaIDVEventManager.js    # Complete IDV event management
│               │                                    # - Event listener registration
│               │                                    # - Event handler setters
│               │                                    # - Event cleanup
│               └── utils/       # 📝 Utilities with JSDoc documentation
│                   └── connectionProfileParser.js    # Uses cordova-plugin-file for JSON loading
│
└── 📚 Production Configuration
    ├── package.json            # Dependencies
    ├── config.xml              # Cordova configuration
    └── hooks/                  # Build hooks
```


## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-IDV-MFA-activation-flow

# Place the cordova-plugin-rdna plugin in the plugins/ directory
# (Refer to Project Structure above for more info)

# Install dependencies
npm install

# Add platforms
cordova platform add ios
cordova platform add android

# Prepare platforms (copies www/ to platform builds)
cordova prepare

# Run the application
cordova run android
# or
cordova run ios
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

### Verify IDV MFA Features

Once the app launches, verify these IDV capabilities integrated with MFA:

1. ✅ Complete MFA activation flow available (user check, activation code, password setup, LDA consent)
2. ✅ **5 IDV screens implemented**: Document scan start, document confirmation, selfie start, selfie confirmation, biometric consent
3. ✅ IDV document capture workflow with native camera integration
4. ✅ Document OCR data extraction and user validation
5. ✅ IDV selfie capture process with biometric verification
6. ✅ Face matching and liveness detection result display
7. ✅ Biometric template storage consent management
8. ✅ Complete IDV event chain handling from document scan to enrollment completion

## 🔑 REL-ID IDV MFA Activation APIs

### Official REL-ID IDV API Mapping

> **⚠️ Critical**: IDV operations follow a sync+async pattern. Always register event handlers BEFORE calling APIs.

| API Method | Event Handler | Description | Documentation |
|------------|---------------|-------------|---------------|
| `setIDVDocumentScanProcessStartConfirmation()` | `getIDVDocumentScanProcessStartConfirmation` | Initiates document scan process with specified IDV workflow | [📖 IDV Docs](https://developer.uniken.com/docs/idv) |
| `setIDVConfirmDocumentDetails()` | `getIDVConfirmDocumentDetails` | Confirms or rejects OCR-extracted document details | [📖 IDV Docs](https://developer.uniken.com/docs/idv) |
| `setIDVSelfieProcessStartConfirmation()` | `getIDVSelfieProcessStartConfirmation` | Initiates selfie capture with camera selection | [📖 IDV Docs](https://developer.uniken.com/docs/idv) |
| `setIDVSelfieConfirmation()` | `getIDVSelfieConfirmation` | Confirms or rejects selfie biometric verification results | [📖 IDV Docs](https://developer.uniken.com/docs/idv) |
| `setIDVBiometricOptInConsent()` | `getIDVBiometricOptInConsent` | Accepts or rejects biometric template storage consent | [📖 IDV Docs](https://developer.uniken.com/docs/idv) |

> **🎯 Production Recommendation**: Implement proper error handling and user guidance for each IDV step to ensure high completion rates.

### How to Use IDV APIs

REL-ID IDV MFA Activation supports five primary identity verification operations:

#### **1. Document Scan Start** - Initiate Document Capture
```javascript
const idvWorkflow = 0; // Activation workflow
const isConfirm = true; // User confirmed to start document scan
await rdnaIDVService.setIDVDocumentScanProcessStartConfirmation(isConfirm, idvWorkflow);
// SDK opens native document capture camera
// Wait for getIDVConfirmDocumentDetails event with extracted data
```
- **Use Case**: Begin identity document scanning during user activation
- **IDV Workflows**: 0=Activation, 2=Device Activation, 5=Post-Login, 6=KYC, 13=Agent KYC
- **Triggers**: Native camera for document capture with Regula document reader
- **📖 Official Documentation**: [IDV Document Capture](https://developer.uniken.com/docs/idv-document-capture)

#### **2. Document Details Confirmation** - Validate Extracted Data
```javascript
const isConfirm = true; // User confirms document details are correct
const challengeMode = 8; // Challenge operation mode
await rdnaIDVService.setIDVConfirmDocumentDetails(isConfirm, challengeMode);
// Wait for getIDVSelfieProcessStartConfirmation event
```
- **Use Case**: User reviews and confirms OCR-extracted document information
- **Validation States**: OK (valid), ERROR (failed), WARNING (review needed)
- **User Actions**: Confirm details or request document recapture
- **📖 Official Documentation**: [IDV Document Verification](https://developer.uniken.com/docs/idv-document-verification)

#### **3. Selfie Capture Start** - Initiate Biometric Selfie
```javascript
const isConfirm = true; // User confirmed to start selfie capture
const useBackCamera = false; // Use front camera (default for selfies)
const idvWorkflow = 0; // Activation workflow
await rdnaIDVService.setIDVSelfieProcessStartConfirmation(isConfirm, useBackCamera, idvWorkflow);
// SDK opens native selfie capture camera
// Wait for getIDVSelfieConfirmation event with biometric results
```
- **Use Case**: Begin selfie capture for biometric verification
- **Camera Selection**: Front camera (selfies) or back camera (agent-assisted)
- **Liveness Detection**: SDK performs real-time liveness checks during capture
- **📖 Official Documentation**: [IDV Selfie Capture](https://developer.uniken.com/docs/idv-selfie-capture)

#### **4. Selfie Confirmation** - Validate Biometric Results
```javascript
const confirmAction = "true"; // User confirms selfie results
const challengeMode = 8; // Challenge operation mode
await rdnaIDVService.setIDVSelfieConfirmation(confirmAction, challengeMode);
// Wait for getIDVBiometricOptInConsent event
```
- **Use Case**: User reviews biometric match results and liveness score
- **Verification Metrics**: Face matching score, liveness detection score, overall match
- **User Actions**: Confirm results or request selfie recapture
- **📖 Official Documentation**: [IDV Biometric Verification](https://developer.uniken.com/docs/idv-biometric-verification)

#### **5. Biometric Consent** - Template Storage Permission
```javascript
const isOptIn = true; // User consents to biometric template storage
const challengeMode = 8; // Challenge operation mode
await rdnaIDVService.setIDVBiometricOptInConsent(isOptIn, challengeMode);
// IDV biometric capture completes, SDK continues to password setup
```
- **Use Case**: Request user permission for biometric template storage
- **Privacy Consideration**: Template storage enables faster future authentication
- **User Choice**: Accept (faster auth) or reject (complete current auth only)
- **Flow Continuation**: After consent, SDK proceeds to password setup, then triggers onUserLoggedIn
- **📖 Official Documentation**: [IDV Biometric Consent](https://developer.uniken.com/docs/idv-biometric-consent)

## 🎓 Learning Checkpoints

### Checkpoint 1: IDV Event Chain Understanding
- [ ] I understand the complete activation flow: Activation Code → IDV (Document → Selfie → Consent) → Password → Login
- [ ] I know that IDV occurs AFTER activation code but BEFORE password setup
- [ ] I understand the complete IDV event flow: Document Scan → Document Confirm → Selfie Capture → Selfie Confirm → Biometric Consent
- [ ] I can implement event handlers for all five IDV event types
- [ ] I understand event handler registration lifecycle and cleanup
- [ ] I can debug IDV event chain issues and identify failure points

### Checkpoint 2: Document Capture Integration
- [ ] I can handle `getIDVDocumentScanProcessStartConfirmation` events and navigate to document scan screens
- [ ] I understand IDV workflow types (0=Activation, 2=Device Activation, 5=Post-Login, 6=KYC, 13=Agent KYC)
- [ ] I can implement `setIDVDocumentScanProcessStartConfirmation()` API with proper workflow parameters
- [ ] I know how Regula document reader uses db.dat and certificate assets
- [ ] I can handle document capture errors and provide user guidance

### Checkpoint 3: Document Validation Workflow
- [ ] I understand `getIDVConfirmDocumentDetails` event data structure with OCR-extracted information
- [ ] I can display document validation states (OK, ERROR, WARNING) with appropriate UI
- [ ] I can implement `setIDVConfirmDocumentDetails()` API for user confirmation or recapture
- [ ] I know how to parse response_data JSON with document field details
- [ ] I can handle document validation failures and retry mechanisms

### Checkpoint 4: Selfie Biometric Process
- [ ] I can handle `getIDVSelfieProcessStartConfirmation` events for selfie capture initiation
- [ ] I understand camera selection parameters (front vs back camera) for different workflows
- [ ] I can implement `setIDVSelfieProcessStartConfirmation()` API with camera configuration
- [ ] I know how liveness detection works during selfie capture
- [ ] I can handle selfie capture errors and guide users through recapture

### Checkpoint 5: Biometric Verification & Consent
- [ ] I understand `getIDVSelfieConfirmation` event data with face matching and liveness scores
- [ ] I can display biometric verification results with clear user feedback
- [ ] I can implement `setIDVSelfieConfirmation()` API for result confirmation
- [ ] I understand `getIDVBiometricOptInConsent` event for template storage consent
- [ ] I can implement `setIDVBiometricOptInConsent()` API with privacy-aware consent management
- [ ] I know that password setup occurs AFTER biometric consent in the activation flow

### Checkpoint 6: Production IDV Implementation
- [ ] I can implement complete error handling for all IDV operations
- [ ] I know how to provide user guidance and progress indicators throughout IDV flow
- [ ] I can handle edge cases: camera permissions, poor lighting, document/selfie quality issues
- [ ] I understand security considerations for biometric data handling
- [ ] I can optimize user experience to maximize IDV completion rates

## 🔄 IDV MFA Activation User Flow

### Complete Flow Diagram

```
1. SDK Initialization (rdnaService.initialize)
   ↓
2. MFA Authentication (Activation Code)
   ↓
3. Document Scan Process
   ├─ getIDVDocumentScanProcessStartConfirmation event
   ├─ setIDVDocumentScanProcessStartConfirmation API
   ├─ Native Document Capture (Regula)
   ├─ getIDVConfirmDocumentDetails event (Validation)
   └─ setIDVConfirmDocumentDetails API
   ↓
4. Selfie Capture Process
   ├─ getIDVSelfieProcessStartConfirmation event
   ├─ setIDVSelfieProcessStartConfirmation API
   ├─ Native Selfie Capture (Liveness Detection)
   ├─ getIDVSelfieConfirmation event (Face Matching)
   └─ setIDVSelfieConfirmation API
   ↓
5. Biometric Consent
   ├─ getIDVBiometricOptInConsent event
   └─ setIDVBiometricOptInConsent API
   ↓
6. Password Setup
   ↓
7. onUserLoggedIn Event Triggered
   ↓
8. Complete → Navigate to Dashboard
```

> **Key Insight**: IDV verification occurs **immediately after activation code** and **before password setup**, ensuring identity verification is completed early in the activation workflow.

### Scenario 1: Complete IDV MFA Activation Flow (New User)
1. **SDK initialization** → `rdnaService.initialize()` called with connection profile
2. **User initiates registration** → Navigation to CheckUserScreen
3. **User enters username** → SDK validates user and requests activation code
4. **User enters activation code** → OTP verification completed, SDK triggers IDV flow
5. **Document scan preparation** → `getIDVDocumentScanProcessStartConfirmation` event received
6. **User confirms document scan** → Navigation to IDVDocumentScanStartScreen
7. **Document capture initiated** → `setIDVDocumentScanProcessStartConfirmation(true, 0)` called
8. **Native document capture** → SDK opens Regula camera, user scans identity document
9. **Document validation** → SDK triggers `getIDVConfirmDocumentDetails` event with OCR-extracted data
10. **User reviews document details** → Navigation to IDVConfirmDocumentDetailsScreen
11. **Document details displayed** → OCR-extracted fields shown with validation status (OK/ERROR/WARNING)
12. **Document confirmation** → `setIDVConfirmDocumentDetails(true, challengeMode)` called
13. **Selfie capture preparation** → SDK triggers `getIDVSelfieProcessStartConfirmation` event
14. **User confirms selfie capture** → Navigation to IDVSelfieProcessStartScreen
15. **Selfie capture initiated** → `setIDVSelfieProcessStartConfirmation(true, false, 0)` called
16. **Native selfie capture** → SDK opens camera, user captures selfie with liveness detection
17. **Selfie verification** → SDK triggers `getIDVSelfieConfirmation` event with biometric results
18. **User reviews selfie results** → Navigation to IDVSelfieConfirmationScreen
19. **Biometric scores displayed** → Face matching and liveness scores shown
20. **Selfie confirmation** → `setIDVSelfieConfirmation("true", challengeMode)` called
21. **Biometric consent request** → SDK triggers `getIDVBiometricOptInConsent` event
22. **User provides consent** → Navigation to IDVBiometricOptInConsentScreen
23. **User accepts template storage** → `setIDVBiometricOptInConsent(true, challengeMode)` called
24. **Password setup triggered** → SDK requests password creation after IDV completion
25. **User sets password** → Password creation and confirmation on SetPasswordScreen
26. **Activation completed** → SDK triggers `onUserLoggedIn` event
27. **User reaches dashboard** → Complete MFA + IDV activation successfully completed

### Scenario 2: Document Recapture Flow
1. **Document captured** → User scans identity document
2. **Document validation issues** → OCR extraction shows ERROR or WARNING status
3. **User reviews invalid data** → Extracted fields are incorrect or incomplete
4. **User rejects document details** → `setIDVConfirmDocumentDetails(false, challengeMode)` called
5. **SDK re-triggers document scan** → `getIDVDocumentScanProcessStartConfirmation` event again
6. **User recaptures document** → Better lighting and positioning used
7. **Validation successful** → Document details confirmed and flow continues

### Scenario 3: Selfie Recapture Flow
1. **Selfie captured** → User captures selfie photo
2. **Low biometric match** → Face matching or liveness score below threshold
3. **User reviews poor results** → Verification scores shown with guidance
4. **User rejects selfie** → `setIDVSelfieConfirmation("false", challengeMode)` called
5. **SDK re-triggers selfie capture** → `getIDVSelfieProcessStartConfirmation` event again
6. **User recaptures selfie** → Better lighting and face positioning
7. **Verification successful** → High biometric scores, flow continues

### Scenario 4: User Declines Biometric Consent
1. **Biometric consent requested** → `getIDVBiometricOptInConsent` event received
2. **User reviews consent details** → Privacy implications explained
3. **User rejects template storage** → `setIDVBiometricOptInConsent(false, challengeMode)` called
4. **Current session completed** → User authentication succeeds without template storage
5. **Future authentication** → User will need to perform full biometric verification again

## 💡 Pro Tips

### IDV Implementation Best Practices
1. **Register event handlers early** - Set up IDV event handlers before starting MFA activation flow
2. **Provide clear user guidance** - Display helpful instructions for document positioning and selfie capture
3. **Handle validation states properly** - Display different UI for OK, ERROR, and WARNING document validation states
4. **Implement retry mechanisms** - Allow users to recapture documents and selfies when validation fails
5. **Optimize camera experience** - Request camera permissions before IDV starts to avoid flow interruption
6. **Show progress indicators** - Display clear progress through the multi-step IDV flow
7. **Handle consent transparently** - Clearly explain biometric template storage benefits and privacy implications
8. **Test with various documents** - Ensure IDV works with different identity document types and formats
9. **Monitor completion rates** - Track where users drop off in IDV flow and optimize those steps

### IDV Assets & Configuration
10. **Verify asset placement** - Ensure db.dat (110.5MB) and certificates are correctly placed for both platforms
11. **Test license validity** - Confirm regula.license is properly configured and not expired
12. **Monitor app size** - IDV assets add ~110MB to app size, consider optimization strategies
13. **Validate certificate updates** - ICAO PKD certificates need periodic updates for document validation
14. **Handle missing assets gracefully** - Provide clear error messages if IDV assets are missing

### Integration & Security
15. **Preserve MFA event handlers** - Ensure IDV event handlers don't interfere with existing MFA handlers
16. **Clean up event listeners** - Reset IDV event handlers in provider cleanup to prevent memory leaks
17. **Secure biometric data** - Never log or expose biometric template data or sensitive document information
18. **Handle edge cases thoroughly** - Network failures, camera issues, poor lighting, document quality problems
19. **Test workflow variations** - Verify different IDV workflow types (0, 2, 5, 6, 13) work correctly
20. **Implement proper error boundaries** - Catch and handle IDV errors without crashing the entire app

## 🔗 Key Implementation Files

### Core IDV Service Layer
```javascript
// rdnaIDVService.js - IDV Document Scan API
async setIDVDocumentScanProcessStartConfirmation(isConfirm, idvWorkflow) {
  return new Promise((resolve, reject) => {
    console.log('RdnaIDVService - Setting document scan confirmation:', JSON.stringify({
      isConfirm,
      idvWorkflow
    }, null, 2));

    com.uniken.rdnaplugin.RdnaClient.setIDVDocumentScanProcessStartConfirmation(
      (response) => {
        console.log('RdnaIDVService - SetIDVDocumentScanProcessStartConfirmation sync callback');

        const result = JSON.parse(response);
        console.log('RdnaIDVService - setIDVDocumentScanProcessStartConfirmation sync response:', JSON.stringify({
          longErrorCode: result.error?.longErrorCode,
          shortErrorCode: result.error?.shortErrorCode,
          errorString: result.error?.errorString
        }, null, 2));
        resolve(result);
      },
      (error) => {
        console.error('RdnaIDVService - setIDVDocumentScanProcessStartConfirmation error callback');
        const result = JSON.parse(error);
        reject(result);
      },
      [isConfirm, idvWorkflow]
    );
  });
}
```

### IDV Event Manager Implementation
```javascript
// rdnaIDVEventManager.js - IDV Event Registration
registerEventListeners() {
  console.log('RdnaIDVEventManager - Registering IDV event listeners');

  // Document scan start confirmation event
  document.addEventListener(
    'getIDVDocumentScanProcessStartConfirmation',
    this.onGetDocumentScanStartConfirmation.bind(this)
  );

  // Document details confirmation event
  document.addEventListener(
    'getIDVConfirmDocumentDetails',
    this.onGetConfirmDocumentDetails.bind(this)
  );

  // Selfie process start confirmation event
  document.addEventListener(
    'getIDVSelfieProcessStartConfirmation',
    this.onGetSelfieProcessStartConfirmation.bind(this)
  );

  // Selfie confirmation event
  document.addEventListener(
    'getIDVSelfieConfirmation',
    this.onGetSelfieConfirmation.bind(this)
  );

  // Biometric opt-in consent event
  document.addEventListener(
    'getIDVBiometricOptInConsent',
    this.onGetBiometricOptInConsent.bind(this)
  );

  console.log('RdnaIDVEventManager - All IDV event listeners registered');
}
```

### IDV Event Provider Pattern
```javascript
// SDKIDVEventProvider.js - Complete IDV Event Handling (Singleton Pattern)
const SDKIDVEventProvider = {
  _initialized: false,
  currentIDVWorkflow: null,

  initialize() {
    if (this._initialized) {
      console.log('SDKIDVEventProvider - Already initialized, skipping');
      return;
    }

    console.log('SDKIDVEventProvider - Initializing IDV event handlers');

    const eventManager = rdnaIDVService.getEventManager();

    // Document scan start handler
    eventManager.setGetDocumentScanStartConfirmationHandler((data) => {
      console.log('SDKIDVEventProvider - Document scan start confirmation requested');
      console.log('SDKIDVEventProvider - IDV Workflow:', data.idvWorkflow);

      this.currentIDVWorkflow = data.idvWorkflow;

      NavigationService.navigate('IDVDocumentScanStart', {
        idvWorkflow: data.idvWorkflow,
        eventData: data
      });
    });

    // Register all other IDV event handlers
    eventManager.setGetConfirmDocumentDetailsHandler(this.handleGetConfirmDocumentDetails.bind(this));
    eventManager.setGetSelfieProcessStartConfirmationHandler(this.handleGetSelfieProcessStartConfirmation.bind(this));
    eventManager.setGetSelfieConfirmationHandler(this.handleGetSelfieConfirmation.bind(this));
    eventManager.setGetBiometricOptInConsentHandler(this.handleGetBiometricOptInConsent.bind(this));

    this._initialized = true;
    console.log('SDKIDVEventProvider - Initialization complete');
  },

  cleanup() {
    console.log('SDKIDVEventProvider - Cleaning up IDV event handlers');
    const eventManager = rdnaIDVService.getEventManager();
    eventManager.setGetDocumentScanStartConfirmationHandler(undefined);
    eventManager.setGetConfirmDocumentDetailsHandler(undefined);
    eventManager.setGetSelfieProcessStartConfirmationHandler(undefined);
    eventManager.setGetSelfieConfirmationHandler(undefined);
    eventManager.setGetBiometricOptInConsentHandler(undefined);
    this._initialized = false;
  }
};
```

### IDV Screen Implementation Example
```javascript
// IDVDocumentScanStartScreen.js - Screen Module Pattern
const IDVDocumentScanStartScreen = {
  state: {
    idvWorkflow: null,
    eventData: null,
    isProcessing: false,
    error: ''
  },

  /**
   * Called when NavigationService.navigate('IDVDocumentScanStart', params)
   * Replaces React componentDidMount / useEffect
   */
  onContentLoaded(params) {
    console.log('IDVDocumentScanStart - Content loaded', JSON.stringify(params, null, 2));

    // Initialize state from params
    this.state.idvWorkflow = params.idvWorkflow;
    this.state.eventData = params.eventData;
    this.state.isProcessing = false;
    this.state.error = '';

    // Setup event listeners
    this.setupEventListeners();

    // Clear any previous errors
    this.hideError();
  },

  setupEventListeners() {
    const startButton = document.getElementById('idv-scan-document-btn');
    const closeButton = document.getElementById('idv-doc-scan-close-btn');

    if (startButton) {
      startButton.onclick = () => this.handleStartDocumentScan();
    }

    if (closeButton) {
      closeButton.onclick = () => this.handleClose();
    }
  },

  async handleStartDocumentScan() {
    if (this.state.idvWorkflow === null && this.state.idvWorkflow !== 0) {
      this.showError('Invalid IDV workflow. Unable to proceed.');
      return;
    }

    this.setProcessing(true);
    this.hideError();

    try {
      console.log('Starting document scan process for workflow:', this.state.idvWorkflow);

      await rdnaIDVService.setIDVDocumentScanProcessStartConfirmation(
        true,
        this.state.idvWorkflow
      );

      console.log('Document scan process started successfully');
      // SDK will open native camera and trigger next event
    } catch (error) {
      console.error('Failed to start document scan:', JSON.stringify(error, null, 2));
      const errorMessage = error?.error?.errorString || 'Failed to start document scan. Please try again.';
      this.showError(errorMessage);
    } finally {
      this.setProcessing(false);
    }
  },

  async handleClose() {
    try {
      console.log('IDVDocumentScanStart - Calling resetAuthState');
      await rdnaService.resetAuthState();
    } catch (error) {
      console.error('ResetAuthState error:', JSON.stringify(error, null, 2));
    }
  },

  setProcessing(isProcessing) {
    this.state.isProcessing = isProcessing;
    const button = document.getElementById('idv-scan-document-btn');
    if (button) {
      button.disabled = isProcessing;
      button.textContent = isProcessing ? 'Starting...' : 'Start Document Scan';
    }
  },

  showError(message) {
    this.state.error = message;
    const errorDiv = document.getElementById('idv-doc-scan-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  },

  hideError() {
    this.state.error = '';
    const errorDiv = document.getElementById('idv-doc-scan-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  }
};

// Expose to global scope for NavigationService
window.IDVDocumentScanStartScreen = IDVDocumentScanStartScreen;
```

---

## 📚 Related Documentation

### REL-ID Developer Resources
- **[REL-ID Developer Portal](https://developer.uniken.com/)** - Main developer documentation hub

### Cordova Resources
- **[Cordova Documentation](https://cordova.apache.org/docs/en/latest/)** - Official Cordova setup and development guides
- **[Cordova Plugin Development](https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/)** - Creating and using Cordova plugins
- **[JavaScript MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** - JavaScript language reference
- **[DOM API Reference](https://developer.mozilla.org/en-US/docs/Web/API)** - Web APIs and DOM manipulation

---

**🔐 Congratulations! You've mastered IDV MFA Activation Flow with REL-ID SDK!**

*You're now equipped to implement comprehensive identity verification within MFA workflows, combining secure authentication with robust document and biometric verification. Use this knowledge to create seamless IDV experiences that enhance security while maintaining excellent user experience during activation and onboarding processes.*
