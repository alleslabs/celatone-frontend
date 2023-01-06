import { Icon, useToast } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

import type { ContractAddr, Option } from "lib/types";

import { useContractStore } from "./store";
import { useUserKey } from "./useUserKey";

interface UseHandleContractSaveProps {
  title: string;
  contractAddress: ContractAddr;
  instantiator: string;
  label: string;
  created: Date | undefined;
  name?: string;
  description?: string;
  tags?: string[];
  lists?: Option[];
  actions?: () => void;
}

export const useHandleContractSave = ({
  title,
  contractAddress,
  instantiator,
  label,
  created,
  name,
  description,
  tags,
  lists,
  actions,
}: UseHandleContractSaveProps) => {
  const toast = useToast();
  const userKey = useUserKey();
  const { updateContractInfo } = useContractStore();
  // TODO: optimize to take name, description, tags, lists, actions only here
  return (inputName?: string) => {
    updateContractInfo(
      userKey,
      contractAddress,
      instantiator,
      label,
      created,
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
