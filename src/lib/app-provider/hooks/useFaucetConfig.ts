import { useCelatoneApp } from "../contexts";

export const useFaucetConfig = () => {
  const {
    chainConfig: {
      features: { faucet },
    },
  } = useCelatoneApp();

  return faucet;
};
