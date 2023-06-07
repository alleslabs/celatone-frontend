export const SUPPORTED_CHAIN_IDS: string[] = (() => {
  const chainIds = process.env.NEXT_PUBLIC_SUPPORTED_CHAIN_IDS?.split(",");
  if (!chainIds)
    throw new Error("NEXT_PUBLIC_SUPPORTED_CHAIN_IDS is undefined");

  if (chainIds[0].trim().length === 0)
    throw new Error(
      "NEXT_PUBLIC_SUPPORTED_CHAIN_IDS is not valid. Please include at least one chain identifier. For instance, NEXT_PUBLIC_SUPPORTED_CHAIN_IDS=osmo-test-5"
    );

  return chainIds;
})();

// Remark: We've already checked that the first element is not empty on the above code
export const DEFAULT_SUPPORTED_CHAIN_ID = SUPPORTED_CHAIN_IDS[0];

export const DUMMY_MNEMONIC = process.env.NEXT_PUBLIC_DUMMY_MNEMONIC;
