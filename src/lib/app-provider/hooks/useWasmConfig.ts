import { useCelatoneApp } from "../contexts";

export const useWasmConfig = () => {
  const {
    chainConfig: {
      features: { wasm },
    },
  } = useCelatoneApp();

  if (!wasm.enabled) {
    throw new Error(
      "Cannot access Wasm configs when Wasm feature is disabled."
    );
  }

  return wasm;
};
