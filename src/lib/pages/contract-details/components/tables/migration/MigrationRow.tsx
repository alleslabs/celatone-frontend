import type { GridProps } from "@chakra-ui/react";
import { Flex, Grid, Text } from "@chakra-ui/react";

import { useGetAddressType, useTierConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CodeNameCell, RemarkRender, TableRow } from "lib/components/table";
import type { BechAddr, ContractMigrationHistory } from "lib/types";
import { dateFromNow, formatUTC, getCw2Info } from "lib/utils";

interface MigrationRowProps {
  templateColumns: GridProps["templateColumns"];
  history: ContractMigrationHistory;
}

export const MigrationRow = ({
  templateColumns,
  history,
}: MigrationRowProps) => {
  const isFullTier = useTierConfig() === "full";
  const getAddressType = useGetAddressType();
  const cw2Info = getCw2Info(history.cw2Contract, history.cw2Version);

  return (
    <Grid templateColumns={templateColumns}>
      <TableRow>
        <ExplorerLink
          type="code_id"
          value={history.codeId.toString()}
          showCopyOnHover
        />
      </TableRow>
      <TableRow>
        <CodeNameCell
          code={{
            id: history.codeId,
            // TODO: fix by handle uploader undefined
            uploader: history.uploader ?? ("" as BechAddr),
            name: history.codeName,
          }}
        />
      </TableRow>
      {isFullTier && (
        <>
          <TableRow>
            <Text
              color={cw2Info ? "text.main" : "text.disabled"}
              wordBreak="break-all"
            >
              {cw2Info ?? "N/A"}
            </Text>
          </TableRow>
          <TableRow>
            {history.sender ? (
              <ExplorerLink
                type={getAddressType(history.sender)}
                value={history.sender}
                textFormat="truncate"
                showCopyOnHover
              />
            ) : (
              "N/A"
            )}
          </TableRow>
        </>
      )}
      <TableRow>
        {history.height ? (
          <ExplorerLink
            value={history.height.toString()}
            type="block_height"
            showCopyOnHover
          />
        ) : (
          "N/A"
        )}
      </TableRow>
      {isFullTier && history.timestamp && history.remark && (
        <>
          <TableRow>
            <Flex
              direction="column"
              fontSize="12px"
              sx={{ "& p + p": { color: "text.dark", mt: "2px" } }}
            >
              <p>{formatUTC(history.timestamp)}</p>
              <p>({dateFromNow(history.timestamp)})</p>
            </Flex>
          </TableRow>
          <TableRow>
            <RemarkRender {...history.remark} />
          </TableRow>
        </>
      )}
    </Grid>
  );
};
