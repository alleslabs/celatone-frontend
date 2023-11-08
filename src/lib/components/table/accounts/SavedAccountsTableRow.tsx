import { Grid, IconButton, Text } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { EditSavedAccountModal } from "lib/components/modal/account/EditSavedAccount";
import { RemoveSavedAccountModal } from "lib/components/modal/account/RemoveSavedAccount";
import type { AccountLocalInfo } from "lib/stores/account";
import type { Addr } from "lib/types";

import { SaveAccountsNameCell } from "./SavedAccountsNameCell";

interface SavedAccountsTableRowProps {
  accountInfo: AccountLocalInfo;
  templateColumns: string;
}

export const SavedAccountsTableRow = ({
  accountInfo,
  templateColumns,
}: SavedAccountsTableRowProps) => {
  const navigate = useInternalNavigate();

  const onRowSelect = (address: Addr) =>
    navigate({
      pathname: "/accounts/[accountAddress]",
      query: { accountAddress: address },
    });
  return (
    <Grid
      templateColumns={templateColumns}
      onClick={() => onRowSelect(accountInfo.address)}
      _hover={{ bg: "gray.900" }}
      transition="all 0.25s ease-in-out"
      cursor="pointer"
      minW="min-content"
    >
      <TableRow>
        <ExplorerLink
          type="user_address"
          value={accountInfo.address}
          showCopyOnHover
        />
      </TableRow>
      <TableRow>
        <SaveAccountsNameCell account={accountInfo} />
      </TableRow>
      <TableRow>
        <Text
          color={accountInfo.description ? "text.dark" : "text.disabled"}
          textOverflow="ellipsis"
          maxW="450px"
          overflow="hidden"
          whiteSpace="nowrap"
        >
          {accountInfo.description ?? "No description"}
        </Text>
      </TableRow>
      <TableRow gap={2} justifyContent="center">
        <EditSavedAccountModal
          account={accountInfo}
          triggerElement={
            <IconButton
              variant="ghost-gray-icon"
              size="sm"
              icon={<CustomIcon name="edit" boxSize={4} />}
              aria-label="edit account"
            />
          }
        />
        <RemoveSavedAccountModal
          account={accountInfo}
          trigger={
            <IconButton
              variant="ghost-gray-icon"
              size="sm"
              icon={<CustomIcon name="delete" boxSize={4} />}
              aria-label="remove account"
            />
          }
        />
      </TableRow>
    </Grid>
  );
};
