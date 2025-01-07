import { Grid } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import type {
  BechAddr32,
  ContractInfo,
  Nullish,
  WasmVerifyInfo,
} from "lib/types";
import { getWasmVerifyStatus } from "lib/utils";

import { ContractInstantiatorCell } from "./ContractInstantiatorCell";
import { ContractNameCell } from "./ContractNameCell";
import type { CtaInfo } from "./ContractsTableRowCta";
import { ContractsTableRowCta } from "./ContractsTableRowCta";
import { TagsCell } from "./TagsCell";

interface ContractsTableRowProps {
  contractInfo: ContractInfo;
  isReadOnly: boolean;
  onRowSelect: (contract: BechAddr32) => void;
  showLastUpdate: boolean;
  showTag: boolean;
  templateColumns: string;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
  withCta?: CtaInfo;
}

export const ContractsTableRow = ({
  contractInfo,
  isReadOnly,
  onRowSelect,
  showLastUpdate,
  showTag,
  templateColumns,
  wasmVerifyInfo,
  withCta,
}: ContractsTableRowProps) => (
  <Grid
    minW="min-content"
    _hover={{ bg: "gray.900" }}
    cursor="pointer"
    onClick={() => onRowSelect(contractInfo.contractAddress)}
    templateColumns={templateColumns}
    transition="all 0.25s ease-in-out"
  >
    <TableRow>
      <ExplorerLink
        isReadOnly={isReadOnly}
        type="contract_address"
        value={contractInfo.contractAddress}
        rightIcon={
          contractInfo.codeId ? (
            <WasmVerifyBadge
              status={getWasmVerifyStatus(wasmVerifyInfo)}
              linkedCodeId={contractInfo.codeId}
              relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
            />
          ) : undefined
        }
        showCopyOnHover
      />
    </TableRow>

    <TableRow>
      <ContractNameCell
        isReadOnly={isReadOnly}
        contractLocalInfo={contractInfo}
      />
    </TableRow>

    {showTag && (
      <TableRow>
        <TagsCell isReadOnly={isReadOnly} contractLocalInfo={contractInfo} />
      </TableRow>
    )}

    {showLastUpdate && (
      <TableRow>
        <ContractInstantiatorCell
          isReadOnly={isReadOnly}
          contractInfo={contractInfo}
        />
      </TableRow>
    )}

    {!isReadOnly && (
      <ContractsTableRowCta
        withCta={withCta}
        contractInfo={contractInfo}
        showLastUpdate={showLastUpdate}
      />
    )}
  </Grid>
);
