import { Text, useToast } from "@chakra-ui/react";
import type { ReactNode } from "react";

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
        title: `Removed JSON Schema`,
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
      title={`Removed JSON schema for code '${codeId}'?`}
      icon="delete"
      iconColor="error.light"
      trigger={trigger}
      mainBtnTitle="Yes, remove JSON schema"
      mainVariant="error"
      mainAction={handleRemove}
      otherBtnTitle="No, keep it"
    >
      <Text>
        This action will remove JSON schema for code `{codeId}` and other codes
        with the same following code hash:
      </Text>
      <Text mt={4}>{codeHash}</Text>
    </ActionModal>
  );
}
