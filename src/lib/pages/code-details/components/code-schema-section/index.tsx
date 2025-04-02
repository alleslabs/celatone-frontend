import type { CodeSchema, Nullish, Option, WasmVerifyInfo } from "lib/types";

import { Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { EditSchemaButtons, JsonSchemaModal } from "lib/components/json-schema";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { WasmVerifyStatus } from "lib/types";
import { getWasmVerifyStatus } from "lib/utils";

import { CodeSchemaTabs } from "./CodeSchemaTabs";

interface CodeSchemaSectionProps {
  codeId: number;
  codeHash: string;
  localSchema: Option<CodeSchema>;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const CodeSchemaSection = ({
  codeId,
  codeHash,
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
        bgColor="gray.800"
        border="1px solid var(--chakra-colors-gray-700)"
        borderRadius="8px"
        px={4}
        py={3}
        textColor="text.dark"
        variant="body2"
      >
        {hasVerifiedSchema
          ? `The schema is provided as the code has been ${wasmVerifyStatus !== WasmVerifyStatus.VERIFIED ? "indirectly" : ""} verified.`
          : "Uploaded JSON schemas are stored locally on your device."}
      </Text>
      <CodeSchemaTabs
        codeHash={codeHash}
        codeId={codeId}
        localSchema={localSchema}
        verifiedSchema={wasmVerifyInfo?.schema}
      />
      {!hasVerifiedSchema && (
        <>
          <UserDocsLink
            cta="Read more about JSON Schema"
            href="cosmwasm/codes/attach-json-schema"
            title="How to attached and use JSON Schema?"
          />
          <JsonSchemaModal
            codeHash={codeHash}
            codeId={codeId}
            isOpen={isOpen}
            isReattach={attachedLocalSchema}
            onClose={onClose}
          />
        </>
      )}
    </>
  );
};
