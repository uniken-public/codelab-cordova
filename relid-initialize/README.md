# REL-ID Cordova Codelab: Basic SDK Integration

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.09.02-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> **Codelab Step 1:** Learn the fundamentals of REL-ID SDK integration in Cordova applications

This folder contains the source code for the Cordova implementation of the [REL-ID Initialize](https://codelab.uniken.com/codelabs/cordova-relid-initialization-flow/index.html?index=..%2F..index#0) codelab.

## 📚 What You'll Learn

In this foundational codelab, you'll master the essential concepts of REL-ID SDK integration in Cordova:

- ✅ **Core SDK Initialization**: Understand the REL-ID SDK lifecycle in Cordova
- ✅ **Event-Driven Architecture**: Handle SDK callbacks using document.addEventListener()
- ✅ **Connection Profile Management**: Configure SDK with proper credentials
- ✅ **Error Handling Patterns**: Implement robust error management
- ✅ **Cordova Plugin API**: Interact with native modules through plugins
- ✅ **File Loading**: Use cordova-plugin-file for reliable file access

## 🎯 Learning Objectives

By the end of this codelab, you'll be able to:

1. **Initialize REL-ID SDK** in a Cordova application
2. **Handle SDK events** using document.addEventListener() pattern
3. **Parse connection profiles** using cordova-plugin-file
4. **Implement navigation flows** based on SDK responses
5. **Debug common initialization issues** effectively

## 🏗️ Architecture: Single Page Application (SPA)

This codelab uses **SPA architecture** for optimal performance and user experience:

### Why SPA?
- ✅ **One-time SDK initialization** - Event handlers registered once in `AppInitializer`, persist forever
- ✅ **No page reloads** - Template-based navigation via `NavigationService` (no white flash)
- ✅ **Persistent event handlers** - SDK handlers work across all screens without re-registration
- ✅ **Faster navigation** - Content swapping instead of full page loads
- ✅ **Better UX** - Smooth transitions between screens

### SPA Key Components:
1. **index.html** - Single HTML with `<template>` elements for each screen
2. **NavigationService.js** - Template swapping (not `window.location.href`)
3. **AppInitializer.js** - One-time SDK handler registration (called once in `app.js`)
4. **Screen modules** - `onContentLoaded(params)` lifecycle method (not deviceready per screen)

### Flow:
```
deviceready → AppInitializer.initialize() → NavigationService.navigate('TutorialHome')
  ↓
Template swapped → TutorialHomeScreen.onContentLoaded() → User clicks Initialize
  ↓
SDK initialized → onInitialized event → Navigate to TutorialSuccess
  ↓
Template swapped → TutorialSuccessScreen.onContentLoaded(sessionData)
```

**Key Difference from Multi-Page:**
- SPA: Scripts loaded once, handlers persist, template swapping
- Multi-Page: Scripts per page, handlers re-registered, full page reloads

## 📁 Project Structure

```
relid-initialize/
├── 📱 Cordova Configuration
│   ├── platforms/              # Platform-specific code (iOS, Android)
│   ├── plugins/                # Installed Cordova plugins
│   ├── config.xml              # Cordova app configuration
│   └── RdnaClient/             # cordova-plugin-rdna source
│
├── 📦 Source Code (www/)
│   ├── index.html              # Main app entry point
│   ├── css/
│   │   └── index.css           # Application styles
│   ├── js/
│   │   └── app.js              # Main application logic
│   └── src/
│       ├── tutorial/           # Tutorial screens and navigation
│       │   ├── navigation/     # NavigationService
│       │   └── screens/        # Home, Success, Error screens
│       └── uniken/             # REL-ID SDK integration
│           ├── cp/             # Connection profile (agent_info.json)
│           ├── providers/      # SDK event provider
│           ├── services/       # Core SDK service layer
│           └── utils/          # Helper utilities
│
└── 📚 Configuration Files
    ├── package.json            # Dependencies and scripts
    └── config.xml              # Cordova configuration
```

## 🚀 Quick Start

### Prerequisites

Before starting this codelab, ensure you have:

- **Node.js 18+** installed
- **Cordova CLI** installed globally (`npm install -g cordova`)
- **Android Studio** or **Xcode** for device testing
- **cordova-plugin-rdna** and **REL-ID connection profile** from your Uniken administrator

### Installation

```bash
# Navigate to the codelab folder
cd relid-initialize

# Place the cordova-plugin-rdna plugin 
# at root folder of this project (refer to Project Structure above for more info)

# Install dependencies
npm install

# Add platform (iOS or Android)
cordova platform add ios
# or
cordova platform add android

# Prepare the platform
cordova prepare

# Run the application
cordova run ios
# or
cordova run android
```

## 🎓 Learning Checkpoints

### Checkpoint 1: Basic Understanding
- [ ] I understand REL-ID SDK initialization flow in Cordova
- [ ] I can explain the event-driven architecture with document.addEventListener()
- [ ] I know how to handle SDK callbacks with JSON parsing

### Checkpoint 2: Implementation Skills
- [ ] I can integrate REL-ID SDK in a new Cordova app
- [ ] I can implement proper error handling
- [ ] I can use cordova-plugin-file for file loading

### Checkpoint 3: Advanced Concepts
- [ ] I understand connection profile management
- [ ] I can debug common SDK issues in Cordova
- [ ] I can implement custom progress tracking

## 📚 Additional Resources

- **REL-ID Developer Documentation**: [https://developer.uniken.com/](https://developer.uniken.com/)
- **Cordova Guide**: [https://cordova.apache.org/docs/en/latest/](https://cordova.apache.org/docs/en/latest/)
- **cordova-plugin-file**: [https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/)

## 💡 Pro Tips

1. **Always parse JSON responses** - All cordova-plugin-rdna responses are JSON strings
2. **Use cordova-plugin-file for file loading** - Standard fetch() doesn't work with file:// URLs in iOS
3. **Test on real devices** - SDK behavior can differ between simulator and device
4. **Keep connection profiles secure** - Never commit credentials to version control
5. **Enable debug logging during development** - Helps troubleshoot initialization issues
6. **Wait for deviceready** - Always initialize SDK after Cordova's deviceready event
7. **Bind event handlers properly** - Use `.bind(this)` to preserve context in callbacks

## 🐛 Common Issues and Solutions

### Issue: "Plugin not found"
**Solution:** Run `cordova prepare` to ensure plugins are properly installed.

### Issue: "Can't find variable: cordova"
**Solution:** Ensure cordova.js is loaded before your app scripts.

### Issue: File loading fails on iOS
**Solution:** Use cordova-plugin-file instead of fetch() for loading local files.

### Issue: Events not firing
**Solution:** Check that event names match exactly: 'onInitializeProgress', 'onInitializeError', 'onInitialized'.

---

**Ready to build secure Cordova apps with REL-ID? Let's start coding! 🚀**

*This codelab provides hands-on experience with REL-ID SDK fundamentals in Cordova. Master these concepts before advancing to Mobile Threat Defense features.*
