import { Box, Grid, GridItem, Text } from "@chakra-ui/react";

import type { CodeInfo } from "lib/types";
import { truncate } from "lib/utils";

const TableHeader = () => {
  return (
    <Grid
      templateColumns="1fr 3fr 1fr 180px"
      borderBottom="1px solid"
      borderBottomColor="divider.main"
      sx={{ "> div": { p: "16px" } }}
    >
      <GridItem>
        <Text variant="body2" fontWeight={700} ml="48px">
          Code ID
        </Text>
      </GridItem>
      <GridItem>
        <Text variant="body2" fontWeight={700}>
          Description
        </Text>
      </GridItem>
      <GridItem textAlign="center">
        <Text variant="body2" fontWeight={700}>
          Contracts
        </Text>
      </GridItem>
      <GridItem>
        <Text variant="body2" fontWeight={700}>
          Uploaders
        </Text>
      </GridItem>
    </Grid>
  );
};

interface TableRowProps {
  onCodeSelect: (newVal: string) => void;
  codeDetail: CodeInfo;
}

const TableRow = ({ onCodeSelect, codeDetail }: TableRowProps) => {
  return (
    <Grid
      templateColumns="1fr 3fr 1fr 180px"
      borderBottom="1px solid"
      borderBottomColor="divider.main"
      cursor="pointer"
      _hover={{ bg: "gray.900", transition: "all .2s" }}
      sx={{ "> div": { p: "16px" } }}
      onClick={() => onCodeSelect(codeDetail.id.toString())}
    >
      <GridItem>
        <Text variant="body2" ml="48px">
          {codeDetail.id}
        </Text>
      </GridItem>
      <GridItem>
        <Text variant="body2">
          {codeDetail?.description ?? "No Description"}
        </Text>
      </GridItem>
      <GridItem textAlign="center">
        <Text variant="body2">{codeDetail.contracts}</Text>
      </GridItem>
      <GridItem>
        <Text variant="body2">{truncate(codeDetail.uploader)}</Text>
      </GridItem>
    </Grid>
  );
};

interface CodeTableProps {
  onCodeSelect: (code: string) => void;
  codes: CodeInfo[];
}

export const CodeTable = ({ onCodeSelect, codes }: CodeTableProps) => {
  return (
    <Box w="full">
      <TableHeader />
      {codes.map((code) => (
        <TableRow key={code.id} codeDetail={code} onCodeSelect={onCodeSelect} />
      ))}
    </Box>
  );
};
