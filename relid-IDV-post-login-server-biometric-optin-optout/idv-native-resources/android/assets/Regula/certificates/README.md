# Android IDV Certificates

This folder contains certificate files **used only by Android platform**.

## 📋 Required Files

Place certificate files in this directory:

### `*.ldif` files
- **Type:** LDIF (LDAP Data Interchange Format) certificate files
- **Purpose:** PKI certificates for document verification on Android
- **Format:** Text-based LDIF format
- **Common files:**
  - `icaopkd-002-complete-000325.ldif` (or similar naming)
  - Other certificate .ldif files as needed
- **Source:** Obtain from your team lead or REL-ID documentation portal

## 🎯 Destination

These files will be automatically copied to:
- **Android:** `platforms/android/app/src/main/assets/Regula/certificates/`

## 🚀 Setup

```bash
# Copy certificate file(s) from secure location
cp /path/to/secure/icaopkd-002-complete-000325.ldif \
   idv-native-resources/android/assets/Regula/certificates/

# Copy additional certificate files if needed
cp /path/to/secure/*.ldif \
   idv-native-resources/android/assets/Regula/certificates/

# Verify files are in place
ls -lh idv-native-resources/android/assets/Regula/certificates/
# Should show: .ldif certificate file(s)
```

## 📝 File Naming

Certificate files typically follow this pattern:
- `icaopkd-[version]-[type]-[number].ldif`

Example:
- `icaopkd-002-complete-000325.ldif`

Make sure to use the correct file names as provided by your team.

## ⚠️ Important Notes

- **DO NOT commit certificate files to Git** - they are in `.gitignore`
- These certificates are Android-specific (iOS uses Certificates.bundle)
- Multiple .ldif files can be placed here if needed
- File names must match exactly as provided
- After adding certificates, run `cordova prepare android` to copy them to the Android platform
