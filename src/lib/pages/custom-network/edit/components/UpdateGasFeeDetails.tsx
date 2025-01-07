import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from "@chakra-ui/react";

import { CustomNetworkSubheader } from "lib/components/custom-network";

export const UpdateGasFeeDetails = () => {
  return (
    <Flex gap={8} direction="column">
      <Flex gap={6} direction="column">
        <CustomNetworkSubheader title="Gas & Fee Details" />
        <Flex bg="teal">form goes here</Flex>
      </Flex>
      <Flex gap={6} direction="column">
        <CustomNetworkSubheader title="Gas Price Configuration" />
        <Flex bg="teal">form goes here</Flex>
      </Flex>
      <Accordion w="full" allowToggle>
        <AccordionItem>
          <AccordionButton p={4}>
            <Text>Advanced Options</Text>
            <AccordionIcon ml="auto" boxSize={6} color="gray.600" />
          </AccordionButton>
          <AccordionPanel pb={4} pt={0}>
            <Flex gap={6} mt={2}>
              inputs
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};
