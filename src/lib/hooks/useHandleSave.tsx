import { Icon, useToast } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

import type { Option } from "lib/types";

import { useContractStore, useUserKey } from ".";

interface UseHandleContractSaveProps {
  title: string;
  address: string;
  instantiator: string;
  label: string;
  created: Date;
  name?: string;
  description?: string;
  tags?: string[];
  lists?: Option[];
  actions?: () => void;
}

export const useHandleContractSave = ({
  title,
  address,
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
  return () => {
    updateContractInfo(
      userKey,
      address,
      instantiator,
      label,
      created,
      name,
      description,
      tags,
      lists
    );

    if (actions) actions();

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
