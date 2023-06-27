import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

export const DropdownChevron = ({ onClick }: { onClick: () => void }) => (
  <Flex
    position="absolute"
    pr={2}
    pl={1}
    right={0}
    h="full"
    align="center"
    onClick={onClick}
    bg="background.main"
    border="1px solid"
    borderWidth="1px 1px 1px 0"
    borderColor="gray.700"
    borderRadius="0 8px 8px 0"
  >
    <CustomIcon name="chevron-down" color="gray.600" />
  </Flex>
);
