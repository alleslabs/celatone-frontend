import { TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import type { AccountLocalInfo } from "lib/stores/account";
import type { Option } from "lib/types";

import { SavedAccountsTableHeader } from "./SavedAccountsTableHeader";
import { SavedAccountsTableRow } from "./SavedAccountsTableRow";

interface SavedAccountsTableProps {
  accounts: Option<AccountLocalInfo[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
}
export const SavedAccountsTable = ({
  accounts,
  isLoading,
  emptyState,
}: SavedAccountsTableProps) => {
  if (isLoading) return <Loading withBorder />;
  if (!accounts?.length) return emptyState;

  const templateColumns =
    "max(160px) minmax(200px, 1fr) minmax(250px, 1fr) max(100px)";

  return (
    <TableContainer>
      <SavedAccountsTableHeader templateColumns={templateColumns} />
      {accounts.map((account) => (
        <SavedAccountsTableRow
          accountInfo={account}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
