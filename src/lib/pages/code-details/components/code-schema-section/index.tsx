import { Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";

import { EditSchemaButtons, JsonSchemaModal } from "lib/components/json-schema";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { WasmVerifyStatus } from "lib/types";
import type { CodeSchema, Nullish, Option, WasmVerifyInfo } from "lib/types";
import { getWasmVerifyStatus } from "lib/utils";

import { CodeSchemaTabs } from "./CodeSchemaTabs";

interface CodeSchemaSectionProps {
  codeHash: string;
  codeId: number;
  localSchema: Option<CodeSchema>;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const CodeSchemaSection = ({
  codeHash,
  codeId,
  localSchema,
  wasmVerifyInfo,
}: CodeSchemaSectionProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const wasmVerifyStatus = getWasmVerifyStatus(wasmVerifyInfo);
  const hasVerifiedSchema = Boolean(wasmVerifyInfo?.schema);
  const attachedLocalSchema = Boolean(localSchema);
  return (
    <>
      <Flex alignItems="center" gap={2} mb={3} mt={8}>
        <Heading as="h6" variant="h6">
          JSON Schema
        </Heading>
        {!hasVerifiedSchema && attachedLocalSchema && (
          <EditSchemaButtons
            codeHash={codeHash}
            codeId={codeId}
            openModal={onOpen}
          />
        )}
      </Flex>
      <Text
        px={4}
        py={3}
        variant="body2"
        bgColor="gray.800"
        border="1px solid var(--chakra-colors-gray-700)"
        borderRadius="8px"
        textColor="text.dark"
      >
        {hasVerifiedSchema
          ? `The schema is provided as the code has been ${wasmVerifyStatus !== WasmVerifyStatus.VERIFIED ? "indirectly" : ""} verified.`
          : "Uploaded JSON schemas are stored locally on your device."}
      </Text>
      <CodeSchemaTabs
        verifiedSchema={wasmVerifyInfo?.schema}
        codeHash={codeHash}
        codeId={codeId}
        localSchema={localSchema}
      />
      {!hasVerifiedSchema && (
        <>
          <UserDocsLink
            cta="Read more about JSON Schema"
            title="How to attached and use JSON Schema?"
            href="cosmwasm/codes/attach-json-schema"
          />
          <JsonSchemaModal
            isOpen={isOpen}
            isReattach={attachedLocalSchema}
            codeHash={codeHash}
            codeId={codeId}
            onClose={onClose}
          />
        </>
      )}
    </>
  );
};
