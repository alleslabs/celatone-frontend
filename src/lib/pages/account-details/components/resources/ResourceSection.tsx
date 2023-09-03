import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Badge,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { ResourceCard } from "lib/components/resource/ResourceCard";
import { ResourceDetailCard } from "lib/components/resource/ResourceDetailCard";
import { TableTitle } from "lib/components/table";

export const ResourceSection = () => {
  return (
    <Flex direction="column" mt={8}>
      <TableTitle
        helperText="Resources stored in this account"
        title="Resources"
        count={12}
      />
      <Flex gap={6} flexDirection={{ base: "column", md: "row" }}>
        <Flex width={{ base: "full", md: 80 }}>
          <Accordion defaultIndex={[0]} allowToggle width="full">
            <AccordionItem mb={4}>
              <AccordionButton>
                <Flex p={4} justifyContent="space-between" w="full">
                  <Text variant="body1" fontWeight={600}>
                    0x1
                  </Text>
                  <CustomIcon name="chevron-down" color="gray.600" />
                </Flex>
              </AccordionButton>
              <AccordionPanel>
                <Flex direction="column" gap={3}>
                  <ResourceCard hasBorder name="beeb" amount={2} />
                  <ResourceCard isSelected hasBorder name="beeb" amount={2} />
                  <ResourceCard hasBorder name="beeb" amount={2} />
                  <ResourceCard hasBorder name="beeb" amount={2} />
                </Flex>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem mb={4}>
              <AccordionButton>
                <Flex p={4} justifyContent="space-between" w="full">
                  <Text variant="body1" fontWeight={600}>
                    0x2
                  </Text>
                  <CustomIcon name="chevron-down" color="gray.600" />
                </Flex>
              </AccordionButton>
              <AccordionPanel>
                <Flex direction="column" gap={3}>
                  <ResourceCard hasBorder name="beeb" amount={2} />
                  <ResourceCard isSelected hasBorder name="beeb" amount={2} />
                  <ResourceCard hasBorder name="beeb" amount={2} />
                  <ResourceCard hasBorder name="beeb" amount={2} />
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>
        <Flex direction="column" w="full">
          <Flex alignItems="center" pb={6}>
            <Heading as="h6" variant="h6">
              0x1::dex
            </Heading>
            <Badge variant="primary" ml={2}>
              9
            </Badge>
          </Flex>
          <Flex>
            <ResourceDetailCard name="test" />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
