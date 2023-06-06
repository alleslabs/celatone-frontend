import { useCelatoneApp } from "../contexts";

import { useInternalNavigate } from "./useInternalNavigate";

export const useWasmConfig = (shouldRedirect: { shouldRedirect: boolean }) => {
  const {
    chainConfig: {
      features: { wasm },
    },
  } = useCelatoneApp();
  const navigate = useInternalNavigate();

  if (!wasm.enabled && shouldRedirect)
    navigate({ pathname: "/", replace: true });

  return wasm;
};
