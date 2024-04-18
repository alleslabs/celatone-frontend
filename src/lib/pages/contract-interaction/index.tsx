import { Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import {
  ContractInteractionSwitch,
  ContractInteractionTabs,
} from "lib/components/ContractInteractionSwitch";
import PageContainer from "lib/components/PageContainer";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { getFirstQueryParam } from "lib/utils";

import ExecuteSection from "./components/execute/ExecuteSection";
import { InteractionWrapper } from "./components/InteractionWrapper";
import QuerySection from "./components/query/QuerySection";

export const ContractInteraction = () => {
  const router = useRouter();
  const isMobile = useMobile();
  const navigate = useInternalNavigate();

  const selectedType = getFirstQueryParam(
    router.query.selectedType
  ) as ContractInteractionTabs;
  const contract = getFirstQueryParam(router.query.contract);
  const handleSetSelectedType = useCallback(
    (newType: ContractInteractionTabs) =>
      navigate({
        pathname: "/contract-interaction",
        query: {
          selectedType: newType,
          ...(contract && { contract }),
        },
      }),
    [contract, navigate]
  );

  useEffect(() => {
    if (!selectedType) handleSetSelectedType(ContractInteractionTabs.QUERY);
  }, [handleSetSelectedType, selectedType]);

  return (
    <PageContainer>
      <Flex mt={1} mb={8} justify="space-between">
        <Flex align="center" justify="space-between" w="full">
          <Flex align="center" gap={4}>
            <Heading variant="h5" as="h5" alignSelf="flex-start">
              {isMobile ? "Query" : "Contract Interaction"}
            </Heading>
            {!isMobile && (
              <ContractInteractionSwitch
                currentTab={selectedType}
                onTabChange={handleSetSelectedType}
              />
            )}
          </Flex>
          <UserDocsLink isButton isDevTool href="cosmwasm/query-execute" />
        </Flex>
      </Flex>
      <InteractionWrapper
        currentTab={selectedType}
        queryContent={<QuerySection />}
        executeContent={<ExecuteSection />}
      />
    </PageContainer>
  );
};
