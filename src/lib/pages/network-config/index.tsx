import { Flex, Grid, Heading } from "@chakra-ui/react";

import ActionPageContainer from "lib/components/ActionPageContainer";

export const NetworkConfig = () => {
  return (
    <Flex>
      <ActionPageContainer width={900}>
        <Flex direction="column" gap={2} alignItems="center">
          <Heading as="h6" variant="h6" color="text.dark">
            Custom Minitia
          </Heading>
          <Heading as="h4" variant="h4">
            CHAIN_NAME
          </Heading>
        </Flex>
        <Grid templateColumns="2fr 5fr" gap={6} w="full" my={8}>
          <Flex bg="tomato">ff</Flex>
          <Flex bg="tomato">ff</Flex>
        </Grid>
      </ActionPageContainer>
    </Flex>
  );
};
