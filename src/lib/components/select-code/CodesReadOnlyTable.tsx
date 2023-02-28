import { Grid, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableContainer, TableHeader, TableRow } from "lib/components/table";
import type { CodeInfo } from "lib/types";

const TEMPLATE_COLUMNS = "48px 1fr 4fr 1fr 2fr 48px";

interface CodesReadOnlyTableRowProps {
  codeInfo: CodeInfo;
  onCodeSelect: (newVal: string) => void;
}

const CodesReadOnlyTableRow = ({
  codeInfo,
  onCodeSelect,
}: CodesReadOnlyTableRowProps) => (
  <Grid
    cursor="pointer"
    transition="all .25s ease-in-out"
    _hover={{ bg: "pebble.800" }}
    onClick={() => onCodeSelect(codeInfo.id.toString())}
    templateColumns={TEMPLATE_COLUMNS}
  >
    <TableHeader />
    <TableRow>{codeInfo.id}</TableRow>
    <TableRow>
      <Text variant="body2" className="ellipsis" maxW="300px" color="text.dark">
        {codeInfo.name ?? "Untitled Name"}
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
      <ExplorerLink value={codeInfo.uploader} type="user_address" isReadOnly />
    </TableRow>
    <TableHeader />
  </Grid>
);

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
      <TableHeader />
      <TableHeader>Code ID</TableHeader>
      <TableHeader>Code Name</TableHeader>
      <TableHeader textAlign="center">Contracts</TableHeader>
      <TableHeader>Uploader</TableHeader>
      <TableHeader />
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
