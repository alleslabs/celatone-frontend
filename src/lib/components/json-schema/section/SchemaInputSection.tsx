import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import type { RJSFSchema } from "@rjsf/utils";
import { capitalize } from "lodash";
import { observer } from "mobx-react-lite";

import { AttachSchemaCard } from "../AttachSchemaCard";
import { JsonSchemaForm } from "../form";
import { JsonSchemaDrawer } from "../JsonSchemaDrawer";
import { ViewSchemaButton } from "../ViewSchemaButton";
import type { CodeSchema } from "lib/stores/schema";
import type { Option } from "lib/types";

interface SchemaSectionProps {
  type: "migrate" | "instantiate";
  codeHash: string;
  codeId: string;
  jsonSchema: Option<CodeSchema>;
  initialFormData?: Record<string, unknown>;
  setSchemaInput: (input: string) => void;
}

export const SchemaInputSection = observer(
  ({
    type,
    codeHash,
    codeId,
    jsonSchema,
    initialFormData,
    setSchemaInput,
  }: SchemaSectionProps) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const prettyType = capitalize(type);

    return (
      <Flex
        direction="column"
        backgroundColor="gray.900"
        borderRadius="8px"
        p="24px 16px"
        mb={4}
        align={jsonSchema?.[type] ? "flex-start" : "center"}
      >
        {jsonSchema?.[type] ? (
          <>
            <Flex align="center" justify="space-between" w="full" mb={4}>
              <Text color="text.main" fontWeight={700} variant="body2">
                You are using a locally attached JSON Schema
              </Text>
              <Flex gap={3}>
                <ViewSchemaButton schema={jsonSchema} codeId={codeId} />
                <Button variant="outline-gray" size="sm" onClick={onOpen}>
                  Reattach
                </Button>
              </Flex>
            </Flex>
            {/* TODO: revisit type assertion later */}
            <div style={{ width: "100%" }}>
              <JsonSchemaForm
                schema={jsonSchema[type] as RJSFSchema}
                formId={type}
                initialFormData={initialFormData}
                onChange={(data) => setSchemaInput(JSON.stringify(data))}
              />
            </div>
          </>
        ) : (
          <>
            <Text color="text.main" fontWeight={700} variant="body1">
              {jsonSchema
                ? `Attached JSON Schema doesn’t have ${prettyType}Msg`
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
                ? `Please fill in ${prettyType} Message manually or change the schema`
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
