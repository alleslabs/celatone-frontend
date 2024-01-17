/* eslint-disable complexity */
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

import { DelegationsSection } from "../../components/delegations";
import { AmpEvent, trackUseTab, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useGovConfig,
  useInternalNavigate,
  useMoveConfig,
  useNftConfig,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useAccountData } from "lib/services/accountService";
import { useModulesByAddress } from "lib/services/move/moduleService";
import { useResourcesByAddress } from "lib/services/move/resourceService";
import { useNftsCountByAccount } from "lib/services/nft";
import type { Addr, BechAddr, HexAddr, Option } from "lib/types";
import { truncate } from "lib/utils";

import { AccountHeader } from "./components/AccountHeader";
import { AssetsSection } from "./components/asset";
import { ModuleLists } from "./components/modules";
import { NftsOverview, NftsSection } from "./components/nfts";
import { ResourceOverview, ResourceSection } from "./components/resources";
import {
  AdminContractsTable,
  InstantiatedContractsTable,
  OpenedProposalsTable,
  StoredCodesTable,
  TxsTable,
} from "./components/tables";
import { UserAccountDesc } from "./components/UserAccountDesc";
import { useAccountDetailsTableCounts } from "./data";
import { TabIndex, zAccountDetailsQueryParams } from "./types";

const tableHeaderId = "accountDetailsTab";

export interface AccountDetailsBodyProps {
  accountAddressParam: Addr;
  tabParam: TabIndex;
}

