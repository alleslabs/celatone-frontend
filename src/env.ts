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
export const FALLBACK_SUPPORTED_CHAIN_ID = SUPPORTED_CHAIN_IDS[0];

export const DUMMY_MNEMONIC = (() => {
  const mnemonic = process.env.NEXT_PUBLIC_DUMMY_MNEMONIC;
  if (!mnemonic)
    throw new Error(
      "NEXT_PUBLIC_DUMMY_MNEMONIC is empty. Please include a valid mnemonic."
    );

  return mnemonic;
})();

export const CELATONE_API_OVERRIDE =
  process.env.NEXT_PUBLIC_CELATONE_API_OVERRIDE;

export const HASURA_ADMIN_SECRET =
  process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET ?? "";

export const INITIA_MOVE_DECODER =
  process.env.NEXT_PUBLIC_INITIA_MOVE_DECODER ?? "";

export const INITIA_MOVE_VERIFIER =
  process.env.NEXT_PUBLIC_INITIA_MOVE_VERIFIER ?? "";
