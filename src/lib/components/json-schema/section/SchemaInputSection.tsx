import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import type { RJSFValidationError } from "@rjsf/utils";
import { capitalize } from "lodash";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import { AmpEvent, track } from "lib/amplitude";
import type { CodeSchema, Nullish, Option } from "lib/types";
import { SchemaInputNotExist } from "./SchemaInputNotExist";
import { JsonSchemaForm } from "../form";
import { JsonSchemaModal } from "../JsonSchemaModal";
import { ViewSchemaModal } from "../view/ViewSchemaModal";

interface SchemaSectionProps {
  type: "migrate" | "instantiate";
  codeHash: string;
  codeId: number;
  verifiedSchema: Nullish<CodeSchema>;
  localSchema: Option<CodeSchema>;
  initialFormData?: Record<string, unknown>;
  handleChange: (data: unknown, errors: RJSFValidationError[]) => void;
  onSchemaSave?: () => void;
}

export const SchemaInputSection = observer(
  ({
    type,
    codeHash,
    codeId,
    verifiedSchema,
    localSchema,
    initialFormData,
    handleChange,
    onSchemaSave,
  }: SchemaSectionProps) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const msgSchema = verifiedSchema?.[type] ?? localSchema?.[type];
    const prettyType = capitalize(type);

    const handleReattach = useCallback(() => {
      onOpen();
      track(AmpEvent.USE_EDIT_ATTACHED_JSON);
    }, [onOpen]);

    return (
      <>
        <Flex
          direction="column"
          backgroundColor="gray.900"
          borderRadius="8px"
          p="24px 16px"
          mb={4}
          align={msgSchema ? "flex-start" : "center"}
        >
          {msgSchema ? (
            <>
              {msgSchema.properties ? (
                <div style={{ width: "100%" }}>
                  <JsonSchemaForm
                    schema={msgSchema}
                    formId={type}
                    initialFormData={initialFormData}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <Text
                  variant="body2"
                  textColor="text.disabled"
                  fontWeight={500}
                  bgColor="gray.800"
                  w="full"
                  py={4}
                  border="1px solid var(--chakra-colors-gray-700)"
                  borderRadius="4px"
                  textAlign="center"
                >
                  {`${prettyType}Msg in attached JSON schema takes no input`}
                </Text>
              )}
            </>
          ) : (
            <SchemaInputNotExist
              prettyType={prettyType}
              verifiedSchema={verifiedSchema}
              localSchema={localSchema}
              codeId={codeId}
              codeHash={codeHash}
              openModal={onOpen}
            />
          )}
          <JsonSchemaModal
            isOpen={isOpen}
            onClose={onClose}
            codeHash={codeHash}
            codeId={codeId}
            onSchemaSave={onSchemaSave}
            isReattach={Boolean(msgSchema)}
          />
        </Flex>
        {msgSchema && (
          <Flex align="center" justify="space-between" w="full" mb={4}>
            <Text color="text.dark" variant="body2">
              {verifiedSchema
                ? "The schema is available because the code is verified"
                : "You are using a locally attached JSON schema"}
            </Text>
            <Flex gap={3}>
              <ViewSchemaModal
                codeId={codeId}
                schema={verifiedSchema ?? localSchema}
              />
              {!verifiedSchema && (
                <Button
                  variant="outline-gray"
                  size="sm"
                  onClick={handleReattach}
                >
                  Reattach
                </Button>
              )}
            </Flex>
          </Flex>
        )}
      </>
    );
  }
);
