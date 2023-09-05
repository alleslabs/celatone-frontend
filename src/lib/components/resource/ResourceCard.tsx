import { Badge, Flex } from "@chakra-ui/react";

interface ResourceCardProps {
  name: string;
  amount: number;
  hasBorder?: boolean;
  isSelected?: boolean;
}
export const ResourceCard = ({
  name,
  amount,
  hasBorder = false,
  isSelected = false,
}: ResourceCardProps) => {
  return (
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
    >
      {name}
      <Badge variant={isSelected ? "primary" : "gray"} ml={2}>
        {amount}
      </Badge>
    </Flex>
  );
};
