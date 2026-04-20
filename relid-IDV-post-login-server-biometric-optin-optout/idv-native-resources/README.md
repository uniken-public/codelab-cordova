# IDV Native Resources Guide

This folder contains IDV (Identity Verification) native resource files required for iOS and Android platforms.

**⚠️ IMPORTANT:** The actual resource files are **NOT included in Git** for security reasons. You must obtain and add them manually.

---

## 📁 Folder Structure

```
idv-native-resources/
├── README.md                                    ← You are here
├── common/                                      ← Shared files for both platforms
│   ├── .gitkeep                                ← Preserves folder in Git
│   ├── README.md                               ← Setup instructions
│   ├── regula.license                          ← [ADD THIS] License file
│   └── db.dat                                  ← [ADD THIS] Database file
├── ios/                                        ← iOS-only files
│   ├── .gitkeep                                ← Preserves folder in Git
│   ├── README.md                               ← Setup instructions
│   └── Certificates.bundle/                    ← [ADD THIS] iOS certificate bundle
│       └── (certificate files)
└── android/                                    ← Android-only files
    └── assets/
        └── Regula/
            └── certificates/
                ├── .gitkeep                     ← Preserves folder in Git
                ├── README.md                    ← Setup instructions
                └── icaopkd-002-complete-000325.ldif  ← [ADD THIS] Android certificates
```

---

## 🚀 Quick Start Guide

### Step 1: Obtain Required Files

**Contact your team lead or access the REL-ID documentation portal to get:**

| File | Description | Approx. Size | Platform(s) |
|------|-------------|--------------|-------------|
| `regula.license` | Regula SDK license | 1-5 KB | Both iOS & Android |
| `db.dat` | Document recognition database | 50-200 MB | Both iOS & Android |
| `Certificates.bundle/` | PKI certificate bundle | Varies | iOS only |
| `*.ldif` files | PKI certificates (LDIF format) | Varies | Android only |

### Step 2: Add Files to This Folder

```bash
# Navigate to project root
cd /path/to/relid-IDV-MFA-activation-flow

# Copy common files (shared by both platforms)
cp /path/to/secure/regula.license idv-native-resources/common/
cp /path/to/secure/db.dat idv-native-resources/common/

# Copy iOS-specific files
cp -R /path/to/secure/Certificates.bundle idv-native-resources/ios/

# Copy Android-specific files
cp /path/to/secure/icaopkd-002-complete-000325.ldif \
   idv-native-resources/android/assets/Regula/certificates/
```

### Step 3: Verify Files Are in Place

```bash
# Check common files
ls -lh idv-native-resources/common/
# Expected output:
# -rw-r--r--  regula.license  (few KB)
# -rw-r--r--  db.dat          (50-200 MB)

# Check iOS files
ls -la idv-native-resources/ios/
# Expected output:
# drwxr-xr-x  Certificates.bundle/

# Check Android files
ls -lh idv-native-resources/android/assets/Regula/certificates/
# Expected output:
# -rw-r--r--  icaopkd-002-complete-000325.ldif
```

### Step 4: Build Your App

The hook automatically copies resources during build:

```bash
# Copy resources to both platforms
cordova prepare

# Or build specific platform
cordova prepare ios
cordova prepare android

# Or full build
cordova build ios
cordova build android
```

**Expected console output:**

```
🔧 IDV Native Resources Hook
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📱 Copying iOS resources...
     📂 common/ (shared)
      ✓ regula.license
      ✓ db.dat
     📂 ios/ (platform-specific)
      ✓ Certificates.bundle/
   📦 Copied 3 iOS resource(s)

  🤖 Copying Android resources...
     📂 common/ (shared)
      ✓ regula.license
      ✓ db.dat → assets/Regula/
     📂 android/ (platform-specific)
      ✓ Regula/certificates/icaopkd-002-complete-000325.ldif
   📦 Copied 3 Android resource(s)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ IDV native resources copied successfully!
```

### Step 5: Verify Resources Were Copied to Platforms

**iOS:**
```bash
ls -la platforms/ios/App/Resources/
# Should show: regula.license, db.dat, Certificates.bundle/
```

