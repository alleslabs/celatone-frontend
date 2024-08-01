import { Text, useToast } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useChainConfigStore, useNetworkStore } from "lib/providers/store";

import { ActionModal } from "./ActionModal";

interface RemoveChainConfigModalProps {
  chainId: string;
  trigger: ReactNode;
}

export function RemoveChainConfigModal({
  chainId,
  trigger,
}: RemoveChainConfigModalProps) {
  const { removeChainConfig, getChainConfig } = useChainConfigStore();
  const { removeNetwork } = useNetworkStore();
  const navigate = useInternalNavigate();

  const chainConfig = getChainConfig(chainId);

  const toast = useToast();
  const handleRemove = () => {
    // remove chain id from chain config store
    removeChainConfig(chainId);

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
      // redirect to home page
      navigate({ pathname: "/", replace: true });
    }, 1000);
  };

  return (
    <ActionModal
      title={`Removed '${chainConfig?.prettyName}'?`}
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
