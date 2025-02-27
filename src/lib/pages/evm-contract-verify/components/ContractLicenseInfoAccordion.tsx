import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";
import { UserDocsLink } from "lib/components/UserDocsLink";

export const ContractLicenseInfoAccordion = () => (
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
          What is contract license?
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
          A contract license specifies how a smart contract's code can be used,
          modified, and distributed, ensuring legal clarity and protecting
          creators' rights.
        </Text>
      </AccordionPanel>
      <UserDocsLink
        mt={3}
        cta="See contract license types"
        href="source-code/license"
        isDevTool
      />
    </AccordionItem>
  </Accordion>
);
