import type {
  BechAddr,
  Option,
  ResourceGroup,
  ResourceGroupByAccount,
} from "lib/types";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, track, trackUseExpand } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { ResourceCard } from "lib/components/resource";
import { truncate } from "lib/utils";
import { useCallback, useMemo, useState } from "react";

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
      borderBottomWidth={{ base: "1px", md: "none" }}
      borderColor={{ base: "gray.700", md: "transparent" }}
      borderStyle="solid"
      direction="column"
      mb={{ base: 4, md: 0 }}
      pb={{ base: 4, md: 0 }}
    >
      <InputWithIcon
        placeholder="Search with module name"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Accordion
        allowMultiple
        defaultIndex={Array.from(Array(filteredResourcesByOwner.length).keys())}
        mt={4}
        width="full"
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
                  <Flex justifyContent="space-between" p={4} w="full">
                    <Text fontWeight={600} variant="body1">
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
                          amount={subitem.items.length}
                          hasBorder
                          isSelected={
                            selectedResources?.account === subitem.account &&
                            selectedResources?.group === subitem.group
                          }
                          name={subitem.group}
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
                      border="1px solid"
                      borderColor="gray.700"
                      borderRadius="8px"
                      color="text.dark"
                      p={4}
                      textAlign="center"
                      variant="body2"
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
