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

import { BackButton } from "lib/components/button/BackButton";
import { CustomTab } from "lib/components/CustomTab";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state/InvalidState";
import { useValidateAddress } from "lib/hooks";
import {
  useContractData,
  useContractDetailsTableCounts,
} from "lib/model/contract";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam, jsonPrettify } from "lib/utils";

import { CommandSection } from "./components/CommandSection";
import { ContractDesc } from "./components/contract-description/ContractDesc";
import { ContractTop } from "./components/ContractTop";
import { InstantiateInfo } from "./components/InstantiateInfo";
import { JsonInfo } from "./components/JsonInfo";
import { ExecuteTable } from "./components/tables/execute";
import { MigrationTable } from "./components/tables/migration";
import { RelatedProposalsTable } from "./components/tables/related-proposals";
import { TransactionsTable } from "./components/tables/transactions";
import { TokenSection } from "./components/token/TokenSection";

interface ContractDetailsBodyProps {
  contractAddress: ContractAddr;
}

const InvalidContract = () => <InvalidState title="Contract does not exist" />;

const ContractDetailsBody = ({ contractAddress }: ContractDetailsBodyProps) => {
  const contractData = useContractData(contractAddress);
  const tableHeaderId = "contractDetailTableHeader";
  const {
    tableCounts,
    refetchExecute,
    refetchMigration,
    refetchTransactions,
    refetchRelatedProposals,
  } = useContractDetailsTableCounts(contractAddress);

  if (!contractData) return <InvalidContract />;

  return (
    <>
      <ContractTop contractData={contractData} />
      {/* Tokens Section */}
      <Flex direction="column">
        <Text variant="body2" color="text.dark" mb={1} fontWeight={500}>
          Assets
        </Text>
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
            jsonAreaHeight="180px"
          />
          <JsonInfo
            header="Instantiate Messages"
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
        <TabList borderBottom="1px solid" borderColor="divider.main">
          <CustomTab count={tableCounts.transactionsCount}>
            Transactions
          </CustomTab>
          <CustomTab count={tableCounts.executeCount}>Executes</CustomTab>
          <CustomTab count={tableCounts.migrationCount}>Migration</CustomTab>
          <CustomTab count={tableCounts.relatedProposalsCount}>
            Related Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <TransactionsTable
              contractAddress={contractAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.transactionsCount}
              refetchCount={refetchTransactions}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ExecuteTable
              contractAddress={contractAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.executeCount}
              refetchCount={refetchExecute}
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
};

const ContractDetails = observer(() => {
  const router = useRouter();
  const { validateContractAddress } = useValidateAddress();

  const contractAddressParam = getFirstQueryParam(router.query.contractAddress);

  return (
    <PageContainer>
      <BackButton />
      {validateContractAddress(contractAddressParam) ? (
        <InvalidContract />
      ) : (
        <ContractDetailsBody
          contractAddress={contractAddressParam as ContractAddr}
        />
      )}
    </PageContainer>
  );
});

export default ContractDetails;
