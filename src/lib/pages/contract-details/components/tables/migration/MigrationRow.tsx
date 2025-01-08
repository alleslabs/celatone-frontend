import type { GridProps } from "@chakra-ui/react";
import { Flex, Grid, Text } from "@chakra-ui/react";

import { useGetAddressType, useTierConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CodeNameCell, RemarkRender, TableRow } from "lib/components/table";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import type {
  BechAddr,
  ContractMigrationHistory,
  Nullish,
  WasmVerifyInfo,
} from "lib/types";
import {
  dateFromNow,
  formatUTC,
  getCw2Info,
  getWasmVerifyStatus,
} from "lib/utils";

interface MigrationRowProps {
  templateColumns: GridProps["templateColumns"];
  history: ContractMigrationHistory;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const MigrationRow = ({
  templateColumns,
  history,
  wasmVerifyInfo,
}: MigrationRowProps) => {
  const { isFullTier } = useTierConfig();
  const getAddressType = useGetAddressType();
  const cw2Info = getCw2Info(history.cw2Contract, history.cw2Version);

  return (
    <Grid templateColumns={templateColumns}>
      <TableRow>
        <ExplorerLink
          type="code_id"
          value={history.codeId.toString()}
          rightIcon={
            <WasmVerifyBadge
              status={getWasmVerifyStatus(wasmVerifyInfo)}
              relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
            />
          }
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
      {isFullTier && (
        <>
          <TableRow>
            {history.timestamp ? (
              <Flex
                direction="column"
                fontSize="12px"
                sx={{ "& p + p": { color: "text.dark", mt: "2px" } }}
              >
                <p>{formatUTC(history.timestamp)}</p>
                <p>({dateFromNow(history.timestamp)})</p>
              </Flex>
            ) : (
              "N/A"
            )}
          </TableRow>
          <TableRow>
            {history.remark ? <RemarkRender {...history.remark} /> : "N/A"}
          </TableRow>
        </>
      )}
    </Grid>
  );
};
