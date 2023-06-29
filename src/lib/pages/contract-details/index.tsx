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

import { useValidateAddress, useWasmConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { useContractDetailsTableCounts } from "lib/model/contract";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { ContractAddr } from "lib/types";
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
import { useContractData } from "./data";
import type { ContractData } from "./types";

interface ContractDetailsBodyProps {
  contractAddress: ContractAddr;
  contractData: ContractData;
}

const InvalidContract = () => <InvalidState title="Contract does not exist" />;

const ContractDetailsBody = observer(
  ({ contractAddress, contractData }: ContractDetailsBodyProps) => {
    const tableHeaderId = "contractDetailsTableHeader";
    const {
      tableCounts,
      refetchMigration,
      refetchTransactions,
      refetchRelatedProposals,
    } = useContractDetailsTableCounts(contractAddress);

    if (!contractData.contractDetail) return <InvalidContract />;

    return (
      <>
        <ContractTop contractAddress={contractAddress} {...contractData} />
        {/* Tokens Section */}
        <Flex direction="column">
          <TokenSection contractAddress={contractAddress} {...contractData} />
        </Flex>
        {/* Contract Description Section */}
        <ContractDesc {...contractData} />
        {/* Query/Execute commands section */}
        <CommandSection contractAddress={contractAddress} />
        {/* Instantiate/Contract Info Section */}
        <Flex my={12} justify="space-between">
          {/* Instantiate Info */}
          <InstantiateInfo
            isLoading={
              contractData.isContractDetailLoading ||
              contractData.isContractCw2InfoLoading ||
              contractData.isInstantiateDetailLoading
            }
            {...contractData}
          />
          {/* Contract Info (Expand) */}
          <Flex direction="column" flex={0.8} gap={4}>
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
        {/* History Table section */}
        <Heading as="h6" variant="h6" mb={6} id={tableHeaderId}>
          History
        </Heading>
        <Tabs>
          <TabList borderBottom="1px solid" borderColor="gray.700">
            <CustomTab count={tableCounts.transactionsCount}>
              Transactions
            </CustomTab>
            <CustomTab count={tableCounts.migrationCount}>Migrations</CustomTab>
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
  const contractData = useContractData(contractAddressParam);

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_CONTRACT_DETAIL);
  }, [router.isReady]);

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
