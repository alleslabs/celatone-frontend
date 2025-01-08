import { Box, Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const WasmVerifyProcessStepIcon = ({ state }: { state: string }) => {
  switch (state) {
    case "Failed":
      return <CustomIcon name="close-circle-solid" color="error.main" />;
    case "Completed":
      return <CustomIcon name="check-circle-solid" color="primary.main" />;
    case "In Progress":
      return (
        <Flex
          m={1}
          w="16px"
          minW="16px"
          h="16px"
          minH="16px"
          background="gray.800"
          borderRadius="100%"
          border="1px solid"
          borderColor="primary.main"
        />
      );
    case "Pending":
    default:
      return (
        <Box
          m={1}
          w="16px"
          minW="16px"
          h="16px"
          minH="16px"
          background="gray.800"
          borderRadius="100%"
          border="1px solid"
          borderColor="gray.700"
        />
      );
  }
};
