/**
 * Password Policy Utilities
 *
 * This utility module provides functions for parsing and generating user-friendly
 * password policy messages from REL-ID SDK password policy responses.
 *
 * @typedef {Object} PasswordPolicy
 * @property {number} minL - Minimum length
 * @property {number} maxL - Maximum length
 * @property {number} minDg - Minimum digits
 * @property {number} minUc - Minimum uppercase letters
 * @property {number} minLc - Minimum lowercase letters
 * @property {number} minSc - Minimum special characters
 * @property {string} charsNotAllowed - Characters that are not allowed
 * @property {number} Repetition - Max allowed repeated characters
 * @property {boolean} UserIDcheck - Whether User ID should not be included
 * @property {string} SeqCheck - Disallow sequential characters
 * @property {string} BlackListedCommonPassword - If it should not be a common password
 * @property {string} [msg] - Optional message from server
 * @property {boolean} [SDKValidation] - SDK validation flag
 */

/**
 * Generates a user-friendly password policy message
 * @param {PasswordPolicy} policy - The parsed password policy object
 * @returns {string} A user-friendly message describing the password requirements
 */
function generatePasswordPolicyMessage(policy) {
  // Check if there's a valid message from the server
  if (policy.msg && policy.msg.trim() !== '' && policy.msg !== 'Invalid password policy') {
    return policy.msg;
  }

  // Generate user-friendly message from policy fields
  const requirements = [];

  // Length requirements
  if (policy.minL > 0 && policy.maxL > 0) {
    if (policy.minL === policy.maxL) {
      requirements.push(`Must be exactly ${policy.minL} characters long`);
    } else {
      requirements.push(`Must be between ${policy.minL} and ${policy.maxL} characters long`);
    }
  } else if (policy.minL > 0) {
    requirements.push(`Must be at least ${policy.minL} characters long`);
  } else if (policy.maxL > 0) {
    requirements.push(`Must be no more than ${policy.maxL} characters long`);
  }

  // Character type requirements
  if (policy.minDg > 0) {
    requirements.push(`Must contain at least ${policy.minDg} digit${policy.minDg > 1 ? 's' : ''}`);
  }

  if (policy.minUc > 0) {
    requirements.push(`Must contain at least ${policy.minUc} uppercase letter${policy.minUc > 1 ? 's' : ''}`);
  }

  if (policy.minLc > 0) {
    requirements.push(`Must contain at least ${policy.minLc} lowercase letter${policy.minLc > 1 ? 's' : ''}`);
  }

  if (policy.minSc > 0) {
    requirements.push(`Must contain at least ${policy.minSc} special character${policy.minSc > 1 ? 's' : ''}`);
  }

  // Restrictions
  if (policy.charsNotAllowed && policy.charsNotAllowed.trim() !== '') {
    requirements.push(`Cannot contain these characters: ${policy.charsNotAllowed}`);
  }

  if (policy.Repetition > 0) {
    requirements.push(`Cannot have more than ${policy.Repetition} repeated characters in a row`);
  }

  if (policy.UserIDcheck) {
    requirements.push('Cannot contain your username');
  }

  if (policy.SeqCheck && policy.SeqCheck.toLowerCase() === 'true') {
    requirements.push('Cannot contain sequential characters (e.g., 123, abc)');
  }

  if (policy.BlackListedCommonPassword && policy.BlackListedCommonPassword.toLowerCase() === 'true') {
    requirements.push('Cannot be a commonly used password');
  }

  // If no requirements found, return a generic message
  if (requirements.length === 0) {
    return 'Please enter a secure password';
  }

  // Format the requirements into a readable message
  if (requirements.length === 1) {
    return requirements[0];
  } else if (requirements.length === 2) {
    return `${requirements[0]} and ${requirements[1].toLowerCase()}`;
  } else {
    const lastRequirement = requirements.pop();
    return `${requirements.join(', ')}, and ${lastRequirement.toLowerCase()}`;
  }
}

/**
 * Parses a password policy JSON string and generates a user-friendly message
 * @param {string} policyJsonString - The JSON string containing password policy data
 * @returns {string} A user-friendly password policy message, or error message if parsing fails
 */
function parseAndGeneratePolicyMessage(policyJsonString) {
  try {
    const policy = JSON.parse(policyJsonString);
    return generatePasswordPolicyMessage(policy);
  } catch (error) {
    console.error('Failed to parse password policy JSON:', error);
    return 'Please enter a secure password according to your organization\'s policy';
  }
}

// Export for use in password screens
