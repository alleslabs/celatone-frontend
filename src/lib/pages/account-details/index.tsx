import type { Addr, BechAddr, HexAddr, Option } from "lib/types";

import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
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
import { Loading } from "lib/components/Loading";
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
import { useResourcesByAddressRest } from "lib/services/move/resource";
import {
  useNftsByAccountAddress,
  useNftsByAccountByCollectionSequencer,
} from "lib/services/nft";
import { useInitiaUsernameByAddress } from "lib/services/username";
import { truncate } from "lib/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";

import { DelegationsSection } from "../../components/delegations";
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
import { useAccountRedirect } from "./hooks";
import { TabIndex, zAccountDetailsQueryParams } from "./types";

const tableHeaderId = "accountDetailsTab";

interface AccountDetailsBodyProps {
  accountAddressParam: Addr;
  tabParam: TabIndex;
  resourceSelectedAccountParam: Option<string>;
  resourceSelectedGroupNameParam: Option<string>;
}

const getAddressOnPath = (hexAddress: HexAddr, accountAddress: BechAddr) =>
  hexAddress === "0x1" ? hexAddress : accountAddress;

const InvalidAccount = () => <InvalidState title="Account does not exist" />;

const AccountDetailsBody = ({
  accountAddressParam,
  tabParam,
  resourceSelectedAccountParam,
  resourceSelectedGroupNameParam,
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
  // -----------------REDIRECTS----------------//
  // ------------------------------------------//
  const isCheckingRedirect = useAccountRedirect(accountAddress, hexAddress);

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
    useResourcesByAddressRest(accountAddress);
  // nft
  const { data: nfts, isFetching: isNftsCountLoading } =
    useNftsByAccountAddress(hexAddress, 10, 0, undefined, "", {
      enabled: isFullTier && nft.enabled,
    });

  const { data: accountNfts } = useNftsByAccountByCollectionSequencer(
    hexAddress,
    undefined,
    undefined,
    isSequencerTier
  );

  const totalNfts = nfts?.total ?? accountNfts?.total;

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
        return "Your account detail";
      case hexAddress === "0x1":
        return "0x1 page";
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

  if (isCheckingRedirect) return <Loading withBorder />;
  return (
    <>
      <CelatoneSeo pageName={pageTitle} />
      <Flex direction="column" mb={6}>
        {accountData?.projectInfo && accountData?.publicInfo && (
          <Breadcrumb
            items={[
              { text: "Public projects", href: "/projects" },
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
          accountAddress={accountAddress}
          accountData={accountData}
          hexAddress={hexAddress}
          initiaUsernameData={initiaUsernameData}
          isInitiaUsernameDataFetching={isInitiaUsernameDataFetching}
          isInitiaUsernameDataLoading={isInitiaUsernameDataLoading}
        />
      </Flex>
      <Tabs
        index={Object.values(TabIndex).indexOf(tabParam)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          id={tableHeaderId}
          borderBottomWidth="1px"
          borderColor="gray.700"
          borderStyle="solid"
          overflowX="scroll"
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
            hidden={!gov.enabled}
            isDisabled={hasTotalBonded}
            onClick={handleTabChange(TabIndex.Delegations, undefined)}
          >
            Delegations
          </CustomTab>
          <CustomTab
            count={totalNfts}
            hidden={!nftEnabled}
            isDisabled={nfts?.total === 0}
            isLoading={isNftsCountLoading}
            onClick={handleTabChange(TabIndex.Nfts, totalNfts)}
          >
            NFTs
          </CustomTab>
          <CustomTab
            count={isFullTier ? tableCounts.txsCount : undefined}
            isDisabled={tableCounts.txsCount === 0}
            isLoading={isLoadingAccountTableCounts}
            onClick={handleTabChange(
              TabIndex.Txs,
              tableCounts.txsCount ?? undefined
            )}
          >
            Transactions
          </CustomTab>
          <CustomTab
            count={tableCounts.codesCount}
            hidden={!wasm.enabled || !isFullTier}
            isDisabled={tableCounts.codesCount === 0}
            isLoading={isLoadingAccountTableCounts}
            onClick={handleTabChange(
              TabIndex.Codes,
              tableCounts.codesCount ?? undefined
            )}
          >
            Codes
          </CustomTab>
          <CustomTab
            count={tableCounts.contractsCount}
            hidden={!wasm.enabled}
            isDisabled={tableCounts.contractsCount === 0}
            isLoading={isLoadingAccountTableCounts}
            onClick={handleTabChange(
              TabIndex.Contracts,
              tableCounts.contractsCount ?? undefined
            )}
          >
            Contracts
          </CustomTab>
          <CustomTab
            count={tableCounts.contractsAdminCount}
            hidden={!wasm.enabled || !isFullTier}
            isDisabled={tableCounts.contractsAdminCount === 0}
            isLoading={isLoadingAccountTableCounts}
            onClick={handleTabChange(
              TabIndex.Admins,
              tableCounts.contractsAdminCount ?? undefined
            )}
          >
            Admins
          </CustomTab>
          <CustomTab
            count={resourcesData?.totalCount}
            hidden={!move.enabled}
            isDisabled={resourcesData?.totalCount === 0}
            isLoading={isResourceLoading}
            onClick={handleTabChange(
              TabIndex.Resources,
              resourcesData?.groupedByOwner.length
            )}
          >
            Resources
          </CustomTab>
          <CustomTab
            count={modulesData?.total}
            hidden={!move.enabled}
            isDisabled={modulesData?.total === 0}
            isLoading={isModulesLoading}
            onClick={handleTabChange(TabIndex.Modules, undefined)}
          >
            Modules
          </CustomTab>
          <CustomTab
            count={tableCounts.proposalsCount}
            hidden={!gov.enabled || !isFullTier}
            isDisabled={tableCounts.proposalsCount === 0}
            isLoading={isLoadingAccountTableCounts}
            onClick={handleTabChange(
              TabIndex.Proposals,
              tableCounts.proposalsCount ?? undefined
            )}
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
              borderBottomColor={{ base: "transparent", md: "gray.700" }}
              borderBottomWidth={{ base: "0px", md: "1px" }}
              borderStyle="solid"
              mt={{ base: 4 }}
            >
              <AssetsSection
                address={accountAddress}
                isAccount
                onViewMore={handleTabChange(TabIndex.Assets, undefined)}
              />
            </Flex>
            {gov.enabled && (
              <Flex
                borderBottomColor={{ base: "transparent", md: "gray.700" }}
                borderBottomWidth={{ base: "0px", md: "1px" }}
                borderStyle="solid"
                mt={{ base: 4, md: 8 }}
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
              refetchCount={refetchCounts}
              scrollComponentId={tableHeaderId}
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
                    refetchCount={refetchCounts}
                    scrollComponentId={tableHeaderId}
                    totalData={tableCounts.codesCount ?? undefined}
                    onViewMore={handleTabChange(
                      TabIndex.Codes,
                      tableCounts.codesCount ?? undefined
                    )}
                  />
                )}
                <InstantiatedContractsTable
                  address={accountAddress}
                  refetchCount={refetchCounts}
                  scrollComponentId={tableHeaderId}
                  totalData={tableCounts.contractsCount ?? undefined}
                  onViewMore={handleTabChange(
                    TabIndex.Contracts,
                    tableCounts.contractsCount ?? undefined
                  )}
                />
                {isFullTier && (
                  <AdminContractsTable
                    address={accountAddress}
                    refetchCount={refetchCounts}
                    scrollComponentId={tableHeaderId}
                    totalData={tableCounts.contractsAdminCount ?? undefined}
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
                  isLoading={isResourceLoading}
                  resourcesByName={resourcesData?.groupedByName}
                  totalCount={resourcesData?.totalCount}
                  onViewMore={handleTabChange(
                    TabIndex.Resources,
                    resourcesData?.groupedByOwner.length
                  )}
                />
                <ModuleLists
                  address={hexAddress}
                  isLoading={isModulesLoading}
                  modules={modulesData?.items}
                  totalCount={modulesData?.total}
                  onViewMore={handleTabChange(TabIndex.Modules, undefined)}
                />
              </>
            )}
            {gov.enabled && isFullTier && (
              <OpenedProposalsTable
                address={accountAddress}
                refetchCount={refetchCounts}
                scrollComponentId={tableHeaderId}
                totalData={tableCounts.proposalsCount ?? undefined}
                onViewMore={handleTabChange(
                  TabIndex.Proposals,
                  tableCounts.proposalsCount ?? undefined
                )}
              />
            )}
            <UserDocsLink
              cta="Read more about Account"
              href="general/accounts/detail-page"
              title="What is an Account?"
            />
          </TabPanel>
          <TabPanel mt={{ base: 0, md: 8 }} p={0}>
            <AssetsSection address={accountAddress} isAccount />
            <UserDocsLink
              title="What is supported and unsupported assets?"
              cta="Read more about assets"
              href="general/accounts/detail-page#assets"
              title="What is Supported and Unsupported Assets?"
            />
          </TabPanel>
          <TabPanel mt={{ base: 0, md: 8 }} p={0}>
            <DelegationsSection address={accountAddress} />
            <UserDocsLink
              cta="Read more about Delegations"
              href="general/accounts/detail-page#staking"
              title="What is Delegations, Total Bonded, Rewards?"
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
              cta="Read more about NFTs in Account"
              href="general/accounts/detail-page#nfts"
              title="What is NFTs in the account?"
            />
          </TabPanel>
          <TabPanel p={0}>
            <TxsTable
              address={accountAddress}
              refetchCount={refetchCounts}
              scrollComponentId={tableHeaderId}
            />
            <UserDocsLink
              title="What is transactions related to the account?"
              cta="Read more about Account transactions"
              href="general/accounts/detail-page#transactions"
              title="What is transactions related to the account?"
            />
          </TabPanel>
          <TabPanel p={0}>
            <StoredCodesTable
              address={accountAddress}
              refetchCount={refetchCounts}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.codesCount ?? undefined}
            />
            <UserDocsLink
              cta="Read more about Stored Codes in Account"
              href="general/accounts/detail-page#codes"
              title="What is Stored Codes in the account?"
            />
          </TabPanel>
          <TabPanel p={0}>
            <InstantiatedContractsTable
              address={accountAddress}
              refetchCount={refetchCounts}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsCount ?? undefined}
            />
            <UserDocsLink
              cta="Read more about Contracts in Account"
              href="general/accounts/detail-page#contracts"
              title="What is contract instances in the account?"
            />
          </TabPanel>
          <TabPanel p={0}>
            <AdminContractsTable
              address={accountAddress}
              refetchCount={refetchCounts}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsAdminCount ?? undefined}
            />
            <UserDocsLink
              cta="Read more about Account Contract Admins"
              href="general/accounts/detail-page#contracts-admin"
              title="What is contract admins in the account?"
            />
          </TabPanel>
          <TabPanel p={0}>
            <ResourceSection
              address={accountAddress}
              isLoading={isResourceLoading}
              resourcesByOwner={resourcesData?.groupedByOwner}
              selectedAccountParam={resourceSelectedAccountParam}
              selectedGroupNameParam={resourceSelectedGroupNameParam}
              totalCount={resourcesData?.totalCount}
            />
            <UserDocsLink
              title="What is resources?"
              cta="Read more about Resources in account"
              href="general/accounts/detail-page#resources"
              title="What is resources?"
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleLists
              address={hexAddress}
              isLoading={isModulesLoading}
              modules={modulesData?.items}
              totalCount={modulesData?.total}
            />
            <UserDocsLink
              title="What is modules?"
              cta="Read more about Modules in account"
              href="general/accounts/detail-page#modules"
              title="What is modules?"
            />
          </TabPanel>
          <TabPanel p={0}>
            <OpenedProposalsTable
              address={accountAddress}
              refetchCount={refetchCounts}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.proposalsCount ?? undefined}
            />
            <UserDocsLink
              cta="Read more about Opened Proposals"
              href="general/accounts/detail-page#proposals"
              title="What is Opened Proposals in the account?"
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
          resourceSelectedAccountParam={validated.data.account}
          resourceSelectedGroupNameParam={validated.data.selected}
          tabParam={validated.data.tab}
        />
      )}
    </PageContainer>
  );
};

export default AccountDetails;
