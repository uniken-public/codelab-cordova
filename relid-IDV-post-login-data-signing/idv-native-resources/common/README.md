# Common IDV Resources

This folder contains resource files **shared by both iOS and Android platforms**.

## 📋 Required Files

Place the following files in this directory:

### 1. `regula.license`
- **Type:** License file
- **Purpose:** Regula SDK license for document verification
- **Size:** Typically 1-5 KB
- **Format:** Text/Binary license file
- **Source:** Obtain from your team lead or REL-ID documentation portal

### 2. `db.dat`
- **Type:** Database file
- **Purpose:** Regula document recognition database
- **Size:** Typically 50-200 MB
- **Format:** Binary database file
- **Source:** Obtain from your team lead or REL-ID documentation portal

## 🎯 Destination

These files will be automatically copied to:

| File | iOS Destination | Android Destination |
|------|----------------|---------------------|
| `regula.license` | `platforms/ios/App/Resources/` | `platforms/android/app/src/main/res/raw/` |
| `db.dat` | `platforms/ios/App/Resources/` | `platforms/android/app/src/main/assets/Regula/` |

## 🚀 Setup

```bash
# Copy files from secure location
cp /path/to/secure/regula.license idv-native-resources/common/
cp /path/to/secure/db.dat idv-native-resources/common/

# Verify files are in place
ls -lh idv-native-resources/common/
# Should show: regula.license and db.dat with actual file sizes
```

## ⚠️ Important Notes

- **DO NOT commit these files to Git** - they are in `.gitignore`
- These files contain sensitive license and database information
- Both files are required for IDV functionality to work
- After adding files, run `cordova prepare` to copy them to platforms
