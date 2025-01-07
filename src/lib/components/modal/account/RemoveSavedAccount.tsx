import {
  chakra,
  Highlight,
  IconButton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useCallback } from "react";

import { ActionModal } from "../ActionModal";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { useAccountStore } from "lib/providers/store";
import type { AccountLocalInfo } from "lib/stores/account";
import { truncate } from "lib/utils";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    alignItems: "center",
    borderRadius: "36px",
    display: "flex",
    fontSize: "22px",
  },
});

interface RemoveSavedAccountModalProps {
  accountLocalInfo: AccountLocalInfo;
  trigger?: JSX.Element;
}

export function RemoveSavedAccountModal({
  accountLocalInfo,
  trigger = (
    <StyledIconButton
      aria-label="button"
      variant="ghost-gray"
      icon={<CustomIcon name="delete" />}
    />
  ),
}: RemoveSavedAccountModalProps) {
  const toast = useToast();
  const { removeSavedAccount } = useAccountStore();
  const displayName =
    accountLocalInfo.name ?? truncate(accountLocalInfo.address);

  const handleRemove = useCallback(() => {
    removeSavedAccount(accountLocalInfo.address);

    toast({
      duration: 5000,
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
      isClosable: false,
      position: "bottom-right",
      status: "success",
      title: `Removed \u2018${displayName}\u2019 from Saved Accounts`,
    });
  }, [accountLocalInfo.address, displayName, removeSavedAccount, toast]);

  return (
    <ActionModal
      mainBtnTitle="Yes, Remove It"
      mainVariant="error"
      title={`Remove account \u2018${displayName}\u2019?`}
      trigger={trigger}
      icon="delete"
      iconColor="error.light"
      mainAction={() => {
        track(AmpEvent.ACCOUNT_REMOVE);
        handleRemove();
      }}
      otherBtnTitle="No, Keep It"
    >
      <Text>
        <Highlight
          styles={{ color: "inherit", fontWeight: "bold" }}
          query={[displayName, "Saved Accounts"]}
        >
          {`This action will remove \u2018${displayName}\u2019 from Saved Accounts. 
          You can save this address again later, but you will need to add its new account name and description.`}
        </Highlight>
      </Text>
    </ActionModal>
  );
}
