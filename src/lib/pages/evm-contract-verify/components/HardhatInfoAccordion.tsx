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
    variant="transparent"
    position="sticky"
    top={0}
  >
    <AccordionItem>
      <AccordionButton>
        <Text
          variant="body2"
          fontWeight={700}
          color="text.main"
          textAlign="start"
        >
          What is Hardhat?
        </Text>
        <AccordionIcon color="gray.600" ml="auto" />
      </AccordionButton>
      <AccordionPanel
        bg="transparent"
        py={3}
        px={0}
        borderY="1px solid"
        borderColor="gray.700"
      >
        <Text variant="body2" color="text.dark" p={1}>
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
