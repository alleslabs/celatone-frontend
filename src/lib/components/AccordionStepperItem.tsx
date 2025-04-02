import type { FlexProps } from "@chakra-ui/react";

import { Flex } from "@chakra-ui/react";

const AccordionStepperItemLine = (props: FlexProps) => (
  <Flex
    {...props}
    background="gray.600"
    h="28px"
    position="absolute"
    right="45%"
    visibility="hidden"
    w="1px"
    zIndex={0}
  />
);

export const AccordionStepperItem = () => (
  <Flex position="relative">
    <AccordionStepperItemLine id="before-stepper" bottom="9px" />
    <Flex
      id="stepper"
      borderColor="gray.600"
      borderRadius="full"
      borderWidth="1px"
      h="10px"
      w="10px"
    />
    <AccordionStepperItemLine id="after-stepper" top="9px" />
  </Flex>
);
