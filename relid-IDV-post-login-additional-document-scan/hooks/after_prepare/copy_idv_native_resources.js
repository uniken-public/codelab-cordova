#!/usr/bin/env node

/**
 * Copy IDV Native Resources Hook
 *
 * Automatically copies IDV native resource files to platform-specific locations
 * during 'cordova prepare' or 'cordova build'.
 *
 * Folder Structure:
 *   idv-native-resources/
 *   ├── common/          ← Shared files (copied to both platforms)
 *   │   ├── regula.license
 *   │   └── db.dat
 *   ├── ios/             ← iOS-only files
 *   │   └── Certificates.bundle/
 *   └── android/         ← Android-only files
 *       └── assets/
 *           └── Regula/certificates/
 *
 * iOS Destinations:
 *   - common/regula.license → platforms/ios/{appName}/Resources/
 *   - common/db.dat → platforms/ios/{appName}/Resources/
 *   - ios/Certificates.bundle → platforms/ios/{appName}/Resources/
 *
 * Android Destinations:
 *   - common/regula.license → platforms/android/app/src/main/res/raw/
 *   - common/db.dat → platforms/android/app/src/main/assets/Regula/
 *   - android/assets/Regula/certificates/ → platforms/android/app/src/main/assets/Regula/certificates/
 *
 * @author REL-ID Codelab Team
 */

const fs = require('fs');
const path = require('path');

// ============================================
// Helper Functions
// ============================================

/**
 * Generate UUID for Xcode (24 chars)
 */
function generateUUID() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () => {
        return Math.floor(Math.random() * 16).toString(16).toUpperCase();
    });
}

/**
 * Check if file should be skipped during copy
 */
function shouldSkipFile(fileName) {
    const skipPatterns = [
        'README.md',      // Documentation files
        '.gitkeep',       // Git placeholder files
        '.DS_Store',      // macOS metadata
        'Thumbs.db',      // Windows metadata
        '.gitignore'      // Git ignore files
    ];

    // Skip files that match exact patterns
    if (skipPatterns.includes(fileName)) {
        return true;
    }

    // Skip hidden files starting with . (except .bundle directories for iOS)
    if (fileName.startsWith('.') && !fileName.endsWith('.bundle')) {
        return true;
    }

    return false;
}

/**
 * Recursively copy files and directories (excluding documentation and metadata)
 */
function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) {
        console.log(`   ⚠️  Source not found: ${src}`);
        return false;
    }

    const stats = fs.statSync(src);

    if (stats.isDirectory()) {
        // Create destination directory
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        // Copy all contents (except skipped files)
        fs.readdirSync(src).forEach(file => {
            // Skip documentation and metadata files
            if (shouldSkipFile(file)) {
                return; // Skip this file
            }

            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);
            copyRecursive(srcPath, destPath);
        });
    } else {
        // Ensure parent directory exists
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Copy file
        fs.copyFileSync(src, dest);
    }

    return true;
}

/**
 * Copy a single file with directory creation
 */
function copyFile(src, dest, fileName) {
    const sourcePath = path.join(src, fileName);
    const destPath = path.join(dest, fileName);

    if (!fs.existsSync(sourcePath)) {
        console.log(`   ⚠️  File not found: ${sourcePath}`);
        return false;
    }

    // Create destination directory if needed
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    fs.copyFileSync(sourcePath, destPath);
    console.log(`      ✓ ${fileName}`);
    return true;
}

// ============================================
// Xcode Project Integration
// ============================================

/**
 * Register resources in Xcode project.pbxproj
 */
