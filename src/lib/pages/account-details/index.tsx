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

import { AmpEvent, useTrack } from "lib/amplitude";
import {
  useConvertHexAddress,
  useInternalNavigate,
  useMoveConfig,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { useAccountDetailsTableCounts } from "lib/model/account";
import { useAccountId } from "lib/services/accountService";
import type { IndexedModule } from "lib/services/move/moduleService";
import { useAccountModules } from "lib/services/move/moduleService";
import { useAccountResources } from "lib/services/move/resourceService";
import { useICNSNamesByAddress } from "lib/services/nameService";
import {
  usePublicProjectByAccountAddress,
  usePublicProjectBySlug,
} from "lib/services/publicProjectService";
import type { HexAddr, HumanAddr, MoveAccountAddr, Option } from "lib/types";
import {
  bech32AddressToHex,
  getFirstQueryParam,
  isHexAddress,
  truncate,
  unpadHexAddress,
} from "lib/utils";

import { AccountHeader } from "./components/AccountHeader";
import { AssetsSection } from "./components/asset";
import { DelegationsSection } from "./components/delegations";
import { ModuleLists } from "./components/ModuleLists";
import { ResourceLists, ResourceSection } from "./components/resources";
import {
  AdminContractsTable,
  InstantiatedContractsTable,
  OpenedProposalsTable,
  StoredCodesTable,
  TxsTable,
} from "./components/tables";

const tableHeaderId = "accountDetailsTab";

enum TabIndex {
  Overview = "overview",
  Assets = "assets",
  Delegations = "delegations",
  Txs = "txs",
  Codes = "codes",
  Contracts = "contracts",
  Admins = "admins",
  Resource = "resources",
  Modules = "modules",
  Proposals = "proposals",
}

export interface AccountDetailsBodyProps {
  hexAddress: HexAddr;
  accountAddress: HumanAddr;
}

const InvalidAccount = () => <InvalidState title="Account does not exist" />;

const AccountDetailsBody = ({
  hexAddress,
  accountAddress,
}: AccountDetailsBodyProps) => {
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });
  // const nft = useNftConfig({ shouldRedirect: false });
  const navigate = useInternalNavigate();
  const router = useRouter();
  const { trackUseTab } = useTrack();
  // TODO: remove assertion later
  const tab = getFirstQueryParam(router.query.tab) as TabIndex;
  const { data: publicInfo } = usePublicProjectByAccountAddress(accountAddress);
  const { data: publicInfoBySlug } = usePublicProjectBySlug(publicInfo?.slug);
  const { data: accountId } = useAccountId(accountAddress);
  const { data: icnsName } = useICNSNamesByAddress(accountAddress);

  // TODO: combine with useAccountDetailsTableCounts and remove type assertion
  // move
  const { data: fetchedAccountModules, isFetching: isModulesLoading } =
    useAccountModules({
      address: accountAddress,
      moduleName: undefined,
      functionName: undefined,
      options: { refetchOnWindowFocus: false, retry: 1 },
    });
  const modulesData = fetchedAccountModules as Option<IndexedModule[]>;

  const { data: resourcesData, isFetching: isResourceLoading } =
    useAccountResources({
      address: accountAddress,
    });

  const publicDetail = publicInfoBySlug?.details;
  const {
    tableCounts,
    refetchCodesCount,
    refetchContractsAdminCount,
    refetchContractsCount,
    refetchProposalsCount,
    loadingState: { txCountLoading },
  } = useAccountDetailsTableCounts(accountAddress, accountId);

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      navigate({
        pathname: "/accounts/[accountAddress]/[tab]",
        query: {
          accountAddress,
          tab: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [tab, trackUseTab, navigate, accountAddress]
  );

  useEffect(() => {
    if (router.isReady && (!tab || !Object.values(TabIndex).includes(tab))) {
      navigate({
        replace: true,
        pathname: "/accounts/[accountAddress]/[tab]",
        query: {
          accountAddress,
          tab: TabIndex.Overview,
        },
        options: {
          shallow: true,
        },
      });
    }
  }, [router.isReady, tab, accountAddress, navigate]);

  return (
    <>
      <Flex direction="column" mb={6}>
        {publicDetail && (
          <Breadcrumb
            items={[
              { text: "Public Projects", href: "/projects" },
              {
                text: publicDetail?.name,
                href: `/projects/${publicInfo?.slug}`,
              },
              { text: truncate(accountAddress) },
            ]}
            mb={6}
          />
        )}
        <AccountHeader
          publicName={publicInfo?.name}
          publicDetail={publicDetail}
          icnsName={icnsName}
          accountAddress={accountAddress}
          hexAddress={hexAddress}
        />
      </Flex>
      {publicInfo?.description && (
        <Flex
          direction="column"
          bg="gray.900"
          maxW="100%"
          borderRadius="8px"
          py={4}
          px={4}
          my={6}
          flex="1"
        >
          <Flex alignItems="center" gap={1} minH="32px">
            <CustomIcon name="website" ml={0} mb={2} color="gray.600" />
            <Text variant="body2" fontWeight={500} color="text.dark">
              Public Account Description
            </Text>
          </Flex>
          <Text variant="body2" color="text.main" mb={1}>
            {publicInfo?.description}
          </Text>
        </Flex>
      )}

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
            count={tableCounts.assetsCount}
            isDisabled={!tableCounts.assetsCount}
            onClick={handleTabChange(TabIndex.Assets)}
          >
            Assets
          </CustomTab>
          <CustomTab onClick={handleTabChange(TabIndex.Delegations)}>
            Delegations
          </CustomTab>
          {/* <CustomTab
            count={tableCounts.txsCount}
            isDisabled={txCountLoading || tableCounts.txsCount === 0}
            onClick={handleTabChange(TabIndex.NFTs)}
            hidden={!nft.enabled}
          >
            NFTs
          </CustomTab> */}
          <CustomTab
            count={tableCounts.txsCount}
            isDisabled={txCountLoading || tableCounts.txsCount === 0}
            onClick={handleTabChange(TabIndex.Txs)}
          >
            Transactions
          </CustomTab>
          <CustomTab
            count={tableCounts.codesCount}
            isDisabled={!tableCounts.codesCount}
            onClick={handleTabChange(TabIndex.Codes)}
            hidden={!wasm.enabled}
          >
            Codes
          </CustomTab>
          <CustomTab
            count={tableCounts.contractsCount}
            isDisabled={!tableCounts.contractsCount}
            onClick={handleTabChange(TabIndex.Contracts)}
            hidden={!wasm.enabled}
          >
            Contracts
          </CustomTab>
          <CustomTab
            count={tableCounts.contractsAdminCount}
            isDisabled={!tableCounts.contractsAdminCount}
            onClick={handleTabChange(TabIndex.Admins)}
            hidden={!wasm.enabled}
          >
            Admins
          </CustomTab>
          <CustomTab
            count={resourcesData?.length}
            isDisabled={!resourcesData?.length}
            onClick={handleTabChange(TabIndex.Resource)}
            hidden={!move.enabled}
          >
            Resources
          </CustomTab>
          <CustomTab
            count={modulesData?.length}
            isDisabled={!modulesData?.length}
            onClick={handleTabChange(TabIndex.Modules)}
            hidden={!move.enabled}
          >
            Modules
          </CustomTab>
          <CustomTab
            count={tableCounts.proposalsCount}
            isDisabled={!tableCounts.proposalsCount}
            onClick={handleTabChange(TabIndex.Proposals)}
          >
            Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Flex borderBottom="1px solid" borderBottomColor="gray.700">
              <AssetsSection
                walletAddress={accountAddress}
                onViewMore={handleTabChange(TabIndex.Assets)}
              />
            </Flex>
            <Flex
              borderBottom={{ base: "0px", md: "1px solid" }}
              borderBottomColor={{ base: "transparent", md: "gray.700" }}
            >
              <DelegationsSection
                walletAddress={accountAddress}
                onViewMore={handleTabChange(TabIndex.Delegations)}
              />
            </Flex>
            <TxsTable
              accountId={accountId}
              scrollComponentId={tableHeaderId}
              onViewMore={handleTabChange(TabIndex.Txs)}
            />
            {wasm.enabled && (
              <>
                <StoredCodesTable
                  walletAddress={accountAddress}
                  scrollComponentId={tableHeaderId}
                  totalData={tableCounts.codesCount}
                  refetchCount={refetchCodesCount}
                  onViewMore={handleTabChange(TabIndex.Codes)}
                />
                <InstantiatedContractsTable
                  walletAddress={accountAddress}
                  scrollComponentId={tableHeaderId}
                  totalData={tableCounts.contractsCount}
                  refetchCount={refetchContractsCount}
                  onViewMore={handleTabChange(TabIndex.Contracts)}
                />
                <AdminContractsTable
                  walletAddress={accountAddress}
                  scrollComponentId={tableHeaderId}
                  totalData={tableCounts.contractsAdminCount}
                  refetchCount={refetchContractsAdminCount}
                  onViewMore={handleTabChange(TabIndex.Admins)}
                />
              </>
            )}
            {move.enabled && (
              <>
                <ResourceLists
                  address={accountAddress}
                  onViewMore={handleTabChange(TabIndex.Resource)}
                />
                <ModuleLists
                  selectedAddress={accountAddress}
                  totalCount={modulesData?.length}
                  modules={modulesData}
                  isLoading={isModulesLoading}
                  onViewMore={handleTabChange(TabIndex.Modules)}
                />
              </>
            )}
            <OpenedProposalsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.proposalsCount}
              refetchCount={refetchProposalsCount}
              onViewMore={handleTabChange(TabIndex.Proposals)}
            />
          </TabPanel>
          <TabPanel p={0}>
            <AssetsSection walletAddress={accountAddress} />
          </TabPanel>
          <TabPanel p={0}>
            <DelegationsSection walletAddress={accountAddress} />
          </TabPanel>
          {/* <TabPanel p={0}>nft</TabPanel> */}
          <TabPanel p={0}>
            <TxsTable accountId={accountId} scrollComponentId={tableHeaderId} />
          </TabPanel>
          <TabPanel p={0}>
            <StoredCodesTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.codesCount}
              refetchCount={refetchCodesCount}
            />
          </TabPanel>
          <TabPanel p={0}>
            <InstantiatedContractsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsCount}
              refetchCount={refetchContractsCount}
            />
          </TabPanel>
          <TabPanel p={0}>
            <AdminContractsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsAdminCount}
              refetchCount={refetchContractsAdminCount}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ResourceSection
              address={accountAddress}
              resources={resourcesData}
              isLoading={isResourceLoading}
            />
          </TabPanel>
          <TabPanel p={0}>
            <ModuleLists
              selectedAddress={accountAddress}
              totalCount={modulesData?.length}
              modules={modulesData}
              isLoading={isModulesLoading}
            />
          </TabPanel>
          <TabPanel p={0}>
            <OpenedProposalsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.proposalsCount}
              refetchCount={refetchProposalsCount}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

