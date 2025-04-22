import type { CodeSchema, Option } from "lib/types";

import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { useCallback } from "react";

import { RemoveSchemaModal } from "../modal/RemoveSchemaModal";
import { ViewSchemaModal } from "./view/ViewSchemaModal";

interface AttachSchemaCardProps {
  attached: boolean;
  codeHash: string;
  codeId: number;
  localSchema: Option<CodeSchema>;
  openModal: () => void;
}

export const AttachSchemaCard = ({
  attached,
  codeHash,
  codeId,
  localSchema,
  openModal,
}: AttachSchemaCardProps) => {
  const handleAttach = useCallback(() => {
    openModal();
    track(AmpEvent.USE_ATTACHED_JSON_MODAL);
  }, [openModal]);

  const handleReattach = useCallback(() => {
    openModal();
    track(AmpEvent.USE_EDIT_ATTACHED_JSON);
  }, [openModal]);

  return (
    <Flex
      align="center"
      bg={!attached ? "gray.900" : "gray.800"}
      border={!attached ? "1px dashed" : "1px solid"}
      borderColor="gray.700"
      borderRadius="4px"
      justify="space-between"
      minW="480px"
      p={4}
      w="full"
    >
      {!attached ? (
        <>
          <Text variant="body2">Attach JSON schema</Text>
          <Button size="sm" variant="outline-primary" onClick={handleAttach}>
            Attach
          </Button>
        </>
      ) : (
        <>
          <Flex align="center" gap={1}>
            <CustomIcon
              boxSize={6}
              color="success.main"
              name="check-circle-solid"
            />
            <Text variant="body2">JSON schema attached</Text>
          </Flex>
          <Flex align="center" gap={2}>
            <ViewSchemaModal codeId={codeId} schema={localSchema} />
            <Button size="sm" variant="outline-gray" onClick={handleReattach}>
              Reattach
            </Button>
            <RemoveSchemaModal
              codeHash={codeHash}
              codeId={codeId}
              trigger={
                <IconButton
                  aria-label="delete schema"
                  color="gray.600"
                  icon={<CustomIcon boxSize={4} name="delete" />}
                  size="sm"
                  variant="ghost-gray"
                />
              }
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};
