import { Badge, Text, Flex, Heading } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { AccountZeroState, EmptyState } from "lib/components/state";
import { SavedAccountsTable } from "lib/components/table/accounts/SavedAccountsTable";
import { useAccountStore } from "lib/providers/store";

import { SaveAccountButton } from "./components/SaveAccountButton";

const SavedAccounts = observer(() => {
  const { getSavedAccounts, isHydrated } = useAccountStore();
  const savedAccounts = getSavedAccounts();
  const accountsCount = savedAccounts.length;

  const [keyword, setKeyword] = useState("");

  const isSearching = !!keyword;

  const filteredsavedAccounts = useMemo(() => {
    if (!keyword) return savedAccounts;
    return savedAccounts.filter(
      (account) =>
        account.address.includes(keyword.toLowerCase()) ||
        account.name?.toLowerCase().includes(keyword.toLowerCase()) ||
        account.description?.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, savedAccounts]);

  return (
    <PageContainer>
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Flex direction="column">
          <Flex alignItems="center">
            <Heading
              variant="h5"
              as="h5"
              minH="36px"
              display="flex"
              alignItems="center"
            >
              Saved Accounts
            </Heading>
            <Badge variant="primary" ml={2}>
              {accountsCount}
            </Badge>
          </Flex>
          <Text>Your saved accounts will be stored locally</Text>
        </Flex>
        <SaveAccountButton />
      </Flex>
      <InputWithIcon
        placeholder="Search with account name, address, or description ..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        size="lg"
      />

      <SavedAccountsTable
        accounts={filteredsavedAccounts}
        isLoading={!isHydrated}
        emptyState={
          isSearching ? (
            <EmptyState
              imageVariant="not-found"
              message="No accounts match found. Make sure you are searching with account address, name, or description."
              withBorder
            />
          ) : (
            <AccountZeroState />
          )
        }
      />
    </PageContainer>
  );
});

export default SavedAccounts;
