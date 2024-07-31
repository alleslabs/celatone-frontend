import { Button, Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { CodeVerificationStatus } from "lib/components/modal/code-verification-status";

interface InProgressDetailsProps {
  codeId: number;
}
export const InProgressDetails = ({ codeId }: InProgressDetailsProps) => (
  <Flex alignItems="center" gap={8} justifyContent="space-between" w="full">
    <Flex alignItems="center" gap={2}>
      <CustomIcon name="hourglass" boxSize={4} ml={0} color="gray.400" />
      <Text variant="body2" color="text.dark">
        This contract is an instance of code ID{" "}
        <Text color="secondary.main" display="inline-flex">
          {codeId}
        </Text>{" "}
        which is currently undergoing verification. This can take several hours,
        depending on the code complexity.
      </Text>
    </Flex>
    <CodeVerificationStatus
      triggerElement={
        <Button variant="ghost-primary" size="sm">
          View Details
        </Button>
      }
    />
  </Flex>
);
