#!/usr/bin/env node

/**
 * Generic Android Localization Hook
 *
 * Automatically copies localization XML files from localization/android/
 * to platforms/android/app/src/main/res/
 *
 * Android automatically includes files in res/ folder - no additional
 * configuration needed (unlike iOS which needs variant groups).
 *
 * How it works:
 * 1. Copies values folders (values, values-es, values-hi) to Android res/ folder
 * 2. Android build system automatically includes them
 * 3. SDK reads strings using getString(R.string.KEY)
 * 4. Android automatically selects correct language based on device locale
 *
 * @author REL-ID Codelab Team
 */

const fs = require('fs');
const path = require('path');

// Helper: Copy directory recursively
function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return false;

    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
    return true;
}

module.exports = function(context) {
    // Only run for Android platform
    const platforms = context.opts.platforms;
    if (!platforms || !platforms.includes('android')) {
        return;
    }

    const projectRoot = context.opts.projectRoot;
    const androidPlatformPath = path.join(projectRoot, 'platforms/android');

    if (!fs.existsSync(androidPlatformPath)) {
        console.log('⚠️  Android platform not found');
        return;
    }

    console.log('🤖 Configuring Android localizations...');

    try {
        // Source and destination paths
        const sourceLocalesPath = path.join(projectRoot, 'localization', 'android');
        const destResPath = path.join(androidPlatformPath, 'app/src/main/res');

        if (!fs.existsSync(sourceLocalesPath)) {
            console.log(`⚠️  Source folder not found: ${sourceLocalesPath}`);
            return;
        }

        const languages = [];
        let totalFilesCopied = 0;

        console.log('  📁 Copying resource files...');

        // Copy each values* folder
        fs.readdirSync(sourceLocalesPath).forEach(folder => {
            const sourcePath = path.join(sourceLocalesPath, folder);

            if (fs.statSync(sourcePath).isDirectory() && folder.startsWith('values')) {
                const destPath = path.join(destResPath, folder);

                // Determine language
                let language;
                if (folder === 'values') {
                    language = 'default (en)';
                    languages.push('en');
                } else {
                    language = folder.replace('values-', '');
                    languages.push(language);
                }

                console.log(`     ├─ ${folder.padEnd(12)} (${language})`);

                // Copy folder
                copyRecursive(sourcePath, destPath);

                // Count files
                const files = fs.readdirSync(sourcePath).filter(f => f.endsWith('.xml'));
                totalFilesCopied += files.length;

                files.forEach(file => {
                    console.log(`        ├─ ${file}`);
                });
            }
        });

        console.log(`     └─ ✓ Copied ${languages.length} language(s)\n`);

        console.log('✅ Android localization complete!');
        console.log(`   Languages: ${languages.join(', ')}`);
        console.log(`   Files copied: ${totalFilesCopied}`);
        console.log('   Location: platforms/android/app/src/main/res/values*/');
        console.log('   SDK will use: getString(R.string.KEY)\n');

    } catch (error) {
        console.log('⚠️  Error:', error.message);
        console.error(error);
    }
};
