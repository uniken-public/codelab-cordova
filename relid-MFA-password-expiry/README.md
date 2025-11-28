# REL-ID Cordova Codelab: Password Expiry Management

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/)
[![Password Expiry](https://img.shields.io/badge/Password%20Expiry-Enabled-orange.svg)]()
[![Challenge Mode 4](https://img.shields.io/badge/Challenge%20Mode-4-purple.svg)]()
[![SPA](https://img.shields.io/badge/Architecture-SPA-purple.svg)]()

> **Codelab Advanced:** Master Password Expiry workflows with REL-ID SDK updatePassword API

This folder contains the source code for the solution demonstrating [REL-ID Password Expiry Management](https://developer.uniken.com/docs/password-expiry) using secure expired password update flows with password reuse detection in a Cordova Single Page Application.

## 🔐 What You'll Learn

In this advanced password expiry codelab, you'll master production-ready expired password update patterns:

- ✅ **Password Expiry Detection**: Handle `challengeMode = 4` when password expires during login
- ✅ **UpdatePassword API Integration**: `updatePassword(current, new, 4)` API implementation
- ✅ **Three-Field Password Input**: Current password, new password, and confirm password validation
- ✅ **Password Policy Validation**: Extract and enforce `RELID_PASSWORD_POLICY` requirements
- ✅ **Password Reuse Detection**: Handle statusCode 164 errors with automatic field clearing
- ✅ **Automatic Login**: Seamless `onUserLoggedIn` event handling after successful password update
- ✅ **Event-Driven Architecture**: Handle password expiry event chain with proper error recovery
- ✅ **SPA Architecture**: Single Page Application with template-based navigation

## 🎯 Learning Objectives

By completing this Password Expiry Management codelab, you'll be able to:

1. **Detect password expiry scenarios** and handle `challengeMode = 4` routing
2. **Implement updatePassword API** with current and new password validation
3. **Build expired password update flows** with automatic field clearing on errors
4. **Handle password reuse detection** with statusCode 164 error management
5. **Extract password policies** from `RELID_PASSWORD_POLICY` challenge data
6. **Create three-field password forms** with comprehensive validation rules using vanilla JavaScript
7. **Implement SPA navigation** with template swapping and persistent event handlers
8. **Debug password expiry flows** and troubleshoot policy validation issues

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID MFA Cordova Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of password verification flows and challenge modes
- Experience with JavaScript form handling and multi-field validation
- Knowledge of REL-ID SDK event-driven architecture patterns
- Familiarity with password policy parsing and validation
- Basic understanding of Cordova plugin architecture and SPA patterns
- Experience with DOM manipulation and vanilla JavaScript

## 📁 Password Expiry Management Project Structure

```
relid-MFA-password-expiry/
├── 🌐 Cordova SPA with Password Expiry
│   ├── www/                      # Web assets (SPA architecture)
│   │   ├── index.html           # ONE HTML with all screen templates
│   │   ├── css/
│   │   │   └── index.css        # Unified styles for all screens
│   │   ├── js/
│   │   │   └── app.js           # deviceready handler (AppInitializer called ONCE)
│   │   └── src/
│   │       ├── uniken/          # 🛡️ Enhanced REL-ID Integration
│   │       │   ├── services/    # 🆕 Enhanced SDK service layer
│   │       │   │   ├── rdnaService.js              # Added updatePassword API
│   │       │   │   │                               # - updatePassword(current, new, 4)
│   │       │   │   │                               # - setPassword() for creation
│   │       │   │   │                               # - forgotPassword() for reset
│   │       │   │   └── rdnaEventManager.js         # document.addEventListener() pattern
│   │       │   ├── providers/   # Enhanced providers
│   │       │   │   └── SDKEventProvider.js         # Singleton with challengeMode 4 routing
│   │       │   ├── utils/       # Helper utilities
│   │       │   │   ├── connectionProfileParser.js  # cordova-plugin-file FileReader
│   │       │   │   └── passwordPolicyUtils.js      # Password validation
│   │       │   ├── cp/
│   │       │   │   └── agent_info.json             # Connection profile
│   │       │   └── AppInitializer.js               # Centralized initialization (called ONCE)
│   │       └── tutorial/        # Enhanced MFA + Password Expiry flow
│   │           ├── navigation/
│   │           │   └── NavigationService.js        # SPA template swapping (no page reloads)
│   │           └── screens/
│   │               └── mfa/     # 🔐 MFA screens + Password Expiry
│   │                   └── UpdateExpiryPasswordScreen.js  # 🆕 Expired password update
│   ├── plugins/              # Cordova plugins
│   │   └── cordova-plugin-rdna/  # REL-ID native plugin
│   ├── platforms/            # iOS, Android native platforms
│   ├── config.xml           # Cordova app configuration
│   └── package.json         # Dependencies
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-MFA-password-expiry

# Add platforms
cordova platform add ios
cordova platform add android

# Prepare platforms
cordova prepare

# Run the application
cordova run ios
# or
cordova run android
```

### Verify Password Expiry Features

Once the app launches, verify these password expiry capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ Login with expired password triggers `getPassword` event with `challengeMode = 4`
3. ✅ UpdateExpiryPasswordScreen displays three password fields (current, new, confirm)
4. ✅ Password policy extracted from `RELID_PASSWORD_POLICY` and displayed
5. ✅ Password reuse detection (statusCode 164) with automatic field clearing
6. ✅ `updatePassword()` API integration with comprehensive validation
7. ✅ Automatic login via `onUserLoggedIn` event after successful password update
8. ✅ SPA navigation with no page reloads between screens

## 🎓 Learning Checkpoints

### Checkpoint 1: Password Expiry Detection
- [ ] I understand how SDK triggers `getPassword` with `challengeMode = 4` for expired passwords
- [ ] I can route challengeMode 4 to UpdateExpiryPasswordScreen in SDKEventProvider
- [ ] I know how to extract statusMessage from response data
- [ ] I can handle loading states and error scenarios during password expiry detection

### Checkpoint 2: UpdatePassword API Implementation
- [ ] I can implement `updatePassword(current, new, 4)` API with proper sync response handling
- [ ] I understand three-field validation (current, new, confirm passwords)
- [ ] I can extract `RELID_PASSWORD_POLICY` from challenge data and parse policy requirements
- [ ] I know how to validate new password differs from current password

### Checkpoint 3: Password Reuse Detection
- [ ] I understand statusCode 164 indicates password reuse error
- [ ] I can implement automatic text field clearing when errors occur
- [ ] I know how to display user-friendly error messages for password reuse

### Checkpoint 4: Password Policy Validation
- [ ] I can parse RELID_PASSWORD_POLICY JSON from challenge data
- [ ] I understand password policy fields (minL, maxL, minDg, minUc, minLc, minSc, etc.)
- [ ] I can display user-friendly policy requirements to users
- [ ] I know how to handle UserIDcheck as boolean or string "true"
- [ ] I can debug policy validation issues and policy parsing errors

### Checkpoint 5: Production Password Expiry Management
- [ ] I understand security best practices for password expiry implementations
- [ ] I can implement comprehensive error handling for password update failures
- [ ] I know how to optimize user experience with clear policy messaging
- [ ] I can handle automatic login via `onUserLoggedIn` after successful update
- [ ] I understand compliance and audit requirements for password expiry workflows

## 🔄 Password Expiry User Flow

### Scenario 1: Standard Password Expiry Flow
1. **User enters credentials** → Login with `challengeMode = 0` (password verification)
2. **Password expired** → Server detects expired password (statusCode 118)
3. **SDK triggers getPassword** → `challengeMode = 4` (RDNA_OP_UPDATE_ON_EXPIRY)
4. **Navigation to UpdateExpiryPasswordScreen** → NavigationService loads template
5. **onContentLoaded() called** → Screen initializes with params
6. **Password policy displayed** → Extracted from `RELID_PASSWORD_POLICY` challenge data
7. **User enters passwords** → Current, new, and confirm password inputs
8. **Validation checks** → New password differs from current, passwords match
9. **Password updated** → `updatePassword(current, new, 4)` API called
10. **Automatic login** → SDK triggers `onUserLoggedIn` event

### Scenario 2: Password Reuse Detection
1. **User enters UpdateExpiryPasswordScreen** → Three password fields displayed
2. **User enters previous password** → Password that was used recently
3. **Password update attempted** → `updatePassword(current, new, 4)` API called
4. **Password reuse detected** → Server returns statusCode 164
5. **SDK re-triggers getPassword** → `challengeMode = 4` with error statusCode 164
6. **Error displayed with field clearing** → "Please enter a new password as your entered password has been used by you previously. You are not allowed to use last N passwords."
7. **All fields cleared automatically** → Current, new, and confirm password fields reset
8. **User enters different password** → Must select password not in history
9. **Password updated successfully** → `updatePassword()` API succeeds
10. **Automatic login** → SDK triggers `onUserLoggedIn` event

### Scenario 3: Password Policy Violation
1. **User enters UpdateExpiryPasswordScreen** → Password policy requirements displayed
2. **User enters weak password** → Password doesn't meet policy requirements
3. **Password update attempted** → `updatePassword(current, new, 4)` API called
4. **Policy validation fails** → Server returns error with policy violation details
5. **Error displayed** → Specific policy requirement not met shown to user
6. **Fields cleared** → All password fields reset for retry
7. **User enters compliant password** → Password meeting all policy requirements
8. **Password updated successfully** → `updatePassword()` API succeeds

## 📚 Advanced Resources

- **REL-ID Password Expiry Documentation**: [Password Expiry API Guide](https://developer.uniken.com/docs/password-expiry)
- **REL-ID Challenge Modes**: [Understanding Challenge Modes](https://developer.uniken.com/docs/challenge-modes)


## 💡 Pro Tips

### Password Expiry Implementation
 ### Password Expiry Implementation Best Practices
1. **Detect challengeMode 4** - Route `challengeMode = 4` from `getPassword` event to UpdateExpiryPasswordScreen
2. **Extract password policy** - Always extract `RELID_PASSWORD_POLICY` from challenge data, not `RELID_PASSWORD_POLICY`
3. **Clear fields on errors** - Implement automatic field clearing for both API and status errors
4. **Handle password reuse** - Detect statusCode 164 and provide clear user guidance
5. **Validate password differences** - Ensure new password differs from current password
6. **Display policy requirements** - Show parsed policy requirements to users before input
7. **Three-field validation** - Validate current, new, and confirm passwords with proper error messages
8. **Handle loading states** - Show clear loading indicators during password update operations
9. **Secure sensitive operations** - Never log or expose passwords in console or error messages
10. **Test edge cases** - Password reuse, policy violations, network failures, expired sessions

### Integration & Development
11. **Preserve existing MFA flows** - Password expiry should enhance, not disrupt existing authentication
12. **Use proper TypeScript types** - Leverage `RDNASyncResponse` and `RDNAGetPasswordData` for type safety
13. **Implement comprehensive logging** - Log flow progress for debugging without exposing passwords
14. **Test with various policies** - Ensure password update works with different password policy configurations
15. **Monitor user experience metrics** - Track password expiry success rates and policy compliance

### Security & Compliance
16. **Enforce password policies** - Always validate passwords against server-provided policy requirements
17. **Handle password history** - Respect server-configured password history limits (e.g., last 5 passwords)
18. **Audit password changes** - Log password expiry and update events for security monitoring
19. **Ensure secure transmission** - All password communications should use secure channels
20. **Test security scenarios** - Verify password expiry security under various attack scenarios

## 🔗 Key Implementation Files

- **`www/src/uniken/services/rdnaService.js`** - SDK API with updatePassword implementation
- **`www/src/tutorial/screens/mfa/UpdateExpiryPasswordScreen.js`** - 🔐 Password expiry screen (456 lines)
- **`www/src/uniken/providers/SDKEventProvider.js`** - Singleton provider with challengeMode 4 routing
- **`www/index.html`** - Single HTML with UpdateExpiryPassword-template

---

## 🎉 Congratulations!

**🔐 Congratulations! You've mastered Password Expiry Management with REL-ID SDK!**

*You're now equipped to implement secure, user-friendly expired password update workflows with password reuse detection. Use this knowledge to create seamless password expiry experiences that enhance security while providing excellent user convenience during password expiration scenarios.*
