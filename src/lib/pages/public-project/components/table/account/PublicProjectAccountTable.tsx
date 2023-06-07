import { TableContainer, Grid, Box, Flex } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";

import { useMobile } from "lib/app-provider";
import { AccountCard } from "lib/components/card/AccountCard";
import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state";
import { TableHeader, TableTitle, ViewMore } from "lib/components/table";
import type { Account } from "lib/types";

import { PublicProjectAccountRow } from "./PublicProjectAccountRow";

interface PublicProjectAccountTableProps {
  accounts: Account[];
  onViewMore?: () => void;
}

const TEMPLATE_COLUMNS = "160px 320px minmax(250px, 1fr)";

const AccountTableHeader = () => (
  <Grid templateColumns={TEMPLATE_COLUMNS} minW="min-content">
    <TableHeader>Address</TableHeader>
    <TableHeader>Account Name</TableHeader>
    <TableHeader>Description</TableHeader>
  </Grid>
);

export const PublicProjectAccountTable = ({
  accounts = [],
  onViewMore,
}: PublicProjectAccountTableProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const filteredAccounts = useMemo(() => {
    return onViewMore
      ? accounts.slice(0, 5)
      : matchSorter(accounts, searchKeyword, {
          keys: ["name", "address", "description"],
          threshold: matchSorter.rankings.CONTAINS,
        });
  }, [accounts, onViewMore, searchKeyword]);

  const isMobile = useMobile();
  if (!filteredAccounts.length)
    return (
      <>
        <TableTitle title="Accounts" count={accounts.length} />
        <EmptyState
          message="There is currently no accounts related to this project."
          imageVariant={onViewMore && "empty"}
          withBorder
        />
      </>
    );
  return (
    <Box mt={{ base: 8, md: 12 }} mb={4}>
      <TableTitle title="Accounts" count={accounts.length} />
      {!onViewMore && (
        <TextInput
          variant="floating"
          value={searchKeyword}
          setInputState={setSearchKeyword}
          placeholder="Search with account address, name or description"
          size="lg"
          mb={6}
        />
      )}
      {isMobile ? (
        <Flex direction="column" gap={4} w="full" mt={4}>
          {filteredAccounts.map((account) => (
            <AccountCard key={account.address} accountInfo={account} />
          ))}
        </Flex>
      ) : (
        <>
          <TableContainer mb={4}>
            <AccountTableHeader />
            {filteredAccounts.map((account) => (
              <PublicProjectAccountRow
                key={account.address}
                accountInfo={account}
                templateColumns={TEMPLATE_COLUMNS}
              />
            ))}
          </TableContainer>
          {accounts.length > 5 && onViewMore && (
            <ViewMore onClick={onViewMore} />
          )}
        </>
      )}
    </Box>
  );
};
