import { Alert, AlertDescription, Flex } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

export const IndirectlyVerifiedAlert = () => (
  <Alert variant="accent" alignItems="center">
    <Flex gap={2}>
      <CustomIcon name="info-circle" boxSize={4} />
      {/* TODO: add code that have the same hash */}
      <AlertDescription wordBreak="break-word">
        This code has the same code hash as the following verified stored codes:
        1234, 1235, 1236 and more
      </AlertDescription>
    </Flex>
  </Alert>
);
