# REL-ID Cordova Codelab: Notification History Management

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/)
[![SPA Architecture](https://img.shields.io/badge/Architecture-SPA-blue.svg)]()
[![Notification History](https://img.shields.io/badge/Feature-Notification%20History-purple.svg)]()

> **Codelab Advanced:** Master notification history retrieval, display, and filtering with REL-ID SDK in Cordova SPA architecture

This folder contains the source code for the solution demonstrating [REL-ID Notification History Management](https://codelab.uniken.com/codelabs/cordova-notification-history/index.html?index=..%2F..index#0) using Cordova Single Page Application (SPA) architecture with comprehensive historical tracking, filtering, and status management.

## 🔐 What You'll Learn

In this notification history management codelab, you'll master production-ready notification history patterns:

- ✅ **History Retrieval**: `getNotificationHistory()` API with 9 filter parameters for flexible querying
- ✅ **Historical Display**: Sorted notification list by timestamp with color-coded status badges
- ✅ **Status Tracking**: Visual indicators (UPDATED, EXPIRED, DISCARDED, DISMISSED) with color coding
- ✅ **Detail Modal**: Full notification view with complete metadata and timestamps
- ✅ **UTC Conversion**: Automatic local timestamp conversion for user-friendly display
- ✅ **Auto-Loading**: Notifications history loaded automatically on screen mount
- ✅ **Empty State Handling**: User-friendly messages when no history available
- ✅ **Error Handling**: Two-layer error checking (API errors and status codes)
- ✅ **Drawer Integration**: Accessible via "📜 Notification History" menu item
- ✅ **Event Handler Management**: Proper cleanup to prevent handler accumulation

## 🎯 Learning Objectives

By completing this Notification History codelab, you'll be able to:

### Notification History Management
1. **Implement history retrieval** with `getNotificationHistory()` API and 9 filter parameters
2. **Handle onGetNotificationHistory event** with two-layer error checking pattern
3. **Display historical data** with sorted list, status badges, and color coding
4. **Build detail modal** for viewing complete notification information
5. **Convert UTC timestamps** to local time for user-friendly display
6. **Implement auto-loading** pattern with `onContentLoaded()` in SPA
7. **Handle empty states** and error scenarios gracefully
8. **Manage event handlers** with cleanup on screen exit to prevent accumulation

### Cordova SPA Development
9. **Build SPA screens** with `onContentLoaded()` lifecycle method
10. **Implement template swapping** for fast navigation without page reloads
11. **Manage event handlers** with cleanup() to prevent multiple registrations
12. **Use Cordova plugin API** for SDK integration with JSON.parse()
13. **Handle modal overlays** in SPA architecture
14. **Debug Cordova applications** with Chrome DevTools and Safari Web Inspector

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID Cordova MFA Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- **[REL-ID Cordova Additional Device Activation Flow With Notifications Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-additional-device-activation-flow/index.html?index=..%2F..index#0)** - Notification retrieval and display
- Understanding of Cordova SPA architecture and template-based navigation
- Experience with JavaScript ES6+ features (Promises, async/await, arrow functions)
- Knowledge of REL-ID SDK event-driven architecture
- Familiarity with DOM manipulation and vanilla JavaScript
- Basic understanding of notification systems and historical data display

## 📁 Notification History Project Structure

```
relid-notification-history/
├── 📱 Cordova App Configuration
│   ├── config.xml              # Cordova project configuration
│   ├── package.json            # Node.js dependencies
│   ├── platforms/              # Platform-specific builds (iOS, Android)
│   └── plugins/                # Cordova plugins
│       └── cordova-plugin-rdna # REL-ID SDK plugin
│
├── 📦 Single Page Application Architecture
│   └── www/                    # Web application root
│       ├── index.html          # ONE HTML file with all templates
│       │                       # - NotificationHistory template
│       │                       # - GetNotifications template
│       │                       # - All MFA screen templates
│       │                       # - Detail modal template
│       │                       # - Drawer menu (persistent shell)
│       │
│       ├── css/
│       │   └── index.css       # Complete app styling
│       │                       # - Notification history list styles
│       │                       # - Status badge color coding
│       │                       # - Detail modal styles
│       │                       # - Empty state styles
│       │
│       ├── js/
│       │   └── app.js          # App initialization (deviceready)
│       │                       # - Calls AppInitializer.initialize() ONCE
│       │
│       └── src/
│           ├── uniken/         # REL-ID SDK Integration Layer
│           │   ├── AppInitializer.js        # Centralized SDK initialization
│           │   ├── services/
│           │   │   ├── rdnaService.js       # SDK API wrapper (Promise-based)
│           │   │   │                        # - getNotifications(params)
│           │   │   │                        # - getNotificationHistory(filters)
│           │   │   │                        # - updateNotification(uuid, action)
│           │   │   └── rdnaEventManager.js  # Event management
│           │   │                            # - onGetNotificationHistory handler
│           │   │                            # - onGetNotifications handler
│           │   │                            # - onUpdateNotification handler
│           │   ├── providers/
│           │   │   └── SDKEventProvider.js  # Event-driven navigation
│           │   ├── managers/
│           │   │   ├── SessionManager.js    # Session timeout management
│           │   │   └── MTDThreatManager.js  # Threat detection
│           │   └── utils/
│           │       └── connectionProfileParser.js   # Profile configuration
│           │
│           └── tutorial/       # Application Screens (SPA Pattern)
│               ├── navigation/
│               │   └── NavigationService.js         # SPA navigation (template loading)
│               │
│               └── screens/
│                   ├── notification/      # Notification Management
│                   │   ├── GetNotificationsScreen.js        # Notification retrieval & actions
│                   │   └── NotificationHistoryScreen.js     # 🆕 Historical notifications
│                   │                                        # - Auto-loads history
│                   │                                        # - Detail modal
│                   │                                        # - Status badges
│                   │                                        # - UTC conversion
│                   │                                        # - Event handler cleanup
│                   └── mfa/              # MFA screens
│                       ├── DashboardScreen.js              # Dashboard with drawer
│                       ├── CheckUserScreen.js              # User validation
│                       └── ...                             # Other MFA screens
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-notification-history

# Install Cordova globally (if not already installed)
npm install -g cordova

# Install dependencies
npm install

# Add platforms
cordova platform add ios
cordova platform add android

# iOS additional setup (install CocoaPods dependencies)
cd platforms/ios && pod install && cd ../..

# Prepare the project
cordova prepare

# Run the application
cordova run ios
# or
cordova run android
```

### Verify Notification History Features

Once the app launches, verify these notification history capabilities:

**Notification History Retrieval**:

1. ✅ Complete MFA flow and log in to dashboard
2. ✅ Navigate to "📜 Notification History" from drawer menu
3. ✅ `getNotificationHistory()` called automatically on screen load
4. ✅ Historical notifications displayed in sorted list (latest first)
5. ✅ Status badges visible with color coding:
   - Green: UPDATED, ACCEPTED
   - Red: REJECTED, DISCARDED
   - Orange: EXPIRED
   - Gray: DISMISSED
   - Blue: Other statuses

**Detail Modal & Timestamps**:

6. ✅ Tap notification item → Detail modal displays
7. ✅ Modal shows complete notification info:
   - Subject and message
   - Status and action performed
   - Created timestamp (converted to local time)
   - Updated timestamp (converted to local time)
   - Expiry timestamp (converted to local time)
   - Signing status (if available)
8. ✅ UTC timestamps automatically converted to local time
9. ✅ Tap "Cancel" button → Modal closes

**Empty State & Error Handling**:

10. ✅ When no history available → "No notification history found" message with retry button
11. ✅ Tap retry button → History reloads
12. ✅ API errors display user-friendly error messages from server
13. ✅ Status code errors show StatusMsg from response

**Event Handler Management**:

14. ✅ Open Notification History for the first time → Handler registered
15. ✅ Navigate away → cleanup() called, handler removed
16. ✅ Open Notification History again → New handler registered (no accumulation)
17. ✅ Response handled only once (not multiple times)

## 🎓 Learning Checkpoints

### Checkpoint 1: Notification History Basics
- [ ] I understand how `getNotificationHistory()` retrieves historical notifications
- [ ] I can implement filtered history retrieval with 9 parameters (recordCount, startIndex, enterpriseId, dates, status, action, keyword, deviceId)
- [ ] I know how to handle `onGetNotificationHistory` event with two-layer error checking
- [ ] I can display historical notifications with sorted list by timestamp

### Checkpoint 2: Status Display & Color Coding
- [ ] I understand different notification statuses (UPDATED, EXPIRED, DISCARDED, DISMISSED)
- [ ] I can implement color-coding for different statuses
- [ ] I know how to display status badges with appropriate colors
- [ ] I can display action performed with color-coding based on action type

### Checkpoint 3: Detail Modal & Timestamps
- [ ] I can build detail modal for viewing complete notification information
- [ ] I understand how to convert UTC timestamps to local time
- [ ] I know how to handle different UTC timestamp formats (with/without "UTC" suffix)
- [ ] I can display multiple timestamp fields (created, updated, expiry)

### Checkpoint 4: Auto-Loading & Error Handling
- [ ] I understand auto-loading pattern with `onContentLoaded()` in SPA
- [ ] I can implement two-layer error checking (error.longErrorCode and StatusCode)
- [ ] I know how to handle empty states with user-friendly messages
- [ ] I can display error messages from server (error.errorString and StatusMsg)

### Checkpoint 5: Event Handler Management
- [ ] I understand event handler accumulation prevention with cleanup()
- [ ] I know when to call cleanup() (at start of onContentLoaded)
- [ ] I can remove event handlers when screen exits
- [ ] I understand why callback preservation is not needed for notification history

### Checkpoint 6: Cordova SPA Architecture
- [ ] I understand Single Page Application (SPA) architecture benefits
- [ ] I know how to implement `onContentLoaded(params)` lifecycle method
- [ ] I can implement template-based navigation with NavigationService
- [ ] I understand drawer menu navigation with parameter passing
- [ ] I can maintain session parameters across screen navigation

## 🔄 Notification History User Flows

### Scenario 1: Viewing Notification History
1. **User in Dashboard** → Opens drawer menu
2. **User taps "📜 Notification History"** → NavigationService.navigate('NotificationHistory', params)
3. **NotificationHistoryScreen loads** → `onContentLoaded(params)` called
4. **Cleanup previous handlers** → `this.cleanup()` removes any old handlers
5. **Register new handler** → `setGetNotificationHistoryHandler()` registered
6. **Auto-load history** → `getNotificationHistory()` called with default parameters
7. **SDK returns history** → `onGetNotificationHistory` event triggered
8. **Two-layer error checking** → Check error.longErrorCode, then StatusCode
9. **History displayed** → Sorted list with status badges (color-coded)
10. **User taps history item** → Detail modal displays
11. **Modal shows details** → Complete notification info with UTC timestamps converted to local time
12. **User closes modal** → Returns to history list

### Scenario 2: Empty Notification History
1. **NotificationHistoryScreen loads** → Auto-calls `getNotificationHistory()`
2. **SDK returns empty array** → No historical notifications found
3. **Empty state displayed** → "No notification history found" message with retry button
4. **User taps retry** → `getNotificationHistory()` called again

### Scenario 3: Returning to Notification History (No Handler Accumulation)
1. **User visits Notification History** → Handler registered, history loaded
2. **User navigates away** → cleanup() called, handler removed
3. **User returns to Notification History** → New handler registered (old one removed)
4. **Response received** → Handler called only ONCE (no multiple calls)

### Scenario 4: Error Handling
1. **API error occurs** → error.longErrorCode !== 0
2. **Layer 1 check triggers** → Display error.errorString
3. **Error state displayed** → User-friendly error message with retry button

**Important Notes**:

- **Filter Parameters**: 9 parameters available (recordCount, startIndex, enterpriseId, startDate, endDate, notificationStatus, actionPerformed, keywordSearch, deviceId)
- **UTC Conversion**: All timestamps automatically converted to local time using `.replace('UTC', 'Z')` pattern
- **Handler Cleanup**: Call `cleanup()` at START of `onContentLoaded()` to prevent handler accumulation
- **Two-Layer Error Checking**: Always check error.longErrorCode first, then StatusCode
- **Status Color Coding**: Green (success), Red (rejected), Orange (expired), Gray (dismissed), Blue (other)
- **Event Uniqueness**: Only NotificationHistoryScreen uses `onGetNotificationHistory`, so no callback preservation needed

## 🔄 Notification History Filter Parameters

The `getNotificationHistory()` API supports 9 filter parameters for flexible querying:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `recordCount` | number | Number of records to retrieve | 10 |
| `startIndex` | number | Starting index for pagination | 1 |
| `enterpriseId` | string | Filter by enterprise ID | '' (empty for all) |
| `startDate` | string | Filter from this date | '' (empty for all) |
| `endDate` | string | Filter until this date | '' (empty for all) |
| `notificationStatus` | string | Filter by status | 'UPDATED', 'EXPIRED', etc. |
| `actionPerformed` | string | Filter by action | 'APPROVE', 'REJECT', etc. |
| `keywordSearch` | string | Search by keyword | '' (empty for all) |
| `deviceId` | string | Filter by device ID | '' (empty for all) |

**Default Parameters for Basic Retrieval**:
```javascript
getNotificationHistory(
  10,    // recordCount - Get 10 most recent
  1,     // startIndex - Start from first record
  '',    // enterpriseId - All enterprises
  '',    // startDate - No start date filter
  '',    // endDate - No end date filter
  '',    // notificationStatus - All statuses
  '',    // actionPerformed - All actions
  '',    // keywordSearch - No keyword filter
  ''     // deviceId - All devices
);
```

## 🎨 Status Badge Color Coding

Notification history uses color-coded status badges for visual clarity:

| Status | Color | Hex Code | Meaning |
|--------|-------|----------|---------|
| UPDATED, ACCEPTED | Green | #4CAF50 | Successfully processed |
| REJECTED, DISCARDED | Red | #F44336 | Declined or discarded |
| EXPIRED | Orange | #FF9800 | Expired before action |
| DISMISSED | Gray | #9E9E9E | User dismissed |
| Other statuses | Blue | #2196F3 | Default color |

## 🕐 UTC Timestamp Conversion

All notification timestamps are returned in UTC format and must be converted to local time:

**UTC Timestamp Formats**:
- Format 1: `"2025-10-09T11:39:49UTC"` (with "UTC" suffix)
- Format 2: `"2025-10-09T11:39:49Z"` (with "Z" suffix)

**Conversion Logic**:
1. Check if timestamp ends with "UTC"
2. Replace "UTC" with "Z" for proper JavaScript Date parsing
3. Create Date object: `new Date(cleanTimestamp)`
4. Convert to local string: `utcDate.toLocaleString()`

**Example Conversion**:
- UTC: `"2025-10-09T11:39:49UTC"`
- Cleaned: `"2025-10-09T11:39:49Z"`
- Local: `"10/9/2025, 7:09:49 AM"` (assuming EST timezone)

## ⚠️ Two-Layer Error Checking Pattern

All notification history responses use two-layer error checking:

**Layer 1 - API Error** (`error.longErrorCode`):
- Check if `data.error && data.error.longErrorCode !== 0`
- If error exists → Display `data.error.errorString`
- Return early (don't process data)

**Layer 2 - Status Code** (`pArgs.response.StatusCode`):
- Check if `data.pArgs?.response?.StatusCode !== 100`
- If status not 100 → Display `data.pArgs?.response?.StatusMsg`
- Return early (don't process data)

**Success** (Both checks pass):
- Process `data.pArgs?.response?.ResponseData?.history`
- Display sorted notification history

## 🔧 Event Handler Cleanup

To prevent event handler accumulation when visiting the screen multiple times:

**Pattern**:
1. Call `this.cleanup()` at the **START** of `onContentLoaded()` before setting up new handlers
2. Cleanup removes old handlers from previous visits
3. Then register new handlers for current visit
4. Result: Only one handler active at a time (no multiple calls)

**Why This Matters**:
- Without cleanup: Handlers accumulate on each visit (1st visit = 1 handler, 2nd visit = 2 handlers, 3rd visit = 3 handlers)
- With cleanup at start: Always exactly 1 handler active
- Response processed only once (no duplicate "Loaded 10 history items" logs)

## 🎓 Learning Checkpoints Summary

Use this checklist to verify your implementation:

**Core Features**:
- [ ] Notification history retrieval with `getNotificationHistory()` API
- [ ] Auto-loading pattern on screen mount
- [ ] Sorted display by timestamp (newest first)
- [ ] Status badges with color coding
- [ ] Detail modal with complete notification info
- [ ] UTC timestamp conversion to local time

**Error Handling**:
- [ ] Layer 1: API error checking (error.longErrorCode)
- [ ] Layer 2: Status code checking (StatusCode)
- [ ] Empty state handling
- [ ] User-friendly error messages

**Event Management**:
- [ ] Event handler registration
- [ ] Event handler cleanup (prevents accumulation)
- [ ] Cleanup called at start of onContentLoaded()
- [ ] No callback preservation needed (unique event)

**SPA Architecture**:
- [ ] Template-based navigation
- [ ] Parameter passing through drawer navigation
- [ ] Modal overlay management
- [ ] Session parameter preservation

## 📚 Advanced Resources

- **REL-ID Notifications API**: [Notifications API Guide](https://developer.uniken.com/docs/notification-management)
- **REL-ID SDK Documentation**: [REL-ID SDK Reference](https://developer.uniken.com/docs/rel-id-sdk)
- **Cordova Documentation**: [Apache Cordova Docs](https://cordova.apache.org/docs/en/latest/)
- **SPA Architecture**: [Single Page Application Patterns](https://developer.mozilla.org/en-US/docs/Glossary/SPA)

## 💡 Pro Tips

### Notification History Implementation
1. **Auto-load history** - Call `getNotificationHistory()` in `onContentLoaded()`
2. **Sort by timestamp** - Display newest history items first
3. **Color-code status** - Use visual indicators for different statuses
4. **Convert UTC timestamps** - Always convert to local time for display
5. **Handle empty states** - Show user-friendly messages when no data
6. **Use default filters** - Start with empty filters to get all history

### Error Handling Best Practices
7. **Two-layer checking** - Always check error.longErrorCode first, then StatusCode
8. **Show server messages** - Display error.errorString and StatusMsg from server
9. **Log error codes** - Include error codes in console logs for debugging
10. **Handle empty arrays** - Check for empty history array and show appropriate message

### Event Handler Management
11. **Cleanup at start** - Call `cleanup()` at START of `onContentLoaded()`
12. **Remove old handlers** - Clear handler before setting new one
13. **No preservation needed** - NotificationHistory event is unique to this screen
14. **Test multiple visits** - Ensure handler doesn't accumulate on repeated visits

### Cordova SPA Development
15. **One-time initialization** - Call AppInitializer.initialize() ONCE in app.js
16. **Template-based navigation** - Use NavigationService.navigate() for fast content swap
17. **Pass session params** - Always pass userID, sessionID through navigation
18. **Use JSON.parse()** - All Cordova plugin responses need JSON.parse()
19. **Test on device** - Some features only work on real devices
20. **Use Chrome DevTools** - Debug Android apps with chrome://inspect

---

**📜 Congratulations! You've mastered Notification History Management in Cordova SPA!**

*You're now equipped to implement production-ready notification history features with:*

- **Historical Tracking**: Complete notification history with filtering capabilities
- **Visual Status Indicators**: Color-coded badges for quick status recognition
- **Detail Views**: Comprehensive notification metadata display
- **UTC Conversion**: User-friendly local timestamp display
- **Error Handling**: Two-layer error checking with server messages
- **Event Management**: Proper handler cleanup to prevent accumulation

*Use this knowledge to create user-friendly notification history experiences in Cordova applications that provide complete audit trails and historical insights!*
