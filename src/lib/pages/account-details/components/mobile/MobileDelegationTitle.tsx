import { Flex, Heading } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const MobileDelegationTitle = ({
  onViewMore,
  children,
}: {
  onViewMore: () => void;
  children: JSX.Element;
}) => {
  return (
    <Flex
      justify="space-between"
      w="full"
      bg="gray.900"
      borderRadius="8px"
      p={4}
      onClick={onViewMore}
    >
      <Flex direction="column" gap={2}>
        <Heading variant="h6" as="h6">
          Delegations
        </Heading>
        {children}
      </Flex>
      <CustomIcon name="chevron-right" color="gray.600" />
    </Flex>
  );
};
