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
import type { IndexedResource } from "lib/services/move/resourceService";
import { useAccountResources } from "lib/services/move/resourceService";
import type { HumanAddr } from "lib/types";
import { truncate } from "lib/utils";

import type { ResourceGroupByAccount } from "./ResourceLists";

interface ResourceSectionProps {
  address: HumanAddr;
}
export const ResourceSection = ({ address }: ResourceSectionProps) => {
  const { data: resourcesData = [] } = useAccountResources({
    address,
  });
  const resources = resourcesData as IndexedResource[];

  const sortedResource = resources.reduce<
    Record<string, ResourceGroupByAccount>
  >((acc, resource) => {
    const [ownerName, groupName] = resource.structTag.split("::");

    const ownerResources = acc[ownerName]?.resources ?? {};
    const groupResources = ownerResources[groupName] ?? {};
    const items = groupResources?.items ?? [];
    items.push(resource);

    return {
      ...acc,
      [ownerName]: {
        owner: ownerName,
        resources: {
          ...ownerResources,
          [groupName]: {
            group: groupName,
            items,
          },
        },
      },
    };
  }, {} as Record<string, ResourceGroupByAccount>);

  const groupedResources = Object.values(sortedResource);
  return (
    <Flex direction="column" mt={8}>
      <TableTitle
        helperText="Resources stored in this account"
        title="Resources"
        count={12}
      />
      <Flex gap={6} flexDirection={{ base: "column", md: "row" }}>
        <Flex width={{ base: "full", md: 80 }}>
          <Accordion defaultIndex={[0]} allowToggle width="full" allowMultiple>
            {groupedResources.map((item) => (
              <AccordionItem mb={4}>
                <AccordionButton>
                  <Flex p={4} justifyContent="space-between" w="full">
                    <Text variant="body1" fontWeight={600}>
                      {truncate(item.owner)}
                    </Text>
                    <CustomIcon name="chevron-down" color="gray.600" />
                  </Flex>
                </AccordionButton>
                <AccordionPanel>
                  <Flex direction="column" gap={3}>
                    {Object.values(item.resources).map((subitem) => (
                      <ResourceCard hasBorder name={subitem.group} amount={2} />
                    ))}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
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
          <Flex gap={3} flexDirection="column">
            <ResourceDetailCard name="test" />
            <ResourceDetailCard name="test" />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
