import { Grid, Text } from "@chakra-ui/react";

import { PermissionChip } from "../PermissionChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableContainer, TableHeader, TableRow } from "lib/components/table";
import type { CodeInfo } from "lib/types";
import { getCw2Info } from "lib/utils";

const TEMPLATE_COLUMNS =
  "max(80px) minmax(300px, 1fr) minmax(220px, 1fr) max(120px) max(160px) 150px";

interface CodesReadOnlyTableRowProps {
  codeInfo: CodeInfo;
  onCodeSelect: (newVal: string) => void;
}

const CodesReadOnlyTableRow = ({
  codeInfo,
  onCodeSelect,
}: CodesReadOnlyTableRowProps) => {
  const cw2Info = getCw2Info(codeInfo.cw2Contract, codeInfo.cw2Version);
  return (
    <Grid
      cursor="pointer"
      transition="all .25s ease-in-out"
      _hover={{ bg: "pebble.800" }}
      onClick={() => onCodeSelect(codeInfo.id.toString())}
      templateColumns={TEMPLATE_COLUMNS}
      minW="min-content"
    >
      <TableRow>{codeInfo.id}</TableRow>
      <TableRow>
        <Text
          variant="body2"
          className="ellipsis"
          maxW="300px"
          color="text.dark"
        >
          {codeInfo.name ?? "Untitled Name"}
        </Text>
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
          color={codeInfo.contractCount ? "text.main" : "text.disabled"}
        >
          {codeInfo.contractCount ?? "N/A"}
        </Text>
      </TableRow>
      <TableRow>
        <ExplorerLink
          value={codeInfo.uploader}
          type="user_address"
          isReadOnly
        />
      </TableRow>
      <TableRow>
        <PermissionChip
          instantiatePermission={codeInfo.instantiatePermission}
          permissionAddresses={codeInfo.permissionAddresses}
        />
      </TableRow>
    </Grid>
  );
};

interface CodesReadOnlyTableProps {
  onCodeSelect: (code: string) => void;
  codes: CodeInfo[];
}

export const CodesReadOnlyTable = ({
  onCodeSelect,
  codes,
}: CodesReadOnlyTableProps) => (
  <TableContainer>
    <Grid templateColumns={TEMPLATE_COLUMNS}>
      <TableHeader>Code ID</TableHeader>
      <TableHeader>Code Name</TableHeader>
      <TableHeader>CW2 Info</TableHeader>
      <TableHeader textAlign="center">Contracts</TableHeader>
      <TableHeader>Uploader</TableHeader>
      <TableHeader>Permission</TableHeader>
    </Grid>
    {codes.map((code, index) => (
      <CodesReadOnlyTableRow
        key={code.id + index.toString()}
        codeInfo={code}
        onCodeSelect={onCodeSelect}
      />
    ))}
  </TableContainer>
);
