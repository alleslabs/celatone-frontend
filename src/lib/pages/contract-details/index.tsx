import {
  Flex,
  Heading,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, useTrack } from "lib/amplitude";
import {
  useValidateAddress,
  useWasmConfig,
  useMobile,
  useInternalNavigate,
} from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { useContractDetailsTableCounts } from "lib/model/contract";
import { useAccountId } from "lib/services/accountService";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam, jsonPrettify } from "lib/utils";

import { CommandSection } from "./components/CommandSection";
import { ContractDesc } from "./components/contract-description";
import { ContractStates } from "./components/contract-state";
import { ContractTop } from "./components/ContractTop";
import { InstantiateInfo } from "./components/InstantiateInfo";
import { JsonInfo } from "./components/JsonInfo";
import {
  RelatedProposalsTable,
  TxsTable,
  MigrationTable,
} from "./components/tables";
import { TokenSection } from "./components/TokenSection";
import { useContractData } from "./data";
import type { ContractData } from "./types";

const tableTabHeaderId = "contractDetailTab";

enum TabIndex {
  Overview = "overview",
  Assets = "assets",
  Txs = "txs",
  States = "states",
}

interface ContractDetailsBodyProps {
  contractAddress: ContractAddr;
  contractData: ContractData;
}

const InvalidContract = () => <InvalidState title="Contract does not exist" />;

const ContractTxsTable = observer(
  ({ contractAddress, contractData }: ContractDetailsBodyProps) => {
    const tableHeaderId = "contractDetailsTableHeader";
    const { data: contractAccountId } = useAccountId(contractAddress);
    const {
      tableCounts,
      refetchMigration,
      refetchTransactions,
      refetchRelatedProposals,
    } = useContractDetailsTableCounts(contractAddress, contractAccountId);
    if (!contractData.contractDetail) return <InvalidContract />;
    return (
      <Flex direction="column">
        {/* History Table section */}
        <Heading as="h6" variant="h6" mb={6} id={tableHeaderId}>
          Transaction & History
        </Heading>
        <Tabs isLazy lazyBehavior="keepMounted">
          <TabList
            borderBottom="1px solid"
            borderColor="gray.700"
            overflowX={{ base: "scroll", md: "auto" }}
          >
            <CustomTab count={tableCounts.transactionsCount}>
              Transactions
            </CustomTab>
            <CustomTab count={tableCounts.migrationCount}>Migrations</CustomTab>
            <CustomTab
              count={tableCounts.relatedProposalsCount}
              whiteSpace="nowrap"
            >
              Related Proposals
            </CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <TxsTable
                contractAccountId={contractAccountId}
                scrollComponentId={tableHeaderId}
                totalData={tableCounts.transactionsCount}
                refetchCount={refetchTransactions}
              />
            </TabPanel>
            <TabPanel p={0}>
              <MigrationTable
                contractAddress={contractAddress}
                scrollComponentId={tableHeaderId}
                totalData={tableCounts.migrationCount}
                refetchCount={refetchMigration}
              />
            </TabPanel>
            <TabPanel p={0}>
              <RelatedProposalsTable
                contractAddress={contractAddress}
                scrollComponentId={tableHeaderId}
                totalData={tableCounts.relatedProposalsCount}
                refetchCount={refetchRelatedProposals}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    );
  }
);

const ContractStateShortcut = ({ onViewMore }: { onViewMore: () => void }) => {
  return (
    <Flex
      onClick={onViewMore}
      border="2px solid"
      borderColor="gray.700"
      borderRadius="8px"
      p={4}
      mt={12}
      alignItems="center"
      justifyContent="space-between"
      w="full"
      cursor="pointer"
      transition="all 0.25s ease-in-out"
      _hover={{ bgColor: "gray.900" }}
    >
      <Flex alignItems="center" gap={3}>
        <CustomIcon name="contract-list" color="gray.600" boxSize={6} />
        <div>
          <Text variant="body1" fontWeight={600}>
            View Contracts States
          </Text>
          <Text variant="body2" color="text.dark" fontWeight={600}>
            Access the current contract states information
          </Text>
        </div>
      </Flex>
      <CustomIcon name="chevron-right" color="gray.600" boxSize={6} />
    </Flex>
  );
};

