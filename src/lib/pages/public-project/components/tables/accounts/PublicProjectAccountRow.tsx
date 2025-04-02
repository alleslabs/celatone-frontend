import type { PublicAccountInfo } from "lib/types";

import { Grid, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";

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
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      minW="min-content"
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
      onClick={goToDetail}
    >
      <TableRow>
        <ExplorerLink
          showCopyOnHover
          type={
            accountInfo.type === "account" ? "user_address" : "contract_address"
          }
          value={accountInfo.address.toString()}
        />
      </TableRow>
      <TableRow>{accountInfo.name}</TableRow>
      <TableRow>
        <Text color="text.dark" variant="body2" whiteSpace="break-spaces">
          {accountInfo.description || "N/A"}
        </Text>
      </TableRow>
    </Grid>
  );
};
