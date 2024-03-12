import { Flex, Heading, Text } from "@chakra-ui/react";

export const ValidatorDescription = () => (
  <Flex direction="column" gap={2}>
    <Heading variant="h6" as="h6" color="text.main">
      Validator Description
    </Heading>
    <Text variant="body1" color="text.main">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam ad vel
      assumenda, temporibus maiores quidem quibusdam sapiente expedita officiis
      minus! Officiis itaque nisi reprehenderit tempora eaque eos quam, in
      excepturi.
    </Text>
  </Flex>
);
