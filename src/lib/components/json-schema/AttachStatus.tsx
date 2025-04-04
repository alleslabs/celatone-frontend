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
  <Flex position="relative" gap={10} mb={6}>
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
      alignment="horizontal"
      isFilled={isReattach}
      style={{
        width: "full",
        top: "calc(50% - 6px)",
        left: "calc(50% - 24px)",
      }}
    />
    <Flex
      bgColor={isReattach ? "gray.800" : "transparent"}
      borderRadius={4}
      border={
        isReattach
          ? "1px solid var(--chakra-colors-gray-600)"
          : "1px dashed var(--chakra-colors-primary-light)"
      }
      p={2}
      gap={2}
      justifyContent="center"
      w="full"
    >
      <CustomIcon
        name={isReattach ? "edit" : "upload"}
        color={isReattach ? "gray.400" : "primary.light"}
      />
      <Text color={isReattach ? "gray.400" : "primary.light"}>
        {isReattach ? "Reattaching JSON schema..." : "Attaching JSON schema..."}
      </Text>
    </Flex>
  </Flex>
);
