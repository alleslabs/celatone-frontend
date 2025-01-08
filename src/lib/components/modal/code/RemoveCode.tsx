import { chakra, IconButton, Text, useToast } from "@chakra-ui/react";
import { useCallback } from "react";

import { ActionModal } from "../ActionModal";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { useCodeStore } from "lib/providers/store";
import { getNameAndDescriptionDefault, shortenName } from "lib/utils";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    alignItems: "center",
    borderRadius: "36px",
    display: "flex",
    fontSize: "22px",
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
      variant="ghost-gray"
      icon={<CustomIcon name="delete" />}
    />
  ),
}: RemoveCodeModalProps) {
  const { removeSavedCode } = useCodeStore();
  const toast = useToast();

  const handleRemove = useCallback(() => {
    track(AmpEvent.CODE_REMOVE);

    removeSavedCode(codeId);

    toast({
      duration: 5000,
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
      isClosable: false,
      position: "bottom-right",
      status: "success",
      title: `Removed \u2018${
        shortenName(getNameAndDescriptionDefault(name), 20) || codeId
      }\u2019 from Saved Codes`,
    });
  }, [codeId, name, removeSavedCode, toast]);

  return (
    <ActionModal
      mainBtnTitle="Yes, Remove It"
      mainVariant="error"
      title={
        name
          ? `Remove \u2018${shortenName(name, 20)}\u2019?`
          : `Remove Code ID: ${codeId} ?`
      }
      trigger={trigger}
      icon="delete"
      iconColor="error.light"
      mainAction={handleRemove}
      otherBtnTitle="No, Keep It"
    >
      <Text>
        You can save this code again later, but you will need to add its new
        code name.
      </Text>
    </ActionModal>
  );
}
