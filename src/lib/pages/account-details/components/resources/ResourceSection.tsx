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
import { useRouter } from "next/router";
import { useCallback } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { ResourceCard } from "lib/components/resource/ResourceCard";
import { ResourceDetailCard } from "lib/components/resource/ResourceDetailCard";
import { TableTitle } from "lib/components/table";
import type { IndexedResource } from "lib/services/move/resourceService";
import { useAccountResources } from "lib/services/move/resourceService";
import type { HumanAddr } from "lib/types";
import { getFirstQueryParam, truncate } from "lib/utils";

import type { ResourceGroup, ResourceGroupByAccount } from "./ResourceLists";

interface ResourceSectionProps {
  address: HumanAddr;
}
export const ResourceSection = ({ address }: ResourceSectionProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();

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

  const selectedAccount = getFirstQueryParam(router.query.account);

  const selectedName = getFirstQueryParam(router.query.selected);

  const handleSelectResource = useCallback(
    (
      account: ResourceGroupByAccount["owner"],
      resource: ResourceGroup["group"]
    ) => {
      if (account === selectedAccount && resource === selectedName) return;
      navigate({
        pathname: `/accounts/[address]/resources`,
        query: {
          address,
          account,
          selected: resource,
        },
        options: {
          shallow: true,
        },
      });
    },
    [selectedName, selectedAccount, address, navigate]
  );

  const selectedGroup =
    groupedResources.find((item) => item.owner === router.query.account) ||
    groupedResources[0];

  if (!selectedGroup) return null;
  const selectedGroupArray = Object.values(selectedGroup.resources);

  const selectedResources = selectedGroupArray.find(
    (item) => item.group === router.query.selected
  );

  const selectedIndex = !router.query.account
    ? 0
    : groupedResources.findIndex((item) => item.owner === router.query.account);

  if (!selectedResources) return <Loading />;

  return (
    <Flex direction="column" mt={8}>
      <TableTitle
        helperText="Resources stored in this account"
        title="Resources"
        count={12}
      />
      <Flex
        gap={6}
        flexDirection={{ base: "column", md: "row" }}
        position="relative"
      >
        <Flex minW={{ base: "full", md: 80 }}>
          <Accordion allowMultiple defaultIndex={[selectedIndex]} width="full">
            {groupedResources.map((item) => (
              <AccordionItem mb={4} key={item.owner}>
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
                      <ResourceCard
                        hasBorder
                        name={subitem.group}
                        key={subitem.group}
                        amount={subitem.items.length}
                        isSelected={router.query.selected === subitem.group}
                        onClick={() =>
                          handleSelectResource(item.owner, subitem.group)
                        }
                      />
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
              {router.query.account}::{selectedResources?.group}
            </Heading>
            <Badge variant="primary" ml={2}>
              {selectedResources?.items.length}
            </Badge>
          </Flex>
          <Flex gap={4} flexDirection="column">
            {selectedResources.items.map((item) => (
              <ResourceDetailCard
                resourceData={item}
                key={item.struct_tag}
                defaultIndex={selectedResources.items.length > 2 ? [] : [0]}
              />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
