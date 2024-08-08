import { Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";

import { EditSchemaButtons, JsonSchemaModal } from "lib/components/json-schema";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { WasmVerifyStatus } from "lib/types";
import type { CodeSchema, Nullish, Option, WasmVerifyInfo } from "lib/types";
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
      <Flex mt={8} mb={3} alignItems="center" gap={2}>
        <Heading as="h6" variant="h6">
          JSON Schema
        </Heading>
        {!hasVerifiedSchema && attachedLocalSchema && (
          <EditSchemaButtons
            codeId={codeId}
            codeHash={codeHash}
            openModal={onOpen}
          />
        )}
      </Flex>
      <Text
        variant="body2"
        px={4}
        py={3}
        textColor="text.dark"
        bgColor="gray.800"
        border="1px solid var(--chakra-colors-gray-700)"
        borderRadius="8px"
      >
        {hasVerifiedSchema
          ? `The schema is provided as the code has been ${wasmVerifyStatus !== WasmVerifyStatus.VERIFIED && "indirectly"} verified.`
          : "Uploaded JSON schemas are stored locally on your device."}
      </Text>
      <CodeSchemaTabs
        codeId={codeId}
        codeHash={codeHash}
        verifiedSchema={wasmVerifyInfo?.schema}
        localSchema={localSchema}
      />
      {!hasVerifiedSchema && (
        <>
          <UserDocsLink
            title="How to attached and use JSON Schema?"
            cta="Read more about JSON Schema"
            href="cosmwasm/code/attach-json-schema"
          />
          <JsonSchemaModal
            isOpen={isOpen}
            onClose={onClose}
            codeId={codeId}
            codeHash={codeHash}
            isReattach={attachedLocalSchema}
          />
        </>
      )}
    </>
  );
};
