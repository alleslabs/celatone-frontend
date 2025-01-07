import { Badge, Flex, Text } from "@chakra-ui/react";

interface ResourceCardProps {
  amount: number;
  hasBorder?: boolean;
  isSelected?: boolean;
  name: string;
  onClick: () => void;
}

export const ResourceCard = ({
  amount,
  hasBorder = false,
  isSelected = false,
  name,
  onClick,
}: ResourceCardProps) => (
  <Flex
    alignItems="center"
    p={3}
    w="full"
    _hover={{ background: "gray.800" }}
    bgColor={isSelected ? "gray.800" : "gray.900"}
    border={hasBorder ? "1px solid" : "none"}
    borderColor="gray.700"
    borderRadius={8}
    cursor="pointer"
    onClick={onClick}
    transition="all .25s ease-in-out"
  >
    <Text className="ellipsis">{name}</Text>
    <Badge ml={2} variant={isSelected ? "primary" : "gray"}>
      {amount}
    </Badge>
  </Flex>
);
