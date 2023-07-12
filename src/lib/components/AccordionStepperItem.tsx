import type { FlexProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";

const AccordionStepperItemLine = (props: FlexProps) => (
  <Flex
    {...props}
    w="1px"
    h="28px"
    right="45%"
    background="gray.600"
    position="absolute"
    visibility="hidden"
    zIndex={0}
  />
);

export const AccordionStepperItem = () => (
  <Flex position="relative">
    <AccordionStepperItemLine id="before-stepper" bottom="9px" />
    <Flex
      id="stepper"
      borderRadius="full"
      h="10px"
      w="10px"
      borderColor="gray.600"
      borderWidth="1px"
    />
    <AccordionStepperItemLine id="after-stepper" top="9px" />
  </Flex>
);
