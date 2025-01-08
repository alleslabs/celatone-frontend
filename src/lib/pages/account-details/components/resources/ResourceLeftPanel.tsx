import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";

import { AmpEvent, track, trackUseExpand } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { ResourceCard } from "lib/components/resource";
import type {
  BechAddr,
  Option,
  ResourceGroup,
  ResourceGroupByAccount,
} from "lib/types";
import { truncate } from "lib/utils";

interface ResourceSectionBodyProps {
  address: BechAddr;
  resourcesByOwner: ResourceGroupByAccount[];
  selectedAccount: Option<string>;
  selectedGroupName: Option<string>;
}

export const ResourceLeftPanel = ({
  address,
  resourcesByOwner,
  selectedAccount,
  selectedGroupName,
}: ResourceSectionBodyProps) => {
  const navigate = useInternalNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSelectResource = useCallback(
    (
      account: ResourceGroupByAccount["owner"],
      resource: ResourceGroup["group"]
    ) => {
      if (account === selectedAccount && resource === selectedGroupName) return;
      navigate({
        options: {
          shallow: true,
        },
        pathname: `/accounts/[accountAddress]/[tab]`,
        query: {
          account,
          accountAddress: address,
          selected: resource,
          tab: "resources",
        },
        replace: true,
      });
    },
    [selectedGroupName, selectedAccount, address, navigate]
  );

  const filteredResourcesByOwner = useMemo(() => {
    if (!keyword) return resourcesByOwner;

    return resourcesByOwner?.map((each) => ({
      ...each,
      resources: each.resources.filter((resource) =>
        resource.group
          .toLowerCase()
          .includes(keyword.trim().toLocaleLowerCase())
      ),
    }));
  }, [keyword, resourcesByOwner]);

  const selectedIndex = filteredResourcesByOwner.findIndex(
    (item) => item.owner === selectedAccount
  );
  const selectedGroup = filteredResourcesByOwner[selectedIndex];
  const selectedResources = selectedGroup?.resources.find(
    (item) => item.group === selectedGroupName
  );

  return (
    <Flex
      mb={{ base: 4, md: 0 }}
      pb={{ base: 4, md: 0 }}
      borderBottom={{ base: "1px solid", md: "none" }}
      borderColor={{ base: "gray.700", md: "transparent" }}
      direction="column"
    >
      <InputWithIcon
        size="md"
        value={keyword}
        amptrackSection="resource-search-with-module-name"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search with Module Name"
      />
      <Accordion
        width="full"
        defaultIndex={Array.from(Array(filteredResourcesByOwner.length).keys())}
        mt={4}
        allowMultiple
      >
        {filteredResourcesByOwner.map((item) => (
          <AccordionItem key={item.owner} mb={4}>
            {({ isExpanded }) => (
              <>
                <AccordionButton
                  onClick={() => {
                    trackUseExpand({
                      action: !isExpanded ? "expand" : "collapse",
                      component: "resources_by_account_card",
                      info: { resoucesGroupItemCount: item.resources.length },
                      section: "account detail resources tab",
                    });
                  }}
                >
                  <Flex p={4} w="full" justifyContent="space-between">
                    <Text variant="body1" fontWeight={600}>
                      {truncate(item.owner)}
                    </Text>
                    <AccordionIcon color="gray.600" />
                  </Flex>
                </AccordionButton>
                <AccordionPanel>
                  {item.resources.length ? (
                    <Flex gap={3} direction="column">
                      {Object.values(item.resources).map((subitem) => (
                        <ResourceCard
                          key={subitem.displayName}
                          isSelected={
                            selectedResources?.account === subitem.account &&
                            selectedResources?.group === subitem.group
                          }
                          name={subitem.group}
                          amount={subitem.items.length}
                          hasBorder
                          onClick={() => {
                            track(AmpEvent.USE_SELECT_RESOURCE_GROUP, {
                              resourcesByModuleCount: subitem.items.length,
                            });
                            handleSelectResource(item.owner, subitem.group);
                          }}
                        />
                      ))}
                    </Flex>
                  ) : (
                    <Text
                      p={4}
                      textAlign="center"
                      variant="body2"
                      border="1px solid"
                      borderColor="gray.700"
                      borderRadius="8px"
                      color="text.dark"
                    >
                      No matching resource found
                    </Text>
                  )}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
};
