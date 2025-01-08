import { Box, Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const WasmVerifyProcessStepIcon = ({ state }: { state: string }) => {
  switch (state) {
    case "Completed":
      return <CustomIcon name="check-circle-solid" color="primary.main" />;
    case "Failed":
      return <CustomIcon name="close-circle-solid" color="error.main" />;
    case "In Progress":
      return (
        <Flex
          h="16px"
          m={1}
          minH="16px"
          minW="16px"
          w="16px"
          background="gray.800"
          border="1px solid"
          borderColor="primary.main"
          borderRadius="100%"
        />
      );
    case "Pending":
    default:
      return (
        <Box
          h="16px"
          m={1}
          minH="16px"
          minW="16px"
          w="16px"
          background="gray.800"
          border="1px solid"
          borderColor="gray.700"
          borderRadius="100%"
        />
      );
  }
};
