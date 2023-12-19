import {
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, trackUseTab, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useGovConfig,
  useInternalNavigate,
  useMoveConfig,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useAccountDetailsTableCounts } from "lib/model/account";
import { useAccountInfo } from "lib/services/accountService";
import { useAPIAccountModules } from "lib/services/move/moduleService";
import { useAccountResources } from "lib/services/move/resourceService";
import type { Addr, HexAddr, HumanAddr } from "lib/types";
import { truncate } from "lib/utils";

import { AccountHeader } from "./components/AccountHeader";
import { AssetsSection } from "./components/asset";
import { DelegationsSection } from "./components/delegations";
import { ModuleLists } from "./components/modules";
import { ResourceOverview, ResourceSection } from "./components/resources";
import {
  AdminContractsTable,
  InstantiatedContractsTable,
  OpenedProposalsTable,
  StoredCodesTable,
  TxsTable,
} from "./components/tables";
import { UserAccountDesc } from "./components/UserAccountDesc";
import { TabIndex, zAccountDetailQueryParams } from "./types";

const tableHeaderId = "accountDetailsTab";

export interface AccountDetailsBodyProps {
  accountAddressParam: Addr;
  tabParam: TabIndex;
}

const getAddressOnPath = (hexAddress: HexAddr, accountAddress: HumanAddr) =>
  hexAddress === "0x1" ? hexAddress : accountAddress;

const InvalidAccount = () => <InvalidState title="Account does not exist" />;

