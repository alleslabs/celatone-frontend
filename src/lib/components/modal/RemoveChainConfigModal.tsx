import { Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useLocalChainConfigStore, useNetworkStore } from "lib/providers/store";

import { ActionModal } from "./ActionModal";

interface RemoveChainConfigModalProps {
  chainId: string;
  trigger: ReactNode;
}

export function RemoveChainConfigModal({
  chainId,
  trigger,
}: RemoveChainConfigModalProps) {
  const { getLocalChainConfig, removeLocalChainConfig } =
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
        duration: 5000,
        icon: <CustomIcon name="check-circle-solid" color="success.main" />,
        isClosable: false,
        position: "bottom-right",
        status: "success",
        title: `Removed '${chainConfig?.prettyName}'`,
      });
    }, 1000);
  };

  return (
    <ActionModal
      mainBtnTitle="Yes, Remove it"
      mainVariant="error"
      title={`Removed \u2018${chainConfig?.prettyName}\u2019?`}
      trigger={trigger}
      icon="delete"
      iconColor="error.light"
      mainAction={handleRemove}
      otherBtnTitle="No, Keep It"
    >
      <Text>
        All information about your Minitia will be lost and can&lsquo;t be
        recovered. You can save this address again later, but you will need to
        add its new address name.
      </Text>
    </ActionModal>
  );
}
