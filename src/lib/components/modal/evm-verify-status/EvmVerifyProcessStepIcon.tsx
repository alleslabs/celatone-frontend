import { Box, Flex } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

export const EvmVerifyProcessStepIcon = ({ state }: { state: string }) => {
  switch (state) {
    case "Completed":
      return <CustomIcon color="primary.main" name="check-circle-solid" />;
    case "Failed":
      return <CustomIcon color="error.main" name="close-circle-solid" />;
    case "In Progress":
      return (
        <Flex
          background="gray.800"
          border="1px solid"
          borderColor="primary.main"
          borderRadius="100%"
          h="16px"
          m={1}
          minH="16px"
          minW="16px"
          w="16px"
        />
      );
    case "Pending":
    default:
      return (
        <Box
          background="gray.800"
          border="1px solid"
          borderColor="gray.500"
          borderRadius="100%"
          h="16px"
          m={1}
          minH="16px"
          minW="16px"
          w="16px"
        />
      );
  }
};
