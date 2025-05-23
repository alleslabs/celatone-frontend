import type { ReactNode } from "react";

import { Text, useToast } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { useSchemaStore } from "lib/providers/store";

import { ActionModal } from "./ActionModal";

interface RemoveSchemaModalProps {
  codeHash: string;
  codeId: number;
  trigger: ReactNode;
}

export function RemoveSchemaModal({
  codeHash,
  codeId,
  trigger,
}: RemoveSchemaModalProps) {
  const { deleteSchema } = useSchemaStore();

  const toast = useToast();
  const handleRemove = () => {
    deleteSchema(codeHash);
    track(AmpEvent.USE_REMOVE_ATTACHED_JSON);

    setTimeout(() => {
      toast({
        duration: 5000,
        icon: <CustomIcon color="success.main" name="check-circle-solid" />,
        isClosable: false,
        position: "bottom-right",
        status: "success",
        title: `Removed JSON schema`,
      });
    }, 1000);
  };

  return (
    <ActionModal
      icon="delete"
      iconColor="error.light"
      mainAction={handleRemove}
      mainBtnTitle="Yes, remove JSON schema"
      mainVariant="error"
      otherBtnTitle="No, keep it"
      title={`Removed JSON schema for code '${codeId}'?`}
      trigger={trigger}
    >
      <Text>
        This action will remove JSON schema for code `{codeId}` and other codes
        with the same following code hash:
      </Text>
      <Text mt={4}>{codeHash}</Text>
    </ActionModal>
  );
}
