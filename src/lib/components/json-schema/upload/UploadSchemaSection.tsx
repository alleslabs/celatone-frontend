import { Flex, Text } from "@chakra-ui/react";

import { ConnectingLine } from "../../ConnectingLine";
import { CustomIcon } from "../../icon";
import { UploadSchema } from "./UploadSchema";

interface UploadSchemaSectionProps {
  codeHash: string;
  codeId: number;
  title?: string | JSX.Element;
}

export const UploadSchemaSection = ({
  codeHash,
  codeId,
  title = `You haven't attached the JSON schema for code ${codeId} yet`,
}: UploadSchemaSectionProps) => {
  const sectionHeader =
    typeof title === "string" ? (
      <Text fontWeight={700} variant="body1">
        {title}
      </Text>
    ) : (
      title
    );

  return (
    <Flex
      alignItems="center"
      bgColor="gray.900"
      borderRadius="8px"
      direction="column"
      p="24px 16px"
    >
      <Flex alignItems="center" direction="column">
        {sectionHeader}
        <Text
          fontWeight={500}
          mb={4}
          mt={2}
          textColor="text.disabled"
          variant="body2"
        >
          Your attached JSON schema will be stored locally on your device
        </Text>
        <Flex direction="column" gap={10} position="relative" w="full">
          <Flex
            bgColor="gray.800"
            borderRadius={4}
            gap={2}
            justifyContent="center"
            p={2}
            w="full"
          >
            <CustomIcon color="gray.400" name="code" />
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
