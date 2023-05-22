import { Text, Grid, HStack } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { InstantiateButton } from "lib/components/button";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { SaveOrRemoveCodeModal } from "lib/components/modal";
import { PermissionChip } from "lib/components/PermissionChip";
import type { CodeInfo } from "lib/types";
import { getCw2Info } from "lib/utils";

import { CodeNameCell } from "./CodeNameCell";

interface CodesTableRowProps {
  codeInfo: CodeInfo;
  templateColumns: string;
  onRowSelect: (codeId: number) => void;
  isReadOnly: boolean;
}

export const CodesTableRow = ({
  codeInfo,
  templateColumns,
  onRowSelect,
  isReadOnly,
}: CodesTableRowProps) => {
  const cw2Info = getCw2Info(codeInfo.cw2Contract, codeInfo.cw2Version);
  return (
    <Grid
      templateColumns={templateColumns}
      onClick={() => onRowSelect(codeInfo.id)}
      _hover={{ bg: "gray.900" }}
      transition="all .25s ease-in-out"
      cursor="pointer"
      minW="min-content"
    >
      <TableRow>
        <ExplorerLink
          type="code_id"
          value={codeInfo.id.toString()}
          showCopyOnHover
        />
      </TableRow>
      <TableRow>
        <CodeNameCell code={codeInfo} isReadOnly={isReadOnly} />
      </TableRow>
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
          onClick={(e) => e.stopPropagation()}
          cursor="text"
          color={codeInfo.contractCount ? "text.main" : "text.disabled"}
        >
          {codeInfo.contractCount ?? "N/A"}
        </Text>
      </TableRow>
      <TableRow>
        <ExplorerLink
          value={codeInfo.uploader}
          type="user_address"
          showCopyOnHover
          isReadOnly={isReadOnly}
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
              instantiatePermission={codeInfo.instantiatePermission}
              permissionAddresses={codeInfo.permissionAddresses}
              codeId={codeInfo.id}
            />
            <SaveOrRemoveCodeModal codeInfo={codeInfo} />
          </HStack>
        </TableRow>
      )}
    </Grid>
  );
};
