import type { AccountLocalInfo } from "lib/stores/account";
import type { Option } from "lib/types";

import { TableContainer } from "@chakra-ui/react";
import { useEvmConfig, useMoveConfig } from "lib/app-provider";
import { Loading } from "lib/components/Loading";

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
  const evm = useEvmConfig({ shouldRedirect: false });

  if (isLoading) return <Loading />;
  if (!accounts?.length) return emptyState;

  const hasHexAddr = move.enabled || evm.enabled;
  const templateColumns = hasHexAddr
    ? "max(160px) max(160px) minmax(200px, 1fr) minmax(250px, 1fr) max(100px)"
    : "max(160px) minmax(200px, 1fr) minmax(250px, 1fr) max(100px)";

  return (
    <TableContainer py={6}>
      <SavedAccountsTableHeader
        hasHexAddr={hasHexAddr}
        templateColumns={templateColumns}
      />
      {accounts.map((account) => (
        <SavedAccountsTableRow
          key={account.address}
          accountInfo={account}
          hasHexAddr={hasHexAddr}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
