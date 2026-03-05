# REL-ID Cordova Codelab: Internationalization

[![Cordova](https://img.shields.io/badge/Cordova-12.0%2B-blue.svg)](https://cordova.apache.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-Latest-green.svg)](https://developer.uniken.com/)
[![Internationalization](https://img.shields.io/badge/i18n-Multi--Language-orange.svg)]()
[![Dynamic Language Switch](https://img.shields.io/badge/Language%20Switch-Runtime-purple.svg)]()
[![Native Localization](https://img.shields.io/badge/Native%20Strings-Android%2FiOS-red.svg)]()

> **Codelab Advanced:** Master internationalization and localization with REL-ID SDK language management and dynamic runtime language switching

This folder contains the source code for the solution demonstrating [REL-ID Internationalization](https://codelab.uniken.com/codelabs/cordova-internationalization/index.html?index=..%2F..index#0) with comprehensive multi-language support, SDK integration, and native platform localization.

## 🌐 What You'll Learn

In this advanced internationalization codelab, you'll master production-ready multi-language patterns:

- ✅ **SDK Language Initialization**: Configure language preference during `initialize()` with `initOptions`
- ✅ **Dynamic Language Switching**: `setSDKLanguage()` API with runtime language updates
- ✅ **Language Response Events**: Handle `onSetLanguageResponse` callback for language changes
- ✅ **Two-Phase Language Loading**: Default languages → SDK languages after initialization
- ✅ **Native Platform Localization**: Android `strings.xml` and iOS `.strings` files for error codes
- ✅ **Language Manager Pattern**: Object singleton for centralized language state management
- ✅ **localStorage Persistence**: Save and restore user language preferences
- ✅ **LTR/RTL Support**: Handle bidirectional text with language direction values (0=LTR, 1=RTL)
- ✅ **Native Script Display**: Show languages in their native scripts (हिन्दी, العربية, Español)

## 🎯 Learning Objectives

By completing this Internationalization codelab, you'll be able to:

1. **Implement SDK language initialization** during app startup with proper fallback handling
2. **Build language selector interfaces** with native script display and modal interactions
3. **Handle dynamic language switching** at runtime without app restart
4. **Design two-phase language loading** for optimal user experience during initialization
5. **Create native localization files** for Android and iOS error code mapping
6. **Implement language persistence** with localStorage for preference restoration
7. **Support bidirectional text** with LTR and RTL language configurations
8. **Integrate SDK language events** with application state management patterns
9. **Debug language-related issues** and troubleshoot SDK initialization problems

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of JavaScript ES6+ features (const, arrow functions, async/await)
- Experience with Cordova SPA (Single Page Application) architecture
- Knowledge of localStorage API for local data persistence
- Familiarity with JSDoc for type documentation
- Basic understanding of internationalization (i18n) concepts
- Experience with Android and iOS native resource files (optional but helpful)

## 📁 Internationalization Project Structure

```
relid-internationalization/
├── 📱 Enhanced Cordova MFA + Internationalization App
│   ├── config.xml              # Cordova configuration
│   ├── package.json            # Dependencies
│   ├── platforms/              # Platform-specific code
│   │   ├── android/            # Android platform
│   │   │   └── app/src/main/res/
│   │   │       ├── values/          # 🆕 English localization (default)
│   │   │       │   ├── strings_mtd.xml      # MTD error codes in English
│   │   │       │   └── strings_rel_id.xml   # REL-ID error codes in English
│   │   │       ├── values-es/       # 🆕 Spanish localization
│   │   │       │   ├── strings_mtd.xml      # MTD error codes in Spanish
│   │   │       │   └── strings_rel_id.xml   # REL-ID error codes in Spanish
│   │   │       └── values-hi/       # 🆕 Hindi localization
│   │   │           ├── strings_mtd.xml      # MTD error codes in Hindi
│   │   │           └── strings_rel_id.xml   # REL-ID error codes in Hindi
│   │   └── ios/                # iOS platform
│   │       └── SharedLocalization/  # 🆕 Shared localization strings
│   │           ├── en.lproj/        # English localization
│   │           │   ├── MTD.strings         # MTD error codes in English
│   │           │   └── RELID.strings       # REL-ID error codes in English
│   │           ├── es.lproj/        # Spanish localization
│   │           │   ├── MTD.strings         # MTD error codes in Spanish
│   │           │   └── RELID.strings       # REL-ID error codes in Spanish
│   │           └── hi.lproj/        # Hindi localization
│   │               ├── MTD.strings         # MTD error codes in Hindi
│   │               └── RELID.strings       # REL-ID error codes in Hindi
│   └── plugins/                # Cordova plugins
│       └── cordova-plugin-rdna/    # REL-ID Native Plugin
│
├── 📦 Internationalization Source Architecture (SPA)
│   └── www/
│       ├── index.html          # 🌐 ONE HTML with templates + language UI
│       │                       # - LanguageSelector modal template
│       │                       # - Language configuration card in TutorialHome
│       │                       # - Drawer menu language link
│       │                       # - All screen templates
│       │                       # - All script tags (loaded once)
│       ├── css/
│       │   └── index.css       # 🆕 Language selector styles (~250 lines)
│       │                       # - Modal overlay and container
│       │                       # - Language option buttons (selected/RTL)
│       │                       # - Drawer language link styles
│       ├── js/
│       │   └── app.js          # 🆕 LanguageManager.initialize() on startup
│       │                       # - deviceready event handler
│       │                       # - Calls AppInitializer.initialize() ONCE
│       │                       # - Loads persisted language preference
│       └── src/
│           ├── uniken/         # 🛡️ Enhanced REL-ID Integration
│           │   ├── AppInitializer.js        # Centralized SDK initialization
│           │   ├── services/   # 🆕 Enhanced SDK service layer
│           │   │   ├── rdnaService.js            # 🆕 Language APIs
│           │   │   │                            # - setSDKLanguage(localeCode, direction)
│           │   │   │                            # - Uses cordova-plugin-rdna API
│           │   │   │                            # - Promise-based async/await pattern
│           │   │   └── rdnaEventManager.js       # 🆕 Language event management
│           │   │                                # - setSetLanguageResponseHandler()
│           │   │                                # - onSetLanguageResponse listener
│           │   │                                # - document.addEventListener pattern
│           │   ├── providers/  # Enhanced providers
│           │   │   └── SDKEventProvider.js           # 🆕 Language event handling
│           │   │                                    # - handleSetLanguageResponse
│           │   │                                    # - SDK language sync to LanguageManager
│           │   └── MTDContext/                       # MTD threat management
│           └── tutorial/       # 🌐 Internationalization Implementation
│               ├── context/    # 🆕 Language state management
│               │   └── LanguageManager.js       # Object singleton (not class)
│               │                               # - currentLanguage state
│               │                               # - supportedLanguages array
│               │                               # - changeLanguage method
│               │                               # - updateFromSDK sync
│               │                               # - CustomEvent 'languageChanged'
│               │                               # - Idempotent initialization
│               ├── types/      # 🆕 JSDoc type definitions
│               │   └── language.js                  # Language interface (separate from SDK)
│               │                                   # - lang (locale code)
│               │                                   # - display_text (English name)
│               │                                   # - nativeName (native script)
│               │                                   # - direction (0=LTR, 1=RTL)
│               ├── utils/      # 🆕 Language utilities
│               │   ├── languageConfig.js            # Default languages and conversions
│               │   │                               # - DEFAULT_SUPPORTED_LANGUAGES
│               │   │                               # - convertSDKLanguageToCustomer()
│               │   │                               # - getNativeName()
│               │   └── languageStorage.js           # localStorage persistence
│               │                                   # - save(languageCode)
│               │                                   # - load() language preference
│               ├── components/ # 🆕 Language UI components
│               │   └── LanguageSelector.js          # Language picker modal
│               │                                   # - show()/hide() methods
│               │                                   # - Native script display
│               │                                   # - RTL badge indicator
│               │                                   # - Current language checkmark
│               ├── navigation/ # Enhanced navigation
│               │   └── NavigationService.js         # 🆕 Drawer language integration
│               │                                   # - initializeDrawerLanguageLink()
│               │                                   # - handleDrawerLanguageClick()
│               │                                   # - updateDrawerLanguageDisplay()
│               └── screens/    # Enhanced screens with i18n
│                   └── tutorial/
│                       └── TutorialHomeScreen.js    # 🆕 Language selector integration
│                                                   # - updateLanguageDisplay()
│                                                   # - handleLanguageSelect()
│                                                   # - Uses LanguageManager for SDK init
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-internationalization

# Place the cordova-plugin-rdna plugin
# Plugin should be in: plugins/cordova-plugin-rdna/

# Install dependencies
npm install

# Add platforms
cordova platform add ios
cordova platform add android

# Install cordova-plugin-file (required for file loading)
cordova plugin add cordova-plugin-file

# Prepare platforms
cordova prepare

# Run the application
cordova run android
# or
cordova run ios
```

### Verify Internationalization Features

Once the app launches, verify these internationalization capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ Language selector accessible from home screen
3. ✅ Language change menu item in drawer navigation
4. ✅ Default languages displayed before SDK initialization
5. ✅ SDK languages synchronized after initialization completes
6. ✅ `setSDKLanguage()` API integration with dynamic language switching
7. ✅ Native script display (English, हिन्दी, Español)
8. ✅ Language preference persisted in localStorage
9. ✅ Error messages mapped from native localization files

## 🌍 REL-ID SDK Language Lifecycle

### Internationalization Behavior by SDK Lifecycle Phase

> **⚠️ Critical**: Understanding the two-phase language lifecycle is essential for correct error handling and user experience.

#### **Phase 1: Language During SDK Initialization**

During initialization, the SDK `initialize()` API with `initOptions` parameter sets the initial language preference:

```javascript
const initOptions = {
  internationalizationOptions: {
    localeCode: 'en-US',  // Full locale code: 'en-US', 'hi-IN', 'es-ES'
    localeName: 'English',
    languageDirection: 0  // 0 = LTR, 1 = RTL
  }
};

await rdnaService.initialize(serverConfig, initOptions);
```

**Key Behaviors:**
- If `localeCode` is provided in `internationalizationOptions`, SDK uses that language
- If `localeCode` is NOT provided or invalid, SDK automatically falls back to English
- At this stage, SDK has **NOT yet fetched** localization strings from server
- If initialization error occurs, SDK returns an **error code** (not localized text)
- **Host Cordova app is responsible** for mapping error codes to localized strings

**Error Code Mapping Pattern:**
```
SDK Returns: { error: { longErrorCode: 12345 } }
              ↓
App Looks Up: Android: values-es/strings_rel_id.xml
              iOS: es.lproj/RELID.strings
              ↓
App Displays: "Error de inicialización del SDK" (Spanish localized message)
```

**Where Localization Files Are Used:**
- **Android**: `platforms/android/app/src/main/res/values-{language}/strings_*.xml`
- **iOS**: `platforms/ios/SharedLocalization/{language}.lproj/*.strings`

These files contain mappings like:
```xml
<!-- strings_rel_id.xml -->
<string name="RDNA_ERR_12345">SDK initialization error</string>
```

#### **Phase 2: Language After Successful Initialization**

After SDK initialization completes successfully, the application can change language **dynamically at runtime** using:

```javascript
await rdnaService.setSDKLanguage('es-ES', 0); // 0 = LTR, 1 = RTL
// Wait for onSetLanguageResponse event
```

**Key Behaviors:**
- Language changes do **NOT require app restart** or re-initialization
- SDK updates all internal UI strings and messages dynamically
- `onSetLanguageResponse` callback indicates success/failure
- SDK provides updated `supportedLanguages` array with available languages
- App synchronizes SDK languages with `LanguageManager` state

**Language Update Flow:**
```
1. User selects language → calls setSDKLanguage()
                              ↓
2. SDK processes request → validates language availability
                              ↓
3. SDK fires event → onSetLanguageResponse with updated data
                              ↓
4. App updates state → LanguageManager.updateFromSDK()
                              ↓
5. UI re-renders → all language-dependent components update via CustomEvent
```

### Official REL-ID Language API Mapping

| API Method | Lifecycle Phase | Purpose | Documentation |
|------------|----------------|---------|---------------|
| `initialize()` with `initOptions.internationalizationOptions` | **Initialization** | Set initial language preference with fallback | [📖 Init Docs](https://developer.uniken.com/docs/initialize-1) |
| `setSDKLanguage()` | **Post-Initialization** | Change language dynamically at runtime | [📖 Language API Docs](https://developer.uniken.com/docs/internationalization) |
| `onSetLanguageResponse` | **Post-Initialization** | Event callback with updated language data | [📖 Event Docs](https://developer.uniken.com/docs/internationalization) |

> **🎯 Production Recommendation**: Always implement native localization files for initialization error codes, and use SDK events for post-initialization language management.

## 🔑 REL-ID Language Management Operations

### How to Use Language APIs

REL-ID internationalization supports two primary operations:

#### **1. Initialize with Language Preference** - Set Language at Startup
```javascript
// TutorialHomeScreen.js - Get current language from LanguageManager
const languageManager = window.LanguageManager;
const currentLanguage = languageManager.getCurrentLanguage();

const initOptions = {
  internationalizationOptions: {
    localeCode: currentLanguage.lang,       // Full locale: 'en-US', 'hi-IN', 'ar-SA'
    localeName: currentLanguage.display_text,
    languageDirection: currentLanguage.direction  // 0 = LTR, 1 = RTL
  }
};

await rdnaService.initialize(serverConfig, initOptions);
// SDK uses English if localeCode is invalid or missing
```

- **Use Case**: Set user's preferred language on app startup
- **Fallback**: SDK automatically uses English if locale is invalid
- **Error Handling**: Map error codes to localized strings from native files
- **Timing**: Called once during app initialization
- **📖 Official Documentation**: [SDK Initialization API](https://developer.uniken.com/docs/sdk-initialization)

#### **2. Change Language Dynamically** - Runtime Language Switching
```javascript
// User selects Spanish from language selector
const selectedLanguage = {
  lang: 'es-ES',
  direction: 0  // 0 = LTR, 1 = RTL
};

// Call setSDKLanguage API
const syncResponse = await rdnaService.setSDKLanguage(
  selectedLanguage.lang,
  selectedLanguage.direction
);
// Wait for onSetLanguageResponse event
```

- **Use Case**: Change language after initialization without app restart
- **Event Response**: `onSetLanguageResponse` provides updated language data
- **Success Indicators**: `statusCode === 100 || 0` AND `longErrorCode === 0`
- **Failure Handling**: Show error alert if language change fails
- **State Update**: Update `LanguageManager` only on successful response
- **📖 Official Documentation**: [Set SDK Language API](https://developer.uniken.com/docs/internationalization)

#### **3. Handle Language Response Event** - Process SDK Language Updates
```javascript
// Register event handler in SDKEventProvider
const handleSetLanguageResponse = (data) => {
  // Early error check
  if (data.error.longErrorCode !== 0) {
    alert('Language Change Failed: ' + data.error.errorString);
    return;
  }

  // Check success status
  if (data.status.statusCode === 100 || data.status.statusCode === 0) {
    // Update LanguageManager with SDK's supported languages
    updateFromSDK(data.supportedLanguages, data.localeCode);
    alert('Language changed to ' + data.localeName);
  } else {
    alert('Failed: ' + data.status.statusMessage);
  }
};

eventManager.setSetLanguageResponseHandler(handleSetLanguageResponse);
```

- **Use Case**: Process language change results and update UI
- **Response Data**: Includes `supportedLanguages`, `localeCode`, `localeName`, `direction`
- **Error Check Order**: 1) `longErrorCode !== 0`, 2) `statusCode === 100/0`
- **State Sync**: Update `LanguageManager` with SDK's latest language data
- **📖 Official Documentation**: [Language Events API](https://developer.uniken.com/docs/internationalization)

## 🎓 Learning Checkpoints

### Checkpoint 1: SDK Language Lifecycle Understanding
- [ ] I understand the difference between initialization-time and runtime language setting
- [ ] I know why error codes (not text) are returned during initialization
- [ ] I can implement native localization files for Android and iOS
- [ ] I understand when to use `internationalizationOptions` in `initOptions` vs `setSDKLanguage()` API
- [ ] I know how SDK falls back to English when locale is invalid

### Checkpoint 2: Two-Phase Language Loading Pattern
- [ ] I can implement default hardcoded languages for pre-initialization state
- [ ] I understand why SDK languages are synchronized after initialization
- [ ] I know how to use `LanguageManager.updateFromSDK()` for sync
- [ ] I can handle the transition from default to SDK languages smoothly
- [ ] I understand the purpose of `RDNASupportedLanguage` vs `Language` interfaces

### Checkpoint 3: Language Selector UI Implementation
- [ ] I can create a modal language selector with native script display
- [ ] I know how to show language names in their native scripts (हिन्दी, العربية)
- [ ] I can implement RTL badge indicators for right-to-left languages
- [ ] I understand how to highlight the currently selected language
- [ ] I can integrate language selector in both home screen and drawer menu

### Checkpoint 4: Dynamic Language Switching
- [ ] I can implement `setSDKLanguage()` API calls with proper parameters
- [ ] I understand the sync+async pattern (API call + event handler)
- [ ] I know how to handle `onSetLanguageResponse` event correctly
- [ ] I can validate success using `statusCode` and `longErrorCode`
- [ ] I understand when to update `LanguageManager` state (success only)

### Checkpoint 5: Language Persistence & State Management
- [ ] I can persist user language preference using localStorage
- [ ] I know how to restore language preference on app startup
- [ ] I understand object singleton pattern for language state management
- [ ] I can implement CustomEvent for cross-component language updates
- [ ] I know how to initialize LanguageManager on deviceready event

### Checkpoint 6: Bidirectional Text Support (LTR/RTL)
- [ ] I understand language direction values (LTR=0, RTL=1)
- [ ] I know how to pass language direction to `setSDKLanguage()` API
- [ ] I can detect RTL languages and display appropriate UI indicators
- [ ] I understand the difference between `direction` (number) and `isRTL` (boolean)
- [ ] I can implement RTL-aware layouts if needed

### Checkpoint 7: Error Handling & Validation
- [ ] I can map SDK error codes to localized strings from native files
- [ ] I know how to handle sync response errors vs event response errors
- [ ] I understand early return pattern (check `longErrorCode` first)
- [ ] I can show user-friendly error alerts for language change failures
- [ ] I know when to prevent language updates (error cases)

## 🔄 Internationalization User Flow

### Scenario 1: App Startup with Language Preference
1. **App launches** → deviceready event fires
2. **LanguageManager initializes** → Loads persisted preference from localStorage ('es-ES')
3. **Default languages set** → Shows English, Hindi, Arabic, Spanish, French
4. **Current language restored** → LanguageManager updates to Spanish
5. **AppInitializer called** → Sets up SDK event handlers ONCE
6. **SDK initialization starts** → Uses Spanish from LanguageManager
7. **Pass to initOptions** → `initialize()` called with `internationalizationOptions.localeCode: 'es-ES'`
8. **SDK initializes** → Uses Spanish for internal messages
9. **Initialization completes** → `onInitializeResponse` event fires
10. **SDK languages received** → Extract `supportedLanguages` from response
11. **Sync to LanguageManager** → Call `updateFromSDK()` to replace default languages
12. **CustomEvent dispatched** → 'languageChanged' event notifies all components
13. **UI updates** → All language selectors now show SDK's supported languages

### Scenario 2: Dynamic Language Change from Home Screen
1. **User on home screen** → Sees language selector button with current language
2. **User taps selector** → LanguageSelector modal opens
3. **Modal displays languages** → Shows all `supportedLanguages` with native names
4. **User selects Hindi** → Taps on "हिन्दी (Hindi)" option
5. **Modal closes** → `onSelectLanguage` handler called with Hindi language object
6. **Validation check** → If same language, skip API call
7. **API call initiated** → `setSDKLanguage('hi-IN', 0)` called
8. **Loading state shown** → Button shows loading indicator
9. **Sync response received** → API acknowledges request (doesn't indicate final success)
10. **Wait for event** → `onSetLanguageResponse` event fires
11. **Event validation** → Check `longErrorCode === 0` and `statusCode === 100`
12. **Success handling** → Update LanguageManager, show success alert
13. **CustomEvent fired** → 'languageChanged' notifies UI components
14. **UI updates immediately** → All language-dependent text re-renders
15. **Preference saved** → localStorage persists 'hi-IN' for next app launch

### Scenario 3: Language Change from Drawer Menu
1. **User opens drawer** → Drawer menu displays with language menu item
2. **Current language shown** → Menu item shows "🌐 Change Language" with "हिन्दी"
3. **User taps menu item** → LanguageSelector modal opens
4. **User selects Spanish** → Taps "Español (Spanish)"
5. **Loading indicator** → Menu item shows activity indicator
6. **API processing** → Same flow as Scenario 2 (steps 7-13)
7. **LanguageManager updated** → Current language changes to Spanish
8. **CustomEvent fired** → Drawer menu listener updates display
9. **Menu updates** → Menu item now shows "Español" as current language
10. **Drawer closes** → User continues with Spanish language

### Scenario 4: Error Handling - Invalid Language Request
1. **User selects language** → Taps language in selector
2. **API call initiated** → `setSDKLanguage()` called with language code
3. **Sync response error** → `longErrorCode !== 0` in sync response
4. **Catch block triggered** → Promise rejected with error
5. **Error alert displayed** → "Language Change Error: [error message]"
6. **Loading state cleared** → Button returns to normal state
7. **LanguageManager NOT updated** → Language remains unchanged
8. **User can retry** → Opens selector again for new attempt

### Scenario 5: Error Handling - Event Response Failure
1. **User selects language** → Language change initiated
2. **Sync response success** → `longErrorCode === 0` (request accepted)
3. **Event fires** → `onSetLanguageResponse` received
4. **Event error detected** → `longErrorCode !== 0` OR `statusCode !== 100`
5. **Early return triggered** → Handler exits without updating LanguageManager
6. **Error alert shown** → "Language Change Failed: [error details]"
7. **Language unchanged** → LanguageManager retains previous language
8. **UI remains consistent** → All displays show previous language

### Scenario 6: Initialization Error Code Localization
1. **App starts with Spanish** → User's preference is 'es-ES'
2. **Initialize called** → `initOptions.internationalizationOptions.localeCode = 'es-ES'`
3. **Initialization fails** → SDK returns error code 12345
4. **SDK returns code only** → No localized text available yet
5. **App checks platform** → Android or iOS
6. **Load native file** → Android: `values-es/strings_rel_id.xml`, iOS: `es.lproj/RELID.strings`
7. **Look up error code** → Find string resource for code 12345
8. **Display localized error** → Show Spanish error message to user
9. **Fallback handling** → If no translation exists, show English default

## 💡 Pro Tips

### Language Management Best Practices
1. **Use two-phase loading** - Show default languages immediately, sync SDK languages after init
2. **Separate customer types** - Keep `Language` interface separate from `RDNASupportedLanguage`
3. **Persist preferences** - Always save language choice to localStorage
4. **Validate before update** - Only update LanguageManager on successful event responses
5. **Use full locale codes** - Pass complete locale code ('en-US') to both initOptions and setSDKLanguage()
6. **Show native scripts** - Display languages in their native writing systems
7. **Handle RTL properly** - Support right-to-left languages with direction indicators
8. **Initialize once** - Call LanguageManager.initialize() in app.js deviceready (SPA benefit)

### Error Handling & User Experience
9. **Map error codes** - Implement native localization files for initialization errors
10. **Early return pattern** - Check `longErrorCode !== 0` first, exit immediately on error
11. **Validate status codes** - Check `statusCode === 100 || 0` for success
12. **Show loading states** - Always display loading indicators during language changes
13. **Provide user feedback** - Show success/error alerts for all language operations
14. **Prevent duplicate calls** - Skip API call if selected language equals current language
15. **Clean up handlers** - Reset event handlers in SDKEventProvider cleanup
16. **Fall back gracefully** - Use English as default if language code is invalid

### State Management & SPA Architecture
17. **Initialize on deviceready** - Call LanguageManager.initialize() before AppInitializer
18. **Use CustomEvent** - Dispatch 'languageChanged' event for cross-component updates
19. **Sync from SDK events** - Update LanguageManager from `onSetLanguageResponse` handler
20. **Object singleton pattern** - Use MTDThreatManager-style object (not class) for LanguageManager
21. **Idempotent initialization** - Use `_initialized` flag to prevent duplicate setup
22. **Event-driven updates** - Listen to 'languageChanged' event in NavigationService, TutorialHomeScreen
23. **Register handlers once** - SDK event handlers persist across all navigation (SPA benefit)

## 🔗 Key Implementation Files

### Phase 1: SDK Initialization with Language Preference

#### Initialize SDK with Language (App Startup)
```javascript
// TutorialHomeScreen.js - SDK Initialization with Language
const TutorialHomeScreen = {
  onContentLoaded(params) {
    this.setupEventListeners();
    this.updateLanguageDisplay();

    // Listen for language changes
    document.addEventListener('languageChanged', this.updateLanguageDisplay.bind(this));
  },

  updateLanguageDisplay() {
    const languageManager = window.LanguageManager;
    if (!languageManager) return;

    const currentLanguage = languageManager.getCurrentLanguage();
    const displayEl = document.getElementById('current-language-text');
    if (displayEl) {
      displayEl.textContent = currentLanguage.nativeName;
    }
  },

  async handleInitializePress() {
    try {
      // Get current language from LanguageManager
      const languageManager = window.LanguageManager;
      const currentLanguage = languageManager
        ? languageManager.getCurrentLanguage()
        : { lang: 'en-US', display_text: 'English', direction: 0 };

      // Build initOptions with internationalizationOptions
      const initOptions = {
        internationalizationOptions: {
          localeCode: currentLanguage.lang,           // Full locale: 'en-US', 'hi-IN', 'ar-SA'
          localeName: currentLanguage.display_text,    // Display name: 'English', 'Hindi', 'Arabic'
          languageDirection: currentLanguage.direction // 0 = LTR, 1 = RTL
        },
        permissionOptions: {
          isLocationPermissionRequired: true,
          isLocationPermissionMandatory: false
        }
      };

      console.log('TutorialHomeScreen - Initializing SDK with language:', JSON.stringify({
        localeCode: initOptions.internationalizationOptions.localeCode,
        localeName: initOptions.internationalizationOptions.localeName,
        direction: initOptions.internationalizationOptions.languageDirection
      }, null, 2));

      // Initialize SDK with language preference
      const response = await rdnaService.initialize(serverConfig, initOptions);

      console.log('TutorialHomeScreen - SDK initialized successfully');

      // Extract SDK's supported languages from response
      const sdkLanguages = response.additionalInfo?.supportedLanguage || [];
      const sdkSelectedLanguage = response.additionalInfo?.selectedLanguage || 'en-US';

      console.log('TutorialHomeScreen - SDK languages received:', JSON.stringify({
        count: sdkLanguages.length,
        selected: sdkSelectedLanguage
      }, null, 2));

      // Sync SDK languages to LanguageManager
      if (languageManager && sdkLanguages.length > 0) {
        languageManager.updateFromSDK(sdkLanguages, sdkSelectedLanguage);
      }

      alert('Success: SDK initialized successfully');
    } catch (error) {
      console.error('TutorialHomeScreen - Initialize error:', JSON.stringify(error, null, 2));

      // Error codes are returned here, map to native localization files
      const errorCode = error.error?.longErrorCode;
      const errorMessage = error.error?.errorString || 'Unknown error';
      alert(`Initialization Failed\n\nError: ${errorMessage}\nCode: ${errorCode}`);
    }
  }
};
```

**Key Points:**
- SDK `initialize()` accepts `initOptions` with `internationalizationOptions` object
- If `localeCode` is missing or invalid, SDK falls back to English automatically
- `additionalInfo.supportedLanguage` contains all languages available from server
- `additionalInfo.selectedLanguage` indicates which language SDK is currently using
- Call `updateFromSDK()` to sync SDK languages with app's LanguageManager

### Phase 2: Dynamic Language Switching

#### setSDKLanguage API Implementation
```javascript
// rdnaService.js - Dynamic Language Change API
/**
 * Changes the SDK language dynamically after initialization
 *
 * This method allows changing the SDK's language preference after initialization has completed.
 * The SDK will update all internal messages and supported language configurations accordingly.
 * After successful API call, the SDK triggers an onSetLanguageResponse event with updated language data.
 * Uses sync response pattern similar to other API methods.
 *
 * @see https://developer.uniken.com/docs/internationalization
 *
 * Response Validation Logic:
 * 1. Check error.longErrorCode: 0 = success, > 0 = error
 * 2. An onSetLanguageResponse event will be triggered with updated language configuration
 * 3. Async events will be handled by event listeners
 *
 * @param {string} localeCode - The language locale code to set (e.g., 'en-US', 'hi-IN', 'ar-SA')
 * @param {number} languageDirection - Language text direction (0 = LTR, 1 = RTL)
 * @returns {Promise<Object>} Promise that resolves with sync response structure
 */
async setSDKLanguage(localeCode, languageDirection) {
  return new Promise((resolve, reject) => {
    console.log('RdnaService - Setting SDK language:', JSON.stringify({
      localeCode: localeCode,
      languageDirection: languageDirection
    }, null, 2));

    com.uniken.rdnaplugin.RdnaClient.setSDKLanguage(
      (response) => {
        console.log('RdnaService - SetSDKLanguage sync callback received');

        const result = JSON.parse(response);
        console.log('RdnaService - SetSDKLanguage sync response:', JSON.stringify({
          longErrorCode: result.error?.longErrorCode,
          shortErrorCode: result.error?.shortErrorCode,
          errorString: result.error?.errorString
        }, null, 2));

        if (result.error && result.error.longErrorCode === 0) {
          console.log('RdnaService - SetSDKLanguage sync response success, waiting for onSetLanguageResponse event');
          resolve(result);
        } else {
          console.error('RdnaService - SetSDKLanguage sync response error');
          reject(result);
        }
      },
      (error) => {
        console.error('RdnaService - SetSDKLanguage sync error callback');
        const result = JSON.parse(error);
        reject(result);
      },
      [localeCode, languageDirection]
    );
  });
}
```

**API Signature (from cordova-plugin-rdna):**
```javascript
com.uniken.rdnaplugin.RdnaClient.setSDKLanguage(
  successCallback,
  errorCallback,
  [
    localeCode,           // Full locale: 'en-US', 'hi-IN', 'es-ES'
    languageDirection     // 0 = LTR, 1 = RTL
  ]
)
```

### Event Handler Implementation

#### onSetLanguageResponse Event Handler
```javascript
// rdnaEventManager.js - Language Event Registration
const RdnaEventManager = {
  _initialized: false,
  setLanguageResponseHandler: null,

  initialize() {
    if (this._initialized) {
      console.log('RdnaEventManager - Already initialized, skipping');
      return;
    }

    // Register language response event listener
    const setLanguageResponseListener = this.onSetLanguageResponse.bind(this);
    document.addEventListener('onSetLanguageResponse', setLanguageResponseListener, false);

    this.listeners.push({
      eventName: 'onSetLanguageResponse',
      listener: setLanguageResponseListener
    });

    this._initialized = true;
  },

  /**
   * Handles set language response events
   * @param {Object} event - Event from native SDK containing updated language configuration
   */
  onSetLanguageResponse(event) {
    console.log("RdnaEventManager - Set language response event received");

    try {
      let languageData;

      // Parse response if it's a JSON string
      if (typeof event.response === 'string') {
        languageData = JSON.parse(event.response);
      } else {
        languageData = event.response;
      }

      console.log("RdnaEventManager - Set language response data:", JSON.stringify({
        localeCode: languageData.localeCode,
        localeName: languageData.localeName,
        languageDirection: languageData.languageDirection,
        supportedLanguagesCount: languageData.supportedLanguages?.length || 0,
        statusCode: languageData.status?.statusCode,
        errorCode: languageData.error?.longErrorCode
      }, null, 2));

      if (this.setLanguageResponseHandler) {
        this.setLanguageResponseHandler(languageData);
      } else {
        console.warn("RdnaEventManager - No set language response handler registered");
      }
    } catch (error) {
      console.error("RdnaEventManager - Failed to parse set language response:", error);
    }
  },

  /**
   * Sets the callback for set language response events
   * @param {Function} callback - Callback function to handle language response
   */
  setSetLanguageResponseHandler(callback) {
    console.log("RdnaEventManager - Setting set language response handler");
    this.setLanguageResponseHandler = callback;
  },

  /**
   * Gets the current set language response handler
   * @returns {Function|null}
   */
  getSetLanguageResponseHandler() {
    return this.setLanguageResponseHandler;
  },

  /**
   * Cleanup all event handlers
   */
  cleanup() {
    this.setLanguageResponseHandler = null;
    // ... other cleanup
  }
};
```

**Event Response Structure:**
```javascript
/**
 * @typedef {Object} RDNASetLanguageResponseData
 * @property {string} localeCode - 'es-ES'
 * @property {string} localeName - 'Spanish'
 * @property {string} languageDirection - 'LTR' or 'RTL'
 * @property {Array<RDNASupportedLanguage>} supportedLanguages - All available languages
 * @property {Object} app_messages - Localized app messages
 * @property {Object} status - { statusCode: 100, statusMessage: '...' }
 * @property {Object} error - { longErrorCode: 0, errorString: '...' }
 */
```

### Language Manager Pattern

#### LanguageManager Implementation
```javascript
// LanguageManager.js - Centralized Language State Management (Object Singleton)
/**
 * Language Manager - Object Singleton Pattern
 *
 * Manages language state for the entire Cordova SPA application.
 * Initialized ONCE in app.js deviceready handler.
 *
 * Features:
 * - Maintains currentLanguage and supportedLanguages state
 * - Persists language preference to localStorage
 * - Syncs with SDK language configuration
 * - Dispatches CustomEvent for UI updates
 * - Idempotent initialization
 */
const LanguageManager = {
  _initialized: false,
  currentLanguage: null,
  supportedLanguages: [],

  /**
   * Initialize language manager
   * Loads persisted language preference from localStorage
   */
  async initialize() {
    if (this._initialized) {
      console.log('LanguageManager - Already initialized, skipping');
      return;
    }

    console.log('LanguageManager - Initializing');

    try {
      // Set default language and supported languages
      this.currentLanguage = languageConfig.DEFAULT_LANGUAGE;
      this.supportedLanguages = languageConfig.DEFAULT_SUPPORTED_LANGUAGES;

      // Load persisted language preference
      const savedCode = await languageStorage.load();

      if (savedCode) {
        console.log('LanguageManager - Found persisted language:', savedCode);
        const language = languageConfig.getLanguageByCode(savedCode, this.supportedLanguages);
        this.currentLanguage = language;
      }

      this._initialized = true;
      console.log('LanguageManager - Initialized with language:', this.currentLanguage.display_text);
    } catch (error) {
      console.error('LanguageManager - Error initializing:', error);
      // Use default language on error
      this.currentLanguage = languageConfig.DEFAULT_LANGUAGE;
      this.supportedLanguages = languageConfig.DEFAULT_SUPPORTED_LANGUAGES;
      this._initialized = true;
    }
  },

  /**
   * Get current language
   * @returns {Language} Current language object
   */
  getCurrentLanguage() {
    if (!this._initialized) {
      console.warn('LanguageManager - Not initialized, returning default language');
      return languageConfig.DEFAULT_LANGUAGE;
    }
    return this.currentLanguage;
  },

  /**
   * Get supported languages
   * @returns {Language[]} Array of supported languages
   */
  getSupportedLanguages() {
    if (!this._initialized) {
      console.warn('LanguageManager - Not initialized, returning default languages');
      return languageConfig.DEFAULT_SUPPORTED_LANGUAGES;
    }
    return this.supportedLanguages;
  },

  /**
   * Change current language and persist to storage
   * @param {Language} language - Language object to set as current
   */
  async changeLanguage(language) {
    console.log('LanguageManager - Changing language to:', language.display_text);

    try {
      // Update current language
      this.currentLanguage = language;

      // Persist to localStorage
      await languageStorage.save(language.lang);

      // Notify listeners
      this.notifyListeners();

      console.log('LanguageManager - Language changed successfully');
    } catch (error) {
      console.error('LanguageManager - Error changing language:', error);
      throw error;
    }
  },

  /**
   * Update supported languages and current language from SDK response
   * Called after SDK initialization completes
   * @param {RDNASupportedLanguage[]} sdkLanguages - Array of languages from SDK
   * @param {string} sdkSelectedLanguage - Selected language code from SDK
   */
  updateFromSDK(sdkLanguages, sdkSelectedLanguage) {
    console.log('LanguageManager - Updating from SDK:', JSON.stringify({
      sdkLanguagesCount: sdkLanguages.length,
      sdkSelectedLanguage: sdkSelectedLanguage
    }, null, 2));

    try {
      // Convert SDK languages to customer format
      const convertedLanguages = sdkLanguages.map(languageConfig.convertSDKLanguageToCustomer);

      // Update supported languages
      this.supportedLanguages = convertedLanguages;

      // Update current language based on SDK's selected language
      const sdkCurrentLanguage = languageConfig.getLanguageByCode(sdkSelectedLanguage, convertedLanguages);
      this.currentLanguage = sdkCurrentLanguage;

      // Persist SDK's selected language
      languageStorage.save(sdkCurrentLanguage.lang).catch(error => {
        console.error('LanguageManager - Failed to persist SDK language:', error);
      });

      // Notify listeners
      this.notifyListeners();

      console.log('LanguageManager - Updated from SDK successfully');
    } catch (error) {
      console.error('LanguageManager - Error updating from SDK:', error);
    }
  },

  /**
   * Notify all listeners of language change via CustomEvent
   */
  notifyListeners() {
    console.log('LanguageManager - Notifying listeners of language change');

    const event = new CustomEvent('languageChanged', {
      detail: {
        language: this.currentLanguage
      }
    });

    document.dispatchEvent(event);
  }
};
```

**app.js Integration:**
```javascript
// app.js - Initialize LanguageManager on deviceready
const App = {
  initialize() {
    console.log('App - Initializing');
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  async onDeviceReady() {
    console.log('App - Device ready');

    // Initialize Language Manager FIRST (before AppInitializer)
    if (typeof LanguageManager !== 'undefined') {
      await LanguageManager.initialize();
      console.log('App - LanguageManager initialized with language:',
        LanguageManager.getCurrentLanguage().display_text);
    }

    // Initialize SDK handlers ONCE (SPA benefit!)
    AppInitializer.initialize();

    // Initialize drawer with language support
    NavigationService.initializeDrawer();

    // Load initial screen
    NavigationService.navigate('TutorialHome');
  }
};

// Initialize the app
App.initialize();
```

### Language Selector UI Component

#### Language Selector Modal
```javascript
// LanguageSelector.js - Language Picker Modal
/**
 * Language Selector Component
 *
 * Provides a modal UI for selecting application language.
 * Displays languages in their native scripts with RTL indicators.
 * Uses show()/hide() pattern for modal control.
 */
const LanguageSelector = {
  /**
   * Show the language selector modal
   * @param {Object} options - Configuration options
   * @param {Function} options.onSelect - Callback when language is selected
   * @param {Function} options.onClose - Callback when modal is closed
   */
  show(options = {}) {
    console.log('LanguageSelector - Showing modal');

    this.onSelectCallback = options.onSelect;
    this.onCloseCallback = options.onClose;

    // Get language data from LanguageManager
    const languageManager = window.LanguageManager;
    if (!languageManager) {
      console.error('LanguageSelector - LanguageManager not available');
      return;
    }

    const currentLanguage = languageManager.getCurrentLanguage();
    const supportedLanguages = languageManager.getSupportedLanguages();

    // Render language options
    this.renderLanguageOptions(currentLanguage, supportedLanguages);

    // Show modal with fade-in animation
    const modal = document.getElementById('language-selector-modal');
    const overlay = document.getElementById('language-selector-overlay');

    if (modal && overlay) {
      overlay.style.display = 'block';
      modal.style.display = 'block';

      // Trigger animation
      setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
      }, 10);

      // Setup close button
      const closeBtn = document.getElementById('language-selector-close');
      if (closeBtn) {
        closeBtn.onclick = () => this.hide();
      }

      // Setup overlay click to close
      overlay.onclick = () => this.hide();
    }
  },

  /**
   * Hide the language selector modal
   */
  hide() {
    console.log('LanguageSelector - Hiding modal');

    const modal = document.getElementById('language-selector-modal');
    const overlay = document.getElementById('language-selector-overlay');

    if (modal && overlay) {
      // Fade out animation
      overlay.style.opacity = '0';
      modal.style.opacity = '0';
      modal.style.transform = 'translateY(20px)';

      // Hide after animation
      setTimeout(() => {
        overlay.style.display = 'none';
        modal.style.display = 'none';
      }, 300);
    }

    // Call close callback
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  },

  /**
   * Render language options in the modal
   */
  renderLanguageOptions(currentLanguage, supportedLanguages) {
    const listContainer = document.getElementById('language-selector-list');
    if (!listContainer) return;

    // Clear existing options
    listContainer.innerHTML = '';

    // Render each language
    supportedLanguages.forEach(language => {
      const isSelected = currentLanguage.lang === language.lang;

      const button = document.createElement('button');
      button.className = 'language-selector-option';
      if (isSelected) {
        button.classList.add('language-selector-option-selected');
      }

      button.onclick = () => this.handleLanguageSelect(language);

      // Language info container
      const infoDiv = document.createElement('div');
      infoDiv.className = 'language-selector-option-info';

      // Native name
      const nativeName = document.createElement('div');
      nativeName.className = 'language-selector-option-native';
      nativeName.textContent = language.nativeName;
      infoDiv.appendChild(nativeName);

      // English name
      const englishName = document.createElement('div');
      englishName.className = 'language-selector-option-english';
      englishName.textContent = language.display_text;
      infoDiv.appendChild(englishName);

      button.appendChild(infoDiv);

      // Metadata container (badges)
      const metaDiv = document.createElement('div');
      metaDiv.className = 'language-selector-option-meta';

      // RTL badge
      if (language.isRTL) {
        const rtlBadge = document.createElement('span');
        rtlBadge.className = 'language-selector-rtl-badge';
        rtlBadge.textContent = 'RTL';
        metaDiv.appendChild(rtlBadge);
      }

      // Selection checkmark
      if (isSelected) {
        const checkmark = document.createElement('span');
        checkmark.className = 'language-selector-checkmark';
        checkmark.textContent = '✓';
        metaDiv.appendChild(checkmark);
      }

      button.appendChild(metaDiv);
      listContainer.appendChild(button);
    });
  },

  /**
   * Handle language selection
   */
  handleLanguageSelect(language) {
    console.log('LanguageSelector - Language selected:', language.display_text);

    // Hide modal
    this.hide();

    // Call select callback
    if (this.onSelectCallback) {
      this.onSelectCallback(language);
    }
  }
};
```

**Visual Output:**
```
┌─────────────────────────────────┐
│ Select Language            ✕    │
├─────────────────────────────────┤
│ ✓ English                       │
│   English                       │
├─────────────────────────────────┤
│   हिन्दी                         │
│   Hindi                         │
├─────────────────────────────────┤
│   العربية            [RTL]      │
│   Arabic                        │
├─────────────────────────────────┤
│   Español                       │
│   Spanish                       │
└─────────────────────────────────┘
```

### Complete Language Change Flow

#### DrawerContent with Language Change Menu
```javascript
// NavigationService.js - Language Link in Drawer Menu
const NavigationService = {
  /**
   * Initialize drawer language link event handler
   */
  initializeDrawerLanguageLink() {
    const languageLink = document.getElementById('drawer-language-link');
    if (languageLink) {
      languageLink.onclick = (e) => {
        e.preventDefault();
        this.handleDrawerLanguageClick();
      };
      console.log('NavigationService - Drawer language link initialized');
    }

    // Update initial display
    this.updateDrawerLanguageDisplay();

    // Listen for language changes to update drawer display
    document.addEventListener('languageChanged', this.updateDrawerLanguageDisplay.bind(this));
  },

  /**
   * Handle drawer language link click
   * Shows language selector modal and calls setSDKLanguage API
   */
  handleDrawerLanguageClick() {
    console.log('NavigationService - Drawer language link clicked');

    const languageSelector = window.LanguageSelector;
    if (!languageSelector) {
      console.error('NavigationService - LanguageSelector not available');
      return;
    }

    const languageLink = document.getElementById('drawer-language-link');

    // Show language selector modal
    languageSelector.show({
      onSelect: async (language) => {
        console.log('NavigationService - Language selected from drawer:', language.display_text);

        // Close drawer
        this.closeDrawer();

        // Check if the selected language is the same as current
        const languageManager = window.LanguageManager;
        if (!languageManager) {
          console.error('NavigationService - LanguageManager not available');
          return;
        }

        const currentLanguage = languageManager.getCurrentLanguage();
        if (language.lang === currentLanguage.lang) {
          console.log('NavigationService - Selected language is same as current, skipping API call');
          return;
        }

        // Show loading state
        if (languageLink) {
          languageLink.classList.add('loading');
        }

        try {
          console.log('NavigationService - Calling setSDKLanguage API:', JSON.stringify({
            localeCode: language.lang,
            languageDirection: language.direction
          }, null, 2));

          // Call setSDKLanguage API
          const syncResponse = await rdnaService.setSDKLanguage(
            language.lang,
            language.direction
          );

          console.log('NavigationService - SetSDKLanguage sync response received:', JSON.stringify({
            longErrorCode: syncResponse.error.longErrorCode,
            shortErrorCode: syncResponse.error.shortErrorCode,
            errorString: syncResponse.error.errorString
          }, null, 2));

          // Sync response successful means API accepted the request
          // The actual language change result will come via onSetLanguageResponse event
          // SDKEventProvider's handleSetLanguageResponse will:
          // - Update the LanguageManager if successful
          // - Show success/error alert to the user

          console.log('NavigationService - Language change request submitted, waiting for onSetLanguageResponse event');

        } catch (error) {
          console.error('NavigationService - SetSDKLanguage sync error:', error);

          const errorMessage = error.error
            ? `${error.error.errorString} (${error.error.longErrorCode})`
            : 'Failed to change language';

          alert(`Language Change Error\n\nFailed to change language: ${errorMessage}`);
        } finally {
          // Remove loading state
          if (languageLink) {
            languageLink.classList.remove('loading');
          }
        }
      },
      onClose: () => {
        console.log('NavigationService - Language selector closed from drawer');
      }
    });
  },

  /**
   * Update drawer language display with current language
   */
  updateDrawerLanguageDisplay() {
    const languageManager = window.LanguageManager;
    if (!languageManager) {
      return;
    }

    const currentLanguage = languageManager.getCurrentLanguage();
    if (!currentLanguage) {
      return;
    }

    const displayEl = document.getElementById('drawer-current-language');
    if (displayEl) {
      displayEl.textContent = currentLanguage.nativeName;
      console.log('NavigationService - Drawer language display updated:', currentLanguage.display_text);
    }
  }
};
```

### SDKEventProvider Integration

#### Language Event Handler in Provider
```javascript
// SDKEventProvider.js - Global Language Event Handler
const SDKEventProvider = {
  initialize() {
    if (this._initialized) {
      console.log('SDKEventProvider - Already initialized, skipping');
      return;
    }

    const eventManager = rdnaService.getEventManager();

    // Register language response handler
    eventManager.setSetLanguageResponseHandler(this.handleSetLanguageResponse.bind(this));

    // ... other handlers ...

    this._initialized = true;
    console.log('SDKEventProvider - Initialized with language event handlers');
  },

  /**
   * Event handler for language change response
   * Called when setSDKLanguage API is invoked and SDK responds with updated language configuration
   */
  handleSetLanguageResponse(data) {
    console.log('SDKEventProvider - Set language response received:', JSON.stringify({
      localeCode: data.localeCode,
      localeName: data.localeName,
      languageDirection: data.languageDirection,
      supportedLanguagesCount: data.supportedLanguages?.length || 0,
      statusCode: data.status?.statusCode,
      errorCode: data.error?.longErrorCode
    }, null, 2));

    // Early error check - exit immediately if error exists
    if (data.error.longErrorCode !== 0) {
      alert(
        `Language Change Failed\n\n` +
        `Failed to change language.\n\n` +
        `Error: ${data.error.errorString}\n` +
        `Error Code: ${data.error.longErrorCode}`
      );
      return;
    }

    // Check if language change was successful
    // Success: statusCode === 100 or 0, AND longErrorCode === 0
    if (data.status.statusCode === 100 || data.status.statusCode === 0) {
      console.log('SDKEventProvider - Language changed successfully to:', data.localeName);

      // Update language manager with SDK's updated language configuration
      if (data.supportedLanguages && data.supportedLanguages.length > 0) {
        console.log('SDKEventProvider - Updating language manager with new SDK languages');

        const languageManager = window.LanguageManager;
        if (languageManager) {
          languageManager.updateFromSDK(
            data.supportedLanguages,
            data.localeCode
          );
        }

        // Show success message to user
        alert(
          `Language Changed\n\n` +
          `Language has been successfully changed to ${data.localeName}.`
        );
      } else {
        console.warn('SDKEventProvider - No supported languages in set language response');
        alert(
          `Language Change Warning\n\n` +
          `Language change completed but no supported languages were returned by the SDK.`
        );
      }
    } else {
      // Language change failed due to status code
      console.error('SDKEventProvider - Language change failed:', JSON.stringify({
        errorCode: data.error.longErrorCode,
        errorMessage: data.error.errorString,
        statusCode: data.status.statusCode,
        statusMessage: data.status.statusMessage
      }, null, 2));

      alert(
        `Language Change Failed\n\n` +
        `Failed to change language.\n\n` +
        `Status Message: ${data.status.statusMessage}\n` +
        `Status Code: ${data.status.statusCode}`
      );
    }
  }
};
```

### Type Definitions

#### Customer Language Types (JSDoc)
```javascript
// language.js - Customer Language Interface (Separate from SDK)
/**
 * Customer Language Interface
 * Separate from SDK's RDNASupportedLanguage - optimized for customer UI
 *
 * @typedef {Object} Language
 * @property {string} lang - Full locale code: 'en-US', 'hi-IN', 'ar-SA', 'es-ES'
 * @property {string} display_text - Display name: 'English', 'Hindi', 'Arabic', 'Spanish'
 * @property {string} nativeName - Native script: 'English', 'हिन्दी', 'العربية', 'Español'
 * @property {number} direction - 0 = LTR, 1 = RTL (matches SDK initOptions)
 * @property {boolean} isRTL - Helper for UI decisions
 */

/**
 * SDK Supported Language Structure
 * From SDK's initialize response and setLanguageResponse
 *
 * @typedef {Object} RDNASupportedLanguage
 * @property {string} lang - Full locale: 'en-US', 'hi-IN'
 * @property {string} display_text - English name: 'English', 'Hindi'
 * @property {string} direction - 'LTR' or 'RTL'
 */

/**
 * Set Language Response Data
 * Response from onSetLanguageResponse event containing updated language configuration
 *
 * @typedef {Object} RDNASetLanguageResponseData
 * @property {string} localeCode - 'es-ES'
 * @property {string} localeName - 'Spanish'
 * @property {string} languageDirection - 'LTR' or 'RTL'
 * @property {RDNASupportedLanguage[]} supportedLanguages - All available languages from SDK
 * @property {Object} app_messages - Localized app messages
 * @property {Object} status - Status code and message
 * @property {Object} error - Error code and string
 */

/**
 * Language Management Callbacks
 *
 * @callback RDNASetLanguageResponseCallback
 * @param {RDNASetLanguageResponseData} data - Language response data
 */
```

### Utility Functions

#### Language Configuration Utilities
```javascript
// languageConfig.js - Language Conversion and Lookup Utilities
/**
 * Default Hardcoded Languages
 * Shown before SDK initialization completes
 * Using full locale codes for consistency with SDK
 */
const DEFAULT_SUPPORTED_LANGUAGES = [
  {
    lang: 'en-US',
    display_text: 'English',
    nativeName: 'English',
    direction: 0,
    isRTL: false
  },
  {
    lang: 'hi-IN',
    display_text: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 0,
    isRTL: false
  },
  {
    lang: 'ar-SA',
    display_text: 'Arabic',
    nativeName: 'العربية',
    direction: 1,
    isRTL: true
  },
  {
    lang: 'es-ES',
    display_text: 'Spanish',
    nativeName: 'Español',
    direction: 0,
    isRTL: false
  },
  {
    lang: 'fr-FR',
    display_text: 'French',
    nativeName: 'Français',
    direction: 0,
    isRTL: false
  }
];

const DEFAULT_LANGUAGE = DEFAULT_SUPPORTED_LANGUAGES[0]; // English

/**
 * Native Name Lookup Table
 * SDK doesn't provide native names, so we maintain this hardcoded mapping
 */
const NATIVE_NAME_LOOKUP = {
  'en': 'English',
  'hi': 'हिन्दी',
  'ar': 'العربية',
  'es': 'Español',
  'fr': 'Français'
  // Add more as needed
};

/**
 * Convert SDK's RDNASupportedLanguage to Customer's Language interface
 * Maps SDK response format to customer UI format with native names
 *
 * @param {RDNASupportedLanguage} sdkLang - SDK language object
 * @returns {Language} Customer language object
 */
function convertSDKLanguageToCustomer(sdkLang) {
  const directionNum = sdkLang.direction === 'RTL' ? 1 : 0;
  const isRTL = sdkLang.direction === 'RTL';
  const baseCode = sdkLang.lang.split('-')[0];
  const nativeName = NATIVE_NAME_LOOKUP[baseCode] || sdkLang.display_text;

  return {
    lang: sdkLang.lang,
    display_text: sdkLang.display_text,
    nativeName: nativeName,
    direction: directionNum,
    isRTL: isRTL
  };
}

/**
 * Get language by locale code
 * Tries exact match first, then base code match
 *
 * @param {string} langCode - Locale code to find
 * @param {Language[]} languages - Array of languages to search
 * @returns {Language} Found language or default
 */
function getLanguageByCode(langCode, languages) {
  // Try exact match first
  let found = languages.find(lang => lang.lang === langCode);

  // If not found, try matching base code (e.g., 'en' matches 'en-US')
  if (!found) {
    const baseCode = langCode.split('-')[0];
    found = languages.find(lang => lang.lang.startsWith(baseCode));
  }

  return found || DEFAULT_LANGUAGE;
}
```

#### Language Persistence Utilities
```javascript
// languageStorage.js - localStorage Persistence
const LANGUAGE_STORAGE_KEY = '@app_language_preference';

const languageStorage = {
  /**
   * Save language preference to localStorage
   * @param {string} languageCode - Language code to save
   * @returns {Promise<void>}
   */
  save(languageCode) {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
        console.log('LanguageStorage - Saved language:', languageCode);
        resolve();
      } catch (error) {
        console.error('LanguageStorage - Error saving language:', error);
        reject(error);
      }
    });
  },

  /**
   * Load language preference from localStorage
   * @returns {Promise<string|null>}
   */
  load() {
    return new Promise((resolve) => {
      try {
        const languageCode = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        console.log('LanguageStorage - Loaded language:', languageCode);
        resolve(languageCode);
      } catch (error) {
        console.error('LanguageStorage - Error loading language:', error);
        resolve(null);
      }
    });
  },

  /**
   * Clear saved language preference
   * @returns {Promise<void>}
   */
  clear() {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
        console.log('LanguageStorage - Cleared language preference');
        resolve();
      } catch (error) {
        console.error('LanguageStorage - Error clearing language:', error);
        reject(error);
      }
    });
  }
};
```

### Native Localization Files

#### Android Localization (strings.xml)
```xml
<!-- platforms/android/app/src/main/res/values/strings_rel_id.xml -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- English Error Messages -->
    <string name="RDNA_ERR_12345">SDK initialization failed</string>
    <string name="RDNA_ERR_67890">Network connection error</string>
    <!-- Add more error code mappings -->
</resources>

<!-- platforms/android/app/src/main/res/values-es/strings_rel_id.xml -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Spanish Error Messages -->
    <string name="RDNA_ERR_12345">Error de inicialización del SDK</string>
    <string name="RDNA_ERR_67890">Error de conexión de red</string>
    <!-- Add more error code mappings -->
</resources>

<!-- platforms/android/app/src/main/res/values-hi/strings_rel_id.xml -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Hindi Error Messages -->
    <string name="RDNA_ERR_12345">SDK प्रारंभीकरण विफल</string>
    <string name="RDNA_ERR_67890">नेटवर्क कनेक्शन त्रुटि</string>
    <!-- Add more error code mappings -->
</resources>
```

#### iOS Localization (.strings)
```
// platforms/ios/SharedLocalization/en.lproj/RELID.strings
/* English Error Messages */
"RDNA_ERR_12345" = "SDK initialization failed";
"RDNA_ERR_67890" = "Network connection error";

// platforms/ios/SharedLocalization/es.lproj/RELID.strings
/* Spanish Error Messages */
"RDNA_ERR_12345" = "Error de inicialización del SDK";
"RDNA_ERR_67890" = "Error de conexión de red";

// platforms/ios/SharedLocalization/hi.lproj/RELID.strings
/* Hindi Error Messages */
"RDNA_ERR_12345" = "SDK प्रारंभीकरण विफल";
"RDNA_ERR_67890" = "नेटवर्क कनेक्शन त्रुटि";
```

---

## 📚 Related Documentation

### Official REL-ID Internationalization APIs
- **[SDK Initialization API](https://developer.uniken.com/docs/initialize-1)** - Complete API reference for SDK initialization with language preferences
- **[Set SDK Language API](https://developer.uniken.com/docs/internationalization)** - Comprehensive guide for dynamic language switching
- **[Language Events API](https://developer.uniken.com/docs/internationalization)** - Event handler documentation for language response events

### REL-ID Developer Resources
- **[REL-ID Developer Portal](https://developer.uniken.com/)** - Main developer documentation hub

### Cordova Resources
- **[Cordova Documentation](https://cordova.apache.org/docs/en/latest/)** - Official Cordova setup and development guides
- **[Cordova Plugin API](https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/)** - Plugin development and integration
- **[localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)** - localStorage documentation for data persistence
- **[CustomEvent API](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)** - CustomEvent for cross-component communication
- **[JSDoc](https://jsdoc.app/)** - JSDoc documentation syntax and best practices

---

**🌐 Congratulations! You've mastered Internationalization with REL-ID SDK in Cordova!**

*You're now equipped to implement production-ready multi-language applications with proper SDK integration, dynamic language switching, and native platform localization. Use this knowledge to create globally accessible experiences that provide users with seamless language management across initialization and runtime, while maintaining proper error handling through native localization files.*
