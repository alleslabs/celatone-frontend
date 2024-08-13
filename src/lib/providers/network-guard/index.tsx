import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { useCelatoneApp, useChainConfigs } from "lib/app-provider";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { DEFAULT_ADDRESS } from "lib/data";
import {
  useAccountStore,
  useCodeStore,
  useContractStore,
  useNetworkStore,
  usePublicProjectStore,
  useVerifyModuleStore,
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
  const { chainConfigs } = useChainConfigs();
  const { setAccountUserKey, isAccountUserKeyExist } = useAccountStore();
  const { setCodeUserKey, isCodeUserKeyExist } = useCodeStore();
  const { setContractUserKey, isContractUserKeyExist } = useContractStore();
  const { setNetworkUserKey, isNetworkUserKeyExist } = useNetworkStore();
  const { setProjectUserKey, isProjectUserKeyExist } = usePublicProjectStore();
  const { setVerifyModuleUserKey, isVerifyModuleUserKeyExist } =
    useVerifyModuleStore();

  useEffect(() => {
    if (isHydrated) {
      const userKey = formatUserKey(registryChainName, DEFAULT_ADDRESS);
      setAccountUserKey(userKey);
      setCodeUserKey(userKey);
      setContractUserKey(userKey);
      setProjectUserKey(userKey);
      setVerifyModuleUserKey(userKey);

      setNetworkUserKey(DEFAULT_ADDRESS);
    }
  }, [
    isHydrated,
    registryChainName,
    setAccountUserKey,
    setCodeUserKey,
    setContractUserKey,
    setNetworkUserKey,
    setProjectUserKey,
    setVerifyModuleUserKey,
  ]);

  if (isHydrated && !(currentChainId in chainConfigs))
    return <NetworkErrorState />;

  if (
    !isHydrated ||
    !isAccountUserKeyExist() ||
    !isCodeUserKeyExist() ||
    !isContractUserKeyExist() ||
    !isNetworkUserKeyExist() ||
    !isProjectUserKeyExist() ||
    !isVerifyModuleUserKeyExist()
  )
    return <LoadingOverlay />;

  return <>{children}</>;
});
