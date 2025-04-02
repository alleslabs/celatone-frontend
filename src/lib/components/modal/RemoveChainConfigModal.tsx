import type { ReactNode } from "react";

import { Text, useToast } from "@chakra-ui/react";
import { useCelatoneApp } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useLocalChainConfigStore, useNetworkStore } from "lib/providers/store";
import { useRouter } from "next/router";

import { ActionModal } from "./ActionModal";

interface RemoveChainConfigModalProps {
  chainId: string;
  trigger: ReactNode;
}

export function RemoveChainConfigModal({
  chainId,
  trigger,
}: RemoveChainConfigModalProps) {
  const { removeLocalChainConfig, getLocalChainConfig } =
    useLocalChainConfigStore();
  const { removeNetwork } = useNetworkStore();
  const router = useRouter();
  const { currentChainId } = useCelatoneApp();

  const chainConfig = getLocalChainConfig(chainId);

  const toast = useToast();
  const handleRemove = () => {
    // redirect to home page
    router.push(currentChainId === chainId ? "/" : `/${currentChainId}`);

    // remove chain id from chain config store
    removeLocalChainConfig(chainId);

    // remove chain id from pinned network
    removeNetwork(chainId);

    setTimeout(() => {
      toast({
        title: `Removed '${chainConfig?.prettyName}'`,
        status: "success",
        duration: 5000,
        isClosable: false,
        position: "bottom-right",
        icon: <CustomIcon color="success.main" name="check-circle-solid" />,
      });
    }, 1000);
  };

  return (
    <ActionModal
      icon="delete"
      iconColor="error.light"
      mainAction={handleRemove}
      mainBtnTitle="Yes, Remove it"
      mainVariant="error"
      otherBtnTitle="No, Keep It"
      title={`Removed \u2018${chainConfig?.prettyName}\u2019?`}
      trigger={trigger}
    >
      <Text>
        All information about your Rollup will be lost and can&lsquo;t be
        recovered. You can save this address again later, but you will need to
        add its new address name.
      </Text>
    </ActionModal>
  );
}
