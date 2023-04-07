import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

import { LabelText } from "lib/components/LabelText";

export const BlockInfo = () => (
  <Box mb={12}>
    <Heading as="h6" variant="h6" mb={6}>
      Block Information
    </Heading>
    <Flex gap={16}>
      <LabelText label="Network">phoenix-1</LabelText>
      <LabelText label="Proposed by">
        <Flex gap={1}>
          <Image
            boxSize={6}
            borderRadius="full"
            src="https://ui-avatars.com/api/?name=Honey+toast&background=5942F3&color=fff"
          />
          <Text color="lilac.main">Honeytoast</Text>
        </Flex>
      </LabelText>
      <LabelText label="Gas (Used/Wanted)">123,456 / 234,567</LabelText>
    </Flex>
  </Box>
);
