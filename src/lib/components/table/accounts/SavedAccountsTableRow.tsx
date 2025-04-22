import type { AccountLocalInfo } from "lib/stores/account";
import type { BechAddr } from "lib/types";

import { Grid, IconButton, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import {
  EditSavedAccountModal,
  RemoveSavedAccountModal,
} from "lib/components/modal";
import { bech32AddressToHex, unpadHexAddress } from "lib/utils";

import { TableRow } from "../tableComponents";
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
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      minW="min-content"
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
      onClick={() => onRowSelect(accountInfo.address)}
    >
      <TableRow>
        <ExplorerLink
          showCopyOnHover
          type="user_address"
          value={accountInfo.address}
        />
      </TableRow>
      {hasHexAddr && (
        <TableRow>
          <ExplorerLink
            showCopyOnHover
            type="user_address"
            value={unpadHexAddress(bech32AddressToHex(accountInfo.address))}
          />
        </TableRow>
      )}
      <TableRow>
        <AccountNameCell accountLocalInfo={accountInfo} />
      </TableRow>
      <TableRow>
        <Text
          color={accountInfo.description ? "text.dark" : "text.disabled"}
          maxW="450px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {accountInfo.description ?? "No description"}
        </Text>
      </TableRow>
      <TableRow gap={2} justifyContent="center">
        <EditSavedAccountModal
          accountLocalInfo={accountInfo}
          triggerElement={
            <IconButton
              aria-label="edit account"
              icon={<CustomIcon boxSize={4} name="edit" />}
              size="sm"
              variant="ghost-gray-icon"
            />
          }
        />
        <RemoveSavedAccountModal
          accountLocalInfo={accountInfo}
          trigger={
            <IconButton
              aria-label="remove account"
              icon={<CustomIcon boxSize={4} name="delete" />}
              size="sm"
              variant="ghost-gray-icon"
            />
          }
        />
      </TableRow>
    </Grid>
  );
};