const getAddressOnPath = (hexAddress: HexAddr, accountAddress: BechAddr) =>
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
  const nft = useNftConfig({ shouldRedirect: false });
  const navigate = useInternalNavigate();
  const { address: accountAddress, hex: hexAddress } =
    formatAddresses(accountAddressParam);

  // ------------------------------------------//
  // ------------------QUERIES-----------------//
  // ------------------------------------------//
  const { data: accountData } = useAccountData(accountAddress);

  const {
    tableCounts,
    refetchCounts,
    isLoading: isLoadingAccountTableCounts,
  } = useAccountDetailsTableCounts(accountAddress);
  // move
  const { data: modulesData, isFetching: isModulesLoading } =
    useModulesByAddress(accountAddress);
  const { data: resourcesData, isFetching: isResourceLoading } =
    useResourcesByAddress(accountAddress);
  // nft
  const { data: nftsCount, isFetching: isNftsCountLoading } =
    useNftsCountByAccount(hexAddress);

  // ------------------------------------------//
  // -----------------CALLBACKS----------------//
  // ------------------------------------------//
  const handleTabChange = useCallback(
    (nextTab: TabIndex, total: Option<number>) => () => {
      if (nextTab === tabParam) return;
      trackUseTab(nextTab, undefined, total?.toString());
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
        {accountData?.projectInfo && accountData?.publicInfo && (
          <Breadcrumb
            items={[
              { text: "Public Projects", href: "/projects" },
              {
                text: accountData.projectInfo.name,
                href: `/projects/${accountData.publicInfo.slug}`,
              },
              { text: truncate(accountAddress) },
            ]}
            mb={6}
          />
        )}
        <AccountHeader
          accountData={accountData}
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
          <CustomTab onClick={handleTabChange(TabIndex.Overview, undefined)}>
            Overview
          </CustomTab>
          <CustomTab
            count={tableCounts.assetsCount}
            isDisabled={tableCounts.assetsCount === 0}
            onClick={handleTabChange(TabIndex.Assets, undefined)}
          >
            Assets
          </CustomTab>
          <CustomTab
            onClick={handleTabChange(TabIndex.Delegations, undefined)}
            hidden={disableDelegation}
          >
            Delegations
          </CustomTab>
          <CustomTab
            count={nftsCount}
            isDisabled={nftsCount === 0}
            onClick={handleTabChange(TabIndex.Nfts, nftsCount)}
            isLoading={isNftsCountLoading}
            hidden={!nft.enabled}
          >
            NFTs
          </CustomTab>
          <CustomTab
            count={tableCounts.txsCount}
            isDisabled={tableCounts.txsCount === 0}
            onClick={handleTabChange(
              TabIndex.Txs,
              tableCounts.txsCount ?? undefined
            )}
            isLoading={isLoadingAccountTableCounts}
          >
            Transactions
          </CustomTab>
          <CustomTab
            count={tableCounts.codesCount}
            isDisabled={tableCounts.codesCount === 0}
            onClick={handleTabChange(
              TabIndex.Codes,
              tableCounts.codesCount ?? undefined
            )}
            isLoading={isLoadingAccountTableCounts}
            hidden={!wasm.enabled}
          >
            Codes
          </CustomTab>
          <CustomTab
            count={tableCounts.contractsCount}
            isDisabled={tableCounts.contractsCount === 0}
            onClick={handleTabChange(
              TabIndex.Contracts,
              tableCounts.contractsCount ?? undefined
            )}
            isLoading={isLoadingAccountTableCounts}
            hidden={!wasm.enabled}
          >
            Contracts
          </CustomTab>
          <CustomTab
            count={tableCounts.contractsAdminCount}
            isDisabled={tableCounts.contractsAdminCount === 0}
            onClick={handleTabChange(
              TabIndex.Admins,
              tableCounts.contractsAdminCount ?? undefined
            )}
            isLoading={isLoadingAccountTableCounts}
            hidden={!wasm.enabled}
          >
            Admins
          </CustomTab>
          <CustomTab
            count={resourcesData?.totalCount}
            isDisabled={resourcesData?.totalCount === 0}
            onClick={handleTabChange(
              TabIndex.Resources,
              resourcesData?.groupedByOwner.length
            )}
            isLoading={isResourceLoading}
            hidden={!move.enabled}
          >
            Resources
          </CustomTab>
          <CustomTab
            count={modulesData?.length}
            isDisabled={modulesData?.length === 0}
            onClick={handleTabChange(TabIndex.Modules, undefined)}
            isLoading={isModulesLoading}
            hidden={!move.enabled}
          >
            Modules
          </CustomTab>
          <CustomTab
            count={tableCounts.proposalsCount}
            isDisabled={tableCounts.proposalsCount === 0}
            onClick={handleTabChange(
              TabIndex.Proposals,
              tableCounts.proposalsCount ?? undefined
            )}
            isLoading={isLoadingAccountTableCounts}
            hidden={!gov.enabled}
          >
            Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <Flex direction="column" gap={{ base: 4, md: 4 }}>
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: 4, md: 6 }}
                mt={{ base: 0, md: 8 }}
              >
                {accountData?.publicInfo?.description && (
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
                      <CustomIcon
                        name="website"
                        ml={0}
                        mb={2}
                        color="gray.600"
                      />
                      <Text variant="body2" fontWeight={500} color="text.dark">
                        Public Account Description
                      </Text>
                    </Flex>
                    <Text variant="body2" color="text.main" mb={1}>
                      {accountData.publicInfo.description}
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
                  isAccount
                  address={accountAddress}
                  onViewMore={handleTabChange(TabIndex.Assets, undefined)}
                />
              </Flex>
              {!disableDelegation && (
                <Flex
                  borderBottom={{ base: "0px", md: "1px solid" }}
                  borderBottomColor={{ base: "transparent", md: "gray.700" }}
                >
                  <DelegationsSection
                    address={accountAddress}
                    onViewMore={handleTabChange(
                      TabIndex.Delegations,
                      undefined
                    )}
                  />
                </Flex>
              )}
            </Flex>
            {nft.enabled && (
              <NftsOverview
                totalCount={nftsCount}
                userAddress={hexAddress}
                onViewMore={handleTabChange(TabIndex.Nfts, nftsCount)}
              />
            )}
            <TxsTable
              address={accountAddress}
              scrollComponentId={tableHeaderId}
              refetchCount={refetchCounts}
              onViewMore={handleTabChange(
                TabIndex.Txs,
                tableCounts.txsCount ?? undefined
              )}
            />
            {wasm.enabled && (
              <>
                <StoredCodesTable
                  address={accountAddress}
                  scrollComponentId={tableHeaderId}
                  totalData={tableCounts.codesCount ?? undefined}
                  refetchCount={refetchCounts}
                  onViewMore={handleTabChange(
                    TabIndex.Codes,
                    tableCounts.codesCount ?? undefined
                  )}
                />
                <InstantiatedContractsTable
                  address={accountAddress}
                  scrollComponentId={tableHeaderId}
                  totalData={tableCounts.contractsCount ?? undefined}
                  refetchCount={refetchCounts}
                  onViewMore={handleTabChange(
                    TabIndex.Contracts,
                    tableCounts.contractsCount ?? undefined
                  )}
                />
                <AdminContractsTable
                  address={accountAddress}
                  scrollComponentId={tableHeaderId}
                  totalData={tableCounts.contractsAdminCount ?? undefined}
                  refetchCount={refetchCounts}
                  onViewMore={handleTabChange(
                    TabIndex.Admins,
                    tableCounts.contractsAdminCount ?? undefined
                  )}
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
                  onViewMore={handleTabChange(
                    TabIndex.Resources,
                    resourcesData?.groupedByOwner.length
                  )}
                />
                <ModuleLists
                  address={accountAddress}
                  totalCount={modulesData?.length}
                  modules={modulesData}
                  isLoading={isModulesLoading}
                  onViewMore={handleTabChange(TabIndex.Modules, undefined)}
                />
              </>
            )}
            {gov.enabled && (
              <OpenedProposalsTable
                address={accountAddress}
                scrollComponentId={tableHeaderId}
                totalData={tableCounts.proposalsCount ?? undefined}
                refetchCount={refetchCounts}
                onViewMore={handleTabChange(
                  TabIndex.Proposals,
                  tableCounts.proposalsCount ?? undefined
                )}
              />
            )}
          </TabPanel>
          <TabPanel p={0} mt={{ base: 0, md: 8 }}>
            <AssetsSection isAccount address={accountAddress} />
          </TabPanel>
          <TabPanel p={0} mt={{ base: 0, md: 8 }}>
            <DelegationsSection address={accountAddress} />
          </TabPanel>
          <TabPanel p={0}>
            <NftsSection address={hexAddress} totalData={nftsCount} />
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
              address={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.codesCount ?? undefined}
              refetchCount={refetchCounts}
            />
          </TabPanel>
          <TabPanel p={0}>
            <InstantiatedContractsTable
              address={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsCount ?? undefined}
              refetchCount={refetchCounts}
            />
          </TabPanel>
          <TabPanel p={0}>
            <AdminContractsTable
              address={accountAddress}
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
              address={accountAddress}
              totalCount={modulesData?.length}
              modules={modulesData}
              isLoading={isModulesLoading}
            />
          </TabPanel>
          <TabPanel p={0}>
            <OpenedProposalsTable
              address={accountAddress}
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

  const validated = zAccountDetailsQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_ACCOUNT_DETAILS, { tab: validated.data.tab });
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
