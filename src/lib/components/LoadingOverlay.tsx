import { Flex, Spinner, Text } from "@chakra-ui/react";

export const LoadingOverlay = () => (
  <Flex
    align="center"
    bgColor="background.overlay"
    direction="column"
    gap={3}
    h="100vh"
    justify="center"
    left={0}
    position="fixed"
    top={0}
    w="100vw"
    zIndex="overlay"
  >
    <Spinner size="xl" />
    <Text variant="body1">Loading ...</Text>
  </Flex>
);
