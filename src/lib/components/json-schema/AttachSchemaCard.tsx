import { Button, Flex, IconButton, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { useSchemaStore } from "lib/providers/store";
import type { CodeSchema } from "lib/stores/schema";
import type { Option } from "lib/types";

import { ViewSchemaModal } from "./view/ViewSchemaModal";

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
      border={!attached ? "1px dashed" : "1px solid"}
      borderColor="gray.700"
      bg={!attached ? "gray.900" : "gray.800"}
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
          <Flex align="center" gap={2}>
            <ViewSchemaModal codeId={codeId} jsonSchema={schema} />
            <Button variant="outline-gray" size="sm" onClick={openDrawer}>
              Reattach
            </Button>
            <IconButton
              size="sm"
              variant="gray"
              aria-label="delete_schema"
              onClick={() => deleteSchema(codeHash)}
              icon={<CustomIcon name="delete" color="gray.600" boxSize={4} />}
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};
