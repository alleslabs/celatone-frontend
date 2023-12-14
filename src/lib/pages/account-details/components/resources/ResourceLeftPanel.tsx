import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import { useInternalNavigate } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { ResourceCard } from "lib/components/resource";
import type {
  HumanAddr,
  ResourceGroup,
  ResourceGroupByAccount,
} from "lib/types";
import { getFirstQueryParam, truncate } from "lib/utils";

interface ResourceSectionBodyProps {
  address: HumanAddr;
  resourcesByOwner: ResourceGroupByAccount[];
}

export const ResourceLeftPanel = ({
  address,
  resourcesByOwner,
}: ResourceSectionBodyProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const [keyword, setKeyword] = useState("");

  const selectedAccountParam = getFirstQueryParam(
    router.query.account,
    resourcesByOwner?.[0]?.owner
  );
  const selectedNameParam = getFirstQueryParam(
    router.query.selected,
    resourcesByOwner?.[0]?.resources[0]?.group
  );

  const handleSelectResource = useCallback(
    (
      account: ResourceGroupByAccount["owner"],
      resource: ResourceGroup["group"]
    ) => {
      if (account === selectedAccountParam && resource === selectedNameParam)
        return;
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
    [selectedNameParam, selectedAccountParam, address, navigate]
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
    (item) => item.owner === selectedAccountParam
  );
  const selectedGroup = filteredResourcesByOwner[selectedIndex];
  const selectedResources = selectedGroup?.resources.find(
    (item) => item.group === selectedNameParam
  );

  return (
    <Flex
      minW={{ base: "full", md: 80 }}
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
        amptrackSection="execute-message-search"
      />
      <Accordion
        allowMultiple
        defaultIndex={[selectedIndex]}
        width="full"
        mt={4}
      >
        {filteredResourcesByOwner.map((item) => (
          <AccordionItem mb={4} key={item.owner}>
            <AccordionButton>
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
                      isSelected={selectedResources?.group === subitem.group}
                      onClick={() =>
                        handleSelectResource(item.owner, subitem.group)
                      }
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
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
};
