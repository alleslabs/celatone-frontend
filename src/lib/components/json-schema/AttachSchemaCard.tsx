import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { useCallback } from "react";

import { RemoveSchemaModal } from "../modal/RemoveSchemaModal";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import type { CodeSchema, Option } from "lib/types";

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
      justify="space-between"
      minW="480px"
      p={4}
      w="full"
      border={!attached ? "1px dashed" : "1px solid"}
      borderColor="gray.700"
      borderRadius="4px"
    >
      {!attached ? (
        <>
          <Text variant="body2">Attach JSON Schema</Text>
          <Button size="sm" variant="outline-primary" onClick={handleAttach}>
            Attach
          </Button>
        </>
      ) : (
        <>
          <Flex align="center" gap={1}>
            <CustomIcon
              name="check-circle-solid"
              boxSize={6}
              color="success.main"
            />
            <Text variant="body2">JSON Schema attached</Text>
          </Flex>
          <Flex align="center" gap={2}>
            <ViewSchemaModal schema={localSchema} codeId={codeId} />
            <Button size="sm" variant="outline-gray" onClick={handleReattach}>
              Reattach
            </Button>
            <RemoveSchemaModal
              trigger={
                <IconButton
                  aria-label="delete schema"
                  size="sm"
                  variant="ghost-gray"
                  color="gray.600"
                  icon={<CustomIcon name="delete" boxSize={4} />}
                />
              }
              codeHash={codeHash}
              codeId={codeId}
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};
