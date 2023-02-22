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

import { BackButton } from "lib/components/button";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state/InvalidState";
import { useValidateAddress } from "lib/hooks";
import { useAccountDetailsTableCounts } from "lib/model/account";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { HumanAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import {
  InstantiatedContractTable,
  AdminContractTable,
} from "./components/tables/contracts";

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
    // refetchCodes,
    refetchContractsAdminCount,
    refetchContractsCount,
    // refetchCountTxs,
    // refetchProposalCount,
  } = useAccountDetailsTableCounts(accountAddress);

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
          id={tableHeaderId}
        >
          <CustomTab onClick={() => setTabIndex(TabIndex.Overview)}>
            Overall
          </CustomTab>
          {/* TODO: add counts for Delegations */}
          <CustomTab onClick={() => setTabIndex(TabIndex.Delegations)}>
            Delegations
          </CustomTab>
          {/* TODO: add counts for Assets */}
          <CustomTab count={0} onClick={() => setTabIndex(TabIndex.Assets)}>
            Assets
          </CustomTab>
          <CustomTab
            count={tableCounts.countTxs}
            isDisabled={!tableCounts.countTxs}
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
            count={tableCounts.proposalCount}
            isDisabled={!tableCounts.proposalCount}
            onClick={() => setTabIndex(TabIndex.Proposals)}
          >
            Proposals
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            {/* TODO: replace with the truncated Delegations table */}
            <Text>Delegations</Text>
            {/* TODO: replace with the truncated Assets table */}
            <Text>Assets</Text>
            {/* TODO: replace with the truncated Transactions table */}
            <Text>Transactions</Text>
            {/* TODO: replace with the truncated Codes table */}
            <Text>Stored Codes</Text>
            <InstantiatedContractTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsCount}
              refetchCount={refetchContractsCount}
              onViewMore={() => setTabIndex(TabIndex.Contracts)}
            />
            <AdminContractTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsAdminCount}
              refetchCount={refetchContractsAdminCount}
              onViewMore={() => setTabIndex(TabIndex.Admins)}
            />
            <Text>Contract Admin</Text>
            {/* TODO: replace with the truncated Proposals table */}
            <Text>Opened Proposals</Text>
          </TabPanel>
          <TabPanel p={0}>
            {/* TODO: replace with the full Delegations table */}
            <Text>Delegations</Text>
          </TabPanel>
          <TabPanel p={0}>
            {/* TODO: replace with the full Assets table */}
            <Text>Assets</Text>
          </TabPanel>
          <TabPanel p={0}>
            {/* TODO: replace with the full Transactions table */}
            <Text>Transactions</Text>
          </TabPanel>
          <TabPanel p={0}>
            {/* TODO: replace with the full Codes table */}
            <Text>Stored Codes</Text>
          </TabPanel>
          <TabPanel p={0}>
            <InstantiatedContractTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsCount}
              refetchCount={refetchContractsCount}
            />
          </TabPanel>
          <TabPanel p={0}>
            <AdminContractTable
              walletAddress={accountAddress}
              scrollComponentId={tableHeaderId}
              totalData={tableCounts.contractsAdminCount}
              refetchCount={refetchContractsAdminCount}
            />
          </TabPanel>
          <TabPanel p={0}>
            {/* TODO: replace with the full Proposals table */}
            <Text>Proposals</Text>
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
