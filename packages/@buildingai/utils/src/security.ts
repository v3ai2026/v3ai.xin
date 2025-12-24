/**
 * Decrypt field value (simplified implementation)
 * @param encryptedValue Encrypted value
 * @returns Decrypted value
 */
export const decryptValue = (encryptedValue: string): string => {
    try {
        return Buffer.from(encryptedValue, "base64").toString();
    } catch {
        return encryptedValue; // Return original value if decryption fails
    }
};

/**
 * Mask sensitive value (e.g., API keys, secrets)
 * Shows first few and last few characters, masks the middle part
 * @param value Original value to mask
 * @param visiblePrefixLength Number of characters to show at the beginning (default: 4)
 * @param visibleSuffixLength Number of characters to show at the end (default: 4)
 * @param maskChar Character to use for masking (default: '*')
 * @returns Masked value
 *
 * @example
 * maskSensitiveValue('abcdefghijklmnop') // Returns 'abcd************mnop'
 * maskSensitiveValue('short') // Returns '*****'
 */
export const maskSensitiveValue = (
    value: string,
    visiblePrefixLength = 4,
    visibleSuffixLength = 4,
    maskChar = "*",
): string => {
    if (!value || value.length === 0) {
        return "";
    }

    // If value is too short, mask everything
    const minLength = visiblePrefixLength + visibleSuffixLength;
    if (value.length <= minLength) {
        return maskChar.repeat(value.length);
    }

    // Extract prefix and suffix
    const prefix = value.substring(0, visiblePrefixLength);
    const suffix = value.substring(value.length - visibleSuffixLength);

    // Calculate mask length
    const maskLength = value.length - visiblePrefixLength - visibleSuffixLength;
    const mask = maskChar.repeat(maskLength);

    return `${prefix}${mask}${suffix}`;
};
