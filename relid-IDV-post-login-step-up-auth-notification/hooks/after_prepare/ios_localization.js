#!/usr/bin/env node

/**
 * Complete iOS Localization Hook
 *
 * Handles everything for iOS localization:
 * 1. Copies .lproj/.strings files from localization/ios/ to platforms/ios/App/Resources/
 * 2. Creates proper variant groups in Xcode
 * 3. Registers languages in knownRegions array
 * 4. Adds variant groups to Resources build phase
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

// Helper: Generate UUID for Xcode (24 chars)
function generateUUID() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () => {
        return Math.floor(Math.random() * 16).toString(16).toUpperCase();
    });
}

module.exports = function(context) {
    // Only run for iOS platform
    const platforms = context.opts.platforms;
    if (!platforms || !platforms.includes('ios')) {
        return;
    }

    const projectRoot = context.opts.projectRoot;
    const iosPlatformPath = path.join(projectRoot, 'platforms/ios');

    // Dynamically detect .xcodeproj file
    const projFiles = fs.readdirSync(iosPlatformPath).filter(f => f.endsWith('.xcodeproj'));
    if (projFiles.length === 0) {
        console.log('⚠️  No .xcodeproj found');
        return;
    }

    const projPath = path.join(iosPlatformPath, projFiles[0], 'project.pbxproj');

    if (!fs.existsSync(projPath)) {
        console.log('⚠️  project.pbxproj not found');
        return;
    }

    console.log('🌐 Configuring iOS localizations...');

    try {
        // Step 1: Copy localization files
        const sourceLocalesPath = path.join(projectRoot, 'localization', 'ios');
        const destResourcesPath = path.join(iosPlatformPath, 'App', 'Resources');

        if (!fs.existsSync(sourceLocalesPath)) {
            console.log(`⚠️  Source folder not found: ${sourceLocalesPath}`);
            return;
        }

        const languages = [];
        const stringsFilesByName = {};

        console.log('  📁 Copying files...');

        // Copy each .lproj folder
        fs.readdirSync(sourceLocalesPath).forEach(folder => {
            const sourcePath = path.join(sourceLocalesPath, folder);

            if (fs.statSync(sourcePath).isDirectory() && folder.endsWith('.lproj')) {
                const destPath = path.join(destResourcesPath, folder);
                const lang = folder.replace('.lproj', '');

                languages.push(lang);
                console.log(`     ├─ ${folder}`);

                // Copy folder
                copyRecursive(sourcePath, destPath);

                // Track .strings files
                fs.readdirSync(sourcePath).forEach(file => {
                    if (file.endsWith('.strings')) {
                        if (!stringsFilesByName[file]) {
                            stringsFilesByName[file] = [];
                        }
                        stringsFilesByName[file].push({
                            lang: lang,
                            folder: folder
                        });
                    }
                });
            }
        });

        console.log(`     └─ ✓ Copied ${languages.length} language(s)\n`);

        // Step 2: Manually create variant groups in project.pbxproj
        console.log('  🔗 Creating variant groups...');

        let projectContent = fs.readFileSync(projPath, 'utf8');

        // Remove existing localization entries to prevent duplicates
        Object.keys(stringsFilesByName).forEach(stringsFileName => {
            // Remove old PBXFileReference entries for this .strings file
            projectContent = projectContent.replace(
                new RegExp(`\\t\\t[A-Z0-9]+ /\\* ${stringsFileName} \\*/ = \\{isa = PBXFileReference;[^}]+path = App/Resources/[^;]+;[^}]+\\};\\n`, 'g'),
                ''
            );

            // Remove old PBXVariantGroup for this .strings file
            projectContent = projectContent.replace(
                new RegExp(`\\t\\t[A-Z0-9]+ /\\* ${stringsFileName} \\*/ = \\{[\\s\\S]*?name = ${stringsFileName};[\\s\\S]*?\\};\\n`, 'g'),
                ''
            );

            // Remove old PBXBuildFile entries for this .strings file
            projectContent = projectContent.replace(
                new RegExp(`\\t\\t[A-Z0-9]+ /\\* ${stringsFileName} in Resources \\*/ = \\{isa = PBXBuildFile;[^}]+\\};\\n`, 'g'),
                ''
            );
        });

        const fileReferences = [];
        const variantGroups = [];
        const buildFileEntries = [];
        const variantGroupUUIDs = [];

        Object.keys(stringsFilesByName).forEach(stringsFileName => {
            const variants = stringsFilesByName[stringsFileName];

            console.log(`     📎 ${stringsFileName}`);

            const variantGroupUUID = generateUUID();
            variantGroupUUIDs.push(variantGroupUUID);
            const variantChildrenUUIDs = [];

            // Create file reference for each language variant
            variants.forEach(variant => {
                const fileUUID = generateUUID();
                const relativePath = path.join('App/Resources', variant.folder, stringsFileName);

                fileReferences.push(
                    `\t\t${fileUUID} /* ${stringsFileName} */ = ` +
                    `{isa = PBXFileReference; ` +
                    `lastKnownFileType = text.plist.strings; ` +
                    `name = ${stringsFileName}; ` +
                    `path = ${relativePath}; ` +
                    `sourceTree = "<group>"; };`
                );

                variantChildrenUUIDs.push(`\t\t\t\t${fileUUID} /* ${variant.lang} */`);
                console.log(`        ├─ ${variant.lang}`);
            });

            // Create variant group
            variantGroups.push(
                `\t\t${variantGroupUUID} /* ${stringsFileName} */ = {` +
                `\n\t\t\tisa = PBXVariantGroup;` +
                `\n\t\t\tchildren = (` +
                `\n${variantChildrenUUIDs.join(',\n')},` +
                `\n\t\t\t);` +
                `\n\t\t\tname = ${stringsFileName};` +
                `\n\t\t\tsourceTree = "<group>";` +
                `\n\t\t};`
            );

            // Create build file entry
            const buildFileUUID = generateUUID();
            buildFileEntries.push({
                uuid: buildFileUUID,
                name: stringsFileName,
                groupUUID: variantGroupUUID,
                text: `\t\t${buildFileUUID} /* ${stringsFileName} in Resources */ = ` +
                      `{isa = PBXBuildFile; fileRef = ${variantGroupUUID} /* ${stringsFileName} */; };`
            });

            console.log(`        └─ ✓ Variant group created\n`);
        });

        // Insert file references
        const fileRefMarker = '/* End PBXFileReference section */';
        projectContent = projectContent.replace(
            fileRefMarker,
            fileReferences.join('\n') + '\n' + fileRefMarker
        );

        // Insert variant groups
        const variantGroupMarker = '/* End PBXVariantGroup section */';
        projectContent = projectContent.replace(
            variantGroupMarker,
            variantGroups.join('\n') + '\n' + variantGroupMarker
        );

        // Insert build file entries
        const buildFileMarker = '/* End PBXBuildFile section */';
        projectContent = projectContent.replace(
            buildFileMarker,
            buildFileEntries.map(e => e.text).join('\n') + '\n' + buildFileMarker
        );

        // Add to Resources build phase
        const resourcesPhaseMatch = projectContent.match(
            /90BD9B6A2C06907D000DEBAB \/\* Resources \*\/ = \{[\s\S]*?files = \(([\s\S]*?)\);/
        );

        if (resourcesPhaseMatch) {
            let filesSection = resourcesPhaseMatch[1];

            // Remove old localization file entries from Resources build phase
            Object.keys(stringsFilesByName).forEach(stringsFileName => {
                filesSection = filesSection.replace(
                    new RegExp(`\\t+[A-Z0-9]+ /\\* ${stringsFileName} in Resources \\*/,?\\n`, 'g'),
                    ''
                );
            });

            // Add build file UUIDs
            const newEntries = buildFileEntries.map(e =>
                `\t\t\t\t${e.uuid} /* ${e.name} in Resources */`
            ).join(',\n');

            // Remove any trailing commas and whitespace, then add our entries
            const updatedFilesSection = filesSection.trimEnd().replace(/,\s*$/, '') + ',\n' + newEntries;

            projectContent = projectContent.replace(
                /90BD9B6A2C06907D000DEBAB \/\* Resources \*\/ = \{[\s\S]*?files = \(([\s\S]*?)\);/,
                `90BD9B6A2C06907D000DEBAB /* Resources */ = {\n\t\t\tisa = PBXResourcesBuildPhase;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = (${updatedFilesSection}\n\t\t\t);`
            );
        }

        // Step 3: Add languages to knownRegions
        const knownRegionsRegex = /knownRegions = \(([\s\S]*?)\);/;
        const match = projectContent.match(knownRegionsRegex);

        if (match) {
            const currentRegions = match[1];
            let regionsArray = currentRegions
                .split(',')
                .map(r => r.trim())
                .filter(r => r.length > 0);

            const addedLanguages = [];
            languages.forEach(lang => {
                if (!regionsArray.includes(lang)) {
                    regionsArray.push(lang);
                    addedLanguages.push(lang);
                }
            });

            if (addedLanguages.length > 0) {
                const newRegionsString = regionsArray
                    .map(r => `\t\t\t\t${r}`)
                    .join(',\n');
                const newKnownRegions = `knownRegions = (\n${newRegionsString},\n\t\t\t);`;

                projectContent = projectContent.replace(knownRegionsRegex, newKnownRegions);
                console.log(`  📝 Added to knownRegions: ${addedLanguages.join(', ')}`);
            }
        }

        // Write final project file
        fs.writeFileSync(projPath, projectContent, 'utf8');

        console.log('\n✅ iOS localization complete!');
        console.log(`   Languages: ${languages.join(', ')}`);
        console.log(`   Variant groups: ${Object.keys(stringsFilesByName).length}`);
        console.log('   Check: Xcode → Project → Info → Localizations\n');

    } catch (error) {
        console.log('⚠️  Error:', error.message);
        console.error(error);
    }
};
