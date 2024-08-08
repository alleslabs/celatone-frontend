import { useToast } from "@chakra-ui/react";

import { useTierConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useAccountStore, useContractStore } from "lib/providers/store";
import type { BechAddr, BechAddr32, LVPair, Option } from "lib/types";

import { useFormatAddresses } from "./useFormatAddresses";
import { useUserKey } from "./useUserKey";

interface UseHandleContractSaveProps {
  title: string;
  contractAddress: BechAddr32;
  label: string;
  codeId: Option<number>;
  instantiator: Option<BechAddr>;
  name?: string;
  description?: string;
  tags?: string[];
  lists?: LVPair[];
  actions?: () => void;
}

interface UseHandleAccountSaveProps {
  title: string;
  address: BechAddr;
  name: string;
  description?: string;
  actions?: () => void;
}

export const useHandleContractSave = ({
  title,
  contractAddress,
  label,
  codeId,
  instantiator,
  name,
  description,
  tags,
  lists,
  actions,
}: UseHandleContractSaveProps) => {
  const toast = useToast();
  const userKey = useUserKey();
  const { isFullTier } = useTierConfig();
  const { updateContractLocalInfo } = useContractStore();
  // TODO: optimize to take name, description, tags, lists, actions only here
  return (inputName?: string) => {
    updateContractLocalInfo(
      userKey,
      contractAddress,
      label,
      isFullTier ? codeId : undefined,
      instantiator,
      inputName ?? name,
      description,
      tags,
      lists
    );

    actions?.();

    toast({
      title,
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
    });
  };
};

export const useHandleAccountSave = ({
  title,
  address,
  name,
  description,
  actions,
}: UseHandleAccountSaveProps) => {
  const toast = useToast();
  const { updateAccountLocalInfo } = useAccountStore();
  const formatAddresses = useFormatAddresses();

  return (inputName?: string) => {
    const { address: bech32Address } = formatAddresses(address);
    updateAccountLocalInfo(bech32Address, inputName ?? name, description);

    actions?.();

    toast({
      title,
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
    });
  };
};
