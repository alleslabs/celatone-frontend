import { Grid, Box } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";

import { useMobile } from "lib/app-provider";
import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state";
import {
  MobileTableContainer,
  TableContainer,
  TableHeader,
  TableTitle,
  ViewMore,
} from "lib/components/table";
import type { PublicAccount } from "lib/types";

import { PublicProjectAccountMobileCard } from "./PublicProjectAccountMobileCard";
import { PublicProjectAccountRow } from "./PublicProjectAccountRow";

interface PublicProjectAccountTableProps {
  accounts: PublicAccount[];
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

const ContentRender = ({
  filteredAccounts,
  isMobile,
}: {
  filteredAccounts: PublicAccount[];
  isMobile: boolean;
}) =>
  isMobile ? (
    <MobileTableContainer>
      {filteredAccounts.map((account) => (
        <PublicProjectAccountMobileCard
          key={account.address}
          accountInfo={account}
        />
      ))}
    </MobileTableContainer>
  ) : (
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
  );

export const PublicProjectAccountTable = ({
  accounts = [],
  onViewMore,
}: PublicProjectAccountTableProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const isMobile = useMobile();

  const filteredAccounts = useMemo(() => {
    return onViewMore
      ? accounts.slice(0, 5)
      : matchSorter(accounts, searchKeyword, {
          keys: ["name", "address", "description"],
          threshold: matchSorter.rankings.CONTAINS,
        });
  }, [accounts, onViewMore, searchKeyword]);

  return (
    <Box mt={{ base: 8, md: 12 }} mb={4}>
      <TableTitle title="Accounts" count={accounts.length} />
      {!onViewMore && (
        <TextInput
          variant="fixed-floating"
          value={searchKeyword}
          setInputState={setSearchKeyword}
          placeholder="Search with Account Address, Name, or Description"
          size={{ base: "md", md: "lg" }}
          mb={6}
        />
      )}
      {filteredAccounts.length ? (
        <ContentRender
          filteredAccounts={filteredAccounts}
          isMobile={isMobile}
        />
      ) : (
        <EmptyState
          message={
            accounts.length
              ? "No matching account found for this project. Make sure you are searching with Account Address or Account Name"
              : "There is currently no accounts related to this project."
          }
          imageVariant={onViewMore && "empty"}
          withBorder
        />
      )}
      {accounts.length > 5 && onViewMore && <ViewMore onClick={onViewMore} />}
    </Box>
  );
};
