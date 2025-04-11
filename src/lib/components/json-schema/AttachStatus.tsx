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
      style={{
        width: "full",
        top: "calc(50% - 6px)",
        left: "calc(50% - 24px)",
      }}
      alignment="horizontal"
      isFilled={isReattach}
    />
    <Flex
      bgColor={isReattach ? "gray.800" : "transparent"}
      border={
        isReattach
          ? "1px solid var(--chakra-colors-gray-600)"
          : "1px dashed var(--chakra-colors-primary-light)"
      }
      borderRadius={4}
      gap={2}
      justifyContent="center"
      p={2}
      w="full"
    >
      <CustomIcon
        color={isReattach ? "gray.400" : "primary.light"}
        name={isReattach ? "edit" : "upload"}
      />
      <Text color={isReattach ? "gray.400" : "primary.light"}>
        {isReattach ? "Reattaching JSON schema..." : "Attaching JSON schema..."}
      </Text>
    </Flex>
  </Flex>
);
