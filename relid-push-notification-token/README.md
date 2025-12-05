# REL-ID Cordova Codelab: Push Notification Token Integration

[![Cordova](https://img.shields.io/badge/Cordova-14.0.1-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Push Notifications](https://img.shields.io/badge/Push%20Notifications-FCM-orange.svg)]()
[![Android](https://img.shields.io/badge/Android-13%2B%20Support-green.svg)]()

> **Codelab Advanced:** Master Push Notification Integration with REL-ID SDK token management using cordova-plugin-firebasex

This folder contains the source code for the solution demonstrating [REL-ID Push Notification Integration](https://codelab.uniken.com/codelabs/cordova-push-notification-integration/index.html?index=..%2F..index#0) with secure token registration in Cordova applications.

## 🔔 What You'll Learn

In this advanced push notification codelab, you'll master production-ready FCM integration patterns:

- ✅ **FCM Token Management**: Generate and manage Firebase Cloud Messaging tokens for Android and iOS
- ✅ **REL-ID SDK Integration**: Register device tokens using `setDeviceToken()` API
- ✅ **Permission Handling**: Handle notification permission requirements for both platforms
- ✅ **Service Architecture**: Implement singleton pattern for push notification services
- ✅ **Token Refresh**: Automatic token refresh handling with REL-ID re-registration
- ✅ **Provider Pattern**: JavaScript providers for automatic service initialization
- ✅ **Error Handling**: Comprehensive error management and logging strategies

## 🎯 Learning Objectives

By completing this Push Notification Integration codelab, you'll be able to:

1. **Implement FCM token generation** with cordova-plugin-firebasex integration
2. **Register device tokens with REL-ID** using the secure `setDeviceToken()` API
3. **Handle platform permissions** including Android 13+ notification permissions
4. **Build scalable service architecture** with singleton patterns and dependency injection
5. **Manage token lifecycle** with automatic refresh and re-registration
6. **Create seamless initialization** with provider patterns
7. **Debug push notification flows** and troubleshoot token-related issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you have:

- **Cordova Development Environment** - Complete Cordova CLI setup
- **Android Development** - Android SDK and development tools configured
- **Firebase Project** - Google Firebase project with FCM enabled
- **REL-ID SDK Integration** - Basic understanding of REL-ID SDK architecture
- **JavaScript Knowledge** - Familiarity with JavaScript ES6 and Promises
- **Android Permissions** - Understanding of Android permission model

## 📁 Push Notification Project Structure

```
relid-push-notification-token/
├── 📱 Cordova Push Notification App
│   ├── platforms/               # Platform-specific builds (Android, iOS)
│   ├── plugins/                 # Installed Cordova plugins
│   │   ├── cordova-plugin-firebasex/  # 🆕 Firebase FCM plugin
│   │   └── cordova-plugin-rdna/       # REL-ID SDK plugin
│   └── www/                     # Web application source
│
├── 📦 Push Notification Source Architecture
│   └── www/
│       ├── index.html           # Single Page Application shell
│       ├── src/
│       │   ├── tutorial/        # Tutorial screens and navigation
│       │   │   ├── navigation/  # SPA navigation structure
│       │   │   │   └── NavigationService.js  # Navigation utilities
│       │   │   └── screens/     # Tutorial and demo screens
│       │   │       ├── components/  # Reusable UI components
│       │   │       ├── mfa/         # MFA integration screens
│       │   │       ├── notification/ # 🔔 Push Notification Demo
│       │   │       └── tutorial/    # Base tutorial screens
│       │   └── uniken/          # 🛡️ REL-ID SDK Integration
│       │       ├── providers/   # 🆕 Push Notification Providers
│       │       │   ├── SDKEventProvider.js          # SDK event handling
│       │       │   └── PushNotificationProvider.js  # 🆕 Auto-initialization provider
│       │       ├── services/    # 🆕 Push Notification Services
│       │       │   ├── rdnaService.js               # 🆕 Enhanced with setDeviceToken()
│       │       │   ├── pushNotificationService.js   # 🆕 FCM token management singleton
│       │       │   └── rdnaEventManager.js          # SDK event management
│       │       ├── utils/       # Helper utilities
│       │       └── AppInitializer.js  # 🆕 Enhanced with push notification init
│       │
│
└── 📚 Production Configuration (Root Directory)
    ├── google-services.json     # 🆕 Android Firebase configuration
    ├── GoogleService-Info.plist # 🆕 iOS Firebase configuration
    └── config.xml               # Cordova configuration
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-push-notification-token

# Install dependencies (includes cordova-plugin-firebasex)
npm install

# Add platforms (if not already added)
cordova platform add android
cordova platform add ios  # macOS only

# IMPORTANT: Add Firebase configuration files
# Place BOTH files in the root directory of your Cordova project
# - google-services.json (Android)
# - GoogleService-Info.plist (iOS)

# Prepare platforms
cordova prepare

# Run the application
cordova run android
# or
cordova run ios
```

### Verify Push Notification Features

Once the app launches, verify these push notification capabilities:

1. ✅ FCM token generation on Android and iOS devices
2. ✅ Automatic permission requests for both platforms
3. ✅ REL-ID SDK token registration via `setDeviceToken()` API
4. ✅ Token refresh handling with automatic re-registration
5. ✅ Service initialization through PushNotificationProvider
6. ✅ Token display and logging for debugging purposes
7. ✅ iOS error code 505 handling (APNS not ready - graceful fallback to token refresh)

## 🎓 Learning Checkpoints

### Checkpoint 1: REL-ID setDeviceToken Integration
- [ ] I understand the purpose of `setDeviceToken()` API in REL-ID architecture
- [ ] I can implement REL-ID SDK token registration with proper error handling
- [ ] I know how to integrate FCM tokens with REL-ID's secure communication channel
- [ ] I can debug REL-ID token registration issues and failures
- [ ] I understand the two-channel security model (FCM wake-up + REL-ID secure channel)

### Checkpoint 2: Service Architecture & Singleton Pattern
- [ ] I can implement singleton pattern for push notification service management
- [ ] I understand dependency injection patterns with RdnaService integration
- [ ] I can create scalable service architecture with proper initialization
- [ ] I know how to manage service state and prevent double initialization
- [ ] I can implement cleanup and lifecycle management for push notification services

## 🔄 Push Notification User Flow

### Token Registration Flow
1. **App launches** → PushNotificationProvider initializes services
2. **Token generation** → Device token generated and retrieved
3. **REL-ID registration** → `setDeviceToken()` registers token with REL-ID backend
4. **Service ready** → Push notification service initialized successfully

### Token Refresh Flow
1. **Token refresh** → System automatically refreshes device token
2. **REL-ID re-registration** → `setDeviceToken()` updates REL-ID backend with new token
3. **Service continuity** → Push notification service continues with updated token

## 📚 Advanced Resources

- **REL-ID Push Notification Documentation**: [Push Notification Integration Guide](https://developer.uniken.com/docs/push-notifications)
- **cordova-plugin-firebasex**: [GitHub Repository](https://github.com/dpa99c/cordova-plugin-firebasex)
- **Firebase Cloud Messaging**: [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)

## 💡 Pro Tips

1. **Initialize early** - Set up REL-ID token registration as early as possible in app lifecycle
2. **Use singleton patterns** - Ensure single point of control for REL-ID service management
3. **Handle setDeviceToken errors** - Always wrap `setDeviceToken()` calls in try-catch blocks
4. **Test token refresh** - Verify automatic token refresh and REL-ID re-registration works correctly
5. **Secure token handling** - Never expose device tokens in production logs or analytics

## 🔗 Key Implementation Files

### Core Push Notification Service
```javascript
// pushNotificationService.js - FCM Token Management
const PushNotificationService = {
  _instance: null,
  _initialized: false,
  _rdnaService: null,

  getInstance() {
    if (!this._instance) {
      this._instance = this;
      this._rdnaService = RdnaService.getInstance();
    }
    return this._instance;
  },

  async initialize() {
    // Platform check, permissions, token generation, REL-ID registration
    const hasPermission = await this.requestPermissions();
    if (hasPermission) {
      await this.getAndRegisterToken();
      this.setupTokenRefreshListener();
    }
  },

  async getAndRegisterToken() {
    return new Promise((resolve, reject) => {
      const platform = getPlatformId();

      // On iOS, also log APNS token for debugging
      if (platform === 'ios') {
        FirebasePlugin.getAPNSToken((apnsToken) => {
          if (apnsToken) {
            console.log('PushNotificationService - iOS APNS token available');
          }
        }, (error) => {
          console.log('PushNotificationService - APNS token check failed (non-critical)');
        });
      }

      FirebasePlugin.getToken((token) => {
        if (!token) {
          console.warn('PushNotificationService - No FCM token received');
          resolve();
          return;
        }

        // Register with REL-ID SDK
        this._rdnaService.setDeviceToken(token);
        console.log('PushNotificationService - Token registered with REL-ID SDK');
        resolve();
      }, (error) => {
        // On iOS, APNS token may not be ready yet (error code 505)
        // Firebase will trigger token refresh when APNS becomes available
        const errorStr = error ? error.toString() : '';
        const hasCode505 = (error && error.code === 505) ||
                          (errorStr.includes('Code=505') || errorStr.includes('code 505'));

        if (hasCode505 && platform === 'ios') {
          console.log('PushNotificationService - APNS not ready yet, waiting for token refresh');
          resolve(); // Don't fail - token will come through refresh listener
          return;
        }

        console.error('PushNotificationService - Token retrieval failed:', error);
        reject(error);
      });
    });
  }
};
```

**⚠️ Important iOS Handling:**
The `getAndRegisterToken()` method includes special handling for iOS error code 505, which occurs when the APNS token is not yet available during initialization. Instead of failing, the service gracefully waits for the token refresh listener to receive the token when APNS becomes ready. This ensures a smooth user experience even when APNS registration is delayed.

### REL-ID SDK Integration
```javascript
// rdnaService.js - Device Token Registration
setDeviceToken(token) {
  console.log('RdnaService - Registering device push token with REL-ID SDK');

  try {
    // Register token with REL-ID native SDK
    com.uniken.rdnaplugin.RdnaClient.setDeviceToken(
      () => {
        console.log('RdnaService - Device push token registration successful');
      },
      (error) => {
        console.error('RdnaService - Device push token registration failed:', error);
      },
      [token]
    );
  } catch (error) {
    console.error('RdnaService - Device push token registration error:', error);
    throw new Error(`Failed to register device push token: ${error}`);
  }
}
```

### Provider Integration Pattern
```javascript
// PushNotificationProvider.js - Auto-initialization
const PushNotificationProvider = {
  _initialized: false,

  async initialize() {
    if (this._initialized) {
      console.log('PushNotificationProvider - Already initialized, skipping');
      return;
    }

    console.log('PushNotificationProvider - Initializing FCM push notifications');

    try {
      await window.pushNotificationService.initialize();
      this._initialized = true;
      console.log('PushNotificationProvider - FCM initialization successful');
    } catch (error) {
      console.error('PushNotificationProvider - FCM initialization failed:', error);
    }
  }
};
```

### Permission Request Implementation
```javascript
// Permission handling with cross-platform support
async requestPermissions() {
  return new Promise((resolve) => {
    // Check current permission
    FirebasePlugin.hasPermission((hasPermission) => {
      if (hasPermission) {
        console.log('PushNotificationService - Permission already granted');
        resolve(true);
        return;
      }

      // Request permission (iOS will show dialog, Android handles automatically)
      FirebasePlugin.grantPermission((granted) => {
        console.log('PushNotificationService - Permission result:', granted);
        resolve(granted);
      }, (error) => {
        console.error('PushNotificationService - Permission error:', error);
        resolve(false);
      });
    });
  });
}
```

### APNS Token Retrieval (iOS Only)
```javascript
// Get APNS token on iOS (raw token before Firebase mapping)
async getAPNSToken() {
  const platform = getPlatformId();

  if (platform !== 'ios') {
    console.log('PushNotificationService - getAPNSToken is only available on iOS');
    return null;
  }

  return new Promise((resolve) => {
    FirebasePlugin.getAPNSToken((token) => {
      if (token) {
        console.log('PushNotificationService - APNS token received, length:', token.length);
        console.log('PushNotificationService - APNS TOKEN:', token);
      } else {
        console.log('PushNotificationService - No APNS token available yet');
      }
      resolve(token);
    }, (error) => {
      console.error('PushNotificationService - Failed to get APNS token:', error);
      resolve(null);
    });
  });
}

// Usage
const apnsToken = await pushNotificationService.getAPNSToken();
if (apnsToken) {
  console.log('Got APNS token:', apnsToken);
}
```

---

**🔔 Congratulations! You've mastered Push Notification Integration with REL-ID SDK!**

*You're now equipped to implement secure, efficient push notification systems that integrate Firebase Cloud Messaging with REL-ID's secure communication architecture. Use this knowledge to create robust notification systems that enhance user experience while maintaining the highest security standards.*
