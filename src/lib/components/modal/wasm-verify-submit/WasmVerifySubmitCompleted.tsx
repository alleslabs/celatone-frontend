import { Flex, Heading, ModalBody, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const WasmVerifySubmitCompleted = () => (
  <ModalBody overflow="overlay">
    <Flex
      direction="column"
      gap={4}
      alignItems="center"
      w="100%"
      px={6}
      py={10}
    >
      <CustomIcon name="check-circle-solid" color="success.main" boxSize={12} />
      <Heading variant="h5">Submitted Verification!</Heading>
      <Text variant="body2" textAlign="center">
        Your code verification request has been submitted. Verification details
        will be available shortly...
      </Text>
    </Flex>
  </ModalBody>
);
