import { Flex, Text } from "@chakra-ui/react";

interface ValidatorStatusProps {
  status: string;
}
export const ValidatorStatusTag = ({
  status = "Active",
}: ValidatorStatusProps) => {
  const getColor = () => {
    switch (status) {
      case "Active":
        return "success.main";
      case "Jailed":
        return "error.main";
      case "Inactive":
      default:
        return "gray.600";
    }
  };

  return (
    <Flex
      background="gray.900"
      borderRadius={8}
      py={1}
      px={2}
      alignItems="center"
      gap={2}
    >
      <Flex h={3} w={3} borderRadius="full" background={getColor()} />
      <Text variant="body3" color="text.main">
        {status}
      </Text>
    </Flex>
  );
};
