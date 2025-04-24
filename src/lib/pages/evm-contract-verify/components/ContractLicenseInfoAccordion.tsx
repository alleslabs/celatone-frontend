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
          What is contract license?
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
          A contract license specifies how a smart contract's code can be used,
          modified, and distributed, ensuring legal clarity and protecting
          creators' rights.
        </Text>
      </AccordionPanel>
      <UserDocsLink
        cta="See contract license types"
        href="source-code/license"
        isDevTool
        mt={3}
      />
    </AccordionItem>
  </Accordion>
);
