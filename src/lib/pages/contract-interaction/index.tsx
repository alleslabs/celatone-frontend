import { Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";

import {
  ContractInteractionSwitch,
  ContractInteractionTabs,
} from "lib/components/ContractInteractionSwitch";
import PageContainer from "lib/components/PageContainer";
import { UserDocsLink } from "lib/components/UserDocsLink";

import ExecuteSection from "./components/ExecuteSection";
import { InteractionWrapper } from "./components/InteractionWrapper";
import QuerySection from "./components/QuerySection";

export const ContractInteraction = () => {
  const [selectedInteractionType, setSelectedInteractionType] =
    useState<ContractInteractionTabs>(ContractInteractionTabs.QUERY);

  return (
    <PageContainer>
      <Flex mt={1} mb={8} justify="space-between">
        <Flex align="center" justify="space-between" w="full">
          <Flex align="center" gap={4}>
            <Heading variant="h5" as="h5" alignSelf="flex-start">
              Contract Interaction
            </Heading>
            <ContractInteractionSwitch
              currentTab={selectedInteractionType}
              onTabChange={setSelectedInteractionType}
            />
          </Flex>
          <UserDocsLink isButton isSmall href="cosmwasm/query-execute" />
        </Flex>
      </Flex>
      <InteractionWrapper
        currentTab={selectedInteractionType}
        queryContent={<QuerySection />}
        executeContent={<ExecuteSection />}
      />
    </PageContainer>
  );
};