const ContractDetailsBody = observer(
  ({ contractAddress, contractData }: ContractDetailsBodyProps) => {
    const tableHeaderId = "contractDetailsTableHeader";
    const isMobile = useMobile();
    const router = useRouter();
    const tab = getFirstQueryParam(router.query.tab) as TabIndex;
    const navigate = useInternalNavigate();
    const handleTabChange = useCallback(
      (nextTab: TabIndex) => () => {
        if (nextTab === tab) return;
        navigate({
          pathname: "/contracts/[contractAddress]/[tab]",
          query: {
            contractAddress,
            tab: nextTab,
          },
          options: {
            shallow: true,
          },
        });
      },
      [contractAddress, tab, navigate]
    );
    useEffect(() => {
      if (router.isReady && (!tab || !Object.values(TabIndex).includes(tab))) {
        navigate({
          replace: true,
          pathname: "/contracts/[contractAddress]/[tab]",
          query: {
            contractAddress,
            tab: TabIndex.Overview,
          },
          options: {
            shallow: true,
          },
        });
      }
    }, [router.isReady, tab, contractAddress, navigate]);

    if (!contractData.contractDetail) return <InvalidContract />;

    return (
      <>
        <ContractTop contractAddress={contractAddress} {...contractData} />
        <Tabs isLazy>
          <TabList
            mt={6}
            mb={8}
            borderBottom="1px solid"
            borderColor="gray.700"
            overflowX="scroll"
            id={tableTabHeaderId}
          >
            <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
              Overview
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Assets)}>
              Assets
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Txs)}>
              Transaction & History
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.States)}>
              Contract States
            </CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <Flex flexDirection="column" gap={8}>
                {/* Contract Description Section */}
                <ContractDesc {...contractData} />
                {/* Tokens Section */}
                <TokenSection
                  contractAddress={contractAddress}
                  {...contractData}
                  onViewMore={handleTabChange(TabIndex.Assets)}
                />
                {/* Query/Execute commands section */}
                <CommandSection
                  contractAddress={contractAddress}
                  codeHash={contractData.contractDetail.codeHash}
                  codeId={contractData.contractDetail.codeId.toString()}
                />
                {/* Instantiate/Contract Info Section */}
                <Heading as="h6" variant="h6" minW="fit-content">
                  Contract Information
                </Heading>
                <Flex
                  mb={12}
                  mt={6}
                  justify="space-between"
                  direction={{ base: "column", md: "row" }}
                >
                  {/* Instantiate Info */}
                  {isMobile && (
                    <Heading as="h6" variant="h6" mb={6} id={tableHeaderId}>
                      Instantiate Info
                    </Heading>
                  )}
                  <InstantiateInfo
                    isLoading={
                      contractData.isContractDetailLoading ||
                      contractData.isContractCw2InfoLoading ||
                      contractData.isInstantiateDetailLoading
                    }
                    {...contractData}
                  />
                  {/* Contract Info (Expand) */}
                  <Flex
                    direction="column"
                    flex={0.8}
                    gap={4}
                    mt={{ base: 12, md: 0 }}
                  >
                    <JsonInfo
                      header="Contract Info"
                      jsonString={jsonPrettify(
                        JSON.stringify(
                          contractData.rawContractResponse?.contract_info ?? {}
                        )
                      )}
                      isLoading={contractData.isRawContractResponseLoading}
                    />
                    <JsonInfo
                      header="Instantiate Message"
                      jsonString={jsonPrettify(contractData.initMsg ?? "")}
                      isLoading={contractData.isInstantiateDetailLoading}
                      defaultExpand
                    />
                  </Flex>
                </Flex>
                <ContractTxsTable
                  contractAddress={contractAddress}
                  contractData={contractData}
                />
                <ContractStateShortcut
                  onViewMore={handleTabChange(TabIndex.States)}
                />
              </Flex>
            </TabPanel>
            <TabPanel p={0}>
              <TokenSection
                contractAddress={contractAddress}
                isDetailPage
                {...contractData}
              />
            </TabPanel>
            <TabPanel p={0}>
              <ContractTxsTable
                contractAddress={contractAddress}
                contractData={contractData}
              />
            </TabPanel>
            <TabPanel p={0}>
              <ContractStates contractAddress={contractAddress} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    );
  }
);

const ContractDetails = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const { track } = useTrack();
  const router = useRouter();
  const { validateContractAddress } = useValidateAddress();
  const contractAddressParam = getFirstQueryParam(
    router.query.contractAddress
  ) as ContractAddr;
  const contractData = useContractData(contractAddressParam);

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_CONTRACT_DETAIL);
  }, [router.isReady, track]);

  if (contractData.isContractDetailLoading) return <Loading withBorder />;
  return (
    <PageContainer>
      {validateContractAddress(contractAddressParam) ? (
        <InvalidContract />
      ) : (
        <ContractDetailsBody
          contractAddress={contractAddressParam}
          contractData={contractData}
        />
      )}
    </PageContainer>
  );
});

export default ContractDetails;
