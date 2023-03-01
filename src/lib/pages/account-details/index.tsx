import {
  Flex,
  Heading,
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
import { getFirstQueryParam, scrollToTop } from "lib/utils";

import { AssetsSection } from "./components/asset";
import {
  AdminContractsTable,
  InstantiatedContractsTable,
  OpenedProposalsTable,
  StoredCodesTable,
  TxsTable,
} from "./components/tables";

enum TabIndex {
  Overview,
  Delegations,
  Assets,
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
      <Tabs index={tabIndex}>
        <TabList
          borderBottom="1px solid"
          borderColor="pebble.700"
          overflowY="hidden"
          id={tableHeaderId}
        >
          <CustomTab onClick={() => setTabIndex(TabIndex.Overview)}>
            Overall
          </CustomTab>
          {/* TODO: add counts for Delegations */}
          <CustomTab onClick={() => setTabIndex(TabIndex.Delegations)}>
            Delegations
          </CustomTab>
          <CustomTab
            count={tableCounts.assetsCount}
            isDisabled={!tableCounts.assetsCount}
            onClick={() => setTabIndex(TabIndex.Assets)}
          >
            Assets
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
            {/* TODO: replace with the truncated Delegations table */}
            <Text>Delegations</Text>
            <AssetsSection
              walletAddress={accountAddress}
              onViewMore={() => handleOnViewMore(TabIndex.Assets)}
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
            {/* TODO: replace with the full Delegations table */}
            <Text>Delegations</Text>
          </TabPanel>
          <TabPanel p={0}>
            <AssetsSection walletAddress={accountAddress} />
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
  const { validateUserAddress } = useValidateAddress();
  const accountAddressParam = getFirstQueryParam(
    router.query.accountAddress
  ) as HumanAddr;

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_ACCOUNT_DETAIL);
  }, [router.isReady]);

  return (
    <PageContainer>
      <BackButton />
      {validateUserAddress(accountAddressParam) ? (
        <InvalidAccount />
      ) : (
        <AccountDetailsBody accountAddress={accountAddressParam} />
      )}
    </PageContainer>
  );
};

export default AccountDetails;
