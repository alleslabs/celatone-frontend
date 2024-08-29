/* eslint-disable complexity */
import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";

import { DelegationsSection } from "../../components/delegations";
import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import {
  useCurrentChain,
  useGovConfig,
  useInitia,
  useInternalNavigate,
  useMoveConfig,
  useNftConfig,
  useTierConfig,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import { AssetsSection } from "lib/components/asset";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomTab } from "lib/components/CustomTab";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { InvalidState } from "lib/components/state";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useAccountDelegationInfos } from "lib/model/account";
import { useAccountStore } from "lib/providers/store";
import { useAccountData } from "lib/services/account";
import { useModulesByAddress } from "lib/services/move/module";
import { useResourcesByAddressLcd } from "lib/services/move/resource";
import {
  useNftsByAccountByCollectionSequencer,
  useNftsCountByAccount,
} from "lib/services/nft";
import { useInitiaUsernameByAddress } from "lib/services/username";
import type { Addr, BechAddr, HexAddr, Option } from "lib/types";
import { truncate } from "lib/utils";

import { AccountHeader } from "./components/AccountHeader";
import { ModuleLists } from "./components/modules";
import {
  NftsOverview,
  NftsSectionFull,
  NftsSectionSequencer,
} from "./components/nfts";
import { PublicAccountDesc } from "./components/PublicAccountDesc";
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
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: AccountDetailsBodyProps) => {
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const navigate = useInternalNavigate();
  const { isFullTier, isSequencerTier } = useTierConfig();
  const gov = useGovConfig({ shouldRedirect: false });
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });
  const nft = useNftConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  const formatAddresses = useFormatAddresses();
  const { address: accountAddress, hex: hexAddress } =
    formatAddresses(accountAddressParam);

  // ------------------------------------------//
  // ------------------QUERIES-----------------//
  // ------------------------------------------//
  const { data: accountData } = useAccountData(accountAddress);
  const { getAccountLocalInfo } = useAccountStore();
  const accountLocalInfo = getAccountLocalInfo(accountAddress);
  const {
    tableCounts,
    refetchCounts,
    isLoading: isLoadingAccountTableCounts,
  } = useAccountDetailsTableCounts(accountAddress);
  // gov
  const { isTotalBondedLoading, totalBonded } =
    useAccountDelegationInfos(accountAddress);
  // move
  const { data: modulesData, isFetching: isModulesLoading } =
    useModulesByAddress({ address: accountAddress });
  const { data: resourcesData, isFetching: isResourceLoading } =
    useResourcesByAddressLcd(accountAddress);
  // nft
  const { data: nftsCount, isFetching: isNftsCountLoading } =
    useNftsCountByAccount(hexAddress, isFullTier && nft.enabled);

  const { data: accountNfts } = useNftsByAccountByCollectionSequencer(
    hexAddress,
    undefined,
    undefined,
    isSequencerTier
  );

  const totalNfts = nftsCount ?? accountNfts?.total;

  const hasTotalBonded =
    !isTotalBondedLoading &&
    totalBonded &&
    Object.keys(totalBonded).length === 0;

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

  const { address } = useCurrentChain();
  const {
    data: initiaUsernameData,
    isLoading: isInitiaUsernameDataLoading,
    isFetching: isInitiaUsernameDataFetching,
  } = useInitiaUsernameByAddress(hexAddress, isInitia);

  const nftEnabled = nft.enabled && (isFullTier || isSequencerTier);

  const pageTitle = useMemo(() => {
    switch (true) {
      case address === accountAddress:
        return "Your Account Detail";
      case hexAddress === "0x1":
        return "0x1 Page";
      case !!accountData?.icns?.primaryName:
        return `${accountData.icns.primaryName} (Account)`;
      case !!initiaUsernameData?.username && move.enabled:
        return `${initiaUsernameData.username} (Account)`;
      default:
        return `Account - ${truncate(accountAddress)}`;
    }
  }, [
    accountAddress,
    accountData?.icns?.primaryName,
    address,
    initiaUsernameData?.username,
    hexAddress,
    move.enabled,
  ]);

  return (
    <>
      <CelatoneSeo pageName={pageTitle} />
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
          initiaUsernameData={initiaUsernameData}
          isInitiaUsernameDataLoading={isInitiaUsernameDataLoading}
          isInitiaUsernameDataFetching={isInitiaUsernameDataFetching}
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
            hidden={!gov.enabled}
            isDisabled={hasTotalBonded}
          >
            Delegations
          </CustomTab>
          <CustomTab
            count={totalNfts}
            isDisabled={nftsCount === 0}
            onClick={handleTabChange(TabIndex.Nfts, totalNfts)}
            isLoading={isNftsCountLoading}
            hidden={!nftEnabled}
          >
            NFTs
          </CustomTab>
          <CustomTab
            count={isFullTier ? tableCounts.txsCount : undefined}
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
            hidden={!wasm.enabled || !isFullTier}
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
            hidden={!wasm.enabled || !isFullTier}
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
            count={modulesData?.total}
            isDisabled={modulesData?.total === 0}
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
            hidden={!gov.enabled || !isFullTier}
          >
            Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            {(accountData?.publicInfo || accountLocalInfo) && (
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: 4, md: 6 }}
                mt={{ base: 0, md: 8 }}
              >
                {accountData?.publicInfo?.description && (
                  <PublicAccountDesc
                    description={accountData?.publicInfo?.description}
                  />
                )}
                {accountLocalInfo?.description && (
                  <UserAccountDesc accountLocalInfo={accountLocalInfo} />
                )}
              </Flex>
            )}
            <Flex
              mt={{ base: 4 }}
              borderBottom={{ base: "0px", md: "1px solid" }}
              borderBottomColor={{ base: "transparent", md: "gray.700" }}
            >
              <AssetsSection
                isAccount
                address={accountAddress}
                onViewMore={handleTabChange(TabIndex.Assets, undefined)}
              />
            </Flex>
            {gov.enabled && (
              <Flex
                mt={{ base: 4, md: 8 }}
                borderBottom={{ base: "0px", md: "1px solid" }}
                borderBottomColor={{ base: "transparent", md: "gray.700" }}
              >
                <DelegationsSection
                  address={accountAddress}
                  onViewMore={handleTabChange(TabIndex.Delegations, undefined)}
                />
              </Flex>
            )}
            {nftEnabled && (
              <NftsOverview
                totalCount={totalNfts}
                userAddress={hexAddress}
                onViewMore={handleTabChange(TabIndex.Nfts, totalNfts)}
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
                {isFullTier && (
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
                )}
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
                {isFullTier && (
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
                )}
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
                  totalCount={modulesData?.total}
                  modules={modulesData?.items}
                  isLoading={isModulesLoading}
                  onViewMore={handleTabChange(TabIndex.Modules, undefined)}
                />
              </>
            )}
            {gov.enabled && isFullTier && (
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
            <UserDocsLink
              title="What is an Account?"
              cta="Read more about Account"
              href="general/accounts/detail-page"
            />
          </TabPanel>
          <TabPanel p={0} mt={{ base: 0, md: 8 }}>
            <AssetsSection isAccount address={accountAddress} />
            <UserDocsLink
              title="What is Supported and Unsupported Assets?"
              cta="Read more about Assets"
              href="general/accounts/detail-page#assets"
            />
          </TabPanel>
          <TabPanel p={0} mt={{ base: 0, md: 8 }}>
            <DelegationsSection address={accountAddress} />
            <UserDocsLink
              title="What is Delegations, Total Bonded, Rewards?"
              cta="Read more about Delegations"
              href="general/accounts/detail-page#staking"
            />
          </TabPanel>
          <TabPanel p={0}>
            <TierSwitcher
              full={
                <NftsSectionFull address={hexAddress} totalData={totalNfts} />
              }
              sequencer={
                <NftsSectionSequencer
                  address={hexAddress}
                  totalData={totalNfts}
                />
              }
            />
            <UserDocsLink
              title="What is NFTs in the account?"
              cta="Read more about NFTs in Account"
              href="general/accounts/detail-page#nfts"
            />
          </TabPanel>
          <TabPanel p={0}>
            <TxsTable
              address={accountAddress}
              scrollComponentId={tableHeaderId}
              refetchCount={refetchCounts}
            />
            <UserDocsLink
              title="What is transactions related to the account?"
              cta="Read more about Account Transactions"
              href="general/accounts/detail-page#transactions"
            />
          </TabPanel>
          <TabPanel p={0}>
            <StoredCodesTable
              address={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.codesCount ?? undefined}
              refetchCount={refetchCounts}
            />
            <UserDocsLink
              title="What is Stored Codes in the account?"
              cta="Read more about Stored Codes in Account"
              href="general/accounts/detail-page#codes"
            />
          </TabPanel>
          <TabPanel p={0}>
            <InstantiatedContractsTable
              address={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsCount ?? undefined}
              refetchCount={refetchCounts}
            />
            <UserDocsLink
              title="What is contract instances in the account?"
              cta="Read more about Contracts in Account"
              href="general/accounts/detail-page#contracts"
            />
          </TabPanel>
          <TabPanel p={0}>
            <AdminContractsTable
              address={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsAdminCount ?? undefined}
              refetchCount={refetchCounts}
            />
            <UserDocsLink
              title="What is contract admins in the account?"
              cta="Read more about Account Contract Admins"
              href="general/accounts/detail-page#contracts-admin"
            />
          </TabPanel>
          <TabPanel p={0}>
            <ResourceSection
              address={accountAddress}
              totalCount={resourcesData?.totalCount}
              resourcesByOwner={resourcesData?.groupedByOwner}
              isLoading={isResourceLoading}
            />
            <UserDocsLink
              title="What is resources?"
              cta="Read more about Resources in Account"
              href="general/accounts/detail-page#resources"
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleLists
              address={accountAddress}
              totalCount={modulesData?.total}
              modules={modulesData?.items}
              isLoading={isModulesLoading}
            />
            <UserDocsLink
              title="What is modules?"
              cta="Read more about Modules in Account"
              href="general/accounts/detail-page#modules"
            />
          </TabPanel>
          <TabPanel p={0}>
            <OpenedProposalsTable
              address={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.proposalsCount ?? undefined}
              refetchCount={refetchCounts}
            />
            <UserDocsLink
              title="What is Opened Proposals in the account?"
              cta="Read more about Opened Proposals"
              href="general/accounts/detail-page#proposals"
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
