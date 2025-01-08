import { Flex, Spinner, Text } from "@chakra-ui/react";

export const LoadingOverlay = () => (
  <Flex
    w="100vw"
    h="100vh"
    justify="center"
    align="center"
    direction="column"
    gap={3}
    bgColor="background.overlay"
    position="fixed"
    top={0}
    left={0}
    zIndex="overlay"
  >
    <Spinner size="xl" />
    <Text variant="body1">Loading ...</Text>
  </Flex>
);
