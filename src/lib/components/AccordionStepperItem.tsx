import { Flex } from "@chakra-ui/react";

export const AccordionStepperItem = () => (
  <Flex position="relative">
    <Flex
      id="before-stepper"
      w="1px"
      h="31px"
      right="45%"
      bottom="9px"
      background="gray.600"
      position="absolute"
      visibility="hidden"
      zIndex={0}
    />
    <Flex
      id="stepper"
      borderRadius="full"
      h="10px"
      w="10px"
      borderColor="gray.600"
      borderWidth="1px"
      position="relative"
      zIndex={1}
    />
  </Flex>
);
