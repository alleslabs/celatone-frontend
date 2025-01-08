import { Grid, IconButton, Text } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import {
  EditSavedAccountModal,
  RemoveSavedAccountModal,
} from "lib/components/modal";
import type { AccountLocalInfo } from "lib/stores/account";
import type { BechAddr } from "lib/types";
import { bech32AddressToHex, unpadHexAddress } from "lib/utils";

import { AccountNameCell } from "./AccountNameCell";

interface SavedAccountsTableRowProps {
  accountInfo: AccountLocalInfo;
  hasHexAddr: boolean;
  templateColumns: string;
}

export const SavedAccountsTableRow = ({
  accountInfo,
  hasHexAddr,
  templateColumns,
}: SavedAccountsTableRowProps) => {
  const navigate = useInternalNavigate();

  const onRowSelect = (address: BechAddr) =>
    navigate({
      pathname: "/accounts/[accountAddress]",
      query: { accountAddress: address },
    });

  return (
    <Grid
      minW="min-content"
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      onClick={() => onRowSelect(accountInfo.address)}
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
    >
      <TableRow>
        <ExplorerLink
          type="user_address"
          value={accountInfo.address}
          showCopyOnHover
        />
      </TableRow>
      {hasHexAddr && (
        <TableRow>
          <ExplorerLink
            type="user_address"
            value={unpadHexAddress(bech32AddressToHex(accountInfo.address))}
            showCopyOnHover
          />
        </TableRow>
      )}
      <TableRow>
        <AccountNameCell accountLocalInfo={accountInfo} />
      </TableRow>
      <TableRow>
        <Text
          maxW="450px"
          whiteSpace="nowrap"
          color={accountInfo.description ? "text.dark" : "text.disabled"}
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {accountInfo.description ?? "No description"}
        </Text>
      </TableRow>
      <TableRow gap={2} justifyContent="center">
        <EditSavedAccountModal
          triggerElement={
            <IconButton
              aria-label="edit account"
              size="sm"
              variant="ghost-gray-icon"
              icon={<CustomIcon name="edit" boxSize={4} />}
            />
          }
          accountLocalInfo={accountInfo}
        />
        <RemoveSavedAccountModal
          trigger={
            <IconButton
              aria-label="remove account"
              size="sm"
              variant="ghost-gray-icon"
              icon={<CustomIcon name="delete" boxSize={4} />}
            />
          }
          accountLocalInfo={accountInfo}
        />
      </TableRow>
    </Grid>
  );
};
