import { Grid, HStack, Text } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { useGetAddressType } from "lib/app-provider";
import { InstantiateButton } from "lib/components/button";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { SaveOrRemoveCodeModal } from "lib/components/modal";
import { PermissionChip } from "lib/components/PermissionChip";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import type { CodeInfo, Nullish, WasmVerifyInfo } from "lib/types";
import { getCw2Info, getWasmVerifyStatus } from "lib/utils";

import { CodeNameCell } from "./CodeNameCell";

interface CodesTableRowProps {
  codeInfo: CodeInfo;
  isReadOnly: boolean;
  onRowSelect: (codeId: number) => void;
  showCw2andContracts: boolean;
  templateColumns: string;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const CodesTableRow = ({
  codeInfo,
  isReadOnly,
  onRowSelect,
  showCw2andContracts,
  templateColumns,
  wasmVerifyInfo,
}: CodesTableRowProps) => {
  const getAddressType = useGetAddressType();
  const cw2Info = getCw2Info(codeInfo.cw2Contract, codeInfo.cw2Version);
  return (
    <Grid
      minW="min-content"
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      onClick={() => onRowSelect(codeInfo.id)}
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
    >
      <TableRow>
        <ExplorerLink
          type="code_id"
          value={codeInfo.id.toString()}
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
        <CodeNameCell isReadOnly={isReadOnly} code={codeInfo} />
      </TableRow>
      {showCw2andContracts && (
        <>
          <TableRow>
            <Text
              color={cw2Info ? "text.main" : "text.disabled"}
              wordBreak="break-all"
            >
              {cw2Info ?? "N/A"}
            </Text>
          </TableRow>
          <TableRow justifyContent="center">
            <Text
              variant="body2"
              color={codeInfo.contractCount ? "text.main" : "text.disabled"}
              cursor="text"
              onClick={(e) => e.stopPropagation()}
            >
              {codeInfo.contractCount ?? "N/A"}
            </Text>
          </TableRow>
        </>
      )}
      <TableRow>
        <ExplorerLink
          isReadOnly={isReadOnly}
          type={getAddressType(codeInfo.uploader)}
          value={codeInfo.uploader}
          showCopyOnHover
        />
      </TableRow>
      <TableRow>
        <PermissionChip
          instantiatePermission={codeInfo.instantiatePermission}
          permissionAddresses={codeInfo.permissionAddresses}
        />
      </TableRow>
      {!isReadOnly && (
        <TableRow px={0}>
          <HStack onClick={(e) => e.stopPropagation()}>
            <InstantiateButton
              codeId={codeInfo.id}
              instantiatePermission={codeInfo.instantiatePermission}
              permissionAddresses={codeInfo.permissionAddresses}
            />
            <SaveOrRemoveCodeModal codeInfo={codeInfo} />
          </HStack>
        </TableRow>
      )}
    </Grid>
  );
};
