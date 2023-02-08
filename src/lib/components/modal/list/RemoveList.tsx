import type { MenuItemProps } from "@chakra-ui/react";
import { MenuItem, useToast, Icon, Text } from "@chakra-ui/react";
import { MdDeleteForever, MdCheckCircle } from "react-icons/md";

import { useInternalNavigate } from "lib/app-provider";
import { ActionModal } from "lib/components/modal/ActionModal";
import { useContractStore, useUserKey } from "lib/hooks";
import type { LVPair } from "lib/types";
import { shortenName } from "lib/utils";

interface RemoveListModalProps {
  list: LVPair;
  menuItemProps: MenuItemProps;
}

export function RemoveListModal({ list, menuItemProps }: RemoveListModalProps) {
  const userKey = useUserKey();
  const { removeList } = useContractStore();

  const toast = useToast();
  const navigate = useInternalNavigate();
  const handleRemove = () => {
    removeList(userKey, list.value);
    navigate({ pathname: "/contract-list" });
    // TODO: show toast after removed and redirect to /contract-list
    setTimeout(() => {
      toast({
        title: `Removed ${shortenName(list.label)}`,
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
    }, 1000);
  };

  return (
    <ActionModal
      title={`Remove ${shortenName(list.label)}?`}
      icon={MdDeleteForever}
      iconColor="error.light"
      trigger={<MenuItem {...menuItemProps} />}
      mainBtnTitle="Yes, Remove list"
      mainAction={handleRemove}
      otherBtnTitle="No, Keep It"
    >
      <Text>
        {`This action will remove ${shortenName(
          list.label,
          20
        )} from your list permanently.`}
      </Text>
    </ActionModal>
  );
}
