import {
  Flex,
  Heading,
  Spinner,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useValidateAddress } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { CustomTab } from "lib/components/CustomTab";
import { DefaultBreadcrumb } from "lib/components/DefaultBreadcrumb";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { useAccountDetailsTableCounts } from "lib/model/account";
import { useAccountId } from "lib/services/accountService";
import { AmpEvent, AmpTrack, AmpTrackUseTab } from "lib/services/amplitude";
import {
  usePublicProjectByAccountAddress,
  usePublicProjectBySlug,
} from "lib/services/publicProjectService";
import type { HumanAddr } from "lib/types";
import {
  formatPrice,
  getFirstQueryParam,
  scrollToTop,
  truncate,
} from "lib/utils";

import { AssetsSection } from "./components/asset";
import { DelegationsSection } from "./components/delegations";
import {
  AdminContractsTable,
  InstantiatedContractsTable,
  OpenedProposalsTable,
  StoredCodesTable,
  TxsTable,
} from "./components/tables";
import { useAccountTotalValue } from "./data";

enum TabIndex {
  Overview,
  Assets,
  Delegations,
  Txs,
  Codes,
  Contracts,
  Admins,
  Proposals,
}

interface AccountDetailsBodyProps {
  accountAddress: HumanAddr;
}

const InvalidAccount = () => <InvalidState title="Account does not exist" />;

