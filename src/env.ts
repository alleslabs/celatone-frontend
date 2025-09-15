export const SUPPORTED_NETWORK_TYPES =
  process.env.NEXT_PUBLIC_SUPPORTED_NETWORK_TYPES?.split(",") ?? [];

export const CHAIN = process.env.NEXT_PUBLIC_CHAIN;

export const DUMMY_MNEMONIC = (() => {
  const mnemonic = process.env.NEXT_PUBLIC_DUMMY_MNEMONIC;
  if (!mnemonic)
    throw new Error(
      "NEXT_PUBLIC_DUMMY_MNEMONIC is empty. Please include a valid mnemonic."
    );

  return mnemonic;
})();

export const SCAN_API = process.env.NEXT_PUBLIC_SCAN_API;
export const INITIA_API = process.env.NEXT_PUBLIC_INITIA_API;
export const ROUTER_API = process.env.NEXT_PUBLIC_ROUTER_API;

export const CELATONE_API = (() => {
  const url = process.env.NEXT_PUBLIC_CELATONE_API;
  if (!url)
    throw new Error(
      "NEXT_PUBLIC_CELATONE_API is empty. Please provide a valid Celatone API base URL."
    );
  return url;
})();

export const INITIA_DEX_API = process.env.NEXT_PUBLIC_INITIA_DEX_API;

export const CELATONE_VERIFICATION_API =
  process.env.NEXT_PUBLIC_CELATONE_VERIFICATION_API ?? "";

export const INITIA_MOVE_DECODER =
  process.env.NEXT_PUBLIC_INITIA_MOVE_DECODER ?? "";

export const GLYPH_API_URL = process.env.NEXT_PUBLIC_GLYPH_API_URL ?? "";
