import {
  Flex,
  Heading,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { DelegationsSection } from "../../components/delegations";
import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import {
  useValidateAddress,
  useWasmConfig,
  useMobile,
  useInternalNavigate,
} from "lib/app-provider";
import { AssetsSection } from "lib/components/asset";
import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { useBalances } from "lib/services/balanceService";
import type { BechAddr32 } from "lib/types";
import { jsonPrettify } from "lib/utils";

import { CommandSection } from "./components/CommandSection";
import { ContractDesc } from "./components/contract-description";
import { ContractStates } from "./components/contract-states";
import { ContractTop } from "./components/ContractTop";
import { InstantiateInfo } from "./components/InstantiateInfo";
import { JsonInfo } from "./components/JsonInfo";
import { ContractTables } from "./components/tables";
import { useContractData } from "./data";
import { TabIndex, zContractDetailsQueryParams } from "./types";

const InvalidContract = () => <InvalidState title="Contract does not exist" />;

const tableHeaderId = "contractDetailsTab";

interface ContractDetailsBodyProps {
  contractAddress: BechAddr32;
  tab: TabIndex;
}

const ContractDetailsBody = observer(
  ({ contractAddress, tab }: ContractDetailsBodyProps) => {
    const isMobile = useMobile();
    const navigate = useInternalNavigate();

    // ------------------------------------------//
    // ------------------QUERIES-----------------//
    // ------------------------------------------//
    const {
      codeLocalInfo,
      contractLocalInfo,
      data: contractData,
      isLoading,
    } = useContractData(contractAddress);

    // const { totalData } = useBalanceInfos(contractAddress);
    const { data: balances, isLoading: isBalancesLoading } =
      useBalances(contractAddress);

    // ------------------------------------------//
    // -----------------CALLBACKS----------------//
    // ------------------------------------------//
    const handleTabChange = useCallback(
      (nextTab: TabIndex) => () => {
        if (nextTab === tab) return;
        trackUseTab(nextTab);
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

    if (isLoading) return <Loading withBorder />;
    if (!contractData) return <ErrorFetching dataName="contract information" />;
    if (contractData.contract === null) return <InvalidContract />;

    const { projectInfo, publicInfo, contract, contractRest } = contractData;
    return (
      <>
        <ContractTop
          contractAddress={contractAddress}
          projectInfo={projectInfo}
          publicInfo={publicInfo}
          contract={contract}
          contractLocalInfo={contractLocalInfo}
        />
        <Tabs
          index={Object.values(TabIndex).indexOf(tab)}
          isLazy
          lazyBehavior="keepMounted"
        >
          <TabList
            borderBottom="1px solid"
            borderColor="gray.700"
            overflowX="scroll"
            id={tableHeaderId}
          >
            <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
              Overview
            </CustomTab>
            <CustomTab
              onClick={handleTabChange(TabIndex.Assets)}
              count={balances?.length}
              isDisabled={balances?.length === 0}
              isLoading={isBalancesLoading}
            >
              Assets
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.Delegations)}>
              Delegations
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.TxsHistories)}>
              Transactions & Histories
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.States)}>
              Contract States
            </CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel p={0} pt={{ base: 4, md: 8 }}>
              <Flex flexDirection="column" gap={8}>
                <Flex direction="column" gap={4} mt={{ base: 4, md: 0 }}>
                  <ContractDesc
                    publicInfo={publicInfo}
                    contract={contract}
                    contractLocalInfo={contractLocalInfo}
                  />
                  <Flex
                    borderBottom={{ base: "0px", md: "1px solid" }}
                    borderBottomColor={{ base: "transparent", md: "gray.700" }}
                  >
                    <AssetsSection
                      address={contractAddress}
                      onViewMore={handleTabChange(TabIndex.Assets)}
                    />
                  </Flex>
                  <Flex
                    borderBottom={{ base: "0px", md: "1px solid" }}
                    borderBottomColor={{ base: "transparent", md: "gray.700" }}
                  >
                    <DelegationsSection
                      address={contractAddress}
                      onViewMore={handleTabChange(TabIndex.Delegations)}
                    />
                  </Flex>
                </Flex>
                {/* Query/Execute commands section */}
                <CommandSection
                  contractAddress={contractAddress}
                  codeHash={contract.codeHash}
                  codeId={contract.codeId}
                />
                {/* Instantiate/Contract Info Section */}
                <Flex direction="column" gap={6}>
                  {!isMobile && (
                    <Heading as="h6" variant="h6" minW="fit-content">
                      Contract Information
                    </Heading>
                  )}
                  <Flex
                    mb={12}
                    justify="space-between"
                    direction={{ base: "column", md: "row" }}
                  >
                    {/* Instantiate Info */}
                    <div>
                      {isMobile && (
                        <Heading as="h6" variant="h6" mb={6}>
                          Instantiate Info
                        </Heading>
                      )}
                      <InstantiateInfo
                        contract={contract}
                        contractRest={contractRest}
                        codeLocalInfo={codeLocalInfo}
                      />
                      <Button
                        size="sm"
                        variant="outline-primary"
                        mt={4}
                        pr={1}
                        onClick={handleTabChange(TabIndex.States)}
                      >
                        View Contract States
                        <CustomIcon name="chevron-right" boxSize={3} />
                      </Button>
                    </div>
                    <Flex
                      direction="column"
                      flex={0.8}
                      gap={4}
                      mt={{ base: 12, md: 0 }}
                    >
                      <JsonInfo
                        header="Contract Info"
                        jsonString={jsonPrettify(
                          JSON.stringify(contractRest?.contract_info ?? {})
                        )}
                      />
                      <JsonInfo
                        header="Instantiate Message"
                        jsonString={jsonPrettify(contract.initMsg)}
                        defaultExpand
                      />
                    </Flex>
                  </Flex>
                </Flex>
                <ContractTables contractAddress={contractAddress} />
              </Flex>
            </TabPanel>
            <TabPanel p={0}>
              <AssetsSection address={contractAddress} />
            </TabPanel>
            <TabPanel p={0}>
              <DelegationsSection address={contractAddress} />
            </TabPanel>
            <TabPanel px={0} pt={{ base: 5, md: 0 }}>
              <ContractTables contractAddress={contractAddress} />
            </TabPanel>
            <TabPanel px={0} pt={{ base: 5, md: 0 }}>
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
  const router = useRouter();
  const { validateContractAddress } = useValidateAddress();

  const validated = zContractDetailsQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_CONTRACT_DETAIL, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <PageContainer>
      {!validated.success ||
      validateContractAddress(validated.data.contractAddress) ? (
        <InvalidContract />
      ) : (
        <ContractDetailsBody {...validated.data} />
      )}
    </PageContainer>
  );
});

export default ContractDetails;
