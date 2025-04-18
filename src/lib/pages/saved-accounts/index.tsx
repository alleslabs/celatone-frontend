import { Badge, Flex, Heading, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useMoveConfig } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { AccountZeroState, EmptyState } from "lib/components/state";
import { SavedAccountsTable } from "lib/components/table";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useAccountStore } from "lib/providers/store";

import { SaveAccountButton } from "./components";

const SavedAccounts = observer(() => {
  const router = useRouter();
  const move = useMoveConfig({ shouldRedirect: false });
  const formatAddresses = useFormatAddresses();

  const { getSavedAccounts, isHydrated } = useAccountStore();
  const savedAccounts = getSavedAccounts();
  const accountsCount = savedAccounts.length;

  const [keyword, setKeyword] = useState("");

  const filteredsavedAccounts = useMemo(() => {
    if (!keyword) return savedAccounts;
    return savedAccounts.filter(
      (account) =>
        account.address.includes(keyword.toLowerCase()) ||
        (move.enabled &&
          formatAddresses(account.address).hex.includes(
            keyword.toLowerCase()
          )) ||
        account.name?.toLowerCase().includes(keyword.toLowerCase()) ||
        account.description?.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [formatAddresses, keyword, move.enabled, savedAccounts]);

  useEffect(() => {
    if (router.isReady && isHydrated)
      track(AmpEvent.TO_MY_SAVED_ACCOUNTS, { accountsCount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Saved accounts" />
      <Flex alignItems="center" justifyContent="space-between" mb={8}>
        <Flex direction="column">
          <Flex alignItems="center">
            <Heading
              variant="h5"
              as="h5"
              minH="36px"
              display="flex"
              alignItems="center"
            >
              Saved accounts
            </Heading>
            <Badge variant="primary" ml={2}>
              {accountsCount}
            </Badge>
          </Flex>
          <Text variant="body2" color="text.dark">
            Your saved accounts will be stored locally
          </Text>
        </Flex>
        <SaveAccountButton />
      </Flex>
      <InputWithIcon
        placeholder="Search with account name, address, or description"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        size="lg"
        amptrackSection="saved-account-search"
      />
      {savedAccounts.length ? (
        <SavedAccountsTable
          accounts={filteredsavedAccounts}
          isLoading={!isHydrated}
          emptyState={
            <EmptyState
              imageVariant="not-found"
              message="No matching accounts found. Make sure you are searching with account address, name, or description."
              withBorder
            />
          }
        />
      ) : (
        <AccountZeroState button={<SaveAccountButton />} />
      )}
      {/* <UserDocsLink
        title="How to organize and save accounts?"
        cta="Read more about Saved Accounts"
        href={`${move.enabled ? "move" : "cosmwasm"}/account/organize#saving-accounts-for-later-use`}
      /> */}
    </PageContainer>
  );
});

export default SavedAccounts;
