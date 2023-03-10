import {
  Flex,
  Heading,
  Spinner,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useValidateAddress } from "lib/app-provider";
import { BackButton } from "lib/components/button";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { useAccountDetailsTableCounts } from "lib/model/account";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { HumanAddr } from "lib/types";
import { formatPrice, getFirstQueryParam, scrollToTop } from "lib/utils";

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
  const {
    tableCounts,
    refetchCodesCount,
    refetchContractsAdminCount,
    refetchContractsCount,
    refetchTxsCount,
    refetchProposalsCount,
  } = useAccountDetailsTableCounts(accountAddress);

  const { totalAccountValue, isLoading } = useAccountTotalValue(accountAddress);

  const handleOnViewMore = (tab: TabIndex) => {
    setTabIndex(tab);
    scrollToTop();
  };

  return (
    <>
      <Flex direction="column" gap={1} mt={6} mb={12}>
        <Flex gap={1}>
          <Heading as="h5" variant="h5">
            Account Details
          </Heading>
        </Flex>
        <Flex gap={2}>
          <Text fontWeight={500} color="text.dark" variant="body2">
            Wallet Address:
          </Text>
          <ExplorerLink
            type="user_address"
            value={accountAddress}
            textFormat="normal"
            maxWidth="full"
          />
        </Flex>
      </Flex>
      <Tabs index={tabIndex} overflowY="scroll">
        <TabList
          borderBottom="1px solid"
          borderColor="pebble.700"
          id={tableHeaderId}
        >
          <CustomTab onClick={() => setTabIndex(TabIndex.Overview)}>
            Overall
          </CustomTab>
          <CustomTab
            count={tableCounts.assetsCount}
            isDisabled={!tableCounts.assetsCount}
            onClick={() => setTabIndex(TabIndex.Assets)}
          >
            Assets
          </CustomTab>
          {/* TODO: add counts for Delegations */}
          <CustomTab onClick={() => setTabIndex(TabIndex.Delegations)}>
            Delegations
          </CustomTab>
          <CustomTab
            count={tableCounts.txsCount}
            isDisabled={!tableCounts.txsCount}
            onClick={() => setTabIndex(TabIndex.Txs)}
          >
            Transactions
          </CustomTab>
          <CustomTab
            count={tableCounts.codesCount}
            isDisabled={!tableCounts.codesCount}
            onClick={() => setTabIndex(TabIndex.Codes)}
          >
            Codes
          </CustomTab>
          <CustomTab
            count={tableCounts.contractsCount}
            isDisabled={!tableCounts.contractsCount}
            onClick={() => setTabIndex(TabIndex.Contracts)}
          >
            Contracts
          </CustomTab>
          <CustomTab
            count={tableCounts.contractsAdminCount}
            isDisabled={!tableCounts.contractsAdminCount}
            onClick={() => setTabIndex(TabIndex.Admins)}
          >
            Admins
          </CustomTab>
          <CustomTab
            count={tableCounts.proposalsCount}
            isDisabled={!tableCounts.proposalsCount}
            onClick={() => setTabIndex(TabIndex.Proposals)}
          >
            Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Flex mt={12} direction="column" width="fit-content">
              <Text variant="body2" fontWeight="500" color="text.dark">
                Total Account Value
              </Text>
              {isLoading ? (
                <Spinner mt={1} alignSelf="center" size="md" speed="0.65s" />
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

            <AssetsSection
              walletAddress={accountAddress}
              onViewMore={() => handleOnViewMore(TabIndex.Assets)}
            />
            <DelegationsSection
              walletAddress={accountAddress}
              onViewMore={() => handleOnViewMore(TabIndex.Delegations)}
            />
            <TxsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.txsCount}
              refetchCount={refetchTxsCount}
              onViewMore={() => handleOnViewMore(TabIndex.Txs)}
            />
            <StoredCodesTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.codesCount}
              refetchCount={refetchCodesCount}
              onViewMore={() => handleOnViewMore(TabIndex.Codes)}
            />
            <InstantiatedContractsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsCount}
              refetchCount={refetchContractsCount}
              onViewMore={() => handleOnViewMore(TabIndex.Contracts)}
            />
            <AdminContractsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsAdminCount}
              refetchCount={refetchContractsAdminCount}
              onViewMore={() => handleOnViewMore(TabIndex.Admins)}
            />
            <OpenedProposalsTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.proposalsCount}
              refetchCount={refetchProposalsCount}
              onViewMore={() => handleOnViewMore(TabIndex.Proposals)}
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
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.txsCount}
              refetchCount={refetchTxsCount}
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
      <BackButton />
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
