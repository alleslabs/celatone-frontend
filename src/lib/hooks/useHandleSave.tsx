import type { BechAddr, BechAddr32, LVPair, Option } from "lib/types";

import { useToast } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { useAccountStore, useContractStore } from "lib/providers/store";

import { useFormatAddresses } from "./useFormatAddresses";

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
  actions,
  codeId,
  contractAddress,
  description,
  instantiator,
  label,
  lists,
  name,
  tags,
  title,
}: UseHandleContractSaveProps) => {
  const toast = useToast();
  const { updateContractLocalInfo } = useContractStore();
  // TODO: optimize to take name, description, tags, lists, actions only here
  return (inputName?: string) => {
    updateContractLocalInfo(
      contractAddress,
      label,
      codeId,
      instantiator,
      inputName ?? name,
      description,
      tags,
      lists
    );

    actions?.();

    toast({
      duration: 5000,
      icon: <CustomIcon color="success.main" name="check-circle-solid" />,
      isClosable: false,
      position: "bottom-right",
      status: "success",
      title,
    });
  };
};

export const useHandleAccountSave = ({
  actions,
  address,
  description,
  name,
  title,
}: UseHandleAccountSaveProps) => {
  const toast = useToast();
  const { updateAccountLocalInfo } = useAccountStore();
  const formatAddresses = useFormatAddresses();

  return (inputName?: string) => {
    const { address: bech32Address } = formatAddresses(address);
    updateAccountLocalInfo(bech32Address, inputName ?? name, description);

    actions?.();

    toast({
      duration: 5000,
      icon: <CustomIcon color="success.main" name="check-circle-solid" />,
      isClosable: false,
      position: "bottom-right",
      status: "success",
      title,
    });
  };
};
