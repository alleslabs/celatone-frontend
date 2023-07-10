import {
  Flex,
  Heading,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useValidateAddress, useWasmConfig, useMobile } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import {
  useContractData,
  useContractDetailsTableCounts,
} from "lib/model/contract";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { ContractAddr, ContractData } from "lib/types";
import { getFirstQueryParam, jsonPrettify } from "lib/utils";

import { CommandSection } from "./components/CommandSection";
import { ContractDesc } from "./components/contract-description";
import { ContractTop } from "./components/ContractTop";
import { InstantiateInfo } from "./components/InstantiateInfo";
import { JsonInfo } from "./components/JsonInfo";
import {
  RelatedProposalsTable,
  TxsTable,
  MigrationTable,
} from "./components/tables";
import { TokenSection } from "./components/TokenSection";

interface ContractDetailsBodyProps {
  contractData: ContractData;
  contractAddress: ContractAddr;
}

const InvalidContract = () => <InvalidState title="Contract does not exist" />;

const ContractDetailsBody = observer(
  ({ contractData, contractAddress }: ContractDetailsBodyProps) => {
    const tableHeaderId = "contractDetailsTableHeader";
    const {
      tableCounts,
      refetchMigration,
      refetchTransactions,
      refetchRelatedProposals,
    } = useContractDetailsTableCounts(contractAddress);
    const isMobile = useMobile();
    if (!contractData.instantiateInfo) return <InvalidContract />;

    return (
      <>
        <ContractTop contractData={contractData} />
        {/* Tokens Section */}
        <Flex direction="column" mt={{ base: 8, md: 4 }}>
          <TokenSection balances={contractData.balances} />
        </Flex>
        {/* Contract Description Section */}
        <ContractDesc contractData={contractData} />
        {/* Query/Execute commands section */}
        <CommandSection />
        {/* Instantiate/Contract Info Section */}
        <Flex
          my={12}
          justify="space-between"
          direction={{ base: "column", md: "row" }}
        >
          {/* Instantiate Info */}
          {isMobile && (
            <Heading as="h6" variant="h6" mb={6} id={tableHeaderId}>
              Instantiate Info
            </Heading>
          )}
          <InstantiateInfo contractData={contractData} />
          {/* Contract Info (Expand) */}
          <Flex direction="column" flex={0.8} gap={4} mt={{ base: 12, md: 0 }}>
            <JsonInfo
              header="Contract Info"
              jsonString={jsonPrettify(
                JSON.stringify(
                  contractData.instantiateInfo?.raw.contract_info ?? {}
                )
              )}
            />
            <JsonInfo
              header="Instantiate Message"
              jsonString={jsonPrettify(contractData.initMsg ?? "")}
              defaultExpand
            />
          </Flex>
        </Flex>
        {/* History Table section */}
        <Heading as="h6" variant="h6" mb={6} id={tableHeaderId}>
          History
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
                contractAddress={contractAddress}
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
      </>
    );
  }
);

const ContractDetails = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const { validateContractAddress } = useValidateAddress();
  const contractAddressParam = getFirstQueryParam(
    router.query.contractAddress
  ) as ContractAddr;
  const { isLoading, contractData } = useContractData(contractAddressParam);
  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_CONTRACT_DETAIL);
  }, [router.isReady]);

  if (isLoading) return <Loading />;
  return (
    <PageContainer>
      {validateContractAddress(contractAddressParam) ? (
        <InvalidContract />
      ) : (
        <ContractDetailsBody
          contractData={contractData}
          contractAddress={contractAddressParam}
        />
      )}
    </PageContainer>
  );
});

export default ContractDetails;