const AccountDetailsBody = ({
  accountAddressParam,
  tabParam,
}: AccountDetailsBodyProps) => {
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const {
    chainConfig: {
      extra: { disableDelegation },
    },
  } = useCelatoneApp();
  const formatAddresses = useFormatAddresses();
  const gov = useGovConfig({ shouldRedirect: false });
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });
  const navigate = useInternalNavigate();
  const { address: accountAddress, hex: hexAddress } =
    formatAddresses(accountAddressParam);

  // ------------------------------------------//
  // ------------------QUERIES-----------------//
  // ------------------------------------------//
  const { data: accountInfo } = useAccountInfo(accountAddress);

  const {
    tableCounts,
    refetchCounts,
    isLoading: isLoadingAccountTableCounts,
  } = useAccountDetailsTableCounts(accountAddress);
  // move
  const { data: modulesData, isFetching: isModulesLoading } =
    useAPIAccountModules(accountAddress);
  const { data: resourcesData, isFetching: isResourceLoading } =
    useAccountResources(accountAddress);

  // ------------------------------------------//
  // -----------------CALLBACKS----------------//
  // ------------------------------------------//
  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tabParam) return;
      trackUseTab(nextTab);
      navigate({
        pathname: "/accounts/[accountAddress]/[tab]",
        query: {
          accountAddress: getAddressOnPath(hexAddress, accountAddress),
          tab: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [accountAddress, hexAddress, navigate, tabParam]
  );

  return (
    <>
      <Flex direction="column" mb={6}>
        {accountInfo?.projectInfo && accountInfo?.publicInfo && (
          <Breadcrumb
            items={[
              { text: "Public Projects", href: "/projects" },
              {
                text: accountInfo.projectInfo.name,
                href: `/projects/${accountInfo.publicInfo.slug}`,
              },
              { text: truncate(accountAddress) },
            ]}
            mb={6}
          />
        )}
        <AccountHeader
          accountInfo={accountInfo}
          accountAddress={accountAddress}
          hexAddress={hexAddress}
        />
      </Flex>

      <Tabs
        index={Object.values(TabIndex).indexOf(tabParam)}
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
            count={tableCounts.assetsCount}
            isDisabled={tableCounts.assetsCount === 0}
            onClick={handleTabChange(TabIndex.Assets)}
          >
            Assets
          </CustomTab>
          <CustomTab
            onClick={handleTabChange(TabIndex.Delegations)}
            hidden={disableDelegation}
          >
            Delegations
          </CustomTab>
          <CustomTab
            count={tableCounts.txsCount}
            isDisabled={tableCounts.txsCount === 0}
            onClick={handleTabChange(TabIndex.Txs)}
            isLoading={isLoadingAccountTableCounts}
          >
            Transactions
          </CustomTab>
          <CustomTab
            count={tableCounts.codesCount}
            isDisabled={tableCounts.codesCount === 0}
            onClick={handleTabChange(TabIndex.Codes)}
            isLoading={isLoadingAccountTableCounts}
            hidden={!wasm.enabled}
          >
            Codes
          </CustomTab>
          <CustomTab
            count={tableCounts.contractsCount}
            isDisabled={tableCounts.contractsCount === 0}
            onClick={handleTabChange(TabIndex.Contracts)}
            isLoading={isLoadingAccountTableCounts}
            hidden={!wasm.enabled}
          >
            Contracts
          </CustomTab>
          <CustomTab
            count={tableCounts.contractsAdminCount}
            isDisabled={tableCounts.contractsAdminCount === 0}
            onClick={handleTabChange(TabIndex.Admins)}
            isLoading={isLoadingAccountTableCounts}
            hidden={!wasm.enabled}
          >
            Admins
          </CustomTab>
          <CustomTab
            count={resourcesData?.totalCount}
            isDisabled={resourcesData?.totalCount === 0}
            onClick={handleTabChange(TabIndex.Resources)}
            hidden={!move.enabled}
          >
            Resources
          </CustomTab>
          <CustomTab
            count={modulesData?.length}
            isDisabled={modulesData?.length === 0}
            onClick={handleTabChange(TabIndex.Modules)}
            hidden={!move.enabled}
          >
            Modules
          </CustomTab>
          <CustomTab
            count={tableCounts.proposalsCount}
            isDisabled={tableCounts.proposalsCount === 0}
            isLoading={isLoadingAccountTableCounts}
            onClick={handleTabChange(TabIndex.Proposals)}
            hidden={!gov.enabled}
          >
            Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 4, md: 6 }}
              mt={{ base: 0, md: 8 }}
            >
              {accountInfo?.publicInfo?.description && (
                <Flex
                  direction="column"
                  bg="gray.900"
                  maxW="100%"
                  borderRadius="8px"
                  py={4}
                  px={4}
                  flex="1"
                >
                  <Flex alignItems="center" gap={1} minH="32px">
                    <CustomIcon name="website" ml={0} mb={2} color="gray.600" />
                    <Text variant="body2" fontWeight={500} color="text.dark">
                      Public Account Description
                    </Text>
                  </Flex>
                  <Text variant="body2" color="text.main" mb={1}>
                    {accountInfo.publicInfo.description}
                  </Text>
                </Flex>
              )}
              <UserAccountDesc address={accountAddress} />
            </Flex>
            <Flex
              borderBottom={{ base: "0px", md: "1px solid" }}
              borderBottomColor={{ base: "transparent", md: "gray.700" }}
            >
              <AssetsSection
                address={accountAddress}
                onViewMore={handleTabChange(TabIndex.Assets)}
              />
            </Flex>
            {!disableDelegation && (
              <Flex
                borderBottom={{ base: "0px", md: "1px solid" }}
                borderBottomColor={{ base: "transparent", md: "gray.700" }}
              >
                <DelegationsSection
                  walletAddress={accountAddress}
                  onViewMore={handleTabChange(TabIndex.Delegations)}
                />
              </Flex>
            )}
            <TxsTable
              address={accountAddress}
              scrollComponentId={tableHeaderId}
              refetchCount={refetchCounts}
              onViewMore={handleTabChange(TabIndex.Txs)}
            />
            {wasm.enabled && (
              <>
                <StoredCodesTable
                  walletAddress={accountAddress}
                  scrollComponentId={tableHeaderId}
                  totalData={tableCounts.codesCount ?? undefined}
                  refetchCount={refetchCounts}
                  onViewMore={handleTabChange(TabIndex.Codes)}
                />
                <InstantiatedContractsTable
                  walletAddress={accountAddress}
                  scrollComponentId={tableHeaderId}
                  totalData={tableCounts.contractsCount ?? undefined}
                  refetchCount={refetchCounts}
                  onViewMore={handleTabChange(TabIndex.Contracts)}
                />
                <AdminContractsTable
                  walletAddress={accountAddress}
                  scrollComponentId={tableHeaderId}
                  totalData={tableCounts.contractsAdminCount ?? undefined}
                  refetchCount={refetchCounts}
                  onViewMore={handleTabChange(TabIndex.Admins)}
                />
              </>
            )}
            {move.enabled && (
              <>
                <ResourceOverview
                  address={accountAddress}
                  totalCount={resourcesData?.totalCount}
                  resourcesByName={resourcesData?.groupedByName}
                  isLoading={isResourceLoading}
                  onViewMore={handleTabChange(TabIndex.Resources)}
                />
                <ModuleLists
                  totalCount={modulesData?.length}
                  selectedAddress={accountAddress}
                  modules={modulesData}
                  isLoading={isModulesLoading}
                  onViewMore={handleTabChange(TabIndex.Modules)}
                />
              </>
            )}
            {gov.enabled && (
              <OpenedProposalsTable
                walletAddress={accountAddress}
                scrollComponentId={tableHeaderId}
                totalData={tableCounts.proposalsCount ?? undefined}
                refetchCount={refetchCounts}
                onViewMore={handleTabChange(TabIndex.Proposals)}
              />
            )}
          </TabPanel>
          <TabPanel p={0}>
            <AssetsSection address={accountAddress} />
          </TabPanel>
          <TabPanel p={0}>
            <DelegationsSection walletAddress={accountAddress} />
          </TabPanel>
          <TabPanel p={0}>
            <TxsTable
              address={accountAddress}
              scrollComponentId={tableHeaderId}
              refetchCount={refetchCounts}
            />
          </TabPanel>
          <TabPanel p={0}>
            <StoredCodesTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.codesCount ?? undefined}
              refetchCount={refetchCounts}
            />
          </TabPanel>
          <TabPanel p={0}>
            <InstantiatedContractsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsCount ?? undefined}
              refetchCount={refetchCounts}
            />
          </TabPanel>
          <TabPanel p={0}>
            <AdminContractsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsAdminCount ?? undefined}
              refetchCount={refetchCounts}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ResourceSection
              address={accountAddress}
              totalCount={resourcesData?.totalCount}
              resourcesByOwner={resourcesData?.groupedByOwner}
              isLoading={isResourceLoading}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleLists
              totalCount={modulesData?.length}
              selectedAddress={accountAddress}
              modules={modulesData}
              isLoading={isModulesLoading}
            />
          </TabPanel>
          <TabPanel p={0}>
            <OpenedProposalsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.proposalsCount ?? undefined}
              refetchCount={refetchCounts}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

const AccountDetails = () => {
  const router = useRouter();
  const { isSomeValidAddress } = useValidateAddress();

  const validated = zAccountDetailQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_ACCOUNT_DETAIL, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <PageContainer>
      {!validated.success ||
      !isSomeValidAddress(validated.data.accountAddress) ? (
        <InvalidAccount />
      ) : (
        <AccountDetailsBody
          accountAddressParam={validated.data.accountAddress}
          tabParam={validated.data.tab}
        />
      )}
    </PageContainer>
  );
};

export default AccountDetails;
