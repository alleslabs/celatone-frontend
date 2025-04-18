import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";
// import { UserDocsLink } from "lib/components/UserDocsLink";

export const HarthatInfoAccordion = () => (
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
          What is Hardhat?
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
          Hardhat simplifies contract verification by generating metadata during
          compilation and automating the process through plugins.
        </Text>
      </AccordionPanel>
      {/*  TODO to commented UserDoc */}
      {/* <UserDocsLink
        mt={3}
        cta="See how to verify contract via Hardhat"
        // TODO: Update link
        href="#"
      /> */}
    </AccordionItem>
  </Accordion>
);
