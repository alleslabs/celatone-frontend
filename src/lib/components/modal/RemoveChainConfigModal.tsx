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
        icon: <CustomIcon name="check-circle-solid" color="success.main" />,
      });
    }, 1000);
  };

  return (
    <ActionModal
      title={`Removed \u2018${chainConfig?.prettyName}\u2019?`}
      icon="delete-solid"
      iconColor="error.light"
      trigger={trigger}
      mainBtnTitle="Yes, Remove it"
      mainVariant="error"
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
