import { Flex, Spinner, Text } from "@chakra-ui/react";

export const LoadingOverlay = () => {
  return (
    <Flex
      w="100vw"
      h="100vh"
      justify="center"
      align="center"
      direction="column"
      gap={3}
      bgColor="overlay.main"
      position="absolute"
      top={0}
      left={0}
      zIndex="overlay"
    >
      <Spinner color="gray.400" size="xl" />
      <Text variant="body1" color="text.main">
        Loading ...
      </Text>
    </Flex>
  );
};
