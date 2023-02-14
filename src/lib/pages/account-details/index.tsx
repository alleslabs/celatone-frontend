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

import { BackButton } from "lib/components/button";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state/InvalidState";
import { useValidateAddress } from "lib/hooks";
import type { HumanAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

interface AccountDetailsBodyProps {
  accountAddress: HumanAddr;
}

const InvalidAccount = () => <InvalidState title="Account does not exist" />;

const AccountDetailsBody = ({ accountAddress }: AccountDetailsBodyProps) => {
  const tableHeaderId = "accountDetailsTableHeader";

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
      <Tabs>
        <TabList
          borderBottom="1px solid"
          borderColor="pebble.700"
          id={tableHeaderId}
        >
          <CustomTab>Overall</CustomTab>
          {/* TODO: add counts for Assets */}
          <CustomTab count={0}>Assets</CustomTab>
          {/* TODO: add counts for Txs */}
          <CustomTab count={0}>Transactions</CustomTab>
          {/* TODO: add counts for Contracts */}
          <CustomTab count={0}>Contracts</CustomTab>
          {/* TODO: add counts for Admins */}
          <CustomTab count={0}>Admins</CustomTab>
          {/* TODO: add counts for Codes */}
          <CustomTab count={0}>Codes</CustomTab>
          {/* TODO: add counts for Proposals */}
          <CustomTab count={0}>Proposals</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            {/* TODO: replace with the truncated Assets table */}
            <Text>Assets</Text>
            {/* TODO: replace with the truncated Transactions table */}
            <Text>Transactions</Text>
            {/* TODO: replace with the truncated Contracts table */}
            <Text>Contract Instances</Text>
            {/* TODO: replace with the truncated Codes table */}
            <Text>Stored Codes</Text>
            {/* TODO: replace with the truncated Admins table */}
            <Text>Contract Admin</Text>
            {/* TODO: replace with the truncated Proposals table */}
            <Text>Opened Proposals</Text>
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
            {/* TODO: replace with the full Contracts table */}
            <Text>Contract Instances</Text>
          </TabPanel>
          <TabPanel p={0}>
            {/* TODO: replace with the full Admins table */}
            <Text>Contract Admins</Text>
          </TabPanel>
          <TabPanel p={0}>
            {/* TODO: replace with the full Codes table */}
            <Text>Stored Codes</Text>
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
