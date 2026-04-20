/**
 * Progress Helper Utilities
 *
 * Simple utility functions for handling progress messages.
 * Extracted from reference implementation for reusability.
 *
 * @typedef {Object} RDNAProgressData
 * @property {string} systemThreatCheckStatus
 * @property {string} appThreatCheckStatus
 * @property {string} networkThreatCheckStatus
 * @property {string} initializeStatus
 */

/**
 * Progress Message Helper - Extracted from reference implementation
 * @param {RDNAProgressData} data - Progress data from SDK
 * @returns {string} User-friendly progress message
 */
function getProgressMessage(data) {
  const { systemThreatCheckStatus, appThreatCheckStatus, networkThreatCheckStatus, initializeStatus } = data;

  // Helper function to get user-friendly status text
  const getStatusText = (status) => {
    switch (status) {
      case 'STARTED':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      case 'NOT_STARTED':
        return 'Pending';
      case 'NOT_APPLICABLE':
        return 'Not Required';
      case 'INIT_FAILED':
        return 'Failed';
      default:
        return status;
    }
  };

  // Check for any failed statuses first
  if (initializeStatus === 'INIT_FAILED') {
    return 'Initialization failed - Please check logs';
  }

  // Primary status based on initializeStatus
  let primaryMessage = '';
  switch (initializeStatus) {
    case 'STARTED':
      primaryMessage = 'RDNA initialization started...';
      break;
    case 'COMPLETED':
      primaryMessage = 'RDNA initialization completed!';
      break;
    case 'NOT_STARTED':
      primaryMessage = 'Waiting to start initialization...';
      break;
    case 'NOT_APPLICABLE':
      primaryMessage = 'Initialization not required';
      break;
    default:
      primaryMessage = `Initialization: ${getStatusText(initializeStatus)}`;
  }

  // Build detailed status for threat checks
  const threatChecks = [];

  if (systemThreatCheckStatus && systemThreatCheckStatus !== 'NOT_APPLICABLE') {
    threatChecks.push(`System Threat Checks: ${getStatusText(systemThreatCheckStatus)}`);
  }

  if (appThreatCheckStatus && appThreatCheckStatus !== 'NOT_APPLICABLE') {
    threatChecks.push(`App Threat Checks: ${getStatusText(appThreatCheckStatus)}`);
  }

  if (networkThreatCheckStatus && networkThreatCheckStatus !== 'NOT_APPLICABLE') {
    threatChecks.push(`Network Threat Checks: ${getStatusText(networkThreatCheckStatus)}`);
  }

  // Combine primary message with threat check details
  if (threatChecks.length > 0) {
    return `${primaryMessage}\n${threatChecks.join(' • ')}`;
  }

  return primaryMessage;
}
