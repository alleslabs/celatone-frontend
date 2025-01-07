import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import type { RJSFValidationError } from "@rjsf/utils";
import { capitalize } from "lodash";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import { JsonSchemaForm } from "../form";
import { JsonSchemaModal } from "../JsonSchemaModal";
import { ViewSchemaModal } from "../view/ViewSchemaModal";
import { AmpEvent, track } from "lib/amplitude";
import type { CodeSchema, Nullish, Option } from "lib/types";

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
          mb={4}
          p="24px 16px"
          backgroundColor="gray.900"
          borderRadius="8px"
          direction="column"
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
                  py={4}
                  textAlign="center"
                  variant="body2"
                  w="full"
                  bgColor="gray.800"
                  border="1px solid var(--chakra-colors-gray-700)"
                  borderRadius="4px"
                  fontWeight={500}
                  textColor="text.disabled"
                >
                  {`${prettyType}Msg in attached JSON Schema takes no input`}
                </Text>
              )}
            </>
          ) : (
            <SchemaInputNotExist
              prettyType={prettyType}
              verifiedSchema={verifiedSchema}
              codeHash={codeHash}
              codeId={codeId}
              localSchema={localSchema}
              openModal={onOpen}
            />
          )}
          <JsonSchemaModal
            isOpen={isOpen}
            isReattach={Boolean(msgSchema)}
            codeHash={codeHash}
            codeId={codeId}
            onClose={onClose}
            onSchemaSave={onSchemaSave}
          />
        </Flex>
        {msgSchema && (
          <Flex align="center" justify="space-between" mb={4} w="full">
            <Text variant="body2" color="text.dark">
              {verifiedSchema
                ? "The schema is available because the code is verified"
                : "You are using a locally attached JSON Schema"}
            </Text>
            <Flex gap={3}>
              <ViewSchemaModal
                schema={verifiedSchema ?? localSchema}
                codeId={codeId}
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
