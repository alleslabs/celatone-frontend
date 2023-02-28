import { Flex, Text, Icon } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";

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
    justify="center"
    w="full"
    p={3}
    borderTop="1px solid"
    borderTopColor="pebble.700"
    bg="background.main"
    borderRadius="0 0 8px 8px"
    position="absolute"
    bottom={0}
    left={0}
    cursor="pointer"
    _hover={{ bg: "pebble.900" }}
    transition="all .25s ease-in-out"
    onClick={onClick}
    zIndex="docked"
  >
    <Text variant="body3" fontWeight={700} color="text.dark">
      {viewFull ? "View Less" : "View Full Message"}
    </Text>
    <Icon
      as={FiChevronDown}
      color="text.dark"
      boxSize={4}
      transform={viewFull ? "rotate(180deg)" : "rotate(0)"}
      ml={2}
    />
  </Flex>
);
