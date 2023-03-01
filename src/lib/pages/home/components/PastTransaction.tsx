import { Heading, Box, Flex, Text } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";

/* TODO: Delete after past tx page is done */
export const PastTransaction = () => (
  <Box py={8}>
    <Heading px={12} as="h6" variant="h6" mb={4}>
      Past Transaction
    </Heading>
    <Flex
      px={12}
      borderTopWidth={1}
      borderBottomWidth={1}
      justifyContent="center"
      alignItems="center"
      minH="128px"
      gap={1}
    >
      <Text color="text.dark" variant="body1">
        Your past transactions will display here. You also able can view all
      </Text>
      <AppLink href="/past-txs">
        <Text
          color="lilac.main"
          _hover={{ color: "lilac.light" }}
          transition="all .25s ease-in-out"
        >
          Past Transactions
        </Text>
      </AppLink>
    </Flex>
  </Box>
);
