import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { useCelatoneApp } from "lib/app-provider";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { DEFAULT_ADDRESS } from "lib/data";
import {
  useAccountStore,
  useCodeStore,
  useContractStore,
  usePublicProjectStore,
} from "lib/providers/store";
import { formatUserKey } from "lib/utils";

import { NetworkErrorState } from "./NetworkErrorState";

interface NetworkGuardProps {
  children: ReactNode;
}

export const NetworkGuard = observer(({ children }: NetworkGuardProps) => {
  const {
    isHydrated,
    currentChainId,
    chainConfig: { registryChainName },
  } = useCelatoneApp();
  const { setAccountUserKey, isAccountUserKeyExist } = useAccountStore();
  const { setCodeUserKey, isCodeUserKeyExist } = useCodeStore();
  const { setContractUserKey, isContractUserKeyExist } = useContractStore();
  const { setProjectUserKey, isProjectUserKeyExist } = usePublicProjectStore();

  useEffect(() => {
    if (isHydrated) {
      const userKey = formatUserKey(registryChainName, DEFAULT_ADDRESS);
      setAccountUserKey(userKey);
      setCodeUserKey(userKey);
      setContractUserKey(userKey);
      setProjectUserKey(userKey);
    }
  }, [
    isHydrated,
    registryChainName,
    setAccountUserKey,
    setCodeUserKey,
    setContractUserKey,
    setProjectUserKey,
  ]);

  if (isHydrated && !(currentChainId in CHAIN_CONFIGS))
    return <NetworkErrorState />;

  if (
    !isHydrated ||
    !isAccountUserKeyExist() ||
    !isCodeUserKeyExist() ||
    !isContractUserKeyExist() ||
    !isProjectUserKeyExist()
  )
    return <LoadingOverlay />;

  return <>{children}</>;
});
