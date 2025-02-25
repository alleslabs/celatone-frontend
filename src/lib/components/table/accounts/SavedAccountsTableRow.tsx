import { Grid, IconButton, Text } from "@chakra-ui/react";

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
import { TableRow } from "../tableComponents";

interface SavedAccountsTableRowProps {
  accountInfo: AccountLocalInfo;
  templateColumns: string;
  hasHexAddr: boolean;
}

export const SavedAccountsTableRow = ({
  accountInfo,
  templateColumns,
  hasHexAddr,
}: SavedAccountsTableRowProps) => {
  const navigate = useInternalNavigate();

  const onRowSelect = (address: BechAddr) =>
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
          accountLocalInfo={accountInfo}
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
          accountLocalInfo={accountInfo}
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
