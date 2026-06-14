export const ATTRIBUTION_CODE = '[ATTRIBUTION_CODE]';
export const BUILDER_CODE = '[BUILDER_CODE]';

// A generic example suffix (version 0x07 + ASCII 'baseapp' + 8021 padding)
// IMPORTANT: Replace this with the exact encoded suffix from base.dev 
// -> Settings -> Builder Code.
export const BUILDER_SUFFIX = '0x07626173656170700080218021802180218021802180218021';

/**
 * ERC-8021 Transaction Attribution
 * https://eips.ethereum.org/EIPS/eip-8021
 * Appends the standard builder suffix to transaction calldata.
 */
export function buildAttributedTransactionData(calldata: string): string {
  // Concat standard fallback if standard 0x prefixed hex
  const cleanCallData = calldata.startsWith('0x') ? calldata : `0x${calldata}`;
  const cleanSuffix = BUILDER_SUFFIX.startsWith('0x') ? BUILDER_SUFFIX.slice(2) : BUILDER_SUFFIX;
  
  return `${cleanCallData}${cleanSuffix}`;
}

export function getCapabilities() {
  return {
    dataSuffix: {
      value: BUILDER_SUFFIX,
      optional: true,
    }
  };
}
