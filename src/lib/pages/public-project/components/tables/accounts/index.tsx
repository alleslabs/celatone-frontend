import { Box, Grid } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";

import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import {
  MobileTableContainer,
  TableContainer,
  TableHeader,
  TableTitle,
  ViewMore,
} from "lib/components/table";
import type { PublicAccountInfo } from "lib/types";

import { PublicProjectAccountMobileCard } from "./PublicProjectAccountMobileCard";
import { PublicProjectAccountRow } from "./PublicProjectAccountRow";

interface PublicProjectAccountTableProps {
  accounts: PublicAccountInfo[];
  onViewMore?: () => void;
}

const TEMPLATE_COLUMNS = "160px 320px minmax(250px, 1fr)";

const AccountTableHeader = () => (
  <Grid templateColumns={TEMPLATE_COLUMNS} minW="min-content">
    <TableHeader>Address</TableHeader>
    <TableHeader>Account name</TableHeader>
    <TableHeader>Description</TableHeader>
  </Grid>
);

const ContentRender = ({
  filteredAccounts,
  isMobile,
}: {
  filteredAccounts: PublicAccountInfo[];
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
        <InputWithIcon
          placeholder="Search with Account Address, Name, or Description"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          size={{ base: "md", md: "lg" }}
          my={2}
          amptrackSection="public-project-account-search"
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
              ? "No matching accounts found for this project. Make sure you are searching with Account Address or Account Name"
              : "There are currently no accounts related to this project."
          }
          imageVariant={accounts.length ? "not-found" : "empty"}
          withBorder
        />
      )}
      {accounts.length > 5 && onViewMore && <ViewMore onClick={onViewMore} />}
    </Box>
  );
};
