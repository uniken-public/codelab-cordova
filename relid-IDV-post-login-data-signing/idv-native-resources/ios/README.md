# iOS-Specific IDV Resources

This folder contains resource files **used only by iOS platform**.

## 📋 Required Files

Place the following files in this directory:

### `Certificates.bundle/`
- **Type:** iOS Resource Bundle (directory)
- **Purpose:** PKI certificates for document verification on iOS
- **Structure:** Bundle containing certificate files
- **Format:** iOS .bundle format (directory with contents)
- **Source:** Obtain from your team lead or REL-ID documentation portal

**Expected structure:**
```
Certificates.bundle/
├── (certificate files)
└── (other bundle resources)
```

## 🎯 Destination

This bundle will be automatically copied to:
- **iOS:** `platforms/ios/App/Resources/Certificates.bundle/`

## 🚀 Setup

```bash
# Copy the entire bundle from secure location
cp -R /path/to/secure/Certificates.bundle idv-native-resources/ios/

# Verify bundle is in place
ls -la idv-native-resources/ios/
# Should show: Certificates.bundle/ directory

# Check bundle contents
ls -la idv-native-resources/ios/Certificates.bundle/
# Should show certificate files inside
```

## ⚠️ Important Notes

- **DO NOT commit this bundle to Git** - it is in `.gitignore`
- The entire bundle directory must be copied (not just individual files)
- This bundle is iOS-specific and not used on Android
- Required for PKI certificate validation on iOS devices
- After adding the bundle, run `cordova prepare ios` to copy it to the iOS platform
