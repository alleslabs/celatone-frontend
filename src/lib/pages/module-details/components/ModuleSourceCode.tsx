import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const ModuleSourceCode = () => {
  return (
    <Flex>
      <Accordion allowToggle w="full" defaultIndex={[0]}>
        <AccordionItem>
          <AccordionButton p={4}>
            <Flex justifyContent="space-between" w="full">
              <Flex flexDirection="column" alignItems="start">
                <Text fontWeight={600} variant="body1" color="text.main">
                  Module Source Code
                </Text>
                <Text fontWeight={600} variant="body2" color="text.dark">
                  The source code is uploaded by the deployer and pulled from
                  Initia API
                </Text>
              </Flex>
              <Flex alignItems="center" gap={2}>
                <Button
                  variant="outline-primary"
                  w={{ base: "full", md: "auto" }}
                  leftIcon={<CustomIcon name="copy" />}
                  size="sm"
                >
                  Copy
                </Button>
                <AccordionIcon color="gray.600" ml="auto" />
              </Flex>
            </Flex>
          </AccordionButton>
          <AccordionPanel>
            <Text>TODO JSON INPUT HERE</Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};
