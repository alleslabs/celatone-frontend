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
        pathname: `/accounts/[accountAddress]/[tab]`,
        query: {
          accountAddress: address,
          tab: "resources",
          account,
          selected: resource,
        },
        replace: true,
        options: {
          shallow: true,
        },
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
      direction="column"
      pb={{ base: 4, md: 0 }}
      mb={{ base: 4, md: 0 }}
      borderBottom={{ base: "1px solid", md: "none" }}
      borderColor={{ base: "gray.700", md: "transparent" }}
    >
      <InputWithIcon
        placeholder="Search with Module Name"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        size="md"
        amptrackSection="resource-search-with-module-name"
      />
      <Accordion
        allowMultiple
        defaultIndex={Array.from(Array(filteredResourcesByOwner.length).keys())}
        width="full"
        mt={4}
      >
        {filteredResourcesByOwner.map((item) => (
          <AccordionItem mb={4} key={item.owner}>
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
                  <Flex p={4} justifyContent="space-between" w="full">
                    <Text variant="body1" fontWeight={600}>
                      {truncate(item.owner)}
                    </Text>
                    <AccordionIcon color="gray.600" />
                  </Flex>
                </AccordionButton>
                <AccordionPanel>
                  {item.resources.length ? (
                    <Flex direction="column" gap={3}>
                      {Object.values(item.resources).map((subitem) => (
                        <ResourceCard
                          key={subitem.displayName}
                          name={subitem.group}
                          amount={subitem.items.length}
                          isSelected={
                            selectedResources?.account === subitem.account &&
                            selectedResources?.group === subitem.group
                          }
                          onClick={() => {
                            track(AmpEvent.USE_SELECT_RESOURCE_GROUP, {
                              resourcesByModuleCount: subitem.items.length,
                            });
                            handleSelectResource(item.owner, subitem.group);
                          }}
                          hasBorder
                        />
                      ))}
                    </Flex>
                  ) : (
                    <Text
                      variant="body2"
                      color="text.dark"
                      textAlign="center"
                      p={4}
                      border="1px solid"
                      borderRadius="8px"
                      borderColor="gray.700"
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
