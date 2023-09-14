import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  Button,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const UploadAccordion = () => (
  <Accordion allowToggle defaultIndex={[0]} variant="transparent">
    <AccordionItem borderTop="none" borderColor="gray.700">
      <AccordionButton py={3} px={0}>
        <Text
          variant="body2"
          fontWeight={700}
          color="text.main"
          textAlign="start"
        >
          What should I provide in my .mv files?
        </Text>
        <AccordionIcon color="gray.600" ml="auto" />
      </AccordionButton>
      <AccordionPanel
        bg="transparent"
        py={3}
        px={0}
        borderTop="1px solid"
        borderColor="gray.700"
      >
        <Text variant="body2" color="text.dark" p={1}>
          Your .mv files should consist of module name, available functions and
          their properties, module mechanics, friends.
        </Text>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

export const PolicyAccordion = ({ chainName }: { chainName: string }) => (
  <Accordion
    position="relative"
    allowToggle
    defaultIndex={[0]}
    variant="transparent"
  >
    <AccordionItem borderTop="none" borderColor="gray.700">
      <AccordionButton py={3} px={0}>
        <Text
          variant="body2"
          fontWeight={700}
          color="text.main"
          textAlign="start"
        >
          What is republishing module?
        </Text>
        <AccordionIcon color="gray.600" ml="auto" />
      </AccordionButton>
      <AccordionPanel
        bg="transparent"
        py={3}
        px={0}
        borderTop="1px solid"
        borderColor="gray.700"
      >
        <Text variant="body2" color="text.dark" p={1}>
          In {chainName}, You can republish the module which serve the purpose
          to migrate or upgrade the published module by uploading new .mv file
          with similar configurations.
          <br />
          <br />
          Each policy will provide different flexibility for further upgrades
          whether you can add new functions without maintaining old functions
          (Arbitrary), or required to maintain old functions (Compatible).
          <br />
          <br />
          Choosing “Immutable” will not allow you to make any changes with this
          module ever.
        </Text>
        <Button
          variant="ghost-secondary"
          size="sm"
          px="1 !important"
          rightIcon={
            <CustomIcon
              name="chevron-right"
              color="secondary.main"
              boxSize={3}
              m={0}
            />
          }
        >
          See Initia Doc
        </Button>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);
