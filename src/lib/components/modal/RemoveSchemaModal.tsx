import { Text, useToast } from "@chakra-ui/react";
import type { ReactNode } from "react";

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
        icon: <CustomIcon name="check-circle-solid" color="success.main" />,
        isClosable: false,
        position: "bottom-right",
        status: "success",
        title: `Removed JSON Schema`,
      });
    }, 1000);
  };

  return (
    <ActionModal
      mainBtnTitle="Yes, Remove JSON Schema"
      mainVariant="error"
      title={`Removed JSON Schema for code '${codeId}'?`}
      trigger={trigger}
      icon="delete"
      iconColor="error.light"
      mainAction={handleRemove}
      otherBtnTitle="No, Keep It"
    >
      <Text>
        This action will remove JSON schema for code `{codeId}` and other codes
        with the same following code hash:
      </Text>
      <Text mt={4}>{codeHash}</Text>
    </ActionModal>
  );
}
