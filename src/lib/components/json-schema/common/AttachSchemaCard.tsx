import { Button, Flex, IconButton, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { useSchemaStore } from "lib/providers/store";
import type { CodeSchema } from "lib/stores/schema";
import type { Option } from "lib/types";

import { ViewSchemaButton } from "./ViewSchemaButton";

interface AttachSchemaCardProps {
  attached: boolean;
  codeId: string;
  codeHash: string;
  schema: Option<CodeSchema>;
  openDrawer: () => void;
}

export const AttachSchemaCard = ({
  attached,
  codeId,
  codeHash,
  schema,
  openDrawer,
}: AttachSchemaCardProps) => {
  const { deleteSchema } = useSchemaStore();

  return (
    <Flex
      border="1px solid var(--chakra-colors-gray-700)"
      bg="gray.800"
      justify="space-between"
      align="center"
      p={4}
      w="full"
      borderRadius="4px"
    >
      {!attached ? (
        <>
          <Text variant="body2">Attach JSON Schema</Text>
          <Button size="sm" variant="outline-primary" onClick={openDrawer}>
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
            <Text variant="body2">JSON Schema attached</Text>
          </Flex>
          <Flex align="center">
            <ViewSchemaButton codeId={codeId} schema={schema} mr={2} />
            <IconButton
              size="sm"
              variant="gray"
              aria-label="edit_schema"
              onClick={openDrawer}
              icon={
                <CustomIcon name="edit" color="gray.600" boxSize={4} m={0} />
              }
            />
            <IconButton
              size="sm"
              variant="gray"
              aria-label="delete_schema"
              onClick={() => deleteSchema(codeHash)}
              icon={
                <CustomIcon name="delete" color="gray.600" boxSize={4} m={0} />
              }
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};
