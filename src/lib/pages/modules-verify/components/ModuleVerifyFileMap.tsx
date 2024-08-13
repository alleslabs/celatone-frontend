import { Box, Heading, Stack, Text } from "@chakra-ui/react";

export const ModuleVerifyFileMap = () => (
  <Stack gap={4}>
    <Stack gap={2}>
      <Heading as="h6" variant="h6">
        Generated File Map
      </Heading>
      <Text variant="body2" color="text.dark">
        You can refer to this file map to ensure that the uploaded files are in
        the correct structure.
      </Text>
    </Stack>
    <Box p={8} textAlign="center" bg="gray.900" rounded={8}>
      <Text variant="body2" color="text.dark">
        The generated file map from the uploaded folder will be displayed here.
      </Text>
    </Box>
  </Stack>
);
