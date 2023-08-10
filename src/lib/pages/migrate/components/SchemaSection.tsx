import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { ViewSchemaButton } from "lib/components/json-schema/common";
import { AttachSchemaCard } from "lib/components/json-schema/common/AttachSchemaCard";
import { JsonSchemaDrawer } from "lib/components/json-schema/common/JsonSchemaDrawer";
import { JsonSchemaForm } from "lib/components/json-schema/form";
import { useSchemaStore } from "lib/providers/store";

interface SchemaSectionProps {
  codeHash: string;
  codeId: string;
  setSchemaInput: (input: string) => void;
}

export const SchemaSection = observer(
  ({ codeHash, codeId, setSchemaInput }: SchemaSectionProps) => {
    const { getSchemaByCodeHash } = useSchemaStore();
    const jsonSchema = getSchemaByCodeHash(codeHash);
    const { isOpen, onClose, onOpen } = useDisclosure();
    return (
      <Flex
        direction="column"
        backgroundColor="gray.900"
        borderRadius="8px"
        p="24px 16px"
        mb={4}
        align={jsonSchema?.migrate ? "flex-start" : "center"}
      >
        {jsonSchema?.migrate ? (
          <>
            <Flex align="center" justify="space-between" w="full" mb={4}>
              <Text color="text.main" fontWeight={700} variant="body2">
                You are using a locally attached JSON Schema
              </Text>
              <Flex gap={3}>
                <ViewSchemaButton schema={jsonSchema} codeId={codeId} />
                <Button variant="outline-gray" size="sm" onClick={onOpen}>
                  Edit
                </Button>
              </Flex>
            </Flex>
            <JsonSchemaForm
              schema={jsonSchema.migrate}
              formId="migrate"
              onChange={(data) => setSchemaInput(JSON.stringify(data))}
            />
          </>
        ) : (
          <>
            <Text color="text.main" fontWeight={700} variant="body1">
              {jsonSchema
                ? "Attached JSON Schema doesn’t have MigrateMsg"
                : `You haven't attached the JSON Schema for code ${codeId} yet`}
            </Text>
            <Text
              color="text.disabled"
              fontWeight={500}
              variant="body2"
              mt={2}
              mb={4}
            >
              {jsonSchema
                ? "Please fill in Migrate Message manually or change the schema"
                : "Your attached JSON schema will be stored locally on your device"}
            </Text>
            <AttachSchemaCard
              attached={Boolean(jsonSchema)}
              schema={jsonSchema}
              codeId={codeId}
              codeHash={codeHash}
              openDrawer={onOpen}
            />
          </>
        )}
        <JsonSchemaDrawer
          isOpen={isOpen}
          onClose={onClose}
          codeHash={codeHash}
          codeId={codeId}
        />
      </Flex>
    );
  }
);
