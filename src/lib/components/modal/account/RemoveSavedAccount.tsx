import {
  useToast,
  Text,
  chakra,
  IconButton,
  Highlight,
} from "@chakra-ui/react";
import { useCallback } from "react";

import { ActionModal } from "../ActionModal";
import { CustomIcon } from "lib/components/icon";
import type { AccountLocalInfo } from "lib/stores/account";
import { truncate } from "lib/utils";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    borderRadius: "36px",
  },
});

interface RemoveSavedAccountModalProps {
  account: AccountLocalInfo;
  trigger?: JSX.Element;
}
export function RemoveSavedAccountModal({
  account,
  trigger = (
    <StyledIconButton
      icon={<CustomIcon name="delete" />}
      variant="ghost-gray"
    />
  ),
}: RemoveSavedAccountModalProps) {
  const toast = useToast();
  const handleRemove = useCallback(() => {
    // removeSavedCode(codeId);

    toast({
      title: `Removed \u2018${account.name}\u2019 from Saved Codes`,
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
    });
  }, [account.name, toast]);
  return (
    <ActionModal
      title={
        account.name
          ? `Remove account \u2018${account.name}\u2019?`
          : `Remove account \u2018${truncate(account.address)}\u2019 ?`
      }
      icon="delete-solid"
      iconColor="error.light"
      mainVariant="error"
      mainBtnTitle="Yes, Remove It"
      mainAction={handleRemove}
      otherBtnTitle="No, Keep It"
      trigger={trigger}
    >
      <Text>
        <Highlight
          query={[
            account.name ?? "",
            truncate(account.address),
            "Saved Accounts",
          ]}
          styles={{ fontWeight: "bold", color: "inherit" }}
        >
          {`This action will remove \u2018${
            account.name ?? truncate(account.address)
          }\u2019 from Saved Accounts. 
          You can save this address again later, but you will need to add its new account name and description.`}
        </Highlight>
      </Text>
    </ActionModal>
  );
}
