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

import { AmpEvent, useTrack } from "lib/amplitude";
import { useValidateAddress, useWasmConfig, useMobile } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { useContractDetailsTableCounts } from "lib/model/contract";
import { useAccountId } from "lib/services/accountService";
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
    const { data: contractAccountId } = useAccountId(contractAddress);
    const {
      tableCounts,
      refetchMigration,
      refetchTransactions,
      refetchRelatedProposals,
    } = useContractDetailsTableCounts(contractAddress, contractAccountId);
    const isMobile = useMobile();
    if (!contractData.contractDetail) return <InvalidContract />;

    return (
      <>
        <ContractTop contractAddress={contractAddress} {...contractData} />
        {/* Tokens Section */}
        <Flex direction="column" mt={{ base: 8, md: 4 }}>
          <TokenSection contractAddress={contractAddress} {...contractData} />
        </Flex>
        {/* Contract Description Section */}
        <ContractDesc {...contractData} />
        {/* Query/Execute commands section */}
        <CommandSection
          contractAddress={contractAddress}
          codeHash={contractData.contractDetail.codeHash}
          codeId={String(contractData.contractDetail.codeId)}
        />
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
          <InstantiateInfo
            isLoading={
              contractData.isContractDetailLoading ||
              contractData.isContractCw2InfoLoading ||
              contractData.isInstantiateDetailLoading
            }
            {...contractData}
          />
          {/* Contract Info (Expand) */}
          <Flex direction="column" flex={0.8} gap={4} mt={{ base: 12, md: 0 }}>
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
