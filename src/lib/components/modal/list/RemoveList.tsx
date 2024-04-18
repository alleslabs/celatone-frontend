import type { MenuItemProps } from "@chakra-ui/react";
import { MenuItem, Text, useToast } from "@chakra-ui/react";

import { ActionModal } from "../ActionModal";
import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useUserKey } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
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
    track(AmpEvent.LIST_REMOVE);
    removeList(userKey, list.value);
    navigate({ pathname: "/contract-lists" });
    // TODO: show toast after removed and redirect to /contract-lists
    setTimeout(() => {
      toast({
        title: `Removed '${shortenName(list.label)}'`,
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
      title={`Remove ${shortenName(list.label)}?`}
      icon="delete-solid"
      iconColor="error.light"
      trigger={<MenuItem {...menuItemProps} as="button" />}
      mainBtnTitle="Yes, Remove list"
      mainVariant="error"
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
