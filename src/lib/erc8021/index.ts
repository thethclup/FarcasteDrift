import { encodeBuilderCodeSuffix } from '@x402/extensions/builder-code';

export const ATTRIBUTION_CODE = '[ATTRIBUTION_CODE]';
export const BUILDER_CODE = 'my_drift_app'; // Example builder code

// Generate the ERC-8021 Schema 2 suffix using the official x402 extension
export const BUILDER_SUFFIX = encodeBuilderCodeSuffix({ a: BUILDER_CODE, w: 'cdp_facil' });

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
