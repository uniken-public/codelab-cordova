# REL-ID Cordova Codelab: Mobile Threat Detection

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.09.02-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Security](https://img.shields.io/badge/Security-MTD%20Enabled-red.svg)](https://developer.uniken.com/docs/mobile-threat-detection)
[![Architecture](https://img.shields.io/badge/Architecture-SPA-purple.svg)](https://en.wikipedia.org/wiki/Single-page_application)

> **Codelab Step 2:** Master advanced Mobile Threat Detection implementation with REL-ID SDK in Cordova

This folder contains the source code for the solution of the [REL-ID MTD](https://codelab.uniken.com/codelabs/cordova-mtd-flow/index.html?index=..%2F..index#0)

## 🛡️ What You'll Learn

In this advanced codelab, you'll master production-ready Mobile Threat Detection patterns:

- ✅ **Mobile Threat Detection (MTD)**: Real-time threat detection and response
- ✅ **User Consent Flows**: Handle non-critical threats with user interaction
- ✅ **Terminating Threats**: Manage critical security threats automatically
- ✅ **Platform-Specific Exits**: iOS HIG-compliant and Android native exit patterns
- ✅ **Advanced State Management**: Singleton-based threat handling in SPA
- ✅ **Production Security Patterns**: Enterprise-grade threat response

## 🎯 Learning Objectives

By completing this advanced codelab, you'll be able to:

1. **Implement comprehensive MTD** with user consent and terminating threat flows
2. **Create platform-specific security exits** following platform guidelines (iOS/Android)
3. **Build sophisticated threat modals** with proper UX patterns in Cordova
4. **Handle complex threat state management** using singleton patterns
5. **Implement production-ready security policies** for enterprise applications
6. **Debug and troubleshoot MTD issues** effectively in Cordova

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID Basic Integration Codelab](https://codelab.uniken.com/codelabs/cordova-relid-initialization-flow/index.html?index=..%2F..index#0)** - Foundation concepts required
- Understanding of JavaScript and event-driven programming
- Experience with Cordova plugins and native bridge patterns
- Knowledge of mobile security principles
- Familiarity with Single Page Application (SPA) architecture

## 🏛️ Architecture: Single Page Application (SPA)

This codelab uses **SPA architecture** for optimal performance and MTD integration:

### Why SPA for MTD?

- ✅ **Global MTD Modal** - Always available in persistent shell, works from any screen
- ✅ **One-time SDK initialization** - Event handlers registered once, persist forever
- ✅ **No handler re-registration** - MTD handlers work across all screens
- ✅ **Persistent threat state** - JavaScript singletons maintain state without page reloads
- ✅ **Faster navigation** - Template swapping keeps MTD handlers active
- ✅ **Better UX** - Smooth transitions between screens and threat modals

### SPA Key Components:

1. **index.html** - Single HTML with MTD modal in shell + screen templates
2. **NavigationService.js** - Template swapping (not `window.location.href`)
3. **MTDThreatManager.js** - Singleton for global threat management
4. **ThreatDetectionModal.js** - Modal controller for threat display
5. **AppInitializer.js** - One-time initialization of SDK + MTD handlers
6. **Screen modules** - `onContentLoaded(params)` lifecycle pattern

### MTD Flow in SPA:

```
deviceready → AppInitializer.initialize() → MTDThreatManager.initialize()
  ↓
MTD handlers registered ONCE (persist for entire app)
  ↓
User clicks Initialize → SDK runs MTD checks
  ↓
Threat detected → onUserConsentThreats event fired
  ↓
MTDThreatManager shows modal (from persistent shell)
  ↓
User chooses Proceed/Exit → takeActionOnThreats([JSON.stringify(threats)])
  ↓
onInitialized or onTerminateWithThreats event
  ↓
Navigate to Success or SecurityExit screen
```

**Key Insight:** MTD modal is in the **persistent shell** (not in templates), ensuring it works from any screen without re-initialization.

## 📁 Advanced Project Structure

```
relid-MTD/
├── 📱 Cordova Configuration
│   ├── platforms/              # Platform-specific code (iOS, Android)
│   ├── plugins/                # Installed Cordova plugins
│   ├── config.xml              # Cordova app configuration
│   └── RdnaClient/             # cordova-plugin-rdna LOCAL plugin source
│
├── 📦 Source Code (www/)
│   ├── index.html              # SPA with MTD modal + 4 templates
│   ├── css/
│   │   └── index.css           # All styles (697 lines with MTD)
│   ├── js/
│   │   └── app.js              # Bootstrap (deviceready → AppInitializer)
│   └── src/
│       ├── tutorial/           # Tutorial screens and navigation
│       │   ├── navigation/     # NavigationService (SPA template swapping)
│       │   └── screens/        # Home, Success, Error, SecurityExit
│       └── uniken/             # REL-ID SDK integration
│           ├── AppInitializer.js     # 🔑 One-time SDK + MTD initialization
│           ├── cp/                   # Connection profile (agent_info.json)
│           ├── MTDContext/           # 🆕 MTD threat manager (singleton)
│           ├── components/           # 🆕 Reusable UI components
│           │   └── modals/           # 🆕 ThreatDetectionModal
│           ├── providers/            # SDK event provider
│           ├── services/             # SDK service layer + MTD APIs
│           └── utils/                # Helper utilities + platformHelper
│
└── 📚 Configuration Files
    ├── package.json            # Dependencies and scripts
    └── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

Before starting, ensure you have:

- **Node.js 18+** installed
- **Cordova CLI** installed globally (`npm install -g cordova`)
- **Android Studio** or **Xcode** for device testing
- **cordova-plugin-rdna** and **REL-ID connection profile** from your Uniken administrator

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-MTD

# Place the cordova-plugin-rdna plugin
# at root folder of this project (as ./RdnaClient directory)

# Install dependencies
npm install

# Add platform (iOS or Android)
cordova platform add ios
# or
cordova platform add android

# Prepare the platform (installs plugins, copies www/ files)
cordova prepare

# Run the application
cordova run ios
# or
cordova run android
```

### Testing MTD Flows

This codelab demonstrates MTD with real threat detection. To test:

1. **Start the app** - SDK initializes with MTD enabled
2. **User Consent Threats** - SDK may detect non-critical threats (e.g., debugger attached)
   - Modal appears with threat details
   - Choose "Proceed Anyway" to continue
   - Choose "Exit Application" to close app
3. **Terminating Threats** - SDK may detect critical threats (e.g., rooted device)
   - Modal appears with "Exit Application" only
   - App must exit for security

**Note:** Actual threat detection depends on device configuration and SDK settings.

## 🎓 Learning Checkpoints

### Checkpoint 1: MTD Architecture Mastery
- [ ] I understand the MTD threat detection lifecycle in Cordova
- [ ] I can implement user consent vs terminating threat flows
- [ ] I know how to prevent duplicate threat dialogs using self-triggered detection
- [ ] I can create platform-specific security exits (iOS vs Android)

### Checkpoint 2: Advanced Implementation
- [ ] I can integrate takeActionOnThreats API with proper JSON formatting
- [ ] I understand event-driven MTD architecture with document.addEventListener
- [ ] I can implement threat modals with direct DOM manipulation
- [ ] I know how to handle threat object modifications

### Checkpoint 3: SPA Architecture & MTD
- [ ] I understand why MTD modal is in persistent shell (not template)
- [ ] I can implement singleton-based state management for MTD
- [ ] I know how to block hardware back button when modal is visible
- [ ] I can debug MTD event flow and threat state

### Checkpoint 4: Platform-Specific Handling
- [ ] I understand iOS HIG guidelines for app exit
- [ ] I can implement SecurityExitScreen for iOS compliance
- [ ] I know how to use navigator.app.exitApp() on Android
- [ ] I can detect platform with cordova.platformId

## 🔧 Key Implementation Patterns

### Pattern 1: takeActionOnThreats API

**Critical:** Parameters must be array with stringified JSON:

```javascript
// ❌ WRONG - Will fail
rdnaService.takeActionOnThreats(JSON.stringify(threats));

// ✅ CORRECT - Must be array with stringified JSON
rdnaService.takeActionOnThreats([JSON.stringify(threats)]);
```

**In rdnaService.js:**
```javascript
async takeActionOnThreats(modifiedThreatsJson) {
  return new Promise((resolve, reject) => {
    com.uniken.rdnaplugin.RdnaClient.takeActionOnThreats(
      (response) => {
        const result = JSON.parse(response);
        if (result.error && result.error.longErrorCode === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      },
      (error) => reject(JSON.parse(error)),
      [modifiedThreatsJson] // ← CRITICAL: Array with stringified JSON
    );
  });
}
```

### Pattern 2: MTD Event Handling

**User Consent Threats (non-critical):**
```javascript
// In rdnaEventManager.js
document.addEventListener('onUserConsentThreats', (event) => {
  const threatsData = JSON.parse(event.response);
  // threatsData.threats = array of threat objects

  if (this.userConsentThreatsHandler) {
    this.userConsentThreatsHandler(threatsData);
  }
}, false);
```

**Terminate with Threats (critical):**
```javascript
// In rdnaEventManager.js
document.addEventListener('onTerminateWithThreats', (event) => {
  const threatsData = JSON.parse(event.response);

  if (this.terminateWithThreatsHandler) {
    this.terminateWithThreatsHandler(threatsData);
  }
}, false);
```

### Pattern 3: Self-Triggered Threat Detection

**Problem:** When user chooses "Exit" in consent mode, `takeActionOnThreats` triggers a `terminateWithThreats` event. We don't want to show the modal twice.

**Solution:** Track pending exit threat IDs:

```javascript
// In MTDThreatManager.js
handleExit() {
  if (this.isConsentMode) {
    // Track threat IDs for self-triggered detection
    this.pendingExitThreats = this.threats.map(t => t.threatId);

    // Call API with shouldProceedWithThreats = false
    rdnaService.takeActionOnThreats([JSON.stringify(modifiedThreats)]);
    // → Will trigger onTerminateWithThreats
  }
}

// Later in onTerminateWithThreats handler:
const isSelfTriggered = this.pendingExitThreats.length > 0 &&
  incomingThreatIds.every(id => this.pendingExitThreats.includes(id));

if (isSelfTriggered) {
  // Direct exit without showing modal again
  this.handlePlatformSpecificExit('self-triggered');
} else {
  // Genuine terminate event - show modal
  this.showThreatModal(threats, false);
}
```

### Pattern 4: Platform-Specific Exit

**iOS Strategy (HIG-compliant):**
```javascript
if (getPlatformId() === 'ios') {
  // Navigate to SecurityExitScreen
  // iOS apps cannot programmatically exit
  NavigationService.navigate('SecurityExit');
}
```

**Android Strategy (direct exit):**
```javascript
if (getPlatformId() === 'android') {
  // Use cordova-plugin-app-exit
  navigator.app.exitApp();
}
```

### Pattern 5: Modal in Persistent Shell

**Why persistent shell?**
- MTD modal must work from ANY screen
- Template-based modals would be destroyed on navigation
- Persistent shell ensures modal always available

**In index.html:**
```html
<body>
  <!-- MTD Modal (persistent shell) -->
  <div id="mtd-modal-overlay" style="display: none;">
    <!-- Modal content -->
  </div>

  <!-- Dynamic content area -->
  <div id="app-content">
    <!-- Templates swapped here -->
  </div>

  <!-- All screen templates -->
  <template id="TutorialHome-template">...</template>
</body>
```

### Pattern 6: Threat Object Modification

Before calling `takeActionOnThreats`, modify threat objects:

```javascript
const modifiedThreats = threats.map(threat => ({
  ...threat,
  shouldProceedWithThreats: true,  // or false for exit
  rememberActionForSession: true,
  // Convert array to string if needed
  threatReason: Array.isArray(threat.threatReason)
    ? threat.threatReason.join(',')
    : threat.threatReason
}));

const threatsJson = JSON.stringify(modifiedThreats);
await rdnaService.takeActionOnThreats(threatsJson);
```

## 📚 Additional Resources

- **REL-ID Developer Documentation**: [https://developer.uniken.com/](https://developer.uniken.com/)
- **Cordova Guide**: [https://cordova.apache.org/docs/en/latest/](https://cordova.apache.org/docs/en/latest/)
- **cordova-plugin-file**: [https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/)
- **Mobile Threat Detection Best Practices**: [https://developer.uniken.com/docs/mobile-threat-detection](https://developer.uniken.com/docs/mobile-threat-detection)
- **iOS Human Interface Guidelines**: [https://developer.apple.com/design/human-interface-guidelines/](https://developer.apple.com/design/human-interface-guidelines/)

## 💡 Pro Tips

### General Tips
1. **Always parse JSON responses** - All cordova-plugin-rdna responses are JSON strings
2. **Use cordova-plugin-file for file loading** - Standard fetch() doesn't work with file:// URLs in iOS
3. **Test on real devices** - MTD behavior differs between simulator and device
4. **Keep connection profiles secure** - Never commit credentials to version control

### MTD-Specific Tips
5. **Understand threat severity levels** - HIGH (critical), MEDIUM (warning), LOW (info)
6. **Handle both threat types** - User consent (choice) vs terminate (forced exit)
7. **Use self-triggered detection** - Prevent duplicate modals when user chooses exit
8. **Follow platform guidelines** - iOS cannot programmatically exit (use SecurityExitScreen)
9. **Test threat modifications** - Verify shouldProceedWithThreats and rememberActionForSession
10. **Block back button** - Prevent modal dismissal during security threats

### SPA Tips
11. **MTD modal in shell** - Keep modal outside templates for global availability
12. **Initialize MTD once** - MTDThreatManager.initialize() called once in AppInitializer
13. **Use singletons** - No React Context needed, direct property access works
14. **Test across navigation** - Ensure MTD works after navigating between screens

## 🐛 Common Issues and Solutions

### General Issues

#### Issue: "Plugin not found"
**Solution:** Run `cordova prepare` to ensure plugins are properly installed.

#### Issue: "Can't find variable: cordova"
**Solution:** Ensure cordova.js is loaded before your app scripts in index.html.

#### Issue: File loading fails on iOS
**Solution:** Use cordova-plugin-file instead of fetch() for loading local files.

### MTD-Specific Issues

#### Issue: takeActionOnThreats fails with "invalid parameter"
**Solution:** Verify parameter format is `[JSON.stringify(threats)]` (array with stringified JSON).

```javascript
// ❌ WRONG
takeActionOnThreats(threats);  // Object
takeActionOnThreats(JSON.stringify(threats));  // String

// ✅ CORRECT
takeActionOnThreats([JSON.stringify(threats)]);  // Array with string
```

#### Issue: Modal shows twice when user chooses exit
**Solution:** Implement self-triggered threat detection using `pendingExitThreats` tracking (see Pattern 3 above).

#### Issue: Hardware back button dismisses modal
**Solution:** Add backbutton event listener in ThreatDetectionModal.initialize():

```javascript
document.addEventListener('backbutton', (e) => {
  if (isModalVisible) {
    e.preventDefault();
    return false; // Block back button
  }
}, false);
```

#### Issue: App doesn't exit on Android
**Solution:**
- Install cordova-plugin-app-exit: `cordova plugin add cordova-plugin-app-exit`
- Use `navigator.app.exitApp()` in platformHelper.js

#### Issue: App crashes when exiting on iOS
**Solution:** iOS apps cannot programmatically exit. Use SecurityExitScreen pattern:
```javascript
if (getPlatformId() === 'ios') {
  NavigationService.navigate('SecurityExit');  // Show exit guidance
} else {
  navigator.app.exitApp();  // Direct exit on Android
}
```

#### Issue: Threats not displaying in modal
**Solution:** Verify threat objects have required properties:
- `threatId`, `threatName`, `threatMsg`, `threatCategory`, `threatSeverity`
- Check ThreatDetectionModal.populateThreatList() for parsing logic

#### Issue: MTD handlers not firing after navigation
**Solution:** This is an SPA problem. Verify:
1. MTDThreatManager.initialize() called in AppInitializer (not per screen)
2. _initialized flag prevents re-registration
3. Modal is in persistent shell (not template)

### SPA Architecture Issues

#### Issue: Screen not found or onContentLoaded not called
**Solution:** Verify screen object is exposed to global scope:
```javascript
window.TutorialHomeScreen = TutorialHomeScreen;
```

#### Issue: Template not found error
**Solution:** Check template ID matches route name:
- Route: `'TutorialHome'` → Template: `id="TutorialHome-template"`

#### Issue: MTD modal not showing
**Solution:** Verify modal HTML is in persistent shell (outside #app-content):
```html
<body>
  <div id="mtd-modal-overlay">...</div>  <!-- Persistent shell -->
  <div id="app-content">...</div>        <!-- Dynamic content -->
</body>
```

## 🔬 Testing Your Implementation

### Automated Tests (10 tests)

Run these checks to verify your implementation:

```bash
# 1. Plugin installation
cordova plugin ls
# Should show: cordova-plugin-rdna, cordova-plugin-file

# 2. File structure
ls www/src/uniken/MTDContext/
# Should show: MTDThreatManager.js

# 3. Templates
grep "template id=" www/index.html
# Should show 4 templates: TutorialHome, TutorialSuccess, TutorialError, SecurityExit

# 4. MTD modal in shell
grep "mtd-modal-overlay" www/index.html
# Should show modal outside templates

# 5. Scripts loaded
grep "MTDThreatManager.js" www/index.html
# Should show script tag

# 6. Global objects
grep "window\\..*Screen" www/src/tutorial/screens/*.js
# Should show 4 exposures

# 7. SPA navigation
grep "cloneNode" www/src/tutorial/navigation/NavigationService.js
# Should show template cloning (SPA pattern)

# 8. AppInitializer
grep "MTDThreatManager" www/src/uniken/AppInitializer.js
# Should show MTD initialization

# 9. takeActionOnThreats
grep "takeActionOnThreats" www/src/uniken/services/rdnaService.js
# Should show method implementation

# 10. Platform helper
test -f www/src/uniken/utils/platformHelper.js && echo "✓"
```

### Manual Tests (Requires device/simulator)

1. **SDK Initialization**
   - Open app → SDK version displays
   - Click Initialize → Progress updates show
   - Verify no JavaScript errors in console

2. **User Consent Threats**
   - If SDK detects threats → Modal appears
   - Verify threat list displays with severity badges
   - Click "Proceed Anyway" → Modal dismisses, initialization continues
   - Click "Exit Application" → Confirmation dialog → App exits

3. **Terminating Threats**
   - If critical threats detected → Modal appears with only Exit button
   - Verify "Proceed" button NOT visible
   - Click "Exit Application" → App exits

4. **Platform-Specific Exit**
   - iOS: Should navigate to SecurityExitScreen with instructions
   - Android: Should call navigator.app.exitApp() directly

5. **Navigation Flow**
   - Navigate between screens → No page reload/white flash
   - MTD modal works from any screen
   - Back button blocked when modal visible

## 🗂️ File Reference

### Core Files

| File | Purpose | Lines | Key Features |
|------|---------|-------|--------------|
| **www/index.html** | SPA shell | 268 | MTD modal + 4 templates |
| **www/css/index.css** | All styles | 697 | MTD modal styles included |
| **www/js/app.js** | Bootstrap | 74 | Calls AppInitializer once |

### MTD Components

| File | Purpose | Key Methods |
|------|---------|-------------|
| **MTDThreatManager.js** | Singleton manager | showThreatModal(), handleProceed(), handleExit() |
| **ThreatDetectionModal.js** | Modal controller | show(), hide(), populateThreatList() |
| **platformHelper.js** | Platform utils | getPlatformId(), exitApp() |

### SDK Integration

| File | Purpose | MTD Methods |
|------|---------|-------------|
| **rdnaService.js** | SDK API wrapper | takeActionOnThreats() |
| **rdnaEventManager.js** | Event management | setUserConsentThreatsHandler(), setTerminateWithThreatsHandler() |
| **SDKEventProvider.js** | Event routing | handleInitialized() |
| **AppInitializer.js** | One-time init | MTDThreatManager.getInstance().initialize() |

### Screens

| File | Purpose | Lifecycle |
|------|---------|-----------|
| **TutorialHomeScreen.js** | Main screen | onContentLoaded() → setupEventListeners() |
| **TutorialSuccessScreen.js** | Success display | onContentLoaded() → populateSessionDetails() |
| **TutorialErrorScreen.js** | Error display | onContentLoaded() → populateErrorDetails() |
| **SecurityExitScreen.js** | iOS exit guidance | onContentLoaded() → static display |

## 🔍 Troubleshooting Guide

### Debug Logging

Enable comprehensive logging to troubleshoot MTD issues:

```javascript
// Check console for these log patterns:

// Initialization
"AppInitializer - Initializing MTDThreatManager"
"MTDThreatManager - Initializing"
"RdnaEventManager - Registering native event listeners (including MTD)"

// Threat Detection
"RdnaEventManager - User consent threats event received"
"MTDThreatManager - User consent threats received: N"
"MTDThreatManager - Showing threat modal"

// User Actions
"MTDThreatManager - User chose to proceed with threats"
"MTDThreatManager - Calling takeActionOnThreats with proceed=true"

// Self-Triggered Detection
"MTDThreatManager - Threat comparison: {...}"
"MTDThreatManager - Self-triggered terminate event - exiting directly"

// Platform Exit
"MTDThreatManager - Platform-specific exit called: {platform: 'ios', exitType: 'self-triggered'}"
```

### Common Patterns to Verify

1. **MTD modal HTML exists** in persistent shell (outside #app-content)
2. **MTDThreatManager initialized once** in AppInitializer
3. **Threat objects modified** before takeActionOnThreats call
4. **Platform detection** uses getPlatformId() consistently
5. **Back button handler** registered in ThreatDetectionModal.initialize()

---

**Ready to build secure Cordova apps with REL-ID MTD? Let's start coding! 🛡️🚀**

*This advanced codelab provides hands-on experience with Mobile Threat Detection in Cordova using SPA architecture. Master these patterns for production-ready security implementations.*
