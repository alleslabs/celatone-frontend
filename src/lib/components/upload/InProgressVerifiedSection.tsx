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
    border="1px solid"
    borderColor="gray.700"
    borderRadius="4px"
    gap={2}
    justify="space-between"
    minW="480px"
    p={4}
    w="full"
  >
    <CustomIcon boxSize={6} color="gray.600" name="hourglass" />
    <Flex direction="column">
      <Text color="text.main" variant="body1">
        Code verification is in progress
      </Text>
      <Text color="text.dark" variant="body2">
        This process may take several hours depending on code complexity. View
        status on
        <AppLink href={`/codes/${codeId}`}>
          <Text color="primary.main" display="inline-flex" mx={1}>
            code details
          </Text>
        </AppLink>
        page
      </Text>
    </Flex>
  </Flex>
);
