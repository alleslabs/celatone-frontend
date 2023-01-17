import { useToast, Icon, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import { MdCheckCircle, MdDelete } from "react-icons/md";

import { ActionModal } from "lib/components/modal/ActionModal";
import { useCodeStore } from "lib/hooks";
import { getDescriptionDefault, shortenName } from "lib/utils";

interface RemoveCodeModalProps {
  codeId: number;
  description?: string;
  trigger?: JSX.Element;
}

export function RemoveCode({
  codeId,
  description,
  trigger = (
    <Icon
      as={MdDelete}
      width="24px"
      height="24px"
      color="gray.600"
      cursor="pointer"
    />
  ),
}: RemoveCodeModalProps) {
  const { removeSavedCode } = useCodeStore();
  const toast = useToast();

  const handleRemove = useCallback(() => {
    removeSavedCode(codeId);

    toast({
      title: `Removed \u2018${
        shortenName(getDescriptionDefault(description), 20) || codeId
      }\u2019 from Saved Codes`,
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
  }, [codeId, description, removeSavedCode, toast]);

  return (
    <ActionModal
      title={
        description
          ? `Remove \u2018${shortenName(description, 20)}\u2019?`
          : `Remove Code ID: ${codeId} ?`
      }
      icon={MdDelete}
      iconColor="error.light"
      mainBtnTitle="Yes, Remove It"
      mainAction={handleRemove}
      otherBtnTitle="No, Keep It"
      trigger={trigger}
      noCloseButton
      noHeaderBorder
    >
      <Text>
        You can save this code again later, but you will need to add its new
        code description.
      </Text>
    </ActionModal>
  );
}
