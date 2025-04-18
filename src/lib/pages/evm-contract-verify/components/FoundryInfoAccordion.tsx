import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";
// import { UserDocsLink } from "lib/components/UserDocsLink";

export const FoundryInfoAccordion = () => (
  <Accordion
    allowToggle
    defaultIndex={[0]}
    position="sticky"
    top={0}
    variant="transparent"
  >
    <AccordionItem>
      <AccordionButton>
        <Text
          color="text.main"
          fontWeight={700}
          textAlign="start"
          variant="body2"
        >
          What is Foundry?
        </Text>
        <AccordionIcon color="gray.600" ml="auto" />
      </AccordionButton>
      <AccordionPanel
        bg="transparent"
        borderBottomWidth="1px"
        borderColor="gray.700"
        borderTopWidth="1px"
        px={0}
        py={3}
      >
        <Text color="text.dark" p={1} variant="body2">
          Foundry is a framework that generates and submits contract metadata,
          ensuring accurate verification by matching the deployed bytecode.
        </Text>
      </AccordionPanel>
      {/* TODO to commented UserDoc */}
      {/* <UserDocsLink
        mt={3}
        cta="See how to verify contract via Foundry"
        // TODO: Update link
        href="#"
      /> */}
    </AccordionItem>
  </Accordion>
);
