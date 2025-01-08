import { Grid, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import type { PublicAccountInfo } from "lib/types";

import { getNavigationArgs } from "./utils";

interface AccountTableRowProps {
  accountInfo: PublicAccountInfo;
  templateColumns: string;
}

export const PublicProjectAccountRow = ({
  accountInfo,
  templateColumns,
}: AccountTableRowProps) => {
  const navigate = useInternalNavigate();
  const goToDetail = () => {
    navigate(getNavigationArgs(accountInfo));
  };

  return (
    <Grid
      minW="min-content"
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      onClick={goToDetail}
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
    >
      <TableRow>
        <ExplorerLink
          type={
            accountInfo.type === "account" ? "user_address" : "contract_address"
          }
          value={accountInfo.address.toString()}
          showCopyOnHover
        />
      </TableRow>
      <TableRow>{accountInfo.name}</TableRow>
      <TableRow>
        <Text variant="body2" whiteSpace="break-spaces" color="text.dark">
          {accountInfo.description || "N/A"}
        </Text>
      </TableRow>
    </Grid>
  );
};
