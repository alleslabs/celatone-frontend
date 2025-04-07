import { chakra, IconButton, Text, useToast } from "@chakra-ui/react";
import { useCallback } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { useCodeStore } from "lib/providers/store";
import { getNameAndDescriptionDefault, shortenName } from "lib/utils";
import { ActionModal } from "../ActionModal";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    borderRadius: "36px",
  },
});

interface RemoveCodeModalProps {
  codeId: number;
  name?: string;
  trigger?: JSX.Element;
}

export function RemoveCodeModal({
  codeId,
  name,
  trigger = (
    <StyledIconButton
      aria-label="button"
      icon={<CustomIcon name="delete" />}
      variant="ghost-gray"
    />
  ),
}: RemoveCodeModalProps) {
  const { removeSavedCode } = useCodeStore();
  const toast = useToast();

  const handleRemove = useCallback(() => {
    track(AmpEvent.CODE_REMOVE);

    removeSavedCode(codeId);

    toast({
      title: `Removed \u2018${
        shortenName(getNameAndDescriptionDefault(name), 20) || codeId
      }\u2019 from Saved Codes`,
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
    });
  }, [codeId, name, removeSavedCode, toast]);

  return (
    <ActionModal
      title={
        name
          ? `Remove \u2018${shortenName(name, 20)}\u2019?`
          : `Remove code ID: ${codeId} ?`
      }
      icon="delete"
      iconColor="error.light"
      mainVariant="error"
      mainBtnTitle="Yes, remove it"
      mainAction={handleRemove}
      otherBtnTitle="No, keep it"
      trigger={trigger}
    >
      <Text>
        You can save this code again later, but you will need to add its new
        code name.
      </Text>
    </ActionModal>
  );
}
