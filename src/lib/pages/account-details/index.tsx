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
import { useResourcesByAddressLcd } from "lib/services/move/resource";
import {
  useNftsByAccountAddress,
  useNftsByAccountByCollectionSequencer,
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
import { useAccountRedirect } from "./hooks";
import { TabIndex, zAccountDetailsQueryParams } from "./types";

const tableHeaderId = "accountDetailsTab";

interface AccountDetailsBodyProps {
  accountAddressParam: Addr;
  resourceSelectedAccountParam: Option<string>;
  resourceSelectedGroupNameParam: Option<string>;
  tabParam: TabIndex;
}

const getAddressOnPath = (hexAddress: HexAddr, accountAddress: BechAddr) =>
  hexAddress === "0x1" ? hexAddress : accountAddress;

const InvalidAccount = () => <InvalidState title="Account does not exist" />;

const AccountDetailsBody = ({
  accountAddressParam,
  resourceSelectedAccountParam,
  resourceSelectedGroupNameParam,
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
    isLoading: isLoadingAccountTableCounts,
    refetchCounts,
    tableCounts,
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
        options: {
          shallow: true,
        },
        pathname: "/accounts/[accountAddress]/[tab]",
        query: {
          accountAddress: getAddressOnPath(hexAddress, accountAddress),
          tab: nextTab,
        },
      });
    },
    [accountAddress, hexAddress, navigate, tabParam]
  );

  const { address } = useCurrentChain();
  const {
    data: initiaUsernameData,
    isFetching: isInitiaUsernameDataFetching,
    isLoading: isInitiaUsernameDataLoading,
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

  if (isCheckingRedirect) return <Loading withBorder />;
  return (
    <>
      <CelatoneSeo pageName={pageTitle} />
      <Flex mb={6} direction="column">
        {accountData?.projectInfo && accountData?.publicInfo && (
          <Breadcrumb
            items={[
              { href: "/projects", text: "Public Projects" },
              {
                href: `/projects/${accountData.publicInfo.slug}`,
                text: accountData.projectInfo.name,
              },
              { text: truncate(accountAddress) },
            ]}
            mb={6}
          />
        )}
        <AccountHeader
          hexAddress={hexAddress}
          initiaUsernameData={initiaUsernameData}
          isInitiaUsernameDataFetching={isInitiaUsernameDataFetching}
          accountAddress={accountAddress}
          accountData={accountData}
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
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX="scroll"
        >
          <CustomTab onClick={handleTabChange(TabIndex.Overview, undefined)}>
            Overview
          </CustomTab>
          <CustomTab
            isDisabled={tableCounts.assetsCount === 0}
            count={tableCounts.assetsCount}
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
            hidden={!nftEnabled}
            isDisabled={nfts?.total === 0}
            count={totalNfts}
            isLoading={isNftsCountLoading}
            onClick={handleTabChange(TabIndex.Nfts, totalNfts)}
          >
            NFTs
          </CustomTab>
          <CustomTab
            isDisabled={tableCounts.txsCount === 0}
            count={isFullTier ? tableCounts.txsCount : undefined}
            isLoading={isLoadingAccountTableCounts}
            onClick={handleTabChange(
              TabIndex.Txs,
              tableCounts.txsCount ?? undefined
            )}
          >
            Transactions
          </CustomTab>
          <CustomTab
            hidden={!wasm.enabled || !isFullTier}
            isDisabled={tableCounts.codesCount === 0}
            count={tableCounts.codesCount}
            isLoading={isLoadingAccountTableCounts}
            onClick={handleTabChange(
              TabIndex.Codes,
              tableCounts.codesCount ?? undefined
            )}
          >
            Codes
          </CustomTab>
          <CustomTab
            hidden={!wasm.enabled}
            isDisabled={tableCounts.contractsCount === 0}
            count={tableCounts.contractsCount}
            isLoading={isLoadingAccountTableCounts}
            onClick={handleTabChange(
              TabIndex.Contracts,
              tableCounts.contractsCount ?? undefined
            )}
          >
            Contracts
          </CustomTab>
          <CustomTab
            hidden={!wasm.enabled || !isFullTier}
            isDisabled={tableCounts.contractsAdminCount === 0}
            count={tableCounts.contractsAdminCount}
            isLoading={isLoadingAccountTableCounts}
            onClick={handleTabChange(
              TabIndex.Admins,
              tableCounts.contractsAdminCount ?? undefined
            )}
          >
            Admins
          </CustomTab>
          <CustomTab
            hidden={!move.enabled}
            isDisabled={resourcesData?.totalCount === 0}
            count={resourcesData?.totalCount}
            isLoading={isResourceLoading}
            onClick={handleTabChange(
              TabIndex.Resources,
              resourcesData?.groupedByOwner.length
            )}
          >
            Resources
          </CustomTab>
          <CustomTab
            hidden={!move.enabled}
            isDisabled={modulesData?.total === 0}
            count={modulesData?.total}
            isLoading={isModulesLoading}
            onClick={handleTabChange(TabIndex.Modules, undefined)}
          >
            Modules
          </CustomTab>
          <CustomTab
            hidden={!gov.enabled || !isFullTier}
            isDisabled={tableCounts.proposalsCount === 0}
            count={tableCounts.proposalsCount}
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
                gap={{ base: 4, md: 6 }}
                mt={{ base: 0, md: 8 }}
                direction={{ base: "column", md: "row" }}
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
                address={accountAddress}
                isAccount
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
                userAddress={hexAddress}
                onViewMore={handleTabChange(TabIndex.Nfts, totalNfts)}
                totalCount={totalNfts}
              />
            )}
            <TxsTable
              address={accountAddress}
              onViewMore={handleTabChange(
                TabIndex.Txs,
                tableCounts.txsCount ?? undefined
              )}
              scrollComponentId={tableHeaderId}
              refetchCount={refetchCounts}
            />
            {wasm.enabled && (
              <>
                {isFullTier && (
                  <StoredCodesTable
                    address={accountAddress}
                    onViewMore={handleTabChange(
                      TabIndex.Codes,
                      tableCounts.codesCount ?? undefined
                    )}
                    scrollComponentId={tableHeaderId}
                    totalData={tableCounts.codesCount ?? undefined}
                    refetchCount={refetchCounts}
                  />
                )}
                <InstantiatedContractsTable
                  address={accountAddress}
                  onViewMore={handleTabChange(
                    TabIndex.Contracts,
                    tableCounts.contractsCount ?? undefined
                  )}
                  scrollComponentId={tableHeaderId}
                  totalData={tableCounts.contractsCount ?? undefined}
                  refetchCount={refetchCounts}
                />
                {isFullTier && (
                  <AdminContractsTable
                    address={accountAddress}
                    onViewMore={handleTabChange(
                      TabIndex.Admins,
                      tableCounts.contractsAdminCount ?? undefined
                    )}
                    scrollComponentId={tableHeaderId}
                    totalData={tableCounts.contractsAdminCount ?? undefined}
                    refetchCount={refetchCounts}
                  />
                )}
              </>
            )}
            {move.enabled && (
              <>
                <ResourceOverview
                  address={accountAddress}
                  isLoading={isResourceLoading}
                  onViewMore={handleTabChange(
                    TabIndex.Resources,
                    resourcesData?.groupedByOwner.length
                  )}
                  resourcesByName={resourcesData?.groupedByName}
                  totalCount={resourcesData?.totalCount}
                />
                <ModuleLists
                  address={accountAddress}
                  isLoading={isModulesLoading}
                  modules={modulesData?.items}
                  onViewMore={handleTabChange(TabIndex.Modules, undefined)}
                  totalCount={modulesData?.total}
                />
              </>
            )}
            {gov.enabled && isFullTier && (
              <OpenedProposalsTable
                address={accountAddress}
                onViewMore={handleTabChange(
                  TabIndex.Proposals,
                  tableCounts.proposalsCount ?? undefined
                )}
                scrollComponentId={tableHeaderId}
                totalData={tableCounts.proposalsCount ?? undefined}
                refetchCount={refetchCounts}
              />
            )}
            <UserDocsLink
              cta="Read more about Account"
              title="What is an Account?"
              href="general/accounts/detail-page"
            />
          </TabPanel>
          <TabPanel mt={{ base: 0, md: 8 }} p={0}>
            <AssetsSection address={accountAddress} isAccount />
            <UserDocsLink
              cta="Read more about Assets"
              title="What is Supported and Unsupported Assets?"
              href="general/accounts/detail-page#assets"
            />
          </TabPanel>
          <TabPanel mt={{ base: 0, md: 8 }} p={0}>
            <DelegationsSection address={accountAddress} />
            <UserDocsLink
              cta="Read more about Delegations"
              title="What is Delegations, Total Bonded, Rewards?"
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
              cta="Read more about NFTs in Account"
              title="What is NFTs in the account?"
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
              cta="Read more about Account Transactions"
              title="What is transactions related to the account?"
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
              cta="Read more about Stored Codes in Account"
              title="What is Stored Codes in the account?"
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
              cta="Read more about Contracts in Account"
              title="What is contract instances in the account?"
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
              cta="Read more about Account Contract Admins"
              title="What is contract admins in the account?"
              href="general/accounts/detail-page#contracts-admin"
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
              cta="Read more about Resources in Account"
              title="What is resources?"
              href="general/accounts/detail-page#resources"
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleLists
              address={accountAddress}
              isLoading={isModulesLoading}
              modules={modulesData?.items}
              totalCount={modulesData?.total}
            />
            <UserDocsLink
              cta="Read more about Modules in Account"
              title="What is modules?"
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
              cta="Read more about Opened Proposals"
              title="What is Opened Proposals in the account?"
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
          tabParam={validated.data.tab}
          accountAddressParam={validated.data.accountAddress}
          resourceSelectedAccountParam={validated.data.account}
          resourceSelectedGroupNameParam={validated.data.selected}
        />
      )}
    </PageContainer>
  );
};

export default AccountDetails;
