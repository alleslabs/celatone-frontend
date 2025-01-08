import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";

import { UserDocsLink } from "lib/components/UserDocsLink";

export const UploadAccordion = () => (
  <Accordion
    defaultIndex={[0]}
    variant="transparent"
    allowToggle
    position="sticky"
    top={0}
  >
    <AccordionItem>
      <AccordionButton>
        <Text
          textAlign="start"
          variant="body2"
          color="text.main"
          fontWeight={700}
        >
          What should I provide in my .mv files?
        </Text>
        <AccordionIcon ml="auto" color="gray.600" />
      </AccordionButton>
      <AccordionPanel
        bg="transparent"
        px={0}
        py={3}
        borderBottom="1px solid"
        borderColor="gray.700"
        borderTop="1px solid"
      >
        <Text p={1} variant="body2" color="text.dark">
          Your .mv files should consist of module name, available functions and
          their properties, module mechanics, friends.
        </Text>
      </AccordionPanel>
      <UserDocsLink
        cta="Read more about publish"
        mt={3}
        isDevTool
        href="initia/move/publish-module"
      />
    </AccordionItem>
  </Accordion>
);

export const PolicyAccordion = ({ chainName }: { chainName: string }) => (
  <Accordion
    defaultIndex={[0]}
    variant="transparent"
    allowToggle
    position="sticky"
    top={0}
  >
    <AccordionItem>
      <AccordionButton>
        <Text
          textAlign="start"
          variant="body2"
          color="text.main"
          fontWeight={700}
        >
          What is republishing module?
        </Text>
        <AccordionIcon ml="auto" color="gray.600" />
      </AccordionButton>
      <AccordionPanel
        bg="transparent"
        px={0}
        py={3}
        borderColor="gray.700"
        borderY="1px solid"
      >
        <Text p={1} variant="body2" color="text.dark">
          In {chainName}, You can republish the module which serve the purpose
          to migrate or upgrade the published module by uploading new .mv file
          with similar configurations.
          <br />
          <br />
          “Compatible” will allow for further upgrades while requiring to
          maintain old functions.
          <br />
          <br />
          Choosing “Immutable” will not allow you to make any changes with this
          module ever.
        </Text>
      </AccordionPanel>
      <UserDocsLink
        cta="Read more about republish"
        mt={3}
        isDevTool
        href="initia/move/publish-module#republishing-modules"
      />
    </AccordionItem>
  </Accordion>
);
