import { Grid, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableContainer, TableHeader, TableRow } from "lib/components/table";
import type { CodeInfo } from "lib/types";

const TEMPLATE_COLUMNS = "48px 1fr 4fr 1fr 2fr 48px";

interface TableRowProps {
  onCodeSelect: (newVal: string) => void;
  codeDetail: CodeInfo;
}

const CodeTableRow = ({ onCodeSelect, codeDetail }: TableRowProps) => {
  return (
    <Grid
      cursor="pointer"
      transition="all .25s ease-in-out"
      _hover={{ bg: "pebble.800" }}
      onClick={() => onCodeSelect(codeDetail.id.toString())}
      templateColumns={TEMPLATE_COLUMNS}
    >
      <TableHeader />
      <TableRow>{codeDetail.id}</TableRow>
      <TableRow>
        <Text
          variant="body2"
          className="ellipsis"
          maxW="300px"
          color="text.dark"
        >
          {codeDetail?.description ?? "No Description"}
        </Text>
      </TableRow>
      <TableRow justifyContent="center">
        <Text
          variant="body2"
          color={codeDetail.contracts > 0 ? "text.main" : "text.disabled"}
        >
          {codeDetail.contracts}
        </Text>
      </TableRow>
      <TableRow>
        <ExplorerLink
          value={codeDetail.uploader}
          type="user_address"
          isReadOnly
        />
      </TableRow>
      <TableHeader />
    </Grid>
  );
};

interface CodeTableReadOnlyProps {
  onCodeSelect: (code: string) => void;
  codes: CodeInfo[];
}

export const CodeTableReadOnly = ({
  onCodeSelect,
  codes,
}: CodeTableReadOnlyProps) => {
  return (
    <TableContainer>
      <Grid templateColumns={TEMPLATE_COLUMNS}>
        <TableHeader />
        <TableHeader>Code ID</TableHeader>
        <TableHeader>Description</TableHeader>
        <TableHeader textAlign="center">Contracts</TableHeader>
        <TableHeader>Uploader</TableHeader>
        <TableHeader />
      </Grid>
      {codes.map((code, index) => (
        <CodeTableRow
          key={code.id + index.toString()}
          codeDetail={code}
          onCodeSelect={onCodeSelect}
        />
      ))}
    </TableContainer>
  );
};
