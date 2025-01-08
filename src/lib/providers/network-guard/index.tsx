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
  useMoveVerifyTaskStore,
  usePublicProjectStore,
} from "lib/providers/store";
import { formatUserKey } from "lib/utils";

import { NetworkErrorState } from "./NetworkErrorState";

interface NetworkGuardProps {
  children: ReactNode;
}

export const NetworkGuard = observer(({ children }: NetworkGuardProps) => {
  const {
    chainConfig: { registryChainName },
    currentChainId,
    isHydrated,
  } = useCelatoneApp();

  const { chainConfigs, isLoading } = useChainConfigs();
  const { isAccountUserKeyExist, setAccountUserKey } = useAccountStore();
  const { isCodeUserKeyExist, setCodeUserKey } = useCodeStore();
  const { isContractUserKeyExist, setContractUserKey } = useContractStore();
  const { isProjectUserKeyExist, setProjectUserKey } = usePublicProjectStore();
  const { isMoveVerifyTaskUserKeyExist, setMoveVerifyTaskUserKey } =
    useMoveVerifyTaskStore();

  useEffect(() => {
    if (isHydrated) {
      const userKey = formatUserKey(registryChainName, DEFAULT_ADDRESS);
      setAccountUserKey(userKey);
      setCodeUserKey(userKey);
      setContractUserKey(userKey);
      setProjectUserKey(userKey);
      setMoveVerifyTaskUserKey(userKey);
    }
  }, [
    isHydrated,
    registryChainName,
    setAccountUserKey,
    setCodeUserKey,
    setContractUserKey,
    setProjectUserKey,
    setMoveVerifyTaskUserKey,
  ]);

  if (
    isLoading ||
    !isHydrated ||
    !isAccountUserKeyExist() ||
    !isCodeUserKeyExist() ||
    !isContractUserKeyExist() ||
    !isProjectUserKeyExist() ||
    !isMoveVerifyTaskUserKeyExist()
  )
    return <LoadingOverlay />;

  if (!(currentChainId in chainConfigs)) return <NetworkErrorState />;

  return <>{children}</>;
});
