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
    <Flex direction="column" gap={8}>
      <Flex direction="column" gap={6}>
        <CustomNetworkSubheader title="Gas & Fee Details" />
        <Flex bg="teal">form goes here</Flex>
      </Flex>
      <Flex direction="column" gap={6}>
        <CustomNetworkSubheader title="Gas price configuration" />
        <Flex bg="teal">form goes here</Flex>
      </Flex>
      <Accordion allowToggle w="full">
        <AccordionItem>
          <AccordionButton p={4}>
            <Text>Advanced options</Text>
            <AccordionIcon color="gray.600" ml="auto" boxSize={6} />
          </AccordionButton>
          <AccordionPanel pt={0} pb={4}>
            <Flex gap={6} mt={2}>
              inputs
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};
