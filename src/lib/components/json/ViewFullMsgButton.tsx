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
    _hover={{ bg: "gray.900" }}
    align="center"
    bg="background.main"
    borderRadius="0 0 8px 8px"
    borderStyle="solid"
    borderTopColor="gray.700"
    borderTopWidth="1px"
    cursor="pointer"
    justify="center"
    p={3}
    transition="all 0.25s ease-in-out"
    w="full"
    zIndex="docked"
    onClick={onClick}
  >
    <Text color="text.dark" fontWeight={700} variant="body3">
      {viewFull ? "View less" : "View full message"}
    </Text>
    <CustomIcon
      boxSize={3}
      color="text.dark"
      name={viewFull ? "chevron-up" : "chevron-down"}
    />
  </Flex>
);
