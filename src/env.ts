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

export const CELATONE_API_OVERRIDE =
  process.env.NEXT_PUBLIC_CELATONE_API_OVERRIDE;

export const CELATONE_VERIFICATION_API =
  process.env.NEXT_PUBLIC_CELATONE_VERIFICATION_API ?? "";

export const INITIA_MOVE_DECODER =
  process.env.NEXT_PUBLIC_INITIA_MOVE_DECODER ?? "";

export const INITIA_USERNAME_MODULE_ADDRESS =
  process.env.NEXT_PUBLIC_INITIA_USERNAME_MODULE_ADDRESS ?? "";

export const INITIA_USERNAME_LCD =
  process.env.NEXT_PUBLIC_INITIA_USERNAME_LCD ?? "";
