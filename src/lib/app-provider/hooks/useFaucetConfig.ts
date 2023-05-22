import { useCelatoneApp } from "../contexts";

export const useFaucetConfig = () => {
  const {
    chainConfig: {
      features: { faucet },
    },
  } = useCelatoneApp();

  if (!faucet.enabled) {
    throw new Error(
      "Cannot access faucet configs when faucet feature is disabled."
    );
  }

  return faucet;
};
