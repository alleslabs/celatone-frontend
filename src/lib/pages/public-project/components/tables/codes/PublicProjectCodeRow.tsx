import type { Nullish, WasmVerifyInfo } from "lib/types";

import { Grid, HStack, Text } from "@chakra-ui/react";
import {
  useGetAddressTypeByLength,
  useInternalNavigate,
} from "lib/app-provider";
import { InstantiateButton } from "lib/components/button";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { SaveOrRemoveCodeModal } from "lib/components/modal";
import { PermissionChip } from "lib/components/PermissionChip";
import { TableRow } from "lib/components/table";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { getCw2Info, getWasmVerifyStatus } from "lib/utils";

import type { PublicCodeInfo } from ".";

interface CodeTableRowProps {
  publicCodeInfo: PublicCodeInfo;
  templateColumns: string;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const PublicProjectCodeRow = ({
  publicCodeInfo: { localInfo, publicInfo },
  templateColumns,
  wasmVerifyInfo,
}: CodeTableRowProps) => {
  const navigate = useInternalNavigate();
  const getAddressTypeByLength = useGetAddressTypeByLength();
  const goToCodeDetails = () => {
    navigate({
      pathname: `/codes/${publicInfo.id}`,
    });
  };

  const cw2Info = getCw2Info(publicInfo.cw2Contract, publicInfo.cw2Version);

  return (
    <Grid
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      minW="min-content"
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
      onClick={goToCodeDetails}
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
          value={publicInfo.id.toString()}
        />
      </TableRow>
      <TableRow>
        <Text>{publicInfo.name}</Text>
      </TableRow>
      <TableRow>
        <Text
          color={cw2Info ? "text.main" : "text.disabled"}
          whiteSpace="pre-wrap"
          wordBreak="break-all"
        >
          {cw2Info ?? "N/A"}
        </Text>
      </TableRow>
      <TableRow justifyContent="center">
        <Text>{publicInfo.contractCount}</Text>
      </TableRow>
      <TableRow>
        <ExplorerLink
          showCopyOnHover
          type={getAddressTypeByLength(publicInfo.uploader)}
          value={publicInfo.uploader}
        />
      </TableRow>
      <TableRow>
        <PermissionChip
          instantiatePermission={publicInfo.instantiatePermission}
          permissionAddresses={publicInfo.permissionAddresses}
        />
      </TableRow>
      <TableRow px={0}>
        <HStack onClick={(e) => e.stopPropagation()}>
          <InstantiateButton
            codeId={publicInfo.id}
            instantiatePermission={publicInfo.instantiatePermission}
            permissionAddresses={publicInfo.permissionAddresses}
          />
          <SaveOrRemoveCodeModal codeInfo={localInfo} />
        </HStack>
      </TableRow>
    </Grid>
  );
};
