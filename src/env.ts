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

export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
