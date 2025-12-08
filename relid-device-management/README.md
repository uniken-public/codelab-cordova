# REL-ID Cordova Codelab: Device Management

[![Cordova](https://img.shields.io/badge/Cordova-12.0.0-blue.svg)](https://cordova.apache.org/)
[![REL-ID SDK](https://img.shields.io/badge/REL--ID%20SDK-v25.06.03-green.svg)](https://developer.uniken.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/)
[![SPA Architecture](https://img.shields.io/badge/Architecture-SPA-blue.svg)]()
[![Device Management](https://img.shields.io/badge/Device%20Management-Enabled-orange.svg)]()
[![Real-time Sync](https://img.shields.io/badge/Real--time%20Sync-Pull%20to%20Refresh-purple.svg)]()
[![Cooling Period](https://img.shields.io/badge/Cooling%20Period-Server%20Enforced-red.svg)]()

> **Codelab Advanced:** Master multi-device management with REL-ID SDK server synchronization and cooling period enforcement

This folder contains the source code for the solution demonstrating [REL-ID Device Management](https://codelab.uniken.com/codelabs/cordova-device-management-flow/index.html?index=..%2F..index#0) using Cordova Single Page Application (SPA) architecture with comprehensive device lifecycle management, real-time synchronization, and server-enforced cooling periods.

## 🔐 What You'll Learn

In this advanced device management codelab, you'll master production-ready device management patterns:

- ✅ **Device Listing API**: `getRegisteredDeviceDetails()` with cooling period detection
- ✅ **Device Update Operations**: Rename and delete with `updateDeviceDetails()` API
- ✅ **Cooling Period Management**: Server-enforced cooling periods between operations
- ✅ **Current Device Protection**: Preventing accidental deletion of active device
- ✅ **Sync+Async Pattern**: Understanding two-phase response architecture with Cordova plugins
- ✅ **Event-Driven Architecture**: Handle `onGetRegistredDeviceDetails` and `onUpdateDeviceDetails` callbacks
- ✅ **Three-Layer Error Handling**: API errors, status codes, and promise rejections
- ✅ **Real-time Synchronization**: Pull-to-refresh and automatic device list updates
- ✅ **SPA Navigation**: Template-based screen swapping without page reloads

## 🎯 Learning Objectives

By completing this Device Management codelab, you'll be able to:

### Device Management
1. **Implement device listing workflows** with `getRegisteredDeviceDetails()` API and cooling period detection
2. **Build device management interfaces** with rename and delete operations using `updateDeviceDetails()` API
3. **Handle server-enforced cooling periods** with visual warnings and action disabling (StatusCode 146)
4. **Protect current device** from accidental deletion with client and server validation
5. **Design sync+async patterns** with proper event handler preservation in Cordova
6. **Implement three-layer error handling** for comprehensive error detection (API, status, Promise)
7. **Create real-time sync experiences** with pull-to-refresh functionality
8. **Debug device management flows** and troubleshoot operation-related issues

### Cordova SPA Development
9. **Build SPA screens** with `onContentLoaded()` lifecycle method for template-based navigation
10. **Implement template swapping** for fast navigation without page reloads
11. **Manage event handlers** with proper cleanup to prevent handler accumulation
12. **Use Cordova plugin API** for SDK integration with JSON.parse() response handling
13. **Handle modal overlays** in SPA architecture with proper state management
14. **Debug Cordova applications** with Chrome DevTools and Safari Web Inspector
15. **Structure device management UI** to match iOS design patterns and mockups

> **Note**: This codelab builds upon the MFA and notification management features. Ensure you've completed prerequisite codelabs before starting.

## 🏗️ Prerequisites

Before starting this codelab, ensure you've completed:

- **[REL-ID Cordova MFA Codelab](https://codelab.uniken.com/codelabs/cordova-mfa-activation-login-flow/index.html?index=..%2F..index#0)** - Complete MFA implementation required
- Understanding of Cordova SPA architecture and template-based navigation
- Experience with JavaScript ES6+ features (Promises, async/await, arrow functions)
- Knowledge of REL-ID SDK event-driven architecture
- Familiarity with DOM manipulation and vanilla JavaScript
- Basic understanding of device management and cooling periods

## 📁 Device Management Project Structure

```
relid-device-management/
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
│       │                       # - DeviceManagement template (NEW)
│       │                       # - DeviceDetail template (NEW)
│       │                       # - All MFA screen templates
│       │                       # - Drawer menu (persistent shell)
│       │
│       ├── css/
│       │   └── index.css       # Complete app styling
│       │                       # - Device list styles (NEW)
│       │                       # - Device card styles (NEW)
│       │                       # - Device detail screen styles (NEW)
│       │                       # - Rename modal styles (NEW)
│       │                       # - Cooling period banner styles (NEW)
│       │
│       ├── js/
│       │   └── app.js          # App initialization (deviceready)
│       │                       # - Calls AppInitializer.initialize() ONCE
│       │
│       └── src/
│           ├── uniken/         # REL-ID SDK Integration Layer
│           │   ├── AppInitializer.js        # Centralized SDK initialization
│           │   ├── services/
│           │   │   ├── rdnaService.js       # 🆕 Enhanced SDK API wrapper
│           │   │   │                        # - getRegisteredDeviceDetails(userID)
│           │   │   │                        # - updateDeviceDetails(userID, payload)
│           │   │   └── rdnaEventManager.js  # 🆕 Enhanced event management
│           │   │                            # - setGetRegisteredDeviceDetailsHandler()
│           │   │                            # - setUpdateDeviceDetailsHandler()
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
│                   ├── deviceManagement/      # 🆕 Device Management (NEW)
│                   │   ├── DeviceManagementScreen.js   # Device list with auto-loading
│                   │   │                               # - Auto-loads devices via getRegisteredDeviceDetails()
│                   │   │                               # - Pull-to-refresh support
│                   │   │                               # - Cooling period detection (StatusCode 146)
│                   │   │                               # - Current device highlighting
│                   │   │                               # - Device status indicators
│                   │   │                               # - Navigation to detail screen
│                   │   ├── DeviceDetailScreen.js       # Device details & operations
│                   │   │                               # - Device rename with validation modal
│                   │   │                               # - Device delete with confirmation
│                   │   │                               # - Current device protection
│                   │   │                               # - Three-layer error handling
│                   │   └── RenameDeviceDialog.js       # Rename modal dialog (planned)
│                   │
│                   ├── notification/          # Notification Management
│                   │   ├── GetNotificationsScreen.js        # Notification retrieval
│                   │   └── NotificationHistoryScreen.js     # Historical notifications
│                   │
│                   └── mfa/                   # MFA screens
│                       ├── DashboardScreen.js              # Dashboard with drawer
│                       ├── CheckUserScreen.js              # User validation
│                       └── ...                             # Other MFA screens
```

## 🚀 Quick Start

### Installation & Setup

```bash
# Navigate to the codelab folder
cd relid-device-management

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

### Verify Device Management Features

Once the app launches, verify these device management capabilities:

1. ✅ Complete MFA flow available (prerequisite from previous codelab)
2. ✅ Device Management screen accessible from drawer navigation
3. ✅ `getRegisteredDeviceDetails()` API integration with device list display
4. ✅ Pull-to-refresh functionality for real-time device synchronization
5. ✅ Cooling period banner when server cooling period is active (StatusCode 146)
6. ✅ Device detail screen with rename and delete operations
7. ✅ `updateDeviceDetails()` API integration with proper error handling
8. ✅ Current device protection preventing accidental deletion

## 🔑 REL-ID Device Management Operation Types

### Official REL-ID Device Management API Mapping

> **⚠️ Critical**: Device management operations follow a sync+async pattern. Always register event handlers BEFORE calling APIs.

| API Method | Operation Type | Event Handler | Description | Documentation |
|------------|---------------|---------------|-------------|---------------|
| `getRegisteredDeviceDetails()` | **List Devices** | `onGetRegistredDeviceDetails` | Fetches all user devices with cooling period info | [📖 API Docs](https://developer.uniken.com/docs/get-registered-devices) |
| `updateDeviceDetails()` | **Rename Device** (operationType: 0) | `onUpdateDeviceDetails` | Updates device name with server validation | [📖 API Docs](https://developer.uniken.com/docs/update-device-details) |
| `updateDeviceDetails()` | **Delete Device** (operationType: 1) | `onUpdateDeviceDetails` | Removes non-current device from account | [📖 API Docs](https://developer.uniken.com/docs/update-device-details) |

> **🎯 Production Recommendation**: Always implement three-layer error handling (API errors, status codes, promise rejections) for robust device management.

### How to Use Device Management APIs

REL-ID device management supports three primary operations:

#### **1. List Devices** - View All Registered Devices
```javascript
const userID = 'john.doe';
await rdnaService.getRegisteredDeviceDetails(userID);
// Wait for onGetRegistredDeviceDetails event
```
- **Use Case**: Display all devices registered to user account
- **Returns**: Device list with cooling period information
- **Status Code 100**: Success with device data
- **Status Code 146**: Cooling period active - disable all operations
- **📖 Official Documentation**: [Get Registered Devices API](https://developer.uniken.com/docs/get-registered-devices)

#### **2. Rename Device** - Update Device Display Name
```javascript
const operationType = 0; // Rename operation
const payload = JSON.stringify({
  device: [{
    devUUID: deviceUUID,
    devName: 'My iPhone 14 Pro',
    status: 'Update',
    lastAccessedTs: device.lastAccessedTs,
    lastAccessedTsEpoch: device.lastAccessedTsEpoch,
    createdTs: device.createdTs,
    createdTsEpoch: device.createdTsEpoch,
    appUuid: device.appUuid,
    currentDevice: device.currentDevice,
    devBind: device.devBind
  }]
});

await rdnaService.updateDeviceDetails(userID, payload);
// Wait for onUpdateDeviceDetails event
```
- **Use Case**: User-friendly device name customization
- **Validation**: Cannot rename during cooling period
- **Server Response**: StatusCode 100 (success) or 146 (cooling period)
- **📖 Official Documentation**: [Update Device Details API](https://developer.uniken.com/docs/update-device-details)

#### **3. Delete Device** - Remove Device from Account
```javascript
const operationType = 1; // Delete operation
const payload = JSON.stringify({
  device: [{
    devUUID: deviceUUID,
    devName: '', // Empty string for delete
    status: 'Delete',
    lastAccessedTs: device.lastAccessedTs,
    lastAccessedTsEpoch: device.lastAccessedTsEpoch,
    createdTs: device.createdTs,
    createdTsEpoch: device.createdTsEpoch,
    appUuid: device.appUuid,
    currentDevice: false, // Must be false
    devBind: device.devBind
  }]
});

await rdnaService.updateDeviceDetails(userID, payload);
// Wait for onUpdateDeviceDetails event
```
- **Use Case**: Remove lost or unused devices
- **Protection**: Cannot delete current device (currentDevice: true)
- **Validation**: Cannot delete during cooling period
- **Confirmation**: Always show destructive action confirmation dialog
- **📖 Official Documentation**: [Update Device Details API](https://developer.uniken.com/docs/update-device-details)

## 🎓 Learning Checkpoints

### Checkpoint 1: Sync+Async Pattern Understanding
- [ ] I understand the two-phase response pattern (sync acknowledgment + async event)
- [ ] I know why event handlers must be registered BEFORE API calls
- [ ] I can implement proper callback preservation to avoid memory leaks
- [ ] I understand when to use screen-level vs global event handlers
- [ ] I can debug issues related to missing or incorrectly timed event handlers

### Checkpoint 2: Device Listing & Synchronization
- [ ] I can implement `getRegisteredDeviceDetails()` API with proper error handling
- [ ] I understand how to parse device list from `onGetRegistredDeviceDetails` event
- [ ] I know how to detect cooling period from StatusCode 146
- [ ] I can implement pull-to-refresh for real-time device synchronization
- [ ] I understand the device object structure (devUUID, devName, currentDevice, status)

### Checkpoint 3: Device Update Operations
- [ ] I can implement device rename with `updateDeviceDetails()` operationType 0
- [ ] I can implement device deletion with `updateDeviceDetails()` operationType 1
- [ ] I understand the JSON payload structure required by the SDK
- [ ] I know how to handle update responses in `onUpdateDeviceDetails` event
- [ ] I can differentiate between rename and delete operation responses

### Checkpoint 4: Cooling Period Management
- [ ] I understand what cooling periods are and why they exist
- [ ] I can detect cooling period from `deviceManagementCoolingPeriodEndTimestamp`
- [ ] I know how to disable UI actions when StatusCode is 146
- [ ] I can display visual warnings when cooling period is active
- [ ] I understand how to handle cooling period errors in update operations

### Checkpoint 5: Three-Layer Error Handling
- [ ] I can implement Layer 1: API-level error detection (longErrorCode !== 0)
- [ ] I can implement Layer 2: Status code validation (StatusCode 100, 146, etc.)
- [ ] I can implement Layer 3: Promise rejection handling for network errors
- [ ] I understand when each error layer catches different failure scenarios
- [ ] I can provide user-friendly error messages for all error types

### Checkpoint 6: Current Device Protection
- [ ] I understand why current device deletion must be prevented
- [ ] I can identify current device using `currentDevice: true` flag
- [ ] I know how to disable delete button for current device
- [ ] I can display appropriate UI indicators for current device (badge, etc.)
- [ ] I understand the security implications of current device protection

## 🔄 Device Management User Flow

### Scenario 1: Standard Device Listing with Real-time Sync
1. **User navigates to Device Management** → From drawer navigation menu
2. **API call initiated** → `getRegisteredDeviceDetails(userID)` called automatically
3. **Loading indicator displayed** → User sees loading state during API call
4. **Device list received** → `onGetRegistredDeviceDetails` event provides device array
5. **Cooling period check** → StatusCode 146 detection and banner display
6. **Device list rendered** → Device cards displayed with metadata
7. **Current device highlighted** → Badge or indicator for current device
8. **User taps refresh** → Manual refresh triggers new API call
9. **List updates** → Latest device data synchronized from server
10. **User taps device** → Navigate to DeviceDetailScreen for actions

### Scenario 2: Device Rename Operation
1. **User taps device card** → Navigate to DeviceDetailScreen
2. **User taps "Rename Device"** → Opens rename modal
3. **Current name pre-filled** → Text input shows existing device name
4. **User enters new name** → Real-time validation as user types
5. **User taps "Save"** → `updateDeviceDetails(userID, payload)` called with operationType 0
6. **Loading state shown** → Modal shows loading indicator
7. **Update response received** → `onUpdateDeviceDetails` event with StatusCode 100
8. **Success confirmation** → Alert displays "Device renamed successfully"
9. **UI updates immediately** → Device name updates in detail screen
10. **User returns to list** → Navigate back, device list shows updated name

### Scenario 3: Device Deletion with Protection
1. **User navigates to device detail** → Taps non-current device
2. **Delete button enabled** → Button active only for non-current devices
3. **User taps "Delete Device"** → Destructive action confirmation dialog appears
4. **Confirmation dialog shown** → "Are you sure? This cannot be undone."
5. **User confirms deletion** → `updateDeviceDetails(userID, payload)` called with operationType 1
6. **Delete processing** → Loading indicator replaces button
7. **Delete response received** → `onUpdateDeviceDetails` event with StatusCode 100
8. **Success confirmation** → Alert with "Device deleted successfully"
9. **Navigation back** → Automatic return to device list
10. **Device list refreshed** → Deleted device no longer appears in list

### Scenario 4: Cooling Period Enforcement
1. **User performs operation** → Rename or delete device
2. **Server applies cooling period** → 30-minute cooldown starts
3. **User returns to device list** → Pull-to-refresh or automatic load
4. **API returns StatusCode 146** → Cooling period detected
5. **Warning banner displayed** → "Device management in cooling period. Please try again later."
6. **All actions disabled** → Rename and delete buttons grayed out
7. **User attempts operation** → Validation prevents API call
8. **Error message shown** → "Actions disabled during cooling period"
9. **Cooling period expires** → After configured time (e.g., 30 minutes)
10. **Operations re-enabled** → Next API call returns StatusCode 100, actions enabled

### Scenario 5: Error Handling (Network Failures, Current Device Protection)
1. **User attempts delete current device** → Taps delete on device with currentDevice: true
2. **Validation catches attempt** → Client-side check prevents API call
3. **Error alert displayed** → "Cannot delete the current device"
4. **User attempts network operation** → Rename/delete with no network
5. **Network error occurs** → Promise rejection in Layer 3 error handling
6. **Layer 3 catches error** → Promise .catch() handles network timeout
7. **User-friendly error shown** → "Failed to complete operation. Please check connection."
8. **User retries operation** → Taps retry button
9. **Network restored** → Operation succeeds on retry
10. **Success confirmation** → Operation completes successfully

## 💡 Pro Tips

### Device Management Implementation Best Practices
1. **Always preserve event handlers** - Use callback preservation pattern to prevent memory leaks
2. **Register handlers before API calls** - Event handlers must be set before calling SDK APIs
3. **Implement three-layer error handling** - Check API errors, status codes, and promise rejections
4. **Protect current device** - Never allow deletion of device with currentDevice: true
5. **Enforce cooling periods** - Disable all operations when StatusCode is 146
6. **Use pull-to-refresh** - Provide manual refresh for real-time synchronization
7. **Show loading states** - Always provide visual feedback during API operations
8. **Confirm destructive actions** - Use confirm() or custom modals for delete operations

### Security & User Experience
9. **Validate before API calls** - Check cooling period and current device before operations
10. **Display cooling period warnings** - Show prominent banner when StatusCode 146
11. **Highlight current device** - Use badges or indicators for current device visibility
12. **Auto-refresh after operations** - Reload device list after successful rename/delete
13. **Handle cleanup on unmount** - Restore original event handlers in onContentLoaded cleanup
14. **Provide timestamp context** - Display "Last accessed" and "Created" timestamps
15. **Optimize list rendering** - Use efficient DOM manipulation for device list updates

### Cordova SPA Development
16. **One-time initialization** - Call AppInitializer.initialize() ONCE in app.js
17. **Template-based navigation** - Use NavigationService.navigate() for fast content swap
18. **Pass session params** - Always pass userID, sessionID through navigation
19. **Use JSON.parse()** - All Cordova plugin responses need JSON.parse() when using cordova.plugins.rdna
20. **Test on device** - Some features only work on real devices, not browser
21. **Use Chrome DevTools** - Debug Android apps with chrome://inspect
22. **Use Safari Web Inspector** - Debug iOS apps with Safari Developer menu

## 🔗 Key Implementation Files

### Core Device Listing API Implementation
```javascript
// rdnaService.js - Device Listing API (Cordova Plugin)
getRegisteredDeviceDetails(userId) {
  return new Promise((resolve, reject) => {
    cordova.plugins.rdna.getRegisteredDeviceDetails(
      userId,
      (response) => {
        const result = JSON.parse(response);
        if (result.error && result.error.longErrorCode === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      },
      (error) => {
        reject({ error: { longErrorCode: -1, errorString: error } });
      }
    );
  });
}
```

### Device Update API Implementation
```javascript
// rdnaService.js - Device Update API (Rename/Delete)
updateDeviceDetails(userId, devicePayload) {
  return new Promise((resolve, reject) => {
    // devicePayload is already a JSON string with complete device object array
    // Example: {"device":[{"devUUID":"...","devName":"New Name","status":"Update",...}]}

    cordova.plugins.rdna.updateDeviceDetails(
      userId,
      devicePayload,
      (response) => {
        const result = JSON.parse(response);
        if (result.error && result.error.longErrorCode === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      },
      (error) => {
        reject({ error: { longErrorCode: -1, errorString: error } });
      }
    );
  });
}
```

**Example Payload for Rename Operation:**
```json
{
  "device": [{
    "devUUID": "I6RT38G3M7K4JKBXW81FUEM2VYWQFQB3JSMQU0ZV7MZ84UMQR",
    "devName": "iOS-iPhone-iPhone 12 Mini-Updated",
    "status": "Update",
    "lastAccessedTs": "2025-10-09T11:39:49UTC",
    "lastAccessedTsEpoch": 1760009989000,
    "createdTs": "2025-10-09T11:38:34UTC",
    "createdTsEpoch": 1760009914000,
    "appUuid": "6b72172f-3e51-4ea9-b217-2f3e51aea9c3",
    "currentDevice": true,
    "devBind": 0
  }]
}
```

**Example Payload for Delete Operation:**
```json
{
  "device": [{
    "devUUID": "I6RT38G3M7K4JKBXW81FUEM2VYWQFQB3JSMQU0ZV7MZ84UMQR",
    "devName": "",
    "status": "Delete",
    "lastAccessedTs": "2025-10-09T11:39:49UTC",
    "lastAccessedTsEpoch": 1760009989000,
    "createdTs": "2025-10-09T11:38:34UTC",
    "createdTsEpoch": 1760009914000,
    "appUuid": "6b72172f-3e51-4ea9-b217-2f3e51aea9c3",
    "currentDevice": false,
    "devBind": 0
  }]
}
```

### SPA Screen Lifecycle Pattern
```javascript
// DeviceManagementScreen.js - Cordova SPA Pattern
const DeviceManagementScreen = {
  // Screen state
  devices: [],
  isLoading: false,
  isCoolingPeriodActive: false,
  coolingPeriodEndTimestamp: null,
  coolingPeriodMessage: '',
  sessionParams: {},

  /**
   * Called when screen content is loaded (SPA lifecycle)
   * @param {Object} params - Navigation parameters (must include userID)
   */
  onContentLoaded(params) {
    console.log('DeviceManagementScreen - Content loaded with params:', params);

    // Store session params for API calls and navigation
    this.sessionParams = params || {};

    // Validate required userID parameter
    if (!this.sessionParams.userID) {
      console.error('DeviceManagementScreen - userID is required');
      this.showError('Session expired. Please log in again.');
      return;
    }

    // Setup UI
    this.setupEventListeners();
    this.registerSDKEventHandlers();

    // Auto-load devices
    this.loadDevices();
  },

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Menu button
    const menuButton = document.getElementById('device-management-menu-button');
    if (menuButton) {
      menuButton.onclick = () => {
        NavigationService.toggleDrawer();
      };
    }

    // Refresh button
    const refreshButton = document.getElementById('device-management-refresh-button');
    if (refreshButton) {
      refreshButton.onclick = () => {
        this.loadDevices();
      };
    }

    console.log('DeviceManagementScreen - Event listeners setup complete');
  },

  /**
   * Register SDK event handlers
   */
  registerSDKEventHandlers() {
    const eventManager = rdnaService.getEventManager();

    // Handle getRegisteredDeviceDetails response
    eventManager.setGetRegisteredDeviceDetailsHandler((data) => {
      console.log('DeviceManagementScreen - onGetRegistredDeviceDetails event received');
      this.handleGetDevicesResponse(data);
    });

    console.log('DeviceManagementScreen - SDK event handlers registered');
  },

  /**
   * Load devices from server (auto-triggered on screen load)
   */
  loadDevices() {
    if (this.isLoading) {
      console.log('DeviceManagementScreen - Already loading devices');
      return;
    }

    if (!this.sessionParams.userID) {
      console.error('DeviceManagementScreen - userID not available');
      this.showError('Session expired. Please log in again.');
      return;
    }

    this.isLoading = true;
    this.showLoading(true);
    console.log('DeviceManagementScreen - Loading devices for userID:', this.sessionParams.userID);

    // Call SDK getRegisteredDeviceDetails API
    rdnaService.getRegisteredDeviceDetails(this.sessionParams.userID)
      .then((syncResponse) => {
        console.log('DeviceManagementScreen - GetRegisteredDeviceDetails sync response:', syncResponse);
        // Waiting for onGetRegistredDeviceDetails event with device list
      })
      .catch((error) => {
        console.error('DeviceManagementScreen - GetRegisteredDeviceDetails error:', error);
        this.isLoading = false;
        this.showLoading(false);
        this.showError('Failed to load devices. Please try again.');
      });
  },

  /**
   * Handle getRegisteredDeviceDetails response event
   */
  handleGetDevicesResponse(data) {
    console.log('DeviceManagementScreen - Processing device details response');

    this.isLoading = false;
    this.showLoading(false);

    // Layer 1: Check API-level error (error.longErrorCode)
    if (data.error && data.error.longErrorCode !== 0) {
      const errorMsg = data.error.errorString || 'API error occurred';
      console.error('DeviceManagementScreen - API error:', errorMsg);
      this.showError(errorMsg);
      return;
    }

    // Layer 2: Check status code (pArgs.response.StatusCode)
    const statusCode = data.pArgs?.response?.StatusCode;
    if (statusCode === 146) {
      // Cooling period active
      this.isCoolingPeriodActive = true;
      this.coolingPeriodEndTimestamp = data.pArgs?.response?.ResponseData?.deviceManagementCoolingPeriodEndTimestamp;
      this.coolingPeriodMessage = data.pArgs?.response?.StatusMsg || 'Device management operations are temporarily disabled.';
      console.log('DeviceManagementScreen - Cooling period detected');
      this.showCoolingPeriodWarning();
    } else if (statusCode !== 100) {
      const statusMsg = data.pArgs?.response?.StatusMsg || 'Failed to retrieve devices';
      console.error('DeviceManagementScreen - Status error:', statusCode);
      this.showError(statusMsg);
      return;
    } else {
      // Success - clear cooling period state
      this.isCoolingPeriodActive = false;
      this.coolingPeriodEndTimestamp = null;
      this.coolingPeriodMessage = '';
      this.hideCoolingPeriodWarning();
    }

    // Process devices data
    this.devices = data.pArgs?.response?.ResponseData?.device || [];
    console.log('DeviceManagementScreen - Received', this.devices.length, 'devices');

    // Display devices
    this.renderDeviceList();
  },

  /**
   * Render device list
   */
  renderDeviceList() {
    const container = document.getElementById('device-list');
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    if (this.devices.length === 0) {
      // Empty state
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <p class="empty-state-text">📱</p>
        <p class="empty-state-message">No devices found</p>
      `;
      container.appendChild(emptyState);
      return;
    }

    // Render each device
    this.devices.forEach((device) => {
      const deviceCard = this.createDeviceCard(device);
      container.appendChild(deviceCard);
    });
  },

  /**
   * Create device card element
   */
  createDeviceCard(device) {
    const card = document.createElement('div');
    card.className = 'device-card';

    // Add current device styling
    if (device.currentDevice) {
      card.classList.add('current-device');
    }

    // Add click handler to navigate to detail screen
    card.onclick = () => {
      console.log('DeviceManagementScreen - Device tapped:', device.devUUID);
      this.navigateToDeviceDetail(device);
    };

    // Status indicator color
    const statusClass = device.status === 'ACTIVE' ? 'status-active' : 'status-inactive';

    // Format timestamps
    const lastAccessedDate = this.formatTimestamp(device.lastAccessedTsEpoch);
    const createdDate = this.formatTimestamp(device.createdTsEpoch);

    card.innerHTML = `
      ${device.currentDevice ? '<div class="current-device-badge">Current Device</div>' : ''}
      <h3 class="device-name">${device.devName || 'Unnamed Device'}</h3>
      <div class="device-status-inline ${statusClass}">
        <span class="status-dot"></span>
        <span class="status-text">${device.status}</span>
      </div>
      <div class="device-timestamps">
        <div class="timestamp-row">
          <span class="timestamp-label">Last Accessed:</span>
          <span class="timestamp-value">${lastAccessedDate}</span>
        </div>
        <div class="timestamp-row">
          <span class="timestamp-label">Created:</span>
          <span class="timestamp-value">${createdDate}</span>
        </div>
      </div>
      <div class="device-card-footer">
        <span class="tap-hint">Tap for details →</span>
      </div>
    `;

    return card;
  },

  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown';

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('DeviceManagementScreen - Error formatting timestamp:', error);
      return 'Unknown';
    }
  },

  /**
   * Navigate to device detail screen
   */
  navigateToDeviceDetail(device) {
    const params = {
      ...this.sessionParams,
      device: device,
      isCoolingPeriodActive: this.isCoolingPeriodActive,
      coolingPeriodEndTimestamp: this.coolingPeriodEndTimestamp,
      coolingPeriodMessage: this.coolingPeriodMessage
    };

    NavigationService.navigate('DeviceDetail', params);
  }
};

// Expose globally for NavigationService
window.DeviceManagementScreen = DeviceManagementScreen;
```

### Three-Layer Error Handling Implementation
```javascript
// DeviceDetailScreen.js - Complete Error Handling with Cleanup
const DeviceDetailScreen = {
  device: null,
  sessionParams: {},
  isCoolingPeriodActive: false,

  onContentLoaded(params) {
    this.device = params.device;
    this.sessionParams = params;
    this.isCoolingPeriodActive = params.isCoolingPeriodActive || false;

    this.setupEventListeners();
    this.registerSDKEventHandlers();
    this.renderDeviceDetails();
  },

  registerSDKEventHandlers() {
    const eventManager = rdnaService.getEventManager();

    // Handle updateDeviceDetails response
    eventManager.setUpdateDeviceDetailsHandler((data) => {
      console.log('DeviceDetailScreen - onUpdateDeviceDetails event received');
      this.handleUpdateDeviceResponse(data);
    });
  },

  handleRenameDevice(newName) {
    console.log('DeviceDetailScreen - Renaming device to:', newName);

    // Show loading state
    this.showLoading(true);

    // Construct payload with complete device object
    const payload = JSON.stringify({
      device: [{
        devUUID: this.device.devUUID,
        devName: newName,
        status: 'Update', // Rename operation
        lastAccessedTs: this.device.lastAccessedTs,
        lastAccessedTsEpoch: this.device.lastAccessedTsEpoch,
        createdTs: this.device.createdTs,
        createdTsEpoch: this.device.createdTsEpoch,
        appUuid: this.device.appUuid,
        currentDevice: this.device.currentDevice,
        devBind: this.device.devBind
      }]
    });

    // Layer 3: Call API with promise rejection handling
    rdnaService.updateDeviceDetails(this.sessionParams.userID, payload)
      .then((syncResponse) => {
        console.log('DeviceDetailScreen - UpdateDeviceDetails sync response:', syncResponse);
        // Waiting for onUpdateDeviceDetails event
      })
      .catch((error) => {
        console.error('DeviceDetailScreen - UpdateDeviceDetails error:', error);
        this.showLoading(false);
        this.showError('Failed to rename device. Please try again.');
      });
  },

  handleUpdateDeviceResponse(data) {
    console.log('DeviceDetailScreen - Processing update device response');

    this.showLoading(false);

    // Layer 1: API Error Check
    if (data.error && data.error.longErrorCode !== 0) {
      const errorMsg = data.error.errorString || 'Failed to rename device';
      console.error('DeviceDetailScreen - API error:', errorMsg);
      alert(errorMsg);
      return;
    }

    // Layer 2: Status Code Check
    const statusCode = data.pArgs?.response?.StatusCode || 0;
    const statusMsg = data.pArgs?.response?.StatusMsg || '';

    if (statusCode === 100) {
      // Success
      alert('Device renamed successfully');
      // Navigate back to device list
      NavigationService.navigate('DeviceManagement', this.sessionParams);
    } else if (statusCode === 146) {
      // Cooling period
      alert('Device management is currently in cooling period. Please try again later.');
    } else {
      // Other error
      alert(statusMsg || 'Failed to rename device');
    }
  }
};

// Expose globally for NavigationService
window.DeviceDetailScreen = DeviceDetailScreen;
```

### Cooling Period Detection & UI
```javascript
// DeviceManagementScreen.js - Cooling Period Banner
showCoolingPeriodWarning() {
  const warningBanner = document.getElementById('cooling-period-warning');
  const warningMessage = document.getElementById('cooling-period-message');
  const warningEnd = document.getElementById('cooling-period-end');

  if (warningBanner) {
    warningBanner.style.display = 'block';
  }

  if (warningMessage) {
    warningMessage.textContent = this.coolingPeriodMessage ||
      'Device management operations are temporarily disabled.';
  }

  if (warningEnd && this.coolingPeriodEndTimestamp) {
    const endDate = new Date(this.coolingPeriodEndTimestamp);
    warningEnd.textContent = `Cooling period ends: ${endDate.toLocaleString()}`;
    warningEnd.style.display = 'block';
  } else if (warningEnd) {
    warningEnd.style.display = 'none';
  }
}

hideCoolingPeriodWarning() {
  const warningBanner = document.getElementById('cooling-period-warning');
  if (warningBanner) {
    warningBanner.style.display = 'none';
  }
}
```

```javascript
// DeviceDetailScreen.js - Disabled Actions During Cooling Period
renderDeviceDetails() {
  const renameButton = document.getElementById('rename-device-button');
  const deleteButton = document.getElementById('delete-device-button');

  // Disable buttons during cooling period
  if (this.isCoolingPeriodActive) {
    if (renameButton) {
      renameButton.disabled = true;
      renameButton.classList.add('button-disabled');
    }
    if (deleteButton) {
      deleteButton.disabled = true;
      deleteButton.classList.add('button-disabled');
    }
  }
}
```

### Current Device Protection
```javascript
// DeviceDetailScreen.js - Protect Current Device from Deletion
renderDeviceDetails() {
  const deleteButton = document.getElementById('delete-device-button');
  const isCurrentDevice = this.device.currentDevice;

  if (isCurrentDevice) {
    // Hide or disable delete button for current device
    if (deleteButton) {
      deleteButton.style.display = 'none';
    }
  } else {
    // Show delete button for non-current devices
    if (deleteButton) {
      deleteButton.style.display = 'block';
      deleteButton.onclick = () => {
        this.handleDeleteDevice();
      };
    }
  }
}

handleDeleteDevice() {
  // Validation check
  if (this.device.currentDevice) {
    alert('Cannot delete the current device.');
    return;
  }

  // Confirmation dialog
  const confirmed = confirm(
    `Are you sure you want to delete "${this.device.devName}"? This action cannot be undone.`
  );

  if (!confirmed) return;

  // Proceed with deletion
  this.performDeleteDevice();
}

performDeleteDevice() {
  console.log('DeviceDetailScreen - Deleting device:', this.device.devUUID);

  // Show loading state
  this.showLoading(true);

  // Construct payload with complete device object
  const payload = JSON.stringify({
    device: [{
      devUUID: this.device.devUUID,
      devName: '', // Empty for delete
      status: 'Delete', // Delete operation
      lastAccessedTs: this.device.lastAccessedTs,
      lastAccessedTsEpoch: this.device.lastAccessedTsEpoch,
      createdTs: this.device.createdTs,
      createdTsEpoch: this.device.createdTsEpoch,
      appUuid: this.device.appUuid,
      currentDevice: false, // Must be false
      devBind: this.device.devBind
    }]
  });

  // Call API
  rdnaService.updateDeviceDetails(this.sessionParams.userID, payload)
    .then((syncResponse) => {
      console.log('DeviceDetailScreen - DeleteDevice sync response:', syncResponse);
      // Waiting for onUpdateDeviceDetails event
    })
    .catch((error) => {
      console.error('DeviceDetailScreen - DeleteDevice error:', error);
      this.showLoading(false);
      alert('Failed to delete device. Please try again.');
    });
}
```

---

## 📚 Related Documentation

### Official REL-ID Device Management APIs
- **[Get Registered Devices API](https://developer.uniken.com/docs/get-registered-devices)** - Complete API reference for fetching device lists with cooling period information
- **[Update Device Details API](https://developer.uniken.com/docs/update-device-details)** - Comprehensive guide for rename and delete operations with JSON payload structure

### REL-ID Developer Resources
- **[REL-ID Developer Portal](https://developer.uniken.com/)** - Main developer documentation hub

### Cordova Resources
- **[Apache Cordova Documentation](https://cordova.apache.org/docs/en/latest/)** - Official Cordova setup and development guides

---

**🔐 Congratulations! You've mastered Device Management with REL-ID SDK in Cordova!**

*You're now equipped to implement secure, production-ready device management workflows using Cordova SPA architecture with proper synchronization, cooling period enforcement, and error handling. Use this knowledge to create robust device management experiences that provide users with complete control over their registered devices while maintaining security through server-enforced cooling periods and current device protection.*
