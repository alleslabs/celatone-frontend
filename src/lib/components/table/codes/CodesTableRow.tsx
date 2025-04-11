import type { CodeInfo, Nullish, WasmVerifyInfo } from "lib/types";

import { Grid, HStack, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { InstantiateButton } from "lib/components/button";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { SaveOrRemoveCodeModal } from "lib/components/modal";
import { PermissionChip } from "lib/components/PermissionChip";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { getCw2Info, getWasmVerifyStatus } from "lib/utils";

import { TableRow } from "../tableComponents";
import { CodeNameCell } from "./CodeNameCell";

interface CodesTableRowProps {
  codeInfo: CodeInfo;
  templateColumns: string;
  onRowSelect: (codeId: number) => void;
  isReadOnly: boolean;
  showCw2andContracts: boolean;
  disablePermission: boolean;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const CodesTableRow = ({
  codeInfo,
  templateColumns,
  onRowSelect,
  isReadOnly,
  showCw2andContracts,
  disablePermission,
  wasmVerifyInfo,
}: CodesTableRowProps) => {
  const getAddressType = useGetAddressType();
  const cw2Info = getCw2Info(codeInfo.cw2Contract, codeInfo.cw2Version);
  return (
    <Grid
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      minW="min-content"
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
      onClick={() => onRowSelect(codeInfo.id)}
    >
      <TableRow>
        <ExplorerLink
          rightIcon={
            <WasmVerifyBadge
              relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
              status={getWasmVerifyStatus(wasmVerifyInfo)}
            />
          }
          showCopyOnHover
          type="code_id"
          value={codeInfo.id.toString()}
        />
      </TableRow>
      <TableRow>
        <CodeNameCell code={codeInfo} isReadOnly={isReadOnly} />
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
              color={codeInfo.contractCount ? "text.main" : "text.disabled"}
              cursor="text"
              variant="body2"
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
          showCopyOnHover
          type={getAddressType(codeInfo.uploader)}
          value={codeInfo.uploader}
        />
      </TableRow>
      {!disablePermission && (
        <>
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
        </>
      )}
    </Grid>
  );
};
