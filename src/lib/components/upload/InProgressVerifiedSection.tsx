import { Flex, Text } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";

interface InProgressVerifiedSectionProps {
  codeId: string;
}
export const InProgressVerifiedSection = ({
  codeId,
}: InProgressVerifiedSectionProps) => (
  <Flex
    align="center"
    bg="gray.800"
    gap={2}
    justify="space-between"
    minW="480px"
    p={4}
    w="full"
    border="1px solid"
    borderColor="gray.700"
    borderRadius="4px"
  >
    <CustomIcon name="hourglass" boxSize={6} color="gray.600" />
    <Flex direction="column">
      <Text variant="body1" color="text.main">
        Code verification is in progress
      </Text>
      <Text variant="body2" color="text.dark">
        This process may take several hours depending on code complexity. View
        status on
        <AppLink href={`/codes/${codeId}`}>
          <Text display="inline-flex" mx={1} color="primary.main">
            code details
          </Text>
        </AppLink>
        page
      </Text>
    </Flex>
  </Flex>
);
