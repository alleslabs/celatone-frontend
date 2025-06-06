import type { RJSFValidationError } from "@rjsf/utils";
import type { CodeSchema, Nullish, Option } from "lib/types";

import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { capitalize } from "lodash";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import { JsonSchemaForm } from "../form";
import { JsonSchemaModal } from "../JsonSchemaModal";
import { ViewSchemaModal } from "../view/ViewSchemaModal";
import { SchemaInputNotExist } from "./SchemaInputNotExist";

interface SchemaSectionProps {
  codeHash: string;
  codeId: number;
  handleChange: (data: unknown, errors: RJSFValidationError[]) => void;
  initialFormData?: Record<string, unknown>;
  localSchema: Option<CodeSchema>;
  onSchemaSave?: () => void;
  type: "instantiate" | "migrate";
  verifiedSchema: Nullish<CodeSchema>;
}

export const SchemaInputSection = observer(
  ({
    codeHash,
    codeId,
    handleChange,
    initialFormData,
    localSchema,
    onSchemaSave,
    type,
    verifiedSchema,
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
          align={msgSchema ? "flex-start" : "center"}
          backgroundColor="gray.900"
          borderRadius="8px"
          direction="column"
          mb={4}
          p="24px 16px"
        >
          {msgSchema ? (
            <>
              {msgSchema.properties ? (
                <div style={{ width: "100%" }}>
                  <JsonSchemaForm
                    formId={type}
                    initialFormData={initialFormData}
                    schema={msgSchema}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <Text
                  bgColor="gray.800"
                  border="1px solid var(--chakra-colors-gray-700)"
                  borderRadius="4px"
                  fontWeight={500}
                  py={4}
                  textAlign="center"
                  textColor="text.disabled"
                  variant="body2"
                  w="full"
                >
                  {`${prettyType}Msg in attached JSON schema takes no input`}
                </Text>
              )}
            </>
          ) : (
            <SchemaInputNotExist
              codeHash={codeHash}
              codeId={codeId}
              localSchema={localSchema}
              openModal={onOpen}
              prettyType={prettyType}
              verifiedSchema={verifiedSchema}
            />
          )}
          <JsonSchemaModal
            codeHash={codeHash}
            codeId={codeId}
            isOpen={isOpen}
            isReattach={Boolean(msgSchema)}
            onClose={onClose}
            onSchemaSave={onSchemaSave}
          />
        </Flex>
        {msgSchema && (
          <Flex align="center" justify="space-between" mb={4} w="full">
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
                  size="sm"
                  variant="outline-gray"
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
