import { Flex, Text } from "@chakra-ui/react";

import { ConnectingLine } from "../ConnectingLine";
import { CustomIcon } from "../icon";
import { UploadSchema } from "lib/pages/upload/components/UploadSchema";
import type { CodeSchema } from "lib/stores/schema";
import type { Option } from "lib/types";

interface UploadSchemaSectionProps {
  schema?: Option<CodeSchema>;
  codeId: string;
  codeHash: string;
  title?: string | JSX.Element;
}

export const UploadSchemaSection = ({
  schema,
  codeId,
  codeHash,
  title = `You haven't attached the JSON Schema for code ${codeId} yet`,
}: UploadSchemaSectionProps) => {
  return (
    <Flex
      p="24px 16px"
      direction="column"
      alignItems="center"
      bgColor="gray.900"
      borderRadius="8px"
    >
      <Flex direction="column" alignItems="center">
        <Text variant="body1" fontWeight={700}>
          {title}
        </Text>
        <Text
          variant="body2"
          textColor="text.disabled"
          fontWeight={500}
          mt={2}
          mb={4}
        >
          Your attached JSON schema will be stored locally on your device
        </Text>
        <Flex direction="column" w="full" gap={10} position="relative">
          <Flex
            bgColor="gray.800"
            borderRadius={4}
            p={2}
            gap={2}
            w="full"
            justifyContent="center"
          >
            <CustomIcon name="code" color="gray.400" />
            Code ID: {codeId}
          </Flex>
          <ConnectingLine
            isFilled={false}
            style={{ left: "calc(50% - 6px)", top: "36px" }}
          />
          <UploadSchema
            attached={false}
            schema={schema}
            codeId={codeId}
            codeHash={codeHash}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
