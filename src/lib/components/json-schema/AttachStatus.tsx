import { Flex, Text } from "@chakra-ui/react";

import { ConnectingLine } from "../ConnectingLine";
import { CustomIcon } from "../icon";

interface AttachStatusProps {
  codeId: number;
  isReattach?: boolean;
}
export const AttachStatus = ({
  codeId,
  isReattach = false,
}: AttachStatusProps) => (
  <Flex gap={10} mb={6} position="relative">
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
      style={{
        left: "calc(50% - 24px)",
        top: "calc(50% - 6px)",
        width: "full",
      }}
      alignment="horizontal"
      isFilled={isReattach}
    />
    <Flex
      gap={2}
      p={2}
      w="full"
      bgColor={isReattach ? "gray.800" : "transparent"}
      border={
        isReattach
          ? "1px solid var(--chakra-colors-gray-600)"
          : "1px dashed var(--chakra-colors-primary-light)"
      }
      borderRadius={4}
      justifyContent="center"
    >
      <CustomIcon
        name={isReattach ? "edit" : "upload"}
        color={isReattach ? "gray.400" : "primary.light"}
      />
      <Text color={isReattach ? "gray.400" : "primary.light"}>
        {isReattach ? "Reattaching JSON Schema..." : "Attaching JSON Schema..."}
      </Text>
    </Flex>
  </Flex>
);
