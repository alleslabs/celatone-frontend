import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { useCallback } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import type { CodeSchema, Option } from "lib/types";

import { ViewSchemaModal } from "./view/ViewSchemaModal";
import { RemoveSchemaModal } from "../modal/RemoveSchemaModal";

interface AttachSchemaCardProps {
  attached: boolean;
  codeId: number;
  codeHash: string;
  localSchema: Option<CodeSchema>;
  openModal: () => void;
}

export const AttachSchemaCard = ({
  attached,
  codeId,
  codeHash,
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
      border={!attached ? "1px dashed" : "1px solid"}
      borderColor="gray.700"
      bg={!attached ? "gray.900" : "gray.800"}
      justify="space-between"
      align="center"
      p={4}
      w="full"
      minW="480px"
      borderRadius="4px"
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
              name="check-circle-solid"
              color="success.main"
              boxSize={6}
            />
            <Text variant="body2">JSON schema attached</Text>
          </Flex>
          <Flex align="center" gap={2}>
            <ViewSchemaModal codeId={codeId} schema={localSchema} />
            <Button variant="outline-gray" size="sm" onClick={handleReattach}>
              Reattach
            </Button>
            <RemoveSchemaModal
              codeId={codeId}
              codeHash={codeHash}
              trigger={
                <IconButton
                  variant="ghost-gray"
                  size="sm"
                  color="gray.600"
                  icon={<CustomIcon name="delete" boxSize={4} />}
                  aria-label="delete schema"
                />
              }
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};