const AccountDetailsBody = ({ accountAddress }: AccountDetailsBodyProps) => {
  const [tabIndex, setTabIndex] = useState(TabIndex.Overview);
  const tableHeaderId = "accountDetailsTab";
  const { data: publicInfo } = usePublicProjectByAccountAddress(accountAddress);
  const { data: publicInfoBySlug } = usePublicProjectBySlug(publicInfo?.slug);
  const { data: accountId } = useAccountId(accountAddress);

  const publicDetail = publicInfoBySlug?.details;

  const {
    tableCounts,
    refetchCodesCount,
    refetchContractsAdminCount,
    refetchContractsCount,
    refetchProposalsCount,
  } = useAccountDetailsTableCounts(accountAddress, accountId);

  const { totalAccountValue, isLoading } = useAccountTotalValue(accountAddress);

  const handleTabChange = (tab: TabIndex) => {
    AmpTrackUseTab(TabIndex[tab]);
    setTabIndex(tab);
    scrollToTop();
  };

  const displayName = publicInfo?.name ?? "Account Details";

  return (
    <>
      <Flex direction="column" mb={6}>
        {publicDetail && (
          <DefaultBreadcrumb
            mb={6}
            primaryPage="Public Projects"
            primaryPath="/public-project"
            secondaryPage={publicDetail?.name}
            secondaryPath={`/public-project/${publicInfo?.slug}`}
            currentPage={truncate(accountAddress)}
          />
        )}
        <Flex direction="column" gap={2}>
          <Flex gap={1} minH="36px" align="center">
            <CustomIcon name="wallet" boxSize="5" color="lilac.main" />
            {publicDetail?.logo && (
              <Image
                src={publicDetail.logo}
                borderRadius="full"
                alt={publicDetail.name}
                width={7}
                height={7}
              />
            )}
            <Heading as="h5" variant="h5">
              {displayName}
            </Heading>
          </Flex>
          <Flex gap={2}>
            <Text fontWeight={500} color="text.dark" variant="body2">
              Wallet Address:
            </Text>
            <CopyLink
              value={accountAddress}
              amptrackSection="account_top"
              type="user_address"
            />
          </Flex>
        </Flex>
      </Flex>
      {publicInfo?.description && (
        <Flex
          direction="column"
          bg="pebble.900"
          maxW="100%"
          borderRadius="8px"
          py={4}
          px={5}
          my={6}
          flex="1"
        >
          <Flex align="center" gap={1} h="32px">
            <CustomIcon name="website" ml="0" my="0" />
            <Text variant="body2" fontWeight={500} color="text.dark">
              Public Account Description
            </Text>
          </Flex>
          <Text variant="body2" color="text.main" mb="1">
            {publicInfo?.description}
          </Text>
        </Flex>
      )}

      <Tabs index={tabIndex}>
        <TabList
          borderBottom="1px solid"
          borderColor="pebble.700"
          overflowX="scroll"
          id={tableHeaderId}
        >
          <CustomTab onClick={() => handleTabChange(TabIndex.Overview)}>
            Overall
          </CustomTab>
          <CustomTab
            count={tableCounts.assetsCount}
            isDisabled={!tableCounts.assetsCount}
            onClick={() => handleTabChange(TabIndex.Assets)}
          >
            Assets
          </CustomTab>
          <CustomTab onClick={() => handleTabChange(TabIndex.Delegations)}>
            Delegations
          </CustomTab>
          <CustomTab
            count={tableCounts.txsCount}
            isDisabled={!tableCounts.txsCount}
            onClick={() => handleTabChange(TabIndex.Txs)}
          >
            Transactions
          </CustomTab>
          <CustomTab
            count={tableCounts.codesCount}
            isDisabled={!tableCounts.codesCount}
            onClick={() => handleTabChange(TabIndex.Codes)}
          >
            Codes
          </CustomTab>
          <CustomTab
            count={tableCounts.contractsCount}
            isDisabled={!tableCounts.contractsCount}
            onClick={() => handleTabChange(TabIndex.Contracts)}
          >
            Contracts
          </CustomTab>
          <CustomTab
            count={tableCounts.contractsAdminCount}
            isDisabled={!tableCounts.contractsAdminCount}
            onClick={() => handleTabChange(TabIndex.Admins)}
          >
            Admins
          </CustomTab>
          <CustomTab
            count={tableCounts.proposalsCount}
            isDisabled={!tableCounts.proposalsCount}
            onClick={() => handleTabChange(TabIndex.Proposals)}
          >
            Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Flex
              mt={8}
              pb={8}
              direction="column"
              borderBottom="1px solid"
              borderBottomColor="pebble.700"
            >
              <Text variant="body2" fontWeight="500" color="text.dark">
                Total Account Value
              </Text>
              {isLoading ? (
                <Spinner mt={2} alignSelf="center" size="md" speed="0.65s" />
              ) : (
                <Heading
                  as="h5"
                  variant="h5"
                  fontWeight="600"
                  color={
                    !totalAccountValue || totalAccountValue.eq(0)
                      ? "text.dark"
                      : "text.main"
                  }
                >
                  {totalAccountValue ? formatPrice(totalAccountValue) : "N/A"}
                </Heading>
              )}
            </Flex>
            <Flex borderBottom="1px solid" borderBottomColor="pebble.700">
              <AssetsSection
                walletAddress={accountAddress}
                onViewMore={() => handleTabChange(TabIndex.Assets)}
              />
            </Flex>
            <Flex borderBottom="1px solid" borderBottomColor="pebble.700">
              <DelegationsSection
                walletAddress={accountAddress}
                onViewMore={() => handleTabChange(TabIndex.Delegations)}
              />
            </Flex>
            <TxsTable
              walletAddress={accountAddress}
              accountId={accountId}
              scrollComponentId={tableHeaderId}
              onViewMore={() => handleTabChange(TabIndex.Txs)}
            />
            <StoredCodesTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.codesCount}
              refetchCount={refetchCodesCount}
              onViewMore={() => handleTabChange(TabIndex.Codes)}
            />
            <InstantiatedContractsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsCount}
              refetchCount={refetchContractsCount}
              onViewMore={() => handleTabChange(TabIndex.Contracts)}
            />
            <AdminContractsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsAdminCount}
              refetchCount={refetchContractsAdminCount}
              onViewMore={() => handleTabChange(TabIndex.Admins)}
            />
            <OpenedProposalsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.proposalsCount}
              refetchCount={refetchProposalsCount}
              onViewMore={() => handleTabChange(TabIndex.Proposals)}
            />
          </TabPanel>
          <TabPanel p={0}>
            <AssetsSection walletAddress={accountAddress} />
          </TabPanel>
          <TabPanel p={0}>
            <DelegationsSection walletAddress={accountAddress} />
          </TabPanel>
          <TabPanel p={0}>
            <TxsTable
              walletAddress={accountAddress}
              accountId={accountId}
              scrollComponentId={tableHeaderId}
            />
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
  const { validateUserAddress, validateContractAddress } = useValidateAddress();
  // TODO: change to `Addr` for correctness (i.e. interchain account)
  const accountAddressParam = getFirstQueryParam(
    router.query.accountAddress
  ) as HumanAddr;

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_ACCOUNT_DETAIL);
  }, [router.isReady]);

  return (
    <PageContainer>
      {validateUserAddress(accountAddressParam) &&
      validateContractAddress(accountAddressParam) ? (
        <InvalidAccount />
      ) : (
        <AccountDetailsBody accountAddress={accountAddressParam} />
      )}
    </PageContainer>
  );
};

export default AccountDetails;
