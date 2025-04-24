import type {
  BechAddr32,
  ContractInfo,
  Nullish,
  WasmVerifyInfo,
} from "lib/types";

import { Grid } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { getWasmVerifyStatus } from "lib/utils";

import type { CtaInfo } from "./ContractsTableRowCta";

import { TableRow } from "../tableComponents";
import { ContractInstantiatorCell } from "./ContractInstantiatorCell";
import { ContractNameCell } from "./ContractNameCell";
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
    _hover={{ bg: "gray.900" }}
    cursor="pointer"
    minW="min-content"
    templateColumns={templateColumns}
    transition="all 0.25s ease-in-out"
    onClick={() => onRowSelect(contractInfo.contractAddress)}
  >
    <TableRow>
      <ExplorerLink
        isReadOnly={isReadOnly}
        rightIcon={
          contractInfo.codeId ? (
            <WasmVerifyBadge
              linkedCodeId={contractInfo.codeId}
              relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
              status={getWasmVerifyStatus(wasmVerifyInfo)}
            />
          ) : undefined
        }
        showCopyOnHover
        type="contract_address"
        value={contractInfo.contractAddress}
      />
    </TableRow>

    <TableRow>
      <ContractNameCell
        contractLocalInfo={contractInfo}
        isReadOnly={isReadOnly}
      />
    </TableRow>

    {showTag && (
      <TableRow>
        <TagsCell contractLocalInfo={contractInfo} isReadOnly={isReadOnly} />
      </TableRow>
    )}

    {showLastUpdate && (
      <TableRow>
        <ContractInstantiatorCell
          contractInfo={contractInfo}
          isReadOnly={isReadOnly}
        />
      </TableRow>
    )}

    {!isReadOnly && (
      <ContractsTableRowCta
        contractInfo={contractInfo}
        showLastUpdate={showLastUpdate}
        withCta={withCta}
      />
    )}
  </Grid>
);
