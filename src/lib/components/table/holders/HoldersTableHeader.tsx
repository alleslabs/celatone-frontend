import type { GridProps } from "@chakra-ui/react";

import { chakra, Grid } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

import { TableHeader } from "../tableComponents";

const SortIcon = ({ isReversed }: { isReversed: boolean }) => (
  <CustomIcon
    boxSize="14px"
    color="gray.600"
    name={isReversed ? "arrow-up" : "arrow-down"}
  />
);

const StyledTableHeader = chakra(TableHeader, {
  baseStyle: {
    _hover: { bgColor: "gray.800", borderRadius: "4px" },
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    gap: 1,
    transition: "all 0.25s ease-in-out",
  },
});

export const HoldersTableHeader = ({
  isReversed,
  onToggleSort,
  templateColumns,
}: {
  isReversed: boolean;
  onToggleSort: () => void;
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader textAlign="center">Rank</TableHeader>
    <StyledTableHeader onClick={onToggleSort}>
      Holder Address
      <SortIcon isReversed={isReversed} />
    </StyledTableHeader>
    <TableHeader textAlign="right">Quantity</TableHeader>
  </Grid>
);
