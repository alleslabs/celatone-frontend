import { useToast, Icon, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import { MdDeleteForever, MdCheckCircle, MdDelete } from "react-icons/md";

import { ActionModal } from "lib/components/modal/ActionModal";
import { useCodeStore, useUserKey } from "lib/hooks";

interface ModalProps {
  codeId: number;
}

export function RemoveCode({ codeId }: ModalProps) {
  const userKey = useUserKey();
  const { removeSavedCode } = useCodeStore();
  const toast = useToast();

  const handleRemove = useCallback(() => {
    removeSavedCode(userKey, codeId);

    toast({
      title: `Removed '${codeId}' from Saved Codes`,
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
  }, [codeId, userKey, removeSavedCode, toast]);

  return (
    <ActionModal
      title={`Remove Code ID: ${codeId} ?`}
      icon={MdDeleteForever}
      iconColor="error.light"
      mainBtnTitle="Yes, Remove It"
      mainAction={handleRemove}
      otherBtnTitle="No, Keep It"
      trigger={
        <Icon
          as={MdDelete}
          width="24px"
          height="24px"
          color="gray.600"
          cursor="pointer"
        />
      }
    >
      <Text>You can save this code again later</Text>
    </ActionModal>
  );
}
