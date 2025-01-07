import { Flex, Text } from "@chakra-ui/react";

import { ConnectingLine } from "../../ConnectingLine";
import { CustomIcon } from "../../icon";

import { UploadSchema } from "./UploadSchema";

interface UploadSchemaSectionProps {
  codeHash: string;
  codeId: number;
  title?: JSX.Element | string;
}

export const UploadSchemaSection = ({
  codeHash,
  codeId,
  title = `You haven't attached the JSON Schema for code ${codeId} yet`,
}: UploadSchemaSectionProps) => {
  const sectionHeader =
    typeof title === "string" ? (
      <Text variant="body1" fontWeight={700}>
        {title}
      </Text>
    ) : (
      title
    );

  return (
    <Flex
      alignItems="center"
      p="24px 16px"
      bgColor="gray.900"
      borderRadius="8px"
      direction="column"
    >
      <Flex alignItems="center" direction="column">
        {sectionHeader}
        <Text
          mb={4}
          mt={2}
          variant="body2"
          fontWeight={500}
          textColor="text.disabled"
        >
          Your attached JSON schema will be stored locally on your device
        </Text>
        <Flex gap={10} w="full" direction="column" position="relative">
          <Flex
            gap={2}
            p={2}
            w="full"
            bgColor="gray.800"
            borderRadius={4}
            justifyContent="center"
          >
            <CustomIcon name="code" color="gray.400" />
            Code ID: {codeId}
          </Flex>
          <ConnectingLine
            style={{ left: "calc(50% - 6px)", top: "36px" }}
            isFilled={false}
          />
          <UploadSchema
            attached={false}
            codeHash={codeHash}
            codeId={codeId}
            localSchema={undefined}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
