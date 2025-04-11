import {
  Heading,
  ModalBody,
  ModalHeader,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

export const ModuleVerifyLoadingModal = () => (
  <>
    <ModalHeader w="full">
      <Stack alignItems="center" gap={4} w="100%">
        <Spinner h={16} thickness="4px" w={16} />
        <Heading variant="h5">Uploading files...</Heading>
      </Stack>
    </ModalHeader>
    <ModalBody maxH="400px" overflow="overlay">
      <Text color="text.dark" textAlign="center" variant="body2">
        Your file is being uploaded, and the request will be submitted shortly.
        Please do not close the browser during this process.
      </Text>
    </ModalBody>
  </>
);
