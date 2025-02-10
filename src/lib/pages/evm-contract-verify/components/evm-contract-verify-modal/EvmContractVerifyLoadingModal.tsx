import {
  Heading,
  ModalBody,
  ModalHeader,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

export const EvmContractVerifyLoadingModal = () => (
  <>
    <ModalHeader w="full">
      <Stack alignItems="center" gap={4} w="100%">
        <Spinner w={16} h={16} thickness="4px" />
        <Heading variant="h5">Submitting Verification...</Heading>
      </Stack>
    </ModalHeader>
    <ModalBody maxH="400px" overflow="overlay">
      <Text variant="body2" color="text.dark" textAlign="center">
        Your verification details are being submitted, and the request will be
        processed shortly. Please do not close the browser during this process.
      </Text>
    </ModalBody>
  </>
);
