import { useToast } from "@chakra-ui/react";
import { useMemo } from "react";

import { useConvertHexAddress, useValidateAddress } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useAccountStore, useContractStore } from "lib/providers/store";
import type { Addr, ContractAddr, HexAddr, LVPair, Option } from "lib/types";

import { useUserKey } from "./useUserKey";

interface UseHandleContractSaveProps {
  title: string;
  contractAddress: ContractAddr;
  instantiator: Option<Addr>;
  label: string;
  name?: string;
  description?: string;
  tags?: string[];
  lists?: LVPair[];
  actions?: () => void;
}

interface UseHandleAccountSaveProps {
  title: string;
  address: Addr;
  name: string;
  description?: string;
  actions?: () => void;
}

export const useHandleContractSave = ({
  title,
  contractAddress,
  instantiator,
  label,
  name,
  description,
  tags,
  lists,
  actions,
}: UseHandleContractSaveProps) => {
  const toast = useToast();
  const userKey = useUserKey();
  const { updateContractLocalInfo } = useContractStore();
  // TODO: optimize to take name, description, tags, lists, actions only here
  return (inputName?: string) => {
    updateContractLocalInfo(
      userKey,
      contractAddress,
      instantiator,
      label,
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
  const { validateHexWalletAddress, validateHexModuleAddress } =
    useValidateAddress();
  const { convertHexWalletAddress, convertHexModuleAddress } =
    useConvertHexAddress();

  const bech32Address = useMemo(() => {
    if (validateHexWalletAddress(address))
      return convertHexWalletAddress(address as HexAddr);
    if (validateHexModuleAddress(address))
      return convertHexModuleAddress(address as HexAddr);
    return address;
  }, [
    address,
    convertHexModuleAddress,
    convertHexWalletAddress,
    validateHexModuleAddress,
    validateHexWalletAddress,
  ]);

  return (inputName?: string) => {
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
