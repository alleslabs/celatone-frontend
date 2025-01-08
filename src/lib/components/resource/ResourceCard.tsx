import { Badge, Flex, Text } from "@chakra-ui/react";

interface ResourceCardProps {
  name: string;
  amount: number;
  hasBorder?: boolean;
  isSelected?: boolean;
  onClick: () => void;
}

export const ResourceCard = ({
  name,
  amount,
  hasBorder = false,
  isSelected = false,
  onClick,
}: ResourceCardProps) => (
  <Flex
    w="full"
    border={hasBorder ? "1px solid" : "none"}
    _hover={{ background: "gray.800" }}
    transition="all .25s ease-in-out"
    cursor="pointer"
    borderColor="gray.700"
    bgColor={isSelected ? "gray.800" : "gray.900"}
    borderRadius={8}
    p={3}
    alignItems="center"
    onClick={onClick}
  >
    <Text className="ellipsis">{name}</Text>
    <Badge variant={isSelected ? "primary" : "gray"} ml={2}>
      {amount}
    </Badge>
  </Flex>
);
