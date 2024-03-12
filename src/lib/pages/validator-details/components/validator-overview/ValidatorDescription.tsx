import { Flex, Heading, Text } from "@chakra-ui/react";

import type { ValidatorData } from "lib/types";

interface ValidatorDescriptionProps {
  info: ValidatorData;
}

export const ValidatorDescription = ({ info }: ValidatorDescriptionProps) => (
  <Flex direction="column" gap={2}>
    <Heading variant="h6" as="h6" color="text.main">
      Validator Description
    </Heading>
    <Text variant="body1" color="text.main">
      {info.details}
    </Text>
  </Flex>
);