**Android:**
```bash
# Check res/raw/
ls -la platforms/android/app/src/main/res/raw/
# Should show: regula.license

# Check assets/
ls -la platforms/android/app/src/main/assets/Regula/
# Should show: db.dat, certificates/

ls -la platforms/android/app/src/main/assets/Regula/certificates/
# Should show: icaopkd-002-complete-000325.ldif
```

---

## 🎯 How Files Are Copied

### iOS Destinations (`platforms/ios/App/Resources/`)

| Source | Destination |
|--------|-------------|
| `common/regula.license` → | `regula.license` |
| `common/db.dat` → | `db.dat` |
| `ios/Certificates.bundle/` → | `Certificates.bundle/` |

### Android Destinations

| Source | Destination |
|--------|-------------|
| `common/regula.license` → | `platforms/android/app/src/main/res/raw/regula.license` |
| `common/db.dat` → | `platforms/android/app/src/main/assets/Regula/db.dat` |
| `android/assets/Regula/certificates/` → | `platforms/android/app/src/main/assets/Regula/certificates/` |

---

## 🔧 Technical Details

### Hook Configuration

The automatic file copying is handled by:

**File:** `hooks/after_prepare/copy_idv_native_resources.js`

**Registered in:** `config.xml`
```xml
<hook type="after_prepare" src="hooks/after_prepare/copy_idv_native_resources.js" />
```

**Trigger:** Runs automatically during:
- `cordova prepare`
- `cordova build ios`
- `cordova build android`
- `cordova run ios`
- `cordova run android`

### Why This Approach?

| Benefit | Explanation |
|---------|-------------|
| **No Duplication** | Common files stored once in `common/` folder |
| **Automatic** | Runs on every build without manual intervention |
| **Survives Platform Changes** | Works after `cordova platform remove/add` |
| **Handles Nested Directories** | Correctly copies `assets/Regula/certificates/` structure |
| **Git-Safe** | Actual files never committed (only structure preserved) |
| **Maintainable** | All resources in one organized location |

---

## 🛠️ Troubleshooting

### Resources Not Being Copied?

**Check 1: Are files present?**
```bash
find idv-native-resources -type f ! -name ".gitkeep" ! -name "README.md"
# Should list all your resource files
```

**Check 2: Is hook registered?**
```bash
grep "copy_idv_native_resources" config.xml
# Should show: <hook type="after_prepare" src="hooks/after_prepare/copy_idv_native_resources.js" />
```

**Check 3: Is hook executable?**
```bash
ls -la hooks/after_prepare/copy_idv_native_resources.js
# Should show: -rwxr-xr-x (executable permissions)
```

**Fix:**
```bash
chmod +x hooks/after_prepare/copy_idv_native_resources.js
```

**Check 4: Clean and rebuild**
```bash
cordova clean
cordova prepare
# Watch for hook output in console
```

### Hook Not Running?

Look for the hook output during build:
```bash
cordova prepare --verbose
# Look for: "🔧 IDV Native Resources Hook"
```

If you don't see it:
1. Verify `config.xml` has the hook entry
2. Check hook file exists and is executable
3. Try: `cordova clean && cordova prepare`

### Files Missing After Platform Add?

This is **expected behavior**. The hook only runs during `prepare` or `build`, not during `platform add`.

**Solution:**
```bash
cordova platform add ios
cordova platform add android
cordova prepare          # ← This copies the files
```

### Wrong Files Copied?

If you updated files but old versions are still being used:

```bash
# Clean platforms
cordova clean

# Or remove and re-add platforms
cordova platform remove ios android
cordova platform add ios android

# Copy fresh resources
cordova prepare
```

---

## 📝 Best Practices

### 1. Never Edit `platforms/` Directly

❌ **WRONG:**
```bash
# Don't do this!
cp new-license.license platforms/ios/App/Resources/regula.license
```

✅ **CORRECT:**
```bash
# Update source, then rebuild
cp new-license.license idv-native-resources/common/regula.license
cordova prepare
```

**Why?** The `platforms/` folder is regenerated during builds. Your changes will be lost.

### 2. Keep Resources Updated

