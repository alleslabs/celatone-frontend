import { TableContainer } from "@chakra-ui/react";

import { useMoveConfig } from "lib/app-provider";
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
  const move = useMoveConfig({ shouldRedirect: false });

  if (isLoading) return <Loading />;
  if (!accounts?.length) return emptyState;

  const templateColumns = move.enabled
    ? "max(160px) max(160px) minmax(200px, 1fr) minmax(250px, 1fr) max(100px)"
    : "max(160px) minmax(200px, 1fr) minmax(250px, 1fr) max(100px)";

  return (
    <TableContainer py={6}>
      <SavedAccountsTableHeader templateColumns={templateColumns} />
      {accounts.map((account) => (
        <SavedAccountsTableRow
          key={account.address}
          accountInfo={account}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
