import { Badge, Flex, Text } from "@chakra-ui/react";

interface ResourceCardProps {
  name: string;
  amount: number;
  hasBorder?: boolean;
  isSelected?: boolean;
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
    _hover={{ background: "gray.800" }}
    alignItems="center"
    bgColor={isSelected ? "gray.800" : "gray.900"}
    border={hasBorder ? "1px solid" : "none"}
    borderColor="gray.700"
    borderRadius={8}
    cursor="pointer"
    p={3}
    transition="all .25s ease-in-out"
    w="full"
    onClick={onClick}
  >
    <Text className="ellipsis">{name}</Text>
    <Badge ml={2} variant={isSelected ? "primary" : "gray"}>
      {amount}
    </Badge>
  </Flex>
);
