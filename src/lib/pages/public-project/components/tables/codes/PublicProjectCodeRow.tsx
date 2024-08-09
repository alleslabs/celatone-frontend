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
import type { Nullish, WasmVerifyInfo } from "lib/types";
import { getCw2Info, getWasmVerifyStatus } from "lib/utils";

import type { PublicCodeInfo } from ".";

interface CodeTableRowProps {
  templateColumns: string;
  publicCodeInfo: PublicCodeInfo;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const PublicProjectCodeRow = ({
  templateColumns,
  publicCodeInfo: { publicInfo, localInfo },
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
      templateColumns={templateColumns}
      onClick={goToCodeDetails}
      _hover={{ bg: "gray.900" }}
      transition="all 0.25s ease-in-out"
      cursor="pointer"
      minW="min-content"
    >
      <TableRow>
        <ExplorerLink
          value={publicInfo.id.toString()}
          type="code_id"
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
        <Text>{publicInfo.name}</Text>
      </TableRow>
      <TableRow>
        <Text
          color={cw2Info ? "text.main" : "text.disabled"}
          wordBreak="break-all"
          whiteSpace="pre-wrap"
        >
          {cw2Info ?? "N/A"}
        </Text>
      </TableRow>
      <TableRow justifyContent="center">
        <Text>{publicInfo.contractCount}</Text>
      </TableRow>
      <TableRow>
        <ExplorerLink
          value={publicInfo.uploader}
          type={getAddressTypeByLength(publicInfo.uploader)}
          showCopyOnHover
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
            instantiatePermission={publicInfo.instantiatePermission}
            permissionAddresses={publicInfo.permissionAddresses}
            codeId={publicInfo.id}
          />
          <SaveOrRemoveCodeModal codeInfo={localInfo} />
        </HStack>
      </TableRow>
    </Grid>
  );
};
