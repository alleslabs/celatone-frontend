import { Flex, Text } from "@chakra-ui/react";

interface NoTransactionsProps {
  displayText: string;
}

export const NoTransactions = ({ displayText }: NoTransactionsProps) => (
  <Flex
    justifyContent="center"
    py={12}
    borderY="1px"
    borderColor="divider.main"
  >
    <Text
      variant="body2"
      color="text.dark"
      textAlign="center"
      alignSelf="center"
    >
      {displayText}
    </Text>
  </Flex>
);
