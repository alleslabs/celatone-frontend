import { Flex, Text } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";

interface VerificationStatusProps {
  codeId: string;
}
export const VerificationStatus = ({ codeId }: VerificationStatusProps) => (
  <Flex
    border="1px solid"
    borderColor="gray.700"
    bg="gray.800"
    justify="space-between"
    align="center"
    p={4}
    w="full"
    minW="480px"
    borderRadius="4px"
    gap={2}
  >
    <CustomIcon name="hourglass" color="gray.600" boxSize={6} />
    <Flex direction="column">
      <Text color="text.main" variant="body1">
        Code verification is in progress
      </Text>
      <Text color="text.dark" variant="body2">
        This process may take several hours depending on code complexity. View
        status on
        <AppLink href={`/codes/${codeId}/schema`}>
          <Text color="primary.main" display="inline-flex" mx={1}>
            code details
          </Text>
        </AppLink>
        page
      </Text>
    </Flex>
  </Flex>
);
