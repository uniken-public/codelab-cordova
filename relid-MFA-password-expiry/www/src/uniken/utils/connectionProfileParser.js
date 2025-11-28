/**
 * Connection Profile Parser
 *
 * Utilities for loading and parsing REL-ID connection profile (agent_info.json).
 * Uses cordova-plugin-file for reliable file loading in Cordova environment.
 *
 * @typedef {Object} RelId
 * @property {string} Name
 * @property {string} RelId
 *
 * @typedef {Object} Profile
 * @property {string} Name
 * @property {string} Host
 * @property {string|number} Port - Allow both string and number from JSON
 *
 * @typedef {Object} AgentInfo
 * @property {RelId[]} RelIds
 * @property {Profile[]} Profiles
 *
 * @typedef {Object} ParsedAgentInfo
 * @property {string} relId
 * @property {string} host
 * @property {number} port
 */

/**
 * Parses agent info data and extracts connection profile
 * @param {AgentInfo} profileData - Raw agent info data
 * @returns {ParsedAgentInfo} Parsed connection profile
 */
function parseAgentInfo(profileData) {
  if (!profileData.RelIds || profileData.RelIds.length === 0) {
    throw new Error('No RelIds found in agent info');
  }

  if (!profileData.Profiles || profileData.Profiles.length === 0) {
    throw new Error('No Profiles found in agent info');
  }

  // Always pick the first array objects
  const firstRelId = profileData.RelIds[0];

  if (!firstRelId.Name || !firstRelId.RelId) {
    throw new Error('Invalid RelId object - missing Name or RelId');
  }

  // Find matching profile by Name (1-1 mapping)
  const matchingProfile = profileData.Profiles.find(
    profile => profile.Name === firstRelId.Name
  );

  if (!matchingProfile) {
    throw new Error(`No matching profile found for RelId name: ${firstRelId.Name}`);
  }

  if (!matchingProfile.Host || !matchingProfile.Port) {
    throw new Error('Invalid Profile object - missing Host or Port');
  }

  // Convert port to number if it's a string
  const port = typeof matchingProfile.Port === 'string'
    ? parseInt(matchingProfile.Port, 10)
    : matchingProfile.Port;

  if (isNaN(port)) {
    throw new Error(`Invalid port value: ${matchingProfile.Port}`);
  }

  return {
    relId: firstRelId.RelId,
    host: matchingProfile.Host,
    port: port
  };
}

/**
 * Loads agent info from file using cordova-plugin-file
 *
 * CRITICAL: Uses cordova-plugin-file because standard fetch() and XMLHttpRequest
 * do NOT work with file:// URLs in Cordova iOS WKWebView.
 *
 * @returns {Promise<ParsedAgentInfo>} Promise that resolves with parsed agent info
 */
async function loadAgentInfo() {
  return new Promise((resolve, reject) => {
    try {
      // cordova.file.applicationDirectory points to the app bundle (read-only)
      const basePath = cordova.file.applicationDirectory + 'www/';
      const filePath = basePath + 'src/uniken/cp/agent_info.json';

      console.log('ConnectionProfileParser - Loading file from:', filePath);

      // Resolve file path and read with FileReader
      window.resolveLocalFileSystemURL(
        filePath,
        (fileEntry) => {
          fileEntry.file(
            (file) => {
              const reader = new FileReader();

              reader.onloadend = function() {
                try {
                  console.log('ConnectionProfileParser - File read successfully');
                  const profileData = JSON.parse(this.result);
                  const parsed = parseAgentInfo(profileData);
                  resolve(parsed);
                } catch (error) {
                  console.error('ConnectionProfileParser - Failed to parse JSON:', error);
                  reject(new Error(`Failed to parse agent info: ${error.message}`));
                }
              };

              reader.onerror = (error) => {
                console.error('ConnectionProfileParser - FileReader error:', error);
                reject(new Error(`Failed to read file: ${error.message}`));
              };

              reader.readAsText(file);
            },
            (error) => {
              console.error('ConnectionProfileParser - Failed to get file:', error);
              reject(new Error(`Failed to access file: ${error.message}`));
            }
          );
        },
        (error) => {
          console.error('ConnectionProfileParser - Failed to resolve file path:', error);
          reject(new Error(`Failed to resolve file path: ${error.message}`));
        }
      );
    } catch (error) {
      console.error('ConnectionProfileParser - Unexpected error:', error);
      reject(new Error(`Failed to load agent info: ${error.message}`));
    }
  });
}
