import type { FlexProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";

const AccordionStepperItemLine = (props: FlexProps) => (
  <Flex
    {...props}
    h="28px"
    right="45%"
    visibility="hidden"
    w="1px"
    zIndex={0}
    background="gray.600"
    position="absolute"
  />
);

export const AccordionStepperItem = () => (
  <Flex position="relative">
    <AccordionStepperItemLine id="before-stepper" bottom="9px" />
    <Flex
      borderWidth="1px"
      id="stepper"
      h="10px"
      w="10px"
      borderColor="gray.600"
      borderRadius="full"
    />
    <AccordionStepperItemLine id="after-stepper" top="9px" />
  </Flex>
);
