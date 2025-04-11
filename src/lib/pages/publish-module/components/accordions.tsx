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
          What should I provide in my .mv files?
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
          Your .mv files should consist of module name, available functions and
          their properties, module mechanics, friends.
        </Text>
      </AccordionPanel>
      <UserDocsLink
        cta="Read more about publish"
        href="initia/move/publish-module"
        isDevTool
        mt={3}
      />
    </AccordionItem>
  </Accordion>
);

export const PolicyAccordion = ({ chainName }: { chainName: string }) => (
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
          What is republishing module?
        </Text>
        <AccordionIcon color="gray.600" ml="auto" />
      </AccordionButton>
      <AccordionPanel
        bg="transparent"
        borderColor="gray.700"
        borderY="1px solid"
        px={0}
        py={3}
      >
        <Text color="text.dark" p={1} variant="body2">
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
        href="initia/move/publish-module#republishing-modules"
        isDevTool
        mt={3}
      />
    </AccordionItem>
  </Accordion>
);
