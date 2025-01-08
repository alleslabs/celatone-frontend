import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

interface ViewFullMsgButtonProps {
  onClick: () => void;
  viewFull: boolean;
}

export const ViewFullMsgButton = ({
  onClick,
  viewFull,
}: ViewFullMsgButtonProps) => (
  <Flex
    align="center"
    bg="background.main"
    justify="center"
    p={3}
    w="full"
    zIndex="docked"
    _hover={{ bg: "gray.900" }}
    borderRadius="0 0 8px 8px"
    borderTop="1px solid"
    borderTopColor="gray.700"
    cursor="pointer"
    onClick={onClick}
    transition="all 0.25s ease-in-out"
  >
    <Text variant="body3" color="text.dark" fontWeight={700}>
      {viewFull ? "View Less" : "View Full Message"}
    </Text>
    <CustomIcon
      name={viewFull ? "chevron-up" : "chevron-down"}
      boxSize={3}
      color="text.dark"
    />
  </Flex>
);
