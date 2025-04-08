import type { ReactNode } from "react";

import { Text, useToast } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { useSchemaStore } from "lib/providers/store";

import { ActionModal } from "./ActionModal";

interface RemoveSchemaModalProps {
  codeId: number;
  codeHash: string;
  trigger: ReactNode;
}

export function RemoveSchemaModal({
  codeId,
  codeHash,
  trigger,
}: RemoveSchemaModalProps) {
  const { deleteSchema } = useSchemaStore();

  const toast = useToast();
  const handleRemove = () => {
    deleteSchema(codeHash);
    track(AmpEvent.USE_REMOVE_ATTACHED_JSON);

    setTimeout(() => {
      toast({
        title: `Removed JSON schema`,
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
