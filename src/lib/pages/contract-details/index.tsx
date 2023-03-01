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

import { useValidateAddress } from "lib/app-provider";
import { BackButton } from "lib/components/button";
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

    if (!contractData.instantiateInfo) return <InvalidContract />;

    return (
      <>
        <ContractTop contractData={contractData} />
        {/* Tokens Section */}
        <Flex direction="column">
          <TokenSection balances={contractData.balances} />
        </Flex>
        {/* Contract Description Section */}
        <ContractDesc contractData={contractData} />
        {/* Query/Execute commands section */}
        <CommandSection />
        {/* Instantiate/Contract Info Section */}
        <Flex my={12} justify="space-between">
          {/* Instantiate Info */}
          <InstantiateInfo contractData={contractData} />
          {/* Contract Info (Expand) */}
          <Flex direction="column" flex={0.8} gap={4}>
            <JsonInfo
              header="Contract Info"
              jsonString={jsonPrettify(
                JSON.stringify(
                  contractData.instantiateInfo?.raw.contract_info ?? {}
                )
              )}
              jsonAreaHeight="230px"
            />
            <JsonInfo
              header="Instantiate Message"
              jsonString={jsonPrettify(contractData.initMsg ?? "")}
              showViewFullButton
              defaultExpand
            />
          </Flex>
        </Flex>
        {/* History Table section */}
        <Heading as="h6" variant="h6" mb={6} id={tableHeaderId}>
          History
        </Heading>
        <Tabs>
          <TabList borderBottom="1px solid" borderColor="pebble.700">
            <CustomTab count={tableCounts.transactionsCount}>
              Transactions
            </CustomTab>
            {/* <CustomTab count={tableCounts.executeCount}>Executes</CustomTab> */}
            <CustomTab count={tableCounts.migrationCount}>Migration</CustomTab>
            <CustomTab count={tableCounts.relatedProposalsCount}>
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
            {/* Remove execute table for now */}
            {/* <TabPanel p={0}>
              <ExecuteTxsTable
                contractAddress={contractAddress}
                scrollComponentId={tableHeaderId}
                totalData={tableCounts.executeCount}
                refetchCount={refetchExecute}
              />
            </TabPanel> */}
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
      <BackButton />
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
