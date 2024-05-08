import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { useCelatoneApp } from "lib/app-provider";
import { DEFAULT_ADDRESS } from "lib/data";
import {
  useAccountStore,
  useCodeStore,
  useContractStore,
  usePublicProjectStore,
} from "lib/providers/store";
import { formatUserKey } from "lib/utils";

import { LoadingOverlay } from "./LoadingOverlay";
import { NetworkErrorState } from "./state";

interface NetworkGuardProps {
  children: ReactNode;
}

export const NetworkGuard = observer(({ children }: NetworkGuardProps) => {
  const { currentChainId, chainConfig } = useCelatoneApp();
  const { setAccountUserKey, isAccountUserKeyExist } = useAccountStore();
  const { setCodeUserKey, isCodeUserKeyExist } = useCodeStore();
  const { setContractUserKey, isContractUserKeyExist } = useContractStore();
  const { setProjectUserKey, isProjectUserKeyExist } = usePublicProjectStore();

  useEffect(() => {
    if (chainConfig.registryChainName) {
      const userKey = formatUserKey(
        chainConfig.registryChainName,
        DEFAULT_ADDRESS
      );
      setAccountUserKey(userKey);
      setCodeUserKey(userKey);
      setContractUserKey(userKey);
      setProjectUserKey(userKey);
    }
  }, [
    chainConfig.registryChainName,
    setAccountUserKey,
    setCodeUserKey,
    setContractUserKey,
    setProjectUserKey,
  ]);

  if (currentChainId && !(currentChainId in CHAIN_CONFIGS))
    return <NetworkErrorState />;

  if (
    !isAccountUserKeyExist() ||
    !isCodeUserKeyExist() ||
    !isContractUserKeyExist() ||
    !isProjectUserKeyExist()
  )
    return <LoadingOverlay />;

  return <>{children}</>;
});
