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
  usePublicProjectStore,
  useVerifyModuleTaskStore,
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

  const { chainConfigs, isLoading } = useChainConfigs();
  const { setAccountUserKey, isAccountUserKeyExist } = useAccountStore();
  const { setCodeUserKey, isCodeUserKeyExist } = useCodeStore();
  const { setContractUserKey, isContractUserKeyExist } = useContractStore();
  const { setProjectUserKey, isProjectUserKeyExist } = usePublicProjectStore();
  const { setVerifyModuleTaskUserKey, isVerifyModuleTaskUserKeyExist } =
    useVerifyModuleTaskStore();

  useEffect(() => {
    if (isHydrated) {
      const userKey = formatUserKey(registryChainName, DEFAULT_ADDRESS);
      setAccountUserKey(userKey);
      setCodeUserKey(userKey);
      setContractUserKey(userKey);
      setProjectUserKey(userKey);
      setVerifyModuleTaskUserKey(userKey);
    }
  }, [
    isHydrated,
    registryChainName,
    setAccountUserKey,
    setCodeUserKey,
    setContractUserKey,
    setProjectUserKey,
    setVerifyModuleTaskUserKey,
  ]);

  if (
    isLoading ||
    !isHydrated ||
    !isAccountUserKeyExist() ||
    !isCodeUserKeyExist() ||
    !isContractUserKeyExist() ||
    !isProjectUserKeyExist() ||
    !isVerifyModuleTaskUserKeyExist()
  )
    return <LoadingOverlay />;

  if (!(currentChainId in chainConfigs)) return <NetworkErrorState />;

  return <>{children}</>;
});