function registerResourcesInXcode(iosPlatformPath, resources) {
    try {
        // Find .xcodeproj file
        const projFiles = fs.readdirSync(iosPlatformPath).filter(f => f.endsWith('.xcodeproj'));
        if (projFiles.length === 0) {
            console.log('   ⚠️  No .xcodeproj found, skipping Xcode registration');
            return;
        }

        const projPath = path.join(iosPlatformPath, projFiles[0], 'project.pbxproj');
        if (!fs.existsSync(projPath)) {
            console.log('   ⚠️  project.pbxproj not found, skipping Xcode registration');
            return;
        }

        console.log('   🔗 Registering resources in Xcode project...');

        let projectContent = fs.readFileSync(projPath, 'utf8');

        // Collect UUIDs for resources
        const fileReferences = [];
        const buildFiles = [];
        const buildFileRefs = [];
        const groupChildren = [];

        resources.forEach(resource => {
            // Check if resource already exists
            const existingPattern = new RegExp(`/\\* ${resource.name} \\*/`, 'g');
            if (existingPattern.test(projectContent)) {
                console.log(`      ⏭️  ${resource.name} (already registered)`);
                return;
            }

            const fileRefUUID = generateUUID();
            const buildFileUUID = generateUUID();

            // Determine file type
            let fileType = 'folder';
            let lastKnownFileType = 'folder';

            if (resource.type === 'file') {
                const ext = path.extname(resource.name);
                if (ext === '.license') {
                    lastKnownFileType = 'text';
                } else if (ext === '.dat') {
                    lastKnownFileType = 'file';
                } else {
                    lastKnownFileType = 'file';
                }
            }

            // Create PBXFileReference entry
            fileReferences.push(
                `\t\t${fileRefUUID} /* ${resource.name} */ = ` +
                `{isa = PBXFileReference; ` +
                `lastKnownFileType = ${lastKnownFileType}; ` +
                `path = ${resource.name}; ` +
                `sourceTree = "<group>"; };`
            );

            // Create PBXBuildFile entry
            buildFiles.push(
                `\t\t${buildFileUUID} /* ${resource.name} in Resources */ = ` +
                `{isa = PBXBuildFile; fileRef = ${fileRefUUID} /* ${resource.name} */; };`
            );

            buildFileRefs.push({
                uuid: buildFileUUID,
                name: resource.name
            });

            groupChildren.push(
                `\t\t\t\t${fileRefUUID} /* ${resource.name} */`
            );

            console.log(`      ✓ ${resource.name} → Xcode`);
        });

        if (fileReferences.length === 0) {
            console.log('      ℹ️  All resources already registered');
            return;
        }

        // Insert PBXFileReference entries
        const fileRefMarker = '/* End PBXFileReference section */';
        projectContent = projectContent.replace(
            fileRefMarker,
            fileReferences.join('\n') + '\n' + fileRefMarker
        );

        // Insert PBXBuildFile entries
        const buildFileMarker = '/* End PBXBuildFile section */';
        projectContent = projectContent.replace(
            buildFileMarker,
            buildFiles.join('\n') + '\n' + buildFileMarker
        );

        // Add to Resources PBXGroup
        const resourcesGroupPattern = /(29B97317FDCFA39411CA2CEA \/\* Resources \*\/ = \{[\s\S]*?children = \()([\s\S]*?)(\);)/;
        const match = projectContent.match(resourcesGroupPattern);

        if (match) {
            const existingChildren = match[2];
            const newChildren = existingChildren.trimEnd().replace(/,\s*$/, '') + ',\n' + groupChildren.join(',\n') + ',';
            projectContent = projectContent.replace(
                resourcesGroupPattern,
                `$1${newChildren}\n\t\t\t$3`
            );
        } else {
            console.log('      ⚠️  Could not find Resources group, files copied but not registered');
        }

        // Add to PBXResourcesBuildPhase
        const resourcesPhasePattern = /(\/\* Resources \*\/ = \{[\s\S]*?files = \()([\s\S]*?)(\);[\s\S]*?runOnlyForDeploymentPostprocessing)/;
        const phaseMatch = projectContent.match(resourcesPhasePattern);

        if (phaseMatch) {
            const existingFiles = phaseMatch[2];
            const newFiles = buildFileRefs.map(ref =>
                `\t\t\t\t${ref.uuid} /* ${ref.name} in Resources */`
            ).join(',\n');

            const updatedFiles = existingFiles.trimEnd().replace(/,\s*$/, '') + ',\n' + newFiles + ',';
            projectContent = projectContent.replace(
                resourcesPhasePattern,
                `$1${updatedFiles}\n\t\t\t$3`
            );
        } else {
            console.log('      ⚠️  Could not find Resources build phase, files copied but not registered');
        }

        // Write updated project file
        fs.writeFileSync(projPath, projectContent, 'utf8');
        console.log('      ✅ Xcode project updated');

    } catch (error) {
        console.log('   ⚠️  Error updating Xcode project:', error.message);
        console.log('      Files were copied but may not appear in Xcode');
    }
}

// ============================================
// iOS Resource Copying
// ============================================

function copyIOSResources(projectRoot, iosPlatformPath) {
    console.log('  📱 Copying iOS resources...');

    // Dynamically find app name from .xcodeproj
    const projFiles = fs.readdirSync(iosPlatformPath).filter(f => f.endsWith('.xcodeproj'));
    if (projFiles.length === 0) {
        console.log('   ⚠️  No .xcodeproj found');
        return;
    }
    const appName = projFiles[0].replace('.xcodeproj', '');

    const commonDir = path.join(projectRoot, 'idv-native-resources', 'common');
    const iosDir = path.join(projectRoot, 'idv-native-resources', 'ios');
    const destDir = path.join(iosPlatformPath, appName, 'Resources');

    const resourcesToAdd = [];
    let copiedCount = 0;

    // 1. Copy common files (shared with Android)
    if (fs.existsSync(commonDir)) {
        console.log('     📂 common/ (shared)');

        // Copy regula.license
        if (copyFile(commonDir, destDir, 'regula.license')) {
            resourcesToAdd.push({ name: 'regula.license', type: 'file' });
            copiedCount++;
        }

        // Copy db.dat
        if (copyFile(commonDir, destDir, 'db.dat')) {
            resourcesToAdd.push({ name: 'db.dat', type: 'file' });
            copiedCount++;
        }
    }

    // 2. Copy iOS-specific files
    if (fs.existsSync(iosDir)) {
        console.log('     📂 ios/ (platform-specific)');

        // Copy Certificates.bundle (directory)
        const bundleSource = path.join(iosDir, 'Certificates.bundle');
        const bundleDest = path.join(destDir, 'Certificates.bundle');

        if (fs.existsSync(bundleSource)) {
            copyRecursive(bundleSource, bundleDest);
            resourcesToAdd.push({ name: 'Certificates.bundle', type: 'folder' });
            console.log(`      ✓ Certificates.bundle/`);
            copiedCount++;
        }
    }

    if (!fs.existsSync(commonDir) && !fs.existsSync(iosDir)) {
        console.log(`   ⚠️  No iOS resources found`);
        console.log('      Create: idv-native-resources/common/ or idv-native-resources/ios/\n');
        return;
    }

    // 3. Register resources in Xcode project
    if (resourcesToAdd.length > 0) {
        registerResourcesInXcode(iosPlatformPath, resourcesToAdd);
    }

    console.log(`   📦 Copied ${copiedCount} iOS resource(s)\n`);
}

// ============================================
// Android Resource Copying
// ============================================

function copyAndroidResources(projectRoot, androidPlatformPath) {
    console.log('  🤖 Copying Android resources...');

    const commonDir = path.join(projectRoot, 'idv-native-resources', 'common');
    const androidDir = path.join(projectRoot, 'idv-native-resources', 'android');

    let copiedCount = 0;

    // 1. Copy common files (shared with iOS)
    if (fs.existsSync(commonDir)) {
        console.log('     📂 common/ (shared)');

        // Copy regula.license to res/raw/
        const rawDestDir = path.join(androidPlatformPath, 'app', 'src', 'main', 'res', 'raw');
        if (copyFile(commonDir, rawDestDir, 'regula.license')) copiedCount++;

        // Copy db.dat to assets/Regula/
        const assetsRegulaDir = path.join(androidPlatformPath, 'app', 'src', 'main', 'assets', 'Regula');
        if (copyFile(commonDir, assetsRegulaDir, 'db.dat')) {
            console.log('      ✓ db.dat → assets/Regula/');
            copiedCount++;
        }
    }

    // 2. Copy Android-specific files
    if (fs.existsSync(androidDir)) {
        console.log('     📂 android/ (platform-specific)');

        const assetsSourceDir = path.join(androidDir, 'assets');
        const assetsDestDir = path.join(androidPlatformPath, 'app', 'src', 'main', 'assets');

        if (fs.existsSync(assetsSourceDir)) {
            // Copy entire assets/ directory structure (handles nested folders)
            copyRecursive(assetsSourceDir, assetsDestDir);

            // Count and report copied files
            const certsSourceDir = path.join(assetsSourceDir, 'Regula', 'certificates');
            if (fs.existsSync(certsSourceDir)) {
                const certFiles = fs.readdirSync(certsSourceDir).filter(f => f.endsWith('.ldif'));
                certFiles.forEach(file => {
                    console.log(`      ✓ Regula/certificates/${file}`);
                    copiedCount++;
                });
            }
        }
    }

    if (!fs.existsSync(commonDir) && !fs.existsSync(androidDir)) {
        console.log(`   ⚠️  No Android resources found`);
        console.log('      Create: idv-native-resources/common/ or idv-native-resources/android/\n');
        return;
    }

    console.log(`   📦 Copied ${copiedCount} Android resource(s)\n`);
}

// ============================================
// Main Hook Function
// ============================================

module.exports = function(context) {
    console.log('\n🔧 IDV Native Resources Hook');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const projectRoot = context.opts.projectRoot;
    const platforms = context.opts.platforms || [];

    // Process iOS
    if (platforms.includes('ios')) {
        const iosPlatformPath = path.join(projectRoot, 'platforms', 'ios');

        if (fs.existsSync(iosPlatformPath)) {
            copyIOSResources(projectRoot, iosPlatformPath);
        }
    }

    // Process Android
    if (platforms.includes('android')) {
        const androidPlatformPath = path.join(projectRoot, 'platforms', 'android');

        if (fs.existsSync(androidPlatformPath)) {
            copyAndroidResources(projectRoot, androidPlatformPath);
        }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ IDV native resources copied successfully!\n');
};
