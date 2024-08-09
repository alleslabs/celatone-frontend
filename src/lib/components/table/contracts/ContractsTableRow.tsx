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
  templateColumns: string;
  onRowSelect: (contract: BechAddr32) => void;
  showTag: boolean;
  showLastUpdate: boolean;
  isReadOnly: boolean;
  withCta?: CtaInfo;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const ContractsTableRow = ({
  contractInfo,
  templateColumns,
  onRowSelect,
  showTag,
  showLastUpdate,
  isReadOnly,
  withCta,
  wasmVerifyInfo,
}: ContractsTableRowProps) => (
  <Grid
    templateColumns={templateColumns}
    onClick={() => onRowSelect(contractInfo.contractAddress)}
    _hover={{ bg: "gray.900" }}
    transition="all 0.25s ease-in-out"
    cursor="pointer"
    minW="min-content"
  >
    <TableRow>
      <ExplorerLink
        value={contractInfo.contractAddress}
        type="contract_address"
        rightIcon={
          contractInfo.codeId ? (
            <WasmVerifyBadge
              status={getWasmVerifyStatus(wasmVerifyInfo)}
              relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
              linkedCodeId={contractInfo.codeId}
            />
          ) : undefined
        }
        showCopyOnHover
        isReadOnly={isReadOnly}
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
        withCta={withCta}
        showLastUpdate={showLastUpdate}
      />
    )}
  </Grid>
);
