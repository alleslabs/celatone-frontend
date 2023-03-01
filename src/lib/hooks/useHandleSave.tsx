import { Icon, useToast } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

import { useContractStore } from "lib/providers/store";
import type { Addr, ContractAddr, LVPair, Option } from "lib/types";

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
      icon: (
        <Icon
          as={MdCheckCircle}
          color="success.main"
          boxSize="6"
          display="flex"
          alignItems="center"
        />
      ),
    });
  };
};
