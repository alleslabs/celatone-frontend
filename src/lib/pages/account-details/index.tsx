import { Flex, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useMobile, useValidateAddress } from "lib/app-provider";
import { BackButton } from "lib/components/button";
import { CustomTab } from "lib/components/CustomTab";
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
import { getFirstQueryParam, scrollToTop } from "lib/utils";

import { AccountTop } from "./components/AccountTop";
import { AssetsSection } from "./components/asset";
import { DelegationsSection } from "./components/delegations";
import {
  AdminContractsTable,
  InstantiatedContractsTable,
  OpenedProposalsTable,
  StoredCodesTable,
  TxsTable,
} from "./components/tables";
import { TotalAccountValue } from "./components/TotalAccountValue";

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

  const handleTabChange = (tab: TabIndex) => {
    AmpTrackUseTab(TabIndex[tab]);
    setTabIndex(tab);
    scrollToTop();
  };

  const displayName = publicInfo?.name ?? "Account Details";

  return (
    <>
      <AccountTop
        accountAddress={accountAddress}
        publicDetail={publicDetail}
        displayName={displayName}
        publicInfo={publicInfo}
      />
      <Tabs index={tabIndex}>
        <TabList
          borderBottom="1px solid"
          borderColor="gray.700"
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
            <TotalAccountValue accountAddress={accountAddress} />
            <Flex
              borderBottom={{ base: "0px", md: "1px solid" }}
              borderBottomColor={{ base: "transparent", md: "gray.700" }}
            >
              <AssetsSection
                walletAddress={accountAddress}
                onViewMore={() => handleTabChange(TabIndex.Assets)}
              />
            </Flex>
            <Flex
              borderBottom={{ base: "0px", md: "1px solid" }}
              borderBottomColor={{ base: "transparent", md: "gray.700" }}
            >
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
  const isMobile = useMobile();
  return (
    <PageContainer>
      {!isMobile && <BackButton />}
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