const AccountDetails = () => {
  const router = useRouter();
  const { track } = useTrack();
  const { validateUserAddress, validateContractAddress } = useValidateAddress();
  const hexToBech32 = useConvertHexAddress();
  // TODO: change to `Addr` for correctness (i.e. interchain account)
  const accountAddressParam = getFirstQueryParam(
    router.query.accountAddress
  ).toLowerCase() as MoveAccountAddr;
  const [hexAddr, humanAddr] = isHexAddress(accountAddressParam)
    ? [
        unpadHexAddress(accountAddressParam as HexAddr),
        hexToBech32(accountAddressParam as HexAddr),
      ]
    : [
        unpadHexAddress(bech32AddressToHex(accountAddressParam as HumanAddr)),
        accountAddressParam as HumanAddr,
      ];
  // TODO: fix assertion later
  const tab = getFirstQueryParam(router.query.tab) as TabIndex;

  useEffect(() => {
    if (router.isReady && tab) track(AmpEvent.TO_ACCOUNT_DETAIL, { tab });
  }, [router.isReady, tab, track]);

  if (!router.isReady) return <Loading />;

  return (
    <PageContainer>
      {!isHexAddress(accountAddressParam) &&
      validateUserAddress(accountAddressParam) &&
      validateContractAddress(accountAddressParam) ? (
        <InvalidAccount />
      ) : (
        <AccountDetailsBody hexAddress={hexAddr} accountAddress={humanAddr} />
      )}
    </PageContainer>
  );
};

export default AccountDetails;