When you receive updated files:
```bash
# Replace old files
cp /path/to/new/regula.license idv-native-resources/common/
cp /path/to/new/db.dat idv-native-resources/common/

# Rebuild
cordova prepare
```

### 3. Version Control Strategy

**✅ Commit to Git:**
- Folder structure (`idv-native-resources/`)
- `.gitkeep` files
- `README.md` documentation
- Hook script (`copy_idv_native_resources.js`)
- `.gitignore` rules

**❌ Never Commit:**
- `regula.license` (sensitive)
- `db.dat` (sensitive)
- `Certificates.bundle/` (sensitive)
- `*.ldif` files (sensitive)

### 4. Team Onboarding Checklist

When a new developer joins:

```bash
# 1. Clone repo
git clone <repo-url>
cd relid-IDV-MFA-activation-flow

# 2. Read this README
cat idv-native-resources/README.md

# 3. Check what's needed
ls -la idv-native-resources/common/
ls -la idv-native-resources/ios/
ls -la idv-native-resources/android/assets/Regula/certificates/
# Should only see: .gitkeep and README.md

# 4. Get resources from team lead
# (Contact team lead for secure access)

# 5. Add resources
cp /secure/location/* idv-native-resources/...

# 6. Build
cordova prepare

# 7. Verify
cordova build ios
cordova build android
```

### 5. CI/CD Considerations

If using automated builds:

**Option A: Secure Environment Variables**
```bash
# Store base64-encoded files in CI secrets
# Decode during build
echo $REGULA_LICENSE_BASE64 | base64 -d > idv-native-resources/common/regula.license
```

**Option B: Secure File Storage**
- Store files in CI secure file storage (GitHub Secrets, GitLab CI Files, etc.)
- Download during build step

**Option C: Private Artifact Repository**
- Store resources in private artifact server
- Fetch during build with authentication

---

## 🔒 Security Notes

### Why These Files Are Not in Git

1. **License Protection:** `regula.license` contains commercial license credentials
2. **Database Size:** `db.dat` is 50-200 MB (bloats repository)
3. **Certificate Security:** PKI certificates should not be in public repositories
4. **Compliance:** Some regulations prohibit storing certain files in version control

### Safe Handling

- ✅ Store files in secure, encrypted location
- ✅ Use secure channels to share with team (encrypted email, secure file sharing)
- ✅ Regularly update to latest versions
- ✅ Never include in screenshots, logs, or documentation
- ❌ Never commit to Git
- ❌ Never email unencrypted
- ❌ Never store in public cloud storage

---

## 📚 Related Resources

- **iOS Localization:** `hooks/after_prepare/ios_localization.js`
- **Android Localization:** `hooks/after_prepare/android_localization.js`
- **Localization Files:** `localization/ios/` and `localization/android/`
- **Main Config:** `config.xml`

---

## 💡 Need Help?

1. **Read nested READMEs:**
   - `idv-native-resources/common/README.md`
   - `idv-native-resources/ios/README.md`
   - `idv-native-resources/android/assets/Regula/certificates/README.md`

2. **Check hook output:**
   ```bash
   cordova prepare --verbose
   ```

3. **Verify files:**
   ```bash
   tree idv-native-resources/
   ```

4. **Contact your team lead** for:
   - Access to secure resource files
   - Updated versions of files
   - Platform-specific issues

---

## ✅ Checklist: First-Time Setup

- [ ] Read this README completely
- [ ] Obtained all required files from team lead
- [ ] Copied `regula.license` to `common/`
- [ ] Copied `db.dat` to `common/`
- [ ] Copied `Certificates.bundle/` to `ios/`
- [ ] Copied `*.ldif` files to `android/assets/Regula/certificates/`
- [ ] Verified files with `ls -lh` commands
- [ ] Ran `cordova prepare`
- [ ] Saw "✅ IDV native resources copied successfully!" message
- [ ] Verified files in `platforms/ios/App/Resources/`
- [ ] Verified files in `platforms/android/app/src/main/res/raw/` and `assets/`
- [ ] Built and tested on iOS device/simulator
- [ ] Built and tested on Android device/emulator

---

**Last Updated:** 2026-04-09
**Maintained by:** REL-ID Codelab Team
