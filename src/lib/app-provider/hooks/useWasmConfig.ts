import { useCelatoneApp } from "../contexts";

export const useWasmConfig = () => {
  const {
    chainConfig: {
      features: { wasm },
    },
  } = useCelatoneApp();

  return wasm;
};
