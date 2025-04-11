import type { MenuItemProps } from "@chakra-ui/react";
import type { LVPair } from "lib/types";

import { MenuItem, Text, useToast } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useContractStore } from "lib/providers/store";
import { shortenName } from "lib/utils";

import { ActionModal } from "../ActionModal";

interface RemoveListModalProps {
  list: LVPair;
  menuItemProps: MenuItemProps;
}

export function RemoveListModal({ list, menuItemProps }: RemoveListModalProps) {
  const { removeList } = useContractStore();
  const toast = useToast();
  const navigate = useInternalNavigate();
  const handleRemove = () => {
    track(AmpEvent.LIST_REMOVE);
    removeList(list.value);
    navigate({ pathname: "/contract-lists" });
    // TODO: show toast after removed and redirect to /contract-lists
    setTimeout(() => {
      toast({
        title: `Removed '${shortenName(list.label)}'`,
        status: "success",
        duration: 5000,
        isClosable: false,
        position: "bottom-right",
        icon: <CustomIcon color="success.main" name="check-circle-solid" />,
      });
    }, 1000);
  };

  return (
    <ActionModal
      icon="delete"
      iconColor="error.light"
      mainAction={handleRemove}
      mainBtnTitle="Yes, remove list"
      mainVariant="error"
      otherBtnTitle="No, keep it"
      title={`Remove ${shortenName(list.label)}?`}
      trigger={<MenuItem {...menuItemProps} as="button" />}
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
