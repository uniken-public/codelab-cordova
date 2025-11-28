# REL-ID Cordova Codelab: Additional Device Activation

[![Cordova](https://img.shields.io/badge/Cordova-14.0.1-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.09.02-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/)
[![REL-ID Verify](https://img.shields.io/badge/REL--ID%20Verify-Enabled-purple.svg)]()
[![Device Activation](https://img.shields.io/badge/Device%20Activation-Push%20Notifications-cyan.svg)]()
[![SPA](https://img.shields.io/badge/Architecture-SPA-purple.svg)]()

> **Codelab Step 4:** Master Additional Device Activation with REL-ID Verify push notification feature in Cordova

This folder contains the source code for the solution demonstrating [REL-ID Additional Device Activation](https://codelab.uniken.com/codelabs/cordova-mfa-additional-device-activation-flow/index.html?index=..%2F..index#5) using push notification-based device approval workflows with **Cordova Single Page Application (SPA)** architecture.

## 📱 What You'll Learn

In this advanced device activation codelab, you'll master production-ready device onboarding patterns with **Cordova SPA architecture**:

### Additional Device Activation
- ✅ **REL-ID Verify Integration**: Push notification-based device activation system
- ✅ **Automatic Activation Flow**: SDK-triggered device activation during authentication
- ✅ **Fallback Methods**: Alternative activation when registered devices unavailable
- ✅ **Real-time Processing**: Live status updates during activation workflows

### Notification Management
- ✅ **Server Notification Retrieval**: Fetch notifications with `getNotifications()` API
- ✅ **Action Processing**: Handle user responses with `updateNotification()` API
- ✅ **Interactive UI**: Action modal with bsubmission
- ✅ **Real-time Updates**: Immediate UI feedback after action processing

### SPA Architecture Patterns
- ✅ **Event-Driven Architecture**: Handle `addNewDeviceOptions` SDK events
- ✅ **Template-Based Navigation**: Content swapping without page reloads
- ✅ **Persistent Event Handlers**: Handlers registered once, work forever
- ✅ **Dashboard Integration**: Seamless access via drawer navigation

## 🎯 Learning Objectives

By completing this Additional Device Activation codelab, you'll be able to:

### Device Activation Mastery
1. **Implement REL-ID Verify workflows** with automatic push notification integration in Cordova
2. **Handle SDK-initiated device activation** triggered during MFA authentication flows
3. **Build fallback activation strategies** for users without accessible registered devices
4. **Design real-time status interfaces** with processing indicators and user guidance

### Notification Management
5. **Create notification management systems** with server synchronization and user actions
6. **Implement action modal interfaces** with proper data structure handling
7. **Handle notification responses** with comprehensive error checking (3-layer pattern)
8. **Integrate notification features** into existing dashboard via drawer navigation

### Cordova-Specific Integration
9. **Debug Cordova plugin integration** and understand callback routing patterns
10. **Integrate device activation seamlessly** with existing MFA authentication workflows in SPA
11. **Handle data structure differences** between Cordova plugin responses and React Native
12. **Build production-ready Cordova apps** with sophisticated device activation features

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- **[REL-ID Session Management Codelab](https://codelab.uniken.com/codelabs/cordova-session-management-flow/index.html?index=..%2F..index#0)** - Session handling patterns
- Understanding of push notification systems and device-to-device communication
- Experience with Cordova SPA architecture and template-based navigation
- Knowledge of REL-ID SDK event-driven architecture patterns
- Familiarity with server notification systems and action-based workflows

## 📁 Additional Device Activation Project Structure

```
relid-MFA-additional-device-activation/
├── 📱 Complete Cordova MFA + Device Activation App (SPA Architecture)
│   ├── platforms/              # Platform-specific builds (iOS, Android)
│   ├── plugins/                # Cordova plugins
│   │   ├── cordova-plugin-rdna/     # REL-ID SDK plugin (v25.09.02)
│   │   └── cordova-plugin-file/     # File system access (required for iOS)
│   ├── www/                    # Web application (SPA)
│   └── config.xml              # Cordova configuration
│
├── 📦 Device Activation Architecture (SPA Pattern)
│   └── www/
│       ├── index.html          # 🆕 SINGLE HTML FILE (SPA!)
│       │                       # Contains ALL screen templates including:
│       │                       # - VerifyAuth template (device activation)
│       │                       # - GetNotifications template (notification management)
│       │                       # - All MFA screen templates
│       │                       # All scripts loaded ONCE
│       │                       # Persistent shell (drawer, modals)
│       ├── css/
│       │   └── index.css       # 🆕 Enhanced styles for all screens
│       │                       # - VerifyAuth screen styles (message/fallback containers)
│       │                       # - GetNotifications screen styles (card-based design)
│       │                       # - Notification modal styles (action buttons)
│       ├── js/
│       │   └── app.js          # App bootstrap (deviceready → AppInitializer)
│       └── src/
│           ├── tutorial/       # Enhanced MFA + Device Activation flow
│           │   ├── navigation/
│           │   │   └── NavigationService.js  # SPA navigation (template swapping)
│           │   └── screens/
│           │       ├── mfa/    # 🔐 Enhanced MFA screens + Device Activation
│           │       │   ├── VerifyAuthScreen.js       # 🆕 REL-ID Verify device activation
│           │       │   │                        # - Auto-triggers performVerifyAuth(true)
│           │       │   │                        # - Fallback activation button
│           │       │   │                        # - Real-time processing status
│           │       │   ├── DashboardScreen.js        # 🆕 Enhanced with notification link
│           │       │   ├── CheckUserScreen.js        # Username input & validation
│           │       │   ├── SetPasswordScreen.js      # Password creation
│           │       │   ├── VerifyPasswordScreen.js   # Password verification
│           │       │   ├── UserLDAConsentScreen.js   # Biometric consent
│           │       │   └── ActivationCodeScreen.js   # OTP input
│           │       ├── notification/ # 🆕 Notification Management System
│           │       │   └── GetNotificationsScreen.js # Server notification management
│           │       │                            # - Auto-loads notifications
│           │       │                            # - Action modal interface
│           │       │                            # - Real-time updates
│           │       └── tutorial/  # Base tutorial screens (4 screens)
│           │           ├── TutorialHomeScreen.js
│           │           ├── TutorialSuccessScreen.js
│           │           ├── TutorialErrorScreen.js
│           │           └── SecurityExitScreen.js
│           └── uniken/         # 🛡️ Enhanced REL-ID Integration
│               ├── AppInitializer.js  # One-time SDK initialization
│               ├── providers/
│               │   └── SDKEventProvider.js  # 🆕 Enhanced with device activation
│               │                       # - handleAddNewDeviceOptions() navigation
│               ├── services/          # 🔧 Enhanced SDK services
│               │   ├── rdnaService.js       # 🆕 Added 4 NEW APIs
│               │   │                   # - getNotifications()
│               │   │                   # - updateNotification()
│               │   │                   # - performVerifyAuth()
│               │   │                   # - fallbackNewDeviceActivationFlow()
│               │   └── rdnaEventManager.js  # 🆕 Added 3 NEW event handlers
│               │                       # - onAddNewDeviceOptions
│               │                       # - onGetNotifications
│               │                       # - onUpdateNotification
│               └── utils/             # Helper utilities
│                   ├── connectionProfileParser.js  # Uses cordova-plugin-file
│                   ├── passwordPolicyUtils.js
│                   └── progressHelper.js
│
└── 📚 Configuration
    ├── config.xml              # Cordova app configuration
    └── src/uniken/cp/
        └── agent_info.json     # Connection profile configuration
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-MFA-additional-device-activation

# Place the cordova-plugin-rdna plugin
# Copy RdnaClient/ folder to project root (refer to Project Structure above)

# Add platforms (if not already added)
cordova platform add ios
cordova platform add android

# Install required plugins
cordova plugin add cordova-plugin-file  # Required for file loading in iOS

# Verify plugins installed
cordova plugin ls
# Should show:
# - cordova-plugin-rdna (version 25.09.02)
# - cordova-plugin-file (version 8.1.3)

# Prepare platforms
cordova prepare

# Run the application
cordova run ios
# or
cordova run android
```

### Verify Device Activation Features

Once the app launches, verify these additional device activation capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ `addNewDeviceOptions` event triggers VerifyAuthScreen during authentication
3. ✅ REL-ID Verify automatic activation with `performVerifyAuth(true)`
4. ✅ Fallback activation method available via "Activate using fallback method" button
5. ✅ Dashboard drawer menu contains "🔔 Get Notifications" option
6. ✅ GetNotificationsScreen auto-loads server notifications with action modal

## 🎓 Learning Checkpoints

### Checkpoint 1: REL-ID Verify Device Activation
- [ ] I understand the `addNewDeviceOptions` SDK event and when it triggers
- [ ] I can implement VerifyAuthScreen with automatic `performVerifyAuth(true)` call
- [ ] I know how REL-ID Verify sends push notifications to registered devices
- [ ] I can handle real-time processing status and user guidance messaging in SPA
- [ ] I understand the seamless integration with existing MFA authentication flows

### Checkpoint 2: Fallback Activation Strategies
- [ ] I can implement `fallbackNewDeviceActivationFlow()` API integration in Cordova
- [ ] I understand when to provide fallback options (device not handy scenarios)
- [ ] I can create user-friendly fallback interfaces with clear messaging
- [ ] I know how to handle errors and guide users through alternative methods
- [ ] I understand Cordova callback pattern (success callback always has errorCode 0)

### Checkpoint 3: Notification Management System
- [ ] I can implement `getNotifications()` API with auto-loading functionality
- [ ] I understand Cordova notification structure (`body[0].subject`, `create_ts`, `actions`)
- [ ] I can create interactive action modals with dynamic button generation
- [ ] I can handle `updateNotification()` API calls with 3-layer error checking
- [ ] I understand drawer navigation integration for notification access in SPA

### Checkpoint 4: Event-Driven Integration in SPA
- [ ] I can handle `addNewDeviceOptions` events in SDKEventProvider
- [ ] I understand automatic navigation to VerifyAuthScreen with proper parameters
- [ ] I can manage notification events (`onGetNotifications`, `onUpdateNotification`)
- [ ] I know how to use defensive JSON parsing (handle string and object responses)
- [ ] I can debug device activation event flows and troubleshoot Cordova-specific issues

### Checkpoint 5: Production Device Activation in Cordova
- [ ] I understand security implications of device activation workflows
- [ ] I can implement comprehensive error handling for Cordova plugin responses
- [ ] I know how to test device activation with multiple physical devices
- [ ] I can optimize notification loading and action processing performance
- [ ] I understand Cordova callback routing (success vs error callbacks)

## 🔄 Device Activation User Flow

### Scenario 1: New Device During MFA Authentication
1. **User completes username/password** → MFA validation successful
2. **SDK detects unregistered device** → Triggers `addNewDeviceOptions` event
3. **SDKEventProvider auto-navigation** → Navigate to VerifyAuthScreen with device options
4. **VerifyAuthScreen onContentLoaded** → `performVerifyAuth(true)` called automatically
5. **Push notifications sent** → Registered devices receive approval requests via REL-ID Verify
6. **User approves on registered device** → New device activation confirmed
7. **Continue MFA flow** → Proceed to password input or LDA consent
8. **Processing state reset** → Button re-enables, status banner updates

### Scenario 2: Fallback Activation (Device Not Available)
1. **REL-ID Verify process initiated** → But registered devices not accessible
2. **User taps "Activate using fallback method"** → Fallback button clicked
3. **Fallback activation flow initiated** → `fallbackNewDeviceActivationFlow()` called
4. **Alternative verification process** → Server-configured challenge method (typically activation code)
5. **User completes alternative verification** → Device activation confirmed
6. **Continue MFA flow** → Proceed to remaining authentication steps

### Scenario 3: Notification Management Access
1. **User completes authentication** → Reaches dashboard
2. **Opens drawer navigation** → Taps hamburger menu (☰)
3. **Selects "🔔 Get Notifications"** → Navigation to GetNotificationsScreen
4. **Notifications auto-load** → `getNotifications()` API called in `onContentLoaded()`
5. **Notifications displayed** → Cards with title, message, timestamp, action count, status
6. **Tap notification card** → Action modal opens with full notification details
7. **Select action and tap button** → `updateNotification()` API called with action value
8. **3-layer error checking** → errCode → ResponseData.status_code → StatusCode
9. **Real-time UI updates** → Success alert, notifications refresh automatically


## 📚 Advanced Resources

- **REL-ID Verify Documentation**: [Device Activation Guide](https://developer.uniken.com/docs/rel-id-verify)
- **REL-ID Notification API**: [Server Notification Integration](https://developer.uniken.com/docs/notifications)
- **Cordova Plugin Development**: [Plugin API Reference](https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/)
- **cordova-plugin-file**: [File System Access for iOS](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/)
- **Push Notification Best Practices**: [Mobile Push Notification Guidelines](https://developer.uniken.com/docs/push-notifications)
- **Single Page Applications**: [SPA Architecture Patterns](https://en.wikipedia.org/wiki/Single-page_application)

## 💡 Pro Tips

### Device Activation Best Practices
1. **Test with multiple physical devices** - REL-ID Verify requires real device-to-device communication
2. **Handle network timeouts gracefully** - Push notifications depend on network connectivity
3. **Provide clear status messaging** - Use `showStatus()` and `showProcessing()` for user feedback
4. **Implement comprehensive fallback flows** - Always provide alternative activation methods
5. **Test background/foreground scenarios** - Device activation can occur across app state changes

### Notification Management
6. **Parse Cordova data structures correctly** - Use `body[0].subject`, `create_ts`, `notification_uuid`
7. **Implement 3-layer error checking** - Check errCode → ResponseData.status_code → StatusCode
8. **Format timestamps properly** - Replace 'UTC' suffix with 'Z' for ISO 8601 format
9. **Handle defensive JSON parsing** - Event responses can be strings OR objects
10. **Always refresh after actions** - Call `loadNotifications()` after success/failure for current state

### SPA Architecture (Cordova-Specific)
11. **Preserve existing MFA flows** - Device activation should enhance, not disrupt existing functionality
12. **Use callback preservation patterns** - Store original callbacks before adding new ones
13. **Initialize handlers once only** - AppInitializer.initialize() called ONCE in app.js deviceready
14. **Use template-based navigation** - NavigationService swaps content, never use window.location.href
15. **Scope CSS carefully** - Use `#TemplateName .class` to avoid conflicts (e.g., `.close-button`)

---

**📱 Congratulations! You've mastered Additional Device Activation with REL-ID Verify in Cordova SPA architecture!**

*You're now equipped to implement sophisticated device onboarding workflows with push notification-based approval systems in Cordova. Use this knowledge to create seamless device activation experiences that enhance security without compromising user convenience, while leveraging the power of Single Page Application architecture for optimal performance and maintainability.*
